/*
 * @Description: 项目常量
 * @Version: 2.0
 * @Autor: chengDong
 * @Date: 2019-12-08 19:42:35
 * @LastEditors: chengDong
 * @LastEditTime: 2019-12-13 22:12:41
 */

const { version } = require('../package.json');

const downloadDir = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

const targetAction = ['cancle', 'override'];

module.exports = {
  version,
  downloadDir,
  targetAction,
};
