const { startRenderer, startMain, startElectron } = require('./runner');

module.exports = (api, options) => {
  api.registerCommand('run:electron', {
    description : 'electron runner',
    usage       : 'vue-cli-service run:electron [options]',
    options     : {},
  }, (args) => Promise.all([
    startRenderer(api, args.mode || 'development', args),
    startMain(api, args.mode || 'development'),
  ])
    .then(() => startElectron())
    .catch((error) => console.error(error)));
};
