import { Button, Form, Input, Row, Modal, Card, Radio, Table, Col } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";

const UserDetail = (props) => {
  // 상품 이용 내역 grid 정의
  const userContractColumns = [
    {
      title: "계약 ID",
      dataIndex: "contract_id",
    },
    {
      title: "계약 상태",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        if (text === "wait") {
          renderText = "계약 신청(입금전)";
        } else if (text === "buy") {
          renderText = "계약 신청(이용전)";
        } else if (text === "pay") {
          renderText = "계약 완료(이용중)";
        } else if (text === "refund") {
          renderText = "계약 해지(환불)";
        } else if (text === "expired") {
          renderText = "계약 해지(만료)";
        } else if (text === "terminate") {
          renderText = "계약 해지(중도)";
        } else if (text === "canceled") {
          renderText = "계약 해지(취소)";
        }

        return renderText;
      },
    },
    {
      title: "멤버십 상품",
      dataIndex: "rateplan",
      render: (text, record) => {
        return text.product.name;
      },
    },
    {
      title: "결제 방식",
      dataIndex: "name",
      render: (text, record) => {
        // return <a href={`/payment/${record.rateplan_id}`}>{text}</a>;
      },
    },
    {
      title: "결제 유형",
      dataIndex: "rateplan",
      render: (text, record) => {
        let renderText = "";

        if (text.product.pay_demand == "pre") {
          renderText = "선불";
        } else if (text.product.pay_demand == "deffered") {
          renderText = "후불";
        } else if (text.product.pay_demand == "last") {
          renderText = "말일 결제";
        }

        return renderText;
      },
    },
    {
      title: "시작일",
      dataIndex: "start_date",
    },
    {
      title: "정기 결제일",
      dataIndex: "next_paydate",
    },
    {
      title: "취소일",
      dataIndex: "cancel_date",
    },
    {
      title: "해지일",
      dataIndex: "teminate_date",
    },
    {
      title: "만료일",
      dataIndex: "expired_date",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  // 청구 grid 정의
  const orderColumns = [
    {
      title: "청구 ID",
      dataIndex: "order",
      render: (text, record) => {
        return text.order_id;
      },
    },
    {
      title: "계약 ID",
      dataIndex: "contract",
      render: (text, record) => {
        return text.contract_id;
      },
    },
    {
      title: "계약 상태",
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
      title: "멤버십 상품",
      dataIndex: "product",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "결제 방식",
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
      title: "결제 유형",
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
      title: "결제 일자",
      dataIndex: "contract",
      render: (text, record) => {
        return text.regdate;
      },
    },
    {
      title: "청구 금액",
      dataIndex: "order",
      render: (text, record) => {
        return text.amount.toLocaleString("ko-KR");
      },
    },
    {
      title: "결제 금액",
      dataIndex: "payment",
      render: (text, record) => {
        return text.total.toLocaleString("ko-KR");
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

  // 유저 상품 이용 내역 테이블 페이지, 로딩
  const [userContractPagination, setUserContractPagination] = useState({});
  const [userContractLoading, setUserContractLoading] = useState(false);

  // 유저 청구 내역 테이블 페이징, 로딩
  const [userOrderPagination, setUserOrderPagination] = useState({});
  const [userOrderLoading, setUserOrderLoading] = useState(false);

  // 유저 계약 리스트 조회
  const getUserContractList = (params) => {
    setUserContractLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/list`,
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
        setUserContractList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setUserContractPagination(pageInfo);

        setUserContractLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 유저 청구 내역 조회
  const getUserOrderList = (params) => {
    setUserOrderLoading(true);

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
        setUserOrderList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setUserOrderPagination(pageInfo);

        // 로딩바 세팅
        setUserOrderLoading(false);

        // setParams(params);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 상품 이용 내역 테이블 변경
  const handleUserContractTableChange = (pagination) => {
    setUserContractPagination(pagination);

    // 호출
    getUserContractList({ page: pagination.current, size: PAGE_SIZE, uid: id });
  };

  // 청구 내역 테이블 변경
  const handleUserOrderTableChange = (pagination) => {
    setUserOrderPagination(pagination);

    // 호출
    getUserOrderList({ page: pagination.current, size: PAGE_SIZE, uid: id });
  };

  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  // 유저 정보 state
  const [userDetail, setUserDetail] = useState(undefined);
  // 유저 계약 리스트 state
  const [userContractList, setUserContractList] = useState([]);
  // 유저 청구 리스트 state
  const [userOrderList, setUserOrderList] = useState([]);

  // 회원 상태
  const [userStatusForm] = Form.useForm();
  // 그룹 정보
  const [groupForm] = Form.useForm();
  // 회원 정보
  const [userForm] = Form.useForm();
  // 상담 메모
  const [counselingForm] = Form.useForm();
  // 회원 메모
  const [memoForm] = Form.useForm();

  useEffect(() => {
    // 유저 상세 정보 조회
    const config = {
      headers: {
        Authorization: decodeURIComponent(token),
      },
    };
    axios
      .get(`${process.env.BACKEND_API}/admin/user/get/${id}`, config)
      .then(function (response) {
        const userDetail = response.data.item;
        setUserDetail(userDetail);
      })
      .catch(function (error) {
        console.log(error);
      });

    // 유저 계약 내역 조회
    getUserContractList({ page: 1, size: PAGE_SIZE, uid: id });
    // 유저 청구 내역 조회
    getUserOrderList({ page: 1, size: PAGE_SIZE, uid: id });
  }, []);

  useEffect(() => {
    // 유저 정보 세팅되면
    if (userDetail) {
      console.log(`userDetail`, userDetail);
      let userRole = "";

      if (userDetail.user_status === "inactive") {
        userRole = userDetail.user_status;
      } else {
        userRole = userDetail.user_role;
      }

      // 회원 상태
      userStatusForm.setFieldsValue({
        // 회원 타입
        user_role: userRole,
      });

      // 그룹 정보
      if (userDetail.user_role !== "group") {
        groupForm.setFieldsValue({
          group: "개인",
        });
      } else {
        // 그룹 정보 세팅
      }

      // 회원 정보
      userForm.setFieldsValue({
        // 회원 ID
        uid: userDetail.uid,

        // 카테고리 2
        user_name: userDetail.user_name,
        // 작성자
        user_login: userDetail.user_login,
        // 제목
        phone: userDetail.phone,
        // 생년 월일
        user_birthday: userDetail.user_profile[0].user_birthday,
        // 주소지
        address: userDetail.user_profile[0].address,
        // 주소 1
        address1: "",
        // 주소 2
        address2: "",
        // 대표 결제 카드
        card: "",
        // 선호 지점
        favorite_spot: "",
      });
    }

    // 상담 메모

    // 회원 메모
  }, [userDetail]);

  return (
    <>
      <Card
        title={`회원 상세 페이지 | 회원 ID ${id}`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Card>
          <Form form={userStatusForm}>
            <Form.Item name="user_role" label="회원 상태">
              <Radio.Group disabled>
                <Radio style={radioStyle} value={"ffadmin"}>
                  관리자
                </Radio>
                <Radio style={radioStyle} value={"member"}>
                  멤버
                </Radio>
                <Radio style={radioStyle} value={"user"}>
                  회원
                </Radio>
                {/* <Radio style={radioStyle} value={"group"}>
                  그룹
                </Radio> */}
                <Radio style={radioStyle} value={"inactive"}>
                  탈퇴 회원
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  휴면 회원
                </Radio>
                {/* <Radio style={radioStyle} value={"inactive"}>
                  그룹 멤버
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  그룹 관리자 회원
                </Radio>
                <Radio style={radioStyle} value={"inactive"}>
                  그룹 관리자 멤버
                </Radio> */}
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        <Card title="그룹 정보">
          <Form form={groupForm} layout="vertical">
            <Form.Item name="group" label="소속 그룹">
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
            <Form.Item name="certification" label="사업자 등록증">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="회원 정보">
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
            <Form.Item name="user_birthday" label="생년 월일">
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
            <Form.Item name="card" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
            <Form.Item name="favorite_spot" label="선호 지점">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card title="상품 이용 내역">
          <Table
            size="middle"
            columns={userContractColumns}
            rowKey={(record) => record.contract_id}
            dataSource={userContractList}
            pagination={userContractPagination}
            loading={userContractLoading}
            onChange={handleUserContractTableChange}
          />
        </Card>
        <Card title="청구 내역">
          <Table
            size="middle"
            columns={orderColumns}
            rowKey={(record) => record.order_id}
            dataSource={userOrderList}
            pagination={userOrderPagination}
            loading={userOrderLoading}
            onChange={handleUserOrderTableChange}
          />
        </Card>

        <Col>
          <Card
            title={`상담 메모`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form form={counselingForm} layout="vertical">
              <Form.Item name="title">
                <Input disabled />
              </Form.Item>
              <Form.Item name="content">
                <Input.TextArea disabled />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col>
          <Card
            title={`회원 메모`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form form={memoForm} layout="vertical">
              <Form.Item name="memo">
                <Input disabled />
              </Form.Item>
            </Form>
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

export default connect((state) => state)(UserDetail);
