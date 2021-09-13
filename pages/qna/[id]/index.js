import { Button, Form, Input, Row, Modal, Card, Radio, Popconfirm } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const radioStyle = {
  display: "inline",
  height: "30px",
  lineHeight: "30px",
};

const QnaDetail = (props) => {
  const router = useRouter();
  // qid
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  // detail로 들어온 경우 문의하기 정보 저장 state
  const [qnaDetail, setQnaDetail] = useState(undefined);

  // Modal 관련 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  // 답장을 단 적이 있는 경우 (작성/수정 flag)
  const [replyQid, setReplyQid] = useState(undefined);

  // 처리 상태
  const [statusForm] = Form.useForm();
  // 카테고리
  const [categoryForm] = Form.useForm();
  // 문의하기 내용
  const [questionForm] = Form.useForm();
  // 답장
  const [replyForm] = Form.useForm();

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
        setQnaDetail(qnaDetail);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  useEffect(() => {
    // 문의 상세 정보 세팅되면
    if (qnaDetail) {
      // 처리 상태
      statusForm.setFieldsValue({
        status: qnaDetail.status,
      });

      // 카테고리
      categoryForm.setFieldsValue({
        // 카테고리 1
        classification: qnaDetail.classification,
        // 카테고리 2
        category: qnaDetail.category,
      });

      // 문의하기 내용
      questionForm.setFieldsValue({
        // 작성자
        // user_name: qnaDetail.user.user_name,
        // 제목
        title: qnaDetail.title,
        // 내용
        content: qnaDetail.content,
      });

      // 답장
      if (qnaDetail.reply) {
        replyForm.setFieldsValue({
          // 답장
          reply: qnaDetail.reply.content,
          // 담당자
          reply_user: qnaDetail.reply.user.user_name,
          // 답장 생성 일시
          reply_regdate: qnaDetail.reply.regdate,
        });
        // 답장이 있는 경우 저장 버튼 클릭시 수정으로 보내야 하므로 qid 세팅
        setReplyQid(qnaDetail.reply.qid);
      }
    }
  }, [qnaDetail]);

  // 저장 버튼 클릭
  const handleReplyRegisterSubmit = () => {
    let url = "";

    url = `${process.env.BACKEND_API}/user/qna/write`;

    const formData = new FormData();

    const { title } = questionForm.getFieldValue();
    const { classification, category } = categoryForm.getFieldValue();
    const { reply, file } = replyForm.getFieldValue();

    formData.append("title", title);
    formData.append("classification", classification);
    formData.append("category", category);
    formData.append("content", reply);
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
        <Card
          title={`처리 상태`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={statusForm}>
            <Form.Item name="status">
              <Radio.Group disabled>
                <Radio style={radioStyle} value={"wait"}>
                  대기
                </Radio>
                <Radio style={radioStyle} value={"done"}>
                  해결
                </Radio>
                <Radio style={radioStyle} value={"trash"}>
                  삭제
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`카테고리`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={categoryForm}>
            <Form.Item name="classification" label="카테고리 1">
              <Input disabled />
            </Form.Item>
            <Form.Item name="category" label="카테고리 2">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`문의하기 내용`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={questionForm}>
            {/* 기획 수정 사항 반영 - 주석 처리 21-08-03 */}
            {/* <Form.Item name="user_name" label="작성자">
              <Input disabled />
            </Form.Item> */}
            <Form.Item name="title" label="제목">
              <Input disabled />
            </Form.Item>
            <Form.Item name="content" label="내용">
              <Input.TextArea disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title={`답장`} bodyStyle={{ padding: "1rem" }} className="mb-4">
          <Form form={replyForm} onFinish={handleReplyRegisterSubmit}>
            <Form.Item
              name="reply"
              label="내용"
              rules={[{ required: true, message: "답변 내용을 입력해주세요" }]}
            >
              <Input.TextArea />
            </Form.Item>
            {replyQid && (
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
              저장
            </Button>
            <Popconfirm
              title={"삭제하시겠습니까?"}
              onConfirm={handleRemove}
              okText={"삭제"}
              cancelText={"취소"}
            >
              <Button>삭제</Button>
            </Popconfirm>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                router.push("/qna");
              }}
              onCancel={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              {replyQid ? "답변 수정 완료" : "답변 등록 완료"}
            </Modal>
          </Form>
        </Card>
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
