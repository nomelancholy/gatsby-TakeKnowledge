import { Button, Form, Input, Modal, Card, Upload, Popconfirm } from "antd";
import { MinusOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";

const ReplyCard = (props) => {
  const { reply, handleReplyDelete, handleReplyRegisterSubmit, token } = props;

  const [registerMode, setRegisterMode] = useState(true);

  // 답장 이미지 파일 관련 state
  const [replyImage, setReplyImage] = useState([]);
  const [replyPreviewVisible, setReplyPreviewVisible] = useState(false);
  const [replyPreviewImage, setReplyPreviewImage] = useState("");

  // 답장 form
  const [replyForm] = Form.useForm();

  useEffect(() => {
    // 서버에 답장이 등록되어 있는 경우
    if (typeof reply.qid === "number") {
      setRegisterMode(false);

      replyForm.setFieldsValue({
        // 답장
        contents: reply.content,
        // 담당자
        reply_user: reply.user.user_name,
        // 답장 생성 일시
        reply_regdate: reply.regdate,
      });

      // file_path, uid
      if (reply.file_path) {
        const imageObject = {
          thumbUrl: reply.file_path,
          uid: reply.uid,
        };

        setReplyImage([imageObject]);
      }
    }
  }, []);

  const handleSubmit = () => {
    const { contents, images } = replyForm.getFieldValue();

    const replyObject = {
      contents,
      qid: reply.qid,
    };

    if (images) {
      replyObject.file = images[0].originFileObj;
    }

    if (registerMode) {
      replyObject.type = "register";
    } else {
      replyObject.type = "edit";
    }

    handleReplyRegisterSubmit(replyObject);
  };

  const handleRemove = () => {
    handleReplyDelete(reply.qid);
  };

  const handleReplyImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setReplyImage([...replyImage, file]);
      replyForm.setFieldsValue({ images: [...replyImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = replyImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setReplyImage(newFileList);
      replyForm.setFieldsValue({ images: newFileList });

      if (typeof file.uid === "number") {
        // 서버에서 받아온 파일인 경우 서버로 삭제 요청

        const formData = new FormData();

        formData.append("qid", reply.qid);
        formData.append("del_file", true);
        const config = {
          method: "post",
          url: `${process.env.BACKEND_API}/user/qna/edit`,
          headers: {
            Authorization: decodeURIComponent(token),
          },
          data: formData,
        };

        axios(config)
          .then(function (response) {
            if (response.status === 200) {
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  };

  const handleReplyPreview = (file) => {
    setReplyPreviewVisible(true);
    setReplyPreviewImage(file.url || file.thumbUrl);
  };

  return (
    <Card
      className="mb-2"
      extra={
        <Popconfirm
          title={"삭제하시겠습니까?"}
          onConfirm={handleRemove}
          okText={"삭제"}
          cancelText={"취소"}
        >
          <a>
            <MinusOutlined />
          </a>
        </Popconfirm>
      }
    >
      <Form form={replyForm} onFinish={handleSubmit}>
        <Form.Item
          name="contents"
          label="내용"
          rules={[{ required: true, message: "답변 내용을 입력해주세요" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="images" label="이미지">
          <>
            <Upload
              name="images"
              listType="picture-card"
              fileList={replyImage}
              onChange={handleReplyImageChange}
              onPreview={handleReplyPreview}
            >
              {replyImage.length < 1 && (
                <Button icon={<UploadOutlined />}>업로드</Button>
              )}
            </Upload>
            <Modal
              visible={replyPreviewVisible}
              footer={null}
              onCancel={() => {
                setReplyPreviewVisible(false);
              }}
            >
              <img
                alt="팝업 배너"
                style={{ width: "100%" }}
                src={replyPreviewImage}
              />
            </Modal>
          </>
        </Form.Item>
        {!registerMode && (
          <>
            <Form.Item name="reply_user" label="담당자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="reply_regdate" label="생성 일시">
              <Input disabled />
            </Form.Item>
          </>
        )}
        <Button type="primary" htmlType="submit">
          {registerMode ? "저장" : "수정"}
        </Button>
      </Form>
    </Card>
  );
};

export default connect((state) => state)(ReplyCard);
