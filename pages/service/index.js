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

const Service = (props) => {
  // 부가서비스 예약 관리 컬럼 정의
  const columns = [
    {
      title: "예약 ID",
      dataIndex: "contract",
      render: (text, record) => {
        return text.contract_id;
      },
    },
    {
      title: "계약자명",
      dataIndex: "user",
      render: (text, record) => {
        return (
          <a href={`/service/${record.contract_id}`}>
            {`${text.user_name}(${text.uid})`}
          </a>
        );
      },
    },
    {
      title: "계약 상태",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        const status = text.status;

        if (status === "wait") {
          renderText = "계좌이체 대기";
        } else if (status === "buy") {
          renderText = "구매";
        } else if (status === "pay") {
          renderText = "이용중";
        } else if (status === "refund") {
          renderText = "환불";
        } else if (status === "expired") {
          renderText = "종료";
        } else if (status === "terminate") {
          renderText = "해지";
        } else if (status === "canceled") {
          renderText = "취소";
        }

        return renderText;
      },
    },
    {
      title: "부가서비스",
      dataIndex: "space",
      render: (text, record) => {
        let renderText = "";

        // console.log(`record`, record);

        // console.log(`text.product`, text.product.type);
        // console.log(`type`, type);

        const type = text.type;

        // console.log(`type`, type);

        switch (type) {
          case "lounge":
            renderText = "라운지";
            break;
          case "meeting":
            renderText = "미팅룸";
            break;
          case "coworking":
            renderText = "코워킹룸";
            break;
          case "locker":
            renderText = "락커";
            break;
          default:
            break;
        }

        return renderText;
      },
    },
    {
      title: "사용 시간",
      dataIndex: "time_diff",
      // render: (text, record) => {
      //   let renderText = "";

      //   if (text.product.time_unit === "day") {
      //     const endDate = new Date(record.end_date);
      //     const startDate = new Date(record.start_date);

      //     const diffDate =
      //       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) +
      //       1;

      //     renderText = `${diffDate} 일`;
      //   } else {
      //     const diffTimes = text.product.end_time - text.product.start_time;
      //     renderText = `${diffTimes} 시간`;
      //   }

      //   return renderText;
      // },
    },
    {
      title: "사용 지점",
      dataIndex: "spot",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "금액",
      dataIndex: "payment",
      render: (text, record) => {
        // const price = (text.price - text.dc_price).toLocaleString("ko-KR");
        // return price;
        return text.total;
      },
    },
    {
      title: "결제일",
      dataIndex: "payment",
      render: (text, record) => {
        const payDate = text.regdate.split(" ")[0];
        return payDate;
      },
    },
    {
      title: "사용 시작일",
      dataIndex: "contract",
      render: (text, record) => {
        return text.start_date;
      },
    },
    {
      title: "사용 종료일",
      dataIndex: "contract",
      render: (text, record) => {
        return text.end_date;
      },
    },
    {
      title: "취소일시",
      dataIndex: "contract",
      render: (text, record) => {
        return text.cancel_date;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "contract",
      render: (text, record) => {
        return text.regdate;
      },
    },
  ];

  const { user, isLoggedIn, token } = props.auth;

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
        // console.log(`data`, data);
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
    if (!isLoggedIn) {
      Router.push("/");
    }

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
        columns={columns}
        rowKey={(record) => record.contract_id}
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
          </Form.Item>
          <Form.Item name="end_date" label="예약 종료 일자">
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
          </Form.Item>
          <Form.Item name="cancel_date" label="예약 취소 일자">
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
