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
  DatePicker,
  Select,
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const ServiceDetail = (props) => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const orderColumns = [
    {
      title: "청구 ID",
      dataIndex: "order",
      render: (text, record) => {
        return <a href={`/order/${record.order.order_id}`}>{text.order_id}</a>;
      },
    },
    {
      title: "구분",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        if (text.contract_type === "membership") {
          renderText = "멤버십";
        } else if (text.contract_type === "service") {
          renderText = "부가서비스";
        } else if (text.contract_type === "voucher") {
          renderText = "이용권";
        }

        return renderText;
      },
    },
    {
      title: "청구 항목",
      dataIndex: "product",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "청구 금액",
      dataIndex: "order",
      render: (text, record) => {
        return text.amount.toLocaleString("ko");
      },
    },
    {
      title: "청구일",
      dataIndex: "order",
      render: (text, record) => {
        return text.regdate;
      },
    },
    {
      title: "결제 상태",
      dataIndex: "payment",
      render: (text, record) => {
        let renderText = "";

        if (text.status == "wait") {
          renderText = "대기";
        } else if (text.status == "buy") {
          renderText = "결제";
        } else if (text.status == "unpaid") {
          renderText = "미납";
        } else if (text.status == "canceld") {
          renderText = "취소";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "order",
      render: (text, record) => {
        return text.regdate;
      },
    },
  ];

  const PAGE_SIZE = 5;

  const getOrderList = (params) => {
    setLoading(true);
    // 유저 계약 리스트 조회
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

        setPagination(pageInfo);

        setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);

    getOrderList({
      page: pagination.current,
      size: PAGE_SIZE,
      schedule_id: id,
    });
  };

  // 청구 결제 리스트 state
  const [orderList, setOrderList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { user, isLoggedIn, token } = props.auth;

  // 부가서비스 예약 상세
  const [serviceDetail, setServiceDetail] = useState(undefined);

  const [serviceStatusForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [contractForm] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  useEffect(() => {
    // 부가서비스 상세 정보 조회
    const config = {
      headers: {
        Authorization: decodeURIComponent(token),
      },
    };
    axios
      .get(
        `${process.env.BACKEND_API}/admin/contract/service/get/${id}`,
        config
      )
      .then(function (response) {
        const data = response.data.item;
        setServiceDetail(data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // 청구 결제 리스트 조회
    getOrderList({
      page: pagination.current,
      size: PAGE_SIZE,
      schedule_id: id,
    });
  }, []);

  useEffect(() => {
    if (serviceDetail) {
      serviceStatusForm.setFieldsValue({});
      groupForm.setFieldsValue({});

      let userRole = "";

      switch (serviceDetail.contract.user.user_role) {
        case "member":
          userRole = "멤버";
          break;
        case "ffadmin":
          userRole = "관리자";
          break;
        case "group":
          userRole = "그룹";
          break;
        case "user":
          userRole = "회원";
          break;
        default:
          break;
      }

      userForm.setFieldsValue({
        user_role: userRole,
        user_login: serviceDetail.contract.user.user_login,
        user_name: serviceDetail.contract.user.user_name,
        uid: serviceDetail.contract.user.uid,
        user_birthday:
          serviceDetail.contract.user.user_profile[0].user_birthday,
        job: serviceDetail.contract.user.user_profile[0].job,
        address: serviceDetail.contract.user.user_profile[0].address,
        paymethod: serviceDetail.contract.user.paymethod,
        fav_spot: serviceDetail.contract.user.fav_spot,
      });

      contractForm.setFieldsValue({
        contract_id: serviceDetail.contract.contract_id,
        extension: serviceDetail.contract.extension,
        product_name: serviceDetail.contract.rateplan.product.name,
        next_payday: serviceDetail.contract.next_payday,
        regdate: serviceDetail.contract.regdate,
        start_date: serviceDetail.contract.start_date,
        expired_date: serviceDetail.contract.expired_date,
        cancel_date: serviceDetail.contract.cancel_date,
        terminate_date: serviceDetail.contract.terminate_date,
      });

      let serviceType = "";

      switch (serviceDetail.schedlue.spot_map.space.type) {
        case "coworking":
          serviceType = "코워킹룸";
          break;
        case "meeting":
          serviceType = "미팅룸";
          break;
        case "lounge":
          serviceType = "라운지";
          break;
        case "locker":
          serviceType = "락커";
          break;
        default:
          break;
      }

      const startArray = serviceDetail.schedlue.start_time.split(" ");
      const endArray = serviceDetail.schedlue.end_time.split(" ");

      const startDate = startArray[0];
      const startTime = startArray[1];
      const endDate = endArray[0];
      const endTime = endArray[1];

      serviceForm.setFieldsValue({
        service_type: serviceType,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
      });
      paymentForm.setFieldsValue({
        amount: serviceDetail.payment.amount.toLocaleString("ko"),
        dc_price: serviceDetail.payment.dc_price.toLocaleString("ko"),
        coupon_price: serviceDetail.payment.coupon_price.toLocaleString("ko"),
        // guest_price: serviceDetail.payment.guest_price.toLocaleString("ko"),
        total: serviceDetail.payment.total.toLocaleString("ko"),
      });
    }
  }, [serviceDetail]);

  const [scheduleCancelMoalVisible, setScheduleCancelMoalVisible] =
    useState(false);

  return (
    <>
      <Card
        title={`부가서비스 예약 상세`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Card
          title={`예약 번호 ${id}`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form>
            <Form.Item name="status" label="예약 상태">
              <Radio.Group>
                <Radio style={radioStyle} value={"active"}>
                  예약
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  이용중
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  취소
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  만료
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`그룹 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={groupForm} layout="vertical">
            <Form.Item name="classification" label="소속 그룹">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_name" label="그룹 명 (법인명)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_id" label="그룹 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="address" label="사업자 주소">
              <Input disabled />
            </Form.Item>
            <Form.Item name="number" label="사업자 등록 번호">
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
        <Card
          title={`멤버 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={userForm} layout="vertical">
            <Form.Item name="user_role" label="회원 타입">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_login" label="아이디">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_name" label="멤버 이름">
              <Input disabled />
            </Form.Item>
            <Form.Item name="uid" label="회원 ID">
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
            <Form.Item name="address1" label="주소1">
              <Input disabled />
            </Form.Item>
            <Form.Item name="address2" label="주소2">
              <Input disabled />
            </Form.Item>
            <Form.Item name="paymethod" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
            <Form.Item name="fav_spot" label="선호 지점">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`계약 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={contractForm} layout="vertical">
            <Form.Item name="contract_id" label="계약 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="extension" label="연장 회차">
              <Input disabled />
            </Form.Item>
            <Form.Item name="product_name" label="멤버십 상품">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_payday" label="정기 결제일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="regdate" label="신청 일자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="start_date" label="시작 일자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="expired_date" label="만료 일자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="cancel_date" label="취소 일자">
              <Input disabled />
            </Form.Item>
            <Form.Item name="terminate_date" label="해지 일자">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`부가서비스 예약 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={serviceForm} layout="vertical">
            <Form.Item name="service_type" label="부가서비스">
              <Input disabled />
            </Form.Item>
            <Form.Item name="start_date" label="시작일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="end_date" label="종료일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="start_time" label="시작 시간">
              <Input disabled />
            </Form.Item>
            <Form.Item name="end_time" label="종료 시간">
              <Input disabled />
            </Form.Item>
            <Form.Item name="using_time" label="사용 시간">
              <Input disabled />
            </Form.Item>
            <Form.Item name="expired_date" label="게스트 초대">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`부가서비스 이용 요금 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Form form={paymentForm} layout="vertical">
            <Form.Item name="amount" label="부가서비스 요금 (A)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="dc_price" label="할인액 (B)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="coupon_price" label="적용 쿠폰 (C)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="guest_price" label="게스트 초대 금액 (D)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="total" label="총 결제 금액 (A) + (B) + (C) + (D)">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`청구/결제 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Table
            size="middle"
            columns={orderColumns}
            rowKey={(record) => record.order.order_id}
            dataSource={orderList}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Card>
        <Button
          onClick={() => {
            setScheduleCancelMoalVisible(true);
          }}
        >
          예약 취소/해지
        </Button>
      </Card>
      <Modal
        width={1000}
        visible={scheduleCancelMoalVisible}
        okText="예약 취소"
        cancelText="취소"
        onOk={() => {
          // router.push("/payment");
        }}
        onCancel={() => {
          setScheduleCancelMoalVisible(false);
        }}
      >
        <Card title={"부가서비스 취소"} style={{ width: 800 }}>
          <Card title={"부가서비스 신청 정보"}>
            {/* <Table
              size="middle"
              columns={orderColumns}
              rowKey={(record) => record.order.order_id}
              dataSource={orderList}
              pagination={orderPagination}
              loading={orderLoading}
              onChange={handleOrderTableChange}
            /> */}
          </Card>
          <Card title={"부가서비스 이용 요금 정보"}>
            <Form>
              <Form.Item>
                <Input></Input>
              </Form.Item>
              <Form.Item label="계약 신청일">
                <Input></Input>
              </Form.Item>
              <Form.Item label="계약 시작일">
                <Input></Input>
              </Form.Item>
              <Form.Item label="청구 일">
                <Input></Input>
              </Form.Item>
              <Form.Item label="계약 해지일">
                <DatePicker></DatePicker>
              </Form.Item>
            </Form>
          </Card>
          <Card title={"부가서비스 일할 계산 (* 환불 액 계산 식)"}>
            <Form>
              <Form.Item name="order_item" label="청구 시작일">
                <Select>
                  <Select.Option value="membership">멤버십</Select.Option>
                  <Select.Option value="coworking">코워킹룸</Select.Option>
                  <Select.Option value="locker">스마트 락커</Select.Option>
                  <Select.Option value="penalty">패널티</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="order_date" label="청구 종료일">
                <DatePicker></DatePicker>
              </Form.Item>
              <Form.Item namme="memo" label="계약 해지일 (=계약 해지 예정일)">
                <Input.TextArea></Input.TextArea>
              </Form.Item>
              <Form.Item namme="total" label="월 이용 요금(A)">
                <Input disabled />
              </Form.Item>
              <Form.Item
                namme="total"
                label="사용 일수(청구 시작일 ~ 계약 해지일)"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                namme="total"
                label="일할 이용 요금 (B) * (월 이용료/(청구 종료일 - 해지일)) * 사용일수"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                namme="total"
                label="해지 위약금(C) * (월 이용료 * 0.1)"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item namme="total" label="환불 금액 (A-B-C)">
                <Input disabled />
              </Form.Item>
            </Form>
          </Card>
          <Card>
            <Form>
              <Form.Item name="status" label="계약 상태">
                <Radio.Group>
                  <Radio style={radioStyle} value={"active"}>
                    월 정기 해지
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    청약 철회 해지
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    전체 환불
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    일할 계산
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        </Card>
      </Modal>

      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(ServiceDetail);
