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
  Tag,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import CouponDetail from "./CouponDetail";

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

  // 직접 발급 쿠폰 정보 저장 state
  const [manualCouponInfo, setManualCouponInfo] = useState(undefined);

  // 적용 쿠폰 상세 저장 state
  const [couponInfo, setCouponInfo] = useState(undefined);

  // 적용 쿠폰 auto complete에 옵션으로 넣을 모든 쿠폰 리스트 저장 state
  const [couponOptions, setCouponOptions] = useState([]);

  // 적용 쿠폰으로 선택된 쿠폰 ID 저장 state
  const [applyCoupon, setApplyCoupon] = useState(undefined);

  // 대량 발급 / 개별 발급 저장 state
  const [isBundle, setIsBundle] = useState(undefined);
  const [isEach, setIsEach] = useState(undefined);

  // 개별 발급시 메일 입력할 input 표시 구분 state
  const [isInputVisible, setIsInputVisible] = useState(true);
  // 개별 발급시 input에 입력한 email list 저장 state
  const [tags, setTags] = useState([]);

  // modal 표시 구분 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  // 직접 발급 쿠폰 Form
  const [manualCouponForm] = Form.useForm();

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

  // 적용 쿠폰 선택 -> 쿠폰 조회 후
  useEffect(() => {
    if (couponInfo) {
      manualCouponForm.setFieldsValue({
        coupon_id: couponInfo.name,
      });
    }
  }, [couponInfo]);

  // tags 변경시 length 체크해 input visible on off
  useEffect(() => {
    // 10개 까지만 입력
    if (tags.length >= 10) {
      setIsInputVisible(false);
    } else {
      setIsInputVisible(true);
    }
  }, [tags]);

  // 적용 쿠폰에 옵션으로 넣을 쿠폰 리스트 조회
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

  // 적용 쿠폰 옵션 중 선택한 쿠폰 정보 조회
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
        // 대량 발행 일 경우 매수
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

  // 적용 쿠폰 옵션 중 쿠폰 하나 선택
  const handleSelect = (data, option) => {
    setApplyCoupon(option.id);
    // 선택한 쿠폰 정보 조회
    getCouponInfo(option.id);
  };

  // 개별 발급시 input에 메일 추가
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

  // 태그 삭제
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
          {couponInfo && <CouponDetail couponInfo={couponInfo} />}
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
