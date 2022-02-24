import { ESBuildMinifyPlugin } from 'esbuild-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

/** @type { import('webpack').Configuration } */
const config = {
  // devtool: 'eval-cheap-module-source-map',
  devtool: false,
  entry: './src/index.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true
                },
                target: 'es5'
              }
            }
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin(), new ForkTsCheckerWebpackPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[contenthash:8].js',
    clean: true
  }
  // optimization: {
  //   minimizer: [new ESBuildMinifyPlugin({ target: 'es2015', css: true })]
  // }
}

export default config
