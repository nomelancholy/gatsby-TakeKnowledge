import { Button, Form, Input, Row, Modal, Card, Radio, Transfer } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import FormItem from "antd/lib/form/FormItem";

const PostEditor = dynamic(() => import("@utils/Editor"), {
  ssr: false,
});

const CouponManage = (props) => {
  const { couponId, token } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [couponInfo, setCouponInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 쿠폰 Form
  const [couponForm] = Form.useForm();

  useEffect(() => {
    if (couponId) {
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
    if (couponInfo) {
      // 공지 상태
      couponForm.setFieldsValue({
        status: couponInfo.status,
        type: couponInfo.type,
        sticky: couponInfo.sticky,
        title: couponInfo.title,
      });
    }
  }, [couponInfo]);

  // 저장 버튼 클릭
  const handleNoticeRegisterSubmit = () => {
    const { type, sticky, status, title } = couponForm.getFieldValue();

    let data = {
      type: type,
      title: title,
      sticky: sticky,
      status: status,
    };

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/notice/add`;
    } else {
      url = `${process.env.BACKEND_API}/services/notice/update`;
      data.coupon_id = Number(couponId);
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
        title={couponId && couponId !== null ? `공지 ${couponId}` : "공지 등록"}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={couponForm} onFinish={handleNoticeRegisterSubmit}>
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
            {/* <Form.Item
              name="type"
              label="공지 유형"
              rules={[{ required: true, message: "공지 유형을 선택해주세요" }]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"normal"}>
                  일반 공지
                </Radio>
                <Radio style={radioStyle} value={"spot"}>
                  지점 공지
                </Radio>
              </Radio.Group>
            </Form.Item> */}
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
            <Form.Item>
              <Transfer
                dataSource={[]}
                showSearch
                targetKeys={[]}
                // render={(item) => item.title}
                // onChange={handleSpotOptionsChange}
              />
            </Form.Item>
            <FormItem></FormItem>
          </Card>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                router.push("/coupon");
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              {registerMode ? "쿠폰 등록 완료" : "쿠폰 수정 완료"}
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

export default connect((state) => state)(CouponManage);
