import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { generateQRCode } from '../utils/qrcode';

export const getTablesByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    const tables = await prisma.table.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { tableNumber: 'asc' },
    });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

export const getTableById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const getTableByQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { qrCode } = req.params;

    const table = await prisma.table.findUnique({
      where: { qrCode },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            description: true,
            cuisineType: true,
            businessHours: true,
          },
        },
      },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const createTable = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId, tableNumber, capacity, floor, section } = req.body;
    const userId = req.user!.userId;

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to add tables to this restaurant');
    }

    // Generate QR code
    const { code, imagePath } = await generateQRCode({
      restaurantId,
      tableId: 'temp',
      tableNumber,
    });

    // Create table
    const table = await prisma.table.create({
      data: {
        tableNumber,
        capacity,
        floor,
        section,
        qrCode: code,
        qrCodeImage: imagePath,
        restaurantId,
      },
    });

    // Update QR code with actual table ID
    const updatedQRCode = await generateQRCode({
      restaurantId,
      tableId: table.id,
      tableNumber,
    });

    const updatedTable = await prisma.table.update({
      where: { id: table.id },
      data: {
        qrCode: updatedQRCode.code,
        qrCodeImage: updatedQRCode.imagePath,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Table created successfully with QR code',
      data: updatedTable,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user!.userId;

    const table = await prisma.table.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    if (table.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to update this table');
    }

    const updatedTable = await prisma.table.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: updatedTable,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const table = await prisma.table.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    if (table.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to delete this table');
    }

    await prisma.table.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Table deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const regenerateQRCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const table = await prisma.table.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!table) {
      throw new NotFoundError('Table not found');
    }

    if (table.restaurant.ownerId !== userId && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to regenerate QR code for this table');
    }

    const { code, imagePath } = await generateQRCode({
      restaurantId: table.restaurantId,
      tableId: table.id,
      tableNumber: table.tableNumber,
    });

    const updatedTable = await prisma.table.update({
      where: { id },
      data: {
        qrCode: code,
        qrCodeImage: imagePath,
      },
    });

    res.json({
      success: true,
      message: 'QR code regenerated successfully',
      data: updatedTable,
    });
  } catch (error) {
    next(error);
  }
};
