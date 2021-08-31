import { Button, Table, Form, Input, Row, Select, DatePicker } from "antd";
import { SlidersOutlined, PlusOutlined } from "@ant-design/icons";

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

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // 사용 지점 옵션 state
  const [optionSpotList, setOptionSpotList] = useState(undefined);

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

  const [params, setParams] = useState({
    schedule_id: undefined,
    uid: undefined,
    user_name: undefined,
    space_type: undefined,
    status: undefined,
    spot_id: undefined,
    start_date_start: undefined,
    start_date_end: undefined,
    end_date_start: undefined,
    end_date_end: undefined,
    cancel_date_start: undefined,
    cancel_date_end: undefined,
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
    getServiceList(pagination);

    getOptionsSpotList();
  }, []);

  const getOptionsSpotList = () => {
    console.log("call getOptionsSpotList");
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        { page: 1, size: 100 },
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
        // 활성화된 스팟들만 사용 가능 스팟으로 세팅 -> 다 불러서 disabled 시키는 쪽으로 변경
        // const activeSpotList = data.filter((spot) => spot.status === "active");
        setOptionSpotList(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getServiceList({
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
      schedule_id: searchFormValues.schedule_id,
      uid: searchFormValues.uid,
      user_name: searchFormValues.user_name,
      space_type: searchFormValues.space_type,
      status: searchFormValues.status,
      spot_id: searchFormValues.spot_id,
      start_date_start: reservationStartDateStart,
      start_date_end: reservationStartDateEnd,
      end_date_start: reservationEndDateStart,
      end_date_end: reservationEndDateEnd,
      cancel_date_start: reservationCancelDateStart,
      cancel_date_end: reservationCancelDateEnd,
      page: 1,
      size: 20,
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

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      schedule_id: undefined,
      uid: undefined,
      user_name: undefined,
      space_type: undefined,
      status: undefined,
      spot_id: undefined,
      start_date_start: undefined,
      start_date_end: undefined,
      end_date_start: undefined,
      end_date_end: undefined,
      cancel_date_start: undefined,
      cancel_date_end: undefined,
      page: 1,
      size: 20,
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
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setRegistrationModalOpen(true);
          }}
        >
          등록
        </Button>
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
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        >
          <Form.Item name="schedule_id" label="예약 ID">
            <Input />
          </Form.Item>
          <Form.Item name="uid" label="멤버 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_name" label="계약자명">
            <Input />
          </Form.Item>
          <Form.Item name="space_type" label="부가서비스">
            <Select style={{ width: 160 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="예약 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="buy">예약</Select.Option>
              <Select.Option value="canceled">예약 취소</Select.Option>
              <Select.Option value="pay">계약 완료(이용중)</Select.Option>
              <Select.Option value="expired">계약 해지 (만료)</Select.Option>
              <Select.Option value="terminate">계약 해지 (중도)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="spot_id" label="사용 지점">
            <Select style={{ width: 160 }}>
              {/* 활성화 된 spot 리스트 가져와서  map */}
              {optionSpotList &&
                optionSpotList.map((optionSpot) => (
                  <Select.Option
                    key={optionSpot.spot_id}
                    value={optionSpot.spot_id}
                    disabled={optionSpot.status === "active" ? false : true}
                  >
                    {optionSpot.status === "active"
                      ? optionSpot.name
                      : `${optionSpot.name} ${
                          optionSpot.status === "inactive"
                            ? "(비활성)"
                            : "(삭제)"
                        }`}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="예약 시작 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setReservationStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setReservationStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="예약 종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setReservationEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setReservationEndDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="cancel_date" label="예약 취소 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setReservationCancelDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
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
