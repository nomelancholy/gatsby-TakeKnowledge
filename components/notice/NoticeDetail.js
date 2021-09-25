import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  Transfer,
  DatePicker,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import FormItem from "antd/lib/form/FormItem";

const PostEditor = dynamic(() => import("@utils/Editor"), {
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

  // 지점 / 전체 공지 구분 state
  const [isSpotNotice, setIsSpotNotice] = useState(false);

  const [noticeInfo, setNoticeInfo] = useState(undefined);

  // 에디터 컨텐츠 state
  const [content, setContent] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 스팟 선택 option/tagets state
  const [spotOptions, setSpotOptions] = useState([]);
  const [targetSpots, setTargetSpots] = useState([]);

  // 공지 이미지 관련 state
  const [noticeImage, setNoticeImage] = useState([]);
  const [noticePreviewVisible, setNoticePreviewVisible] = useState(false);
  const [noticePreviewImage, setNoticePreviewImage] = useState("");

  // 공지 Form
  const [noticeForm] = Form.useForm();

  // 스팟 선택 옵션 스팟 호출
  const getSpotOptions = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        {},
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const data = response.data.items;

        const options = [];

        // 적용 스팟 옵션 가공 후 세팅 (비활성일 경우 비활성)
        data.map((spot) => {
          const spotOption = {
            key: spot.spot_id.toString(),
            title:
              spot.status === "active" ? spot.name : `${spot.name} (비활성)`,
          };

          options.push(spotOption);
        });

        setSpotOptions(options);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    // 스팟 리스트 불러서 spotOptions에 세팅
    getSpotOptions();

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
      noticeForm.setFieldsValue({
        status: noticeInfo.status,
        type: noticeInfo.type,
        sticky: noticeInfo.sticky,
        title: noticeInfo.title,
        home_dp_start: moment(noticeInfo.home_dp_start),
        home_dp_end: moment(noticeInfo.home_dp_end),
      });

      // 공지 내용
      setContent(noticeInfo.content);

      // 지점 공지인 경우
      if (noticeInfo.type === "spot") {
        // flag true로 변경 후
        setIsSpotNotice(true);
        // 적용 스팟 세팅
        const targetSpots = noticeInfo.spot_ids.split("|");
        setTargetSpots(targetSpots);
      }

      // 이미지 세팅
      if (noticeInfo.file_path) {
        const imageObj = {
          thumbUrl: noticeInfo.file_path,
          uid: 1,
        };

        setNoticeImage([imageObj]);
      }
    }
  }, [noticeInfo]);

  // 저장 버튼 클릭
  const handleNoticeRegisterSubmit = () => {
    const { type, sticky, status, title, images, home_dp_start, home_dp_end } =
      noticeForm.getFieldValue();

    const formData = new FormData();

    formData.append("type", type);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("sticky", sticky);
    formData.append("status", status);
    formData.append(
      "home_dp_start",
      moment(home_dp_start).format("YYYY-MM-DD HH:mm")
    );
    formData.append(
      "home_dp_end",
      moment(home_dp_end).format("YYYY-MM-DD HH:mm")
    );

    if (type === "spot") {
      formData.append("spot_ids", targetSpots.join("|"));
    }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/notice/add`;
    } else {
      url = `${process.env.BACKEND_API}/services/notice/update`;
      formData.append("notice_id", noticeId);
    }

    if (noticeImage && noticeImage.length > 0 && noticeImage[0].originFileObj) {
      formData.append("file", noticeImage[0].originFileObj);
      // formData.append("del_file", false);
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

  // 공지 유형 변경
  const handleTypeChange = (e) => {
    if (e.target.value === "spot") {
      setIsSpotNotice(true);
    } else {
      setIsSpotNotice(false);
    }
  };

  // 지점 공지 선택 시 나오는 적용 스팟 변경
  const handleSpotOptionsChange = (targetKeys) => {
    setTargetSpots(targetKeys);
  };

  // 이미지 변경
  const handleNoticeImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setNoticeImage([...noticeImage, file]);
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = noticeImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setNoticeImage(newFileList);

      if (typeof file.uid === "number") {
        // 서버에서 받아온 파일인 경우
        const formData = new FormData();

        formData.append("notice_id", noticeId);
        formData.append("del_file", true);

        const config = {
          method: "post",
          url: `${process.env.BACKEND_API}/services/notice/update`,
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

  // 이미지 프리뷰 클릭
  const handleNoticePreview = (file) => {
    setNoticePreviewVisible(true);
    setNoticePreviewImage(file.url || file.thumbUrl);
  };

  // 에디터 변경
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
        <Form
          form={noticeForm}
          onFinish={handleNoticeRegisterSubmit}
          initialValues={{
            status: "private",
            sticky: 0,
            reserved_datetime: moment(),
          }}
        >
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="status"
              label="공지 활성/비활성"
              rules={[
                {
                  required: true,
                  message: "공지 활성/비활성 여부를 선택해주세요",
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"publish"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"private"}>
                  비활성
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="sticky"
              label="상단 고정(pin)"
              rules={[
                { required: true, message: "상단 고정 여부를 선택해주세요" },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={1}>
                  고정
                </Radio>
                <Radio style={radioStyle} value={0}>
                  해제
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="type"
              label="공지 유형"
              rules={[{ required: true, message: "공지 유형을 선택해주세요" }]}
            >
              <Radio.Group onChange={handleTypeChange}>
                <Radio style={radioStyle} value={"normal"}>
                  전체 공지
                </Radio>
                <Radio style={radioStyle} value={"spot"}>
                  지점 공지
                </Radio>
                <Radio style={radioStyle} value={"home"}>
                  긴급 공지
                </Radio>
              </Radio.Group>
            </Form.Item>
            {isSpotNotice && (
              <Form.Item name={"spot_ids"} label="스팟 선택">
                <Transfer
                  dataSource={spotOptions}
                  showSearch
                  targetKeys={targetSpots}
                  render={(item) => item.title}
                  onChange={handleSpotOptionsChange}
                />
              </Form.Item>
            )}

            <FormItem name="home_dp" label="홈 노출 기간">
              <Form.Item
                name="home_dp_start"
                style={{ display: "inline-block" }}
                rules={[
                  {
                    required: true,
                    message: "홈 노출 기간 시작일을 선택해주세요",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  name="home_dp_start"
                  placeholder="시작일"
                />
              </Form.Item>
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  lineHeight: "32px",
                  textAlign: "center",
                }}
              >
                -
              </span>
              <Form.Item
                name="home_dp_end"
                style={{ display: "inline-block" }}
                rules={[
                  {
                    required: true,
                    message: "홈 노출 기간 종료일을 선택해주세요",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  name="home_dp_end"
                  placeholder="종료일"
                />
              </Form.Item>
            </FormItem>
          </Card>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item name="images" label="이미지">
              <Upload
                name="images"
                listType="picture-card"
                fileList={noticeImage}
                onChange={handleNoticeImageChange}
                onPreview={handleNoticePreview}
              >
                {noticeImage.length < 1 && (
                  <Button icon={<UploadOutlined />}>업로드</Button>
                )}
              </Upload>
              <Modal
                visible={noticePreviewVisible}
                footer={null}
                onCancel={() => {
                  setNoticePreviewVisible(false);
                }}
              >
                <img
                  alt="상단 배너"
                  style={{ width: "100%" }}
                  src={noticePreviewImage}
                />
              </Modal>
            </Form.Item>
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
