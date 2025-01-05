const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background.ts"),
        content: path.resolve(__dirname, "..", "src", "content.ts")
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            '@services': path.resolve(__dirname, '../src/services/'),
            '@types': path.resolve(__dirname, '../src/types/'),
            '@interfaces': path.resolve(__dirname, '../src/interfaces/')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "../tsconfig.json"),
                            transpileOnly: false
                        }
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),
    ],
};