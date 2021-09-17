import {
  AutoComplete,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Modal,
  Card,
  Radio,
  Transfer,
  Select,
  DatePicker,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import FormItem from "antd/lib/form/FormItem";

const PostEditor = dynamic(() => import("@utils/Editor"), {
  ssr: false,
});

const CouponManual = (props) => {
  const { couponManualId, token } = props;

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
    if (couponDirectId) {
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
      data.coupon_id = Number(couponDirectId);
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
          couponDirectId && couponDirectId !== null
            ? `쿠폰 ID ${couponDirectId}`
            : "쿠폰 등록"
        }
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={couponForm} onFinish={handleNoticeRegisterSubmit}>
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="활성/비활성"
          >
            <Form.Item label="적용 쿠폰 검색">
              <AutoComplete
                options={[]}
                onSearch={handleSearch}
                onSelect={handleSelect}
              />
            </Form.Item>
          </Card>
          <Card
            title="상세 정보"
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
          >
            <FormItem name="name" label="쿠폰 ID">
              <Input maxLength="15" />
            </FormItem>
            <FormItem
              name="name"
              label="쿠폰명"
              rules={[
                {
                  required: true,
                  max: 15,
                  message: "쿠폰명을 15자 이내로 입력해주세요",
                },
              ]}
            >
              <Input maxLength="15" />
            </FormItem>
            <FormItem
              name="name"
              label="발행량"
              rules={[
                {
                  required: true,
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <InputNumber />
              {"장"}
            </FormItem>
            <FormItem
              name="name"
              label="쿠폰 설명"
              rules={[
                {
                  required: true,
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <Input maxLength="50" />
            </FormItem>
            <Form.Item
              name="type"
              label="쿠폰 유형"
              rules={[
                {
                  required: true,
                  message: "쿠폰 유형을 선택해주세요",
                },
              ]}
            >
              <Select style={{ width: 120 }}>
                <Select.Option value="membership">멤버십</Select.Option>
                <Select.Option value="meeting">미팅룸</Select.Option>
                <Select.Option value="coworking">코워킹룸</Select.Option>
                <Select.Option value="locker">락커</Select.Option>
                <Select.Option value="lounge">라운지</Select.Option>
              </Select>
            </Form.Item>
            <FormItem
              name="name"
              label="공통 발급 코드"
              rules={[
                {
                  required: true,
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <Input maxLength="50" />
            </FormItem>
            <FormItem
              name="name"
              label="할인 액"
              rules={[
                {
                  required: true,
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <InputNumber />
              {"원"}
            </FormItem>
            <FormItem
              name="name"
              label="할인 비율"
              rules={[
                {
                  required: true,
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <InputNumber />
              {"%"}
            </FormItem>
            <Form.Item
              name="type"
              label="쿠폰 구분"
              rules={[
                {
                  required: true,
                  message: "쿠폰 타입을 선택해주세요",
                },
              ]}
            >
              <Select style={{ width: 120 }}>
                <Select.Option value="membership">멤버십</Select.Option>
                <Select.Option value="meeting">미팅룸</Select.Option>
                <Select.Option value="coworking">코워킹룸</Select.Option>
                <Select.Option value="locker">락커</Select.Option>
                <Select.Option value="lounge">라운지</Select.Option>
              </Select>
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

            <Form.Item label="적용 상품">
              <Input />
            </Form.Item>
            <Form.Item label="적용 스팟">
              <Input />
            </Form.Item>
            <Form.Item
              name="start_date"
              label="발행 기간"
              rules={[{ required: true, message: "시작일을 선택해주세요" }]}
            >
              <>
                <DatePicker
                  placeholder="시작일"
                  onChange={(date, dateString) => {
                    console.log("change");
                  }}
                />
                <DatePicker
                  placeholder="종료일"
                  onChange={(date, dateString) => {
                    console.log("change");
                  }}
                />
              </>
            </Form.Item>
            <Form.Item
              name="end_date"
              label="유효 기간"
              rules={[{ required: true, message: "종료일을 선택해주세요" }]}
            >
              <>
                <DatePicker
                  placeholder="시작일"
                  onChange={(date, dateString) => {
                    console.log("change");
                  }}
                />
                <DatePicker
                  placeholder="종료일"
                  onChange={(date, dateString) => {
                    console.log("change");
                  }}
                />
              </>
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
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="발급 방식"
          >
            <Form.Item name="status" label="활성/비활성">
              <Radio.Group>
                <Radio style={radioStyle} value={"publish"}>
                  대량 발급
                </Radio>
                <Radio style={radioStyle} value={"private"}>
                  개별 발급
                </Radio>
              </Radio.Group>
            </Form.Item>
            {/* 대량 발행, 개별 발급에 따라  */}
            <Form.Item name="title" label="대량 발행">
              <InputNumber /> {"매"}
            </Form.Item>
            <Form.Item name="title" label="개별 발급">
              <Input></Input>
            </Form.Item>
          </Card>
        </Form>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(CouponManual);
