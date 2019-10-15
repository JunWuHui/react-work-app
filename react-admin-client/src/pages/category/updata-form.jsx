import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

class updataForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { categoryName } = this.props;
    return (
      <div>
        <Form>
          <Form.Item label="分类名称">
            {getFieldDecorator("categoryName", {
              initialValue: categoryName,
              rules: [{ required: true, message: "必须输入分类名称!" }]
            })(<Input placeholder="请输入分类名称" />)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(updataForm);
