/*
 * @Description: 项目核心入口
 * @Version: 2.0
 * @Autor: chengDong
 * @Date: 2019-12-08 19:42:35
 * @LastEditors: chengDong
 * @LastEditTime: 2019-12-13 21:33:06
 */


const commander = require('commander');
const path = require('path');
const { version } = require('./constsants');
// un-cli create xxx

const mapAction = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'un-cli create <projectName>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'configure a project',
    examples: [
      'un-cli config set <key> <value>',
      'un-cli config get <key>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not find',
    examples: [

    ],
  },
};


Reflect.ownKeys(mapAction).forEach((action) => {
  commander.command(action)// 配置命令的名字
    .alias(mapAction[action].alias) // 命令的别名
    .description(mapAction[action].description) // 命令的描述
    .action(() => {
      if (action === '*') {
        console.log(mapAction[action].description);
      } else {
        // un-cli create xxx
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});


/**
 * 监听用户的help操作
 */
commander.on('--help', () => {
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach((example) => {
      console.log(` ${example}`);
    });
  });
});
// 解析用户传递的参数
commander.version(version).parse(process.argv);
