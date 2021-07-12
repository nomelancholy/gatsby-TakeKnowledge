import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import NextHead from "next/head";
// import ReactSummernote from "react-summernote";
// import "react-summernote/dist/react-summernote.css"; // import styles
// import "react-summernote/lang/summernote-ru-RU"; // you can import any other locale

// Import bootstrap(v3 or v4) dependencies
// import "bootstrap/js/modal";
// import "bootstrap/js/dropdown";
// import "bootstrap/js/tooltip";
// import "bootstrap/dist/css/bootstrap.css";

const NoticeDetail = (props) => {
  const { spotId } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [noticeInfo, setNoticeInfo] = useState(undefined);

  // spot 관련 state

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [isTop, setisTop] = useState(false);

  const [okModalVisible, setOkModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  // spotData 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    // if (spotInfo) {
    //   form.setFieldsValue({
    //     status: spotInfo.status,
    //     name: spotInfo.name,
    //     spot_id: spotInfo.spot_id,
    //     nickname: spotInfo.nickname,
    //     address: spotInfo.address,
    //     address_etc: spotInfo.address_etc,
    //     operation_time: spotInfo.operation_time,
    //     seat_capacity: spotInfo.seat_capacity,
    //     content: spotInfo.content,
    //     property: spotInfo.property,
    //     max_seat_capacity: Math.floor(spotInfo.seat_capacity * 1.5),
    //   });
    //   // 시설 정보 binding
    //   let checkExcerpt = [];
    //   if (spotInfo.excerpt) {
    //     Object.entries(spotInfo.excerpt).filter((obj) => {
    //       if (obj[1]) {
    //         checkExcerpt.push(obj[0]);
    //       }
    //     });
    //     form.setFieldsValue({
    //       facilityInfos: checkExcerpt,
    //     });
    //   }
    //   if (spotInfo.images) {
    //     // 이미지 추가되면 작업 필요
    //   }
    // }
  }, [noticeInfo]);

  // 저장 버튼 클릭
  const handleNoticeRegisterSubmit = (values) => {
    // 전체 시설 정보
    const facilityInfos = [
      "lounge",
      "meeting",
      "coworking",
      "qa",
      "locker",
      "fb",
      "unmanned",
      "phone",
    ];
    // 선택한 시설 정보
    const validFacilityInfos = values.facilityInfos;

    // 객체 생성
    let excerpt = {};
    if (validFacilityInfos) {
      facilityInfos.map((facilityInfo) => {
        if (validFacilityInfos.includes(facilityInfo)) {
          excerpt[facilityInfo] = true;
        } else {
          excerpt[facilityInfo] = false;
        }
      });
    }

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("nickname", values.nickname);
    formData.append("property", values.property);
    formData.append("status", values.status);
    formData.append("address", values.address);
    formData.append("address_etc", values.address_etc);
    formData.append("content", values.content);
    formData.append("operation_time", values.operation_time);
    formData.append("seat_capacity", values.seat_capacity);
    formData.append("excerpt", JSON.stringify(excerpt));

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        formData.append(`image${index + 1}`, image.originFileObj);
      });
    }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/spot/add`;
    } else {
      formData.append("spot_id", spotId);
      url = `${process.env.BACKEND_API}/admin/spot/update`;
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        console.log(`response.data`, response.data);
        setOkModalVisible(true);
        if (registerMode) {
          setGeneratedSpotId(response.data.item.spot_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const handleIsTopChange = (e) => {
    setIsTop(e.target.value);
  };

  return (
    <>
      <NextHead>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </NextHead>

      <Card
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={form} onFinish={handleNoticeRegisterSubmit}>
          <Form.Item name="status" label="공지 노출 여부">
            <Radio.Group onChange={handleStatusChange} value={status}>
              <Radio style={radioStyle} value={"active"}>
                노출
              </Radio>
              <Radio style={radioStyle} value={"inactive"}>
                미노출
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="type" label="공지 유형">
            <Radio.Group onChange={handleTypeChange} value={type}>
              <Radio style={radioStyle} value={"active"}>
                일반 공지
              </Radio>
              <Radio style={radioStyle} value={"inactive"}>
                그룹 공지
              </Radio>
              <Radio style={radioStyle} value={"inactive"}>
                지점 공지
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="top" label="상단 노출">
            <Radio.Group onChange={handleIsTopChange} value={isTop}>
              <Radio style={radioStyle} value={true}>
                노출
              </Radio>
              <Radio style={radioStyle} value={false}>
                미노출
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="title" label="제목">
            <Input />
          </Form.Item>
          {/* {registerMode ? null : (
            <Form.Item name="spot_id" label="스팟 ID">
              <InputNumber min={1} disabled={true} />
            </Form.Item>
          )} */}

          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form>
        <Modal
          visible={okModalVisible}
          okText="확인"
          onOk={() => setOkModalVisible(false)}
        >
          스팟 등록 완료
        </Modal>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(NoticeDetail);
