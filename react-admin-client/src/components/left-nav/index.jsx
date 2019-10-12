import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import Login from "../../assets/img/logo.png";
import "./left-nav.scss";
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class leftNav extends Component {
  getMenuNode = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        const path = this.props.location.pathname;
        //查找一个与当前请求路径匹配的子item
        //const cItem = item.children.find(cItem => cItem.key === path);
        const cItem = item.children.find(
          cItem => path.indexOf(cItem.key) === 0
        );
        //如果存在，那么当前子列表需要展开
        if (cItem) {
          this.openKey = item.key;
        }

        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNode(item.children)}
          </SubMenu>
        );
      }
    });
  };

  //在第一次render()之前准备执行一次 为第一个render()准备数据（必须同步)
  componentWillMount() {
    this.menuNode = this.getMenuNode(menuList);
  }

  render() {
    //得到当前的请求路径
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }

    //console.log(this.props);
    //得到需要打开子列表菜单的key
    const openKey = this.openKey;
    return (
      <div className="left-nav">
        <div className="logo">
          <img src={Login} alt="" />
        </div>
        <Menu
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
        >
          {this.menuNode}
        </Menu>
      </div>
    );
  }
}

export default withRouter(leftNav);
