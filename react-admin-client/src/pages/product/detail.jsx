import React, { Component } from "react";
import { Card, Icon, Button, List } from "antd";

import { BASE_IMG_URL } from "../../utils/contants";
import { reqCategory } from "../../api";

import "./product-detail.scss";

export default class ProductDetail extends Component {
  state = {
    cName1: "", //一级分类名称
    cName2: "" //二级分类名称
  };

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product;
    if (pCategoryId === "0") {
      //一级分类下的商品分类名
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({
        cName1
      });
    } else {
      // const result1 = await reqCategory(categoryId);
      // const result2 = await reqCategory(pCategoryId);
      //二级
      //const cName1 = result1.data.name;
      //const cName2 = result2.data.name;
      const results = await Promise.all([
        reqCategory(categoryId),
        reqCategory(pCategoryId)
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({
        cName1,
        cName2
      });
    }
  }

  render() {
    const {
      name,
      desc,
      price,
      //detail,
      imgs
    } = this.props.location.state.product;
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
                      <img src={BASE_IMG_URL + img} alt={img} />>
                    </div>
                  );
                })}
              </div>
            </List.Item>
            <List.Item>
              <p className="title">商品详情：</p>
              <div className="text-box">
                <p className="text">
                  不拔干，滋润而不油腻，道很好闻
                  ，比较好上色，包装精美，膏体质地棉柔而且颜色很饱满，雾面感超气质，滋润效果：魅可口红外壳手感很好，很自然，滋润而不油腻
                </p>
              </div>
            </List.Item>
          </List>
        </Card>
      </div>
    );
  }
}
