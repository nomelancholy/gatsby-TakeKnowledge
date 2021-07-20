import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import {
  SlidersOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";

const Notice = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    // const data = JSON.stringify({
    //   page: 1,
    //   limit: 20,
    // });

    const data = {
      page: 1,
      limit: 20,
    };

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/services/notices`,
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjgsInVzZXJfbG9naW4iOiJhbGxzcG90QGRtYWluLmlvIiwidXNlcl9uYW1lIjoiXHVjNjJjXHVjMmE0XHVkMzFmXHVkMTRjXHVjMmE0XHVkMmI4IiwidXNlcl9yb2xlIjoibWVtYmVyIiwicGhvbmUiOiIwMTAtODg5NS0zOTc2IiwibWFya2V0aW5nX2FncmVlIjowLCJncm91cF9pZCI6bnVsbCwiZXhwIjoxNjU4MjEwNzE2fQ.A-O77eynxpVbUsaSnqUg1mDvyzFmq8rbZIeKl5rWuHw",
        "Content-Type": "application/json",
      },
      params: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  const columns = [
    {
      title: "공지 ID",
      dataIndex: "notice_id",
    },
    {
      title: "공지 제목",
      dataIndex: "title",
    },
    {
      title: "공지 유형",
      dataIndex: "type",
    },
    {
      title: "상단 노출",
      dataIndex: "sticky",
    },
    {
      title: "등록자",
      dataIndex: "email",
    },
    {
      title: "사용 여부",
      dataIndex: "status",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [form] = Form.useForm();

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

  const fetch = (params = {}) => {
    setLoading(true);
    axios
      .get(
        "https://randomuser.me/api",
        {
          results: 10,
          ...params,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log(`response`, response);
        const data = response.data;
        console.log(`data`, data);
        // Read total count from server
        // pagination.total = data.totalCount;
        setPagination({ ...pagination, total: 200 });
        setLoading(false);
        setData(data.results);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  return (
    <>
      <h3>알림(공지) 관리</h3>

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
        <Button
          type="primary"
          onClick={() => {
            Router.push("/notice/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={data}
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

export default connect((state) => state)(Notice);
