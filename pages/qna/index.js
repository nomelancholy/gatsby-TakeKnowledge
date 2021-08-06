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
import { qnaListColumns } from "@utils/columns/qna";

const Qna = (props) => {
  // 1차 유형, 2차 유형 하이라키 구조
  const qnaSelectOptions = [
    {
      label: "멤버십",
      category: [
        "멤버십 상품 문의",
        "멤버십 상품 변경",
        "멤버십 결제, 시작일 정보 변경",
        "멤버십 해지",
        "멤버십 이용 방법",
      ],
    },
    {
      label: "이용권",
      category: [
        "상품 문의",
        "이용권 구매",
        "이용권 결제 정보 변경",
        "이용 방법",
        "환불/해지",
      ],
    },
    {
      label: "결제",
      category: ["결제 수단 변경", "결제 실패", "결제 내역/금액 확인"],
    },
    {
      label: "회원 정보",
      category: ["회원 정보 변경", "회원 탈퇴"],
    },
    {
      label: "출입",
      category: [
        "모바일 출입 카드 오류",
        "모바일 출입카드 재발급",
        "출입 방법/시간",
      ],
    },
    {
      label: "라운지 시설",
      category: ["OA(복합기, 사무용품)", "좌석", "BAR(스낵/커피 등)"],
    },
    {
      label: "미팅룸/코워킹룸",
      category: [
        "예약 방법",
        "결제 방법",
        "결제 오류",
        "이용 방법",
        "환불 문의",
        "모니터 연결 방법",
        "시설 관리",
      ],
    },
    {
      label: "스마트 락커",
      category: ["결제 방법", "결제 오류", "이용 방법", "환불 문의"],
    },
    {
      label: "게스트 초대",
      category: [
        "게스트 초대 방법",
        "게스트 초대 예약/결제/가격",
        "게스트 출입/퇴장",
        "게스트 초대 환불",
      ],
    },
    {
      label: "쿠폰",
      category: ["쿠폰 발급 요청", "쿠폰 사용 방법", "쿠폰 등록/사용 오류"],
    },
    {
      label: "기업 고객",
      category: [
        "가입 방법",
        "기업 상품 구매",
        "기업 상품 결제",
        "기업 상품 해지/변경",
        "멤버 초대",
      ],
    },
    {
      label: "기타",
      category: ["웹 서비스 오류/건의", "기타 문의"],
    },
  ];

  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  const [qnaList, setQnaList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const [categoryOptions, setCategoryOptions] = useState([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 기간 검색 datepicker 값 저장 state
  const [regdateStart, setRegdateStart] = useState(undefined);
  const [regdateEnd, setRegdateEnd] = useState(undefined);

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  // 파라미터 state - 초기엔 초기값, 이후엔 바로 직전의 params 저장
  const [params, setParams] = useState({
    status: undefined,
    classification: undefined,
    category: undefined,
    start_date: undefined,
    end_date: undefined,
    page: 1,
    size: PAGE_SIZE,
  });

  const getQnaList = (params) => {
    // 로딩바 세팅
    setLoading(true);

    var config = {
      method: "post",
      url: `${process.env.BACKEND_API}/user/qna/list`,
      headers: {
        Authorization: decodeURIComponent(token),
        "Content-Type": "application/json",
      },
      data: params,
    };

    axios(config)
      .then(function (response) {
        const data = response.data;
        console.log(`qna data`, data);

        // 데이터 바인딩
        setQnaList(data.items);

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

        // 테이블 페이지 변경을 위해 방금 사용한 params 저장
        setParams(params);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인 되어 있지 않으면 홈으로
      Router.push("/");
    }

    // 파라미터 없이 호출
    getQnaList(params);
  }, []);

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination(pagination);

    // 호출
    getQnaList({ ...params, page: pagination.current });
  };

  // 검색 - 유형 1 변경시 유형 2(카테고리 세팅)
  const handleClassificationChange = (value) => {
    const selectedArray = qnaSelectOptions.filter((option) => {
      return option.label === value;
    });

    setCategoryOptions(selectedArray[0].category);
  };

  const handleSearch = () => {
    const searchFormValues = searchForm.getFieldsValue();

    const searchParams = {
      qid: searchFormValues.qid,
      classification: searchFormValues.classification,
      category: searchFormValues.category,
      status: searchFormValues.status,
      start_date: regdateStart,
      end_date: regdateEnd,
      page: 1,
    };

    getQnaList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    setRegdateStart(undefined);
    setRegdateEnd(undefined);

    // params state reset
    const searchParams = {
      qid: undefined,
      classification: undefined,
      category: undefined,
      status: undefined,
      start_date: undefined,
      end_date: undefined,
      page: 1,
    };

    getQnaList({ ...params, ...searchParams });
  };

  return (
    <>
      <h3>문의 관리</h3>

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
        columns={qnaListColumns}
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
          <Form.Item name="qid" label="문의 ID">
            <Input />
          </Form.Item>
          <Form.Item name="classification" label="문의 유형">
            <Select
              style={{ width: 200 }}
              onChange={handleClassificationChange}
            >
              {qnaSelectOptions.map((option) => (
                <Select.Option key={option.label} value={option.label}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="category" label="문의 유형 2">
            <Select style={{ width: 200 }}>
              {categoryOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="처리 상태">
            <Select style={{ width: 200 }}>
              <Select.Option value="wait">대기</Select.Option>
              <Select.Option value="done">해결</Select.Option>
              <Select.Option value="trash">삭제</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="regdate" label="생성 일시">
            <DatePicker
              onChange={(date, dateString) => setRegdateStart(dateString)}
            />
            <DatePicker
              onChange={(date, dateString) => setRegdateEnd(dateString)}
            />
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
