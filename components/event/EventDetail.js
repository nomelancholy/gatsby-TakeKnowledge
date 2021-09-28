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

  // 이벤트 상세 정보 저장 state
  const [eventInfo, setEventInfo] = useState(undefined);

  // modal 표시 구분 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  // 적용 쿠폰 옵션 리스트 state
  const [couponList, setCouponList] = useState(undefined);
  // 적용한 쿠폰 state
  const [applyCoupon, setApplyCoupon] = useState(undefined);

  // 이벤트 Form
  const [eventForm] = Form.useForm();

  useEffect(() => {
    // 옵션 쿠폰 리스트 조회
    getCouponList();

    if (eventId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/services/events/get/${eventId}`,
          config
        )
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

      if (eventInfo.coupon) {
        setApplyCoupon(eventInfo.coupon_id);
        eventForm.setFieldsValue({
          coupon: eventInfo.coupon.name,
        });
      }
    }
  }, [eventInfo]);

  // option coupon list 조회
  const getCouponList = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/list`,
        {
          start_pub_date_end: moment().format("YYYY-MM-DD"),
          start_useable_date_end: moment().format("YYYY-MM-DD"),
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const data = response.data;

        // auto complete option 형태로 가공
        const optionList = data.items.map((coupon) => {
          const optionObj = {
            value: coupon.name,
            label: coupon.name,
            id: coupon.coupon_id,
          };

          return optionObj;
        });

        setCouponList(optionList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 저장 버튼 클릭
  const handleEventRegisterSubmit = () => {
    const { title, path, status, coupon, start_date, end_date } =
      eventForm.getFieldValue();

    let data = {
      title,
      path,
      status,
      coupon_id: applyCoupon,
      start_date: moment(start_date).format("YYYY-MM-DD"),
      end_date: moment(end_date).format("YYYY-MM-DD"),
    };

    if (coupon) {
      data.coupon_id = applyCoupon;
    } else {
      data.del_coupon = true;
    }

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
        <Form
          form={eventForm}
          onFinish={handleEventRegisterSubmit}
          initialValues={{
            status: "private",
            start_date: moment(new Date()),
            end_date: moment(
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            ),
          }}
        >
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="title"
              label="이벤트 제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input maxLength={50} />
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
            <Form.Item name="coupon" label="적용 쿠폰 검색">
              <AutoComplete
                options={couponList}
                filterOption={(inputValue, option) =>
                  option.value.includes(inputValue)
                }
                onSelect={(data, option) => {
                  setApplyCoupon(option.id);
                }}
              />
            </Form.Item>
            <Form.Item
              name="start_date"
              label="이벤트 시작일"
              rules={[
                { required: true, message: "이벤트 시작일을 선택해주세요" },
              ]}
            >
              <DatePicker placeholder="이벤트 시작일" />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="이벤트 종료일"
              rules={[
                { required: true, message: "이벤트 종료일을 선택해주세요" },
              ]}
            >
              <DatePicker placeholder="이벤트 종료일" />
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
