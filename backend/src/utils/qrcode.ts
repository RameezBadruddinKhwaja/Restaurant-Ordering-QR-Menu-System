import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const QR_DIR = path.join(UPLOAD_DIR, 'qrcodes');

// Ensure QR directory exists
(async () => {
  try {
    await fs.mkdir(QR_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating QR directory:', error);
  }
})();

export interface QRCodeData {
  restaurantId: string;
  tableId: string;
  tableNumber: string;
}

export const generateQRCode = async (data: QRCodeData): Promise<{ code: string; imagePath: string }> => {
  const uniqueCode = uuidv4();
  const qrData = JSON.stringify({
    ...data,
    code: uniqueCode,
    type: 'table',
    timestamp: Date.now(),
  });

  const fileName = `qr-${data.restaurantId}-${data.tableNumber}-${Date.now()}.png`;
  const filePath = path.join(QR_DIR, fileName);
  const relativePath = `/uploads/qrcodes/${fileName}`;

  try {
    await QRCode.toFile(filePath, qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 500,
    });

    return {
      code: uniqueCode,
      imagePath: relativePath,
    };
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
};

export const generateQRCodeBuffer = async (data: QRCodeData): Promise<Buffer> => {
  const uniqueCode = uuidv4();
  const qrData = JSON.stringify({
    ...data,
    code: uniqueCode,
    type: 'table',
    timestamp: Date.now(),
  });

  try {
    const buffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      quality: 0.95,
      margin: 1,
      width: 500,
    });

    return buffer;
  } catch (error) {
    throw new Error(`Failed to generate QR code buffer: ${error}`);
  }
};
