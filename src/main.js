/*
 * @Description: 业务逻辑核心文件
 * @Author: chengDong
 * @Date: 2019-12-04 17:23:44
 * @LastEditTime: 2019-12-04 21:19:54
 * @LastEditors: Please set LastEditors
 */

const commander = require('commander');
const {version} = require('./constsants')
const path = require('path')
// un-cli create xxx

const mapAction ={
    create:{
        alias:'c',
        description:'create a project',
        examples:[
            'un-cli create <projectName>'
        ]
    },
    config: {
        alias:'conf',
        description:'configure a project',
        examples:[
            'un-cli config set <key> <value>',
            'un-cli config get <key>'
        ]
    },
    '*': {
        alias: '',
        description: 'command not find',
        "examples":[
            
        ]
    }
}


Reflect.ownKeys(mapAction).forEach((action) => { 
    commander.command(action)// 配置命令的名字
    .alias(mapAction[action].alias) // 命令的别名
    .description(mapAction[action].description) // 命令的描述
    .action(() => {
        if(action === '*') { 
            console.log(mapAction[action].description)
        } else {
            // un-cli create xxx
            require(path.resolve(__dirname,action))(...process.argv.slice(3))
        }
    })
})


/**
 * 监听用户的help操作
 */
commander.on('--help',() => {
    Reflect.ownKeys(mapAction).forEach((action) => {
        mapAction[action].examples.forEach(example => {
            console.log(` ${example}`)
        })
    })
})
// 解析用户传递的参数
commander.version(version).parse(process.argv)