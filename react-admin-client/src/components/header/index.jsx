import React, { Component } from "react";
import { Avatar, Modal, Button } from "antd";
import moment from "moment";
import imgAvatar from "../../assets/img/touxiang1.png";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { withRouter } from "react-router-dom";
import "./header.scss";
import { rqWeather } from "../../api/index";

const { confirm } = Modal;

class Header extends Component {
  state = {
    weather: "",
    currentTime: null
  };

  dateTime = () => {
    this.timeInterval = setInterval(() => {
      const currentTime = moment().format("h:mm:ss");
      this.setState({ currentTime });
    }, 1000);
  };

  getWeather = async () => {
    const { weather } = await rqWeather("南昌");
    //console.log(weather);
    this.setState({ weather });
  };

  componentDidMount() {
    this.dateTime();
    this.getWeather();
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  loginOut = () => {
    let _this = this;
    confirm({
      content: "您确定是否要退出登陆?",
      cancelText: "取消",
      okText: "确定",
      onOk() {
        storageUtils.removeUser();
        memoryUtils.user = {};
        _this.props.history.replace("/login");
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  render() {
    const { weather, currentTime } = this.state;
    const username = memoryUtils.user.username;
    return (
      <div className="header">
        <div className="header-box">
          <Avatar className="avatar" size={32} src={imgAvatar} />
          <span>欢迎您！{username}</span>
          <Button type="link" size={"small"} onClick={this.loginOut}>
            退出
          </Button>
          <span>{moment().format("YYYY-MM-DD")}</span>
          <span>{currentTime}</span>
          <span>{weather}</span>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
