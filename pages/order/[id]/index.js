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
import {
  billingColumns,
  orderItmesColumns,
  paymentColumns,
} from "@utils/columns/order";
import order from "..";

const OrderDetail = (props) => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const PAGE_SIZE = 5;

  // 청구 항목 아이템

  const [orderItemList, setOrderItemList] = useState([]);

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

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (orderDetail) {
      console.log(`orderDetail`, orderDetail);

      // 청구 상태
      orderStatusForm.setFieldsValue({
        status: orderDetail.order.status,
      });

      // 회원 정보
      userForm.setFieldsValue({
        uid: orderDetail.contract.user.uid,
        user_name: orderDetail.contract.user.user_name,
        user_login: orderDetail.contract.user.user_login,
        phone: orderDetail.contract.user.phone,
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
              <Radio.Group disabled>
                <Radio style={radioStyle} value={"purchased"}>
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

        <Card title="회원 정보">
          <Form form={userForm} layout="vertical">
            <Form.Item name="uid" label="회원 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_name" label="회원 이름">
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
            <Form.Item name="contract_id" label="계약 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="status" label="계약 상태">
              <Input disabled />
            </Form.Item>
            <Form.Item name="regdate" label="계약 신청일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="start_date" label="계약 시작일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_paydate" label="정기 결제일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="extend_count" label="연장 회차">
              <Input disabled />
            </Form.Item>
            <Form.Item name="product_name" label="멤버십 상품">
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
            <Form.Item name="pay_demand" label="결제 유형">
              <Input disabled />
            </Form.Item>
            <Form.Item name="contract_id" label="청구 기간">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_paydate" label="정기 결제일자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="pay_method" label="결제 방식">
              <Input disabled />
            </Form.Item>
            <Col></Col>
            <Card
              title={`청구 상태`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form.Item name="status" label="청구 상태">
                <Radio.Group disabled>
                  <Radio style={radioStyle} value={"purchased"}>
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
            </Card>
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
            <Card
              title={`총 금액`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form.Item name="total">
                <Input disabled style={{ width: 260 }} />
              </Form.Item>
            </Card>
          </Form>
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

export default connect((state) => state)(OrderDetail);
