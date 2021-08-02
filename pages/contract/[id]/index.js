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
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { contractOrderColumns } from "@utils/columns/order";
import { contractServiceColumns } from "@utils/columns/service";
import { contractVoucherColumns } from "@utils/columns/product";

const ContractDetail = (props) => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

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

  // 부가 서비스 이용 정보

  const PAGE_SIZE = 5;

  const [orderPagination, setOrderPagination] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const handleOrderTableChange = (pagination) => {
    setOrderPagination(pagination);
  };

  const [voucherPagination, setVoucherPagination] = useState({});
  const [voucherLoading, setVoucherLoading] = useState(false);
  const handleVoucherTableChange = (pagination) => {
    setVoucherPagination(pagination);
  };

  const [servicePagination, setServicePagination] = useState({});
  const [serviceLoading, setServiceLoading] = useState(false);
  const handleServiceTableChange = (pagination) => {
    setServicePagination(pagination);
  };

  const [orderList, setOrderList] = useState([]);
  const [voucherList, setVoucherList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

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

  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  const [contractDetail, setContractDetail] = useState(undefined);

  // 계약 상태
  const [contractStatusForm] = Form.useForm();
  // 그룹 정보
  const [groupForm] = Form.useForm();
  // 회원 정보
  const [userForm] = Form.useForm();
  // 계약 정보
  const [contractForm] = Form.useForm();
  // 청구 내용
  const [chargeForm] = Form.useForm();
  // 청구 하기
  const [orderRequestForm] = Form.useForm();
  // 상품 정보
  const [productForm] = Form.useForm();
  // 상담 메모
  const [memoForm] = Form.useForm();
  // 상담 메모 히스토리
  const [historyForm] = Form.useForm();

  const [memoHistoryTotal, setMemoHistoryTotal] = useState(1);
  const [memoHistoryList, setMemoHistoryList] = useState([]);

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
      contractStatusForm.setFieldsValue({});
      groupForm.setFieldsValue({});

      let userRole = "";

      switch (contractDetail.user.user_role) {
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
        uid: contractDetail.user.uid,
        user_role: userRole,
        user_name: contractDetail.user.user_name,
        user_login: contractDetail.user.user_login,
        phone: contractDetail.user.phone,
        birthday: contractDetail.user.user_profile[0].user_birthday,
        job: contractDetail.user.user_profile[0].job,
        address: contractDetail.user.user_profile[0].address,
        address_etc: contractDetail.user.user_profile[0].address_etc,
        paymethod: contractDetail.user.paymethod,
        fav_spot: contractDetail.user.fav_spot,
      });
      contractForm.setFieldsValue({
        contract_id: contractDetail.contract_id,
        product_name: contractDetail.rateplan.product.name,
        extension: contractDetail.extension,
        next_payday: contractDetail.next_payday,
        regdate: contractDetail.regdate,
        start_date: contractDetail.start_date,
        end_date: contractDetail.end_date,
        cancel_date: contractDetail.cancel_date,
        terminate_date: contractDetail.terminate_date,
      });
      chargeForm.setFieldsValue({
        rateplan_name: contractDetail.rateplan.name,
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

      productForm.setFieldsValue({
        product_id: contractDetail.rateplan.product.product_id,
        name: contractDetail.rateplan.product.name,
        product_type: productType,
        service_type: serviceType,
        paymethod: "",
        working_days: workingDays,
        start_time: contractDetail.rateplan.product.start_time,
        end_time: contractDetail.rateplan.product.end_time,
        spaces: contractDetail.rateplan.product.spaces.join(", "),
      });
      memoForm.setFieldsValue({});
      historyForm.setFieldsValue({});
    }
  }, [contractDetail]);

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const [contractCancelModalVisible, setContractCancelModalVisible] =
    useState(false);

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

  const [memoMinPage, setMemoMinPage] = useState(0);
  const [memoMaxPage, setMemoMaxPage] = useState(1);

  const handleHistoryChange = (value) => {
    setMemoMinPage(value - 1);
    setMemoMaxPage(value);
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="계약 상세" key="1">
          <Card>
            <Card
              title={`계약 ID ${id}`}
              extra={<a onClick={() => router.back()}>뒤로 가기</a>}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={contractStatusForm}>
                <Form.Item name="status" label="계약 상태">
                  <Radio.Group>
                    <Radio style={radioStyle} value={"active"}>
                      계약 신청
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      계약 취소
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      계약 완료(이용중)
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      계약 해지(만료)
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      계약 해지(해지)
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Card>
            <Card
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
                <Form.Item name="number" label="사업자 등록증">
                  <Input disabled />
                </Form.Item>
              </Form>
            </Card>
            <Card
              title="회원 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={userForm} layout="vertical">
                <Form.Item name="uid" label="회원 ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="user_role" label="회원 타입">
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
                <Form.Item name="birthday" label="생년월일">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="job" label="직무">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="address" label="주소">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="address_etc" label="상세주소">
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
              title="계약 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={contractForm} layout="vertical">
                <Form.Item name="contract_id" label="계약 ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="product_name" label="멤버십 상품">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="extension" label="연장 회차">
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
                <Form.Item name="end_date" label="종료 일자">
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
              title="요금 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={chargeForm} layout="vertical">
                <Form.Item name="rateplan_name" label="적용 요금제">
                  <Input disabled />
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
              title="상품 정보"
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Form form={productForm} layout="vertical">
                <Form.Item name="product_id" label="상품 ID">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="name" label="상품 명">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="product_type" label="상품 구분">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="service_type" label="유형">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="paymethod" label="결제 유형">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="working_days" label="요일">
                  <Checkbox.Group options={workingDaysOptions} />
                </Form.Item>
                <Form.Item name="start_time" label="시작 시간">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="end_time" label="종료 시간">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="spaces" label="공간 정보">
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
            {/* 
            <Card
              title={`이용권 정보`}
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

            <Card
              title={`부가 서비스 이용 정보`}
              bodyStyle={{ padding: "1rem" }}
              className="mb-4"
            >
              <Table
                size="middle"
                columns={contractServiceColumns}
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

            <Modal
              width={1000}
              visible={contractCancelModalVisible}
              okText="해지 완료"
              cancelText="취소"
              onOk={() => {
                // router.push("/payment");
              }}
              onCancel={() => {
                setContractCancelModalVisible(false);
              }}
            >
              <Card title={"계약 취소/해지"} style={{ width: 800 }}>
                <Card title={"월 정기 납부 내역"}>
                  <Table
                    size="middle"
                    columns={contractOrderColumns}
                    rowKey={(record) => record.order.order_id}
                    dataSource={orderList}
                    pagination={orderPagination}
                    loading={orderLoading}
                    onChange={handleOrderTableChange}
                  />
                </Card>
                <Card title={"해지 유형"}>
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
                <Card title={"월 이용 요금 일할 계산 & 위약금"}>
                  <Form form={orderRequestForm}>
                    <Form.Item name="order_item" label="청구 시작일">
                      <Select>
                        <Select.Option value="membership">멤버십</Select.Option>
                        <Select.Option value="coworking">
                          코워킹룸
                        </Select.Option>
                        <Select.Option value="locker">
                          스마트 락커
                        </Select.Option>
                        <Select.Option value="penalty">패널티</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="order_date" label="청구 종료일">
                      <DatePicker></DatePicker>
                    </Form.Item>
                    <Form.Item
                      namme="memo"
                      label="계약 해지일 (=계약 해지 예정일)"
                    >
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
                  <Form form={contractStatusForm}>
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
