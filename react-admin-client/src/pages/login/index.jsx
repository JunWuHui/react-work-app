import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, message } from "antd";
import logoImg from "./img/logo.png";
import bgImgOne from "./img/login-bg01.png";
import bgImgTwo from "./img/login-bg02.png";

import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import "./index.scss";

class LoginPage extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      const { username, password } = values;
      const res = await reqLogin(username, password);

      try {
        if (res.status === 0) {
          message.success("登陆成功!");
          //保存user
          const user = res.data;
          memoryUtils.user = user;
          storageUtils.saveUser(user);
          //登陆成功跳转到管理页面
          this.props.history.replace("/");
        } else {
          message.error(res.msg);
        }
      } catch (error) {
        alert("请求出错了" + error.message);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const user = memoryUtils.user;
    if (user && user._id) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-page">
        <div className="login-box">
          <div className="left">
            <img src={bgImgOne} alt="login" />
          </div>
          <div className="middle">
            <h4>豆豆童画馆</h4>
            <p>
              豆豆童画馆，旨在培养增强孩子的专注力，锻炼孩子的审美，开拓孩子的梦想。我们不止是一个优秀的美术教育机构，更是孩子和您一段珍贵的童年。
            </p>
            <img src={bgImgTwo} alt="login" />
          </div>
          <div className="right">
            <img className="logo" src={logoImg} alt="logo" />
            <div className="login-mod">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("username", {
                    rules: [{ required: true, message: "请输入账号!" }]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="请输入账号"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: "请输入密码!" }
                      // { min: 6, message: "至少输入六位密码!" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="请输入密码"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    登陆
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className="copy-box">
          赣ICP备08102442号-1 2007-2018 MIAOV.COM 版权所有
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "horizontal_login" })(LoginPage);
