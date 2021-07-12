import { Button, Table, Form, Input, Row, Modal } from "antd";
import { SlidersOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const Spot = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, []);

  // Grid Column 정의
  const columns = [
    {
      title: "스팟 ID",
      dataIndex: "spot_id",
    },
    {
      title: "스팟명",
      dataIndex: "name",
      render: (text, record) => {
        return <a href={`/spot/${record.spot_id}`}>{text}</a>;
      },
    },
    {
      title: "좌석 수",
      dataIndex: "seat_capacity",
    },
    {
      title: "최대 허용 수",
      dataIndex: "seat_limit",
    },
    {
      title: "라운지",
      dataIndex: "loungeCnt",
    },
    {
      title: "미팅룸",
      dataIndex: "meetingCnt",
    },
    {
      title: "코워킹 룸",
      dataIndex: "coworkingCnt",
    },
    {
      title: "락커",
      dataIndex: "lockerCnt",
    },
    {
      title: "활성/비활성",
      dataIndex: "status",
      render: (text) => {
        return text === "active" ? "활성" : "비활성";
      },
    },
    {
      title: "생성 일시",
      dataIndex: "email",
    },
  ];

  // 조회해온 spot list
  const [spotList, setSpotList] = useState([]);

  // space count 추가된 spot list
  const [spotData, setSpotData] = useState([]);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(2);

    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  useEffect(() => {
    getSpotList();
  }, []);

  // spot list 조회
  const getSpotList = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        {},
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setPagination({ ...pagination, total: 200 });
        setSpotList(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // spot list 조회 완료 후 spot 별 space 조회해서 spot에 추가
  useEffect(() => {
    let completeSpotList = [];

    const setCompleteSpotData = async () => {
      completeSpotList = await Promise.all(
        spotList.map((spot) => {
          return getSpotWithSpaceCount(spot);
        })
      );
      setSpotData(completeSpotList);
    };

    if (spotList) {
      setCompleteSpotData();
    }
  }, [spotList]);

  // spot 별 space count 추가
  const getSpotWithSpaceCount = async (spot) => {
    const spaceList = ["lounge", "meeting", "coworking", "locker"];

    let lounge = undefined;
    let meeting = undefined;
    let coworking = undefined;
    let locker = undefined;

    await Promise.all(
      spaceList.map(async (space) => {
        await axios
          .post(
            `${process.env.BACKEND_API}/spot/space/list`,
            {
              spot_id: spot.spot_id,
              type: space,
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                Authorization:
                  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
              },
            }
          )
          .then((response) => {
            switch (space) {
              case "lounge":
                lounge = { ...{}, ...response.data };
                break;
              case "meeting":
                meeting = { ...{}, ...response.data };
                break;
              case "coworking":
                coworking = { ...{}, ...response.data };
              case "locker":
                locker = { ...{}, ...response.data };
              default:
                break;
            }
          })
          .catch((error) => {
            console.log(`error`, error);
          });
      })
    );

    const completeSpotObj = {
      ...spot,
      loungeCnt: lounge.total,
      meetingCnt: meeting.total,
      coworkingCnt: coworking.total,
      lockerCnt: locker.total,
    };
    return completeSpotObj;
  };

  useEffect(() => {
    if (spotData) {
      setLoading(false);
    }
  }, [spotData]);

  return (
    <>
      <h3>스팟 관리</h3>

      <Row type="flex" align="middle" className="py-4">
        <Button
          type="primary"
          onClick={() => {
            setFilterModalOpen(true);
          }}
        >
          <SlidersOutlined></SlidersOutlined>필터
        </Button>
        <span className="px-2 w-10"></span>
        <Button
          type="primary"
          onClick={() => {
            Router.push(`/spot/new`);
          }}
        >
          + 등록
        </Button>
      </Row>

      <Table
        columns={columns}
        rowKey={(record) => record.spot_id}
        dataSource={spotData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      {/* 필터 모달 */}
      <Modal
        visible={filterModalOpen}
        title="검색 항목"
        okText="검색"
        cancelText="취소"
        onCancel={() => {
          setFilterModalOpen(false);
        }}
        onOk={
          () => {
            console.log(`onOk`);
          }
          //     () => {
          //   form
          //     .validateFields()
          //     .then((values) => {
          //       form.resetFields();
          //       onCreate(values);
          //     })
          //     .catch((info) => {
          //       console.log("Validate Failed:", info);
          //     });
          // }
        }
      >
        <Form
          // form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="그룹 ID" label="그룹 ID">
            <Input />
          </Form.Item>
          <Form.Item name="그룹명" label="그룹명">
            <Input />
          </Form.Item>
          <Form.Item name="회원 상태" label="회원 상태">
            <Input />
          </Form.Item>
          <Form.Item name="활성/휴면 여부" label="활성/휴면 여부">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Spot);
