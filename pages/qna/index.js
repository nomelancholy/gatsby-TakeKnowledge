import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

const Qna = () => {
  const columns = [
    {
      title: "문의 ID",
      dataIndex: "name",
      // sorter: true,
      // render: (name) => `${name.first} ${name.last}`,
      width: "20%",
    },
    {
      title: "문의 유형",
      dataIndex: "gender",
      // filters: [
      //   { text: "Male", value: "male" },
      //   { text: "Female", value: "female" },
      // ],
      width: "20%",
    },
    {
      title: "제목",
      dataIndex: "email",
    },
    {
      title: "요청자(멤버 ID)",
      dataIndex: "email",
    },
    {
      title: "처리 상태",
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

  useEffect(() => {
    // fetch();
  }, []);

  return (
    <>
      <h3>문의 관리</h3>

      <Row type="flex" align="middle" className="py-4">
        {/* <Button type="primary">
          <SearchOutlined></SearchOutlined>검색
        </Button> */}
        <Button
          type="primary"
          onClick={() => {
            setFilterModalOpen(true);
          }}
        >
          <SlidersOutlined></SlidersOutlined>필터
        </Button>
        <span className="px-2 w-10"></span>
      </Row>

      <Table
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
      <Modal
        visible={filterModalOpen}
        title="검색 항목"
        okText="검색"
        cancelText="취소"
        onCancel={() => {
          setFilterModalOpen(false);
        }}
        onOk={
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
      </Modal>
    </>
  );
};

export default connect((state) => state)(Qna);
