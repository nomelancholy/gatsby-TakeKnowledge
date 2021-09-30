import { Form, Input, InputNumber, Card, Select, DatePicker } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import moment from "moment";

import FormItem from "antd/lib/form/FormItem";

const CouponDetail = (props) => {
  const { couponInfo } = props;

  const [isRate, setIsRate] = useState(undefined);
  const [isFlat, setIsFlat] = useState(undefined);

  const [isMembership, setIsMembership] = useState(undefined);

  // 쿠폰 Form
  const [couponForm] = Form.useForm();

  useEffect(() => {
    if (couponInfo) {
      console.log(`couponInfo`, couponInfo);
      couponForm.setFieldsValue({
        coupon_id: couponInfo.coupon_id,
        name: couponInfo.name,
        desc: couponInfo.desc,
        coupon_type: couponInfo.coupon_type,
        code: couponInfo.code,
        total: couponInfo.total,
        coupon_category: couponInfo.coupon_category,
        pub_date_start: moment(couponInfo.pub_date_start),
        pub_date_end: moment(couponInfo.pub_date_end),
        useable_date_start: moment(couponInfo.useable_date_start),
        useable_date_end: moment(couponInfo.useable_date_end),
      });

      if (couponInfo.products && couponInfo.products.length > 0) {
        let productNameArray = [];

        couponInfo.products.map((product) => {
          productNameArray.push(product.name);
        });

        console.log(`productNameArray`, productNameArray);

        couponForm.setFieldsValue({
          products: productNameArray.join(", "),
        });
      }

      if (couponInfo.spots && couponInfo.spots.length > 0) {
        let spotNameArray = [];

        couponInfo.spots.map((spot) => {
          spotNameArray.push(spot.name);
        });

        couponForm.setFieldsValue({
          spots: spotNameArray.join(", "),
        });
      }

      if (couponInfo.coupon_category === "membership") {
        setIsMembership(true);
      } else {
        setIsMembership(false);
      }

      if (couponInfo.coupon_type === "flat") {
        setIsFlat(true);
        couponForm.setFieldsValue({
          discount_amount: couponInfo.discount,
        });
      } else if (couponInfo.coupon_type === "ratio") {
        setIsRate(true);
        couponForm.setFieldsValue({
          discount_rate: couponInfo.discount,
        });
      }
      console.log(`couponInfo`, couponInfo);
    }
  }, [couponInfo]);

  return (
    <Card title="상세 정보" bodyStyle={{ padding: "1rem" }} className="mb-2">
      <Form form={couponForm}>
        <FormItem name="coupon_id" label="쿠폰 ID">
          <Input maxLength="15" disabled />
        </FormItem>
        <FormItem name="name" label="쿠폰명">
          <Input maxLength="15" disabled />
        </FormItem>
        <FormItem name="desc" label="쿠폰 설명">
          <Input maxLength="50" disabled />
        </FormItem>
        <Form.Item name="coupon_type" label="쿠폰 유형">
          <Select style={{ width: 120 }} disabled>
            <Select.Option value="flat">정액 할인</Select.Option>
            <Select.Option value="ratio">비율 할인</Select.Option>
          </Select>
        </Form.Item>
        <FormItem name="code" label="공통 발급 코드">
          <Input disabled />
        </FormItem>
        <FormItem name="total" label="발행량">
          <InputNumber disabled formatter={(value) => `${value} 장`} />
        </FormItem>
        {isFlat && (
          <FormItem name="name" label="할인 액">
            <InputNumber disabled />
          </FormItem>
        )}
        {isRate && (
          <FormItem name="name" label="할인 비율">
            <InputNumber disabled />
          </FormItem>
        )}

        <Form.Item name="coupon_category" label="쿠폰 구분">
          <Select style={{ width: 120 }} disabled>
            <Select.Option value="membership">멤버십</Select.Option>
            <Select.Option value="meeting">미팅룸</Select.Option>
            <Select.Option value="coworking">코워킹룸</Select.Option>
            <Select.Option value="locker">락커</Select.Option>
            <Select.Option value="lounge">라운지</Select.Option>
          </Select>
        </Form.Item>
        {!isMembership && (
          <Form.Item name="products" label="적용 상품">
            <Input disabled />
          </Form.Item>
        )}
        <Form.Item name="spots" label="적용 스팟">
          <Input disabled />
        </Form.Item>
        <Form.Item name="pub_date" label="발행 기간">
          <Form.Item name="pub_date_start" style={{ display: "inline-block" }}>
            <DatePicker disabled placeholder="시작일" />
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
          <Form.Item name="pub_date_end" style={{ display: "inline-block" }}>
            <DatePicker disabled placeholder="종료일" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="useable_date" label="유효 기간">
          <Form.Item
            name="useable_date_start"
            style={{ display: "inline-block" }}
          >
            <DatePicker disabled placeholder="시작일" />
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
            name="useable_date_end"
            style={{ display: "inline-block" }}
          >
            <DatePicker disabled placeholder="종료일" />
          </Form.Item>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect((state) => state)(CouponDetail);
