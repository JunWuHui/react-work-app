import React, { Component } from "react";
import { Upload, Icon, Modal, message } from "antd";
import { reqDeleteImg } from "../../api";
import PropTypes from "prop-types";
import { BASE_IMG_URL } from "../../utils/contants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  };

  state = {
    previewVisible: false, //标识是否显示大图预览界面
    previewImage: "", //大图的url
    fileList: [
      // {
      //   uid: "-1",
      //   name: "image.png",
      //   status: "done",
      //   url:
      //     "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      // }
    ]
  };
  constructor(props) {
    super(props);
    let fileList = [];
    //如果传入了imgs属性
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: "done",
        url: BASE_IMG_URL + img
      }));
    }
    this.state = {
      previewVisible: false, //标识是否显示大图预览界面
      previewImage: "", //大图的url
      fileList
    };
  }

  //获取已上传所有图片的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  handleChange = async ({ file, fileList }) => {
    // console.log(file);
    //如果图片上传成功 将当前上传的file的信息修正
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("图片上传成功!");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      } else {
        message.error("图片上传失败!");
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功!");
      } else {
        message.error("删除图片失败!");
      }
    }
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" //上传图片的地址
          accept="image/*" //只接收的图片格式
          name="image" //请求参数名
          listType="picture-card" //卡片样式
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
