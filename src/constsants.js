/*
 * @Description: 常量文件
 * @Author: chengDong
 * @Date: 2019-12-04 17:43:16
 * @LastEditTime: 2019-12-08 20:32:23
 * @LastEditors: Please set LastEditors
 */
const { version } = require('../package.json');

const downloadDir = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

module.exports = {
  version,
  downloadDir,
};
