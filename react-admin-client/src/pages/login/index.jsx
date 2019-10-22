import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, message } from "antd";

import { connect } from "react-redux";
import { login } from "../../redux/actions";

import logoImg from "./img/logo.png";
import bgImgOne from "./img/login-bg01.png";
import bgImgTwo from "./img/login-bg02.png";

import "./index.scss";

class LoginPage extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      const { username, password } = values;
      if (!err) {
        // 调用分发异步action的函数 => 发登陆的异步请求, 有了结果后更新状态
        this.props.login(username, password);
      } else {
        message.error("检测失败！");
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let user = this.props.user;
    if (user && user._id) {
      return <Redirect to="/home" />;
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
            <div className={user.errorMsg ? "error-msg show" : "error-msg"}>
              {user.errorMsg}
            </div>
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

const WrapLogin = Form.create()(LoginPage);
export default connect(
  state => ({ user: state.user }),
  { login }
)(WrapLogin);
