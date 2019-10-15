import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

class addForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.setForm(this.props.form);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="角色名称">
            {getFieldDecorator("roleName", {
              initialValue: "",
              rules: [{ required: true, message: "必须输入角色名称!" }]
            })(<Input placeholder="请输入角色名称" />)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(addForm);
