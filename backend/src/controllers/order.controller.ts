import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { generateOrderNumber } from '../utils/generateOrderNumber';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/email';

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      restaurantId,
      tableId,
      items,
      customerName,
      customerPhone,
      customerEmail,
      specialInstructions,
      deliveryAddress,
    } = req.body;

    const userId = req.user?.userId;

    // Verify restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || !restaurant.isActive || !restaurant.acceptsOrders) {
      throw new BadRequestError('Restaurant is not accepting orders');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem || !menuItem.isAvailable) {
        throw new BadRequestError(`Item ${item.menuItemId} is not available`);
      }

      const itemPrice = menuItem.discountPrice || menuItem.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        itemName: menuItem.name,
        itemImage: menuItem.images[0] || null,
        variations: item.variations || null,
        specialNotes: item.specialNotes,
      });
    }

    // Calculate tax and total
    const tax = subtotal * restaurant.taxRate;
    const deliveryFee = deliveryAddress ? restaurant.deliveryFee : 0;
    const total = subtotal + tax + deliveryFee;

    // Create order
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: userId!,
        restaurantId,
        tableId,
        customerName,
        customerPhone,
        customerEmail,
        specialInstructions,
        deliveryAddress,
        subtotal,
        tax,
        deliveryFee,
        discount: 0,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send confirmation email
    if (customerEmail) {
      try {
        await sendOrderConfirmationEmail(
          customerEmail,
          orderNumber,
          customerName,
          total
        );
      } catch (emailError) {
        // Log but don't fail the order
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    // Emit socket event for restaurant
    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant-${restaurantId}`).emit('new-order', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        itemCount: order.items.length,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        table: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check permissions
    if (
      userRole !== 'ADMIN' &&
      order.customerId !== userId &&
      order.restaurant.ownerId !== userId
    ) {
      throw new ForbiddenError('Not authorized to view this order');
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      customerId: userId,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          items: {
            include: {
              menuItem: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
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

export const getRestaurantOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { status, page = 1, limit = 20 } = req.query;

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (restaurant.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to view orders for this restaurant');
    }

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      restaurantId,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          items: {
            include: {
              menuItem: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          table: {
            select: {
              id: true,
              tableNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
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

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { restaurant: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Only restaurant owner or admin can update status
    if (order.restaurant.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('Not authorized to update this order');
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        items: true,
        restaurant: true,
      },
    });

    // Send status update email
    if (order.customerEmail) {
      try {
        await sendOrderStatusEmail(
          order.customerEmail,
          order.orderNumber,
          order.customerName,
          status
        );
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
      }
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`order-${id}`).emit('order-status-update', {
        orderId: id,
        status,
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Only customer can cancel their own order
    if (order.customerId !== userId) {
      throw new ForbiddenError('Not authorized to cancel this order');
    }

    // Can only cancel if status is PENDING or CONFIRMED
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestError('Order cannot be cancelled at this stage');
    }

    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant-${order.restaurantId}`).emit('order-cancelled', {
        orderId: id,
        orderNumber: order.orderNumber,
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder,
    });
  } catch (error) {
    next(error);
  }
};
