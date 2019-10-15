import React, { Component } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import { PAGE_SIZE } from "../../utils/contants";
import memoryUtils from "../../utils/memoryUtils";
//import storageUtils from "../../utils/storageUtils";
import moment from "moment";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import storageUtils from "../../utils/storageUtils";

export default class Role extends Component {
  state = {
    roles: [],
    role: {},
    isShowAdd: false,
    isShowAuth: false
  };

  constructor(props) {
    super(props);

    this.auth = React.createRef();
  }

  initColums = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
        render: create_time => moment(create_time).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        key: "auth_time",
        render: auth_time => moment(auth_time).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
        key: "auth_name"
      }
    ];
  };

  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      //console.log(roles);
      this.setState({
        roles
      });
    }
  };

  onRow = role => {
    return {
      onClick: e => {
        //console.log(role);
        this.setState({
          role
        });
      }
    };
  };

  handleCancel = e => {
    //console.log(e);
    this.form.resetFields();
    this.setState({
      isShowAdd: false
    });
  };

  handleCancel2 = e => {
    this.setState({
      isShowAuth: false
    });
  };

  addRole = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确定框
        this.setState({
          isShowAdd: false
        });
        // 收集输入数据
        const { roleName } = values;
        this.form.resetFields();

        // 请求添加
        const result = await reqAddRole(roleName);
        // 根据结果提示/更新列表显示
        if (result.status === 0) {
          message.success("添加角色成功");
          // this.getRoles()
          // 新产生的角色
          const role = result.data;

          // 更新roles状态: 基于原本状态数据更新
          this.setState(state => ({
            roles: [...state.roles, role]
          }));
        } else {
          message.success("添加角色失败");
        }
      }
    });
  };

  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    });

    const role = this.state.role;
    // 得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = memoryUtils.user.username;

    // 请求更新
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {};
        storageUtils.removeUser();
        this.props.history.replace("/login");
        message.warn("当前用户角色权限修改了,请重新登陆！");
      } else {
        message.success("设置角色权限成功");
        this.setState({
          roles: [...this.state.roles]
        });
      }
    } else {
      message.error("设置角色权限失败！");
    }
  };

  componentWillMount() {
    this.initColums();
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;
    const locale = { emptyText: "暂无角色" };

    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <div>
        <Card title={title} style={{ textAlign: "left" }}>
          <Table
            columns={this.columns}
            dataSource={roles}
            rowKey="_id"
            bordered
            locale={locale}
            pagination={{ defaultPageSize: PAGE_SIZE }}
            rowSelection={{
              type: "radio",
              selectedRowKeys: [role._id],
              onSelect: role => {
                // 选择某个radio时回调
                this.setState({
                  role
                });
              }
            }}
            onRow={this.onRow}
          />
          <Modal
            title="添加角色"
            cancelText="取消"
            okText="确认添加"
            visible={isShowAdd}
            onOk={this.addRole}
            onCancel={this.handleCancel}
          >
            <AddForm
              setForm={form => {
                this.form = form;
              }}
            />
          </Modal>
          <Modal
            title="设置角色权限"
            cancelText="取消"
            okText="确认"
            visible={isShowAuth}
            onOk={this.updateRole}
            onCancel={this.handleCancel2}
          >
            <AuthForm
              ref={this.auth}
              role={role}
              setForm={form => {
                this.form = form;
              }}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}
