import { Button, Form, Input, Row, Modal, Card, Radio } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";

const PostEditor = dynamic(() => import("../../utils/Editor"), {
  ssr: false,
});

const NoticeDetail = (props) => {
  const { noticeId, token } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [noticeInfo, setNoticeInfo] = useState(undefined);

  // 에디터 컨텐츠 state
  const [content, setContent] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 공지 Form
  const [noticeForm] = Form.useForm();

  useEffect(() => {
    if (noticeId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/services/notice/get/${noticeId}`,
          config
        )
        .then(function (response) {
          const noticeInfo = response.data.item;
          setNoticeInfo(noticeInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // noticeInfo 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (noticeInfo) {
      // 공지 상태
      noticeForm.setFieldsValue({
        status: noticeInfo.status,
        type: noticeInfo.type,
        sticky: noticeInfo.sticky,
        title: noticeInfo.title,
      });

      setContent(noticeInfo.content);
    }
  }, [noticeInfo]);

  // 저장 버튼 클릭
  const handleNoticeRegisterSubmit = () => {
    const { type, sticky, status, title } = noticeForm.getFieldValue();

    let data = {
      type: type,
      title: title,
      content: content,
      sticky: sticky,
      status: status,
    };

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/notice/add`;
    } else {
      url = `${process.env.BACKEND_API}/services/notice/update`;
      data.notice_id = Number(noticeId);
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: data,
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

  const handleEditorChange = (content) => {
    setContent(content);
  };

  return (
    <>
      <Card
        title={noticeId && noticeId !== null ? `공지 ${noticeId}` : "공지 등록"}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={noticeForm} onFinish={handleNoticeRegisterSubmit}>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="status"
              label="공지 노출 여부"
              rules={[
                { required: true, message: "공지 노출 여부를 선택해주세요" },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"publish"}>
                  노출
                </Radio>
                <Radio style={radioStyle} value={"private"}>
                  미노출
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="type"
              label="공지 유형"
              rules={[{ required: true, message: "공지 유형을 선택해주세요" }]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"normal"}>
                  일반 공지
                </Radio>
                <Radio style={radioStyle} value={"group"}>
                  그룹 공지
                </Radio>
                <Radio style={radioStyle} value={"spot"}>
                  지점 공지
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="sticky"
              label="상단 노출"
              rules={[
                { required: true, message: "상단 노출 여부를 선택해주세요" },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={1}>
                  노출
                </Radio>
                <Radio style={radioStyle} value={0}>
                  미노출
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Card>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="내용"
              rules={[{ required: true, message: "내용을 입력해주세요" }]}
            >
              <PostEditor onChange={handleEditorChange} setContents={content} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                router.push("/notice");
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              {registerMode ? "공지 등록 완료" : "공지 수정 완료"}
            </Modal>
          </Card>
        </Form>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(NoticeDetail);
