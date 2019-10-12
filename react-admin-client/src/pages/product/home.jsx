import React, { Component } from "react";
import { Table, Card, Button, Icon, Select, Input, message } from "antd";
import {
  reqProducts,
  reqSearchProducts,
  reqUpdateProductStatus
} from "../../api";
import { PAGE_SIZE } from "../../utils/contants";

const { Option } = Select;

export default class ProductHome extends Component {
  state = {
    total: 0,
    products: [],
    loading: false,
    searchName: "", //搜索的关键字
    searchType: "productName" //搜索类型
  };

  getProducts = async pageNum => {
    this.setState({ loading: true });
    this.pageNum = pageNum;
    const pageSize = PAGE_SIZE;
    const { searchName, searchType } = this.state;
    let result;
    //如果有搜索关键值，说明要做搜索分页请求
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize,
        searchName,
        searchType
      });
    } else {
      //一般请求
      //console.log(pageNum, pageSize); //1,3
      result = await reqProducts(pageNum, pageSize);
    }

    if (result.status === 0) {
      this.setState({ loading: false });
      //console.log(result.data);
      const total = result.data.total;
      const products = result.data.list;
      this.setState({
        total,
        products
      });
    }
  };

  updateStatus = async (productId, status) => {
    const result = await reqUpdateProductStatus(productId, status);
    if (result.status === 0) {
      message.success("更新商品成功！");
      this.getProducts(this.pageNum);
    }
  };

  componentDidMount() {
    this.getProducts(1);
  }

  initCloums = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc",
        key: "age"
      },
      {
        title: "价格",
        dataIndex: "price",
        key: "price",
        render: price => <span>¥{price}</span>
      },
      {
        title: "状态",
        key: "status",
        render: product => {
          const { status, _id } = product;
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <p style={{ margin: 0 }}>{status === 1 ? "在售" : "已下架"}</p>
            </span>
          );
        }
      },
      {
        title: "操作",
        key: "action",
        render: product => (
          <span>
            <Button
              type="link"
              onClick={() => {
                this.props.history.push("/product/detail", { product });
              }}
            >
              详情
            </Button>
            <Button
              type="link"
              onClick={() => {
                this.props.history.push("/product/addupdate", product);
              }}
            >
              修改
            </Button>
          </span>
        )
      }
    ];
  };

  componentWillMount() {
    this.initCloums();
  }

  render() {
    const { products, loading, total, searchName, searchType } = this.state;
    //console.log(products);
    const title = (
      <span style={{ float: "left" }}>
        <Select
          defaultValue={searchType}
          style={{ width: 120 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="输入搜索内容"
          style={{ width: 200, marginLeft: 10, marginRight: 10 }}
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type="primary"
        onClick={() => {
          this.props.history.push("/product/addupdate");
        }}
      >
        <Icon type="plus" />
        <span>添加商品</span>
      </Button>
    );
    const locale = { emptyText: "暂无数据" };
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            rowKey="_id"
            bordered
            columns={this.columns}
            dataSource={products}
            locale={locale}
            loading={loading}
            pagination={{
              total,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              onChange: this.getProducts
            }}
          />
        </Card>
      </div>
    );
  }
}
