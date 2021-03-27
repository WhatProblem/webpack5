import '@babel/polyfill';
import './style/index.less';
// import './a.txt'

function defineLoader() {
  const str1 = '自定义变量1';
  const str2 = '自定义变量2';
  console.log('测试自定义loader', str1, str2);
}
defineLoader();
