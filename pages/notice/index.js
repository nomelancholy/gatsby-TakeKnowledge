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
  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.BACKEND_API}/services/notices`,
        { page: 1, size: 20, type: "normal", sticky: 0 },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        console.log(`response.data`, response.data);
        const noticeList = response.data.items;
        setNoticeList(noticeList);
      })
      .catch((error) => {
        console.log(`error`, error);
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
      render: (text, record) => {
        return <a href={`/notice/${record.notice_id}`}>{text}</a>;
      },
    },
    {
      title: "공지 유형",
      dataIndex: "type",
      render: (text, record) => {
        let renderText = "";

        if (text === "normal") {
          renderText = "일반 공지";
        } else if (text === "group") {
          renderText = "그룹 공지";
        } else if (text === "spot") {
          renderText = "지점 공지";
        }

        return renderText;
      },
    },
    {
      title: "상단 노출",
      dataIndex: "sticky",
      render: (text, record) => {
        return text === 0 ? "O" : "X";
      },
    },
    {
      title: "등록자",
      dataIndex: "email",
    },
    {
      title: "사용 여부",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        if (text === "publish") {
          renderText = "발행";
        } else if (text === "group") {
          renderText = "그룹 공지";
        } else if (text === "spot") {
          renderText = "지점 공지";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [form] = Form.useForm();

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(2);
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
        rowKey={(record) => record.notice_id}
        dataSource={noticeList}
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
