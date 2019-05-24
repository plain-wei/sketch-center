const { ENTRY_PATH, ENTRY_FILE, OUTPUT_DIR } = require('./config');

const renderWebpack = (api, mode) => {
  api.chainWebpack((config) => {
    config.target('electron-renderer');
    config.plugin('define')
      .tap((opts) => {
        // platform
        opts[0].__DARWIN__ = process.platform === 'darwin';
        opts[0].__WIN32__ = process.platform === 'win32';
        opts[0].__LINUX__ = process.platform === 'linux';

        if (mode === 'production') {
          opts[0]['process.env'].BASE_URL = '__dirname + "/"';
          opts[0].__public = '__dirname';
          opts[0].__static = 'require("path").resolve(process.resourcesPath, "static")';
        }
        else {
          opts[0].__public = JSON.stringify(api.resolve('./public'));
          opts[0].__static = JSON.stringify(api.resolve('./static'));
        }

        return opts;
      });
  });
};
const mainWebpack = (api, mode) => {
  const config = api.resolveChainableWebpackConfig();

  config.entryPoints.clear();
  config.module.rules.clear();
  config.node
    .clear()
    .merge({
      console       : false,
      global        : false,
      process       : false,
      __filename    : false,
      __dirname     : false,
      Buffer        : false,
      setImmediate  : false,
      dgram         : false,
      fs            : false,
      net           : false,
      tls           : false,
      child_process : false,
    });
  config.target('electron-main');

  config.entry(ENTRY_FILE.substring(0, ENTRY_FILE.length - 3)).add(api.resolve(ENTRY_PATH));
  config.plugins.values().forEach((plugin) => {
    switch (plugin.name) {
      case 'define':
      case 'case-sensitive-paths':
      case 'friendly-errors': break;
      // development
      case 'hmr':
      case 'no-emit-on-errors':
      case 'progress': break;
      // production
      case 'hash-module-ids':
      case 'named-chunks':
        break;
      default:
        config.plugins.delete(plugin.name);
        break;
    }
  });
  config.optimization.splitChunks({
    cacheGroups : {
      vendors : {
        name      : 'chunk-vendors',
        test      : /[\\/]node_modules[\\/]/,
        priority  : -10,
        // webpack bug: minChunks: 1 might cause module load error when only one chunk is used.
        minChunks : 2,
        chunks    : 'initial',
      },
      common : {
        name               : 'chunk-common',
        minChunks          : 2,
        priority           : -20,
        chunks             : 'initial',
        reuseExistingChunk : true,
      },
    },
  });
  config.output
    .path(api.resolve(OUTPUT_DIR))
    .filename('[name].js')
    .chunkFilename('[name].js')
    .publicPath('');

  return config;
};

module.exports = { renderWebpack, mainWebpack };
