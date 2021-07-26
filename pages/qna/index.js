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

const Qna = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const [searchForm] = useForm();

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  const columns = [
    {
      title: "문의 ID",
      dataIndex: "qid",
    },
    {
      title: "문의 유형",
      dataIndex: "classification",
    },
    {
      title: "제목",
      dataIndex: "title",
      render: (text, record) => {
        return <a href={`/qna/${record.qid}`}>{text}</a>;
      },
    },
    {
      title: "요청자(멤버 ID)",
      dataIndex: "user",
      render: (text, record) => {
        console.log(`text`, text);
        return text.user_name;
      },
    },
    {
      title: "처리 상태",
      dataIndex: "state",
      render: (text, record) => {
        let renderText = "";

        if (text === "wait") {
          renderText = "대기";
        } else if (text === "done") {
          renderText = "해결";
        } else if (text === "trash") {
          renderText = "삭제";
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

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [qnaList, setQnaList] = useState([]);

  useEffect(() => {
    const data = JSON.stringify({
      status: "publish",
      page: 1,
      limit: 10,
    });

    var config = {
      method: "post",
      url: `${process.env.BACKEND_API}/user/qna-list`,
      headers: {
        Authorization: decodeURIComponent(token),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setQnaList(response.data.items);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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

  const handleStartDateChange = (date, dateString) => {
    // setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    // setEndDate(dateString);
  };

  return (
    <>
      <h3>문의 관리</h3>

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
        rowKey={(record) => record.qid}
        dataSource={qnaList}
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
          <Form.Item name="qid" label="문의 ID">
            <Input />
          </Form.Item>
          <Form.Item name="classification" label="문의 유형">
            <Select style={{ width: 120 }}>
              {/* <Select.Option value={0}>미노출</Select.Option>
              <Select.Option value={1}>노출</Select.Option> */}
            </Select>
          </Form.Item>
          <Form.Item name="state" label="회원 상태">
            <Select style={{ width: 120 }}>
              <Select.Option value="wait">대기</Select.Option>
              <Select.Option value="done">해결</Select.Option>
              <Select.Option value="trash">삭제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="regdate" label="생성 일시">
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

export default connect((state) => state)(Qna);
