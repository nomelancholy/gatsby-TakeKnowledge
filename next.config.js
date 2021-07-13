if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

const webpack = require("webpack");
const withPlugins = require("next-compose-plugins");
const withCss = require("@zeit/next-css");
const withLess = require("@zeit/next-less");

nextConfig = {
  cssLoaderOptions: {
    importLoaders: 1,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  target: "serverless",
  env: {
    BACKEND_API: "http://3.34.133.211:8000/api/v1",
    DOMAIN: "localhost",
  },
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const hiynnStyles = /hiynn-design\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles) || request.match(hiynnStyles)) {
            return callback();
          }
          if (typeof origExternals[0] === "function") {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === "function" ? [] : origExternals),
      ];

      config.module.rules.push(
        {
          test: /\.md$/,
          use: "raw-loader",
        },
        {
          test: antStyles,
          use: "null-loader",
        },
        {
          test: hiynnStyles,
          use: "null-loader",
        }
      );

      config.module.rules.unshift({
        test: antStyles,
        use: "null-loader",
      });
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      })
    );
    // 참조 : https://github.com/summernote/react-summernote

    return config;
  },
};

module.exports = withPlugins([withCss, withLess], nextConfig);
