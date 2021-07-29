import { Button, Form, Input, Modal, Card, Upload, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const Space = (props) => {
  const { user, isLoggedIn, token } = props.auth;
  const { type, spotId, desc, images } = props;

  const [title, setTitle] = useState("");
  const [spaceList, setSpaceList] = useState([]);

  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (type) {
      switch (type) {
        case "lounge":
          setTitle("라운지");
          break;
        case "meeting":
          setTitle("미팅룸");
          break;
        case "coworking":
          setTitle("코워킹룸");
          break;

        case "locker":
          setTitle("락커");
          break;
        default:
          break;
      }
    }

    if (spotId) {
      const config = {
        method: "post",
        url: `${process.env.BACKEND_API}/spot/space/list`,
        headers: {
          Authorization: decodeURIComponent(token),
        },
        data: {
          spot_id: spotId,
          type: type,
        },
      };

      axios(config)
        .then(function (response) {
          setSpaceList(response.data.items);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (desc) {
      form.setFieldsValue({
        desc: desc,
      });
    }
  }, []);

  const handleSpotSpaceInfoUpdate = (values) => {
    const formData = new FormData();

    formData.append("spot_id", spotId);
    formData.append(`${type}_desc`, values.desc);

    if (values.images) {
      values.images.map((image, index) => {
        console.log(`${type}${index + 1}`);
        formData.append(`${type}${index + 1}`, image.originFileObj);
      });
    }

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/spot/update`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        setOkModalVisible(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFileChange = ({ fileList }) => {
    form.setFieldsValue({ images: fileList });
    setFileList(fileList);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  return (
    <>
      <Card title={title} bodyStyle={{ padding: "1rem" }} className="mb-4">
        <Form form={form} onFinish={handleSpotSpaceInfoUpdate}>
          <Form.Item name="images" label="대표 이미지 (최대 5장까지 첨부 가능)">
            <Upload
              name="image"
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
              onPreview={handlePreview}
            >
              {fileList.length < 5 ? (
                <Button icon={<UploadOutlined />}>업로드</Button>
              ) : null}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={() => {
                setPreviewVisible(false);
              }}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item name="desc" label="설명">
            <Input.TextArea rows={3}></Input.TextArea>
          </Form.Item>
          <Form.Item name="list" label={`${title} 리스트`}>
            {spaceList &&
              spaceList.map((spaceObj) => {
                return <Tag key={spaceObj.space_id}>{spaceObj.space.name}</Tag>;
              })}
          </Form.Item>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            Router.push(`/spot/${spotId}/${type}`);
          }}
        >
          {`${title} 관리`}
        </Button>
      </Card>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Space);
