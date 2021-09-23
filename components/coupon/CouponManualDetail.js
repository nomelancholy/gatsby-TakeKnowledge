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
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";

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

  const [manualCouponInfo, setManualCouponInfo] = useState(undefined);
  const [couponInfo, setCouponInfo] = useState(undefined);

  const [isRate, setIsRate] = useState(undefined);
  const [isFlat, setIsFlat] = useState(undefined);

  const [isAllAply, setIsAllAply] = useState(undefined);

  const [issueDate, setIssueDate] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [couponOptions, setCouponOptions] = useState([]);

  const [applyCoupon, setApplyCoupon] = useState(undefined);

  const [isBundle, setIsBundle] = useState(undefined);
  const [isEach, setIsEach] = useState(undefined);

  // 쿠폰 Form
  const [manualCouponForm] = Form.useForm();
  const [couponForm] = Form.useForm();

  const getCouponOptions = () => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/list`,
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
        const data = response.data;

        // auto complete option 형태로 가공
        const optionList = data.items.map((coupon) => {
          const optionObj = {
            value: coupon.name,
            label: coupon.name,
            id: coupon.coupon_id,
          };

          return optionObj;
        });

        console.log(`optionList`, optionList);
        setCouponOptions(optionList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    // 쿠폰 리스트 로드
    getCouponOptions();

    if (couponManualId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/admin/user/coupon/issue_manual/get/${couponManualId}`,
          config
        )
        .then(function (response) {
          const manualCouponInfo = response.data.item;
          setManualCouponInfo(manualCouponInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // manualCouponInfo 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (manualCouponInfo) {
      console.log(`manualCouponInfo`, manualCouponInfo);

      // 쿠폰 정보 조회
      getCouponInfo(manualCouponInfo.coupon_id);
      // 전송용 쿠폰 id 세팅
      setApplyCoupon(manualCouponInfo.coupon_id);

      // 공지 상태
      manualCouponForm.setFieldsValue({
        status: manualCouponInfo.status,
        issue_type: manualCouponInfo.issue_type,
        // status: couponInfo.status,
        // type: couponInfo.type,
        // sticky: couponInfo.sticky,
        // title: couponInfo.title,
      });

      if (manualCouponInfo.issue_type === "bundle") {
        // 대량 발급일 경우
        setIsBundle(true);
        setIsEach(false);
        manualCouponForm.setFieldsValue({
          issue_count: manualCouponInfo.issue_count,
        });
      } else {
        // 개별 발급일 경우
        setIsBundle(false);
        setIsEach(true);
        setTags(manualCouponInfo.issue_emails.split(","));
      }
    }
  }, [manualCouponInfo]);

  // 저장 버튼 클릭
  const handleManualCouponRegisterSubmit = () => {
    const { status, issue_type, issue_count } =
      manualCouponForm.getFieldValue();

    let data = {
      status,
    };

    let url = "";

    if (registerMode) {
      data.coupon_id = applyCoupon;
      data.issue_type = issue_type;
      if (issue_type === "bundle") {
        data.issue_count = issue_count;
      } else {
        // 개별 발급일 경우 이메일 스트링으로 세팅
        data.issue_emails = tags.join(",");
      }
      url = `${process.env.BACKEND_API}/admin/user/coupon/issue_manual/add`;
    } else {
      url = `${process.env.BACKEND_API}/admin/user/coupon/issue_manual/update`;
      data.cmi_id = Number(couponManualId);
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

  const getCouponInfo = (couponId) => {
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
  };

  useEffect(() => {
    if (couponInfo) {
      manualCouponForm.setFieldsValue({
        coupon_id: couponInfo.name,
      });

      couponForm.setFieldsValue({
        coupon_id: couponInfo.coupon_id,
        name: couponInfo.name,
        desc: couponInfo.desc,
        coupon_type: couponInfo.coupon_type,
        code: couponInfo.code,
        total: couponInfo.total,
        coupon_category: couponInfo.coupon_category,
        product_ids: couponInfo.product_ids,
        spot_ids: couponInfo.spot_ids,
        pub_date_start: moment(couponInfo.pub_date_start),
        pub_date_end: moment(couponInfo.pub_date_end),
        useable_date_start: moment(couponInfo.useable_date_start),
        useable_date_end: moment(couponInfo.useable_date_end),
      });

      if (couponInfo.coupon_category === "membership") {
        setIsAllAply(false);
      } else {
        setIsAllAply(true);
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

  const handleSelect = (data, option) => {
    setApplyCoupon(option.id);
    // 선택한 쿠폰 정보 조회
    getCouponInfo(option.id);
  };

  const [tags, setTags] = useState([]);
  const [isInputVisible, setIsInputVisible] = useState(true);

  const handleInputConfirm = (e) => {
    // form 에 enter가 전달되는 것 방지
    e.preventDefault();

    // e-mail 형식 validation
    manualCouponForm
      .validateFields(["tagInput"])
      .then((values) => {
        // Tags 에 추가
        if (values.tagInput) {
          setTags([...tags, values.tagInput]);
        }

        // input 초기화
        manualCouponForm.setFieldsValue({
          tagInput: "",
        });
      })
      .catch((error) => {
        if (error) {
          return;
        }
      });
  };

  useEffect(() => {
    // 10개 까지만 입력
    if (tags.length >= 10) {
      setIsInputVisible(false);
    } else {
      setIsInputVisible(true);
    }
  }, [tags]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  return (
    <>
      <Card
        title={
          couponManualId && couponManualId !== null
            ? `쿠폰 직접발급 ID ${couponManualId}`
            : "쿠폰 직접발급 등록"
        }
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form
          form={manualCouponForm}
          onFinish={handleManualCouponRegisterSubmit}
          initialValues={{ status: "inactive" }}
        >
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="활성/비활성"
          >
            <Form.Item
              name="status"
              label="직접 발급 상태"
              rules={[
                {
                  required: true,
                  message: "쿠폰 발급 여부를 선택해주세요",
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={"active"}>
                  실행
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  중단
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="적용 쿠폰 검색"
              name="coupon_id"
              rules={[
                {
                  required: true,
                  message: "적용 쿠폰을 선택해주세요",
                },
              ]}
            >
              <AutoComplete
                options={couponOptions}
                filterOption={(inputValue, option) =>
                  option.value.includes(inputValue)
                }
                onSelect={handleSelect}
                disabled={registerMode ? false : true}
              />
            </Form.Item>
          </Card>
          <Card
            title="상세 정보"
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
          >
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
              {!isAllAply && (
                <>
                  <Form.Item name="product_ids" label="적용 상품">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="spot_ids" label="적용 스팟">
                    <Input disabled />
                  </Form.Item>
                </>
              )}

              <Form.Item name="pub_date" label="발행 기간">
                <Form.Item
                  name="pub_date_start"
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
                  name="pub_date_end"
                  style={{ display: "inline-block" }}
                >
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
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="발급 방식"
          >
            <Form.Item name="issue_type" label="활성/비활성">
              <Radio.Group
                disabled={registerMode ? false : true}
                onChange={(value) => {
                  if (value.target.value === "bundle") {
                    setIsBundle(true);
                    setIsEach(false);
                  } else {
                    setIsBundle(false);
                    setIsEach(true);
                  }
                }}
              >
                <Radio style={radioStyle} value={"bundle"}>
                  대량 발급
                </Radio>
                <Radio style={radioStyle} value={"each"}>
                  개별 발급
                </Radio>
              </Radio.Group>
            </Form.Item>
            {/* 대량 발행, 개별 발급에 따라  */}
            {isBundle && (
              <Form.Item
                name="issue_count"
                label="대량 발행"
                disabled={registerMode ? false : true}
              >
                <InputNumber />
              </Form.Item>
            )}
            {isEach && (
              <Form.Item
                name="issue_emails"
                label="개별 발급"
                disabled={registerMode ? false : true}
              >
                <>
                  {tags.map((tag) => (
                    <span key={tag} style={{ display: "inline-block" }}>
                      <Tag
                        closable={registerMode ? true : false}
                        onClose={(e) => {
                          e.preventDefault();
                          handleClose(tag);
                        }}
                      >
                        {tag}
                      </Tag>
                    </span>
                  ))}
                  {isInputVisible && registerMode && (
                    <Form.Item
                      name="tagInput"
                      rules={[
                        {
                          type: "email",
                          message: "E-mail 형식으로 입력해주세요",
                        },
                      ]}
                    >
                      <Input
                        // ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        onPressEnter={handleInputConfirm}
                      />
                    </Form.Item>
                  )}
                </>
              </Form.Item>
            )}
          </Card>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
          <Modal
            visible={okModalVisible}
            okText="확인"
            onOk={() => {
              router.push("/coupon/manual");
            }}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            {registerMode ? "쿠폰 등록 완료" : "쿠폰 수정 완료"}
          </Modal>
        </Form>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export default connect((state) => state)(CouponManual);
