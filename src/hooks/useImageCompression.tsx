import { useCallback } from 'react';

const useImageCompression = () => {
  const compressImage = useCallback(async (file: File): Promise<Blob> => {
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

      // Qualität basierend auf der Dateigröße bestimmen
      let quality = 0.9; // Standardqualität für kleine Dateien
      if (file.size > 5_000_000) {
        quality = 0.5; // Starke Kompression für große Dateien (> 5 MB)
      } else if (file.size > 1_000_000) {
        quality = 0.7; // Moderate Kompression für mittelgroße Dateien (1-5 MB)
      }

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
  }, []);

  return { compressImage };
};

export default useImageCompression;
