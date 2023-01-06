const path = require('path')
const custompack = require('../pack')

const config = {
  entry: path.resolve(__dirname, './entry.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'output.js'
  }
}

new custompack(config).run()
