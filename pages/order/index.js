import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";

const Order = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const [orderList, setOrderList] = useState([]);

  const columns = [
    {
      title: "청구 ID(계약 ID)",
      dataIndex: "order",
      render: (text, record) => {
        const renderText = `${text.order_id} (${record.contract.contract_id})`;
        return renderText;
      },
    },
    {
      title: "계약자명",
      dataIndex: "user",
      render: (text, record) => {
        console.log(`record`, record);
        return (
          <a href={`/order/${record.order_id}`}>
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

        if (text.status === "wait") {
          renderText = "계약 신청(입금전)";
        } else if (text.status === "buy") {
          renderText = "계약 신청(이용전)";
        } else if (text.status === "pay") {
          renderText = "계약 완료(이용중)";
        } else if (text.status === "refund") {
          renderText = "계약 해지(환불)";
        } else if (text.status === "expired") {
          renderText = "계약 해지(만료)";
        } else if (text.status === "terminate") {
          renderText = "계약 해지(중도)";
        } else if (text.status === "canceled") {
          renderText = "계약 해지(취소)";
        }

        return renderText;
      },
    },
    {
      title: "그룹",
      dataIndex: "group_id",
    },
    {
      title: "구분",
      dataIndex: "contract",
      render: (text, record) => {
        let renderText = "";

        if (text.contract_type === "service") {
          renderText = "부가서비스";
        } else if (text.contract_type === "membershipt") {
          renderText = "멤버십";
        } else if (text.contract_type === "voucher") {
          renderText = "이용권";
        }

        return renderText;
      },
    },
    {
      title: "상품명",
      dataIndex: "product",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "정기 결제일",
      dataIndex: "contract",
      render: (text, record) => {
        console.log(`text`, text);
        return text.next_paydate;
      },
    },
    {
      title: "결제 방식",
      dataIndex: "pay_method",
      render: (text, record) => {
        let renderText = "";

        if (text.type == "personal") {
          renderText = "개인 카드 결제";
        } else {
          renderText = "법인 카드 결제";
        }

        return renderText;
      },
    },
    {
      title: "결제 유형",
      dataIndex: "product",
      render: (text, record) => {
        let renderText = "";

        if (text.pay_demand == "pre") {
          renderText = "선불";
        } else if (text.pay_demand == "deffered") {
          renderText = "후불";
        } else if (text.pay_demand == "last") {
          renderText = "말일 결제";
        }

        return renderText;
      },
    },
    {
      title: "청구상태",
      dataIndex: "order",
      render: (text, record) => {
        let renderText = "";

        if (text.status == "purchase") {
          renderText = "성공";
        } else if (text.status == "canceled") {
          renderText = "취소";
        } else if (text.status == "end") {
          renderText = "종료";
        }

        return renderText;
      },
    },
    {
      title: "청구 금액",
      dataIndex: "order",
      render: (text, record) => {
        return text.amount.toLocaleString("ko-KR");
      },
    },
    {
      title: "결제 금액",
      dataIndex: "payment",
      render: (text, record) => {
        return text.total.toLocaleString("ko-KR");
      },
    },
    {
      title: "결제 상태",
      dataIndex: "payment",
      render: (text, record) => {
        let renderText = "";

        if (text.status == "wait") {
          renderText = "대기";
        } else if (text.status == "buy") {
          renderText = "결제";
        } else if (text.status == "unpaid") {
          renderText = "미납";
        } else if (text.status == "canceld") {
          renderText = "취소";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "order",
      render: (text, record) => {
        return text.regdate;
      },
    },
  ];

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [form] = Form.useForm();

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

  useEffect(() => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
        {
          page: 1,
          limit: 100,
          contract_id: 10,
        },
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
        setOrderList(data);
        console.log(`data`, data);
        // setPagination({ ...pagination, total: data.total });
        // setProductList(data.items);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  }, []);

  return (
    <>
      <h3>청구/결제</h3>

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
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.order.order_id}
        dataSource={orderList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* 필터 모달 */}
      <Filter
        visible={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onSearch={() => {
          console.log(`onOk`);
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
        }}
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

export default connect((state) => state)(Order);
