import { useEffect, useState } from 'react';

// Helper function to check if a font is available
function isFontAvailable(fontFamily: string) {
  if (typeof document === 'undefined') return false;

  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return false;

  // Get the width with the default font
  context.font = `${testSize} Arial`;
  const defaultWidth = context.measureText(testString).width;

  // Get the width with the target font
  context.font = `${testSize} ${fontFamily}, Arial`;
  const targetWidth = context.measureText(testString).width;

  return targetWidth !== defaultWidth;
}

// Font loading detection
function useFontLoadingDetection() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Inject fonts when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fontsToCheck = [
        'Signika Negative',
        'Signika Negative Bold',
        'Work Sans',
      ];

      console.log('=== Font Availability Check ===');
      fontsToCheck.forEach(font => {
        const available = isFontAvailable(font);
        console.log(
          `${font}: ${available ? '✅ Available' : '❌ Not available'}`,
        );
      });

      // Load Google Fonts (same as web app)
      const googleFontsLink = document.createElement('link');
      googleFontsLink.href =
        'https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600;700&family=Work+Sans:wght@700&display=swap';
      googleFontsLink.rel = 'stylesheet';

      googleFontsLink.onload = () => {
        console.log('✅ Google Fonts loaded successfully');

        // Check fonts again after loading
        setTimeout(() => {
          console.log('=== Font Availability After Google Fonts ===');
          fontsToCheck.forEach(font => {
            const available = isFontAvailable(font);
            console.log(
              `${font}: ${available ? '✅ Available' : '❌ Not available'}`,
            );
          });
        }, 500);
      };

      googleFontsLink.onerror = () => {
        console.error('❌ Failed to load Google Fonts');
      };

      document.head.appendChild(googleFontsLink);

      const style = document.createElement('style');
      style.id = 'little-world-fonts';

      document.head.appendChild(style);
    }
    setFontsLoaded(true);
  }, []);

  return fontsLoaded;
}

export default useFontLoadingDetection;
