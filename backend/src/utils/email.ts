import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Restaurant System <noreply@restaurant.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderNumber: string,
  customerName: string,
  total: number
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>Thank you for your order! We've received it and will start preparing it shortly.</p>

          <div class="order-info">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> PKR ${total.toFixed(2)}</p>
          </div>

          <p>You can track your order status in real-time from your order page.</p>
          <p>If you have any questions, feel free to contact us.</p>

          <p>Best regards,<br>Restaurant Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
    text: `Order confirmed! Order Number: ${orderNumber}, Total: PKR ${total.toFixed(2)}`,
  });
};

export const sendOrderStatusEmail = async (
  email: string,
  orderNumber: string,
  customerName: string,
  status: string
): Promise<void> => {
  const statusMessages: Record<string, string> = {
    CONFIRMED: 'Your order has been confirmed!',
    PREPARING: 'Your order is being prepared!',
    READY: 'Your order is ready!',
    SERVED: 'Your order has been served!',
    COMPLETED: 'Your order is complete!',
    CANCELLED: 'Your order has been cancelled.',
  };

  const message = statusMessages[status] || `Your order status: ${status}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Order Update</h2>
        <p>Dear ${customerName},</p>
        <p>${message}</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p>Thank you for choosing us!</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: `Order Update - ${orderNumber}`,
    html,
  });
};
