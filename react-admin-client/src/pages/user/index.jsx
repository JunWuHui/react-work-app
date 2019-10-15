import React, { Component } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/contants";
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import UserForm from "./user-form";
import moment from "moment";

export default class User extends Component {
  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false // 是否显示确认框
  };

  componentWillMount() {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        key: "create_time",
        render: create_time => moment(create_time).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        key: "role_id",
        render: role_id => this.roleNames[role_id]
      },
      {
        title: "操作",
        key: "action",
        render: user => (
          <span>
            <Button type="link" onClick={() => this.showUpdate(user)}>
              修改
            </Button>
            <Button type="link" onClick={() => this.deleteUser(user)}>
              删除
            </Button>
          </span>
        )
      }
    ];
  }

  componentDidMount() {
    this.getUsers();
  }

  handleCancel = () => {
    this.setState({
      isShow: false
    });
  };

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  initRoleNames = roles => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    // 保存
    this.roleNames = roleNames;
  };

  /*
  显示添加界面
   */
  showAdd = () => {
    this.user = null; // 去除前面保存的user
    this.setState({ isShow: true });
  };

  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({
        users,
        roles
      });
    }
  };

  /*
  删除指定用户
   */
  deleteUser = user => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功!");
          this.getUsers();
        }
      }
    });
  };

  /*
  显示修改界面
   */
  showUpdate = user => {
    this.user = user; // 保存user
    this.setState({
      isShow: true
    });
  };

  /*
  添加/更新用户
   */
  addOrUpdateUser = async () => {
    this.setState({ isShow: false });

    // 1. 收集输入数据
    const user = this.form.getFieldsValue();
    this.form.resetFields();
    // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id;
    }

    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user);
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success(`${this.user ? "修改" : "添加"}用户成功`);
      this.getUsers();
    }
  };

  render() {
    const { users, roles, isShow } = this.state;
    const user = this.user || {};
    const locale = { emptyText: "暂无用户" };

    const title = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );

    return (
      <div>
        <Card title={title} style={{ textAlign: "left" }}>
          <Table
            columns={this.columns}
            dataSource={users}
            locale={locale}
            bordered
            rowKey="_id"
            pagination={{ defaultPageSize: PAGE_SIZE }}
          />
          <Modal
            title={user._id ? "修改用户" : "添加用户"}
            cancelText="取消"
            okText="提交"
            visible={isShow}
            onOk={this.addOrUpdateUser}
            onCancel={this.handleCancel}
          >
            <UserForm
              setForm={form => (this.form = form)}
              roles={roles}
              user={user}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}
