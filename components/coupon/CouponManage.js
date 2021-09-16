import {
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
import FormItem from "antd/lib/form/FormItem";

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

  const [pubDateStart, setPubDateStart] = useState("");
  const [pubDateEnd, setPubDateEnd] = useState("");
  const [useableDateStart, setUseableDateStart] = useState("");
  const [useableDateEnd, setUseableDateEnd] = useState("");

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
          `${process.env.BACKEND_API}/admin/user/coupon/get/${couponId}`,
          config
        )
        .then(function (response) {
          const couponInfo = response.data.item;
          setCouponInfo(couponInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // couponInfo 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (couponInfo) {
      console.log(`couponInfo`, couponInfo);
      // 공지 상태
      couponForm.setFieldsValue({
        status: couponInfo.status,
        available: couponInfo.available,
        name: couponInfo.name,
        desc: couponInfo.desc,
        coupon_category: couponInfo.coupon_category,
        code: couponInfo.code,
        total: couponInfo.total,
        dup_count: couponInfo.dup_count,
        coupon_type: couponInfo.coupon_type,
      });

      if (couponInfo.coupon_type === "flat") {
        couponForm.setFieldsValue({
          discount_amount: couponInfo.discount,
        });
      } else if (couponInfo.coupon_type === "rate") {
        couponForm.setFieldsValue({
          discount_rate: couponInfo.discount,
        });
      }
    }
  }, [couponInfo]);

  // 저장 버튼 클릭
  const handleCouponRegisterSubmit = () => {
    const { type, sticky, status, title } = couponForm.getFieldValue();

    let data = {
      type: type,
      title: title,
      sticky: sticky,
      status: status,
    };

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/user/coupon/add`;
    } else {
      url = `${process.env.BACKEND_API}/admin/user/coupon/update`;
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
        title={
          couponId && couponId !== null ? `쿠폰 ID ${couponId}` : "쿠폰 등록"
        }
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form form={couponForm} onFinish={handleCouponRegisterSubmit}>
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="활성/비활성"
          >
            <Form.Item
              name="status"
              label="발급"
              rules={[
                {
                  required: true,
                  message: "쿠폰 발급 여부를 선택해주세요",
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"active"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  비활성
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="available"
              label="이용"
              rules={[
                {
                  required: true,
                  message: "쿠폰 이용 여부를 선택해주세요",
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"true"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"false"}>
                  비활성
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Card>
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
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
              name="desc"
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
              name="coupon_category"
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
            <FormItem name="code" label="공통 발급 코드">
              <Input />
            </FormItem>
            <FormItem name="total" label="발행량">
              <InputNumber />
              {/* {"장"} */}
            </FormItem>
            <FormItem name="dup_count" label="중복 허용수">
              <InputNumber />
              {/* {"장"} */}
            </FormItem>
            <FormItem name="discount_amount" label="할인 액">
              <InputNumber />
              {/* {"원"} */}
            </FormItem>
            <FormItem name="discount_rate" label="할인 비율">
              <InputNumber />
              {/* {"%"} */}
            </FormItem>
            <Form.Item
              name="coupon_type"
              label="쿠폰 구분"
              rules={[
                {
                  required: true,
                  message: "쿠폰 타입을 선택해주세요",
                },
              ]}
            >
              <Select style={{ width: 120 }}>
                <Select.Option value="flat">정액 할인</Select.Option>
                <Select.Option value="rate">비율 할인</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="product_id" label="적용 상품">
              <Transfer
                dataSource={[]}
                showSearch
                targetKeys={[]}
                // render={(item) => item.title}
                // onChange={handleSpotOptionsChange}
              />
            </Form.Item>
            <Form.Item name="spot_ids" label="적용 스팟">
              <Transfer
                dataSource={[]}
                showSearch
                targetKeys={[]}
                // render={(item) => item.title}
                // onChange={handleSpotOptionsChange}
              />
            </Form.Item>
            <Form.Item
              name="pub_date"
              label="발행 기간"
              rules={[{ required: true, message: "시작일을 선택해주세요" }]}
            >
              <>
                <DatePicker
                  placeholder="시작일"
                  onChange={(date, dateString) => {
                    setPubDateStart(dateString);
                  }}
                />
                <DatePicker
                  placeholder="종료일"
                  onChange={(date, dateString) => {
                    setPubDateEnd(dateString);
                  }}
                />
              </>
            </Form.Item>
            <Form.Item
              name="useable_date"
              label="유효 기간"
              rules={[{ required: true, message: "종료일을 선택해주세요" }]}
            >
              <>
                <DatePicker
                  placeholder="시작일"
                  onChange={(date, dateString) => {
                    setUseableDateStart(dateString);
                  }}
                />
                <DatePicker
                  placeholder="종료일"
                  onChange={(date, dateString) => {
                    setUseableDateEnd(dateString);
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
        </Form>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(CouponManage);