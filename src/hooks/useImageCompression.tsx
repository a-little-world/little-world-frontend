import { useCallback } from 'react';

const useImageCompression = (quality: number = 0.8) => {
  const compressImage = useCallback(
    async (file: File): Promise<Blob> => {
      try {
        const imageBitmap = await createImageBitmap(file);

        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Unable to get canvas 2D context');
        }

        ctx.drawImage(imageBitmap, 0, 0);

        return new Promise((resolve, reject) => {
          canvas.toBlob(
            blob => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            file.type,
            quality,
          );
        });
      } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
      }
    },
    [quality],
  );

  return { compressImage };
};

export default useImageCompression;
