import { Button, Table, Form, Input, Row, Select, DatePicker } from "antd";
import { SlidersOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { orderListColumns } from "@utils/columns/order";

// 청구/결제
const Order = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // 로그인/로그아웃 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [orderList, setOrderList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

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
        console.log(`orderList data`, data);
        setOrderList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
          size: data.size,
        };

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
    getOrderList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    // paginiation에서 제공하는 것이 아닌 api 통신을 위해 사용하는 size 속성만 추가해서 세팅
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getOrderList({
      ...params,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  const handleSearch = () => {
    const {
      order_id,
      contract_id,
      uid,
      user_name,
      payment_status,
      payment_method,
      pay_demand,
      order_date_start,
      order_date_end,
    } = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      order_id: order_id,
      contract_id: contract_id,
      uid: uid,
      user_name: user_name,
      payment_status: payment_status,
      payment_method: payment_method,
      pay_demand: pay_demand,
      order_date_start:
        order_date_start && moment(order_date_start).format("YYYY-MM-DD"),
      order_date_end:
        order_date_end && moment(order_date_end).format("YYYY-MM-DD"),
      page: 1,
      size: 20,
    };

    getOrderList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      order_id: undefined,
      contract_id: undefined,
      uid: undefined,
      user_name: undefined,
      payment_status: undefined,
      payment_method: undefined,
      pay_demand: undefined,
      order_date_start: undefined,
      order_date_end: undefined,
      page: 1,
      size: 20,
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
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
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
          <Form.Item name="user_name" label="회원명">
            <Input />
          </Form.Item>

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

          <Form.Item name="order_date" label="정기 결제 일자">
            <Form.Item
              name="order_date_start"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="시작일자" style={{ width: "100px" }} />
            </Form.Item>
            <span
              style={{
                display: "inline-block",
                width: "24px",
                lineHeight: "32px",
                textAlign: "center",
              }}
            >
              -
            </span>
            <Form.Item
              name="order_date_end"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="종료일자" style={{ width: "100px" }} />
            </Form.Item>
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
