/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { spawn } = require('child_process');
const electron = require('electron');
const { renderWebpack, mainWebpack } = require('./webpack');
const { OUTPUT_DIR } = require('./config');

let hotMiddleware;

let electronProcess = null;

let manualRestart = false;


const startElectron = (api) => {
  console.warn('electron process is running...');

  electronProcess = spawn(
    electron,
    [ api.resolve(`${OUTPUT_DIR}/index.js`) ],
    {
      detached : true,
      cwd      : api.getCwd(),
      env      : {
        ...process.env,
        ELECTRON_DISABLE_SECURITY_WARNINGS : true,
      },
    }
  );

  electronProcess.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });
  electronProcess.stderr.on('data', (data) => {
    console.error(data.toString().trim());
  });

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
};

const startRenderer = (api, mode, args) => {
  console.warn('renderer process is running...');
  renderWebpack(api, mode);

  return api.service.run('serve', args);
};

const startMain = (api, mode, server) => {
  console.warn('main process is running...');

  return new Promise((resolve, reject) => {
    const config = mainWebpack(api, mode);

    config.plugin('env')
      .use(webpack.EnvironmentPlugin, [ {
        WEBPACK_DEV_SERVER_URL : server.url,
      } ]);

    const compiler = webpack(config.toConfig());

    hotMiddleware = webpackHotMiddleware(compiler, {
      log       : false,
      heartbeat : 2500,
    });

    // server.server.app.use(hotMiddleware);

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      hotMiddleware.publish({ action: 'compiling' });
      done();
    });
    compiler.watch({}, (err, stats) => {
      if (err) return console.error(err);

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        startElectron(api);

        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }
      resolve();
    });
  });
};

module.exports = {
  startRenderer, startMain, startElectron,
};
