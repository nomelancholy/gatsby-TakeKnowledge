import { Button, Table, Form, Input, Row, Select, DatePicker } from "antd";
import { SlidersOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { contractListColumns } from "@utils/columns/contract";

// 계약
const Contract = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // 로그인/로그아웃 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [contractList, setContractList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [contractStartDateStart, setContractStartDateStart] =
    useState(undefined);
  const [contractStartDateEnd, setContractStartDateEnd] = useState(undefined);
  const [contractEndDateStart, setContractEndDateStart] = useState(undefined);
  const [contractEndDateEnd, setContractEndDateEnd] = useState(undefined);
  const [contractCancelDateStart, setContractCancelDateStart] =
    useState(undefined);
  const [contractCancelDateEnd, setContractCancelDateEnd] = useState(undefined);
  const [contractTerminateDateStart, setContractTerminateDateStart] =
    useState(undefined);
  const [contractTerminateDateEnd, setContractTerminateDateEnd] =
    useState(undefined);

  const [searchForm] = useForm();

  const [params, setParams] = useState({
    contract_id: undefined,
    uid: undefined,
    user_name: undefined,
    status: undefined,
    contract_type: undefined,
    start_date_start: undefined,
    start_date_end: undefined,
    end_date_start: undefined,
    end_date_end: undefined,
    cancel_date_start: undefined,
    cancel_date_end: undefined,
    terminate_date_start: undefined,
    terminate_date_end: undefined,
  });

  const getContractList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/list`,
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
        setContractList(data.items);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
          size: data.size,
        };

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
    getContractList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({ ...pagination, size: pagination.pageSize });

    // 호출
    getContractList({
      ...params,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    let contractIds = undefined;
    let uIds = undefined;
    let groupIds = undefined;

    if (searchFormValues.contract_id) {
      contractIds = searchFormValues.contract_id.split("\n");
    }

    if (searchFormValues.uid) {
      uIds = searchFormValues.uid.split("\n");
    }

    console.log(`contractIds`, contractIds);

    const searchParams = {
      contract_id: contractIds,
      uid: uIds,
      user_name: searchFormValues.user_name,
      status: searchFormValues.status,
      contract_type: searchFormValues.contract_type,
      start_date_start: contractStartDateStart,
      start_date_end: contractStartDateEnd,
      end_date_start: contractEndDateStart,
      end_date_end: contractEndDateEnd,
      cancel_date_start: contractCancelDateStart,
      cancel_date_end: contractCancelDateEnd,
      terminate_date_start: contractTerminateDateStart,
      terminate_date_end: contractTerminateDateEnd,
      page: 1,
      size: 20,
    };

    getContractList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setContractStartDateStart(undefined);
    setContractStartDateEnd(undefined);
    setContractEndDateStart(undefined);
    setContractEndDateEnd(undefined);
    setContractCancelDateStart(undefined);
    setContractCancelDateEnd(undefined);
    setContractTerminateDateStart(undefined);
    setContractTerminateDateEnd(undefined);

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      contract_id: undefined,
      uid: undefined,
      user_name: undefined,
      status: undefined,
      contract_type: undefined,
      start_date_start: undefined,
      start_date_end: undefined,
      end_date_start: undefined,
      end_date_end: undefined,
      cancel_date_start: undefined,
      cancel_date_end: undefined,
      terminate_date_start: undefined,
      terminate_date_end: undefined,
      page: 1,
      size: 20,
    };

    getContractList({ ...params, ...searchParams });
  };
  return (
    <>
      <h3>계약</h3>

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
      </Row>

      <Table
        size="middle"
        columns={contractListColumns}
        rowKey={(record) => record.contract_id}
        dataSource={contractList}
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
          <Form.Item name="contract_id" label="계약 ID">
            <Input.TextArea autoSize={true} />
          </Form.Item>
          <Form.Item name="uid" label="멤버 ID">
            <Input.TextArea autoSize={true} />
          </Form.Item>
          <Form.Item
            name="user_name"
            label="계약자명"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="계약 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="buy">계약 신청</Select.Option>
              <Select.Option value="canceled">계약 취소</Select.Option>
              <Select.Option value="pay">계약 완료(이용중)</Select.Option>
              <Select.Option value="expired">계약 해지(만료)</Select.Option>
              <Select.Option value="terminate">계약 해지(중도)</Select.Option>
              <Select.Option value="withdraw">
                계약 해지(청약 철회)
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="contract_type" label="상품 구분">
            <Select style={{ width: 160 }}>
              <Select.Option value="membership">멤버십</Select.Option>
              <Select.Option value="voucher">이용권</Select.Option>
              <Select.Option value="service">부가서비스</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="계약 시작 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setContractStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setContractStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="계약 종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setContractEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setContractEndDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="cancel_date" label="계약 취소 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setContractCancelDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setContractCancelDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="terminate_date" label="계약 해지 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setContractTerminateDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setContractTerminateDateEnd(dateString)
                }
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

export default connect((state) => state)(Contract);
