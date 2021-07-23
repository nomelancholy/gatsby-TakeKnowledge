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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ProductSpot from "./productSpot";

const PostEditor = dynamic(() => import("@utils/Editor"), {
  ssr: false,
});

const ProductDetail = (props) => {
  const { productId, token } = props;

  // start_time, end_time 옵션 상수
  const TIMES = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];
  // week_limit 옵션 상수
  const DAYS = [1, 2, 3, 4, 5, 6, 7];

  // 운영 요일 checkbox 옵션
  const workingDaysOptions = [
    { label: "월", value: "mon" },
    { label: "화", value: "tue" },
    { label: "수", value: "wed" },
    { label: "목", value: "thu" },
    { label: "금", value: "fri" },
    { label: "토", value: "sat" },
    { label: "일", value: "sun" },
  ];
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // detail로 들어온 경우 product info 저장 state
  const [productInfo, setProductInfo] = useState(undefined);
  // 생성된 product ID 저장 state
  const [generatedProductId, setGeneratedProductId] = useState(undefined);

  // file 관련 state
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 상품 구분 선택 state
  const [type, setType] = useState("membership");

  // 운영 시간 start, end time 저장 state
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // 에디터 데이터 저장 state
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState("");

  // 상품에 붙어있는 사용 가능 스팟 list
  const [spotList, setSpotList] = useState([]);

  // 사용 가능 스팟에 select box에 option으로 내려줄 스팟 list

  const [optionSpotList, setOptionSpotList] = useState(undefined);

  const [form] = Form.useForm();

  // product 정도 조회
  useEffect(() => {
    if (productId) {
      setRegisterMode(false);
      axios
        .post(
          `${process.env.BACKEND_API}/product/get`,
          { product_id: productId },
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
    if (productInfo) {
      form.setFieldsValue({
        // 상품 구분
        type: productInfo.type,
        // 상품 옵션
        plan_spot: productInfo.plan_spot,
        // 메모
        memo: productInfo.memo,
        // 활성 / 비활성
        status: productInfo.status,
        // 상품명
        name: productInfo.name,
        // 결제 유형
        pay_demand: productInfo.pay_demand,
        // 멤버십 유형
        service_type: productInfo.service_type,
        // 체크인 단위
        time_unit: productInfo.time_unit,
        // 주간 이용 한도
        week_limit: productInfo.week_limit,
      });

      // 운영 시간 시작 / 끝 시간
      setStartTime(productInfo.start_time);
      setEndTime(productInfo.end_time);
      // 에디터 컨텐츠
      setIntro(productInfo.intro);
      setContent(productInfo.content);

      // 상품 구분
      setType(productInfo.type);

      // 사용 가능 스팟
      if (productInfo.spaces) {
        setSpotList(productInfo.spaces);
      }

      // 운영 요일 binding
      let workingDays = [];

      if (productInfo.working_days) {
        Object.entries(productInfo.working_days).filter((obj) => {
          if (obj[1]) {
            workingDays.push(obj[0]);
          }
        });

        form.setFieldsValue({
          working_days: workingDays,
        });
      }

      if (productInfo.images) {
        // 이미지 추가되면 작업 필요
      }

      // 옵션으로 내려줄 spot list 조회
      getOptionsSpotList();
    }
  }, [productInfo]);

  // 상품 생성 되면 바로 공간 추가할 수 있게 option spot list 조회
  useEffect(() => {
    if (generatedProductId) {
      getOptionsSpotList();
    }
  }, [generatedProductId]);

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
    const formData = new FormData();

    formData.append("type", values.type);
    formData.append("plan_spot", values.plan_spot);
    formData.append("memo", values.memo);
    formData.append("status", values.status);
    formData.append("name", values.name);
    formData.append("pay_demand", values.pay_demand);
    formData.append("service_type", values.service_type);
    formData.append("time_unit", values.time_unit);
    formData.append("intro", intro);
    formData.append("content", content);

    // TO-DO 로고 처리
    if (values.logo) {
      formData.append("logo", values.logo);
    }

    // 상품 이미지 처리
    if (values.images) {
      values.images.map((image, index) => {
        formData.append(`image${index + 1}`, image.originFileObj);
      });
    }
    formData.append("start_time", startTime);
    formData.append("end_time", endTime);
    formData.append("week_limit", values.week_limit);

    // // 전체 요일 정보
    const allWorkginDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    // // 선택한 요일 정보
    const selectedWorkingDays = values.working_days;

    // 운영 요일 객체 생성
    let workingDays = {};
    if (selectedWorkingDays) {
      allWorkginDays.map((workingDay) => {
        if (selectedWorkingDays.includes(workingDay)) {
          workingDays[workingDay] = true;
        } else {
          workingDays[workingDay] = false;
        }
      });
    }

    formData.append("working_days", JSON.stringify(workingDays));

    // 이용권에서만 사용 / 그 외엔 0
    if (type === "voucher") {
      formData.append("available_days", values.available_days);
    } else {
      formData.append("available_days", 0);
    }

    // formData console
    // for (let key of formData.keys()) {
    //   console.log(key);
    // }

    // for (let value of formData.values()) {
    //   console.log(value);
    // }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/product/add`;
    } else {
      formData.append("product_id", productId);
      url = `${process.env.BACKEND_API}/admin/product/update`;
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        setOkModalVisible(true);
        if (registerMode) {
          // 등록한 상품 ID 값 세팅
          setGeneratedProductId(response.data.item.product_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // input value change handle
  const handleTypeChange = (value) => {
    setType(value);
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
        <Tabs.TabPane tab="상품 상세" key="1">
          <Card
            title={
              productId && productId !== null
                ? `상품 ID ${productId}`
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
              <Form.Item name="type" label="상품 구분">
                <Select
                  defaultValue="-"
                  style={{ width: 120 }}
                  onChange={handleTypeChange}
                >
                  <Select.Option value="membership">멤버십</Select.Option>
                  <Select.Option value="voucher">이용권</Select.Option>
                  <Select.Option value="service">부가서비스</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="plan_spot" label="상품 옵션">
                <Select defaultValue="-" style={{ width: 120 }}>
                  <Select.Option value="one_spot">단일 스팟</Select.Option>
                  <Select.Option value="all_spot">전 스팟</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="memo" label="메모">
                <Input />
              </Form.Item>
              <Form.Item name="status" label="활성 / 비활성">
                <Radio.Group>
                  <Radio style={radioStyle} value={"active"}>
                    활성
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    비활성
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="name" label="상품명">
                <Input />
              </Form.Item>
              <Form.Item name="pay_demand" label="결제 유형">
                <Select defaultValue="-" style={{ width: 120 }}>
                  <Select.Option value="pre">선불</Select.Option>
                  <Select.Option value="deffered">후불</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="service_type" label="멤버십 유형">
                <Select defaultValue="-" style={{ width: 120 }}>
                  <Select.Option value="accumulate">기본형</Select.Option>
                  <Select.Option value="deduction">차감형</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="time_unit" label="체크인 단위">
                <Radio.Group>
                  <Radio style={radioStyle} value={"day"}>
                    일간
                  </Radio>
                  <Radio style={radioStyle} value={"hour"}>
                    시간
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="images" label="상품  로고이미지">
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={[]}
                  // onChange={handleFileChange}
                  // onPreview={handlePreview}
                >
                  {fileList.length < 1 ? (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  ) : null}
                </Upload>
                {/* <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => {
                    setPreviewVisible(false);
                  }}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal> */}
              </Form.Item>
              <Form.Item name="intro" label="상품 소개">
                <PostEditor onChange={handleIntroChange} setContents={intro} />
              </Form.Item>
              <Form.Item name="content" label="상품 신청">
                <PostEditor
                  onChange={handleContentChange}
                  setContents={content}
                />
              </Form.Item>
              <Form.Item
                name="images"
                label="상품 이미지 (최대 5장까지 첨부 가능)"
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  onPreview={handlePreview}
                >
                  {fileList.length < 5 ? (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  ) : null}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => {
                    setPreviewVisible(false);
                  }}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
              <Form.Item name="operation_time" label="운영 시간">
                <Select
                  defaultValue="-"
                  value={startTime}
                  style={{ width: 120 }}
                  onChange={handleStartTimeChange}
                >
                  {TIMES.map((time) => (
                    <Select.Option value={time}>{time}</Select.Option>
                  ))}
                </Select>
                <Select
                  defaultValue="-"
                  value={endTime}
                  style={{ width: 120 }}
                  onChange={handleEndTimeChange}
                >
                  {TIMES.map((time) => (
                    <Select.Option value={time}>{time}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="week_limit" label="주간 이용 한도">
                <Select defaultValue="-" style={{ width: 120 }}>
                  {DAYS.map((day) => (
                    <Select.Option value={day}>{day}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="working_days" label="운영 요일">
                <Checkbox.Group options={workingDaysOptions} />
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
          {(productId || generatedProductId) && spotList && optionSpotList && (
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
                {spotList.map((spot, index) => (
                  <ProductSpot
                    key={spot.spot ? spot.spot.spot_id : `new${index}`}
                    spotInfo={spot}
                    handleSpotDeleted={handleSpotDeleted}
                    optionSpotList={optionSpotList}
                    token={token}
                    productId={
                      generatedProductId ? generatedProductId : productId
                    }
                  />
                ))}
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

export default connect((state) => state)(ProductDetail);
