/*
 * @Description: clone项目模板引擎
 * @Version: 2.0
 * @Autor: chengDong
 * @Date: 2019-12-08 19:42:35
 * @LastEditors: chengDong
 * @LastEditTime: 2019-12-14 11:22:34
 */

/**
 * 拉取自己所有的项目, 选择完之后, 选择版本
 * https://api.github.com/users/chengdonglin/repos
 */

const Inquirer = require('inquirer');
const { promisify } = require('util');
const chalk = require('chalk');
let ncp = require('ncp');
const path = require('path');
const fs = require('fs');
const { targetAction } = require('./constsants');
const { fetchRepoBranches, fetchRepoList, download, waitingloading} = require('./tools')
// 遍历文件夹, 判断是否需要渲染
const Metalsmith = require('metalsmith')
// consolidate 统一所有的模板引擎
let { render } = require('consolidate').ejs
ncp = promisify(ncp);
render = promisify(render)



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
      throw new Error(chalk.red('Sorry, project has already exists'));
    }
  }
  console.log(chalk.redBright('clone the project, please waiting ....'));
  // 如果有ask.js, 则表示是复杂模板, 渲染在拷贝
  if (!fs.existsSync(path.join(result,'ask.js'))) {
    // 普通template, 直接copy
    console.log(chalk.cyanBright('this a simple template ......'))
    await ncp(result, path.resolve(projectName));
  } else {
    console.log(chalk.cyanBright('this a complex template, there are some question you should confirm'))
    // 用户填写的信息去渲染模板
   await new Promise((resolve,reject) => {
    Metalsmith(__dirname) // 传入路径,默认会遍历当前路径下的src文件夹
    .source(result)
    .destination(path.resolve(projectName))
    .use(async(files, metal, done) => {
      const args = require(path.join(result,'ask.js'))
      const obj = await Inquirer.prompt(args) // 你填写的值
      const meta = metal.metadata()
      Object.assign(meta,obj)
      delete files['ask.js']
      done()
    })
    .use((files, metal,done) => {
      const obj = metal.metadata()
      Reflect.ownKeys(files).forEach(async (file) => {
        if (file.includes('js') || file.includes('json')) {
          let content =  files[file].contents.toString()
          if (content.includes('<%')) {
            content = await render(content,obj)
            files[file].contents = Buffer.from(content)
          }
        }
      })
      done()
    })
    .build((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
   })
   console.log(chalk.bgGreen('clone the template success, happy code with it'))
  }  
};
