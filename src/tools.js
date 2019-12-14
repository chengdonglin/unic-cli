/*
 * @Description: 工具函数
 * @Version: 2.0
 * @Autor: chengDong
 * @Date: 2019-12-14 11:14:52
 * @LastEditors: chengDong
 * @LastEditTime: 2019-12-14 11:22:56
 */
const axios = require('axios');
let downloadGitRepo = require('download-git-repo');
const { promisify } = require('util');
downloadGitRepo = promisify(downloadGitRepo); // 异步api转promise
const ora = require('ora');
const { downloadDir } = require('./constsants');


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

module.exports = {
    fetchRepoList,
    fetchRepoBranches,
    download,
    waitingloading
}