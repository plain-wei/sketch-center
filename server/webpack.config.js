const path = require('path');

module.exports = {
  entry  : './app.js',
  output : {
    path     : path.resolve(__dirname, 'dist'),
    filename : 'server.bundle.js',
  },
  node : {
    fs  : 'empty',
    net : 'empty',
    tls : 'empty',
  },
};
