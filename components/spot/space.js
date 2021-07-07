import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
  Tag,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import NextHead from "next/head";

const Space = (props) => {
  const { type, spotId } = props;

  const router = useRouter();

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

    if (spotId !== "new") {
      const config = {
        method: "post",
        url: "http://3.34.133.211:8000/api/v1/spot/space/list",
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
          console.log(`response.data`, response.data);
          setSpaceList(response.data.items);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [type, spotId]);

  const handleFileChange = ({ fileList }) => {
    form.setFieldsValue({ images: fileList });
    setFileList(fileList);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  const handleTagClose = (spaceId) => {
    axios
      .post(
        `http://3.34.133.211:8000/api/v1/spot/space/delete`,
        {
          space_id: spaceId,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
          },
        }
      )
      .then((response) => {
        console.log(`response`, response);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    {
      spaceList.map((spaceObj) => {
        console.log(`spaceObj.space.name`, spaceObj.space.name);
      });
    }
    console.log(`spaceList`, spaceList);
  }, [spaceList]);

  const moveToManage = () => {};

  return (
    <>
      <Card title={title} bodyStyle={{ padding: "1rem" }} className="mb-4">
        <Form>
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
          <Form.Item name="content" label="설명">
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item name="list" label={`${title} 리스트`}>
            {spaceList.map((spaceObj) => {
              return (
                <Tag closable onClose={() => handleTagClose(spaceObj.space_id)}>
                  {spaceObj.space.name}
                </Tag>
              );
            })}
          </Form.Item>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form>
        <Button type="primary" onClick={moveToManage}>
          {`${title} 관리`}
        </Button>
      </Card>
    </>
  );
};

export default connect((state) => state)(Space);
