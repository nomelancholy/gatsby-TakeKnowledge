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
import { serviceListColumns } from "@utils/columns/service";

// 부가서비스 계약 관리
const Service = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // 로그인/로그아웃 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [serviceList, setServiceList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [reservationStartDateStart, setReservationStartDateStart] =
    useState(undefined);
  const [reservationStartDateEnd, setReservationStartDateEnd] =
    useState(undefined);
  const [reservationEndDateStart, setReservationEndDateStart] =
    useState(undefined);
  const [reservationEndDateEnd, setReservationEndDateEnd] = useState(undefined);
  const [reservationCancelDateStart, setReservationCancelDateStart] =
    useState(undefined);
  const [reservationCancelDateEnd, setReservationCancelDateEnd] =
    useState(undefined);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    contract_id: undefined,
    uid: undefined,
    user_name: undefined,
    product_type: undefined,
    status: undefined,
    spot_id: undefined,
    reservation_start_date_start: undefined,
    reservation_start_date_end: undefined,
    reservation_end_date_start: undefined,
    reservation_end_date_end: undefined,
    reservation_cancel_date_start: undefined,
    reservation_cancel_date_end: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getServiceList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/service/list`,
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
        setServiceList(data.items);

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
    getServiceList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getServiceList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      contract_id: searchFormValues.contract_id,
      uid: searchFormValues.uid,
      user_name: searchFormValues.user_name,
      product_type: searchFormValues.product_type,
      status: searchFormValues.status,
      spot_id: searchFormValues.spot_id,
      reservation_start_date_start: reservationStartDateStart,
      reservation_start_date_end: reservationStartDateEnd,
      reservation_end_date_start: reservationEndDateStart,
      reservation_end_date_end: reservationEndDateEnd,
      reservation_cancel_date_start: reservationCancelDateStart,
      reservation_cancel_date_end: reservationCancelDateEnd,
      page: 1,
    };

    getServiceList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setReservationStartDateStart(undefined);
    setReservationStartDateEnd(undefined);
    setReservationEndDateStart(undefined);
    setReservationEndDateEnd(undefined);
    setReservationCancelDateStart(undefined);
    setReservationCancelDateEnd(undefined);

    // params state reset
    const searchParams = {
      contract_id: undefined,
      uid: undefined,
      user_name: undefined,
      product_type: undefined,
      status: undefined,
      spot_id: undefined,
      reservation_start_date_start: undefined,
      reservation_start_date_end: undefined,
      reservation_end_date_start: undefined,
      reservation_end_date_end: undefined,
      reservation_cancel_date_start: undefined,
      reservation_cancel_date_end: undefined,
      page: 1,
    };

    getServiceList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>부가서비스 예약 관리</h3>

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
        {/* 2차 분량 */}
        {/* <Button
          type="primary"
          onClick={() => {
            setRegistrationModalOpen(true);
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button> */}
      </Row>

      <Table
        size="middle"
        columns={serviceListColumns}
        rowKey={(record) => record.schedule.schedule_id}
        dataSource={serviceList}
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
          <Form.Item name="contract_id" label="예약 ID">
            <Input />
          </Form.Item>
          <Form.Item name="uid" label="멤버 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_name" label="계약자명">
            <Input />
          </Form.Item>
          <Form.Item name="product_type" label="부가서비스">
            <Select style={{ width: 160 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="예약 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="wait">계좌이체 대기</Select.Option>
              <Select.Option value="buy">구매</Select.Option>
              <Select.Option value="pay">이용중</Select.Option>
              <Select.Option value="refund">환불</Select.Option>
              <Select.Option value="expired">종료</Select.Option>
              <Select.Option value="terminate">해지</Select.Option>
              <Select.Option value="canceld">취소</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="spot" label="사용 지점">
            <Select style={{ width: 160 }}>
              {/* 활성화 된 spot 리스트 가져와서  map */}
              {/* <Select.Option value="true">해당</Select.Option>
              <Select.Option value="false">미해당</Select.Option> */}
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="예약 시작 일자">
            <>
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationStartDateStart(dateString)
                }
              />
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="예약 종료 일자">
            <>
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationEndDateStart(dateString)
                }
              />
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationEndDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="cancel_date" label="예약 취소 일자">
            <>
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationCancelDateStart(dateString)
                }
              />
              <DatePicker
                onChange={(date, dateString) =>
                  setReservationCancelDateEnd(dateString)
                }
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

export default connect((state) => state)(Service);
