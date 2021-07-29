import { Button, Form, Input, Row, Modal, Card, Radio } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const QnaDetail = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  // detail로 들어온 경우 문의하기 정보 저장 state
  const [qnaDetail, setQnaDetail] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  // 답장을 단 적이 있는 경우 (작성/수정 flag)
  const [replyQid, setReplyQid] = useState(undefined);

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const [form] = Form.useForm();

  // 문의 상세 조회
  useEffect(() => {
    axios
      .get(`${process.env.BACKEND_API}/user/qna/get/${id}`, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: decodeURIComponent(token),
        },
      })
      .then((response) => {
        const qnaDetail = response.data.item;
        console.log(`qnaDetail`, qnaDetail);
        setQnaDetail(qnaDetail);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (qnaDetail) {
      form.setFieldsValue({
        // 노출 여부
        status: qnaDetail.status,
        // 카테고리 1
        classification: qnaDetail.classification,
        // 카테고리 2
        category: qnaDetail.category,
        // 작성자
        user_name: qnaDetail.user.user_name,
        // 제목
        title: qnaDetail.title,
        // 내용
        content: qnaDetail.content,
      });

      if (qnaDetail.reply) {
        form.setFieldsValue({
          // 답장
          reply: qnaDetail.reply.content,
          // 담당자
          reply_user: qnaDetail.reply.user.user_name,
        });

        setReplyQid(qnaDetail.reply.qid);
      }
    }
  }, [qnaDetail]);

  // 저장 버튼 클릭
  const handleReplyRegisterSubmit = (values) => {
    let url = "";

    url = `${process.env.BACKEND_API}/user/qna/write`;

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("classification", values.classification);
    formData.append("category", values.category);
    formData.append("content", values.reply);
    formData.append("parent", id);

    if (replyQid) {
      url = `${process.env.BACKEND_API}/user/qna/edit`;
      formData.append("qid", replyQid);
    }

    const config = {
      method: "post",
      url: url,
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

  const handleRemove = () => {
    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/user/qna/delete`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: {
        qid: id,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          router.push("/qna");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Card
        title={`문의 ID ${id}`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReplyRegisterSubmit}
        >
          <Form.Item name="status" label="처리 상태">
            <Radio.Group>
              <Radio style={radioStyle} value={"wait"}>
                대기
              </Radio>
              <Radio style={radioStyle} value={"done"}>
                헤결
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="classification" label="카테고리 1">
            <Input disabled />
          </Form.Item>
          <Form.Item name="category" label="카테고리 2">
            <Input disabled />
          </Form.Item>
          <Form.Item name="user_name" label="작성자">
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="제목">
            <Input disabled />
          </Form.Item>
          <Form.Item name="content" label="내용">
            <Input.TextArea disabled />
          </Form.Item>
          <Form.Item name="reply" label="답장">
            <Input.TextArea />
          </Form.Item>
          {replyQid && (
            <Form.Item name="reply_user" label="담당자">
              <Input disabled />
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit">
            저장
          </Button>
          <Button
            onClick={() => {
              setRemoveModalVisible(true);
            }}
          >
            삭제
          </Button>
        </Form>
        <Modal
          visible={okModalVisible}
          okText="확인"
          onOk={() => {
            router.push("/qna");
          }}
        >
          {"답변 등록 완료"}
        </Modal>
        <Modal visible={removeModalVisible} okText="확인" onOk={handleRemove}>
          {"삭제하시겠습니까?"}
        </Modal>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(QnaDetail);
