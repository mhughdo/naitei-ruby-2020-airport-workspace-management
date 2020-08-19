const withLess = require('@zeit/next-less')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const {nextI18NextRewrites} = require('next-i18next/rewrites')

const localeSubpaths = {vi: 'vi'}

const isProd = process.env.NODE_ENV === 'production'

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withImages({
  esModule: true,
  ...withCSS({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]',
    },
    ...withLess(
      withSass({
        lessLoaderOptions: {
          javascriptEnabled: true,
        },
      })
    ),
  }),

  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
})
