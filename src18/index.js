import '@babel/polyfill';
import './style/index.less';
// import './a.txt'

function defineLoader() {
  const str1 = '自定义变量1';
  const str2 = '自定义变量2';
  console.log('测试自定义loader', str1, str2);
  
  const ele = document.getElementById('lazy')
  ele.onclick = function() {
    // 自定义打包后文件名称
    import(/* webpackChunkName: 'lazy' */ './lazy').then(res=>{
      console.log(res.default)
    })
  }
}
defineLoader();
