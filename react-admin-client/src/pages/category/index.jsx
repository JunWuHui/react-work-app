import React, { Component } from "react";
import { Card, Button, Icon, Table, message, Modal } from "antd";
import {
  reqCategorys,
  reqUpdateCategory,
  reqAddCategory
} from "../../api/index";

import AddForm from "./add-form";
import UpdataForm from "./updata-form";

import "./category.scss";

export default class Category extends Component {
  state = {
    categorys: [],
    loading: false,
    parentId: "0",
    parentName: "",
    subCategorys: [],
    showStatus: 0
  };
  //-------------------------------------------------------------------------------------
  getCategorys = async parentId => {
    this.setState({ loading: true });
    parentId = parentId || this.state.parentId;
    const result = await reqCategorys(parentId);
    //console.log(result);
    if (result.status === 0) {
      this.setState({ loading: false });
      const categorys = result.data;
      if (parentId === "0") {
        this.setState({
          categorys
        });
      } else {
        this.setState({
          subCategorys: categorys
        });
      }
    } else {
      message.error("获取列表失败");
    }
  };

  showSubCategorys = category => {
    this.setState(
      {
        parentId: category._id,
        parentName: category.name
      },
      () => {
        //console.log(this.state.parentId);
        this.getCategorys();
      }
    );
  };

  showCategorys = () => {
    this.setState({
      parentId: "0",
      subCategorys: [],
      parentName: ""
    });
  };

  initColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "操作",
        width: 240,
        key: "action",
        render: category => (
          <span>
            <Button
              type="link"
              style={{ marginRight: 10 }}
              onClick={() => {
                this.showUpdata(category);
              }}
            >
              修改分类
            </Button>
            {this.state.parentId === "0" ? (
              <Button
                type="link"
                onClick={() => {
                  this.showSubCategorys(category);
                }}
              >
                查看子分类
              </Button>
            ) : null}
          </span>
        )
      }
    ];
  };

  showAddHandleOk = () => {
    this.setState({
      showStatus: 1
    });
  };

  addHandleOk = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showStatus: 0
        });
        const { parentId, categoryName } = values;
        //console.log(parentId, categoryName);
        const result = await reqAddCategory(parentId, categoryName);
        this.form.resetFields();

        if (result.status === 0) {
          if (parentId === this.state.parentId) {
            this.getCategorys();
          } else if (parentId === "0") {
            this.getCategorys("0");
          }
        }
      }
    });
  };

  showUpdata = category => {
    //console.log("category", category);
    this.category = category;
    this.setState({
      showStatus: 2
    });
  };
  updataHandleOk = async category => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确定框
        this.setState({
          showStatus: 0
        });
        //准备修改的数据并发送
        const categoryId = this.category._id;
        const categoryName = this.form.getFieldValue("categoryName");
        this.form.resetFields();
        //console.log(this.form.getFieldValue("categoryName"));
        const result = await reqUpdateCategory({ categoryId, categoryName });
        //console.log(result);
        if (result.status === 0) {
          //重新渲染
          this.getCategorys();
        }
      }
    });
  };

  handleCancel = e => {
    //console.log(e);
    this.form.resetFields();
    this.setState({
      showStatus: 0
    });
  };
  //-------------------------------------------------------------------------------------
  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const {
      categorys,
      loading,
      parentId,
      parentName,
      subCategorys,
      showStatus
    } = this.state;

    const title =
      parentId === "0" ? (
        <Button size={"small"} type="link" className="parentName">
          一级分类列表
        </Button>
      ) : (
        <span className="sub-parentName">
          <Button type="link" size={"small"} onClick={this.showCategorys}>
            一级分类列表
          </Button>
          <Icon type="right" style={{ marginRight: 10 }} />
          {parentName}
        </span>
      );
    const extra = (
      <Button type="primary" onClick={this.showAddHandleOk}>
        <Icon type="plus" />
        <span>添加</span>
      </Button>
    );

    const category = this.category || {};
    //console.log(category);
    const locale = { emptyText: "暂无分类" };
    return (
      <div className="category">
        <Card title={title} extra={extra}>
          <Table
            size="middle"
            bordered
            columns={this.columns}
            dataSource={parentId === "0" ? categorys : subCategorys}
            rowKey="_id"
            pagination={{ defaultPageSize: 6, showQuickJumper: true }}
            loading={loading}
            locale={locale}
          />
          <Modal
            title="添加分类"
            cancelText="取消"
            okText="确认添加"
            visible={showStatus === 1}
            onOk={this.addHandleOk}
            onCancel={this.handleCancel}
          >
            <AddForm
              categorys={categorys}
              parentId={parentId}
              setForm={form => {
                this.form = form;
              }}
            />
          </Modal>
          <Modal
            title="修改分类"
            cancelText="取消"
            okText="确认修改"
            visible={showStatus === 2}
            onOk={this.updataHandleOk}
            onCancel={this.handleCancel}
          >
            <UpdataForm
              categoryName={category.name}
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
