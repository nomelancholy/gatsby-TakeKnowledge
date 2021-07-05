import { Button, Table, Form, Input, Row, Select, Modal } from "antd";
import { SlidersOutlined, SearchOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

const Spot = () => {
  const columns = [
    {
      title: "스팟 ID",
      dataIndex: "spot_id",
    },
    {
      title: "스팟명",
      dataIndex: "name",
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
      dataIndex: "email",
    },
    {
      title: "미팅룸",
      dataIndex: "email",
    },
    {
      title: "코워킹 룸",
      dataIndex: "email",
    },
    {
      title: "락커",
      dataIndex: "email",
    },
    {
      title: "활성/비활성",
      dataIndex: "status",
    },
    {
      title: "생성 일시",
      dataIndex: "email",
    },
  ];

  const [spots, setSpots] = useState([]);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [form] = Form.useForm();

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

  let spotList = [];

  const getSpotList = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.BACKEND_API}/spot/list`,
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
        console.log(`spots`, data.items);
        setPagination({ ...pagination, total: 200 });
        setSpots(data.items);
        // setData(data.items);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    getSpotList();
  }, []);

  const getSpace = (spot) => {
    const spaceList = ["lounge", "meeting", "coworking"];
    let lounge = undefined;
    let meeting = undefined;
    let coworking = undefined;

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
              lounge = { ...{}, data: response.data };
              console.log(`lounge`, lounge);
              break;
            case "meeting":
              meeting = { ...{}, data: response.data };
              console.log(`meeting`, meeting);
              break;
            case "coworking":
              coworking = { ...{}, data: response.data };
              console.log(`coworking`, coworking);
            default:
              break;
          }
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    });
    console.log(`lounge`, lounge);
    console.log(`meeting`, meeting);
    console.log(`coworking`, coworking);
    const obj = {
      ...spot,
      status: spot.status === "active" ? "활성" : "비활성",
      lounge: lounge,
      meeting: meeting,
      coworking: coworking,
    };
    console.log("obj", obj);
    spotList.push(obj);
  };

  useEffect(() => {
    if (spots) {
      async function addSpace() {
        await Promise.all(
          spots.map((spot) => {
            getSpace(spot);
          })
        );
      }

      addSpace();
      console.log(`spotList`, spotList);
      setData(spotList);
    }
  }, [spots]);

  useEffect(() => {
    if (data) {
      setLoading(false);
      console.log(`data`, data);
    }
  }, [data]);

  const handleGroupTypeChange = (value) => {
    console.log(value);
    form.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  };

  const handlePaymentTypeChange = (value) => {
    console.log(value);
    form.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  };

  return (
    <>
      <h3>스팟 관리</h3>

      <Row type="flex" align="middle" className="py-4">
        {/* <Button type="primary">
          <SearchOutlined></SearchOutlined>검색
        </Button> */}
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
            setRegistrationModalOpen(true);
          }}
        >
          + 등록
        </Button>
      </Row>

      <Table
        columns={columns}
        rowKey={(record) => record.spot_id}
        dataSource={data}
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
      {/* 등록 모달 */}
      <Modal
        visible={registrationModalOpen}
        title="그룹 등록"
        okText="등록"
        cancelText="취소"
        onCancel={() => {
          setRegistrationModalOpen(false);
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
          <Form.Item
            name="그룹 유형"
            label="그룹 유형"
            rules={[
              { required: true, message: "그룹 유형은 필수 선택 사항입니다." },
            ]}
          >
            <Select
              placeholder="그룹 유형을 선택해주세요"
              onChange={handleGroupTypeChange}
            >
              <Select.Option value="male">개인 사업자</Select.Option>
              <Select.Option value="female">법인</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="그룹명"
            label="그룹명"
            rules={[
              {
                required: true,
                message: "그룹명은 필수 입력 사항입니다.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="결제수단 선택"
            label="결제수단 선택"
            rules={[
              {
                required: true,
                message: "결제 수단은은 필수 선택 사항입니다.",
              },
            ]}
          >
            <Select
              placeholder="결제수단 선택"
              onChange={handlePaymentTypeChange}
            >
              <Select.Option value="male">카드</Select.Option>
              <Select.Option value="female">계좌이체</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default connect((state) => state)(Spot);
