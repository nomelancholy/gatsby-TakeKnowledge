import { Button, Form, Input, Row, Modal, Card, Radio, Table, Col } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const ContractDetail = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  const [orderList, setOrderList] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);
  // 답장이 있는지 없는지
  const [isDone, setIsDone] = useState(false);

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  // 청구서 테이블 컬럼 정의
  const billColumns = [
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
      dataIndex: "order",
      render: (text, record) => {
        const renderText = `${text.order_id} (${record.contract.contract_id})`;
        return renderText;
      },
    },
    {
      title: "결제 카드",
      dataIndex: "user",
      render: (text, record) => {
        console.log(`record`, record);
        return (
          <a href={`/order/${record.contract.contract_id}`}>
            {`${text.user_name}(${text.uid})`}
          </a>
        );
      },
    },
    {
      title: "결제 방식",
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
      title: "결제 유형",
      dataIndex: "group_id",
    },
    {
      title: "결제 금액",
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
      title: "결제 상태",
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
      title: "등록 일시",
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
    {
      title: "환불",
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
  ];

  // const [groupForm, userForm, memoForm, historyForm] = Form.useForm();
  //
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
  const [memoForm] = Form.useForm();
  const [historyForm] = Form.useForm();

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(2);

    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  useEffect(() => {
    // 청구/결제 상세 내용 조회
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
        { contract_id: id },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const data = response.data.items[0];
        console.log(`data`, data);
        setOrderList(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (orderList) {
      console.log(`orderList`, orderList);
      setIsDone(true);
      // 회원 정보
      userForm.setFieldsValue({
        // 회원 ID
        uid: orderList.user.uid,
        // 멤버 이름
        user_name: orderList.user.user_name,
        // 아이디
        // 핸드폰 번호
        // 대표 결제 카드
      });

      // 계약 상태 세팅
      let contractStatus = "";

      switch (orderList.contract.status) {
        case "wait":
          contractStatus = "구매 대기";
          break;
        case "buy":
          contractStatus = "구매";
          break;
        case "pay":
          contractStatus = "이용 시작";
          break;
        case "refund":
          contractStatus = "환불";
          break;
        case "expired":
          contractStatus = "종료";
          break;
        case "terminate":
          contractStatus = "해지";
          break;
        case "canceled":
          contractStatus = "취소";
          break;
        default:
          break;
      }

      // 계약 정보
      contractForm.setFieldsValue({
        // 멤버십 상품
        product_name: orderList.product.name,
        // 계약 상태
        status: contractStatus,
        // 계약 ID
        contract_id: orderList.contract.contract_id,
        // 계약 시작일
        start_date: orderList.contract.regdate,
        // 계약 신청일
        // 연장 회차
        // 정기 결제일
        next_paydate: orderList.contract.next_paydate,
        // 적용 요금제
      });

      // 청구 유형 세팅
      let contractType;

      switch (orderList.contract.contract_type) {
        case "membership":
          contractType = "멤버십";
          break;
        case "service":
          contractType = "부가서비스";
          break;
        case "voucher":
          contractType = "이용권";
          break;
        default:
          break;
      }

      let payDemand = "";

      switch (orderList.product.pay_demand) {
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
        // 청구 유형
        contract_type: contractType,
        // 결제 방식
        pay_method:
          orderList.pay_method.type === "personal"
            ? "개인 카드결제"
            : "법인 카드 결제",
        // 결제 유형
        pay_demand: payDemand,
        // 청구 기간
        // 정기 결제일자
        next_paydate: orderList.contract.next_paydate,
        // 청구 상태
        // 총 금액
        total: orderList.payment.total,
      });

      // form.setFieldsValue({
      //   // 노출 여부
      //   state: userDetail.state,
      //   // 카테고리 1
      //   classification: userDetail.classification,
      //   // 카테고리 2
      //   category: userDetail.category,
      //   // 작성자
      //   user_name: userDetail.user.user_name,
      //   // 제목
      //   title: userDetail.title,
      //   // 내용
      //   content: userDetail.content,
      // });
    } else {
      setIsDone(false);
    }
  }, [orderList]);

  // 저장 버튼 클릭
  const handleReplyRegisterSubmit = (values) => {
    let url = "";

    url = `${process.env.BACKEND_API}/user/qna-write`;

    let data = {
      title: values.title,
      classification: values.classification,
      category: values.category,
      content: values.reply,
      parent: Number(id),
      status: "publish",
    };

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
                <Radio style={radioStyle} value={"active"}>
                  완료
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  미납
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  예정
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  환불
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        <Card title="그룹 정보">
          <Form
            form={groupForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
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
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
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

            <Form.Item name="card" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="계약 정보">
          <Form
            form={contractForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
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
            <Form.Item name="request_date" label="계약 신청일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="extend_count" label="연장 회차">
              <Input disabled />
            </Form.Item>
            <Form.Item name="next_paydate" label="정기 결제일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="card" label="적용 요금제">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="청구 내용">
          <Form
            form={orderForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
            <Form.Item name="contract_type" label="청구 유형">
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
            <Form.Item name="status" label="청구 상태">
              <Radio.Group>
                <Radio style={radioStyle} value={"active"}>
                  청구 완료
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  청구 취소
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  청구 환불
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="total" label="총 금액">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="청구서">
          <Table
            size="middle"
            columns={billColumns}
            rowKey={(record) => record.order.order_id}
            dataSource={[]}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
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
              rowKey={(record) => record.order.order_id}
              dataSource={[]}
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
            />
          </Card>
        </Col>

        <Modal
          visible={okModalVisible}
          okText="확인"
          onOk={() => {
            router.push("/qna");
          }}
        >
          {"답변 등록 완료"}
        </Modal>
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