import React, { Component } from "react";
import { Form, Card, Input, Icon, Button, Cascader, message } from "antd";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";
import PicturesWall from "./pctures-wall";
import RichTextEditor from "./rich-text-editor";
import memoryUtils from "../../utils/memoryUtils";

import "./product-add-update.scss";

const { TextArea } = Input;

class ProductAddUpdate extends Component {
  constructor(props) {
    super(props);
    //创建用来保存ref标识的标签对象容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  state = {
    options: []
  };

  /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async parentId => {
    const result = await reqCategorys(parentId); // {status: 0, data: categorys}
    //console.log(result);
    if (result.status === 0) {
      const categorys = result.data;
      // 如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        // 二级列表
        return categorys; // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  };

  initOptions = async categorys => {
    // 根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false // 不是叶子
    }));

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    //console.log(product);
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表

      const subCategorys = await this.getCategorys(pCategoryId);

      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));

      const targetOption = options.find(option => option.value === pCategoryId);
      //console.log(targetOption);
      // 关联对应的一级option上
      targetOption.children = childOptions;

      // 找到当前商品对应的一级option对象
      console.log(options);
      //console.log(childOptions);
    }

    // 更新options状态
    this.setState({
      options
    });
  };

  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));
      // 关联到当前option上
      targetOption.children = childOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options]
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 1. 收集数据, 并封装成product对象
        const { name, desc, price, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();

        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId
        };
        // 如果是更新, 需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id;
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product);

        // 3. 根据结果提示
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功!`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败!`);
        }
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
    const product = memoryUtils.product; //如果是添加没值   否则有值
    //保存是否是更新标识
    this.isUpdate = !!product._id;
    this.product = product || {};
    //console.log(product);
  }

  /*
  在卸载之前清除保存的数据
  */
  componentWillUnmount() {
    memoryUtils.product = {};
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };

    const { getFieldDecorator } = this.props.form;
    const { isUpdate, product } = this;

    const categoryIds = []; //用来接收级联分类ID数组
    const { categoryId, pCategoryId, imgs, detail } = product;
    //console.log(categoryId);//5d9d9d7cb502241d09fe3ac8
    if (isUpdate) {
      if (pCategoryId === "0") {
        //商品是一个一级分类的商品
        categoryIds.push(categoryId);
      } else {
        //商品是一个2级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    //console.log(categoryIds);

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
    //console.log(this.state.options);
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
                initialValue: categoryIds,
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
              <PicturesWall ref={this.pw} imgs={imgs} />
            </Form.Item>
            <Form.Item
              label="商品详情"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 20 }}
            >
              <RichTextEditor ref={this.editor} detail={detail} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(ProductAddUpdate);
