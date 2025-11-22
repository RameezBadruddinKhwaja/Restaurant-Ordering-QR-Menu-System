import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { generateUniqueSlug } from '../utils/slugify';

// Categories
export const getCategoriesByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    const categories = await prisma.category.findMany({
      where: {
        restaurantId,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          where: { isActive: true, isAvailable: true },
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            images: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId, ...data } = req.body;
    const userId = req.user!.userId;

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to add categories to this restaurant');
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        restaurantId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user!.userId;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to update this category');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to delete this category');
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Menu Items
export const getMenuItemsByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const { categoryId, search, vegetarian, vegan, featured } = req.query;

    const where: any = {
      restaurantId,
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (vegetarian === 'true') {
      where.isVegetarian = true;
    }

    if (vegan === 'true') {
      where.isVegan = true;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variations: {
          where: { isActive: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        variations: {
          where: { isActive: true },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    // Increment views
    await prisma.menuItem.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId, categoryId, ...data } = req.body;
    const userId = req.user!.userId;

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to add items to this restaurant');
    }

    // Verify category belongs to restaurant
    const category = await prisma.category.findFirst({
      where: { id: categoryId, restaurantId },
    });

    if (!category) {
      throw new NotFoundError('Category not found for this restaurant');
    }

    // Generate slug
    const slug = await generateUniqueSlug(data.name, async (s) => {
      const existing = await prisma.menuItem.findFirst({
        where: { slug: s, restaurantId },
      });
      return !!existing;
    });

    const menuItem = await prisma.menuItem.create({
      data: {
        ...data,
        slug,
        restaurantId,
        categoryId,
        images: [],
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user!.userId;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    if (menuItem.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to update this item');
    }

    // Update slug if name changed
    let slug = menuItem.slug;
    if (data.name && data.name !== menuItem.name) {
      slug = await generateUniqueSlug(data.name, async (s) => {
        const existing = await prisma.menuItem.findFirst({
          where: { slug: s, restaurantId: menuItem.restaurantId },
        });
        return !!existing && existing.id !== id;
      });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
        variations: true,
      },
    });

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new NotFoundError('Menu item not found');
    }

    if (menuItem.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to delete this item');
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
