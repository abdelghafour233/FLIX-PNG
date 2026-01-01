
import { ImageFormat } from '../types';
import heic2any from 'heic2any';

/**
 * Converts an image file (including HEIC) to the target format and quality client-side.
 */
export const convertImage = async (
  file: File, 
  targetFormat: ImageFormat, 
  quality: number
): Promise<{ blob: Blob; size: number }> => {
  let sourceBlob: Blob | File = file;

  // Handle HEIC/HEIF files
  const isHeic = file.type === 'image/heic' || 
                 file.type === 'image/heif' || 
                 file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif');

  if (isHeic) {
    try {
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: quality
      });
      sourceBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.error('HEIC conversion failed:', err);
      throw new Error('فشل تحويل صيغة HEIC');
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Fill white background for JPEGs to handle transparency
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, size: blob.size });
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          targetFormat,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(sourceBlob);
  });
};
