import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
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

const Product = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // grid 요일 render 함수
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

  const columns = [
    {
      title: "상품 ID",
      dataIndex: "product_id",
    },
    {
      title: "상품 구분",
      dataIndex: "type",
      render: (text, record) => {
        let renderText = "";
        if (text === "membership") {
          renderText = "멤버십";
        } else if (text === "service") {
          renderText = "부가서비스";
        } else if (text === "voucher") {
          renderText = "이용권";
        }

        return renderText;
      },
    },
    {
      title: "상품명",
      dataIndex: "name",
      render: (text, record) => {
        return <a href={`/product/${record.product_id}`}>{text}</a>;
      },
    },
    {
      title: "멤버십 유형",
      dataIndex: "service_type",
      render: (text, record) => {
        let renderText = "";
        if (text === "accumulate") {
          renderText = "기본형";
        } else if (text === "deduction") {
          renderText = "차감형";
        }

        return renderText;
      },
    },
    {
      title: "결제 유형",
      dataIndex: "pay_demand",
      render: (text, record) => {
        let renderText = "";
        if (text === "pre") {
          renderText = "선불";
        } else if (text === "deffered") {
          renderText = "후불";
        }

        return renderText;
      },
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
      dataIndex: "spots",
    },
    {
      title: "활성/비활성",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";
        if (text === "active") {
          renderText = "활성";
        } else if (text === "inactive") {
          renderText = "비활성";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

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
        setPagination({ ...pagination, total: data.total });
        setProductList(data.items);
        setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(`pagination`, pagination);
    console.log(`filters`, filters);
    console.log(`sorter`, sorter);
  };

  return (
    <>
      <h3>상품 관리</h3>

      <Row type="flex" align="middle" className="py-3">
        {/* <Button type="primary">
          <SearchOutlined></SearchOutlined>검색
        </Button> */}
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
            Router.push("/product/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.product_id}
        dataSource={productList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
      <Filter
        visible={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onSearch={
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
      </Filter>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Product);
