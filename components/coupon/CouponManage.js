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
import moment from "moment";

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

  // 쿠폰 정보 저장 state
  const [couponInfo, setCouponInfo] = useState(undefined);

  // datepicker disabled 를 위한 시작일자 저장  state
  const [pubDateStart, setPubDateStart] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [useableDateStart, setUseableDateStart] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  // 적용 스팟 관련 state
  const [spotOptions, setSpotOptions] = useState([]);
  const [targetSpots, setTargetSpots] = useState([]);

  // 적용 상품 관련 state
  const [productOptions, setProductOptions] = useState([]);
  const [targetProducts, setTargetProducts] = useState([]);

  // 금액 할인 구분 flag
  const [isFlat, setIsFlat] = useState(undefined);
  // 비율 할인 구분 flag
  const [isRate, setIsRate] = useState(undefined);

  // 적용 상품, 적용 스팟 필요한지 구분 flag
  const [isMembership, setIsMembership] = useState(true);

  // 전 상품 여부 저장 state (transfer 표시를 위해 사용)
  const [isAllProduct, setIsAllProduct] = useState(true);

  // 전 지점 여부 저장 state (transfer 표시를 위해 사용)
  const [isAllSpot, setIsAllSpot] = useState(true);

  // modal 표시 구분 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  // 쿠폰 Form
  const [couponForm] = Form.useForm();

  useEffect(() => {
    // 스팟 리스트 불러서 spotOptions에 세팅
    getSpotOptions();
    // 상품 리스트 불러서 productOptions에 세팅
    getProductOptions();

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
        pub_date_start: moment(couponInfo.pub_date_start),
        pub_date_end: moment(couponInfo.pub_date_end),
        useable_date_start: moment(couponInfo.useable_date_start),
        useable_date_end: moment(couponInfo.useable_date_end),
      });

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

      if (couponInfo.coupon_category === "membership") {
        setIsMembership(true);

        if (couponInfo.is_all_product) {
          setIsAllProduct(true);
          couponForm.setFieldsValue({
            is_all_product: true,
          });
        } else {
          // 세팅
          setIsAllProduct(false);
          const targetProducts = couponInfo.product_ids.split("|");
          setTargetProducts(targetProducts);

          // validation 체크를 위해 form에도 세팅
          couponForm.setFieldsValue({
            is_all_product: false,
            product_ids: couponInfo.product_ids.split("|"),
          });
        }
      } else {
        setIsMembership(false);
      }

      // 적용 스팟이 존재하는 경우
      if (couponInfo.is_all_spot) {
        setIsAllSpot(true);
        couponForm.setFieldsValue({
          is_all_spot: couponInfo.is_all_spot,
        });
      } else {
        // 세팅
        setIsAllSpot(false);
        const targetSpots = couponInfo.spot_ids.split("|");
        setTargetSpots(targetSpots);

        // validation 체크를 위해 form에도 세팅
        couponForm.setFieldsValue({
          is_all_spot: false,
          spot_ids: couponInfo.spot_ids.split("|"),
        });
      }

      // disabled 처리를 위한 발행기간 시작일
      setPubDateStart(couponInfo.pub_date_start.replace(/\./gi, "-"));
      // disabled 처리를 위한 유효기간 시작일
      setUseableDateStart(couponInfo.useable_date_start.replace(/\./gi, "-"));
    }
  }, [couponInfo]);

  // 스팟 옵션 조회
  const getSpotOptions = (param) => {
    console.log(`param`, param);
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

        const options = [];
        // 비활성, 삭제 표시해서 옵션으로 세팅
        data.map((spot) => {
          const spotOption = {
            key: spot.spot_id.toString(),
            title:
              spot.status === "active"
                ? spot.name
                : spot.status === "inactive"
                ? `${spot.name} (비활성)`
                : `${spot.name} (삭제)`,
          };

          options.push(spotOption);
        });

        setSpotOptions(options);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 상품 옵션 조회
  const getProductOptions = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        { page: 1, size: 100, type: "membership" },
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

        const options = [];

        // 적용 상품 옵션 가공 후 세팅
        data.map((product) => {
          const productOption = {
            key: product.product_id.toString(),
            title: product.name,
          };

          options.push(productOption);
        });

        setProductOptions(options);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 저장 버튼 클릭
  const handleCouponRegisterSubmit = () => {
    const {
      status,
      available,
      name,
      desc,
      coupon_type,
      code,
      total,
      dup_count,
      discount_amount,
      discount_rate,
      coupon_category,
      is_all_product,
      product_ids,
      is_all_spot,
      spot_ids,
      pub_date_start,
      pub_date_end,
      useable_date_start,
      useable_date_end,
    } = couponForm.getFieldValue();

    console.log(`status`, status);

    let data = {
      status,
      available,
      name,
      desc,
      coupon_type,
      code,
      total,
      dup_count,
      coupon_category,
      pub_date_start: moment(pub_date_start).format("YYYY-MM-DD"),
      pub_date_end: moment(pub_date_end).format("YYYY-MM-DD"),
      useable_date_start: moment(useable_date_start).format("YYYY-MM-DD"),
      useable_date_end: moment(useable_date_end).format("YYYY-MM-DD"),
    };

    if (isMembership) {
      if (is_all_product) {
        // 적용 상품이 전 상품일 경우
        data.is_all_product = true;
      } else {
        // 상품을 선택한 경우
        data.is_all_product = false;
        data.product_ids = product_ids.join("|");
      }
    } else {
      // 서버 null 체크 때문에 else인 경우도 is_all_product false로 추가
      data.is_all_product = false;
    }

    if (is_all_spot) {
      // 적용 스팟이 전 스팟일 경우
      data.is_all_spot = true;
    } else {
      data.is_all_spot = false;
      data.spot_ids = spot_ids.join("|");
    }

    if (isFlat) {
      // 금액 할인일 경우
      data.discount = discount_amount;
    } else {
      // 비율 할인일 경우
      data.discount = discount_rate;
    }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/user/coupon/add`;
    } else {
      url = `${process.env.BACKEND_API}/admin/user/coupon/update`;
      data.coupon_id = Number(couponId);
    }

    console.log(`data`, data);

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

  // 적용 스팟 변경
  const handleSpotOptionsChange = (targetKeys) => {
    setTargetSpots(targetKeys);
  };

  // 적용 상품 변경
  const handleProductOptionsChange = (targetKeys) => {
    setTargetProducts(targetKeys);
  };

  // 쿠폰 구분 변경
  const handleCouponCategoryChange = (value) => {
    if (value === "membership") {
      setIsMembership(true);
    } else {
      setIsMembership(false);
    }
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
        <Form
          form={couponForm}
          onFinish={handleCouponRegisterSubmit}
          initialValues={{
            status: "inactive",
            available: true,
            discount_amount: 1000,
            discount_rate: 1,
            total: 0,
            dup_count: 1,
            coupon_category: "membership",
            is_all_product: true,
            is_all_spot: true,
          }}
        >
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
                <Radio style={radioStyle} value={true}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={false}>
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
                  max: 50,
                  message: "쿠폰 설명을 50자 이내로 입력해주세요",
                },
              ]}
            >
              <Input maxLength="50" />
            </FormItem>
            <Form.Item
              name="coupon_type"
              label="쿠폰 유형"
              rules={[
                {
                  required: true,
                  message: "쿠폰 타입을 선택해주세요",
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                onChange={(value) => {
                  if (value === "ratio") {
                    setIsRate(true);
                    setIsFlat(false);
                  } else {
                    setIsRate(false);
                    setIsFlat(true);
                  }
                }}
              >
                <Select.Option value="flat">정액 할인</Select.Option>
                <Select.Option value="ratio">비율 할인</Select.Option>
              </Select>
            </Form.Item>

            <FormItem
              name="code"
              label="공통 발급 코드"
              rules={[
                {
                  required: true,
                  whitespace: false,
                  message: "공통 발급 코드를 입력해주세요",
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="total"
              label="발행량"
              rules={[
                {
                  required: true,
                  message: "발행량을 입력해주세요",
                },
              ]}
            >
              <InputNumber formatter={(value) => `${value} 장`} />
            </FormItem>
            <FormItem
              name="dup_count"
              label="중복 허용수"
              rules={[
                {
                  required: true,
                  message: "중복 허용수를 입력해주세요",
                },
              ]}
            >
              <InputNumber formatter={(value) => `${value} 장`} min={0} />
            </FormItem>
            {isFlat && (
              <FormItem
                name="discount_amount"
                label="할인 액"
                rules={[
                  {
                    required: true,
                    message: "할인 액을 입력해주세요",
                  },
                ]}
              >
                <InputNumber
                  step={1000}
                  // formatter={(value) => {
                  //   console.log(`value`, value);
                  //   `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원`;
                  // }}
                  // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </FormItem>
            )}

            {isRate && (
              <FormItem
                name="discount_rate"
                label="할인 비율"
                rules={[
                  {
                    required: true,
                    message: "할인 비율을 입력해주세요",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  formatter={(value) => `${value} %`}
                />
              </FormItem>
            )}

            <Form.Item
              name="coupon_category"
              label="쿠폰 구분"
              rules={[
                {
                  required: true,
                  message: "쿠폰 유형을 선택해주세요",
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                onChange={handleCouponCategoryChange}
              >
                <Select.Option value="membership">멤버십</Select.Option>
                <Select.Option value="meeting">미팅룸</Select.Option>
                <Select.Option value="coworking">코워킹룸</Select.Option>
                <Select.Option value="locker">락커</Select.Option>
                <Select.Option value="lounge">라운지</Select.Option>
              </Select>
            </Form.Item>

            {isMembership && (
              <Form.Item name="products" label="적용 상품">
                <Form.Item name="is_all_product">
                  <Radio.Group
                    onChange={(e) => {
                      setIsAllProduct(e.target.value);
                    }}
                  >
                    <Radio style={radioStyle} value={true}>
                      전 상품
                    </Radio>
                    <Radio style={radioStyle} value={false}>
                      상품 선택
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                {!isAllProduct && (
                  <Form.Item
                    name="product_ids"
                    rules={[
                      {
                        required: isAllProduct ? false : true,
                        message: "적용 상품을 선택해주세요",
                      },
                    ]}
                  >
                    <Transfer
                      dataSource={productOptions}
                      showSearch
                      targetKeys={targetProducts}
                      render={(item) => item.title}
                      onChange={handleProductOptionsChange}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            )}
            <Form.Item name="spots" label="적용 스팟">
              <Form.Item name="is_all_spot">
                <Radio.Group
                  onChange={(e) => {
                    setIsAllSpot(e.target.value);
                  }}
                >
                  <Radio style={radioStyle} value={true}>
                    전 지점
                  </Radio>
                  <Radio style={radioStyle} value={false}>
                    지점 선택
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {!isAllSpot && (
                <Form.Item
                  name="spot_ids"
                  rules={[
                    {
                      required: isAllSpot ? false : true,
                      message: "적용 스팟을 선택해주세요",
                    },
                  ]}
                >
                  <Transfer
                    dataSource={spotOptions}
                    showSearch
                    targetKeys={targetSpots}
                    render={(item) => item.title}
                    onChange={handleSpotOptionsChange}
                  />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item name="pub_date" label="발행 기간">
              <Form.Item
                name="pub_date_start"
                style={{ display: "inline-block" }}
                rules={[
                  { required: true, message: "발행기간 시작일을 선택해주세요" },
                ]}
              >
                <DatePicker
                  name="pub_date_start"
                  placeholder="시작일"
                  disabledDate={(current) => {
                    return current && current < moment().subtract("1", "d");
                  }}
                  onChange={(date, dateString) => {
                    setPubDateStart(dateString);
                  }}
                />
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
                name="pub_date_end"
                style={{ display: "inline-block" }}
                rules={[
                  { required: true, message: "발행기간 종료일을 선택해주세요" },
                ]}
              >
                <DatePicker
                  name="pub_date_end"
                  placeholder="종료일"
                  disabledDate={(current) => {
                    return current && current < moment(pubDateStart);
                  }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item name="useable_date" label="유효 기간">
              <Form.Item
                name="useable_date_start"
                style={{ display: "inline-block" }}
                rules={[
                  { required: true, message: "유효기간 시작일을 선택해주세요" },
                ]}
              >
                <DatePicker
                  name="useable_date_start"
                  placeholder="시작일"
                  disabledDate={(current) => {
                    return current && current < moment().subtract("1", "d");
                  }}
                  onChange={(date, dateString) => {
                    setUseableDateStart(dateString);
                  }}
                />
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
                rules={[
                  { required: true, message: "유효기간 종료일을 선택해주세요" },
                ]}
              >
                <DatePicker
                  name="useable_date_end"
                  placeholder="종료일"
                  disabledDate={(current) => {
                    return current && current < moment(useableDateStart);
                  }}
                />
              </Form.Item>
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
