import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { generateUniqueSlug } from '../utils/slugify';

export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      city,
      cuisineType,
      search,
      status = 'APPROVED',
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status,
      isActive: true,
    };

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (cuisineType) {
      where.cuisineType = { has: cuisineType as string };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
          coverImage: true,
          city: true,
          state: true,
          cuisineType: true,
          averageRating: true,
          totalReviews: true,
          minOrderAmount: true,
          deliveryFee: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.restaurant.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        restaurants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const data = req.body;

    // Generate unique slug
    const slug = await generateUniqueSlug(data.name, async (s) => {
      const existing = await prisma.restaurant.findUnique({ where: { slug: s } });
      return !!existing;
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        ...data,
        slug,
        ownerId: userId,
        status: 'PENDING',
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully. Awaiting admin approval.',
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const data = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    // Only owner or admin can update
    if (restaurant.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to update this restaurant');
    }

    // If name is being changed, generate new slug
    let slug = restaurant.slug;
    if (data.name && data.name !== restaurant.name) {
      slug = await generateUniqueSlug(data.name, async (s) => {
        const existing = await prisma.restaurant.findUnique({ where: { slug: s } });
        return !!existing && existing.id !== id;
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
    });

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRestaurantStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: `Restaurant status updated to ${status}`,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (restaurant.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to delete this restaurant');
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Restaurant deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRestaurants = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};
