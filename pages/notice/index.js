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
import { useForm } from "antd/lib/form/Form";

const Notice = (props) => {
  // 공지 컬럼 정의
  const columns = [
    {
      title: "공지 ID",
      dataIndex: "notice_id",
    },
    {
      title: "공지 제목",
      dataIndex: "title",
      render: (text, record) => {
        return <a href={`/notice/${record.notice_id}`}>{text}</a>;
      },
    },
    {
      title: "공지 유형",
      dataIndex: "type",
      render: (text, record) => {
        let renderText = "";

        if (text === "normal") {
          renderText = "일반 공지";
        } else if (text === "group") {
          renderText = "그룹 공지";
        } else if (text === "spot") {
          renderText = "지점 공지";
        }

        return renderText;
      },
    },
    {
      title: "상단 노출",
      dataIndex: "sticky",
      render: (text, record) => {
        return text === 0 ? "X" : "O";
      },
    },
    {
      title: "등록자",
      dataIndex: "user",
      render: (text, record) => {
        return text.user_name;
      },
    },
    {
      title: "사용 여부",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        console.log(`text`, text);

        if (text === "publish") {
          renderText = "발행";
        } else if (text === "private") {
          renderText = "미발행";
        }

        return renderText;
      },
    },
    {
      title: "생성 일시",
      dataIndex: "regdate",
    },
  ];

  const { user, isLoggedIn, token } = props.auth;

  const [noticeList, setNoticeList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    notice_id: undefined,
    status: undefined,
    type: undefined,
    sticky: undefined,
    title: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getNoticeList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/services/notice/list`,
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

        setNoticeList(data.items);

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

    getNoticeList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getNoticeList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      notice_id: searchFormValues.notice_id,
      status: searchFormValues.status,
      type: searchFormValues.type,
      sticky: searchFormValues.sticky,
      title: searchFormValues.title,
      page: 1,
    };

    getNoticeList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      notice_id: undefined,
      status: undefined,
      type: undefined,
      sticky: undefined,
      title: undefined,
      page: 1,
    };

    getNoticeList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>알림(공지) 관리</h3>

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
            Router.push("/notice/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.notice_id}
        dataSource={noticeList}
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
          <Form.Item name="notice_id" label="공지 ID">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="공지 유형">
            <Select style={{ width: 160 }}>
              <Select.Option value="normal">일반 공지</Select.Option>
              <Select.Option value="group">그룹 공지</Select.Option>
              <Select.Option value="spot">지점 공지</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 120 }}>
              <Select.Option value="publish">발행</Select.Option>
              <Select.Option value="private">미발행</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="sticky" label="상단 노출">
            <Select style={{ width: 120 }}>
              <Select.Option value={0}>미노출</Select.Option>
              <Select.Option value={1}>노출</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="공지 제목">
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

export default connect((state) => state)(Notice);
