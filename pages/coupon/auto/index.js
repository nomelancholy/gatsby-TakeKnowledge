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
import { couponAutoListcolumns } from "@utils/columns/coupon";
import moment from "moment";

// 쿠폰 자동 발급
const CouponAuto = (props) => {
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
    cai_id: undefined,
    name: undefined,
    target: undefined,
    issue_category: undefined,
    coupon_category: undefined,
    coupon_type: undefined,
    start_pub_date_start: undefined,
    start_pub_date_end: undefined,
    end_pub_date_start: undefined,
    end_pub_date_end: undefined,
  });

  const getCouponList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/issue_auto/list`,
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
      cai_id,
      name,
      target,
      issue_category,
      coupon_category,
      coupon_type,
      start_pub_date_start,
      start_pub_date_end,
      end_pub_date_start,
      end_pub_date_end,
    } = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      cai_id: cai_id,
      name: name,
      target: target,
      issue_category: issue_category,
      coupon_category: coupon_category,
      coupon_type: coupon_type,
      start_pub_date_start:
        start_pub_date_start &&
        moment(start_pub_date_start).format("YYYY-MM-DD"),
      start_pub_date_end:
        start_pub_date_end && moment(start_pub_date_end).format("YYYY-MM-DD"),
      end_pub_date_start:
        end_pub_date_start && moment(end_pub_date_start).format("YYYY-MM-DD"),
      end_pub_date_end:
        end_pub_date_end && moment(end_pub_date_end).format("YYYY-MM-DD"),
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
      cai_id: undefined,
      name: undefined,
      target: undefined,
      issue_category: undefined,
      coupon_category: undefined,
      coupon_type: undefined,
      start_pub_date_start: undefined,
      start_pub_date_end: undefined,
      end_pub_date_start: undefined,
      end_pub_date_end: undefined,
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
            Router.push("/coupon/auto/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={couponAutoListcolumns}
        rowKey={(record) => record.cai_id}
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
          <Form.Item name="cai_id" label="자동발급 쿠폰 ID">
            <InputNumber />
          </Form.Item>
          <Form.Item name="name" label="쿠폰명">
            <Input />
          </Form.Item>
          <Form.Item name="target" label="대상">
            <Select style={{ width: 160 }}>
              <Select.Option value="all">전체</Select.Option>
              <Select.Option value="user">회원</Select.Option>
              <Select.Option value="member">멤버</Select.Option>
              <Select.Option value="referral">추천인</Select.Option>
              <Select.Option value="niminee">피추천인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="issue_category" label="자동발급 유형">
            <Select style={{ width: 120 }}>
              <Select.Option value="birthday">생일</Select.Option>
              <Select.Option value="issue_day">지정일</Select.Option>
              <Select.Option value="join">회원 가입</Select.Option>
              <Select.Option value="membership_expired">
                멤버십 만료
              </Select.Option>
              <Select.Option value="membership_terminate">
                멤버십 해지
              </Select.Option>
              <Select.Option value="referral">리퍼럴</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="coupon_category" label="쿠폰 구분">
            <Select style={{ width: 120 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커룸</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
              <Select.Option value="membership">멤버십</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="coupon_type" label="쿠폰 유형">
            <Select style={{ width: 120 }}>
              <Select.Option value="flat">정액 할인</Select.Option>
              <Select.Option value="ratio">비율 할인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="start_pub_date" label="자동 발급 시작 일자">
            <Form.Item
              name="start_pub_date_start"
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
              name="start_pub_date_end"
              style={{ display: "inline-block" }}
            >
              <DatePicker placeholder="종료" style={{ width: "100px" }} />
            </Form.Item>
          </Form.Item>
          <Form.Item name="end_pub_date" label="자동 발급 종료 일자">
            <Form.Item
              name="end_pub_date_start"
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
              name="end_pub_date_end"
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

export default connect((state) => state)(CouponAuto);
