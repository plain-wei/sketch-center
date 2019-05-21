/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

// folder contains electron setup
const SETUP_DIR = 'out/setup';
// folder contains dist file for electron(main & renderer)
const OUTPUT_DIR = 'out/dist';
// entry file for electron
const ENTRY_FILE = 'index.js';
// install file
const INSTALLER_DIR = 'out/installer';

module.exports = (api, options) => {
  api.registerCommand(
    'serve:electron',
    {
      description : 'serve app and launch electron',
      usage       : 'vue-cli-service serve:electron',
      details     : 'TBD',
    },
    (args, rawArgs) => {
      const { inspect, promisify } = require('util');
      const { execa, chalk, log, info, warn, error, done } = require(api.resolve('./node_modules/@vue/cli-shared-utils'));
      const webpack = require(api.resolve('./node_modules/webpack'));

      const mode = args.mode || module.exports.defaultModes['serve:electron'];
      const opts = {
        outputDir : OUTPUT_DIR,
        entryFile : ENTRY_FILE,
      };

      // webpack config for renderer process
      chainRendererWebpack(api, mode);

      // webpack config for main process
      const config = genMainWebpack(api, mode, opts);

      return Promise.all([
        api.service.run('serve', args),
        startHMRServer(api),
      ])
        .then(([ server, hmrServer ]) => {
          info('Starting development electron...');

          const path = require('path');
          const { entryFile } = opts;

          config.plugin('env')
            .use(webpack.EnvironmentPlugin, [ {
              WEBPACK_DEV_SERVER_URL  : server.url,
              WEBPACK_HMR_SOCKET_PATH : hmrServer.socketPath,
            } ]);

          config.entry(entryFile.substring(0, entryFile.length - 3))
            .add(
              path.resolve(__dirname, 'main-hmr.js')
            );

          return new Promise((resolve, reject) => {
            let handleResolve = resolve;

            let handleReject = reject;

            const compiler = webpack(config.toConfig());

            compiler.hooks.compile.tap('electron-webpack-dev-runner', () => {
              hmrServer.beforeCompile();
              info('Compiling main process...');
            });

            const watcher = compiler.watch({}, (e, stats) => {
              logError(e);
              logStats(stats);

              if (e) {
                if (handleReject) {
                  handleReject(e);
                  handleReject = null;
                }
                error(e);

                return;
              }

              if (handleResolve) {
                handleResolve(hmrServer);
                handleResolve = null;
              }

              hmrServer.built(stats);
            });

            require('async-exit-hook')((callback) => {
              watcher.close(() => callback());
            });

            function logError(e) {
              if (e) {
                console.error(e);
                if (e.details) {
                  console.error(e.details);
                }
              }
            }

            function logStats(stats) {
              if (stats.hasErrors()) {
                console.error(info.errors);
              }

              if (stats.hasWarnings()) {
                console.warn(info.warnings);
              }
            }
          });
        })
        .then((hmrServer) => {
          const electrons = [];
          const queuedData = [];

          let lastLogIndex = null;

          function startElectron(index = 0) {
            const electron = execa(
              require(api.resolve('./node_modules/electron')),
              // Have it load the main process file built with webpack
              [ api.resolve(`./${opts.outputDir}/${opts.entryFile}`) ],
              {
                detached : true,
                cwd      : api.getCwd(),
                env      : {
                  ...process.env,
                  // Disable electron security warnings
                  ELECTRON_DISABLE_SECURITY_WARNINGS : true,
                  WEBPACK_HMR_SOCKET_PATH            : hmrServer.socketPath,
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

            electron.stdout.on('data', (data) => {
              data = data.toString().trim();

              if (data === '') return;

              if (data === '[HMR] Updated modules:') {
                queuedData[index] = data;

                return;
              }

              if (queuedData[index] != null) {
                data = queuedData[index] + data;
                queuedData[index] = null;
              }

              if (lastLogIndex === null || lastLogIndex !== index) {
                lastLogIndex = index;
                info(`Electron ${index === 0 ? '' : index}:`);
              }
              log(`- ${data.startsWith('[HMR]') ? chalk.cyan(data) : data}`);
            });

            electrons[index] = electron;

            return electron;
          }

          startElectron();

          require('async-exit-hook')((callback) => {
            hmrServer.close(callback);
          });
        });
    }
  );
};

module.exports.defaultModes = {
  'serve:electron' : 'development',
};

function chainRendererWebpack(api, mode = 'production') {
  const s = JSON.stringify;

  api.chainWebpack((config) => {
    config.target('electron-renderer');
    config.node
      .clear()
      .merge({
        console       : false,
        global        : true,
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
    config
      .plugin('define')
      .tap((opts) => {
        opts[0].__DARWIN__ = process.platform === 'darwin';
        opts[0].__WIN32__ = process.platform === 'win32';
        opts[0].__LINUX__ = process.platform === 'linux';

        if (mode === 'production') {
          opts[0]['process.env'].BASE_URL = '__dirname + "/"';
          opts[0].__public = '__dirname';
          opts[0].__static = 'require("path").resolve(process.resourcesPath, "static")';
        }
        else {
          opts[0].__public = s(api.resolve('./public'));
          opts[0].__static = s(api.resolve('./static'));
        }

        opts[0] = flatten(opts[0]);

        return opts;
      });
  });
}

function genMainWebpack(api, mode = 'production', opts = {}) {
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
      tls           : false,
      child_process : false,
    });
  config.target('electron-main');
  config.entry(entryFile.substring(0, entryFile.length - 3)).add(api.resolve(`./src/main/${entryFile}`));
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
    .path(api.resolve(outputDir))
    .filename('[name].js')
    .chunkFilename('[name].js')
    .publicPath('');

  return config;
}

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

const HMRServer = require('./hmr-server');

let hmrServer = null;

async function startHMRServer(api) {
  if (!hmrServer) {
    hmrServer = new HMRServer();
  }
  const { chalk, log, done, info, warn, error } = require(api.resolve('./node_modules/@vue/cli-shared-utils'));

  await hmrServer.listen();

  hmrServer.ipc.on('close', () => {
    done('HMR server closed');
  });
  hmrServer.ipc.on('error', (e) => {
    warn(e);
  });

  return hmrServer;
}
