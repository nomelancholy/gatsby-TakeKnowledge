import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  DatePicker,
} from "antd";
import { SlidersOutlined, PlusOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { couponListcolumns } from "@utils/columns/coupon";
import moment from "moment";

// 쿠폰 관리
const Coupon = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [couponList, setCouponList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  const [params, setParams] = useState({
    coupon_id: undefined,
    name: undefined,
    coupon_type: undefined,
    coupon_category: undefined,
    pub_date_start: undefined,
    pub_date_end: undefined,
  });

  const getCouponList = (params) => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/list`,
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
        console.log(`coupon data`, data);
        setCouponList(data.items);
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
    getCouponList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getCouponList({
      ...params,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  const handleSearch = () => {
    const {
      coupon_id,
      name,
      coupon_type,
      coupon_category,
      pub_date_start_start,
      pub_date_start_end,
      pub_date_end_start,
      pub_date_end_end,
    } = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      coupon_id: coupon_id,
      name: name,
      coupon_type: coupon_type,
      coupon_category: coupon_category,
      pub_date_start_start:
        pub_date_start_start &&
        moment(pub_date_start_start).format("YYYY-MM-DD"),
      pub_date_start_end:
        pub_date_start_end && moment(pub_date_start_end).format("YYYY-MM-DD"),
      pub_date_end_start:
        pub_date_end_start && moment(pub_date_end_start).format("YYYY-MM-DD"),
      pub_date_end_end:
        pub_date_end_end && moment(pub_date_end_end).format("YYYY-MM-DD"),
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
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
      coupon_id: undefined,
      name: undefined,
      coupon_type: undefined,
      coupon_category: undefined,
      pub_date_start: undefined,
      pub_date_end: undefined,
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>쿠폰 관리</h3>

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
            Router.push("/coupon/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={couponListcolumns}
        rowKey={(record) => record.coupon_id}
        dataSource={couponList}
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
          <Form.Item name="coupon_id" label="쿠폰 ID">
            <InputNumber />
          </Form.Item>
          <Form.Item name="coupon_type" label="쿠폰 유형">
            <Select style={{ width: 160 }}>
              <Select.Option value="flat">정액 할인</Select.Option>
              <Select.Option value="rate">비율 할인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name" label="쿠폰 명">
            <Input />
          </Form.Item>
          <Form.Item name="coupon_category" label="쿠폰 구분">
            <Select style={{ width: 120 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커룸</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
              <Select.Option value="membership">멤버쉽</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="pub_date_start" label="쿠폰 시작 일자">
            <Form.Item
              name="pub_date_start_start"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="시작" style={{ width: "100px" }} />
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
              name="pub_date_start_end"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="종료" style={{ width: "100px" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item name="pub_date_end" label="쿠폰 종료 일자">
            <Form.Item
              name="pub_date_start_start"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="시작" style={{ width: "100px" }} />
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
              name="pub_date_start_end"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="종료" style={{ width: "100px" }} />
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

export default connect((state) => state)(Coupon);
