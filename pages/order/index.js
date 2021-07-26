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
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";

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
          <a href={`/order/${record.contract.contract_id}`}>
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
    console.log(`tablechange`);

    setPagination(2);

    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const [searchForm] = useForm();

  const handleStartDateChange = (date, dateString) => {
    // setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    // setEndDate(dateString);
  };

  useEffect(() => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
        {
          page: 1,
          limit: 100,
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
        setPagination({ ...pagination, total: response.data.total });
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
        onReset={() => console.log(`reset`)}
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
          form={searchForm}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="order_id" label="청구 ID">
            <Input />
          </Form.Item>
          <Form.Item name="contract_id" label="계약 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_id" label="멤버 ID">
            <Input />
          </Form.Item>
          <Form.Item name="group_id" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="user_name" label="회원명">
            <Input />
          </Form.Item>
          <Form.Item name="group_type" label="그룹 유형">
            <Select style={{ width: 160 }}>
              {/* <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option> */}
            </Select>
          </Form.Item>
          <Form.Item name="payment_status" label="결제 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="wait">대기</Select.Option>
              <Select.Option value="buy">결제</Select.Option>
              <Select.Option value="unpaid">미납</Select.Option>
              <Select.Option value="canceled">취소</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="pay_method" label="결제 방식">
            <Select style={{ width: 160 }}>
              <Select.Option value="personal">개인 카드결제</Select.Option>
              <Select.Option value="coporation">법인 카드결제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="pay_demand" label="결제 유형">
            <Select style={{ width: 160 }}>
              {/* 활성화 된 spot 리스트 가져와서  map */}
              <Select.Option value="pre">선불</Select.Option>
              <Select.Option value="deffered">후불</Select.Option>
              <Select.Option value="last">말일결제</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="next_paydate" label="정기 결제 일자">
            <DatePicker onChange={handleStartDateChange} />
            <DatePicker onChange={handleEndDateChange} />
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
