/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { renderWebpack, mainWebpack } = require('./config');

let hotMiddleware;

const startRenderer = (api, mode, args) => {
  console.warn('renderer process is running...');
  renderWebpack(api, mode);

  return api.service.run('serve', args);
};

const startMain = (api, mode) => {
  console.warn('main process is running...');
  const config = mainWebpack(api, mode);
  const compiler = webpack(config);
};

const startElectron = () => Promise.resolve();

module.exports = {
  startRenderer, startMain, startElectron,
};
