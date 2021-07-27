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

  // 에디터 관련 state
  const [content, setContent] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (noticeId) {
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
      form.setFieldsValue({
        status: noticeInfo.status,
        type: noticeInfo.type,
        sticky: String(noticeInfo.sticky),
        title: noticeInfo.title,
      });

      setContent(noticeInfo.content);
    }
  }, [noticeInfo]);

  // 저장 버튼 클릭
  const handleNoticeRegisterSubmit = (values) => {
    let data = {
      type: values.type,
      title: values.title,
      content: content,
      sticky: values.sticky,
    };

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/notice/write`;
    } else {
      url = `${process.env.BACKEND_API}/services/notice/edit`;
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
        <Form form={form} onFinish={handleNoticeRegisterSubmit}>
          <Form.Item name="status" label="공지 노출 여부">
            <Radio.Group>
              <Radio style={radioStyle} value={"publish"}>
                노출
              </Radio>
              <Radio style={radioStyle} value={"private"}>
                미노출
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="type" label="공지 유형">
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
          <Form.Item name="sticky" label="상단 노출">
            <Radio.Group>
              <Radio style={radioStyle} value="1">
                노출
              </Radio>
              <Radio style={radioStyle} value="0">
                미노출
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="title" label="제목">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="내용">
            <PostEditor onChange={handleEditorChange} setContents={content} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form>
        <Modal
          visible={okModalVisible}
          okText="확인"
          onOk={() => {
            router.push("/notice");
          }}
        >
          {registerMode ? "공지 등록 완료" : "공지 수정 완료"}
        </Modal>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(NoticeDetail);
