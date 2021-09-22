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

  const [couponInfo, setCouponInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 발행 기간 관련 state
  const [pubDateStart, setPubDateStart] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [pubDateEnd, setPubDateEnd] = useState(
    moment(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ).format("YYYY-MM-DD")
  );

  // 유효 기간 시작, 종료 관련 state
  const [useableDateStart, setUseableDateStart] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [useableDateEnd, setUseableDateEnd] = useState(
    moment(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ).format("YYYY-MM-DD")
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
  const [isAllAply, setIsAllAply] = useState(false);

  // 쿠폰 Form
  const [couponForm] = Form.useForm();

  const getSpotOptions = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        {},
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

        data.map((spot) => {
          const spotOption = {
            key: spot.spot_id.toString(),
            title: spot.name,
          };

          options.push(spotOption);
        });

        setSpotOptions(options);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const getProductOptions = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        {},
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

      // 적용 상품이 존재하는 경우
      if (couponInfo.product_ids) {
        // 세팅
        const targetProducts = couponInfo.product_ids.split("|");
        setTargetProducts(targetProducts);
        couponForm.setFieldsValue({
          product_ids: couponInfo.product_ids.split("|"),
        });
      }

      // 적용 스팟이 존재하는 경우
      if (couponInfo.spot_ids) {
        // 세팅
        const targetSpots = couponInfo.spot_ids.split("|");
        setTargetSpots(targetSpots);
        couponForm.setFieldsValue({
          spot_ids: couponInfo.spot_ids.split("|"),
        });
      }

      // 발행기간
      setPubDateStart(couponInfo.pub_date_start.replace(/\./gi, "-"));
      setPubDateEnd(couponInfo.pub_date_end.replace(/\./gi, "-"));
      // 유효기간
      setUseableDateStart(couponInfo.useable_date_start.replace(/\./gi, "-"));
      setUseableDateEnd(couponInfo.useable_date_end.replace(/\./gi, "-"));
    }
  }, [couponInfo]);

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
      product_ids,
      spot_ids,
      pub_date_start,
      pub_date_end,
      useable_date_start,
      useable_date_end,
    } = couponForm.getFieldValue();

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

    if (!isAllAply) {
      data.product_ids = product_ids.join("|");
      data.spot_ids = spot_ids.join("|");
    }

    if (isFlat) {
      data.discount = discount_amount;
    } else {
      data.discount = discount_rate;
    }

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

  const handleSpotOptionsChange = (targetKeys) => {
    setTargetSpots(targetKeys);
  };

  const handleProductOptionsChange = (targetKeys) => {
    setTargetProducts(targetKeys);
  };

  const handleCouponCategoryChange = (value) => {
    // 이용권 추가시 이용권도 추가
    if (value === "membership") {
      setIsAllAply(false);
    } else {
      setIsAllAply(true);
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

            <FormItem name="code" label="공통 발급 코드">
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
                <InputNumber step={1000} formatter={(value) => `${value} 원`} />
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

            {!isAllAply && (
              <>
                <Form.Item
                  name="product_ids"
                  label="적용 상품"
                  rules={[
                    {
                      required: true,
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
                <Form.Item
                  name="spot_ids"
                  label="적용 스팟"
                  rules={[
                    {
                      required: true,
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
              </>
            )}
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
                  // value={moment(pubDateStart)}
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
                  // value={moment(pubDateEnd)}
                  disabledDate={(current) => {
                    return current && current < moment(pubDateStart);
                  }}
                  onChange={(date, dateString) => {
                    setPubDateEnd(dateString);
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
                  // value={moment(useableDateStart)}
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
                  // value={moment(useableDateEnd)}
                  disabledDate={(current) => {
                    return current && current < moment(useableDateStart);
                  }}
                  onChange={(date, dateString) => {
                    setUseableDateEnd(dateString);
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
