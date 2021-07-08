import { Button, Form, Input, Modal, Card, Upload, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";

const Space = (props) => {
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
        case "cowork":
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
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
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

    // 파일 처리 필요
    // if (values.images) {
    //   values.images.map((image, index) => {
    //     formData.append(`image${index + 1}`, image.originFileObj);
    //   });
    // }

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/spot/update`,
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        console.log(`response.data`, response.data);
        // setOkModalVisible(true);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(`values`, values);
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

export default connect((state) => state)(Space);
