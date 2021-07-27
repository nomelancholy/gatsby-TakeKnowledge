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

  // 유저 정보 state
  const [userDetail, setUserDetail] = useState(undefined);

  // 유저 계약 리스트 state
  const [userContractList, setUserContractList] = useState([]);

  const [okModalVisible, setOkModalVisible] = useState(false);
  // 답장이 있는지 없는지
  const [isDone, setIsDone] = useState(false);

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const [groupForm, userForm, memoForm, historyForm] = Form.useForm();

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

  const contractColumns = [
    {
      title: "계약 ID",
      dataIndex: "contract_id",
    },
    {
      title: "계약 상태",
      dataIndex: "product",
      render: (text, record) => {
        let renderText = "";

        // if (text.type === "membership") {
        //   renderText = "멤버십";
        // } else if (text.type === "service") {
        //   renderText = "부가서비스";
        // } else if (text.type === "voucher") {
        //   renderText = "이용권";
        // }

        return renderText;
      },
    },
    {
      title: "멤버십 상품",
      dataIndex: "product",
      render: (text, record) => {
        // return text.name;
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
      dataIndex: "price",
      render: (text, record) => {
        // return text.toLocaleString("ko-KR");
      },
    },
    {
      title: "시작일",
      dataIndex: "dc_price",
      render: (text, record) => {
        // return text.toLocaleString("ko-KR");
      },
    },
    {
      title: "정기 결제일",
      dataIndex: "start_date",
    },
    {
      title: "취소일",
      dataIndex: "end_date",
    },
    {
      title: "해지일",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";
        if (text === "active") {
          renderText = "노출";
        } else if (text === "inactive") {
          renderText = "미노출";
        }

        return renderText;
      },
    },
    {
      title: "만료일",
      dataIndex: "regdate",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const orderColumns = [
    {
      title: "요금제 ID",
      dataIndex: "rateplan_id",
    },
    {
      title: "상품 그룹",
      dataIndex: "product",
      render: (text, record) => {
        let renderText = "";

        if (text.type === "membership") {
          renderText = "멤버십";
        } else if (text.type === "service") {
          renderText = "부가서비스";
        } else if (text.type === "voucher") {
          renderText = "이용권";
        }

        return renderText;
      },
    },
    {
      title: "상품 명",
      dataIndex: "product",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "요금제 이름",
      dataIndex: "name",
      render: (text, record) => {
        return <a href={`/payment/${record.rateplan_id}`}>{text}</a>;
      },
    },
    {
      title: "이용 요금",
      dataIndex: "price",
      render: (text, record) => {
        return text.toLocaleString("ko-KR");
      },
    },
    {
      title: "기본 할인 요금",
      dataIndex: "dc_price",
      render: (text, record) => {
        return text.toLocaleString("ko-KR");
      },
    },
    {
      title: "시작일",
      dataIndex: "start_date",
    },
    {
      title: "종료일",
      dataIndex: "end_date",
    },
    {
      title: "노출 여부",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";
        if (text === "active") {
          renderText = "노출";
        } else if (text === "inactive") {
          renderText = "미노출";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

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
        console.log(`userDetail`, userDetail);
        setUserDetail(userDetail);
      })
      .catch(function (error) {
        console.log(error);
      });
    // 유저 계약 리스트 조회
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/list`,
        { page: 1, size: 100, uid: id },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const data = response.data.items;
        console.log(`data`, data);
        setUserContractList(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    // if (userDetail) {
    //   setIsDone(true);
    //   form.setFieldsValue({
    //     // 노출 여부
    //     state: userDetail.state,
    //     // 카테고리 1
    //     classification: userDetail.classification,
    //     // 카테고리 2
    //     category: userDetail.category,
    //     // 작성자
    //     user_name: userDetail.user.user_name,
    //     // 제목
    //     title: userDetail.title,
    //     // 내용
    //     content: userDetail.content,
    //   });
    //   if (userDetail.reply) {
    //     form.setFieldsValue({
    //       // 답장
    //       reply: userDetail.reply.content,
    //       // 담당자
    //       reply_user: userDetail.reply.user.user_name,
    //     });
    //   }
    // } else {
    //   setIsDone(false);
    // }
  }, [userDetail]);

  // 저장 버튼 클릭
  const handleReplyRegisterSubmit = (values) => {
    let url = "";

    url = `${process.env.BACKEND_API}/user/qna/write`;

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
          <Form
            form={groupForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
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
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleReplyRegisterSubmit}
          >
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
            <Form.Item name="card" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
            <Form.Item name="favorite_spot" label="선호 지점">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card
          title={`계약 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        ></Card>
        <Card
          title={`부가서비스 예약 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        ></Card>
        <Card
          title={`부가서비스 이용 요금 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        ></Card>
        <Card
          title={`청구/결제 정보`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          <Table
            size="middle"
            columns={contractColumns}
            rowKey={(record) => record.contract_id}
            dataSource={userContractList}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Card>
        <Table
          size="middle"
          columns={orderColumns}
          rowKey={(record) => record.rateplan_id}
          dataSource={[]}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
        <Col>
          <Card
            title={`상담 메모`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={historyForm}
              layout="vertical"
              onFinish={handleReplyRegisterSubmit}
            >
              <Form.Item name="classification">
                <Input disabled />
              </Form.Item>
              <Form.Item name="group_id">
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
            <Form
              form={memoForm}
              layout="vertical"
              onFinish={handleReplyRegisterSubmit}
            >
              <Form.Item name="classification">
                <Input disabled />
              </Form.Item>
            </Form>
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
