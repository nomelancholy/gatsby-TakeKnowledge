import { Button, Table, Form, Input, Row, Select } from "antd";
import { SlidersOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { userListColumns } from "@utils/columns/user";

// 회원 관리
const User = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // 로그인/로그아웃 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [userList, setUserList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // 검색 필터 Modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  // 검색 Form
  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    user_name: undefined,
    has_contract: undefined,
    user_role_ext: undefined,
    status: undefined,
    registed_card: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getUserList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/list`,
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
        setUserList(data.items);

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

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getUserList({ ...params, page: pagination.current });
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    const { user_name, has_contract, user_role_ext, status, registed_card } =
      searchForm.getFieldsValue();

    const searchParams = {
      user_name: user_name,
      has_contract: has_contract,
      user_role_ext: user_role_ext,
      status: status,
      registed_card: registed_card,
      page: 1,
    };

    getUserList({ ...params, ...searchParams });
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      user_name: undefined,
      has_contract: undefined,
      user_role_ext: undefined,
      status: undefined,
      registed_card: undefined,
      page: 1,
    };

    getUserList({ ...params, ...searchParams });
  };

  useEffect(() => {
    getUserList(params);
  }, []);

  return (
    <>
      <h3>회원 관리</h3>

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
        columns={userListColumns}
        rowKey={(record) => record.uid}
        dataSource={userList}
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
          <Form.Item name="user_name" label="회원명">
            <Input />
          </Form.Item>
          <Form.Item name="has_contract" label="회원 구분">
            <Select style={{ width: 160 }}>
              <Select.Option value={true}>멤버</Select.Option>
              <Select.Option value={false}>회원</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="user_role_ext" label="회원 역할">
            <Select style={{ width: 160 }}>
              <Select.Option value="ffadmin">파이브스팟 어드민</Select.Option>
              <Select.Option value="member">일반</Select.Option>
              <Select.Option value="group_admin">그룹 관리자</Select.Option>
              <Select.Option value="group_member">그룹 멤버</Select.Option>
              <Select.Option value="group_master">
                그룹 관리자멤버
              </Select.Option>
            </Select>
          </Form.Item>
          {/* <Form.Item name="group_id" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="group_name" label="그룹명">
            <Select style={{ width: 160 }}>
            </Select>
          </Form.Item> */}
          <Form.Item name="status" label="회원 상태">
            <Select style={{ width: 160 }}>
              <Select.Option value="active">활성</Select.Option>
              <Select.Option value="sleep">휴면</Select.Option>
              <Select.Option value="leave">탈퇴</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="registed_card" label="카드 등록 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value={true}>등록</Select.Option>
              <Select.Option value={false}>미등록</Select.Option>
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

export default connect((state) => state)(User);
