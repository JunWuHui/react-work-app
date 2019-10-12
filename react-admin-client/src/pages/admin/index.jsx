import React, { Component } from "react";
import { Layout, Breadcrumb, Icon } from "antd";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "./admin.scss";

import Home from "../home";
import Category from "../category";
import Product from "../product";
import Role from "../role";
import User from "../user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Headers from "../../components/header";
import menuList from "../../config/menuConfig";

const { Header, Content, Footer, Sider } = Layout;

class Admin extends Component {
  getTitle = () => {
    let breadcrumbs = {};
    const path = this.props.location.pathname;
    //console.log(path);
    menuList.forEach(item => {
      //console.log(item);
      if (item.key === path) {
        breadcrumbs.title = item.title;
        breadcrumbs.icon = item.icon;
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path);
        if (cItem) {
          breadcrumbs.title = cItem.title;
          breadcrumbs.icon = cItem.icon;
        }
      }
    });
    return breadcrumbs;
  };

  render() {
    const user = memoryUtils.user;
    const { title, icon } = this.getTitle();
    //console.log(title);
    this.getTitle();
    if (!user || !user._id) {
      return <Redirect to="/login" />;
    }
    return (
      <Layout className="admin">
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0
          }}
        >
          <LeftNav />
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Headers />
          </Header>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="">
              <Icon type={icon || "home"} />
              <span>{title}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div
              style={{ padding: 24, background: "#fff", textAlign: "center" }}
            >
              <Switch>
                <Redirect from="/" exact to="/home" />
                <Route path="/home" component={Home} />
                <Route path="/category" component={Category} />
                <Route path="/product" component={Product} />
                <Route path="/role" component={Role} />
                <Route path="/user" component={User} />
                <Route path="/charts/bar" component={Bar} />
                <Route path="/charts/line" component={Line} />
                <Route path="/charts/pie" component={Pie} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            推荐使用谷歌浏览器，以获得更加页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Admin);
