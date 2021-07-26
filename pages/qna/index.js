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
  // 공지 컬럼 정의
  const columns = [
    {
      title: "문의 ID",
      dataIndex: "qid",
    },
    {
      title: "문의 유형",
      dataIndex: "classification",
      render: (text, record) => {
        let renderText = "";

        // console.log(`text`, text);

        switch (text) {
          case "0":
            renderText = "멤버십 상품 문의";
            break;
          case "1":
            renderText = "그룹형(기업형) 상품 문의";
            break;
          case "2":
            renderText = "신청 및 변경";
            break;
          case "3":
            renderText = "결제 관련";
            break;
          case "4":
            renderText = "변경 관련(멤버십 상품 결제 수단,시작일 등)";
            break;
          case "5":
            renderText = "출입 관련";
            break;
          case "6":
            renderText = "종료 및 해지";
            break;
          case "7":
            renderText = "부가서비스(미팅룸, 코워킹룸, 사물함)";
            break;
          case "8":
            renderText = "OA(복합기, 사무용품)";
            break;
          case "9":
            renderText = "기타";
            break;
          default:
            break;
        }

        return renderText;
      },
    },
    {
      title: "카테고리",
      dataIndex: "category",
      render: (text, record) => {
        let renderText = "";

        // console.log(`text`, text);

        switch (text) {
          case "0":
            renderText = "멤버십 상품 문의";
            break;
          case "1":
            renderText = "그룹형(기업형) 상품 문의";
            break;
          case "2":
            renderText = "신청 및 변경";
            break;
          case "3":
            renderText = "결제 관련";
            break;
          case "4":
            renderText = "변경 관련(멤버십 상품 결제 수단,시작일 등)";
            break;
          case "5":
            renderText = "출입 관련";
            break;
          case "6":
            renderText = "종료 및 해지";
            break;
          case "7":
            renderText = "부가서비스(미팅룸, 코워킹룸, 사물함)";
            break;
          case "8":
            renderText = "OA(복합기, 사무용품)";
            break;
          case "9":
            renderText = "기타";
            break;
          default:
            break;
        }

        return renderText;
      },
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

  const { user, isLoggedIn, token } = props.auth;

  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [searchForm] = useForm();

  // 페이지 사이즈
  const PAGE_SIZE = 20;

  // 파라미터 state - 초기엔 초기값, 이후엔 바로 직전의 params 저장
  const [params, setParams] = useState({
    status: null,
    classification: null,
    state: null,
    regdate: null,
    page: 1,
    size: PAGE_SIZE,
  });

  const getNoticeList = (params) => {
    var config = {
      method: "post",
      url: `${process.env.BACKEND_API}/user/qna-list`,
      headers: {
        Authorization: decodeURIComponent(token),
        "Content-Type": "application/json",
      },
      data: params,
    };

    axios(config)
      .then(function (response) {
        const data = response.data;

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
    // 로딩바 세팅
    setLoading(true);

    // 파라미터 없이 호출
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
      qid: searchFormValues.qid,
      classification: searchFormValues.classification,
      state: searchFormValues.state,
      regdate: searchFormValues.regdate
        ? searchFormValues.regdate.format().substring(0, 10)
        : null,
      page: 1,
    };

    getNoticeList({ ...params, ...searchParams });
  };

  const handleReset = () => {
    // form Item reset
    searchForm.resetFields();

    // params state reset
    const searchParams = {
      qid: null,
      classification: null,
      state: null,
      regdate: null,
      page: 1,
    };

    getNoticeList({ ...params, ...searchParams });
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
        onReset={handleReset}
        onSearch={handleSearch}
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
              <Select.Option value={"0"}>멤버십 상품 문의</Select.Option>
              <Select.Option value={"1"}>
                그룹형(기업형) 상품 문의
              </Select.Option>
              <Select.Option value={"2"}>신청 및 변경</Select.Option>
              <Select.Option value={"3"}>결제 관련</Select.Option>
              <Select.Option value={"4"}>
                변경 관련(멤버십 상품 결제 수단,시작일 등)
              </Select.Option>
              <Select.Option value={"5"}>출입 관련</Select.Option>
              <Select.Option value={"6"}>종료 및 해지</Select.Option>
              <Select.Option value={"7"}>
                부가서비스(미팅룸, 코워킹룸, 사물함)
              </Select.Option>
              <Select.Option value={"8"}>OA(복합기, 사무용품)</Select.Option>
              <Select.Option value={"9"}>기타</Select.Option>
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
            <DatePicker />
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
