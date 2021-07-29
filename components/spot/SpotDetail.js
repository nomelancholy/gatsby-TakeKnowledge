import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import NextHead from "next/head";
import Space from "./Space";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const SpotDetail = (props) => {
  const { spotId } = props;
  const { token } = props.auth;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // spot 관련 state
  const [spotInfo, setSpotInfo] = useState(undefined);
  const [status, setStatus] = useState(true);
  const [property, setProperty] = useState(true);
  const [generatedSpotId, setGeneratedSpotId] = useState(undefined);

  // file 관련 state
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [okModalVisible, setOkModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 시설정보 checkbox 옵션
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

  useEffect(() => {
    if (spotId) {
      setRegisterMode(false);

      axios
        .get(`${process.env.BACKEND_API}/admin/spot/get/${spotId}`, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        })
        .then((response) => {
          const spotData = response.data;
          console.log(`spotData`, spotData);
          setSpotInfo(spotData);
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // spotData 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (spotInfo) {
      form.setFieldsValue({
        status: spotInfo.status,
        name: spotInfo.name,
        spot_id: spotInfo.spot_id,
        nickname: spotInfo.nickname,
        address: spotInfo.address,
        address_etc: spotInfo.address_etc,
        operation_time: spotInfo.operation_time,
        seat_capacity: spotInfo.seat_capacity,
        content: spotInfo.content,
        property: spotInfo.property,
        max_seat_capacity: Math.floor(spotInfo.seat_capacity * 1.5),
      });

      // 시설 정보 binding
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

      if (spotInfo.images) {
        // 이미지 추가되면 작업 필요
        // images.map({});
        // setFileList();
      }
    }
  }, [spotInfo]);

  // 저장 버튼 클릭
  const handleSpotRegisterSubmit = (values) => {
    // 전체 시설 정보
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
    // 선택한 시설 정보
    const validFacilityInfos = values.facilityInfos;

    // 객체 생성
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

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("nickname", values.nickname);
    formData.append("property", values.property);
    formData.append("status", values.status);
    formData.append("address", values.address);
    formData.append("address_etc", values.address_etc);
    formData.append("content", values.content);
    formData.append("operation_time", values.operation_time);
    formData.append("seat_capacity", values.seat_capacity);
    formData.append("excerpt", JSON.stringify(excerpt));

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        formData.append(`image${index + 1}`, image.originFileObj);
      });
    }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/spot/add`;
    } else {
      formData.append("spot_id", spotId);
      url = `${process.env.BACKEND_API}/admin/spot/update`;
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: formData,
    };

    axios(config)
      .then(function (response) {
        setOkModalVisible(true);
        if (registerMode) {
          setGeneratedSpotId(response.data.item.spot_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFileChange = ({ fileList }) => {
    console.log(`fileList`, fileList);
    form.setFieldsValue({ images: fileList });
    setFileList(fileList);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  const handleSeatCapacityChange = (seat_capacity) => {
    form.setFieldsValue({
      max_seat_capacity: Math.floor(seat_capacity * 1.5),
    });
  };

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
        // 상세 주소 포커스
        userAddressEtcRef.current.focus();
      },
    }).open();
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
            extra={<a onClick={() => router.back()}>뒤로 가기</a>}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSpotRegisterSubmit}
            >
              <Form.Item name="status" label="스팟 활성 / 비활성">
                <Radio.Group onChange={handleStatusChange} value={status}>
                  <Radio style={radioStyle} value={"active"}>
                    활성
                  </Radio>
                  <Radio style={radioStyle} value={"inactive"}>
                    비활성
                  </Radio>
                  <Radio style={radioStyle} value={"trash"}>
                    삭제
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="name" label="스팟 명" initialValue="신규">
                <Input />
              </Form.Item>
              {registerMode ? null : (
                <Form.Item name="spot_id" label="스팟 ID">
                  <InputNumber min={1} disabled={true} />
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
                <InputNumber onChange={handleSeatCapacityChange} />
              </Form.Item>
              <Form.Item name="max_seat_capacity" label="최대 인원">
                <InputNumber disabled={true} />
              </Form.Item>
              <Form.Item
                name="images"
                label="대표 이미지 (최대 5장까지 첨부 가능)"
              >
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
                  <Radio style={radioStyle} value={"fivespot"}>
                    전용
                  </Radio>
                  <Radio style={radioStyle} value={"fastfive"}>
                    공용
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                저장
              </Button>
            </Form>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => setOkModalVisible(false)}
            >
              스팟 등록 완료
            </Modal>
          </Card>
          {/* 공간 정보 */}
          {(spotId || generatedSpotId) && spotInfo && (
            <>
              <Space
                key="lounge"
                type="lounge"
                spotId={spotId ? spotId : generatedSpotId}
                desc={spotInfo.lounge_desc}
                images={spotInfo.lounge_image}
              />
              <Space
                key="meeting"
                type="meeting"
                spotId={spotId ? spotId : generatedSpotId}
                desc={spotInfo.meeting_desc}
                images={spotInfo.meeting_image}
              />
              <Space
                key="coworking"
                type="coworking"
                spotId={spotId ? spotId : generatedSpotId}
                desc={spotInfo.coworking_desc}
                images={spotInfo.coworking_image}
              />
              {/* <Space
                key="locker"
                type="locker"
                spotId={spotId ? spotId : generatedSpotId}
                desc={spotInfo.locker_desc}
                images={spotInfo.locker_image}
              /> */}
            </>
          )}

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

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpotDetail);
