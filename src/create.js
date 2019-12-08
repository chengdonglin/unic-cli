/*
 * @Author: chengDong
 * @Date: 2019-12-04 21:13:34
 * @LastEditTime: 2019-12-08 19:55:43
 * @LastEditors: Please set LastEditors
 * @Description: create project code
 * @FilePath: \node-dev-template\src\create.js
 */

/**
 * 拉取自己所有的项目, 选择完之后, 选择版本
 * https://api.github.com/users/chengdonglin/repos
 */

const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');

/**
 * 获取远程模板
 */
const fetchRepoList = async () => {
  const { data } = await axios.default.get(
    'https://api.github.com/orgs/unic-lin/repos'
  );
  return data;
};

module.exports = async (projectName) => {
    const spinner = ora('fetching template ....');
    spinner.start();
  let repos = await fetchRepoList();
  spinner.succeed();
  repos = repos.map((item) => item.name);
  // 选择模板
  const { repo } = await Inquirer.prompt({
      name: 'repo', //获取选择的结果
      type:'list',
      choices:repos,
      message:'please choise a node template to create koa  web server to quick start development'
  })
  console.log(repo)
};
