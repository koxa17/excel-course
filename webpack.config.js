const path = require('path');
// подключаем установленые плагины
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// в каком режиме мы собираем проект
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }];
    if (isDev) {
        loaders.push('eslint-loader');
    }

    return loaders;
}

console.log('Is prod', isProd);

console.log('Is dev', isDev);

module.exports = {
    // исходники нашего приложения
    context: path.resolve(__dirname, 'src'),
    // указываем что вебпак в режиме разработки
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    // на выходе будем получать минифициорованый файл
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        // сокращает путь import '../../../../../core/Component'
        // import @core/Component
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core'),
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // откуда будем брать шаблон html - что бы плагин его не генерировал
            template: "index.html",
            minify: {
                // удалять только в режиме продакшн
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') },
            ],
        }),
        new MiniCssExtractPlugin({
            // в какой файл необходимо все поместить
            filename: filename('css')
        })
    ],
    module: {

        rules: [{
                test: /\.s[ac]ss$/i,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hot: isDev,
                            reloadAll: true
                        }
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ]
    }
}