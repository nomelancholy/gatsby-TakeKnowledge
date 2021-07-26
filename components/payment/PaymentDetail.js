import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import moment from "moment";
import Router from "next/dist/next-server/server/router";
// import ProductSpot from "./productSpot";

const PostEditor = dynamic(() => import("@utils/Editor"), {
  ssr: false,
});

const PaymentDetail = (props) => {
  const { rateplanId, token } = props;

  // 요금제 시작/종료일
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // detail로 들어온 경우 요금제 정보 저장 state
  const [rateplanInfo, setRateplanInfo] = useState(undefined);

  // 요금제에 붙어있는 상품 정보 저장 state
  const [productInfo, setProductInfo] = useState(undefined);
  // 상품 구분에 따라 달라지는 상품 리스트 저장 state
  const [optionProductList, setOptionProductList] = useState([]);

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [form] = Form.useForm();

  // 요금제 조회
  useEffect(() => {
    if (rateplanId) {
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/admin/product/rateplan/get/${rateplanId}`,
          config
        )
        .then(function (response) {
          const rateplanInfo = response.data.item;
          setRateplanInfo(rateplanInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (rateplanInfo) {
      // 요금제에 붙어있는 상품 조회
      axios
        .post(
          `${process.env.BACKEND_API}/product/get`,
          { product_id: rateplanInfo.product_id },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          const productData = response.data;
          setProductInfo(productData);
        })
        .catch((error) => {
          console.log(`error`, error);
        });

      form.setFieldsValue({
        // 노출 여부
        status: rateplanInfo.status,
        // 요금제 이름
        name: rateplanInfo.name,
        // 이용 요금
        price: rateplanInfo.price,
        // 할인 요금
        dc_price: rateplanInfo.dc_price,
        // // 시작일
        start_date: moment(rateplanInfo.start_date),
        // // 종료일
        end_date: moment(rateplanInfo.end_date),
        // 게스트 요금
        guest_price: rateplanInfo.guest_price,
      });

      // 전송용 state에도 세팅
      setStartDate(rateplanInfo.start_date.replace(/\./gi, "-"));
      setEndDate(rateplanInfo.end_date.replace(/\./gi, "-"));
      // 상품 구분

      // 상품명
    }
  }, [rateplanInfo]);

  useEffect(() => {
    // 요금제에 붙어있는 상품 정보 세팅되면
    if (productInfo) {
      // 요금제 - 상품의 값 상품 구분에 세팅하고
      form.setFieldsValue({
        product_type: productInfo.type,
      });
      // 그에 해당하는 옵션 리스트 조회
      getOptionProductList(productInfo.type);
    }
  }, [productInfo]);

  // 상품 구분에 따라 option 상품 리스트 조회
  const getOptionProductList = (type) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        { page: 1, size: 20, status: "active", type: type },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const productList = response.data.items;
        setOptionProductList(productList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    // 옵션 상품 리스트가 조회되었고, detail로 들어와서 상품 정보도 있는 경우면
    if (optionProductList && productInfo) {
      form.setFieldsValue({
        product_id: productInfo.product_id,
      });
    }
  }, [optionProductList]);

  // 저장 버튼 클릭
  const handleSpotRegisterSubmit = (values) => {
    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/product/rateplan/add`;
    } else {
      url = `${process.env.BACKEND_API}/admin/product/rateplan/update`;
    }

    let data = {
      status: values.status,
      name: values.name,
      product_id: values.product_id,
      price: values.price,
      dc_price: values.dc_price,
      start_date: startDate,
      end_date: endDate,
      guest_price: values.guest_price,
    };

    // 수정일 경우
    if (!registerMode) {
      data.rateplan_id = Number(rateplanId);
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

  // input value change handle
  const handleProductTypeChange = (type) => {
    // 상품명 value 초기화
    form.setFieldsValue({
      product_id: null,
    });
    form.resetFields([product_id]);
    // 상품 구분에 따른 option list 재호출
    getOptionProductList(type);
  };

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="요금제 상세" key="1">
          <Card
            title={
              rateplanId && rateplanId !== null
                ? `상품 ID ${rateplanId}`
                : "상품 등록"
            }
            extra={<a onClick={() => router.back()}>뒤로 가기</a>}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSpotRegisterSubmit}
            >
              <Form.Item name="status" label="노출 여부">
                <Radio.Group>
                  <Radio style={radioStyle} value={"active"}>
                    노출
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    비노출
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="name" label="요금제 이름">
                <Input />
              </Form.Item>
              <Form.Item name="product_type" label="상품 구분">
                <Select
                  style={{ width: 120 }}
                  onChange={handleProductTypeChange}
                >
                  <Select.Option value="membership">멤버십</Select.Option>
                  <Select.Option value="voucher">이용권</Select.Option>
                  <Select.Option value="service">부가서비스</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="product_id" label="상품 명">
                <Select initialValue="-" style={{ width: 120 }}>
                  {optionProductList.map((product) => (
                    <Select.Option
                      key={product.product_id}
                      value={product.product_id}
                    >
                      {product.name}
                    </Select.Option>
                  ))}
                  {/* <Select.Option value="one_spot">ALL SPOT</Select.Option>
                  <Select.Option value="all_spot">전 스팟</Select.Option> */}
                </Select>
              </Form.Item>
              <Form.Item name="price" label="이용 요금">
                <InputNumber />
              </Form.Item>
              <Form.Item name="dc_price" label="할인 요금">
                <InputNumber />
              </Form.Item>
              <Form.Item name="start_date" label="시작일">
                <DatePicker onChange={handleStartDateChange} />
              </Form.Item>
              <Form.Item name="end_date" label="종료일">
                <DatePicker onChange={handleEndDateChange} />
              </Form.Item>
              <Form.Item name="guest_price" label="게스트 요금">
                <InputNumber />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                router.push("/payment");
              }}
            >
              {registerMode ? "스팟 등록 완료" : "스팟 수정 완료"}
            </Modal>
          </Card>

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

export default connect((state) => state)(PaymentDetail);