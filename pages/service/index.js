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

const Service = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/list`,
        {
          page: 1,
          size: 100,
          contract_type: "service",
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
        setServiceList(data);
        // console.log(`data`, data);
        // setPagination({ ...pagination, total: data.total });
        // setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  const columns = [
    {
      title: "예약 ID",
      dataIndex: "contract_id",
    },
    {
      title: "계약자명",
      dataIndex: "user",
      render: (text, record) => {
        return (
          <a href={`/service/${record.contract_id}`}>
            {`${text.user_name}(${text.uid})`}
          </a>
        );
      },
    },
    {
      title: "계약 상태",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        if (text === "wait") {
          renderText = "계좌이체 대기";
        } else if (text === "buy") {
          renderText = "구매";
        } else if (text === "pay") {
          renderText = "이용중";
        } else if (text === "refund") {
          renderText = "환불";
        } else if (text === "expired") {
          renderText = "종료";
        } else if (text === "terminate") {
          renderText = "해지";
        } else if (text === "canceled") {
          renderText = "취소";
        }

        return renderText;
      },
    },
    {
      title: "부가서비스",
      dataIndex: "group_id",
    },
    {
      title: "사용 시간",
      dataIndex: "rateplan",
      render: (text, record) => {
        let renderText = "";

        if (text.product.time_unit === "day") {
          const endDate = new Date(record.end_date);
          const startDate = new Date(record.start_date);

          const diffDate =
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) +
            1;

          renderText = `${diffDate} 일`;
        } else {
          const diffTimes = text.product.end_time - text.product.start_time;
          renderText = `${diffTimes} 시간`;
        }

        return renderText;
      },
    },
    {
      title: "사용 지점",
      dataIndex: "spot_id",
    },
    {
      title: "금액",
      dataIndex: "rateplan",
      render: (text, record) => {
        const price = (text.price - text.dc_price).toLocaleString("ko-KR");
        return price;
      },
    },
    {
      title: "결제일",
      dataIndex: "regdate",
      render: (text, record) => {
        const payDate = text.split(" ")[0];
        return payDate;
      },
    },
    {
      title: "사용 시작일",
      dataIndex: "start_date",
    },
    {
      title: "사용 종료일",
      dataIndex: "end_date",
    },
    {
      title: "취소일시",
      dataIndex: "cancel_date",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
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

  return (
    <>
      <h3>부가서비스 예약 관리</h3>

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
            setRegistrationModalOpen(true);
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.contract_id}
        dataSource={serviceList}
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

export default connect((state) => state)(Service);
