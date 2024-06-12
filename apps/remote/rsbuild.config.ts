import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { resolve } from 'path'

const IS_PROD = ['production'].includes(process.env.NODE_ENV!)
const sourceMapFlag = !IS_PROD ? 'source-map': false 

const assetsCDN = {
  js: [
    "https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js",
    "https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"
  ]
}

if(!IS_PROD){
  assetsCDN.js = []
}

export default defineConfig({
  source: {
    entry: {
      index: './src/index.tsx'
    }
  },
  server: {
    port: 9002,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
  output: {
    sourceMap: {
      js: sourceMapFlag,
      css: !!sourceMapFlag
    }
  },
  dev: {
    // // 必须要配置 assetPrefix，在生产环境需要配置 output.assetPrefix
    assetPrefix: 'http://localhost:9002',
    writeToDisk: true
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      // 需要设置一个唯一值不能和其他应用相等
      // config.output!.uniqueName = 'remote';
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'remote',
          filename: 'remoteEntry.js',
          library: { type: 'var', name: 'remote'},
          exposes: {
            './Button': './src/Button.tsx',
          },
          shared: {
            'react': {
              singleton: true
            },
            'react-dom': {
              singleton: true
            },
            '@ca/core-api': {
              singleton: true
            }
          }
        }),
      ]);
      config.resolve ||= {}
      config.resolve.alias ||= {}
      config.resolve.alias['@'] = resolve(__dirname, './src')
      if(IS_PROD){
        // 启用后, 会导致在iframe场景下,HMR无法生效
        config.externals = {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
  },
  html: {
    template: './public/index.html',
    templateParameters: {
      cdn: assetsCDN,
      title: 'Remote App'
    }
  },
  plugins: [pluginReact()],
});