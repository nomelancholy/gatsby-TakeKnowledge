import {
  Button,
  Form,
  Input,
  InputNumber,
  Col,
  Modal,
  Card,
  Radio,
  Upload,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const SpaceCard = (props) => {
  const { user, isLoggedIn, token } = props.auth;
  const { spaceInfo, title, spotId, type, handleSpaceDeleted } = props;

  // 등록 수정 flag state
  const [isNew, setIsNew] = useState(false);

  // options state
  const [settingSpaceOptions, setSettingSpaceOptions] = useState([]);
  const [validSpaceOptions, setValidSpaceOptions] = useState([]);

  // 파일 관련 state
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [removedFileList, setRemovedFileList] = useState([]);

  // 모달 관련 state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 라디오 state
  const [property, setProperty] = useState("");

  const [form] = useForm();

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  // options samples
  const lounge_options = [
    { label: "컴포트 시트", value: "comport" },
    { label: "오픈 시트", value: "open" },
    { label: "포커스 시트", value: "focus" },
  ];
  const meeting_options = [
    { label: "보드", value: "board" },
    { label: "TV", value: "tv" },
    { label: "HDMI", value: "hdmi" },
    { label: "멀티탭", value: "multitab" },
  ];
  const cowork_options = [{ label: "멀티탭", value: "multitab" }];

  const lounge_option_array = ["comport", "open", "focus"];
  const meeting_option_array = ["board", "tv", "hdmi", "multitab"];
  const coworkt_option_array = ["multitab"];

  useEffect(() => {
    // 공간 타입별로 옵션 다르게 설정
    switch (type) {
      case "lounge":
        setSettingSpaceOptions(lounge_options);
        setValidSpaceOptions(lounge_option_array);
        break;
      case "meeting":
        setSettingSpaceOptions(meeting_options);
        setValidSpaceOptions(meeting_option_array);
        break;
      case "coworking":
        setSettingSpaceOptions(cowork_options);
        setValidSpaceOptions(coworkt_option_array);
        break;
      default:
        break;
    }
    // 객체가 있을 경우 필드 세팅
    if (Object.keys(spaceInfo).length !== 0) {
      if (spaceInfo.images) {
        const spaceImages = [];

        spaceInfo.images.map((image) => {
          const newObj = {
            thumbUrl: image.image_path,
            image_key: image.image_key,
          };

          spaceImages.push(newObj);
        });

        setFileList(spaceImages);
      }

      form.setFieldsValue({
        images: spaceInfo.images,
        property: spaceInfo.space.property,
        name: spaceInfo.space.name,
        seat_capacity: spaceInfo.space.seat_capacity,
        max_seat_capacity: spaceInfo.space.seat_limit,
        floor: spaceInfo.space.floor,
      });

      let checkOptions = [];

      if (spaceInfo.space.options) {
        Object.entries(spaceInfo.space.options).filter((obj) => {
          if (obj[1]) {
            checkOptions.push(obj[0]);
          }
        });

        form.setFieldsValue({
          options: checkOptions,
        });
      }

      setIsNew(false);
    } else {
      setIsNew(true);
    }
  }, []);

  const handleSpaceChangeSumbit = (values) => {
    console.log(`values`, values);
    let data = new FormData();

    let url = "";

    if (isNew) {
      data.append("spot_id", spotId);
      url = `${process.env.BACKEND_API}/admin/spot/space/add`;
    } else {
      data.append("space_id", spaceInfo.space_id);
      url = `${process.env.BACKEND_API}/admin/spot/space/update`;
    }

    data.append("name", values.name);
    data.append("type", type);
    data.append("property", values.property);
    data.append("seat_capacity", values.seat_capacity);
    data.append("floor", values.floor);

    const validOptionInfos = values.options;

    let options = {};
    if (validOptionInfos) {
      validSpaceOptions.map((spaceOption) => {
        if (validOptionInfos.includes(spaceOption)) {
          options[spaceOption] = true;
        } else {
          options[spaceOption] = false;
        }
      });
    }

    data.append("options", JSON.stringify(options));

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        data.append(`image${index + 1}`, image.originFileObj);
      });
    }

    const config = {
      method: "post",
      url: url,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSpaceRemove = () => {
    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/spot/space/delete`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: { space_id: spaceInfo.space_id },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // 상위 컴포넌트에 space_id 전달해서 리스트에서 제외
    handleSpaceDeleted(spaceInfo.space_id);
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
      form.setFieldsValue(newFileList);

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

  const handlePropertyChange = (e) => {
    setProperty(e.target.value);
  };

  return (
    <Col className="mb-4">
      <Card bodyStyle={{ background: "lightgray" }}>
        {!isNew && (
          <>
            <Button onClick={() => setDeleteModalVisible(true)}>삭제</Button>
            <Modal
              visible={deleteModalVisible}
              okText="확인"
              cancelText="취소"
              onOk={handleSpaceRemove}
              onCancel={() => {
                setDeleteModalVisible(false);
              }}
            >
              <p>정말 삭제하시겠습니까?</p>
            </Modal>
          </>
        )}

        <Form form={form} onFinish={handleSpaceChangeSumbit}>
          <Form.Item
            name="images"
            label={`${title} 이미지 (최대 5장까지 첨부 가능)`}
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
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item name="options" label={"시설 정보"}>
            <Checkbox.Group options={settingSpaceOptions} />
          </Form.Item>
          <Form.Item name="property" label="파이브스팟 전용">
            <Radio.Group onChange={handlePropertyChange} value={property}>
              <Radio style={radioStyle} value={"fivespot"}>
                전용
              </Radio>
              <Radio style={radioStyle} value={"fastfive"}>
                공용
              </Radio>
              <Radio style={radioStyle} value={"none"}>
                설정 없음
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="name" label={`${title} 이름`}>
            <Input />
          </Form.Item>
          <Form.Item name="seat_capacity" label="인원">
            <InputNumber onChange={handleSeatCapacityChange} />
          </Form.Item>
          <Form.Item name="max_seat_capacity" label="최대 인원">
            <InputNumber disabled={true} />
          </Form.Item>
          <Form.Item name="floor" label="층 정보">
            <InputNumber label={"층"} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {isNew ? "등록" : "수정"}
          </Button>
        </Form>
      </Card>
    </Col>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpaceCard);
