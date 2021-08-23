import {
  Button,
  Table,
  Form,
  Input,
  Row,
  Select,
  Card,
  Upload,
  Modal,
} from "antd";
import { SlidersOutlined, UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { Filter } from "@components/elements";
import { useForm } from "antd/lib/form/Form";
import { userListColumns } from "@utils/columns/user";
import XLSX from "xlsx";
import moment from "moment";
import { ReadStream } from "fs";

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

  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);

  // 검색 필터 Modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  // 검색 Form
  const [searchForm] = useForm();

  const [params, setParams] = useState({
    user_name: undefined,
    has_contract: undefined,
    user_role_ext: undefined,
    status: undefined,
    registed_card: undefined,
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

  // 테이블 페이지 변경시
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      size: pagination.pageSize,
      pageSize: 20,
    });

    // 호출
    getUserList({
      ...params,
      page: pagination.current,
      size: pagination.pageSize,
    });
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    const { user_name, has_contract, user_role_ext, status, registed_card } =
      searchForm.getFieldsValue();

    setPagination({
      page: 1,
      size: 20,
      pageSize: 20,
    });

    const searchParams = {
      user_name: user_name,
      has_contract: has_contract,
      user_role_ext: user_role_ext,
      status: status,
      registed_card: registed_card,
      page: 1,
      size: 20,
    };

    getUserList({ ...params, ...searchParams });
  };

  // 초기화 버튼 클릭
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
      user_name: undefined,
      has_contract: undefined,
      user_role_ext: undefined,
      status: undefined,
      registed_card: undefined,
      page: 1,
      size: 20,
    };

    getUserList({ ...params, ...searchParams });
  };

  useEffect(() => {
    getUserList(pagination);
  }, []);

  // 엑셀 관련 테스트

  const [excelUploadModalVisible, setExcelUploadModalVisible] = useState(false);

  const excelUpload = (event) => {
    console.log("upload 클릭");

    console.log(`event.file.originFileObj`, event.file.originFileObj);

    const fileReader = new FileReader();

    fileReader.readAsBinaryString(event.file.originFileObj);

    fileReader.onload = () => {
      const data = fileReader.result;
      const workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.map((sheetName) => {
        console.log(`sheetName`, sheetName);
        const rowObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(`rowObj`, rowObj);
      });
    };
  };

  const excelDownload = () => {
    // userList 길이가 0일 경우 early return
    if (userList.length === 0) {
      return;
    }

    const colums = ["회원 ID", "회원 명", "회원 구분", "회원 역할"];

    // userList = 객체 들을 담은 배열
    // XLSX.aoa_to_sheet에서 필요로 하는 건 배열들을 담은 배열
    // 변환 작업

    let excelData = [colums];

    userList.map((userData) => {
      const dataSheet = [];
      dataSheet.push(userData.uid);
      dataSheet.push(userData.user_name);

      let hasContract = userData.has_contract ? "멤버" : "회원";
      dataSheet.push(hasContract);

      let userRoleExt = "";

      switch (userData.user_role_ext) {
        case "ffadmin":
          userRoleExt = "파이브스팟 어드민";
          break;
        case "member":
          userRoleExt = "일반";
          break;
        case "group_member":
          userRoleExt = "그룹 멤버";
          break;
        case "group_master":
          userRoleExt = "그룹 관리자 멤버";
          break;
        case "group_admin":
          userRoleExt = "그룹 관리자";
          break;
        default:
          break;
      }
      dataSheet.push(userRoleExt);

      excelData.push(dataSheet);
    });

    // 합치고

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet);

    // 제목에 넣을 날짜 변환해서
    const nowDate = moment(new Date()).format("YYYY-MM-DD");

    // export
    XLSX.writeFile(workbook, `회원 목록 ${nowDate}.xlsx`);
  };

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
      <Card
        title="엑셀 테스트 카드"
        extra={
          <>
            <Button
              onClick={() => {
                setExcelUploadModalVisible(true);
              }}
            >
              엑셀 업로드
            </Button>
            <Button onClick={excelDownload}>엑셀 다운로드</Button>
          </>
        }
      >
        <Table
          size="middle"
          columns={userListColumns}
          rowKey={(record) => record.uid}
          dataSource={userList}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
        <Modal
          visible={excelUploadModalVisible}
          onCancel={() => {
            setExcelUploadModalVisible(false);
          }}
        >
          <Upload onChange={excelUpload}>
            <Button icon={<UploadOutlined />}>엑셀 업로드</Button>
          </Upload>
        </Modal>
      </Card>
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
