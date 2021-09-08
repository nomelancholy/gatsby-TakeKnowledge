import { Button, Table, Form, Input, Row, Select } from "antd";
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
    notice_id: undefined,
    status: undefined,
    type: undefined,
    sticky: undefined,
    title: undefined,
  });

  const getCouponList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/services/notice/list`,
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
      notice_id: searchFormValues.notice_id,
      status: searchFormValues.status,
      type: searchFormValues.type,
      sticky: searchFormValues.sticky,
      title: searchFormValues.title,
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

  return (
    <>
      <h3>쿠폰 자동 발급</h3>

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
            Router.push("/notice/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={couponListcolumns}
        rowKey={(record) => record.notice_id}
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
          <Form.Item name="notice_id" label="공지 ID">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="공지 유형">
            <Select style={{ width: 160 }}>
              <Select.Option value="normal">일반 공지</Select.Option>
              <Select.Option value="group">그룹 공지</Select.Option>
              <Select.Option value="spot">지점 공지</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 120 }}>
              <Select.Option value="publish">발행</Select.Option>
              <Select.Option value="private">미발행</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sticky" label="상단 노출">
            <Select style={{ width: 120 }}>
              <Select.Option value={0}>미노출</Select.Option>
              <Select.Option value={1}>노출</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="공지 제목">
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

export default connect((state) => state)(Coupon);
