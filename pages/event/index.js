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
import { eventListcolumns } from "@utils/columns/event";

// 이벤트 관리
const Event = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [eventList, setEventList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [eventStartDateStart, setEventStartDateStart] = useState(undefined);
  const [eventStartDateEnd, setEventStartDateEnd] = useState(undefined);
  const [eventEndDateStart, setEventEndDateStart] = useState(undefined);
  const [eventEndDateEnd, setEventEndDateEnd] = useState(undefined);

  const [searchForm] = useForm();

  const [params, setParams] = useState({
    event_id: undefined,
    title: undefined,
    start_date_start: undefined,
    start_date_end: undefined,
    end_date_start: undefined,
    end_date_end: undefined,
    status: undefined,
  });

  const getEventList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/services/events/list`,
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
        console.log(`event data`, data);

        setEventList(data.items);

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
    getEventList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getEventList({
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
      event_id: searchFormValues.event_id,
      title: searchFormValues.title,
      start_date_start: eventStartDateStart,
      start_date_end: eventStartDateEnd,
      end_date_start: eventEndDateStart,
      end_date_end: eventEndDateEnd,
      status: searchFormValues.status,
      page: 1,
      size: 20,
    };

    getEventList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setEventStartDateStart(undefined);
    setEventStartDateEnd(undefined);
    setEventEndDateStart(undefined);
    setEventEndDateEnd(undefined);

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      event_id: undefined,
      title: undefined,
      start_date_start: undefined,
      start_date_end: undefined,
      end_date_start: undefined,
      end_date_end: undefined,
      status: undefined,
      page: 1,
      size: 20,
    };

    getEventList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>이벤트 관리</h3>

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
            Router.push("/event/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={eventListcolumns}
        rowKey={(record) => record.event_id}
        dataSource={eventList}
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
          <Form.Item name="event_id" label="이벤트 ID">
            <Input />
          </Form.Item>
          <Form.Item name="title" label="이벤트 제목">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 120 }}>
              <Select.Option value="publish">활성</Select.Option>
              <Select.Option value="trash">비활성</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="start_date" label="이벤트 시작 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setEventStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setEventStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="이벤트 종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setEventEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) => setEventEndDateEnd(dateString)}
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

export default connect((state) => state)(Event);
