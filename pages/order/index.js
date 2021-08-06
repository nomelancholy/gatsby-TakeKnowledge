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
import { orderListColumns } from "@utils/columns/order";

const Order = (props) => {
  // 청구/결제 컬럼 정의

  const { user, isLoggedIn, token } = props.auth;

  const [orderList, setOrderList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [orderDateStart, setOrderDateStart] = useState(undefined);
  const [orderDateEnd, setOrderDateEnd] = useState(undefined);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    order_id: undefined,
    contract_id: undefined,
    uid: undefined,
    group_id: undefined,
    user_name: undefined,
    payment_status: undefined,
    payment_method: undefined,
    pay_demand: undefined,
    order_date_start: undefined,
    order_date_end: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getOrderList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
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
        console.log(`data`, data);
        setOrderList(data.items);

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

    getOrderList(params);
  }, []);
  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getOrderList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      order_id: searchFormValues.order_id,
      contract_id: searchFormValues.contract_id,
      uid: searchFormValues.uid,
      group_id: undefined,
      user_name: searchFormValues.user_name,
      payment_status: searchFormValues.payment_status,
      payment_method: searchFormValues.payment_method,
      pay_demand: searchFormValues.pay_demand,
      order_date_start: orderDateStart,
      order_date_end: orderDateEnd,
      page: 1,
    };

    getOrderList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setOrderDateStart(undefined);
    setOrderDateEnd(undefined);

    // params state reset
    const searchParams = {
      order_id: undefined,
      contract_id: undefined,
      uid: undefined,
      group_id: undefined,
      user_name: undefined,
      payment_status: undefined,
      payment_method: undefined,
      pay_demand: undefined,
      order_date_start: undefined,
      order_date_end: undefined,
      page: 1,
    };

    getOrderList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>청구/결제</h3>

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
        columns={orderListColumns}
        rowKey={(record) => record.order.order_id}
        dataSource={orderList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
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
        >
          <Form.Item name="order_id" label="청구 ID">
            <Input />
          </Form.Item>
          <Form.Item name="contract_id" label="계약 ID">
            <Input />
          </Form.Item>
          <Form.Item name="uid" label="멤버 ID">
            <Input />
          </Form.Item>
          {/* <Form.Item name="group_id" label="그룹 ID">
            <Input />
          </Form.Item> */}
          <Form.Item name="user_name" label="회원명">
            <Input />
          </Form.Item>
          {/* <Form.Item name="group_type" label="그룹 유형">
            <Select style={{ width: 160 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
            </Select>
          </Form.Item> */}
          <Form.Item name="payment_status" label="결제 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="wait">대기</Select.Option>
              <Select.Option value="buy">결제</Select.Option>
              <Select.Option value="unpaid">미납</Select.Option>
              <Select.Option value="canceled">취소</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="payment_method" label="결제 방식">
            <Select style={{ width: 160 }}>
              <Select.Option value="personal">개인 카드결제</Select.Option>
              <Select.Option value="coporation">법인 카드결제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="pay_demand" label="결제 유형">
            <Select style={{ width: 160 }}>
              <Select.Option value="pre">선불</Select.Option>
              <Select.Option value="deffered">후불</Select.Option>
              <Select.Option value="last">말일결제</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="next_paydate" label="정기 결제 일자">
            <DatePicker
              onChange={(date, dateString) => setOrderDateStart(dateString)}
            />
            <DatePicker
              onChange={(date, dateString) => setOrderDateEnd(dateString)}
            />
          </Form.Item>
        </Form>
      </Filter>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Order);
