/*
 * @Description: clone项目模板引擎
 * @Version: 2.0
 * @Autor: chengDong
 * @Date: 2019-12-08 19:42:35
 * @LastEditors: chengDong
 * @LastEditTime: 2019-12-13 22:41:40
 */

/**
 * 拉取自己所有的项目, 选择完之后, 选择版本
 * https://api.github.com/users/chengdonglin/repos
 */

const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');
const { promisify } = require('util');
const chalk = require('chalk')
let downloadGitRepo = require('download-git-repo');
let ncp = require('ncp');
const path = require('path');
const { downloadDir, targetAction } = require('./constsants');
const fs = require('fs')
downloadGitRepo = promisify(downloadGitRepo); // 异步api转promise
ncp = promisify(ncp);

/**
 * 获取远程模板
 */
const fetchRepoList = async () => {
  const { data } = await axios.default.get(
    'https://api.github.com/orgs/unic-lin/repos',
  );
  return data;
};

/**
 * 拉取分支
 */
const fetchRepoBranches = async (repo) => {
  const url = `https://api.github.com/repos/unic-lin/${repo}/branches`;
  const { data } = await axios.default.get(url);
  return data;
};

/**
 * loading函数
 * @param {*} Fn
 * @param {*} message
 */
const waitingloading = (Fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await Fn(...args);
  spinner.succeed();
  return result;
};

const download = async (repo, branch) => {
  let api = `unic-lin/${repo}`;
  if (branch) {
    api += `#${branch}`;
  }
  const dest = `${downloadDir}/${repo}`;
  await downloadGitRepo(api, dest);
  // 下载最终目录
  return dest;
};

module.exports = async (projectName) => {
  let repos = await waitingloading(fetchRepoList, chalk.green('fetching template ...'))();
  repos = repos.map((item) => item.name);
  // 选择模板
  const { repo } = await Inquirer.prompt({
    name: 'repo', // 获取选择的结果
    type: 'list',
    choices: repos,
    message: chalk.yellowBright('please choise a node template to create koa  web server to quick start development'),
  });
  // 选择branch
  const branches = await waitingloading(fetchRepoBranches, chalk.greenBright('fetching template branches ...'))(repo);
  // 选择模板
  const { branch } = await Inquirer.prompt({
    name: 'branch', // 获取选择的结果
    type: 'list',
    choices: branches,
    message: chalk.yellowBright('please choise a branch'),
  });
  const result = await waitingloading(download, chalk.greenBright('downloading template'))(repo, branch);
  // 简单模板, 直接拷贝当前到当前可执行目录, 项目是否以及存在, 如果存在提示当前已经存在
  if (fs.existsSync(path.resolve(projectName))) {
     const { targer } = await Inquirer.prompt({
      name: 'targer', // 获取选择的结果
      type: 'list',
      choices: targetAction,
      message: chalk.yellowBright('project has already exists, please choise a action to continue'),
    });
    if (targer === 'cancle') {
      throw new Error(chalk.red('Sorry, project has already exists'))
    }
  }
  console.log(chalk.redBright('clone the project, please waiting ....'))
  await ncp(result, path.resolve(projectName));
  // 复杂模板, 渲染在拷贝
};
