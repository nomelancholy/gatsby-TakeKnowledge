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
import { rateplanListColumns } from "@utils/columns/rateplan";

const Rateplan = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const [rateplanList, setRateplanList] = useState([]);

  const [optionProductList, setOptionProductList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    rateplan_id: undefined,
    type: undefined,
    product_id: undefined,
    status: undefined,
    start_date_start: undefined,
    start_date_end: undefined,
    end_date_start: undefined,
    end_date_end: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const [startDateStart, setStartDateStart] = useState(undefined);
  const [startDateEnd, setStartDateEnd] = useState(undefined);
  const [endDateStart, setEndDateStart] = useState(undefined);
  const [endDateEnd, setEndDateEnd] = useState(undefined);

  const getRateplanList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/rateplan/list`,
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
        setRateplanList(data.items);

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

    getRateplanList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getRateplanList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      rateplan_id: searchFormValues.rateplan_id,
      type: searchFormValues.type,
      product_id: searchFormValues.product_id,
      status: searchFormValues.status,
      start_date_start: startDateStart,
      start_date_end: startDateEnd,
      end_date_start: endDateStart,
      end_date_end: endDateEnd,
      page: 1,
    };

    getRateplanList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setStartDateStart(undefined);
    setStartDateEnd(undefined);
    setEndDateStart(undefined);
    setEndDateEnd(undefined);

    // params state reset
    const searchParams = {
      rateplan_id: undefined,
      type: undefined,
      product_id: undefined,
      status: undefined,
      start_date_start: undefined,
      start_date_end: undefined,
      end_date_start: undefined,
      end_date_end: undefined,
      page: 1,
    };

    getRateplanList({ ...params, ...searchParams });
  };

  // 상품 그룹 변경시 상품명 리스트 변경
  const handleProductTypeChange = (value) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        { page: 1, size: 20, status: "active", type: value },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const productList = response.data.items;
        setOptionProductList(productList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
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
            Router.push("/rateplan/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={rateplanListColumns}
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
          <Form.Item name="rateplan_id" label="요금제 ID">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="상품 그룹">
            <Select style={{ width: 160 }} onChange={handleProductTypeChange}>
              <Select.Option value="membership">멤버십</Select.Option>
              <Select.Option value="service">부가서비스</Select.Option>
              <Select.Option value="voucher">이용권</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="product_id" label="상품명">
            <Select style={{ width: 160 }}>
              {optionProductList.map((product) => (
                <Select.Option value={product.product_id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value="active">사용</Select.Option>
              <Select.Option value="inactive">미사용</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="시작 일자">
            <DatePicker
              onChange={(date, dateString) => setStartDateStart(dateString)}
            />
            <DatePicker
              onChange={(date, dateString) => setStartDateEnd(dateString)}
            />
          </Form.Item>
          <Form.Item name="end_date" label="종료 일자">
            <DatePicker
              onChange={(date, dateString) => setEndDateStart(dateString)}
            />
            <DatePicker
              onChange={(date, dateString) => setEndDateEnd(dateString)}
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

export default connect((state) => state)(Rateplan);