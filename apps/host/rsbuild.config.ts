import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin'
import { resolve } from 'path'

const IS_PROD = ['production'].includes(process.env.NODE_ENV!)
const IS_RSDOCTOR = !!process.env.RSDOCTOR
const sourceMapFlag = !IS_PROD ? 'source-map': false 

const assetsCDN = {
  js: [
    "https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js",
    "https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"
  ]
}
export default defineConfig({
  server: {
    port: 9000,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  dev: {
    writeToDisk: true
  },
  output: {
    sourceMap: {
      js: false,
      css: !!sourceMapFlag
    }
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'host',
          shared: {
            'react': {
              singleton: true
            },
            'react-dom': {
              singleton: true
            },
            'styled-components': {
              singleton: true
            },
            'uuid': {
              singleton: true
            },
            '@ca/core-api': {
              singleton: true
            },
            'lodash': {
              singleton: true
            },
            'antd': {
              singleton: true
            }
          }
        })
      ]);
      if(IS_RSDOCTOR){
        appendPlugins([
          new RsdoctorRspackPlugin()
        ])
      }
      config.resolve ||= {}
      config.resolve.alias ||= {}
      config.resolve.alias['@'] = resolve(__dirname, './src')

      config.module ||= {}
      config.module.rules?.concat([
        {
          test: /\.svg$/,
          type: "asset",
        },
        {
          test: /\.(js|ts|tsx|jsx)$/,
          use: {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: !IS_PROD,
                    refresh: !IS_PROD,
                  },
                },
              },
            },
          }
        }
      ])
      if(IS_PROD){
        // 启用后, 会导致在iframe场景下,HMR无法生效
        config.externals = {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }

        config.optimization ||= {}
        config.optimization.splitChunks = {
          chunks: 'async',
          minChunks: 1,
          minSize: 20 * 1000,
          maxAsyncRequests: 6,
          maxInitialRequests: 6,
          cacheGroups: {
            utils: {
              test: /[\\/]node_modules[\\/](lodash)[\\/]/,
              priority: -5,
              reuseExistingChunk: true,
            },
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -15,
              reuseExistingChunk: true,
            },
          },
        }
      }
    },
  },
  html: {
    template: './public/index.html',
    templateParameters: {
      cdn: assetsCDN,
      title: process.env['CA_title']
    }
  },
  plugins: [pluginReact()],
});