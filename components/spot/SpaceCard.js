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
  Popconfirm,
} from "antd";
import { UploadOutlined, MinusOutlined } from "@ant-design/icons";

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
  const [isNew, setIsNew] = useState(true);

  // 시설 정보 체크박스 옵션 세팅용 state
  const [settingSpaceOptions, setSettingSpaceOptions] = useState([]);
  // 시설 정보 (서버 전송용) state
  const [validSpaceOptions, setValidSpaceOptions] = useState([]);

  // 파일 관련 state
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [removedFileList, setRemovedFileList] = useState([]);

  // 모달 관련 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  // 라디오 state
  const [property, setProperty] = useState("");

  const [form] = useForm();

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  // 공간 type별 시설정보 options
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

  // 공간 type별 시설 정보 배열
  const lounge_option_array = ["comport", "open", "focus"];
  const meeting_option_array = ["board", "tv", "hdmi", "multitab"];
  const cowork_option_array = ["multitab"];

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
        setValidSpaceOptions(cowork_option_array);
        break;
      default:
        break;
    }

    // 새로 만든 spaceInfo엔 space_id만 내려와서 space 정보가 없다
    // 데이터가 있을 경우 필드 세팅
    if (spaceInfo.space) {
      if (spaceInfo.images) {
        const spaceImages = [];

        spaceInfo.images.map((image) => {
          const newObj = {
            thumbUrl: image.image_path,
            uid: image.image_key,
          };

          spaceImages.push(newObj);
        });

        setFileList(spaceImages);
      }

      form.setFieldsValue({
        // images: spaceInfo.images,
        property: spaceInfo.space.property,
        name: spaceInfo.space.name,
        seat_capacity: spaceInfo.space.seat_capacity,
        max_seat_capacity: spaceInfo.space.seat_limit,
        guest_limit: spaceInfo.space.guest_limit,
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
    }
  }, []);

  const handleSpaceChangeSumbit = (values) => {
    let data = new FormData();

    console.log(`values`, values);

    let url = "";

    if (isNew) {
      data.append("spot_id", spotId);
      url = `${process.env.BACKEND_API}/admin/spot/space/add`;
    } else {
      data.append("space_id", spaceInfo.space_id);
      url = `${process.env.BACKEND_API}/admin/spot/space/update`;
    }

    data.append("property", values.property);

    if (values.guest_limit) {
      data.append("guest_limit", values.guest_limit);
    }

    // 락커는 아래 정보들이 들어가지 않음
    if (type !== "locker") {
      data.append("name", values.name);
      data.append("type", type);

      data.append("seat_capacity", values.seat_capacity);

      data.append("floor", values.floor);

      const validOptionInfos = values.options;

      // 시설 정보 입력 데이터 서버에 정의되어 있는 형태로 가공
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
    }

    // 파일 처리
    if (values.images) {
      values.images.map((image, index) => {
        // image.uid가 rc로 시작하면 새로 올린 이미지
        if (image.uid.startsWith("rc")) {
          data.append(`image${index + 1}`, image.originFileObj);
        }
      });
    }

    // 삭제 파일 처리
    if (removedFileList.length > 0) {
      data.append("del_images", JSON.stringify(removedFileList));
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
        if (response.data.msg && response.data.msg === "OK") {
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 공간 삭제
  const handleSpaceRemove = () => {
    if (spaceInfo.space) {
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
          // console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    // 상위 컴포넌트에 space_id 전달해서 리스트에서 제외
    handleSpaceDeleted(spaceInfo.space_id);
  };

  // 이미지 파일 변경
  const handleFileChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setFileList([...fileList, file]);
      form.setFieldsValue({
        images: [...fileList, file],
      });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = fileList.filter(
        (fileObj) => fileObj.uid !== file.uid
      );
      setFileList(newFileList);
      form.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const newRemovedFileList = [...removedFileList, file.uid];
        setRemovedFileList(newRemovedFileList);
      }
    }
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url || file.thumbUrl);
  };

  // 인원 입력시 최대 인원 세팅
  const handleSeatCapacityChange = (seat_capacity) => {
    form.setFieldsValue({
      max_seat_capacity: Math.floor(seat_capacity * 1.5),
    });
  };

  return (
    <Col className="mb-4">
      <Card
        key={spaceInfo.space_id}
        extra={
          <>
            <Popconfirm
              title={`삭제하시겠습니까?`}
              onConfirm={handleSpaceRemove}
              okText={"삭제"}
              cancelText={"취소"}
            >
              <Button icon={<MinusOutlined />} />
            </Popconfirm>
          </>
        }
      >
        <Form
          form={form}
          key={`${spaceInfo.space_id}_form`}
          onFinish={handleSpaceChangeSumbit}
        >
          <Form.Item
            name={`images`}
            label={`${title} 이미지 (최대 5장까지 첨부 가능)`}
          >
            <>
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
            </>
          </Form.Item>
          <Form.Item name={`options`} label={"시설 정보"}>
            {type === "locker" ? (
              <>-</>
            ) : (
              <Checkbox.Group options={settingSpaceOptions} />
            )}
          </Form.Item>
          <Form.Item
            name={`property`}
            label="파이브스팟 전용"
            rules={[{ required: true, message: "전용 여부 선택은 필수입니다" }]}
          >
            <Radio.Group
              onChange={(e) => {
                setProperty(e.target.value);
              }}
              value={property}
            >
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
          {type !== "locker" && (
            <>
              <Form.Item
                name={`name`}
                label={`${title} 이름`}
                rules={[
                  {
                    required: true,
                    message: `${title} 이름은 필수 입력 사항입니다`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`seat_capacity`}
                label="인원"
                rules={[
                  { required: true, message: "인원은 필수 입력 사항입니다" },
                  {
                    type: "number",
                    message: "인원은 숫자로 입력해야 합니다.",
                  },
                ]}
              >
                <InputNumber min={0} onChange={handleSeatCapacityChange} />
              </Form.Item>
              {type === "lounge" && (
                <>
                  <Form.Item name={`max_seat_capacity`} label="최대 인원">
                    <InputNumber disabled={true} />
                  </Form.Item>
                  <Form.Item name={`guest_limit`} label="게스트 인원">
                    <InputNumber />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name={`floor`}
                label="층 정보"
                rules={[
                  { required: true, message: "층 정보는 필수 입력 사항입니다" },
                  {
                    type: "number",
                    message: "층 정보는 숫자로 입력해야 합니다.",
                  },
                ]}
              >
                <InputNumber min={0} label={"층"} />
              </Form.Item>
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            key={`${spaceInfo.space_id}_button`}
          >
            {isNew ? "등록" : "수정"}
          </Button>
        </Form>
        <Modal
          visible={okModalVisible}
          okText="확인"
          onOk={() => {
            setOkModalVisible(false);
          }}
          onCancel={() => setOkModalVisible(false)}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          {isNew
            ? `${title} 등록 완료`
            : `${spaceInfo.space.name} ${title} 수정 완료`}
        </Modal>
      </Card>
    </Col>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpaceCard);
