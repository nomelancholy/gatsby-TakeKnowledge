import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, PlusOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { productListColumns } from "@utils/columns/product";

// 상품 관리
const Product = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  // 로그인/로그아웃 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [productList, setProductList] = useState([]);

  // 필터 옵션에 사용하는 상품 리스트
  const [optionProductList, setOptionProductList] = useState([]);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  const [params, setParams] = useState({
    product_id: undefined,
    type: undefined,
    name: undefined,
    status: undefined,
    pay_demand: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getProductList = (params) => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
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
        setProductList(data.items);

        console.log(`data`, data);

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
    getProductList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getProductList({ ...params, page: pagination.current });
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      product_id: searchFormValues.product_id,
      type: searchFormValues.type,
      name: searchFormValues.name,
      status: searchFormValues.status,
      pay_demand: searchFormValues.pay_demand,
      page: 1,
    };

    getProductList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      product_id: undefined,
      type: undefined,
      name: undefined,
      status: undefined,
      pay_demand: undefined,
      page: 1,
    };

    getProductList({ ...params, ...searchParams });
  };

  // 상품 그룹 변경시 상품명 리스트 변경
  const handleProductTypeChange = (value) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        { page: 1, size: 20, status: "active", type: value },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const productList = response.data.items;
        setOptionProductList(productList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  return (
    <>
      <h3>상품 관리</h3>

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
            Router.push("/product/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={productListColumns}
        rowKey={(record) => record.product_id}
        dataSource={productList}
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
        >
          <Form.Item name="product_id" label="상품 ID">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="상품 그룹">
            <Select style={{ width: 160 }} onChange={handleProductTypeChange}>
              <Select.Option value="membership">멤버십</Select.Option>
              <Select.Option value="service">부가서비스</Select.Option>
              <Select.Option value="voucher">이용권</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name" label="상품명">
            {/* 그룹에서 선택한 상품명 찾아서 세팅 */}
            <Select style={{ width: 160 }}>
              {optionProductList.map((product) => (
                <Select.Option value={product.name}>
                  {product.name}
                </Select.Option>
              ))}
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
          <Form.Item name="pay_method" label="결제 방식">
            <Select style={{ width: 160 }}>
              <Select.Option value="personal">개인 카드결제</Select.Option>
              <Select.Option value="coporation">법인 카드결제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="사용 여부">
            <Select style={{ width: 160 }}>
              <Select.Option value="active">사용</Select.Option>
              <Select.Option value="inactive">미사용</Select.Option>
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

export default connect((state) => state)(Product);
