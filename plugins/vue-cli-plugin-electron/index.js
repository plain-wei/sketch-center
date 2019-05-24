const { startRenderer, startMain, startElectron } = require('./runner');

module.exports = (api, options) => {
  api.registerCommand('run:electron', {
    description : 'electron runner',
    usage       : 'vue-cli-service run:electron [options]',
    options     : {},
  }, (args) => startRenderer(api, args.mode || 'development', args)
    .then((server) => startMain(api, args.mode || 'development', server))
    .then(() => startElectron(api))
    .catch((error) => console.error(error)));
};
