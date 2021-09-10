import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  DatePicker,
  Select,
  Checkbox,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import moment from "moment";

const radioStyle = {
  display: "inline",
  height: "30px",
  lineHeight: "30px",
};

const BannerDetail = (props) => {
  const { bannerId, token } = props;

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  const [bannerInfo, setBannerInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 배너 Form
  const [bannerForm] = Form.useForm();
  // 상단 띠배너 Form
  const [topBannerForm] = Form.useForm();
  // 하단 띠배너 Form
  const [bottomBannerForm] = Form.useForm();
  // 롤링 배너 Form
  const [swiperBannerForm] = Form.useForm();
  // 팝업 배너 Form
  const [popupBannerForm] = Form.useForm();

  useEffect(() => {
    if (bannerId) {
      // 수정일 경우
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/services/banner/get/${bannerId}`,
          config
        )
        .then(function (response) {
          const bannerInfo = response.data.item;
          setBannerInfo(bannerInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // noticeInfo 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (bannerInfo) {
      console.log(`bannerInfo`, bannerInfo);
      // 이벤트 상태
      bannerForm.setFieldsValue({
        // title: eventInfo.title,
        // path: eventInfo.path,
        // status: eventInfo.status,
        // start_date: moment(eventInfo.start_date),
        // end_date: moment(eventInfo.end_date),
      });

      // 전송용 state에도 세팅
      //   setStartDate(eventInfo.start_date.replace(/\./gi, "-"));
      //   setEndDate(eventInfo.end_date.replace(/\./gi, "-"));
    }
  }, [bannerInfo]);

  // 저장 버튼 클릭
  const handleBannerRegisterSubmit = () => {
    console.log("배너 저장 클릭");
    // const { title, path, status } = bannerForm.getFieldValue();

    // let data = {
    //   title,
    //   path,
    //   status,
    //   start_date: startDate,
    //   end_date: endDate,
    // };

    // let url = "";

    // if (registerMode) {
    //   url = `${process.env.BACKEND_API}/services/events/add`;
    // } else {
    //   url = `${process.env.BACKEND_API}/services/events/update`;
    //   data.event_id = Number(eventId);
    // }

    // const config = {
    //   method: "post",
    //   url: url,
    //   headers: {
    //     Authorization: decodeURIComponent(token),
    //   },
    //   data: data,
    // };

    // axios(config)
    //   .then(function (response) {
    //     if (response.status === 200) {
    //       setOkModalVisible(true);
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  const handleTopBannerRegisterSubmit = () => {
    console.log("상단 배너 저장 클릭");
  };

  const handleBottomBannerRegisterSubmit = () => {
    console.log("하단 배너 저장 클릭");
  };

  const handleSwiperBannerRegisterSubmit = () => {
    console.log("롤링 배너 저장 클릭");
  };

  const handlePopupBannerRegisterSubmit = () => {
    console.log("팝업 배너 저장 클릭");
  };

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  const handlePathChange = (value) => {
    console.log(`value`, value);
  };

  const permissionOptions = [
    {
      label: "비회원",
      value: "guest",
    },
    {
      label: "회원",
      value: "user",
    },
    {
      label: "멤버",
      value: "member",
    },
  ];

  return (
    <>
      <Card
        title={bannerId && bannerId !== null ? `배너 ${bannerId}` : "배너 등록"}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Form
          form={bannerForm}
          onFinish={handleBannerRegisterSubmit}
          initialValues={{ status: "publish" }}
        >
          <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
            <Form.Item name="status" label="활성/비활성">
              <Radio.Group>
                <Radio style={radioStyle} value={"publish"}>
                  활성
                </Radio>
                <Radio style={radioStyle} value={"private"}>
                  비활성
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="path" label="위치">
              <Select style={{ width: 120 }} onChange={handlePathChange}>
                <Select.Option value="home">홈</Select.Option>
                <Select.Option value="spot">이용권</Select.Option>
                <Select.Option value="service">서비스</Select.Option>
                <Select.Option value="mypage">마이페이지</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="permission"
              label="배너 타깃"
              rules={[{ required: true, message: "배너 타깃을 선택해주세요" }]}
            >
              <Checkbox.Group options={permissionOptions} />
            </Form.Item>

            <Form.Item
              name="start_date"
              label="시작일"
              rules={[{ required: true, message: "시작일을 선택해주세요" }]}
            >
              <DatePicker
                placeholder="시작일"
                onChange={handleStartDateChange}
              />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="종료일"
              rules={[{ required: true, message: "종료일을 선택해주세요" }]}
            >
              <DatePicker placeholder="종료일" onChange={handleEndDateChange} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              저장 완료
            </Modal>
          </Card>
        </Form>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>

        <Form
          form={topBannerForm}
          onFinish={handleTopBannerRegisterSubmit}
          initialValues={{ status: "publish" }}
        >
          <Card
            title="상단 띠배너"
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
          >
            <Form.Item name="title" label="제목">
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <Upload name="image" listType="picture-card">
                <Button icon={<UploadOutlined />}>업로드</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="link" label="URL 링크">
              <Input />
              <Checkbox>새 창으로 열기</Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              저장 완료
            </Modal>
          </Card>
        </Form>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        <Form
          form={bottomBannerForm}
          onFinish={handleBottomBannerRegisterSubmit}
          initialValues={{ status: "publish" }}
        >
          <Card
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
            title="하단 띠배너"
          >
            <Form.Item name="title" label="제목">
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <Upload name="image" listType="picture-card">
                <Button icon={<UploadOutlined />}>업로드</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="link" label="URL 링크">
              <Input />
              <Checkbox>새 창으로 열기</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              저장 완료
            </Modal>
          </Card>
        </Form>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        <Form
          form={swiperBannerForm}
          onFinish={handleSwiperBannerRegisterSubmit}
          initialValues={{ status: "publish" }}
        >
          <Card
            title="롤링 배너"
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
          >
            <Form.Item name="title" label="제목">
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <Upload name="image" listType="picture-card">
                <Button icon={<UploadOutlined />}>업로드</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="link" label="URL 링크">
              <Input />
              <Checkbox>새 창으로 열기</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              저장 완료
            </Modal>
          </Card>
        </Form>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        <Form
          form={popupBannerForm}
          onFinish={handlePopupBannerRegisterSubmit}
          initialValues={{ status: "publish" }}
        >
          <Card
            title="팝업 배너"
            bodyStyle={{ padding: "1rem" }}
            className="mb-2"
          >
            <Form.Item name="title" label="제목">
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <Upload name="image" listType="picture-card">
                <Button icon={<UploadOutlined />}>업로드</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="link" label="URL 링크">
              <Input />
              <Checkbox>새 창으로 열기</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => {
                setOkModalVisible(false);
              }}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              저장 완료
            </Modal>
          </Card>
        </Form>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
      </Card>
    </>
  );
};

export default connect((state) => state)(BannerDetail);
