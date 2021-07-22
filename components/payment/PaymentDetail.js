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

  // detail로 들어온 경우 product info 저장 state
  const [rateplanInfo, setRateplanInfo] = useState(undefined);

  // 생성된 product ID 저장 state
  const [generatedRateplanId, setGeneratedRateplanId] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [form] = Form.useForm();

  // product 정도 조회
  useEffect(() => {
    if (rateplanId) {
      setRegisterMode(false);
      axios
        .post(
          `${process.env.BACKEND_API}/product/get`,
          { product_id: rateplanId },
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
    } else {
      setRegisterMode(true);
    }
  }, []);

  // productData 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (rateplanInfo) {
      form.setFieldsValue({
        // 상품 구분
        type: rateplanInfo.type,
        // 상품 옵션
        plan_spot: rateplanInfo.plan_spot,
        // 메모
        memo: rateplanInfo.memo,
        // 활성 / 비활성
        status: rateplanInfo.status,
        // 상품명
        name: rateplanInfo.name,
        // 결제 유형
        pay_demand: rateplanInfo.pay_demand,
        // 멤버십 유형
        service_type: rateplanInfo.service_type,
        // 체크인 단위
        time_unit: rateplanInfo.time_unit,
        // 주간 이용 한도
        week_limit: rateplanInfo.week_limit,
      });

      // 옵션으로 내려줄 spot list 조회
      getOptionsSpotList();
    }
  }, [rateplanInfo]);

  // 상품 생성 되면 바로 공간 추가할 수 있게 option spot list 조회
  useEffect(() => {
    if (generatedRateplanId) {
      getOptionsSpotList();
    }
  }, [generatedRateplanId]);

  const getOptionsSpotList = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        { page: 1, size: 100 },
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
        // 활성화된 스팟들만 사용 가능 스팟으로 세팅 -> 다 불러서 disabled 시키는 쪽으로 변경
        // const activeSpotList = data.filter((spot) => spot.status === "active");
        setOptionSpotList(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 저장 버튼 클릭
  const handleSpotRegisterSubmit = (values) => {
    console.log(`values.status`, values.status);
    console.log(`values.name`, values.name);
    console.log(`values.product_id`, values.product_id);
    console.log(`values.price`, values.price);
    console.log(`values.dc_price`, values.dc_price);
    console.log(`values.guest_price`, values.guest_price);
    console.log(`values.memo`, values.memo);
    console.log(`startDate`, startDate);
    console.log(`endDate`, endDate);

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/product/rateplan/add`;
    } else {
      console.log(`rateplan_id`, rateplan_id);
      url = `${process.env.BACKEND_API}/admin/product/rateplan/update`;
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: {
        status: values.status,
        name: values.name,
        product_id: values.product_id,
        price: values.price,
        dc_price: values.dc_price,
        start_date: startDate,
        end_date: endDate,
        guest_price: values.guest_price,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(`response`, response);
        setOkModalVisible(true);
        // if (registerMode) {
        //   // 등록한 상품 ID 값 세팅
        //   setGeneratedRateplanId(response.data.item.product_id);
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [optionProductList, setOptionProductList] = useState([]);

  // input value change handle
  const handleProductTypeChange = (type) => {
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

  const handleFileChange = ({ fileList }) => {
    form.setFieldsValue({ images: fileList });
    setFileList(fileList);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  const handleStartTimeChange = (values) => {
    setStartTime(values);
  };

  const handleEndTimeChange = (values) => {
    setEndTime(values);
  };

  const handleIntroChange = (values) => {
    setIntro(values);
  };

  const handleContentChange = (values) => {
    setContent(values);
  };

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  // 사용 가능한 스팟 추가
  const handleAddSpot = () => {
    const newList = spotList.concat({});
    setSpotList(newList);
  };

  // 사용 가능한 스팟 삭제
  const handleSpotDeleted = (spotId) => {
    let newSpotList;
    if (spotId) {
      newSpotList = spotList.filter((spot) => spot.spot.spot_id !== spotId);
    }
    // else {
    //   newSpotList = spotList.pop();
    // }

    setSpotList(newSpotList);
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
                  defaultValue="-"
                  style={{ width: 120 }}
                  onChange={handleProductTypeChange}
                >
                  <Select.Option value="membership">멤버십</Select.Option>
                  <Select.Option value="voucher">이용권</Select.Option>
                  <Select.Option value="service">부가서비스</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="product_id" label="상품 명">
                <Select defaultValue="-" style={{ width: 120 }}>
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
              onOk={() => setOkModalVisible(false)}
            >
              스팟 등록 완료
            </Modal>
          </Card>

          {/* 공간 정보 */}
          {(rateplanId || generatedRateplanId) && spotList && optionSpotList && (
            <Card
              title="사용 가능 스팟"
              extra={
                <>
                  <a onClick={handleAddSpot}>+</a>
                </>
              }
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <>
                {/* {spotList.map((spot, index) => (
                  <ProductSpot
                    key={spot.spot ? spot.spot.spot_id : `new${index}`}
                    spotInfo={spot}
                    handleSpotDeleted={handleSpotDeleted}
                    optionSpotList={optionSpotList}
                    token={token}
                    rateplanId={
                      generatedrateplanId ? generatedrateplanId : rateplanId
                    }
                  />
                ))} */}
              </>
            </Card>
          )}

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
