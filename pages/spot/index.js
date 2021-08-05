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
import { spotListcolumns } from "@utils/columns/spot";

const Spot = (props) => {
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

  // 등록 버튼 클릭시
  const handleAddSpot = () => {
    const formData = new FormData();

    formData.append("name", "신규");
    formData.append("property", "fivespot");
    formData.append("status", "inactive");
    formData.append("operation_time", "연중무휴, 24시간");
    formData.append("seat_capacity", 0);

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/spot/add`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          getSpotList(params);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getSpotList({ ...params, page: pagination.current });
  };

  // 검색

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

  // 검색 초기화
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

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    getSpotList(params);
  }, []);

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
          필터
        </Button>
        <span className="px-2 w-10"></span>
        <Button type="primary" onClick={handleAddSpot}>
          <PlusOutlined />
          등록
        </Button>
      </Row>

      <Table
        size="middle"
        columns={spotListcolumns}
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
