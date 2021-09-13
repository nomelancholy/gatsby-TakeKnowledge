import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  DatePicker,
  AutoComplete,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import moment from "moment";

const radioStyle = {
  display: "inline",
  height: "30px",
  lineHeight: "30px",
};

const EventDetail = (props) => {
  const { eventId, token } = props;

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [eventInfo, setEventInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 공지 Form
  const [eventForm] = Form.useForm();

  useEffect(() => {
    if (eventId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(`${process.env.BACKEND_API}/public/events/get/${eventId}`, config)
        .then(function (response) {
          const eventInfo = response.data.item;
          setEventInfo(eventInfo);
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
    if (eventInfo) {
      console.log(`eventInfo`, eventInfo);
      // 이벤트 상태
      eventForm.setFieldsValue({
        title: eventInfo.title,
        path: eventInfo.path,
        status: eventInfo.status,
        start_date: moment(eventInfo.start_date),
        end_date: moment(eventInfo.end_date),
      });

      // 전송용 state에도 세팅
      setStartDate(eventInfo.start_date.replace(/\./gi, "-"));
      setEndDate(eventInfo.end_date.replace(/\./gi, "-"));
    }
  }, [eventInfo]);

  // 저장 버튼 클릭
  const handleEventRegisterSubmit = () => {
    console.log("클릭");
    const { title, path, status } = eventForm.getFieldValue();

    let data = {
      title,
      path,
      status,
      start_date: startDate,
      end_date: endDate,
    };

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/events/add`;
    } else {
      url = `${process.env.BACKEND_API}/services/events/update`;
      data.event_id = Number(eventId);
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

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  const [searchOptions, setSearchOptions] = useState([]);

  const coupons = [
    { label: "원데이 1만원 할인", id: "1" },
    { label: "원스팟 1만원 할인", id: "2" },
  ];

  // 객체 배열에서 입력 텍스트를 label에 포함한 객체만 찾아서 return

  const options = [{ label: "test", value: "test" }];

  const handleSearch = (text) => {
    const options = coupons.filter((coupon) => {
      if (coupon.label.includes(text)) {
        return { label: coupon.label, value: coupon.id };
      }
    });
    setSearchOptions(options);
  };

  const [applyCoupon, setApplyCoupon] = useState(undefined);

  const handleSelect = (data) => {
    console.log(`data`, data);
    setApplyCoupon(data);
  };

  return (
    <>
      <Card
        title={
          eventId && eventId !== null ? `이벤트 ${eventId}` : "이벤트 등록"
        }
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={eventForm} onFinish={handleEventRegisterSubmit}>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="title"
              label="이벤트 제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="상태"
              rules={[{ required: true, message: "상태를 선택해주세요" }]}
            >
              <Radio.Group initialValues="publish">
                <Radio style={radioStyle} value={"publish"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"private"}>
                  비활성
                </Radio>
                <Radio style={radioStyle} value={"trash"}>
                  삭제
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="path"
              label="파일 경로"
              rules={[{ required: true, message: "파일 경로를 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="적용 쿠폰 검색">
              <AutoComplete
                options={searchOptions}
                onSearch={handleSearch}
                onSelect={handleSelect}
              />
            </Form.Item>
            <Form.Item
              name="start_date"
              label="이벤트 시작일"
              rules={[
                { required: true, message: "이벤트 시작일을 선택해주세요" },
              ]}
            >
              <DatePicker
                placeholder="이벤트 시작일"
                onChange={handleStartDateChange}
              />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="이벤트 종료일"
              rules={[
                { required: true, message: "이벤트 종료일을 선택해주세요" },
              ]}
            >
              <DatePicker
                placeholder="이벤트 종료일"
                onChange={handleEndDateChange}
              />
            </Form.Item>
          </Card>

          <Button type="primary" htmlType="submit">
            {registerMode ? "등록" : "수정"}
          </Button>
          <Modal
            visible={okModalVisible}
            okText="확인"
            onOk={() => {
              router.push("/event");
            }}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            {registerMode ? "이벤트 등록 완료" : "이벤트 수정 완료"}
          </Modal>
        </Form>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(EventDetail);
