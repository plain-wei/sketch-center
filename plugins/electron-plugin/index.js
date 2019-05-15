// folder contains dist file for electron(main & renderer)
const OUTPUT_DIR = 'out/dist';
// entry file for electron
const ENTRY_FILE = 'index.js';

module.exports = (api, options) => {
  api.registerCommand(
    'serve:electron',
    {
      description : 'run electron',
    },
    (args, rawArgs) => {
      const opts = {
        outputDir : OUTPUT_DIR,
        entryFile : ENTRY_FILE,
      };

      const execa = require('execa');
      const webpack = require('webpack');
      const mode = args.mode || 'development';

      packRenderProcess(api, mode);

      const config = packMainProcess(api, mode, opts);

      return api.service.run('serve', args)
        .then((server) => {
          const { entryFile } = opts;

          config.plugin('env')
            .use(webpack.EnvironmentPlugin, [ {
              WEBPACK_DEV_SERVER_URL : server.url,
            } ]);

          config.entry(entryFile.substring(0, entryFile.length - 3));

          return new Promise((resolve, reject) => {
            let handleResolve = resolve;

            let handleReject = reject;

            // console.warn(config.toConfig());

            const compiler = webpack(config.toConfig());

            compiler.hooks.compile.tap('electron-webpack-dev-runner', () => {
              console.warn('compiling main process...');
            });

            const watcher = compiler.watch({}, (e, stats) => {

              console.warn('in watcher');

              if (e) {
                if (handleReject) {
                  handleReject(e);
                  handleReject = null;
                }

                return;
              }

              if (handleResolve) {
                handleResolve();
                handleResolve = null;
              }
            });

            require('async-exit-hook')((callback) => {
              watcher.close(() => callback());
            });
          });
        })
        .then(() => {

          console.warn('staring electron ...');

          const electrons = [];
          const queuedData = [];

          function startElectron(index = 0) {
            console.warn('staring electron ...');

            const electron = execa(
              require('electron'),
              // Have it load the main process file built with webpack
              [ api.resolve(`./${opts.outputDir}/${opts.entryFile}`) ],
              {
                detached : true,
                cwd      : api.getCwd(),
                env      : {
                  ...process.env,
                  // Disable electron security warnings
                  ELECTRON_DISABLE_SECURITY_WARNINGS : true,
                },
              }
            );

            electron.on('close', (exitCode) => {
              if (exitCode === 100) {
                electron.stdout.removeAllListeners();
                electron.removeAllListeners();
                setImmediate(() => startElectron(index));
              }
              else {
                electrons.splice(index, 1);

                if (!electrons.length) {
                  queuedData.length = 0;
                  process.emit('message', 'shutdown');
                }
              }
            });

            electrons[index] = electron;

            return electron;
          }

          startElectron(0);
        }).catch(() => {
        });
    }
  );
};

function isPlainObj(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function flatten(obj, prefix = [], separator = '.') {
  return Object.entries(obj).reduce((acc, [ key, value ]) => Object.assign(
    acc,
    isPlainObj(value)
      ? flatten(value, prefix.concat(key))
      : { [prefix.concat(key).join(separator)]: value }
  ), {});
}

function packRenderProcess(api, mode = 'production') {
  api.chainWebpack((config) => {
    config.target('electron-renderer');
    config.node.clear()
      .merge({
        console    : false,
        global     : true,
        process    : false,
        __filename : false,
        __dirname  : false,
      });
    config.plugin('define')
      .tap((options) => {
        options[0].__DARWIN__ = process.platform === 'darwin';
        options[0].__WIN32__ = process.platform === 'win32';
        options[0].__LINUX__ = process.platform === 'linux';

        if (mode === 'production') {
          options[0]['process.env'].BASE_URL = '__dirname + "/"';
          options[0].__public = '__dirname';
          options[0].__static = 'require("path").resolve(process.resourcesPath, "static")';
        }
        else {
          options[0].__public = JSON.stringify(api.resolve('./public'));
          options[0].__static = JSON.stringify(api.resolve('./static'));
        }

        options[0] = flatten(options[0]);

        return options;
      });
  });
}

function packMainProcess(api, mode = 'production', opts) {
  const { outputDir = 'electron', entryFile = ENTRY_FILE } = opts;
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
      child_process : false,
    });

  config.target('electron-main');
  config.entry(entryFile.substring(0, entryFile.length - 3))
    .add(api.resolve(`./src/main/${entryFile}`));
  config.plugins.values().forEach((plugin) => {
    switch (plugin.name) {
      case 'define':
      case 'case-sensitive-paths':
      case 'friendly-errors':
      // development
      case 'hmr':
      case 'no-emit-on-errors':
      case 'progress':
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
    .path(api.resolve(outputDir))
    .filename('[name].js')
    .chunkFilename('[name].js')
    .publicPath('');

  return config;
}
