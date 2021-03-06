const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
  entry: "./src/app.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // scss file types
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader?sourceMap", "sass-loader?sourceMap"]
        })
      },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }, //js and jsx file types
      {
        test: /\.(gif|png|jpe?g|svg)$/i, //image format files
        loaders: [
          "file-loader?name=[name].[ext]&outputPath=assets/",
          'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}' //quality check and compression of images
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, //font file types
        use: ["file-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"), //server to show which folder to be served.
    compress: true,
    stats: "errors-only", //show only errors in the terminal can use quite: true but it do not show errors or warning so this is used.
    open: true, //open in new window in dev mode.
    hot: true //Hot Module Replacement is enabled.
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Boilerplate",
      //minify: {
      //collapseWhitespace: true
      //},
      hash: true,
      template: "./src/index.html"
    }),
    new ExtractTextPlugin({
      filename: "bundle.css",
      disable: false,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(["dist"]),
    new BrowserSyncPlugin(
      {
        host: "localhost",
        port: 3000,
        proxy: "http://localhost:8080/",
        files: [
          {
            match: ["**/*.html"],
            fn: function(event, file) {
              if (event === "change") {
                const bs = require("browser-sync").get("bs-webpack-plugin");
                bs.reload();
              }
            }
          }
        ]
      },
      {
        reload: false
      }
    ),
    new webpack.NamedModulesPlugin()
  ],
  devtool: "source-map"
};
