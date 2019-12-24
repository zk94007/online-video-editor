module.exports = {
  entry: ["@babel/polyfill", "./react/front.js"],
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "[name].js"
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        include: /node_modules/,
        loader: "json-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      },
      {
        // sass / scss loader for webpack
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "/[name].css"
            }
          },
          {
            loader: "extract-loader"
          },
          {
            loader: "css-loader?-url"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  }
};
