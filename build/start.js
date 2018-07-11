/*
 * @Author: ly 
 * @Date: 2018-07-11 10:03:04 
 * @Last Modified by: ly
 * @Last Modified time: 2018-07-11 14:34:04
 * @description: {'配置一个可视化的构建进度'} 
 */
'use strict'

const isProd = process.env.NODE_ENV === 'production';
// const isProd = true;
const path = require('path')
const ora = require('ora') //实现node.js 命令行环境的 loading效果,和显示各种状态的图标
const rm = require('rimraf') //以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除
const webpack = require('webpack')
const spawn = require('child_process').spawn
const chalk = require('chalk') //chalk是一个颜色的插件
const webpackClientConfig = require('./webpack.client.conf.js')
const webpackServerConfig = require('./webpack.server.conf.js')
const spinner = ora('开始构懒人pc端建项目了\n').start();

if (isProd) {
    spinner.color = 'blue';
    spinner.text = '删除dist目录\n';

    //删除文件夹
    rm(path.join(__dirname, '../dist'), err => {
        if (err) throw err;
        spinner.color = 'blue';
        spinner.text = '开始构建客户端模块\n';
        webpack(webpackClientConfig, (err, stats) => {
            if (err) throw err;
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')

            if (stats.hasErrors()) {
                spinner.stop()
                console.log(chalk.red('客户端构建失败.\n'))
                process.exit(1)
            }
            spinner.color = 'blue';
            spinner.text = '开始构建服务端模块';
            webpack(webpackServerConfig, (err, stats) => {
                spinner.stop()
                if (err) throw err;
                process.stdout.write(stats.toString({
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n') //对一些输出信息显示颜色，以便区分

                if (stats.hasErrors()) {
                    console.log(chalk.red('服务端模块构建失败.\n'))
                    process.exit(1)
                }
                console.log(chalk.blue(' 整个项目构建构建完成了.\n'))

                console.log(chalk.yellow(
                    '正在启动server服务,稍等~.\n'
                ))
            })

        })
    })
} else {
    console.log(chalk.blue('构建开始!\n'))
    spinner.stop();
    spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: process.platform === 'win32' //设置 shell 选项为 true 以隐式地调用 cmd
    });
}