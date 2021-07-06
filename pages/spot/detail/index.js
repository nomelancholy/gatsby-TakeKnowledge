import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import NextHead from "next/head";

const Detail = () => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const [status, setStatus] = useState(true);
  const [property, setProperty] = useState(true);
  const [spotPostcode, setSpotPostcode] = useState("");
  const [form] = Form.useForm();

  const handlePropertyChange = (e) => {
    setProperty(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const userAddressEtcRef = useRef(null);

  // 주소 팝업
  const showAddressPopup = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.(R:도로명,J:지번)
        form.setFieldsValue({
          address:
            data.userSelectedType === "R"
              ? data.roadAddress
              : data.jibunAddress,
        });
        // 우편번호
        setSpotPostcode(data.zonecode);
        // 상세 주소 포커스
        userAddressEtcRef.current.focus();
      },
    }).open();
  };

  useEffect(() => {
    if (spotPostcode) {
      console.log(`spotPostcode`, spotPostcode);
    }
  }, [spotPostcode]);

  const facilityInfoOptions = [
    { label: "라운지", value: "lounge" },
    { label: "미팅룸", value: "meeting" },
    { label: "코워킹룸", value: "coworking" },
    { label: "QA존", value: "qa" },
    { label: "스마트락커", value: "locker" },
    { label: "F&B바", value: "fb" },
    { label: "무인편의점", value: "unmanned" },
    { label: "폰부스", value: "phone" },
  ];

  const handleSpotRegisterSubmit = (values) => {
    console.log(`values`, values);
    values.facilityInfos.map((facilityInfo) => {
      console.log(`facilityInfo`, facilityInfo);
    });

    facilityInfoObj = [
      { lounge: false },
      { meeting: false },
      { coworking: false },
      { qa: false },
      { locker: false },
      { fb: false },
      { unmanned: false },
      { phone: false },
    ];
  };

  return (
    <>
      <NextHead>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </NextHead>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="스팟 상세" key="1">
          <Card
            title="스팟 정보"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form form={form} onFinish={handleSpotRegisterSubmit}>
              <Form.Item name="status" label="스팟 활성 / 비활성">
                <Radio.Group onChange={handleStatusChange} value={status}>
                  <Radio style={radioStyle} value={true}>
                    활성
                  </Radio>
                  <Radio style={radioStyle} value={false}>
                    비활성
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="name" label="스팟 명">
                <Input defaultValue="신규" />
              </Form.Item>
              <Form.Item name="spot_id" label="스팟 ID">
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item name="nickname" label="스팟 별칭">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="주소">
                <Input onClick={showAddressPopup} />
              </Form.Item>
              <Form.Item name="address_etc" label="상세 주소">
                <Input ref={userAddressEtcRef} />
              </Form.Item>
              <Form.Item name="operation_time" label="운영 시간">
                <Input defaultValue={"연중무휴, 24시간"} />
              </Form.Item>
              <Form.Item name="인원" label="인원">
                <Input placeholder="신규" />
              </Form.Item>
              <Form.Item name="images" label="대표 이미지">
                <Upload name="image" listType="picture">
                  <Button icon={<UploadOutlined />}>업로드</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="content" label="설명">
                <Input.TextArea rows={4}></Input.TextArea>
              </Form.Item>
              <Form.Item name="facilityInfos" label="시설 정보">
                <Checkbox.Group options={facilityInfoOptions} />
              </Form.Item>
              <Form.Item name="property" label="파이브스팟 전용">
                <Radio.Group onChange={handlePropertyChange} value={property}>
                  <Radio style={radioStyle} value={true}>
                    전용
                  </Radio>
                  <Radio style={radioStyle} value={false}>
                    공용
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form>
          </Card>
          <Card title="라운지" bodyStyle={{ padding: "1rem" }} className="mb-4">
            <Form>
              <Form.Item name="대표 이미지" label="대표 이미지">
                <Input placeholder="신규" />
              </Form.Item>
              <Form.Item name="설명" label="설명">
                <Input placeholder="신규" />
              </Form.Item>
              <Form.Item name="라운지 리스트" label="라운지 리스트">
                <Input placeholder="신규" />
              </Form.Item>
            </Form>
          </Card>
          <Card
            title="미팅룸"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Card
            title="코워킹룸"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Card
            title="락커"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Row type="flex" align="middle" className="py-4">
            <span className="px-2 w-10"></span>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="히스토리" key="2">
          <Card
            title="변경 히스토리"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default connect((state) => state)(Detail);
