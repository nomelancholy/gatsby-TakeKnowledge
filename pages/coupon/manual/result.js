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
import { couponResultColumns } from "@utils/columns/coupon";
import router from "next/router";

// 쿠폰 발급 결과
const CouponResult = (props) => {
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
    ci_id: undefined,
    name: undefined,
    email: undefined,
    user_status: undefined,
    issue_type: undefined,
    regdate_start: undefined,
    regdate_end: undefined,
    issued_by: "manual",
  });

  const getCouponList = (params) => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/issued/list`,
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
    const {
      ci_id,
      name,
      email,
      user_status,
      issue_type,
      regdate_start,
      regdate_end,
    } = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      ci_id,
      name,
      email,
      user_status,
      issue_type,
      regdate_start:
        regdate_start && moment(regdate_start).format("YYYY-MM-DD"),
      regdate_end: regdate_end && moment(regdate_end).format("YYYY-MM-DD"),
      issued_by: "manual",
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
      ci_id: undefined,
      name: undefined,
      email: undefined,
      user_status: undefined,
      issue_type: undefined,
      regdate_start: undefined,
      regdate_end: undefined,
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
  };

  return (
    <>
      <>
        <h3>쿠폰 발급 결과</h3>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          뒤로 가기{" "}
        </Button>
      </>
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
        columns={couponResultColumns}
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
          <Form.Item name="ci_id" label="직접발급 ID">
            <InputNumber />
          </Form.Item>
          <Form.Item name="name" label="쿠폰 명">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="이메일">
            <Input />
          </Form.Item>
          <Form.Item name="user_status" label="사용자 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="user">회원</Select.Option>
              <Select.Option value="guest">비회원</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="issue_type" label="발급 방식">
            <Select style={{ width: 160 }}>
              <Select.Option value="bundle">대량</Select.Option>
              <Select.Option value="each">개별</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="regdate" label="직접 발급 일자">
            <Form.Item name="regdate_start" style={{ display: "inline-block" }}>
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
            <Form.Item name="regdate_end" style={{ display: "inline-block" }}>
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

export default connect((state) => state)(CouponResult);
