import {
  Button,
  Table,
  Form,
  Input,
  Row,
  Select,
  Modal,
  DatePicker,
} from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";

const Contract = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  const [searchForm] = useForm();

  const columns = [
    {
      title: "계약 ID",
      dataIndex: "contract_id",
    },
    {
      title: "계약자명",
      dataIndex: "user",
      render: (text, record) => {
        console.log(`record`, record);
        return (
          <a href={`/contract/${record.contract_id}`}>
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
      title: "그룹",
      dataIndex: "group_id",
    },
    {
      title: "상품",
      dataIndex: "-",
    },
    {
      title: "선호 지점",
      dataIndex: "-",
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
      title: "취소일",
      dataIndex: "cancel_date",
    },
    {
      title: "해지일",
      dataIndex: "expired_date",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [contractList, setContractList] = useState([]);
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
        `${process.env.BACKEND_API}/admin/contract/list`,
        {
          page: 1,
          size: 100,
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
        setContractList(data);
        // setPagination({ ...pagination, total: data.total });
        // setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  const handleStartDateChange = (date, dateString) => {
    // setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    // setEndDate(dateString);
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
        rowKey={(record) => record.contract_id}
        dataSource={contractList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
      <Filter
        visible={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onReset={() => console.log(`reset`)}
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
          form={searchForm}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="contract_id" label="계약 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_id" label="멤버 ID">
            <Input />
          </Form.Item>
          <Form.Item name="group_id" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_name" label="계약자명">
            <Input />
          </Form.Item>
          <Form.Item name="group_name" label="그룹명">
            <Input />
          </Form.Item>
          <Form.Item name="contract_status" label="계약 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="wait">계약 신청</Select.Option>
              <Select.Option value="canceled">계약 취소</Select.Option>
              <Select.Option value="pay">계약 완료(이용중)</Select.Option>
              <Select.Option value="expired">계약 해지(만료)</Select.Option>
              <Select.Option value="terminate">계약 해지(중도)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="membership_type" label="멤버십 상품">
            <Select style={{ width: 160 }}>
              <Select.Option value="all_spot">ALL SPOT</Select.Option>
              <Select.Option value="one_spot">ONE_SPOT</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="expiration_scheduled" label="만료 예정">
            <Select style={{ width: 160 }}>
              <Select.Option value="true">해당</Select.Option>
              <Select.Option value="false">미해당</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="terminatation_scheduled" label="해지 예정">
            <Select style={{ width: 160 }}>
              <Select.Option value="true">해당</Select.Option>
              <Select.Option value="false">미해당</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="계약 시작 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
          </Form.Item>
          <Form.Item name="end_date" label="계약 종료 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
          </Form.Item>
          <Form.Item name="cancel_date" label="계약 취소 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
          </Form.Item>
          <Form.Item name="terminate_date" label="계약 해지 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
          </Form.Item>
        </Form>
      </Filter>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Contract);
