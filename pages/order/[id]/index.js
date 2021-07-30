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
  Select,
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const ContractDetail = (props) => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const orderItmesColumns = [
    {
      title: "항목",
      dataIndex: "name",
      // render: (text, record) => {
      //   const renderText = `${text.order_id}`;
      //   return renderText;
      // },
    },
    {
      title: "할인쿠폰",
      dataIndex: "coupon",
      // render: (text, record) => {
      //   const renderText = `${text.order_id}`;
      //   return renderText;
      // },
    },
    {
      title: "금액",
      dataIndex: "amount",
      // render: (text, record) => {
      //   const renderText = `${text.order_id}`;
      //   return renderText;
      // },
    },
    {
      title: "청구 일자",
      dataIndex: "order_date",
      // render: (text, record) => {
      //   const renderText = `${text.order_id}`;
      //   return renderText;
      // },
    },
    {
      title: "청구 사유",
      dataIndex: "reason",
      render: (text, record) => {
        return <Input style={{ width: 160 }}></Input>;
      },
    },
  ];

  // 청구서 테이블 컬럼 정의
  const orderColumns = [
    {
      title: "청구 ID",
      dataIndex: "order",
      render: (text, record) => {
        const renderText = `${text.order_id}`;
        return renderText;
      },
    },
    {
      title: "처리 상태",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        if (text.status === "wait") {
          renderText = "계약 신청(입금전)";
        } else if (text.status === "buy") {
          renderText = "계약 신청(이용전)";
        } else if (text.status === "pay") {
          renderText = "계약 완료(이용중)";
        } else if (text.status === "refund") {
          renderText = "계약 해지(환불)";
        } else if (text.status === "expired") {
          renderText = "계약 해지(만료)";
        } else if (text.status === "terminate") {
          renderText = "계약 해지(중도)";
        } else if (text.status === "canceled") {
          renderText = "계약 해지(취소)";
        }

        return renderText;
      },
    },
    {
      title: "발송 시간",
      dataIndex: "group_id",
    },
    {
      title: "email 발송 상태",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        if (text.contract_type === "service") {
          renderText = "부가서비스";
        } else if (text.contract_type === "membershipt") {
          renderText = "멤버십";
        } else if (text.contract_type === "voucher") {
          renderText = "이용권";
        }

        return renderText;
      },
    },
    {
      title: "파일명",
      dataIndex: "product",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "등록자",
      dataIndex: "contract",
      render: (text, record) => {
        console.log(`text`, text);
        return text.next_paydate;
      },
    },
    {
      title: "다운로드",
      dataIndex: "pay_method",
      render: (text, record) => {
        let renderText = "";

        if (text.type == "personal") {
          renderText = "개인 카드 결제";
        } else {
          renderText = "법인 카드 결제";
        }

        return renderText;
      },
    },
  ];

  // 결제 내역 columns 정의
  const paymentColumns = [
    {
      title: "결제 ID",
      dataIndex: "payment_id",
    },
    {
      title: "결제 카드",
      dataIndex: "user_paymethod",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "결제 유형",
      dataIndex: "user_paymethod",
      render: (text, record) => {
        let renderText = "";

        if (text.type == "personal") {
          renderText = "개인 카드 결제";
        } else {
          renderText = "법인 카드 결제";
        }

        return renderText;
      },
    },
    {
      title: "결제 방식",
      dataIndex: "product",
      render: (text, record) => {
        let renderText = "";

        if (text.pay_demand == "pre") {
          renderText = "선불";
        } else if (text.pay_demand == "deffered") {
          renderText = "후불";
        } else if (text.pay_demand == "last") {
          renderText = "말일 결제";
        }

        return renderText;
      },
    },
    {
      title: "결제 금액",
      dataIndex: "total",
      render: (text, record) => {
        return text.toLocaleString("ko");
      },
    },
    {
      title: "결제 상태",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        if (text === "wait") {
          renderText = "대기(예정), 결제일 전";
        } else if (text === "buy") {
          renderText = "결제";
        } else if (text === "unpaid") {
          renderText = "미납, 결제일 후";
        } else if (text === "canceled") {
          renderText = "취소";
        } else if (text === "fail") {
          renderText = "실패";
        }

        return renderText;
      },
    },
    {
      title: "등록자",
      dataIndex: "",
      render: (text, record) => {
        return "System";
      },
    },
    {
      title: "등록 일시",
      dataIndex: "regdate",
    },
    {
      title: "환불",
      dataIndex: "",
      render: (text, record) => {
        return <Button>환불</Button>;
      },
    },
  ];

  const PAGE_SIZE = 5;

  // 청구 항목 아이템

  const [orderItemList, setOrderItemList] = useState([]);

  // 청구서 테이블 페이징, 로딩
  const [orderPagination, setOrderPagination] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);

  // 청구서 리스트
  const [orderList, setOrderList] = useState([]);

  // 상품 이용 내역 테이블 변경
  const handleOrderTableChange = (pagination) => {
    setOrderPagination(pagination);

    // 호출
    getOrderList({ page: pagination.current, size: PAGE_SIZE, uid: id });
  };

  // 청구서 내역 조회
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

        // pageInfo 세팅
        setOrderPagination(pageInfo);

        // 로딩바 세팅
        setOrderLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 결제 내역 테이블 페이징, 로딩
  const [paymentPagination, setPaymentPagination] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  // 결제 내역 리스트
  const [paymentList, setPaymentList] = useState([]);

  // 상품 이용 내역 테이블 변경
  const handlePaymentTableChange = (pagination) => {
    setPaymentPagination(pagination);

    // 호출
    getPaymentList({ page: pagination.current, size: PAGE_SIZE, uid: id });
  };

  // 결제 내역 조회
  const getPaymentList = (params) => {
    setPaymentLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/payment/list`,
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
        console.log(`paymnet data`, data);
        setPaymentList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setPaymentPagination(pageInfo);

        // 로딩바 세팅
        setPaymentLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  const [orderDetail, setOrderDetail] = useState(undefined);

  // 선택된 결제 카드
  const [selectedCard, setSelectedCard] = useState([]);

  // 청구 상태
  const [orderStatusForm] = Form.useForm();
  // 그룹 정보
  const [groupForm] = Form.useForm();
  // 회원 정보
  const [userForm] = Form.useForm();
  // 계약 정보
  const [contractForm] = Form.useForm();
  // 청구 내용
  const [orderForm] = Form.useForm();

  useEffect(() => {
    // 청구/결제 상세 내용 조회
    axios
      .get(`${process.env.BACKEND_API}/admin/contract/order/get/${id}`, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: decodeURIComponent(token),
        },
      })
      .then((response) => {
        const data = response.data.item;

        console.log(`data`, data);
        setOrderDetail(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });

    // 결제 내역 조회
    getPaymentList({ page: 1, size: PAGE_SIZE });
  }, []);

  const [userCardList, setUserCardList] = useState([]);

  const getUserCardList = (uid) => {
    axios
      .post(
        `${process.env.BACKEND_API}/user/card/list`,
        {
          uid,
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
        setUserCardList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (orderDetail) {
      console.log(`orderDetail`, orderDetail);
      // 유저 카드 정보 조회
      getUserCardList(orderDetail.order.uid);

      // 청구 상태
      orderStatusForm.setFieldsValue({
        status: "active",
      });

      // 그룹 정보
      groupForm.setFieldsValue({});

      // 회원 정보
      userForm.setFieldsValue({
        uid: orderDetail.contract.user.uid,
        user_name: orderDetail.contract.user.user_name,
        user_login: orderDetail.contract.user.user_login,
        phone: "",
        paymethod: orderDetail.contract.user.paymethod,
      });

      let contractStatus = "";

      if (orderDetail.contract.status === "wait") {
        contractStatus = "계약 신청(입금전)";
      } else if (orderDetail.contract.status === "buy") {
        contractStatus = "계약 신청(이용전)";
      } else if (orderDetail.contract.status === "pay") {
        contractStatus = "계약 완료(이용중)";
      } else if (orderDetail.contract.status === "refund") {
        contractStatus = "계약 해지(환불)";
      } else if (orderDetail.contract.status === "expired") {
        contractStatus = "계약 해지(만료)";
      } else if (orderDetail.contract.status === "terminate") {
        contractStatus = "계약 해지(중도)";
      } else if (orderDetail.contract.status === "canceled") {
        contractStatus = "계약 해지(취소)";
      }
      // 계약 정보
      contractForm.setFieldsValue({
        product_name: orderDetail.contract.rateplan.product.name,
        status: contractStatus,
        contract_id: orderDetail.contract.contract_id,
        start_date: orderDetail.contract.start_date,
        regdate: orderDetail.contract.regdate,
        next_paydate: orderDetail.contract.next_paydate,
        rateplan_name: orderDetail.contract.rateplan.name,
      });

      let productType = "";

      switch (orderDetail.contract.rateplan.product.type) {
        case "membership":
          productType = "멤버십";
          break;
        case "service":
          productType = "부가서비스";
          break;
        case "voucher":
          productType = "이용권";
          break;
        default:
          break;
      }

      let payDemand = "";

      switch (orderDetail.contract.rateplan.product.pay_demand) {
        case "pre":
          payDemand = "선불";
          break;
        case "deffered":
          payDemand = "후불";
          break;
        case "last":
          payDemand = "말일 결제";
          break;
        default:
          break;
      }

      // 청구 내용
      orderForm.setFieldsValue({
        product_type: productType,
        pay_demand: payDemand,
        next_paydate: orderDetail.contract.next_paydate,
        total: orderDetail.order.amount.toLocaleString("ko"),
      });
    }
  }, [orderDetail]);

  const handlePaymentCardChange = (value) => {
    setSelectedCard(value);
  };

  return (
    <>
      <Card
        title={`청구 상세`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Card title={`청구 번호 ${id}`}>
          <Form form={orderStatusForm}>
            <Form.Item name="status" label="청구 상태">
              <Radio.Group>
                <Radio style={radioStyle} value={"purchase"}>
                  완료
                </Radio>
                <Radio style={radioStyle} value={"unpaid"}>
                  미납
                </Radio>
                <Radio style={radioStyle} value={"will"}>
                  예정
                </Radio>
                <Radio style={radioStyle} value={"refund"}>
                  환불
                </Radio>
                <Radio style={radioStyle} value={"canceled"}>
                  취소
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        <Card title="그룹 정보">
          <Form form={groupForm} layout="vertical">
            <Form.Item name="classification" label="소속 그룹">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_id" label="그룹 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_name" label="그룹 명 (법인명)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="number" label="사업자 등록 번호">
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
          </Form>
        </Card>
        <Card title="회원 정보">
          <Form form={userForm} layout="vertical">
            <Form.Item name="uid" label="회원 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_name" label="멤버 이름">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_login" label="아이디">
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="핸드폰 번호">
              <Input disabled />
            </Form.Item>

            <Form.Item name="paymethod" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="계약 정보">
          <Form form={contractForm} layout="vertical">
            <Form.Item name="product_name" label="멤버십 상품">
              <Input disabled />
            </Form.Item>
            <Form.Item name="status" label="계약 상태">
              <Input disabled />
            </Form.Item>
            <Form.Item name="contract_id" label="계약 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="start_date" label="계약 시작일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="regdate" label="계약 신청일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="extend_count" label="연장 회차">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_paydate" label="정기 결제일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="rateplan_name" label="적용 요금제">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="청구 내용">
          <Form form={orderForm} layout="vertical">
            <Form.Item name="product_type" label="청구 유형">
              <Input disabled />
            </Form.Item>
            <Form.Item name="pay_method" label="결제 방식">
              <Input disabled />
            </Form.Item>
            <Form.Item name="pay_demand" label="결제 유형">
              <Input disabled />
            </Form.Item>
            <Form.Item name="contract_id" label="청구 기간">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_paydate" label="정기 결제일자">
              <Input disabled />
            </Form.Item>

            <Col></Col>
            <Card
              title={`청구 항목`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Table
                size="middle"
                columns={orderItmesColumns}
                rowKey={(record) => record.name}
                dataSource={orderItemList}
                // pagination={paymentPagination}
                // loading={paymentLoading}
                // onChange={handlePaymentTableChange}
              />
            </Card>
            <Form.Item name="total" label="총 금액">
              <Input disabled style={{ width: 260 }} />
            </Form.Item>
          </Form>
          <Select
            defaultValue={selectedCard}
            style={{ width: 160 }}
            onChange={handlePaymentCardChange}
          >
            {userCardList.map((card) => (
              <Select.Option key={card.customer_uid} value={card.customer_uid}>
                {card.name}
              </Select.Option>
            ))}
          </Select>
          <Button>결제</Button>
        </Card>
        <Card title="청구서">
          <Table
            size="middle"
            columns={orderColumns}
            rowKey={(record) => record.order.order_id}
            dataSource={orderList}
            pagination={orderPagination}
            loading={orderLoading}
            onChange={handleOrderTableChange}
          />
        </Card>

        <Col>
          <Card
            title={`결제 내역`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Table
              size="middle"
              columns={paymentColumns}
              rowKey={(record) => record.payment_id}
              dataSource={paymentList}
              pagination={paymentPagination}
              loading={paymentLoading}
              onChange={handlePaymentTableChange}
            />
          </Card>
        </Col>
      </Card>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(ContractDetail);
