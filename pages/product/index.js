import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const Product = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const renderWorkingDays = (value, row, index) => {
    let workingDays = [];

    Object.entries(value).filter((obj) => {
      if (obj[1]) {
        workingDays.push(obj[0]);
      }
    });

    const startDay = covertEngDayToKorDay(workingDays[0]);
    const endDay = covertEngDayToKorDay(workingDays[workingDays.length - 1]);

    const renderDay = `${startDay}~${endDay}`;

    return renderDay;
  };

  const columns = [
    {
      title: "상품 ID",
      dataIndex: "product_id",
    },
    {
      title: "상품 구분",
      dataIndex: "type",
    },
    {
      title: "상품명",
      dataIndex: "name",
    },
    {
      title: "멤버십 유형",
      dataIndex: "service_type",
    },
    {
      title: "결제 유형",
      dataIndex: "pay_demand",
    },
    {
      title: "요일",
      dataIndex: "working_days",
      render: renderWorkingDays,
    },
    {
      title: "시작시간",
      dataIndex: "start_time",
    },
    {
      title: "종료시간",
      dataIndex: "end_time",
    },
    {
      title: "사용 가능 공간ID",
      dataIndex: "email",
    },
    {
      title: "활성/비활성",
      dataIndex: "status",
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }

    getProductList();
  }, []);

  const getProductList = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        {},
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
        setPagination({ ...pagination, total: 200 });
        setProductList(data.items);
        setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const covertEngDayToKorDay = (value) => {
    switch (value) {
      case "mon":
        return "월";
      case "tue":
        return "화";
      case "wed":
        return "수";
      case "thu":
        return "목";
      case "fri":
        return "금";
      case "sat":
        return "토";
      case "sun":
        return "일";
      default:
        break;
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(2);

    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const fetch = (params = {}) => {
    setLoading(true);
    axios
      .get(
        "https://randomuser.me/api",
        {
          results: 10,
          ...params,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log(`response`, response);
        const data = response.data;
        console.log(`data`, data);
        // Read total count from server
        // pagination.total = data.totalCount;
        setPagination({ ...pagination, total: 200 });
        setLoading(false);
        setData(data.results);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    // fetch();
  }, []);

  const handleGroupTypeChange = (value) => {
    console.log(value);
    form.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  };

  const handlePaymentTypeChange = (value) => {
    console.log(value);
    form.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  };

  return (
    <>
      <h3>상품 관리</h3>

      <Row type="flex" align="middle" className="py-4">
        {/* <Button type="primary">
          <SearchOutlined></SearchOutlined>검색
        </Button> */}
        <Button
          type="primary"
          onClick={() => {
            setFilterModalOpen(true);
          }}
        >
          <SlidersOutlined></SlidersOutlined>필터
        </Button>
        <span className="px-2 w-10"></span>
        <Button
          type="primary"
          onClick={() => {
            setRegistrationModalOpen(true);
          }}
        >
          + 등록
        </Button>
      </Row>

      <Table
        columns={columns}
        rowKey={(record) => record.product_id}
        dataSource={productList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
      <Modal
        visible={filterModalOpen}
        title="검색 항목"
        okText="검색"
        cancelText="취소"
        onCancel={() => {
          setFilterModalOpen(false);
        }}
        onOk={
          () => {
            console.log(`onOk`);
          }
          //     () => {
          //   form
          //     .validateFields()
          //     .then((values) => {
          //       form.resetFields();
          //       onCreate(values);
          //     })
          //     .catch((info) => {
          //       console.log("Validate Failed:", info);
          //     });
          // }
        }
      >
        <Form
          // form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="그룹 ID" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="그룹명" label="그룹명">
            <Input />
          </Form.Item>
          <Form.Item name="회원 상태" label="회원 상태">
            <Input />
          </Form.Item>
          <Form.Item name="활성/휴면 여부" label="활성/휴면 여부">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* 등록 모달 */}
      <Modal
        visible={registrationModalOpen}
        title="그룹 등록"
        okText="등록"
        cancelText="취소"
        onCancel={() => {
          setRegistrationModalOpen(false);
        }}
        onOk={
          () => {
            console.log(`onOk`);
          }
          //     () => {
          //   form
          //     .validateFields()
          //     .then((values) => {
          //       form.resetFields();
          //       onCreate(values);
          //     })
          //     .catch((info) => {
          //       console.log("Validate Failed:", info);
          //     });
          // }
        }
      >
        <Form
          // form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item
            name="그룹 유형"
            label="그룹 유형"
            rules={[
              { required: true, message: "그룹 유형은 필수 선택 사항입니다." },
            ]}
          >
            <Select
              placeholder="그룹 유형을 선택해주세요"
              onChange={handleGroupTypeChange}
            >
              <Select.Option value="male">개인 사업자</Select.Option>
              <Select.Option value="female">법인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="그룹명"
            label="그룹명"
            rules={[
              {
                required: true,
                message: "그룹명은 필수 입력 사항입니다.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="결제수단 선택"
            label="결제수단 선택"
            rules={[
              {
                required: true,
                message: "결제 수단은은 필수 선택 사항입니다.",
              },
            ]}
          >
            <Select
              placeholder="결제수단 선택"
              onChange={handlePaymentTypeChange}
            >
              <Select.Option value="male">카드</Select.Option>
              <Select.Option value="female">계좌이체</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Product);
