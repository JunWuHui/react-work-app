import React, { Component } from "react";
import { Form, Card, Input, Icon, Button, Cascader } from "antd";
import { reqCategorys } from "../../api";
import PicturesWall from "./pctures-wall";

import "./product-add-update.scss";

const { TextArea } = Input;

class ProductAddUpdate extends Component {
  state = {
    options: []
  };

  getCategorys = async parentId => {
    const result = await reqCategorys(parentId);
    //console.log(result);
    if (result.status === 0) {
      const categorys = result.data;
      //如果是一级列表
      if (parentId === "0") {
        this.initOption(categorys);
      } else {
        //否则是2级
        return categorys;
      }
    }
  };

  initOption = async categorys => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }));

    //如果是一个2级分类商品更新
    const { isUpdate, product } = this;
    const { categoryId, pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      //获取对应的2级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      //生成2级下拉列表的option
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }));
      //找到当前商品对应一级option对象
      const targetOption = options.find(option => option.value === pCategoryId);
      //关联对应的一级option
      targetOption.children = childOptions;
    }

    this.setState({
      options: [...options]
    });
  };

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;
    //根据选中的分类获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      //生成一个2级列表的option
      const childOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }));
      //关联到当前的options上
      targetOption.children = childOptions;
    } else {
      //没有2级
      targetOption.isLeaf = true;
    }
    //更新状态
    this.setState({
      options: [...this.state.options]
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        alert("666");
      }
    });
  };

  validatorPrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback();
    } else {
      callback("不能输入小于0的数字！");
    }
  };

  componentDidMount() {
    this.getCategorys("0");
  }

  componentWillMount() {
    //取出携带的state
    const product = this.props.location.state; //如果是添加没值   否则有值
    //保存是否是更新标识
    this.isUpdate = !!product;
    this.product = product || {};
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 8 }
      }
    };

    const { getFieldDecorator } = this.props.form;
    const { isUpdate, product } = this;

    const categoryIds = []; //用来接收级联分类ID数组
    const { categoryId, pCategoryId } = product;

    if (isUpdate) {
      if (pCategoryId === "0") {
        //商品是一个一级分类的商品
        categoryIds.push(categoryId);
      } else {
        //商品是一个2级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    } else {
    }

    const title = (
      <span>
        <Button
          type="link"
          size={"small"}
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          <Icon type="left" />
        </Button>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    return (
      <div className="product-add-update">
        <Card title={title}>
          <Form {...formItemLayout}>
            <Form.Item label="商品名称">
              {getFieldDecorator("name", {
                initialValue: product.name,
                rules: [
                  {
                    required: true,
                    message: "请输入商品名称！"
                  }
                ]
              })(<Input placeholder="请输入商品名称" />)}
            </Form.Item>
            <Form.Item label="商品描述">
              {getFieldDecorator("desc", {
                initialValue: product.desc,
                rules: [
                  {
                    required: true,
                    message: "请输入商品描述!"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入商品描述!"
                  autosize={{ minRows: 6, maxRows: 6 }}
                />
              )}
            </Form.Item>
            <Form.Item label="商品价格">
              {getFieldDecorator("price", {
                initialValue: product.price,
                rules: [
                  {
                    required: true,
                    message: "请输入商品价格!"
                  },
                  {
                    validator: this.validatorPrice
                  }
                ]
              })(<Input type="number" addonAfter="元" />)}
            </Form.Item>
            <Form.Item label="商品分类">
              {getFieldDecorator("categoryIds", {
                initialValue: [],
                rules: [
                  {
                    required: true,
                    message: "请选择商品分类!"
                  }
                ]
              })(
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  placeholder="请选择分类"
                />
              )}
            </Form.Item>
            <Form.Item label="商品图片">
              <Input />
            </Form.Item>
            <Form.Item label="商品详情">
              <div>
                <PicturesWall />
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSubmit}>
                确认添加
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(ProductAddUpdate);
