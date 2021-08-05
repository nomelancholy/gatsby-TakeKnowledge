import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  Table,
  Col,
  Tabs,
  Select,
  DatePicker,
  Pagination,
  Anchor,
  Checkbox,
} from "antd";
import "./test.css";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Router, { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";
import { contractOrderColumns } from "@utils/columns/order";
import { serviceListColumns } from "@utils/columns/service";
import { contractVoucherColumns } from "@utils/columns/product";
import ContractCancelModal from "@components/contract/CancelModal";

const ContractDetail = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

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

  // 계약 상세 내역
  const [contractDetail, setContractDetail] = useState(undefined);
  // 청구/결제 정보
  const [orderList, setOrderList] = useState([]);
  // 부가 서비스 예약 목록
  const [serviceList, setServiceList] = useState([]);
  // 상담 메모 히스토리
  const [memoHistoryList, setMemoHistoryList] = useState([]);

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const [contractCancelModalVisible, setContractCancelModalVisible] =
    useState(false);

  // 상담 메모 페이징용 state
  const [memoMinPage, setMemoMinPage] = useState(0);
  const [memoMaxPage, setMemoMaxPage] = useState(1);
  const [memoHistoryTotal, setMemoHistoryTotal] = useState(1);

  // 회원, 상품, 요금제 페이지로 링크 연결용
  const [uid, setUid] = useState(undefined);
  const [productId, setProductId] = useState(undefined);
  const [rateplanId, setRateplanId] = useState(undefined);
  const [rateplanName, setRateplanName] = useState(undefined);

  // 부가 서비스 이용 정보

  const PAGE_SIZE = 5;

  // 청구 결제 정보 그리드 페이지 / 로딩
  const [orderPagination, setOrderPagination] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);

  const [monthlyCostCalculatePagination, setMonthlyCostCalculatePagination] =
    useState({});

  const [servicePagination, setServicePagination] = useState({});
  const [serviceLoading, setServiceLoading] = useState(false);

  // 유저 카드 리스트 state
  const [userCardList, setUserCardList] = useState([]);
  // 선택된 카드 저장 state
  const [selectedCard, setSelectedCard] = useState(undefined);
  // 결제 카드 변경 toggle flag
  const [isCardChangeMode, setIsCardChangeMode] = useState(false);

  // 활성화 된 지점 리스트 state
  const [activeSpotList, setActiveSpotList] = useState(undefined);
  // 선택된 지점 저장 state
  const [selectedSpot, setSelectedSpot] = useState(undefined);
  // 선호하는 지점 변경 toggle flag
  const [isSpotChangeMode, setIsSpotChangeMode] = useState(false);

  // 계약 정보 Form
  const [contractForm] = Form.useForm();
  // 회원 정보 Form
  const [userForm] = Form.useForm();
  // 청구 내용 Form
  const [rateplanForm] = Form.useForm();
  // 청구 하기 Form
  const [orderRequestForm] = Form.useForm();
  // 상품 정보 Form
  const [productForm] = Form.useForm();
  // 상담 메모 Form
  const [memoForm] = Form.useForm();
  // 상담 메모 히스토리 Form
  const [historyForm] = Form.useForm();

  // 유저 카드리스트 조회
  const getUserCardList = (params) => {
    axios
      .post(
        `${process.env.BACKEND_API}/user/card/list`,
        { ...params },
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
        if (data.items && data.items.length !== 0) {
          setUserCardList(data.items);
          // 대표 결제 카드가 Select value로 선택되도록 변경
          const mainCard = data.items.filter((card) => {
            if (card.favorite === 1) {
              return card;
            }
          });

          if (mainCard && mainCard.length !== 0) {
            setSelectedCard(mainCard[0].customer_uid);
          }
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 활성화 된 스팟 리스트 조회
  const getActiveSpotList = (params) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        { ...params },
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
        setActiveSpotList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 대표 결제 카드 변경 버튼 클릭
  const handleCardChange = (value) => {
    setSelectedCard(value);
  };

  // 대표 결제 카드 변경 요청
  const handleCardChangeRequest = () => {
    if (isCardChangeMode) {
      // 대표 결제 카드 변경
      axios
        .post(
          `${process.env.BACKEND_API}/user/card/favorite`,
          {
            uid: uid,
            customer_uid: selectedCard,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsCardChangeMode(false);
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setIsCardChangeMode(true);
    }
  };

  // 선호하는 스팟 변경 버튼 클릭
  const handleSpotChange = (value) => {
    setSelectedSpot(value);
  };

  // 선호하는 스팟 변경 요청
  const handleSpotChangeRequest = () => {
    if (isSpotChangeMode) {
      // TO-DO
      // 선호하는 스팟 변경
      axios
        .post(
          `${process.env.BACKEND_API}/user/fav_spot/edit`,
          {
            uid: Number(uid),
            spot_id: selectedSpot,
            favorite: 1,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsSpotChangeMode(false);
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setIsSpotChangeMode(true);
    }
  };

  // 청구 결제 정보 조회
  const getOrderList = (params) => {
    setOrderLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
        { ...params },
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
        setOrderList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // 청구/결제 정보 pageInfo 세팅
        setOrderPagination(pageInfo);

        setMonthlyCostCalculatePagination(pageInfo);

        // 취소/해지 Modal - 월 정기 납부 내역 pageInfo 세팅

        // 로딩바 세팅
        setOrderLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 청구 결제 정보 페이징
  const handleOrderTableChange = (pagination) => {
    setOrderPagination(pagination);
  };

  // 부가서비스 이용 정보 조회
  const getServiceList = (params) => {
    setServiceLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/service/list`,
        { ...params },
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
        console.log(`service data`, data);
        setServiceList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setServicePagination(pageInfo);

        // 로딩바 세팅
        setServiceLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 부가서비스 이용 내역 정보 페이징
  const handleServiceTableChange = (pagination) => {
    setServicePagination(pagination);
  };

  // 상담 메모 히스토리 조회
  const getMemoHistory = (params) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/history/list`,
        {
          ...params,
        },
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
        setMemoHistoryTotal(data.total);
        setMemoHistoryList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 상담 메모 저장
  const handleMemoSubmit = (values) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/history/add`,
        {
          contract_id: Number(id),
          subject: values.subject,
          content: values.content,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          getMemoHistory({ contract_id: id });
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 상담 메모 페이징
  const handleHistoryChange = (value) => {
    setMemoMinPage(value - 1);
    setMemoMaxPage(value);
  };

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // 청구/결제 상세 내용 조회
    axios
      .get(`${process.env.BACKEND_API}/admin/contract/get/${id}`, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: decodeURIComponent(token),
        },
      })
      .then((response) => {
        const data = response.data.item;
        setContractDetail(data);
        console.log(`data`, data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });

    getOrderList({ page: 1, size: PAGE_SIZE, contract_id: id });

    getServiceList({
      page: 1,
      size: PAGE_SIZE,
      // contract_type: "service",
      contract_id: id,
    });

    getMemoHistory({
      contract_id: id,
    });
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (contractDetail) {
      console.log(`contractDetail`, contractDetail);

      // 계약 상태
      let status = "";

      switch (contractDetail.status) {
        case "buy":
          status = "계약 신청";
          break;
        case "canceled":
          status = "계약 취소";
          break;
        case "pay":
          status = "계약 완료(이용중)";
          break;
        case "expired":
          status = "계약 해지 (만료)";
          break;
        case "terminate":
          status = "계약 해지 (중도)";
          break;
        case "withdraw":
          status = "계약 해지 (청약 철회)";
          break;
        default:
          break;
      }

      // 정기 결제일
      const nextPayday =
        contractDetail.next_payday === null
          ? "- "
          : `매월 ${contractDetail.next_payday}일`;

      // 계약 정보
      contractForm.setFieldsValue({
        // 계약 ID
        contract_id: contractDetail.contract_id,
        // 계약 상태
        status: status,
        // 계약 상품
        product_name: contractDetail.rateplan.product.name,
        // 사용 요금제
        rateplan_name: contractDetail.rateplan.name,
        // 연장 회차
        extension: contractDetail.extension,
        // 계약 생성 일자
        regdate: contractDetail.regdate,
        // 정기 결제일
        next_payday: nextPayday,
        // 계약 시작 일자
        start_date: contractDetail.start_date,
        // 다음 정기 결제일
        next_paydate: contractDetail.next_paydate,
        // 계약 종료 일자
        end_date: contractDetail.end_date,
        // 계약 취소 일자
        cancel_date: contractDetail.cancel_date,
        // 계약 해지 일자
        terminate_date: contractDetail.terminate_date,
      });

      // 링크 연결용 uid 세팅
      setUid(contractDetail.uid);

      let userRoleExt = "";

      switch (contractDetail.user.user_role_ext) {
        case "ffadmin":
          userRoleExt = "파이브스팟 어드민";
          break;
        case "member":
          userRoleExt = "일반";
          break;
        case "group_member":
          userRoleExt = "그룹 멤버";
          break;
        case "group_master":
          userRoleExt = "그룹 관리자 멤버";
          break;
        case "group_admin":
          userRoleExt = "그룹 관리자";
          break;
        default:
          break;
      }

      // 회원 정보
      userForm.setFieldsValue({
        // 멤버 이름
        user_name: contractDetail.user.user_name,
        // 회원 구분
        has_contract: contractDetail.user.has_contract ? "멤버" : "회원",
        // 회원 역할
        user_role_ext: userRoleExt,
        // 아이디
        user_login: contractDetail.user.user_login,
        // 핸드폰 번호
        phone: contractDetail.user.phone,
        // 생년월일
        birthday: contractDetail.user.user_profile[0].user_birthday,
        // 직무
        job: contractDetail.user.user_profile[0].job,
        // 주소지
        address: contractDetail.user.user_profile[0].address,
        // 상세 주소
        address_etc: contractDetail.user.user_profile[0].address_etc,
      });

      // 사용자 카드 조회 -  대표 결제 카드 세팅
      getUserCardList({ uid: contractDetail.uid });

      // 선호 지점 옵션으로 사용할 활성화 된 스팟 조회
      getActiveSpotList({ page: 1, size: 100, status: "active" });

      // 상품 페이지 링크 연결용 product_id 세팅
      setProductId(contractDetail.rateplan.product.product_id);

      // 상품 정보
      productForm.setFieldsValue({
        // 상품명
        name: contractDetail.rateplan.product.name,
        product_type: productType,
        service_type: serviceType,
        paymethod: "",
        working_days: workingDays,
        start_time: contractDetail.rateplan.product.start_time,
        end_time: contractDetail.rateplan.product.end_time,
        spaces: contractDetail.rateplan.product.spaces.join(", "),
      });

      // 링크연결용 rateplan_id 세팅
      setRateplanId(contractDetail.rateplan.rateplan_id);
      setRateplanName(contractDetail.rateplan.name);

      //
      rateplanForm.setFieldsValue({
        // rateplan_name: contractDetail.rateplan.name,
        product_price: contractDetail.rateplan.price.toLocaleString("ko"),
        dc_price: contractDetail.rateplan.dc_price.toLocaleString("ko"),
        total: (
          contractDetail.rateplan.price - contractDetail.rateplan.dc_price
        ).toLocaleString("ko"),
      });

      let planSpot = "";

      switch (contractDetail.rateplan.product.plan_spot) {
        case "all_spot":
          planSpot = "ALL SPOT";
          break;
        case "one_spot":
          planSpot = "ONE SPOT";
          break;
        default:
          break;
      }

      let productType = "";

      switch (contractDetail.rateplan.product.type) {
        case "membership":
          productType = "멤버십";
          break;
        case "service":
          productType = "부가 서비스";
          break;
        default:
          break;
      }

      let serviceType = "";

      switch (contractDetail.rateplan.product.service_type) {
        case "accumulate":
          serviceType = "기본형";
          break;
        case "deduction":
          serviceType = "차감형";
          break;
        default:
          break;
      }

      let workingDays = [];

      Object.entries(contractDetail.rateplan.product.working_days).filter(
        (obj) => {
          if (obj[1]) {
            workingDays.push(obj[0]);
          }
        }
      );

      memoForm.setFieldsValue({});
      historyForm.setFieldsValue({});

      // 2차
      // groupForm.setFieldsValue({});
    }
  }, [contractDetail]);

  useEffect(() => {
    if (activeSpotList) {
      if (
        contractDetail.user.fav_spot &&
        contractDetail.user.fav_spot.spot_id
      ) {
        // 옵션중 세팅된 spot을 선호 스팟으로 세팅
        setSelectedSpot(contractDetail.user.fav_spot.spot_id);
      }
    }
  }, [activeSpotList]);

  // 2차

  // 그룹 정보 관련
  // const [groupForm] = Form.useForm();

  // 이용 내역 정보 관련
  // const [voucherPagination, setVoucherPagination] = useState({});
  // const [voucherLoading, setVoucherLoading] = useState(false);
  // const handleVoucherTableChange = (pagination) => {
  //   setVoucherPagination(pagination);
  // };
  // const [voucherList, setVoucherList] = useState([]);

  // 선택한 청구 ID 저장
  const [selectedRowKeys, setselectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys) => {
    console.log(`selectedRowKeys`, selectedRowKeys);
    setselectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="계약 상세" key="1">
          <Card
            extra={<a onClick={() => router.back()}>뒤로 가기</a>}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Card
              title="계약 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={contractForm} layout="vertical">
                <Form.Item name="contract_id" label="계약 ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="status" label="계약 상태">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="product_name" label="계약 상품">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="rateplan_name" label="사용 요금제">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="extension" label="연장 회차">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="regdate" label="계약 생성 일자">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="next_payday" label="정기 결제일">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="start_date" label="계약 시작 일자">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="next_paydate" label="다음 정기 결제일">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="end_date" label="계약 종료 일자">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="cancel_date" label="계약 취소 일자">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="terminate_date" label="계약 해지 일자">
                  <Input disabled />
                </Form.Item>
              </Form>
            </Card>

            <Card title="회원 정보">
              <Form form={userForm} layout="vertical">
                <Form.Item name="uid" label="회원 ID">
                  {uid && (
                    <Anchor>
                      <Anchor.Link
                        href={`/user/${contractDetail.uid}`}
                        title={contractDetail.uid}
                      />
                    </Anchor>
                  )}
                </Form.Item>
                <Form.Item name="user_name" label="멤버 이름">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="has_contract" label="회원 구분">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="user_role_ext" label="회원 역할">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="user_login" label="아이디">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="phone" label="핸드폰 번호">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="user_birthday" label="생년 월일">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="job" label="직무">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="address" label="주소지">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="address_etc" label="상세 주소">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="card" label="대표 결제 카드">
                  <Select
                    value={selectedCard}
                    onChange={handleCardChange}
                    disabled={!isCardChangeMode}
                  >
                    {userCardList &&
                      userCardList.length !== 0 &&
                      userCardList.map((card) => (
                        <Select.Option
                          key={card.customer_uid}
                          value={card.customer_uid}
                        >
                          {card.name}
                        </Select.Option>
                      ))}
                  </Select>
                  <Button type="primary" onClick={handleCardChangeRequest}>
                    {isCardChangeMode ? "저장" : "변경"}
                  </Button>
                  {isCardChangeMode && (
                    <Button
                      onClick={() => {
                        setIsCardChangeMode(false);
                      }}
                    >
                      취소
                    </Button>
                  )}
                </Form.Item>
                <Form.Item name="favorite_spot" label="선호 지점">
                  <Select
                    value={selectedSpot}
                    onChange={handleSpotChange}
                    disabled={!isSpotChangeMode}
                  >
                    {activeSpotList &&
                      activeSpotList.length !== 0 &&
                      activeSpotList.map((spot) => (
                        <Select.Option key={spot.spot_id} value={spot.spot_id}>
                          {spot.name}
                        </Select.Option>
                      ))}
                  </Select>
                  <Button type="primary" onClick={handleSpotChangeRequest}>
                    {isSpotChangeMode ? "저장" : "변경"}
                  </Button>
                  {isSpotChangeMode && (
                    <Button
                      onClick={() => {
                        setIsSpotChangeMode(false);
                      }}
                    >
                      취소
                    </Button>
                  )}
                </Form.Item>
              </Form>
            </Card>
            <Card
              title="상품 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={productForm} layout="vertical">
                <Form.Item name="product_id" label="상품 ID">
                  <Anchor>
                    <Anchor.Link
                      href={`/product/${productId}`}
                      title={productId}
                    />
                  </Anchor>
                </Form.Item>
                <Form.Item name="name" label="상품 명">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="product_type" label="상품 구분">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="category" label="상품 카테고리">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="plan_spot" label="하위 스팟 권한 범위">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="service_type" label="정산 유형">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="period_amount" label="권한 제공 기간">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="time_unit" label="차감 단위">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="period_unit " label="권한 제공 기간 단위">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="pay_extend" label="자동 결제">
                  <Input disabled />
                </Form.Item>
              </Form>
            </Card>
            <Card
              title="요금 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={rateplanForm} layout="vertical">
                <Form.Item name="rateplan_name" label="적용 요금제">
                  <Anchor>
                    <Anchor.Link
                      href={`/rateplan/${rateplanId}`}
                      title={`${rateplanName}(${rateplanId})`}
                    />
                  </Anchor>
                </Form.Item>
                <Form.Item name="product_price" label="멤버십 상품요금(A)">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="dc_price" label="할인액(B)">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="total" label="합계금액(A-B)">
                  <Input disabled />
                </Form.Item>
              </Form>
            </Card>

            <Card
              title="청구/결제 정보"
              extra={
                <Button
                  onClick={() => {
                    setPaymentModalVisible(true);
                  }}
                >
                  청구하기
                </Button>
              }
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Table
                size="middle"
                rowSelection={rowSelection}
                rowClassName={(record, index) =>
                  record.contract.status === "pay" ? "unpaid-row" : ""
                }
                columns={contractOrderColumns}
                rowKey={(record) => record.order.order_id}
                dataSource={orderList}
                pagination={orderPagination}
                loading={orderLoading}
                onChange={handleOrderTableChange}
              />
            </Card>
            <Modal
              visible={paymentModalVisible}
              okText="결제하기"
              cancelText="취소"
              onOk={() => {
                router.push("/payment");
              }}
              onCancel={() => {
                setPaymentModalVisible(false);
              }}
            >
              <Card title={"청구하기"}>
                <Form form={orderRequestForm}>
                  <Form.Item name="order_item" label="청구 항목">
                    <Select>
                      <Select.Option value="membership">멤버십</Select.Option>
                      <Select.Option value="coworking">코워킹룸</Select.Option>
                      <Select.Option value="locker">스마트 락커</Select.Option>
                      <Select.Option value="penalty">패널티</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="order_date" label="청구 일자">
                    <DatePicker></DatePicker>
                  </Form.Item>
                  <Form.Item namme="memo" label="메모">
                    <Input.TextArea></Input.TextArea>
                  </Form.Item>
                  <Form.Item namme="total" label="청구 요금">
                    <Input disabled />
                  </Form.Item>
                </Form>
              </Card>
            </Modal>

            <Card
              title={`부가 서비스 이용 정보`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Table
                size="middle"
                columns={serviceListColumns}
                rowKey={(record) => record.contract.contract_id}
                dataSource={serviceList}
                pagination={servicePagination}
                loading={serviceLoading}
                onChange={handleServiceTableChange}
              />
            </Card>
            <Card
              title={`상담 메모`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={memoForm} onFinish={handleMemoSubmit}>
                <Form.Item name="subject" label="">
                  <Input />
                </Form.Item>
                <Form.Item name="content" label="">
                  <Input.TextArea />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  저장
                </Button>
              </Form>
            </Card>

            {memoHistoryList.slice(memoMinPage, memoMaxPage).map((memo) => (
              <Card
                title={`상담 메모 히스토리`}
                bodyStyle={{ padding: "1rem" }}
                className="mb-4"
              >
                <Input disabled value={memo.subject} />
                <Input.TextArea disabled value={memo.content} />
              </Card>
            ))}

            <Pagination
              onChange={handleHistoryChange}
              defaultCurrent={1}
              defaultPageSize={1}
              total={memoHistoryTotal}
            />

            <Button>계약 시작일 변경</Button>
            <Button>계약 연장</Button>
            <Button
              onClick={() => {
                setContractCancelModalVisible(true);
              }}
            >
              계약 취소 / 해지
            </Button>
            <ContractCancelModal
              visible={contractCancelModalVisible}
              setVisible={setContractCancelModalVisible}
              contractDetail={contractDetail}
              orderList={orderList}
              pagination={monthlyCostCalculatePagination}
              setPagination={setMonthlyCostCalculatePagination}
            />

            <Row type="flex" align="middle" className="py-4">
              <span className="px-2 w-10"></span>
            </Row>
            {/* 2차 */}
            {/* 
            <Card
              title={`이용 내역 정보`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Table
                size="middle"
                columns={contractVoucherColumns}
                rowKey={(record) => record.order.order_id}
                dataSource={voucherList}
                pagination={voucherPagination}
                loading={voucherLoading}
                onChange={handleVoucherTableChange}
              />
            </Card> */}

            {/* 2차 */}
            {/* <Card
              title="그룹 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={groupForm} layout="vertical">
                <Form.Item name="group_name" label="그룹명(기업명)">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="group_id" label="그룹 ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="business_number" label="사업자 등록 번호">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="address" label="사업자 주소">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="pay_demand" label="결제 방식">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="card" label="대표 결제 카드">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="number" label="사업자 등록증">
                  <Input disabled />
                </Form.Item>
              </Form>
            </Card> */}
          </Card>
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

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(ContractDetail);
