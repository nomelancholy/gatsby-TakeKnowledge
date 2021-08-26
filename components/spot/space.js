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
  const [removedFileList, setRemovedFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);
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

    // 내려줄 데이터 조회
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

    // 받아온 설명 세팅
    if (desc) {
      form.setFieldsValue({
        [`${type}_desc`]: desc,
      });
    }

    if (images) {
      const optionImages = [];

      images.map((image) => {
        // images 중에서 그 type에 해당하는 이미지만 가져온다
        if (image.image_key.startsWith(type)) {
          const newObj = {
            thumbUrl: image.image_path,
            uid: image.image_key,
          };

          optionImages.push(newObj);
        }
      });

      setFileList(optionImages);
    }
  }, []);

  const handleSpotSpaceInfoUpdate = () => {
    const formData = new FormData();

    const values = form.getFieldValue();

    formData.append("spot_id", spotId);
    if (values[`${type}_desc`] !== undefined) {
      formData.append(`${type}_desc`, values[`${type}_desc`]);
    }

    if (removedFileList.length > 0) {
      formData.append("del_images", JSON.stringify(removedFileList));
    }

    if (values.images) {
      values.images.map((image, index) => {
        // image.uid가 rc로 시작하면 새로 올린 이미지
        if (image.uid.startsWith("rc")) {
          formData.append(`${type}${index + 1}`, image.originFileObj);
        }
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
        if (response.status === 200) {
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFileChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setFileList([...fileList, file]);
      form.setFieldsValue({ images: [...fileList, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = fileList.filter(
        (fileObj) => fileObj.uid !== file.uid
      );
      setFileList(newFileList);
      form.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const newRemovedFileList = [...removedFileList, file.uid];
        setRemovedFileList(newRemovedFileList);
      }
    }
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  return (
    <>
      <Card title={title} bodyStyle={{ padding: "1rem" }} className="mb-4">
        <Form form={form} onFinish={handleSpotSpaceInfoUpdate}>
          <Form.Item
            name={`${type}_images`}
            label="대표 이미지 (최대 5장까지 첨부 가능)"
          >
            <>
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
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </>
          </Form.Item>
          <Form.Item name={`${type}_desc`} label="설명">
            <Input.TextArea rows={3}></Input.TextArea>
          </Form.Item>
          <Form.Item name={`${type}_list`} label={`${title} 리스트`}>
            <>
              {spaceList && spaceList.length !== 0 ? (
                spaceList.map((spaceObj) => {
                  return (
                    <Tag key={spaceObj.space_id}>{spaceObj.space.name}</Tag>
                  );
                })
              ) : (
                <>-</>
              )}
            </>
          </Form.Item>
          <Button
            type="primary"
            onClick={() => {
              Router.push(`/spot/${spotId}/${type}`);
            }}
          >
            {`${title} 관리`}
          </Button>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
          <Modal
            visible={okModalVisible}
            okText="확인"
            onOk={() => setOkModalVisible(false)}
            onCancel={() => setOkModalVisible(false)}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            {title} 정보 등록 완료
          </Modal>
        </Form>
      </Card>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Space);
