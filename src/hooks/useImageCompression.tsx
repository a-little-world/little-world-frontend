import { useCallback } from 'react';

export const MAX_IMAGE_SIZE = 1_000_000; // bytes = 1MB

const useImageCompression = () => {
  const compressImage = useCallback(async (file: File): Promise<Blob> => {
    try {
      // If file is already small, return original
      if (file.size <= 1_000_000) {
        return file;
      }

      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to get canvas 2D context');
      }

      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

      // Qualität basierend auf der Dateigröße bestimmen
      let quality = 0.9; // Standardqualität für kleine Dateien
      if (file.size > 5_000_000) {
        quality = 0.2; // Starke Kompression für große Dateien (> 5 MB)
      } else if (file.size > 4_000_000) {
        quality = 0.3;
      }else if (file.size > 3_000_000){
        quality = 0.6;
      }else if(file.size > 2_000_000){
        quality = 0.8;
      }else if(file.size > 1_000_000){
        quality = 0.9;
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          blob => {
            if (blob) {
              // Create a new File object preserving original metadata
              const compressedFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: file.lastModified,
              });

              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
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
