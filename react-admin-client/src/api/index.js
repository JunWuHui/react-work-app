import ajax from './ajax'
import jsonp from 'jsonp';
import {
  message
} from 'antd';

// 0. 定义基础路径
const BASE_URL = '';

// 1. 用户登录
export const reqLogin = (username, password) => ajax(BASE_URL + '/login', {
  username,
  password
}, 'POST');
// 2. 添加用户
export const reqAddUser = (user) => ajax(BASE_URL + '/manage/user/add', user, 'POST');
// 3.获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {
  parentId
})
// 4.添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {
  parentId,
  categoryName
}, 'POST')
// 5.更新品类名称
export const reqUpdateCategory = ({
  categoryId,
  categoryName
}) => ajax('/manage/category/update', {
  categoryId,
  categoryName
}, 'POST')

// 根据分类 ID 获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {
  categoryId
})
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {
  pageNum,
  pageSize
})

// 根据 ID/Name 搜索产品分页列表
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchType,
  searchName
}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})
// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'post')
// 对商品进行上架/下架处理
export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {
  productId,
  status
}, 'POST')
// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {
  name
}, 'post')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {
  roleName
}, 'POST')
// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')
// 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')
// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {
  userId
}, 'POST')
/*
json获取接口的函数
*/
export const rqWeather = (city) => {
  return new Promise((resolve, reject) => {
    let cityCode = encodeURIComponent(city);
    //console.log(cityCode)
    const url = `http://v.juhe.cn/weather/index?format=2&cityname=${cityCode}&key=4e47e947291620137ad2b6717492d965`;
    jsonp(url, {}, (err, data) => {
      //console.log(data)
      if (!err && data.resultcode === "200") {
        const {
          weather
        } = data.result.today;
        resolve({
          weather
        });
      } else {
        message.error('天气数据获取失败！');
      }
    })
  })
}