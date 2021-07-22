import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";

const ContractDetail = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  const columns = [
    {
      title: "계약 ID",
      dataIndex: "name",
    },
    {
      title: "계약자명",
      dataIndex: "gender",
    },
    {
      title: "계약 상태",
      dataIndex: "email",
    },
    {
      title: "그룹",
      dataIndex: "email",
    },
    {
      title: "상품",
      dataIndex: "email",
    },
    {
      title: "선호 지점",
      dataIndex: "email",
    },
    {
      title: "시작일",
      dataIndex: "email",
    },
    {
      title: "종료일",
      dataIndex: "email",
    },
    {
      title: "취소일",
      dataIndex: "email",
    },
    {
      title: "해지일",
      dataIndex: "email",
    },
    {
      title: "생성 일시",
      dataIndex: "email",
    },
  ];

  const [data, setData] = useState([]);
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
      <h3>계약</h3>

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
        onSearch={
          () => {
            console.log(`onOk`);
          }
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
        }
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

export default connect((state) => state)(ContractDetail);
