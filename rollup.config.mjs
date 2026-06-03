import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const assetPattern = /\.(css|json|png|jpe?g|gif|webp)$/i;

const inlineSvgAssets = () => ({
  name: 'inline-svg-assets',
  load(id) {
    if (!id.endsWith('.svg')) {
      return null;
    }

    const svgContent = fs.readFileSync(id, 'utf8');
    const minifiedSvg = svgContent
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .trim();
    const dataUri = `data:image/svg+xml;base64,${Buffer.from(minifiedSvg).toString('base64')}`;

    return `export default ${JSON.stringify(dataUri)};`;
  },
});

const isExternal = id => {
  if (assetPattern.test(id)) {
    return true;
  }

  if (id.startsWith('.') || id.startsWith('src/') || path.isAbsolute(id)) {
    return false;
  }

  return true;
};

const createConfig = (format, dir) => ({
  input: 'src/index.ts',
  output: {
    dir,
    entryFileNames: '[name].js',
    exports: 'named',
    format,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  external: isExternal,
  plugins: [
    inlineSvgAssets(),
    nodeResolve({
      extensions,
      preferBuiltins: false,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      configFile: path.join(__dirname, 'babel.config.js'),
      exclude: /node_modules/,
      extensions,
    }),
  ],
});

export default [createConfig('esm', 'dist/esm'), createConfig('cjs', 'dist/cjs')];
