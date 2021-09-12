import {
  Button,
  Table,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { SlidersOutlined, PlusOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { bannerListcolumns } from "@utils/columns/banner";

// 배너 관리
const Banner = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [bannerList, setBannerList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [bannerStartDateStart, setBannerStartDateStart] = useState(undefined);
  const [bannerStartDateEnd, setBannerStartDateEnd] = useState(undefined);
  const [bannerEndDateStart, setBannerEndDateStart] = useState(undefined);
  const [bannerEndDateEnd, setBannerEndDateEnd] = useState(undefined);

  const [searchForm] = useForm();

  const [params, setParams] = useState({
    banner_id: undefined,
    title: undefined,
    path: undefined,
    status: undefined,
    permission: undefined,
    start_date_start: undefined,
    start_date_end: undefined,
    end_date_start: undefined,
    end_date_end: undefined,
  });

  const getBannerList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/services/banner/list`,
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
        console.log(`banner data`, data);

        setBannerList(data.items);

        // // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
          size: data.size,
        };

        setPagination(pageInfo);

        // // 로딩바 세팅
        setLoading(false);

        setParams(params);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    getBannerList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getBannerList({
      ...params,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  const handleSearch = () => {
    const { banner_id, title, path, status, permission } =
      searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      banner_id,
      title,
      path,
      status,
      permission,
      start_date_start: bannerStartDateStart,
      start_date_end: bannerStartDateEnd,
      end_date_start: bannerEndDateStart,
      end_date_end: bannerEndDateEnd,
      page: 1,
      size: 20,
    };

    getBannerList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setBannerStartDateStart(undefined);
    setBannerStartDateEnd(undefined);
    setBannerEndDateStart(undefined);
    setBannerEndDateEnd(undefined);

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      banner_id: undefined,
      title: undefined,
      path: undefined,
      status: undefined,
      permission: undefined,
      start_date_start: undefined,
      start_date_end: undefined,
      end_date_start: undefined,
      end_date_end: undefined,
      page: 1,
      size: 20,
    };

    getBannerList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>배너 관리</h3>

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
            Router.push("/banner/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={bannerListcolumns}
        rowKey={(record) => record.banner_id}
        dataSource={bannerList}
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
          <Form.Item name="banner_id" label="배너 ID">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="title" label="제목">
            <Input />
          </Form.Item>
          <Form.Item name="path" label="배너 위치">
            <Select style={{ width: 160 }}>
              <Select.Option value="home">홈</Select.Option>
              <Select.Option value="spot">스팟</Select.Option>
              <Select.Option value="service">서비스</Select.Option>
              <Select.Option value="mypage">마이페이지</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="노출">
            <Select style={{ width: 120 }}>
              <Select.Option value="publish">활성</Select.Option>
              <Select.Option value="private">비활성</Select.Option>
              <Select.Option value="trash">삭제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="permission" label="배너 타깃">
            <Select style={{ width: 120 }}>
              <Select.Option value="guest">비회원</Select.Option>
              <Select.Option value="user">개인 회원</Select.Option>
              <Select.Option value="member">개인 멤버</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="start_date" label="배너 적용 시작 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setBannerStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setBannerStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="배너 적용 종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setBannerEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) => setBannerEndDateEnd(dateString)}
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

export default connect((state) => state)(Banner);
