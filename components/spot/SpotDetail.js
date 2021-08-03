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
import { isOrdered } from "immutable";

const radioStyle = {
  display: "inline",
  height: "30px",
  lineHeight: "30px",
};

const SpotDetail = (props) => {
  const { spotId } = props;
  const { token } = props.auth;

  const router = useRouter();

  // spot 관련 state
  const [spotInfo, setSpotInfo] = useState(undefined);
  // file 관련 state

  const [fileList, setFileList] = useState([]);
  const [removedFileList, setRemovedFileList] = useState([]);
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
          setSpotInfo(spotData);
        })
        .catch((error) => {
          console.log(`error`, error);
        });
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

      // 이미지 파일 세팅
      if (spotInfo.images) {
        const spotImages = [];

        spotInfo.images.map((image) => {
          if (image.image_key.startsWith("image")) {
            const newObj = {
              thumbUrl: image.image_path,
              image_key: image.image_key,
            };

            spotImages.push(newObj);
          }
        });

        setFileList(spotImages);
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

    formData.append("spot_id", spotId);
    formData.append("name", values.name);
    if (values.nickname) {
      formData.append("nickname", values.nickname);
    }

    formData.append("property", values.property);
    formData.append("status", values.status);
    formData.append("address", values.address);
    formData.append("address_etc", values.address_etc);
    if (values.content) {
      formData.append("content", values.content);
    }

    formData.append("operation_time", values.operation_time);
    formData.append("seat_capacity", values.seat_capacity);
    formData.append("excerpt", JSON.stringify(excerpt));

    // formData 확인
    // for (let key of formData.keys()) {
    //   console.log(key);
    // }

    // for (let value of formData.values()) {
    //   console.log(value);
    // }

    if (removedFileList.length > 0) {
      formData.append("del_images", JSON.stringify(removedFileList));
    }

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        // image_key가 있는 파일은 이미 서버에 등록되어 있기 때문에 제외
        if (!image.image_key) {
          formData.append(`image${index + 1}`, image.originFileObj);
        }
      });
    }

    const url = `${process.env.BACKEND_API}/admin/spot/update`;

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
        if (response.status === 200) {
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFileChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setFileList([...fileList, file]);
      form.setFieldsValue({ images: [...fileList, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = fileList.filter((fileObj) => fileObj !== file);
      setFileList(newFileList);
      form.setFieldsValue({ images: newFileList });

      if (file.image_key) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const newRemovedFileList = [...removedFileList, file.image_key];
        setRemovedFileList(newRemovedFileList);
      }
    }
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
                <Radio.Group>
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
              <Form.Item
                name="name"
                label="스팟 명"
                rules={[
                  { required: true, message: "스팟명은 필수 입력 사항입니다" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="spot_id" label="스팟 ID">
                <InputNumber min={1} disabled={true} />
              </Form.Item>
              <Form.Item name="nickname" label="스팟 별칭">
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="주소"
                rules={[
                  { required: true, message: "주소는 필수 입력 사항입니다" },
                ]}
              >
                <Input onClick={showAddressPopup} />
              </Form.Item>
              <Form.Item
                name="address_etc"
                label="상세 주소"
                rules={[
                  {
                    required: true,
                    message: "상세 주소는 필수 입력 사항입니다",
                  },
                ]}
              >
                <Input ref={userAddressEtcRef} />
              </Form.Item>
              <Form.Item
                name="operation_time"
                label="운영 시간"
                rules={[
                  {
                    required: true,
                    message: "운영 시간은 필수 입력 사항입니다",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="seat_capacity" label="인원">
                <InputNumber
                  min={0}
                  defaultValue={0}
                  onChange={handleSeatCapacityChange}
                />
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
                <Radio.Group>
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
              onCancel={() => setOkModalVisible(false)}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              스팟 수정 완료
            </Modal>
          </Card>
          {/* 공간 정보 */}
          {spotId && spotInfo && (
            <>
              <Space
                key="lounge"
                type="lounge"
                spotId={spotId}
                desc={spotInfo.lounge_desc}
                images={spotInfo.images}
              />
              <Space
                key="meeting"
                type="meeting"
                spotId={spotId}
                desc={spotInfo.meeting_desc}
                images={spotInfo.images}
              />
              <Space
                key="coworking"
                type="coworking"
                spotId={spotId}
                desc={spotInfo.coworking_desc}
                images={spotInfo.images}
              />
              {/* <Space
                key="locker"
                type="locker"
                spotId={spotId}
                desc={spotInfo.locker_desc}
                images={spotInfo.images}
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
