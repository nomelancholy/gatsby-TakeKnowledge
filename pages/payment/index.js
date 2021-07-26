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
import { useForm } from "antd/lib/form/Form";

const Payment = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  const columns = [
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

  const [rateplanList, setRateplanList] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/rateplan/list`,
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
        setRateplanList(data);
        console.log(`data`, data);
        // setPagination({ ...pagination, total: data.total });
        // setProductList(data.items);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  const [searchForm] = useForm();

  const handleStartDateChange = (date, dateString) => {
    // setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    // setEndDate(dateString);
  };

  return (
    <>
      <h3>요금제 관리</h3>

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
        <Button
          type="primary"
          onClick={() => {
            Router.push("/payment/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.rateplan_id}
        dataSource={rateplanList}
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
          <Form.Item name="rateplan_id" label="요금제 ID">
            <Input />
          </Form.Item>
          <Form.Item name="prodct_type" label="상품 그룹">
            <Select style={{ width: 160 }}>
              <Select.Option value="membership">멤버십</Select.Option>
              <Select.Option value="service">부가서비스</Select.Option>
              <Select.Option value="voucher">이용권</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="product_id" label="상품명">
            {/*  멤버십 - all/on spot / 부가서비스 - 코워킹룸, 미팅룸.. / 이용권 - spot 100.. */}
            <Select style={{ width: 160 }}>
              {/* <Select.Option value="all_spot">ALL SPOT</Select.Option>
              <Select.Option value="one_spot">ONE_SPOT</Select.Option> */}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value="active">사용</Select.Option>
              <Select.Option value="inactive">미사용</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="시작 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
          </Form.Item>
          <Form.Item name="end_date" label="종료 일자">
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

export default connect((state) => state)(Payment);
