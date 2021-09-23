import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
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
import XLSX from "xlsx";
import moment from "moment";

// 쿠폰 직접 발급
const CouponManual = (props) => {
  const { user, isLoggedIn, token } = props.auth;
  // token 전달이 필요해서 컬럼 정의 리스트 페이지로 이동
  const couponManualListcolumns = [
    {
      title: "직접발급 ID",
      dataIndex: "cmi_id",
      render: (text, record) => {
        return <a href={`/coupon/manual/${text}`}>{text}</a>;
      },
    },
    {
      title: "쿠폰 명",
      dataIndex: "coupon",
      render: (text, record) => {
        return text.name;
      },
    },
    {
      title: "직접발급 상태",
      dataIndex: "status",
      render: (text, record) => {
        let renderText = "";

        if (text === "active") {
          renderText = "실행";
        } else if (text === "inactive") {
          renderText = "중단";
        }

        return renderText;
      },
    },
    {
      title: "발급 방식",
      dataIndex: "issue_type",
      render: (text, record) => {
        let renderText = "";

        if (text === "each") {
          renderText = "개별 발급";
        } else if (text === "bundle") {
          renderText = "대량 발급";
        }

        return renderText;
      },
    },
    {
      title: "쿠폰 구분",
      dataIndex: "coupon",
      render: (text, record) => {
        let renderText = "";

        if (text.coupon_category === "meeting") {
          renderText = "미팅룸";
        } else if (text.coupon_category === "coworking") {
          renderText = "코워킹룸";
        } else if (text.coupon_category === "locker") {
          renderText = "락커룸";
        } else if (text.coupon_category === "lounge") {
          renderText = "라운지";
        } else if (text.coupon_category === "membership") {
          renderText = "멤버쉽";
        }

        return renderText;
      },
    },
    {
      title: "적용 쿠폰 ID",
      dataIndex: "coupon_id",
    },
    {
      title: "쿠폰 설명(고객 노출)",
      dataIndex: "coupon",
      render: (text, record) => {
        return text.desc;
      },
    },
    {
      title: "쿠폰 유형",
      dataIndex: "coupon",
      render: (text, record) => {
        let renderText = "";

        if (text.coupon_type === "flat") {
          renderText = "정액 할인";
        } else if (text === "ratio") {
          renderText = "비율 할인";
        }

        return renderText;
      },
    },
    {
      title: "할인액",
      dataIndex: "coupon",
      render: (text, record) => {
        let renderText = "";

        if (text.coupon_type === "flat") {
          renderText = text.discount.toLocaleString("ko-KR");
        }

        return renderText;
      },
    },
    {
      title: "할인 비율",
      dataIndex: "coupon",
      render: (text, record) => {
        let renderText = "";

        if (text.coupon_type === "ratio") {
          renderText = text.discount;
        }

        return renderText;
      },
    },
    {
      title: "발급량",
      dataIndex: "coupon",
      render: (text, record) => {
        return text.total;
      },
    },

    {
      title: "발급 일시",
      dataIndex: "regdate",
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              const config = {
                headers: {
                  Authorization: decodeURIComponent(token),
                },
              };

              axios
                .get(
                  `${process.env.BACKEND_API}/admin/user/coupon/issued/excel/${record.cmi_id}`,
                  config
                )
                .then(function (response) {
                  const params = {
                    ...response.data,
                    name: record.coupon.name,
                  };

                  excelDownload(params);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }}
          >
            엑셀 다운로드
          </Button>
        );
      },
    },
  ];

  const excelDownload = ({ header, items, name }) => {
    // 엑셀 컬럼명 세팅
    let excelData = [header];

    // 엑셀 데이터 세팅
    items.map((item) => {
      excelData.push(item);
    });

    // 엑셀 파일 생성 및 시트 추가
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // 열 너비 임의 지정
    const wscols = header.map((h, i) => {
      return { width: 20 };
    });

    worksheet["!cols"] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet);

    XLSX.writeFile(workbook, `${name} 발급리스트.xlsx`);
  };

  const [couponStartDateStart, setCouponStartDateStart] = useState(undefined);
  const [couponStartDateEnd, setCouponStartDateEnd] = useState(undefined);
  const [couponEndDateStart, setCouponEndDateStart] = useState(undefined);
  const [couponEndDateEnd, setCouponEndDateEnd] = useState(undefined);

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [couponList, setCouponList] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  const [params, setParams] = useState({
    cmi_id: undefined,
    issue_type: undefined,
    coupon_category: undefined,
    coupon_type: undefined,
    coupon_start_date_start: undefined,
    coupon_start_date_end: undefined,
    coupon_end_date_start: undefined,
    coupon_end_date_end: undefined,
  });

  const getCouponList = (params) => {
    setLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/coupon/issue_manual/list`,
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
        console.log(`notice data`, data);

        setCouponList(data.items);

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
    getCouponList(pagination);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
    });

    // 호출
    getCouponList({
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

    const searchParams = {
      cmi_id: searchFormValues.cmi_id,
      issue_type: searchFormValues.issue_type,
      coupon_category: searchFormValues.coupon_category,
      coupon_type: searchFormValues.coupon_type,
      coupon_start_date_start: couponStartDateStart,
      coupon_start_date_end: couponStartDateEnd,
      coupon_end_date_start: couponEndDateStart,
      coupon_end_date_end: couponEndDateEnd,
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    // params state reset
    const searchParams = {
      cmi_id: undefined,
      issue_type: undefined,
      coupon_category: undefined,
      coupon_type: undefined,
      coupon_start_date_start: undefined,
      coupon_start_date_end: undefined,
      coupon_end_date_start: undefined,
      coupon_end_date_end: undefined,
      page: 1,
      size: 20,
    };

    getCouponList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3> 쿠폰 직접 발급</h3>

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
            Router.push("/coupon/manual/new");
          }}
        >
          <PlusOutlined />
          <span>등록</span>
        </Button>
        <Button
          type="primary"
          onClick={() => {
            Router.push("/coupon/manual/result");
          }}
        >
          <PlusOutlined />
          <span>발급 결과</span>
        </Button>
      </Row>

      <Table
        size="middle"
        columns={couponManualListcolumns}
        rowKey={(record) => record.cmi_id}
        dataSource={couponList}
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
          <Form.Item name="cmi_id" label="직접발급 ID">
            <InputNumber />
          </Form.Item>
          <Form.Item name="issue_type" label="발급 방식">
            <Select style={{ width: 160 }}>
              <Select.Option value="each">개별 발급</Select.Option>
              <Select.Option value="bundle">대량 발급</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="coupon_category" label="쿠폰 구분">
            <Select style={{ width: 120 }}>
              <Select.Option value="meeting">미팅룸</Select.Option>
              <Select.Option value="coworking">코워킹룸</Select.Option>
              <Select.Option value="locker">락커룸</Select.Option>
              <Select.Option value="lounge">라운지</Select.Option>
              <Select.Option value="membership">멤버십</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="coupon_type" label="쿠폰 유형">
            <Select style={{ width: 120 }}>
              <Select.Option value="flat">정액 할인</Select.Option>
              <Select.Option value="ratio">비율 할인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="start_date" label="시작 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setCouponStartDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) =>
                  setCouponStartDateEnd(dateString)
                }
              />
            </>
          </Form.Item>
          <Form.Item name="end_date" label="종료 일자">
            <>
              <DatePicker
                placeholder="시작"
                onChange={(date, dateString) =>
                  setCouponEndDateStart(dateString)
                }
              />
              <DatePicker
                placeholder="종료"
                onChange={(date, dateString) => setCouponEndDateEnd(dateString)}
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

export default connect((state) => state)(CouponManual);
