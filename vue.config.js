module.exports = {
  pages : {
    index : 'src/renderer/index.js',
  },

  chainWebpack : (config) => {
    config.module
      .rule('eslint')
      .exclude
      .add(/(sketch)/);
  },
};
