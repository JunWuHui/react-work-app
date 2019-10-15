import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;

class addForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired
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
    const { getFieldDecorator } = this.props.form;
    const { categorys, parentId } = this.props;
    return (
      <div>
        <Form>
          <Form.Item label="分类所属">
            {getFieldDecorator("parentId", {
              initialValue: parentId
            })(
              <Select>
                <Option value="0">请选择一级分类</Option>
                {categorys.map(item => {
                  return (
                    <Option value={item._id} key={item._id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="分类名称">
            {getFieldDecorator("categoryName", {
              initialValue: "",
              rules: [{ required: true, message: "必须输入分类名称!" }]
            })(<Input placeholder="请输入分类名称" />)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(addForm);
