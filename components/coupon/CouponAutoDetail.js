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
  AutoComplete,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import moment from "moment";

import FormItem from "antd/lib/form/FormItem";
import CouponDetail from "./CouponDetail";

const CouponAuto = (props) => {
  const { couponAutoId, token } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [autoCouponInfo, setAutoCouponInfo] = useState(undefined);
  const [couponInfo, setCouponInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [couponOptions, setCouponOptions] = useState([]);

  const [applyCoupon, setApplyCoupon] = useState(undefined);

  const [isIssueDay, setIsIssueDay] = useState(undefined);

  const [targetOptions, setTargetOptions] = useState([]);

  // 쿠폰 Form
  const [autoCouponForm] = Form.useForm();

  useEffect(() => {
    // 쿠폰 리스트 로드
    getCouponOptions();

    if (couponAutoId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/admin/user/coupon/issue_auto/get/${couponAutoId}`,
          config
        )
        .then(function (response) {
          const autoCouponInfo = response.data.item;
          setAutoCouponInfo(autoCouponInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // autoCouponInfo 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (autoCouponInfo) {
      console.log(`autoCouponInfo`, autoCouponInfo);

      if (autoCouponInfo.issue_category === "issue_day") {
        setIsIssueDay(true);
      }

      // 쿠폰 정보 조회
      getCouponInfo(autoCouponInfo.coupon_id);
      // 전송용 쿠폰 id 세팅
      setApplyCoupon(autoCouponInfo.coupon_id);

      // 자동 발급 유형에 따라 자동 발급 대상 옵션 세팅
      if (
        autoCouponInfo.issue_category === "issue_day" ||
        autoCouponInfo.issue_category === "birthday"
      ) {
        setTargetOptions([
          { label: "전체", value: "all" },
          { label: "회원", value: "user" },
          { label: "멤버", value: "member" },
        ]);
      } else if (
        autoCouponInfo.issue_category === "join" ||
        autoCouponInfo.issue_category === "membership_expired" ||
        autoCouponInfo.issue_category === "membership_terminate"
      ) {
        setTargetOptions([{ label: "회원", value: "user" }]);
      } else if (autoCouponInfo.issue_category === "referral") {
        setTargetOptions([
          { label: "추천인", value: "referral" },
          { label: "피추천인", value: "niminee" },
        ]);
      }

      // 자동 발급 유형과 대상 세팅
      autoCouponForm.setFieldsValue({
        issue_category: autoCouponInfo.issue_category,
        target: autoCouponInfo.target,
      });

      // 자동 발급 유형이 지정일일 경우 지정일 세팅
      if (autoCouponInfo.issue_date) {
        autoCouponForm.setFieldsValue({
          issue_date: moment(autoCouponInfo.issue_date),
        });
      }
    }
  }, [autoCouponInfo]);

  useEffect(() => {
    if (couponInfo) {
      autoCouponForm.setFieldsValue({
        coupon_id: couponInfo.name,
      });
    }
  }, [couponInfo]);

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

  // 저장 버튼 클릭
  const handleAutoCouponRegisterSubmit = () => {
    const { status, coupon_id, issue_category, target, issue_date } =
      autoCouponForm.getFieldValue();

    let data = {
      status,
    };

    let url = "";

    if (registerMode) {
      data.coupon_id = applyCoupon;
      data.issue_category = issue_category;
      data.target = target;
      data.issue_date = moment(issue_date).format("YYYY-MM-DD HH:mm:ss");
      url = `${process.env.BACKEND_API}/admin/user/coupon/issue_auto/add`;
    } else {
      url = `${process.env.BACKEND_API}/admin/user/coupon/issue_auto/update`;
      data.cai_id = Number(couponAutoId);
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

  const handleSelect = (data, option) => {
    setApplyCoupon(option.id);
    // 선택한 쿠폰 정보 조회
    getCouponInfo(option.id);
  };

  const handleIssueCategoryChange = (value) => {
    if (value === "issue_day") {
      setIsIssueDay(true);
    } else {
      setIsIssueDay(false);
    }

    if (value === "issue_day" || value === "birthday") {
      setTargetOptions([
        { label: "전체", value: "all" },
        { label: "회원", value: "user" },
        { label: "멤버", value: "member" },
      ]);
    } else if (
      value === "join" ||
      value === "membership_expired" ||
      value === "membership_terminate"
    ) {
      setTargetOptions([{ label: "회원", value: "user" }]);
    } else if (value === "referral") {
      setTargetOptions([
        { label: "추천인", value: "referral" },
        { label: "피추천인", value: "niminee" },
      ]);
    }
  };

  return (
    <>
      <Card
        title={
          couponAutoId && couponAutoId !== null
            ? `쿠폰 자동발급 ID ${couponAutoId}`
            : "쿠폰 자동발급 등록"
        }
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form
          form={autoCouponForm}
          onFinish={handleAutoCouponRegisterSubmit}
          initialValues={{ status: "inactive", issue_date: moment(new Date()) }}
        >
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item
              name="status"
              label="자동 발급 상태"
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
              name="coupon_id"
              label="적용 쿠폰"
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
          {couponInfo && <CouponDetail couponInfo={couponInfo} />}

          <Card>
            <Form.Item
              name="issue_category"
              label="자동발급 유형"
              rules={[
                {
                  required: true,
                  message: "자동발급 유형을 선택해주세요",
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                onChange={handleIssueCategoryChange}
                disabled={registerMode ? false : true}
              >
                <Select.Option value="birthday">생일</Select.Option>
                <Select.Option value="issue_day">지정일</Select.Option>
                <Select.Option value="join">회원가입</Select.Option>
                <Select.Option value="membership_expired">
                  멤버십 만료
                </Select.Option>
                <Select.Option value="membership_terminate">
                  멤버십 해지
                </Select.Option>
                <Select.Option value="referral">리퍼럴</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="target"
              label="자동발급 대상"
              rules={[
                {
                  required: true,
                  message: "자동 발급 대상을 선택해주세요",
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                options={targetOptions}
                disabled={registerMode ? false : true}
              ></Select>
            </Form.Item>
            {isIssueDay && (
              <Form.Item
                name="issue_date"
                label="지정일"
                rules={[
                  {
                    required: true,
                    message: "지정일을 선택해주세요",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  name="reserved_datetime"
                  disabled={registerMode ? false : true}
                />
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
              router.push("/coupon/auto");
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

export default connect((state) => state)(CouponAuto);
