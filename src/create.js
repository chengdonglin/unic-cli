/*
 * @Author: chengDong
 * @Date: 2019-12-04 21:13:34
 * @LastEditTime: 2019-12-05 09:29:29
 * @LastEditors: chengDong
 * @Description: create project code
 * @FilePath: \node-dev-template\src\create.js
 */

/**
  * 拉取自己所有的项目, 选择完之后, 选择版本
  * https://api.github.com/users/chengdonglin/repos
  */

const axios = require('axios');

const fetchRepoList = async () => {
  const { data } = await axios.default.get('https://api.github.com/users/chengdonglin/repos');
  return data;
};

module.exports = async (projectName) => {
  console.log(projectName);
  let repos = await fetchRepoList();
  repos = repos.map((item) => item.name);
  console.log(repos);
};
