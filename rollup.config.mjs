import path from 'node:path';
import { fileURLToPath } from 'node:url';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const assetPattern = /\.(css|json|svg|png|jpe?g|gif|webp)$/i;

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
