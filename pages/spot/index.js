import { Button, Table, Form, Input, Row, Modal, Select } from "antd";
import { SlidersOutlined, PlusOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";

const Spot = (props) => {
  // Grid Column 정의
  const columns = [
    {
      title: "스팟 ID",
      dataIndex: "spot_id",
    },
    {
      title: "스팟명",
      dataIndex: "name",
      render: (text, record) => {
        if (record.status === "trash") {
          return text;
        } else {
          return <a href={`/spot/${record.spot_id}`}>{text}</a>;
        }
      },
    },
    {
      title: "좌석 수",
      dataIndex: "seat_capacity",
    },
    {
      title: "최대 허용 수",
      dataIndex: "seat_limit",
    },
    {
      title: "라운지",
      dataIndex: "lounge",
    },
    {
      title: "미팅룸",
      dataIndex: "meeting",
    },
    {
      title: "코워킹 룸",
      dataIndex: "coworking",
    },
    {
      title: "락커",
      dataIndex: "locker",
    },
    {
      title: "활성/비활성",
      dataIndex: "status",
      render: (text) => {
        let renderText = "";

        switch (text) {
          case "active":
            renderText = "활성";
            break;
          case "inactive":
            renderText = "비활성";
            break;
          case "trash":
            renderText = "삭제";
            break;
          default:
            break;
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

  // 조회해온 spot list
  const [spotList, setSpotList] = useState([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  // 파라미터 state - 초기엔 초기값, 이후엔 바로 직전의 params 저장
  const [params, setParams] = useState({
    spot_id: undefined,
    name: undefined,
    status: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  // spot list 조회
  const getSpotList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
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

        setSpotList(data.items);

        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setPagination(pageInfo);

        setLoading(false);

        // 테이블 페이지 변경을 위해 방금 사용한 params 저장
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

    getSpotList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getSpotList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      spot_id: searchFormValues.spot_id,
      name: searchFormValues.name,
      status: searchFormValues.status,
      page: 1,
    };

    getSpotList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      spot_id: undefined,
      name: undefined,
      status: undefined,
      page: 1,
    };

    getSpotList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>스팟 관리</h3>

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
            Router.push(`/spot/new`);
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => record.spot_id}
        dataSource={spotList}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* 필터 */}
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
          <Form.Item name="spot_id" label="스팟 ID">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="스팟명">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 200 }}>
              <Select.Option value="active">활성</Select.Option>
              <Select.Option value="inactive">비활성</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Filter>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Spot);
