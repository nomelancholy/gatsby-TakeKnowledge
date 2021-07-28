import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";

const User = (props) => {
  // grid 컬럼 정의
  const columns = [
    {
      title: "회원 ID",
      dataIndex: "uid",
    },
    {
      title: "계약자명",
      dataIndex: "user_name",
      render: (text, record) => {
        return <a href={`/user/${record.uid}`}>{text}</a>;
      },
    },
    {
      title: "회원 구분",
      dataIndex: "user_role",
      render: (text, record) => {
        let renderText = "";
        if (text === "ffadmin") {
          renderText = "관리자";
        } else if (text === "member") {
          renderText = "멤버";
        } else if (text === "group") {
          renderText = "그룹";
        } else if (text === "user") {
          renderText = "회원";
        }

        return renderText;
      },
    },
    {
      title: "계약자 타입",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        if (text === null) {
          renderText = "계약 없음";
        } else if (text.status === "wait") {
          renderText = "구매 대기";
        } else if (text.status === "buy") {
          renderText = "구매";
        } else if (text.status === "pay") {
          renderText = "계약중";
        } else if (text.status === "refund") {
          renderText = "환불";
        } else if (text.status === "expired") {
          renderText = "종료";
        } else if (text.status === "terminate") {
          renderText = "해지";
        } else if (text.status === "canceled") {
          renderText = "취소";
        }

        return renderText;
      },
    },
    // {
    //   title: "그룹명(그룹id)",
    //   dataIndex: "-",
    // },
    {
      title: "카드 등록 여부",
      dataIndex: "registed_card",
      render: (text, record) => {
        return text ? "등록" : "미등록";
      },
    },
    {
      title: "활성/휴면 여부",
      dataIndex: "user_status",
      render: (text, record) => {
        let renderText = "";

        switch (text) {
          case "active":
            renderText = "활성";
            break;
          case "inactive":
            renderText = "비활성";
            break;
          case "sleep":
            renderText = "휴면";
            break;
          case "leave":
            renderText = "탈퇴";
            break;
          default:
            break;
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const { user, isLoggedIn, token } = props.auth;

  const [userList, setUserList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    uid: undefined,
    user_name: undefined,
    user_role: undefined,
    contract_status: undefined,
    has_card: undefined,
    status: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getUserList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/list`,
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
        setUserList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setPagination(pageInfo);

        // 로딩바 세팅
        setLoading(false);

        setParams(params);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }

    getUserList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getUserList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      uid: searchFormValues.uid,
      user_name: searchFormValues.user_name,
      user_role: searchFormValues.user_role,
      contract_status: searchFormValues.contract_status,
      has_card: searchFormValues.has_card,
      status: searchFormValues.status,
      page: 1,
    };

    getUserList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      uid: undefined,
      user_name: undefined,
      user_role: undefined,
      contract_status: undefined,
      has_card: undefined,
      status: undefined,
      page: 1,
    };

    getUserList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>회원 관리</h3>

      <Row type="flex" align="middle" className="py-3">
        <Button
          type="primary"
          onClick={() => {
            setFilterModalOpen(true);
          }}
        >
          <SlidersOutlined />
          <span>필터</span>
        </Button>
        <span className="px-2 w-10"></span>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.uid}
        dataSource={userList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 */}
      <Filter
        visible={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onReset={handleReset}
        onSearch={handleSearch}
      >
        <Form
          form={searchForm}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        >
          <Form.Item name="uid" label="멤버 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_name" label="계약자명">
            <Input />
          </Form.Item>
          <Form.Item name="user_role" label="회원 구분">
            <Select style={{ width: 160 }}>
              <Select.Option value="ffadmin">관리자</Select.Option>
              <Select.Option value="member">멤버</Select.Option>
              <Select.Option value="group">그룹</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contract_status" label="계약자 타입">
            <Select style={{ width: 160 }}>
              <Select.Option value="">계약 없음</Select.Option>
              <Select.Option value="wait">구매 대기</Select.Option>
              <Select.Option value="buy">구매</Select.Option>
              <Select.Option value="pay">계약중</Select.Option>
              <Select.Option value="refund">환불</Select.Option>
              <Select.Option value="expired">종료</Select.Option>
              <Select.Option value="terminate">해지</Select.Option>
              <Select.Option value="canceled">취소</Select.Option>
            </Select>
          </Form.Item>
          {/* <Form.Item name="group_id" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="group_name" label="그룹명">
            <Select style={{ width: 160 }}>
            </Select>
          </Form.Item> */}
          <Form.Item name="has_card" label="카드 등록 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value={true}>등록</Select.Option>
              <Select.Option value={false}>미등록</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="활성/휴면 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value="active">활성</Select.Option>
              <Select.Option value="inactive">비활성</Select.Option>
              <Select.Option value="sleep">휴면</Select.Option>
              <Select.Option value="leave">탈퇴</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Filter>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(User);
