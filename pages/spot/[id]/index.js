import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { Component, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Router, { useRouter } from "next/router";
import NextHead from "next/head";

const Detail = () => {
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();
  const { id } = router.query;
  const [status, setStatus] = useState(true);
  const [property, setProperty] = useState(true);
  const [spotPostcode, setSpotPostcode] = useState("");
  const [registerMode, setRegisterMode] = useState(true);

  const [spotInfo, setSpotInfo] = useState(undefined);

  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (id === "new") {
      setRegisterMode(true);
    } else {
      setRegisterMode(false);
      axios
        .post(
          `${process.env.BACKEND_API}/spot/get`,
          { spot_id: id },
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
          console.log(`data`, data);
          setSpotInfo(data);
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    }
  }, []);

  useEffect(() => {
    if (spotInfo) {
      form.setFieldsValue({
        status: spotInfo.status === "active" ? true : false,
        name: spotInfo.name,
        spot_id: spotInfo.spot_id,
        nickname: spotInfo.nickname,
        address: spotInfo.address,
        address_etc: spotInfo.address_etc,
        operation_time: spotInfo.operation_time,
        seat_capacity: spotInfo.seat_capacity,
        content: spotInfo.content,
        // facilityInfos: spotInfo.excerpt,
        property: spotInfo.property === "fivespot" ? true : false,
      });

      if (spotInfo.images) {
        // 이미지 작업 필요
      }

      let checkExcerpt = [];

      if (spotInfo.excerpt) {
        Object.entries(spotInfo.excerpt).filter((obj) => {
          if (obj[1]) {
            checkExcerpt.push(obj[0]);
          }
        });

        form.setFieldsValue({
          facilityInfos: checkExcerpt,
        });
      }
    }
  }, [spotInfo]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePropertyChange = (e) => {
    setProperty(e.target.value);
  };

  const userAddressEtcRef = useRef(null);

  // 주소 팝업
  const showAddressPopup = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.(R:도로명,J:지번)
        form.setFieldsValue({
          address:
            data.userSelectedType === "R"
              ? data.roadAddress
              : data.jibunAddress,
        });
        // 우편번호
        setSpotPostcode(data.zonecode);
        // 상세 주소 포커스
        userAddressEtcRef.current.focus();
      },
    }).open();
  };

  const facilityInfoOptions = [
    { label: "라운지", value: "lounge" },
    { label: "미팅룸", value: "meeting" },
    { label: "코워킹룸", value: "coworking" },
    { label: "QA존", value: "qa" },
    { label: "스마트락커", value: "locker" },
    { label: "F&B바", value: "fb" },
    { label: "무인편의점", value: "unmanned" },
    { label: "폰부스", value: "phone" },
  ];

  const handleSpotRegisterSubmit = (values) => {
    console.log(`values`, values);

    // 시설 정보
    const facilityInfos = [
      "lounge",
      "meeting",
      "coworking",
      "qa",
      "locker",
      "fb",
      "unmanned",
      "phone",
    ];

    const validFacilityInfos = values.facilityInfos;

    let excerpt = {};
    if (validFacilityInfos) {
      facilityInfos.map((facilityInfo) => {
        if (validFacilityInfos.includes(facilityInfo)) {
          excerpt[facilityInfo] = true;
        } else {
          excerpt[facilityInfo] = false;
        }
      });
    }

    console.log(`excerpt`, excerpt);
    // 파이브스팟 전용, 공용
    const property = values.property ? "fivespot" : "fastfive";

    // 스팟 활성 / 비활성
    const status = values.status ? "active" : "inactive";
    // 삭제는 trash

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("nickname", values.nickname);
    formData.append("property", property);
    formData.append("status", status);
    formData.append("address", values.address);
    formData.append("address_etc", values.address_etc);
    formData.append("content", values.content);
    formData.append("operation_time", values.operation_time);
    formData.append("seat_capacity", values.seat_capacity);
    formData.append("excerpt", JSON.stringify(excerpt));

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        // console.log(`image`, image);
        // console.log(`JSON.stringify(image)`, JSON.stringify(image));
        // console.log(`image.originFileObj`, image.originFileObj);
        // console.log(
        //   `JSON.stringify(image.originFileObj)`,
        //   JSON.stringify(image.originFileObj)
        // );
        // formData.append(`image${index + 1}`, JSON.stringify(image.originFileObj));
        formData.append(`image${index + 1}`, image.originFileObj);
      });
    }

    // formData의 key 확인
    for (let key of formData.keys()) {
      console.log("key", key);
    }

    // FormData의 value 확인
    for (let value of formData.values()) {
      console.log("value", value);
    }

    let config = {};

    if (registerMode) {
      config = {
        method: "post",
        url: "http://3.34.133.211:8000/api/v1/admin/spot/add",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
        },
        data: formData,
      };
    } else {
      formData.append("spot_id", id);
      config = {
        method: "post",
        url: "http://3.34.133.211:8000/api/v1/admin/spot/update",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
        },
        data: formData,
      };
    }
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFileChange = ({ fileList }) => {
    form.setFieldsValue({ images: fileList });
    setFileList(fileList);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  return (
    <>
      <NextHead>
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </NextHead>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="스팟 상세" key="1">
          <Card
            title="스팟 정보"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form form={form} onFinish={handleSpotRegisterSubmit}>
              <Form.Item name="status" label="스팟 활성 / 비활성">
                <Radio.Group onChange={handleStatusChange} value={status}>
                  <Radio style={radioStyle} value={true}>
                    활성
                  </Radio>
                  <Radio style={radioStyle} value={false}>
                    비활성
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="name" label="스팟 명" initialValue="신규">
                <Input />
              </Form.Item>
              {registerMode ? null : (
                <Form.Item name="spot_id" label="스팟 ID">
                  <InputNumber min={1} />
                </Form.Item>
              )}

              <Form.Item name="nickname" label="스팟 별칭">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="주소">
                <Input onFocus={showAddressPopup} />
              </Form.Item>
              <Form.Item name="address_etc" label="상세 주소">
                <Input ref={userAddressEtcRef} />
              </Form.Item>
              <Form.Item
                name="operation_time"
                label="운영 시간"
                initialValue="연중무휴, 24시간"
              >
                <Input />
              </Form.Item>
              <Form.Item name="seat_capacity" label="인원">
                <Input />
              </Form.Item>
              <Form.Item name="images" label="대표 이미지">
                <Upload
                  name="image"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
                  onPreview={handlePreview}
                >
                  {fileList.length < 5 ? (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  ) : null}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => {
                    setPreviewVisible(false);
                  }}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
              <Form.Item name="content" label="설명">
                <Input.TextArea rows={4}></Input.TextArea>
              </Form.Item>
              <Form.Item name="facilityInfos" label="시설 정보">
                <Checkbox.Group options={facilityInfoOptions} />
              </Form.Item>
              <Form.Item name="property" label="파이브스팟 전용">
                <Radio.Group onChange={handlePropertyChange} value={property}>
                  <Radio style={radioStyle} value={true}>
                    전용
                  </Radio>
                  <Radio style={radioStyle} value={false}>
                    공용
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form>
          </Card>
          <Card title="라운지" bodyStyle={{ padding: "1rem" }} className="mb-4">
            <Form>
              <Form.Item name="대표 이미지" label="대표 이미지">
                <Input placeholder="신규" />
              </Form.Item>
              <Form.Item name="설명" label="설명">
                <Input placeholder="신규" />
              </Form.Item>
              <Form.Item name="라운지 리스트" label="라운지 리스트">
                <Input placeholder="신규" />
              </Form.Item>
            </Form>
          </Card>
          <Card
            title="미팅룸"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Card
            title="코워킹룸"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Card
            title="락커"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
          <Row type="flex" align="middle" className="py-4">
            <span className="px-2 w-10"></span>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="히스토리" key="2">
          <Card
            title="변경 히스토리"
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          ></Card>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default connect((state) => state)(Detail);
