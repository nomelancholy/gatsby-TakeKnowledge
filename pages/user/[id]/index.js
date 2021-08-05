import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  Table,
  Col,
  Pagination,
  Select,
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import axios from "axios";
import { orderListColumns } from "@utils/columns/order";
import { contractListColumns } from "@utils/columns/contract";

const radioStyle = {
  display: "inline",
  height: "30px",
  lineHeight: "30px",
};

const UserDetail = (props) => {
  const router = useRouter();
  // uid
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  // 유저 정보 state
  const [userDetail, setUserDetail] = useState(undefined);
  // 유저 계약 리스트 state
  const [userContractList, setUserContractList] = useState([]);
  // 유저 청구 리스트 state
  const [userOrderList, setUserOrderList] = useState([]);

  // 유저 카드 리스트 state
  const [userCardList, setUserCardList] = useState([]);
  // 선택된 카드 저장 state
  const [selectedCard, setSelectedCard] = useState(undefined);
  // 결제 카드 변경 toggle flag
  const [isCardChangeMode, setIsCardChangeMode] = useState(false);

  // 활성화 된 지점 리스트 state
  const [activeSpotList, setActiveSpotList] = useState(undefined);
  // 선택된 지점 저장 state
  const [selectedSpot, setSelectedSpot] = useState(undefined);
  // 선호하는 지점 변경 toggle flag
  const [isSpotChangeMode, setIsSpotChangeMode] = useState(false);

  // 유저 상품 이용 내역 테이블 페이지, 로딩
  const [userContractPagination, setUserContractPagination] = useState({});
  const [userContractLoading, setUserContractLoading] = useState(false);

  // 유저 청구 내역 테이블 페이징, 로딩
  const [userOrderPagination, setUserOrderPagination] = useState({});
  const [userOrderLoading, setUserOrderLoading] = useState(false);

  // 회원 상태
  const [userStatusForm] = Form.useForm();
  // 그룹 정보
  const [groupForm] = Form.useForm();
  // 회원 정보
  const [userForm] = Form.useForm();

  // 멤버십 이용 내역 / 청구 내역 Grid Page Size
  const PAGE_SIZE = 5;

  // 유저 멤버십 이용 내역 리스트 조회
  const getUserContractList = (params) => {
    setUserContractLoading(true);

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
        setUserContractList(data.items);

        console.log(`user contract data`, data);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setUserContractPagination(pageInfo);

        setUserContractLoading(false);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 유저 청구 내역 조회
  const getUserOrderList = (params) => {
    setUserOrderLoading(true);

    axios
      .post(
        `${process.env.BACKEND_API}/admin/contract/order/list`,
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
        setUserOrderList(data.items);
        console.log(`user order data`, data);

        // 페이지 네이션 정보 세팅
        const pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.size,
        };

        // pageInfo 세팅
        setUserOrderPagination(pageInfo);

        // 로딩바 세팅
        setUserOrderLoading(false);

        // setParams(params);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 유저 카드리스트 조회
  const getUserCardList = (params) => {
    axios
      .post(
        `${process.env.BACKEND_API}/user/card/list`,
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
        if (data.items && data.items.length !== 0) {
          setUserCardList(data.items);
          // 대표 결제 카드가 Select value로 선택되도록 변경
          const mainCard = data.items.filter((card) => {
            if (card.favorite === 1) {
              return card;
            }
          });

          if (mainCard && mainCard.length !== 0) {
            setSelectedCard(mainCard[0].customer_uid);
          }
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 활성화 된 스팟 리스트 조회
  const getActiveSpotList = (params) => {
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
        setActiveSpotList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 대표 결제 카드 변경 버튼 클릭
  const handleCardChange = (value) => {
    setSelectedCard(value);
  };

  // 대표 결제 카드 변경 요청
  const handleCardChangeRequest = () => {
    if (isCardChangeMode) {
      // 대표 결제 카드 변경
      axios
        .post(
          `${process.env.BACKEND_API}/user/card/favorite`,
          {
            uid: id,
            customer_uid: selectedCard,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsCardChangeMode(false);
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setIsCardChangeMode(true);
    }
  };

  // 선호하는 스팟 변경 버튼 클릭
  const handleSpotChange = (value) => {
    setSelectedSpot(value);
  };

  // 선호하는 스팟 변경 요청
  const handleSpotChangeRequest = () => {
    if (isSpotChangeMode) {
      // TO-DO
      // 선호하는 스팟 변경
      axios
        .post(
          `${process.env.BACKEND_API}/user/fav_spot/edit`,
          {
            uid: Number(id),
            spot_id: selectedSpot,
            favorite: 1,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsSpotChangeMode(false);
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setIsSpotChangeMode(true);
    }
  };

  // 상품 이용 내역 테이블 변경
  const handleUserContractTableChange = (pagination) => {
    setUserContractPagination(pagination);

    // 호출
    getUserContractList({
      page: pagination.current,
      size: PAGE_SIZE,
      uid: id,
      contract_type: "membership",
    });
  };

  // 청구 내역 테이블 변경
  const handleUserOrderTableChange = (pagination) => {
    setUserOrderPagination(pagination);

    // 호출
    getUserOrderList({ page: pagination.current, size: PAGE_SIZE, uid: id });
  };
  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // 유저 상세 정보 조회
    const config = {
      headers: {
        Authorization: decodeURIComponent(token),
      },
    };
    axios
      .get(`${process.env.BACKEND_API}/admin/user/get/${id}`, config)
      .then(function (response) {
        const userDetail = response.data.item;
        setUserDetail(userDetail);
      })
      .catch(function (error) {
        console.log(error);
      });

    // 유저 계약 내역 조회
    getUserContractList({
      page: 1,
      size: PAGE_SIZE,
      uid: id,
      contract_type: "membership",
    });
    // 유저 청구 내역 조회
    getUserOrderList({ page: 1, size: PAGE_SIZE, uid: id });

    // 유저 카드리스트 조회
    getUserCardList({ uid: id });

    // 유저 회원 메모 조회
    // getUserMemoHistoryList({ uid: id });
  }, []);

  useEffect(() => {
    // 유저 정보 세팅되면
    if (userDetail) {
      console.log(`userDetail`, userDetail);

      // 회원 상태
      userStatusForm.setFieldsValue({
        // 회원 구분
        has_contract: userDetail.has_contract,
        // 회원 상태
        status: userDetail.user_status,
        // 회원 역할
        user_role_ext: userDetail.user_role_ext,
      });

      let userRoelExt = "";

      switch (userDetail.user_role_ext) {
        case "ffadmin":
          userRoelExt = "파이브스팟 어드민";
          break;
        case "member":
          userRoelExt = "일반";
          break;
        case "group_member":
          userRoelExt = "그룹 멤버";
          break;
        case "group_master":
          userRoelExt = "그룹 관리자 멤버";
          break;
        case "group_admin":
          userRoelExt = "그룹 관리자";
          break;
        default:
          break;
      }

      // 회원 정보
      userForm.setFieldsValue({
        // 회원 ID
        uid: userDetail.uid,
        // 멤버 이름
        user_name: userDetail.user_name,
        // 회원 구분
        has_contract: userDetail.has_contract ? "멤버" : "회원",
        // 회원 역할
        user_role_ext: userRoelExt,
        // 아이디
        user_login: userDetail.user_login,
        // 핸드폰 번호
        phone: userDetail.phone,
        // 생년 월일
        user_birthday: userDetail.user_profile[0].user_birthday,
        // 직무
        job: userDetail.user_profile[0].job,
        // 주소지
        address: userDetail.user_profile[0].address,
        // 상세 주소
        address_etc: userDetail.user_profile[0].address_etc,
      });

      // 선호 지점 옵션으로 사용할 활성화 된 스팟 조회
      getActiveSpotList({ page: 1, size: 100, status: "active" });

      // 2차
      // // 그룹 정보
      // if (userDetail.user_role !== "group") {
      //   groupForm.setFieldsValue({
      //     group: "개인",
      //   });
      // } else {
      //   // 그룹 정보 세팅
      // }

      // 3차
      // 회원 메모
    }
  }, [userDetail]);

  // activeSpotList 불러오면
  useEffect(() => {
    if (activeSpotList) {
      if (userDetail.fav_spot) {
        // 옵션중 세팅된 spot을 선호 스팟으로 세팅
        setSelectedSpot(userDetail.fav_spot.spot_id);
      }
    }
  }, [activeSpotList]);

  /* 3차 회원 메모 관련 

  const handleUserMemoSubmit = (values) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/memo/add`,
        {
          uid: Number(id),
          content: values.content,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          getUserMemoHistoryList({ uid: id });
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  const getUserMemoHistoryList = (params) => {
    axios
      .post(
        `${process.env.BACKEND_API}/admin/user/memo/list`,
        {
          ...params,
        },
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
        setUserMemoHistoryTotal(data.total);
        setUserMemoHistoryList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  회원 메모
  const [userMemoForm] = Form.useForm();

  const [userMemoMinPage, setUserMemoMinPage] = useState(0);
  const [userMemoMaxPage, setUserMemoMaxPage] = useState(1);

  const [userMemoHistoryTotal, setUserMemoHistoryTotal] = useState(1);
  const [userMemoHistoryList, setUserMemoHistoryList] = useState([]);

  const handleUserMemoHistoryChange = (value) => {
    setUserMemoMinPage(value - 1);
    setUserMemoMaxPage(value);
  };
  
  */

  return (
    <>
      <Card
        title={`회원 상세 페이지 | 회원 ID ${id}`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Card>
          <Form form={userStatusForm}>
            <Form.Item name="has_contract" label="회원 구분">
              <Radio.Group disabled>
                <Radio style={radioStyle} value={true}>
                  멤버
                </Radio>
                <Radio style={radioStyle} value={false}>
                  회원
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="status" label="회원 상태">
              <Radio.Group disabled>
                <Radio style={radioStyle} value={"active"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"leave"}>
                  탈퇴
                </Radio>
                <Radio style={radioStyle} value={"sleep"}>
                  휴면
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="user_role_ext" label="회원 역할">
              <Radio.Group disabled>
                <Radio style={radioStyle} value={"group_member"}>
                  그룹 멤버
                </Radio>
                <Radio style={radioStyle} value={"group_admin"}>
                  그룹 관리자
                </Radio>
                <Radio style={radioStyle} value={"group_master"}>
                  그룹 관리자멤버
                </Radio>
                <Radio style={radioStyle} value={"member"}>
                  일반
                </Radio>
                <Radio style={radioStyle} value={"ffadmin"}>
                  파이브스팟 어드민
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
        {/* 2차 */}
        {/* <Card title="그룹 정보">
          <Form form={groupForm} layout="vertical">
            <Form.Item name="group" label="소속 그룹">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_id" label="그룹 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="group_name" label="그룹 명 (법인명)">
              <Input disabled />
            </Form.Item>
            <Form.Item name="number" label="사업자 등록 번호">
              <Input disabled />
            </Form.Item>
            <Form.Item name="address" label="사업자 주소">
              <Input disabled />
            </Form.Item>
            <Form.Item name="pay_demand" label="결제 방식">
              <Input disabled />
            </Form.Item>
            <Form.Item name="card" label="대표 결제 카드">
              <Input disabled />
            </Form.Item>
            <Form.Item name="certification" label="사업자 등록증">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card> */}
        <Card title="회원 정보">
          <Form form={userForm} layout="vertical">
            <Form.Item name="uid" label="회원 ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_name" label="멤버 이름">
              <Input disabled />
            </Form.Item>
            <Form.Item name="has_contract" label="회원 구분">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_role_ext" label="회원 역할">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_login" label="아이디">
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="핸드폰 번호">
              <Input disabled />
            </Form.Item>
            <Form.Item name="user_birthday" label="생년 월일">
              <Input disabled />
            </Form.Item>
            <Form.Item name="job" label="직무">
              <Input disabled />
            </Form.Item>
            <Form.Item name="address" label="주소지">
              <Input disabled />
            </Form.Item>
            <Form.Item name="address_etc" label="상세 주소">
              <Input disabled />
            </Form.Item>
            <Form.Item name="card" label="대표 결제 카드">
              <Select
                value={selectedCard}
                onChange={handleCardChange}
                disabled={!isCardChangeMode}
              >
                {userCardList &&
                  userCardList.length !== 0 &&
                  userCardList.map((card) => (
                    <Select.Option
                      key={card.customer_uid}
                      value={card.customer_uid}
                    >
                      {card.name}
                    </Select.Option>
                  ))}
              </Select>
              <Button type="primary" onClick={handleCardChangeRequest}>
                {isCardChangeMode ? "저장" : "변경"}
              </Button>
              {isCardChangeMode && (
                <Button
                  onClick={() => {
                    setIsCardChangeMode(false);
                  }}
                >
                  취소
                </Button>
              )}
            </Form.Item>
            <Form.Item name="favorite_spot" label="선호 지점">
              <Select
                value={selectedSpot}
                onChange={handleSpotChange}
                disabled={!isSpotChangeMode}
              >
                {activeSpotList &&
                  activeSpotList.length !== 0 &&
                  activeSpotList.map((spot) => (
                    <Select.Option key={spot.spot_id} value={spot.spot_id}>
                      {spot.name}
                    </Select.Option>
                  ))}
              </Select>
              <Button type="primary" onClick={handleSpotChangeRequest}>
                {isSpotChangeMode ? "저장" : "변경"}
              </Button>
              {isSpotChangeMode && (
                <Button
                  onClick={() => {
                    setIsSpotChangeMode(false);
                  }}
                >
                  취소
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>
        <Card title="멤버십 이용 내역">
          <Table
            size="middle"
            columns={contractListColumns}
            rowKey={(record) => record.contract_id}
            dataSource={userContractList}
            pagination={userContractPagination}
            loading={userContractLoading}
            onChange={handleUserContractTableChange}
          />
        </Card>
        <Card title="청구 내역">
          <Table
            size="middle"
            columns={orderListColumns}
            rowKey={(record) => record.order_id}
            dataSource={userOrderList}
            pagination={userOrderPagination}
            loading={userOrderLoading}
            onChange={handleUserOrderTableChange}
          />
        </Card>
        {/* 3차 */}
        {/* <Col>
          <Card
            title={`회원 메모`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={userMemoForm}
              layout="vertical"
              onFinish={handleUserMemoSubmit}
            >
              <Form.Item name="content">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form>
          </Card>

          {userMemoHistoryList
            .slice(userMemoMinPage, userMemoMaxPage)
            .map((memo) => (
              <Card
                title={`회원 메모 히스토리`}
                bodyStyle={{ padding: "1rem" }}
                className="mb-4"
              >
                <Input disabled value={memo.content} />
              </Card>
            ))}

          <Pagination
            onChange={handleUserMemoHistoryChange}
            defaultCurrent={1}
            defaultPageSize={1}
            total={userMemoHistoryTotal}
          />
        </Col>*/}
      </Card>
      <Row type="flex" align="middle" className="py-4">
        <span className="px-2 w-10"></span>
      </Row>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(UserDetail);
