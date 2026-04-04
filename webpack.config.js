const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = function (env) {
  let publicPath = '/';
  const devTool = env.DEV_TOOL === 'none' ? false : env.DEV_TOOL;
  if (env.PUBLIC_PATH && env.PUBLIC_PATH !== '')
    publicPath = env.PUBLIC_PATH + publicPath;

  const outputPath = './dist';
  const entry = './src';
  const entryPoint = `${entry}/main.js`;

  return {
    context: __dirname,
    entry: {
      staticfiles: entryPoint,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    output: {
      path: path.join(__dirname, outputPath),
      filename: '[name]-[hash].js',
      publicPath,
    },
    devServer: {
      historyApiFallback: true,
      port: 3000,
    },
    plugins: [
      new BundleTracker({
        filename: path.join(__dirname, './webpack-stats.json'),
      }),
      new CompressionPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public'),
            to: path.join(__dirname, outputPath),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve('public/index.html'),
      }),
      new webpack.DefinePlugin({
        process: { env: {} },
      }),
    ],
    devtool: devTool,
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
          resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
          },
          include: [path.resolve(__dirname, './src')],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
            },
            {
              loader: 'file-loader',
            },
          ],
          type: 'javascript/auto',
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
        {
          test: /\.(png|jpg|gif|ttf)$/i,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.(webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]',
          },
        },
      ],
    },
  };
};

module.exports = env => {
  const conf = config(env);
  console.log(conf);
  return conf;
};
