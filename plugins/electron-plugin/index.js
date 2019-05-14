module.exports = (api, options) => {
  api.registerCommand(
    'serve:electron',
    {
      description : 'run electron',
    },
    (args, rawArgs) => {
      packRenderProcess(api, args.mode || 'development');
      
      return Promise.all([
        api.service.run('serve', args),
      ]);
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
        console : false,
        global  : true,
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
    config.output
      .path(api.resolve('out/dist'))
      .filename('[name].js')
      .chunkFilename('[name].js')
      .publicPath('');
  });
}
