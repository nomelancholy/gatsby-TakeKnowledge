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
        console.log(`notice data`, data);
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
    const searchFormValues = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      coupon_id: searchFormValues.coupon_id,
      name: searchFormValues.name,
      coupon_type: searchFormValues.coupon_type,
      coupon_category: searchFormValues.coupon_category,
      pub_date_start_start: couponStartDateStart,
      pub_date_start_end: couponStartDateEnd,
      pub_date_end_start: couponEndDateStart,
      pub_date_end_end: couponEndDateEnd,
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
      notice_id: undefined,
      status: undefined,
      type: undefined,
      sticky: undefined,
      title: undefined,
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
  };

  const [couponStartDateStart, setCouponStartDateStart] = useState("");
  const [couponStartDateEnd, setCouponStartDateEnd] = useState("");

  const [couponEndDateStart, setCouponEndDateStart] = useState("");
  const [couponEndDateEnd, setCouponEndDateEnd] = useState("");

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
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setCouponStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setCouponStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="pub_date_end" label="쿠폰 종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setCouponEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) => setCouponEndDateEnd(dateString)}
              />
            </>
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
