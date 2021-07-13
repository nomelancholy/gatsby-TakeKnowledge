if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

const webpack = require("webpack");

const withLess = require("@zeit/next-less"),
  nextConfig = {
    target: "serverless",
    env: {
      BACKEND_API: "http://3.34.133.211:8000/api/v1",
      DOMAIN: "localhost",
    },
    onDemandEntries: {
      maxInactiveAge: 1000 * 60 * 60,
      pagesBufferLength: 5,
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: "empty",
        };
      }

      config.module.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      });

      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals),
        ];

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

module.exports = withLess(nextConfig);
