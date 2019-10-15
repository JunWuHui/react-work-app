import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import PropTypes from "prop-types";
import menuList from '../../config/menuConfig';

const { TreeNode } = Tree;


class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  };

  constructor(props) {
    super(props);
    const {menus} = this.props.role;
    this.state = {
      checkedKeys: menus
    }
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  onCheck = checkedKeys => {
    //console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount () {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用
   */
  componentWillReceiveProps (nextProps) {
    //console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus
  }

  /*
  为父组件提交获取最新menus数据的方法
   */
  getMenus = () => this.state.checkedKeys;

  render() {
    const { role } = this.props;
    //console.log(role)
    const {checkedKeys} = this.state
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };

    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="角色名称">
            <Input value={role.name} disabled />
          </Form.Item>
          <Tree checkable defaultExpandAll={true} checkedKeys={checkedKeys} onCheck={this.onCheck}>
            <TreeNode title="平台权限" key="all">
              {this.treeNodes}
            </TreeNode>
        </Tree>
        </Form>
      </div>
    );
  }
}

export default AuthForm;
