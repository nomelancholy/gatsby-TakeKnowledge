import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";

const User = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

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
      dataIndex: "-",
    },
    {
      title: "그룹명(그룹id)",
      dataIndex: "-",
    },
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
        return text === "active" ? "활성" : "휴면";
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [userList, setUserList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

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
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/list`,
        {
          page: 1,
          limit: 100,
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
        const data = response.data.items;
        setUserList(data);

        console.log(`data`, data);
        // setPagination({ ...pagination, total: data.total });
        // setProductList(data.items);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  return (
    <>
      <h3>회원 관리</h3>

      <Row type="flex" align="middle" className="py-3">
        {/* <Button type="primary">
          <SearchOutlined></SearchOutlined>검색
        </Button> */}
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
      {/* 필터 모달 */}
      <Filter
        visible={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onSearch={() => {
          console.log(`onOk`);
          //     () => {
          //   form
          //     .validateFields()
          //     .then((values) => {
          //       form.resetFields();
          //       onCreate(values);
          //     })
          //     .catch((info) => {
          //       console.log("Validate Failed:", info);
          //     });
          // }
        }}
      >
        <Form
          // form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="그룹 ID" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="그룹명" label="그룹명">
            <Input />
          </Form.Item>
          <Form.Item name="회원 상태" label="회원 상태">
            <Input />
          </Form.Item>
          <Form.Item name="활성/휴면 여부" label="활성/휴면 여부">
            <Input />
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
