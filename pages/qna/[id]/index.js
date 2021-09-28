import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  Popconfirm,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";
import ReplyCard from "@components/qna/ReplyCard";

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

  // 답변 리스트
  const [replyList, setReplyList] = useState(undefined);

  // 생성한 답장 id 저장용 state
  const [newCount, setNewCount] = useState(1);
  // Modal 문구 (수정 or 등록) 변경을 위한 state
  const [isReplyRegister, setIsReplyRegister] = useState(false);
  const [isStatusUpdate, setIsStatusUpdate] = useState(false);

  // QNA 이미지 파일 관련 state
  const [qnaImage, setQnaImage] = useState([]);
  const [qnaPreviewVisible, setQnaPreviewVisible] = useState(false);
  const [qnaPreviewImage, setQnaPreviewImage] = useState("");

  // 처리 상태
  const [statusForm] = Form.useForm();
  // 카테고리
  const [categoryForm] = Form.useForm();
  // 문의하기 내용
  const [questionForm] = Form.useForm();

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

      // 문의 이미지

      if (qnaDetail.file_path) {
        const imageObject = {
          thumbUrl: qnaDetail.file_path,
          uid: qnaDetail.uid,
        };

        setQnaImage([imageObject]);
      }

      // 답장
      if (qnaDetail.reply) {
        // 있을 경우 바인딩
        setReplyList(qnaDetail.reply);
      } else {
        // 없을 경우 하나만 생성
        setReplyList([{ qid: `new${newCount}` }]);
        // 추가될 경우를 대비해 newCount 1증가
        setNewCount(newCount + 1);
      }
    }
  }, [qnaDetail]);

  // 답장 추가
  const handleAddReply = () => {
    setReplyList([...replyList, { qid: `new${newCount}` }]);
    setNewCount(newCount + 1);
  };

  // 답장 (replyCard) 삭제
  const handleReplyDelete = (qid) => {
    const newReplyList = replyList.filter((reply) => reply.qid !== qid);
    setReplyList(newReplyList);

    // 서버에 저장된 답변의 qid type = number
    // 화면에서 생성한 답변의 qid type = new... 로 string

    // 서버에 저장된 답변의 경우 서버에서도 삭제
    if (typeof qid === "number") {
      const config = {
        method: "post",
        url: `${process.env.BACKEND_API}/user/qna/delete`,
        headers: {
          Authorization: decodeURIComponent(token),
        },
        data: {
          qid: qid,
        },
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
  };

  // 답장 작성 후 (replyCard) 저장 or 수정 버튼 클릭
  const handleReplyRegisterSubmit = ({ contents, file, qid, type }) => {
    let url = "";

    const formData = new FormData();

    const { title } = questionForm.getFieldValue();
    const { classification, category } = categoryForm.getFieldValue();

    formData.append("title", title);
    formData.append("classification", classification);
    formData.append("category", category);
    formData.append("content", contents);
    formData.append("parent", id);
    if (file) {
      formData.append("file", file);
    }

    if (type === "register") {
      url = `${process.env.BACKEND_API}/user/qna/write`;
      setIsReplyRegister(true);
    } else {
      url = `${process.env.BACKEND_API}/user/qna/edit`;
      formData.append("qid", qid);
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

  // 처리 상태 저장
  const handleStatusSave = () => {
    const formData = new FormData();

    const { status } = statusForm.getFieldValue();

    formData.append("qid", id);
    formData.append("status", status);

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
          setIsStatusUpdate(true);
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 유저가 올린 문의 이미지 미리보기
  const handleQnaPreview = (file) => {
    setQnaPreviewVisible(true);
    setQnaPreviewImage(file.url || file.thumbUrl);
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
          extra={
            <Button type="primary" onClick={handleStatusSave}>
              저장
            </Button>
          }
        >
          <Form form={statusForm}>
            <Form.Item name="status">
              <Radio.Group>
                <Radio style={radioStyle} value={"wait"} disabled>
                  대기
                </Radio>
                <Radio style={radioStyle} value={"trash"} disabled>
                  삭제
                </Radio>
                <Radio style={radioStyle} value={"inprogress"}>
                  진행중
                </Radio>
                <Radio style={radioStyle} value={"done"}>
                  해결
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
            {qnaImage && qnaImage.length > 0 && (
              <Form.Item name="images" label="이미지">
                <>
                  <Upload
                    name="images"
                    listType="picture-card"
                    fileList={qnaImage}
                    onPreview={handleQnaPreview}
                    disabled
                  />

                  <Modal
                    visible={qnaPreviewVisible}
                    footer={null}
                    onCancel={() => {
                      setQnaPreviewVisible(false);
                    }}
                  >
                    <img
                      alt="팝업 배너"
                      style={{ width: "100%" }}
                      src={qnaPreviewImage}
                    />
                  </Modal>
                </>
              </Form.Item>
            )}

            <Form.Item name="content" label="내용">
              <Input.TextArea disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`답장`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
          extra={
            <>
              <a onClick={handleAddReply}>
                <PlusOutlined />
              </a>
            </>
          }
        >
          {replyList && (
            <>
              {replyList.map((reply) => (
                <ReplyCard
                  key={reply.qid}
                  reply={reply}
                  handleReplyDelete={handleReplyDelete}
                  handleReplyRegisterSubmit={handleReplyRegisterSubmit}
                  token={token}
                />
              ))}
            </>
          )}
          <Modal
            visible={okModalVisible}
            okText="확인"
            onOk={() => {
              setOkModalVisible(false);
            }}
            onCancel={() => {
              setOkModalVisible(false);
            }}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            {isStatusUpdate
              ? "상태 수정 완료"
              : isReplyRegister
              ? "답변 등록 완료"
              : "답변 수정 완료"}
          </Modal>
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
