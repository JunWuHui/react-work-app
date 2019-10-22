import React, { Component } from "react";
import { Card, Icon, Button, List } from "antd";

import { BASE_IMG_URL } from "../../utils/contants";
import { reqCategory } from "../../api";
import memoryUtils from "../../utils/memoryUtils";

import "./product-detail.scss";

export default class ProductDetail extends Component {
  state = {
    cName1: "", //一级分类名称
    cName2: "" //二级分类名称
  };

  async componentDidMount() {
    console.log(memoryUtils.product);
    // 得到当前商品的分类ID
    const { pCategoryId, categoryId } = memoryUtils.product;
    if (pCategoryId === "0") {
      // 一级分类下的商品
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      // 二级分类下的商品
      /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      const result2 = await reqCategory(categoryId) // 获取二级分类
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId)
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({
        cName1,
        cName2
      });
    }
  }

  /*
  在卸载之前清除保存的数据
  */
  componentWillUnmount() {
    memoryUtils.product = {};
  }

  render() {
    const { name, desc, price, detail, imgs } = memoryUtils.product;
    const { cName1, cName2 } = this.state;
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
        <span>商品详情</span>
      </span>
    );
    return (
      <div className="product-detail">
        <Card title={title}>
          <List>
            <List.Item>
              <p className="title">商品名称：</p>
              <span className="desc">{name}</span>
            </List.Item>
            <List.Item>
              <p className="title">商品描述：</p>
              <span className="desc">{desc}</span>
            </List.Item>
            <List.Item>
              <p className="title">商品价格：</p>
              <span className="desc">¥{price}</span>
            </List.Item>
            <List.Item>
              <p className="title">所属分类：</p>
              <span className="desc">
                {cName1}
                {cName2 ? " / " + cName2 : ""}
              </span>
            </List.Item>
            <List.Item>
              <p className="title">商品图片：</p>
              <div className="imgs">
                {imgs.map(img => {
                  return (
                    <div className="img-item" key={img}>
                      <img src={BASE_IMG_URL + img} alt={img} />
                    </div>
                  );
                })}
              </div>
            </List.Item>
            <List.Item>
              <p className="title">商品详情：</p>
              <div className="text-box">
                <p
                  className="text"
                  dangerouslySetInnerHTML={{ __html: detail }}
                ></p>
              </div>
            </List.Item>
          </List>
        </Card>
      </div>
    );
  }
}
