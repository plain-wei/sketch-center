const renderWebpack = (api, mode) => {
  api.chainWebpack((config) => {
    config.target = 'electron-renderer';
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

};

module.exports = { renderWebpack, mainWebpack };
