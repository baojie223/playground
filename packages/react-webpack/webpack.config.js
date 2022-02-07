import { ESBuildMinifyPlugin } from 'esbuild-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

/** @type { import('webpack').Configuration } */
const config = {
  devtool: false,
  entry: './src/index.ts',
  mode: 'production',
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
  plugins: [new MiniCssExtractPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimizer: [new ESBuildMinifyPlugin({ target: 'es2015', css: true })]
  }
}

export default config
