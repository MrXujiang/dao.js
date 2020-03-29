const options = {
  entry: 'src/index.js',
  doc: {
    title: 'DAO',
    themeConfig: { mode: 'light' },
    base: '/xu_dao'
  },
  extraBabelPlugins: [
      ['babel-plugin-import', {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
      }]
  ],
  lessInBabelMode: true,
  runtimeHelpers: true,
  esm: {
    type: 'rollup',
    file: 'dao.esm'
  },
  cjs: {
      type: 'rollup',
      file: 'dao.cjs'
  },
  umd: {
    file: 'dao.umd',
    minFile: true
  },
  target: "browser"
};

export default options;