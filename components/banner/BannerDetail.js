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

  const [generatedBannerId, setGeneratedBannerId] = useState(undefined);

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // 롤링 배너 구분 state
  const [hasSwiperBanner, setHasSwiperBanner] = useState(true);

  const [bannerInfo, setBannerInfo] = useState(undefined);

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 배너 시작, 종료일 state
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ).format("YYYY-MM-DD")
  );

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

  // 이미지 관련 state
  const [topBannerImage, setTopBannerImage] = useState([]);
  const [topBannerPreviewVisible, setTopBannerPreviewVisible] = useState(false);
  const [topBannerPreviewImage, setTopBannerPreviewImage] = useState("");

  const [bottomBannerImage, setBottomBannerImage] = useState([]);
  const [bottomBannerPreviewVisible, setBottomBannerPreviewVisible] =
    useState(false);
  const [bottomBannerPreviewImage, setBottomBannerPreviewImage] = useState("");

  const [swiperBannerImage, setSwiperBannerImage] = useState([]);
  const [swiperBannerPreviewVisible, setSwiperBannerPreviewVisible] =
    useState(false);
  const [swiperBannerPreviewImage, setSwiperBannerPreviewImage] = useState("");

  const [popupBannerImage, setPopupBannerImage] = useState([]);
  const [popupBannerPreviewVisible, setPopupBannerPreviewVisible] =
    useState(false);
  const [popupBannerPreviewImage, setPopupBannerPreviewImage] = useState("");

  // 삭제한 이미지 서버 전송용
  const [delImages, setDelImages] = useState([]);

  // 배너 타깃 체크박스에 사용되는 옵션
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

  // 새창으로 열기 체크박스에 사용되는 옵션
  const targetOption = [
    {
      label: "새 창으로 열기",
      value: "_blank",
    },
  ];

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

      const permissionArray = bannerInfo.permission.split("|");
      // 이벤트 상태
      bannerForm.setFieldsValue({
        status: bannerInfo.status,
        path: bannerInfo.path,
        permission: permissionArray,
        start_date: moment(bannerInfo.start_date),
        end_date: moment(bannerInfo.end_date),
      });

      // 전송용 state에도 세팅
      setStartDate(bannerInfo.start_date.replace(/\./gi, "-"));
      setEndDate(bannerInfo.end_date.replace(/\./gi, "-"));

      // 배너 위치가 홈일경우
      if (bannerInfo.path === "home") {
        // 롤링 배너 노출
        setHasSwiperBanner(true);
      }

      // 이미지 세팅
      if (bannerInfo.items && bannerInfo.items.length > 0) {
        // setBannerItems(bannerInfo.items);

        bannerInfo.items.map((bannerItem) => {
          let form = "";

          const bannerImages = [];

          if (bannerItem.images) {
            bannerItem.images.map((image) => {
              const settingImage = {
                thumbUrl: image.image_path,
                uid: image.image_key,
              };

              bannerImages.push(settingImage);
            });
          }

          switch (bannerItem.banner_type) {
            case "top":
              form = topBannerForm;

              if (bannerImages.length > 0) {
                setTopBannerImage(bannerImages);
              }

              break;
            case "bottom":
              form = bottomBannerForm;
              if (bannerImages.length > 0) {
                setBottomBannerImage(bannerImages);
              }
              break;
            case "swiper":
              form = swiperBannerForm;
              if (bannerImages.length > 0) {
                setSwiperBannerImage(bannerImages);
              }
              break;
            case "popup":
              form = popupBannerForm;
              if (bannerImages.length > 0) {
                setPopupBannerImage(bannerImages);
              }
              break;
            default:
              break;
          }

          form.setFieldsValue({
            title: bannerItem.title,
            link: bannerItem.link,
            target: bannerItem.target,
            banner_item_id: bannerItem.banner_item_id,
          });
        });
      }
    }
  }, [bannerInfo]);

  // 배너 저장 버튼 클릭
  const handleBannerRegisterSubmit = () => {
    const { status, path, permission } = bannerForm.getFieldValue();

    let data = {
      path,
      permission: permission.join("|"),
      status,
      start_date: startDate,
      end_date: endDate,
    };

    console.log(`data`, data);

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/services/banner/add`;
    } else {
      url = `${process.env.BACKEND_API}/services/banner/update`;
      data.banner_id = Number(bannerId);
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
        if (response.status === 200) {
          if (registerMode) {
            setGeneratedBannerId(response.data.item.banner_id);
          }
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 배너 아이템 (상단, 하단, 팝업, 롤링 배너) 등록
  const handleBannerItemSubmit = (type) => {
    if (!(bannerId || generatedBannerId)) {
      return false;
    }

    console.log(`type`, type);

    let value = "";

    switch (type) {
      case "top":
        value = topBannerForm.getFieldValue();
        break;
      case "bottom":
        value = bottomBannerForm.getFieldValue();
        break;
      case "swiper":
        value = swiperBannerForm.getFieldValue();
        break;
      case "popup":
        value = popupBannerForm.getFieldValue();
        break;
      default:
        break;
    }

    console.log(`value`, value);

    const formData = new FormData();

    formData.append("banner_id", bannerId ? bannerId : generatedBannerId);
    formData.append("banner_type", type);

    // 배너 아이템 수정일 경우
    value.banner_item_id &&
      formData.append("banner_item_id", value.banner_item_id);

    formData.append("title", value.title);
    formData.append("link", value.link);
    formData.append("target", value.target ? "_blank" : "_self");

    if (value.images && value.images.length > 0) {
      value.images.map((image) => {
        if (image.uid.startsWith("rc")) {
          formData.append("images", image.originFileObj);
        }
      });
    }

    // 삭제 이미지가 있는 경우 전송 추가
    if (delImages.length > 0) {
      formData.append("del_images", JSON.stringify(delImages));
    }

    // formData console

    // for (let key of formData.keys()) {
    //   console.log(key);
    // }

    // for (let value of formData.values()) {
    //   console.log(value);
    // }

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/services/banner/item/edit`,
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

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };

  const handlePathChange = (value) => {
    if (value === "home") {
      setHasSwiperBanner(true);
    } else {
      setHasSwiperBanner(false);
    }
  };

  const handleTopBannerPreview = (file) => {
    setTopBannerPreviewVisible(true);
    setTopBannerPreviewImage(file.url || file.thumbUrl);
  };

  const handleTopBannerImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setTopBannerImage([...topBannerImage, file]);
      topBannerForm.setFieldsValue({ images: [...topBannerImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = topBannerImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setTopBannerImage(newFileList);
      topBannerForm.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const removeFileList = [...delImages, file.uid];
        setDelImages(removeFileList);
      }
    }
  };

  const handleBottomBannerPreview = (file) => {
    setBottomBannerPreviewVisible(true);
    setBottomBannerPreviewImage(file.url || file.thumbUrl);
  };

  const handleBottomBannerImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setBottomBannerImage([...bottomBannerImage, file]);
      bottomBannerForm.setFieldsValue({ images: [...bottomBannerImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = bottomBannerImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setBottomBannerImage(newFileList);
      bottomBannerForm.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const removeFileList = [...delImages, file.uid];
        setDelImages(removeFileList);
      }
    }
  };

  const handleSwiperBannerPreview = (file) => {
    setSwiperBannerPreviewVisible(true);
    setSwiperBannerPreviewImage(file.url || file.thumbUrl);
  };

  const handleSwiperBannerImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setSwiperBannerImage([...swiperBannerImage, file]);
      swiperBannerForm.setFieldsValue({ images: [...swiperBannerImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = swiperBannerImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setSwiperBannerImage(newFileList);
      swiperBannerForm.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const removeFileList = [...delImages, file.uid];
        setDelImages(removeFileList);
      }
    }
  };

  const handlePopupBannerPreview = (file) => {
    setPopupBannerPreviewVisible(true);
    setPopupBannerPreviewImage(file.url || file.thumbUrl);
  };

  const handlePopupBannerImageChange = ({ file }) => {
    if (file.status === "done") {
      // 파일 추가
      setPopupBannerImage([...popupBannerImage, file]);
      popupBannerForm.setFieldsValue({ images: [...popupBannerImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = popupBannerImage.filter((fileObj) => {
        return fileObj.uid !== file.uid;
      });

      setPopupBannerImage(newFileList);
      popupBannerForm.setFieldsValue({ images: newFileList });

      if (!file.uid.startsWith("rc")) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const removeFileList = [...delImages, file.uid];
        setDelImages(removeFileList);
      }
    }
  };

  return (
    <>
      <Card
        title={bannerId && bannerId !== null ? `배너 ${bannerId}` : "배너 등록"}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Card bodyStyle={{ padding: "1rem" }} className="mb-2">
          <Form
            form={bannerForm}
            onFinish={handleBannerRegisterSubmit}
            initialValues={{
              status: "private",
              path: "home",
              start_date: moment(new Date()),
              end_date: moment(
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              ),
            }}
          >
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
            <Form.Item
              name="path"
              label="위치"
              rules={[{ required: true, message: "위치를 선택해주세요" }]}
            >
              <Select style={{ width: 120 }} onChange={handlePathChange}>
                <Select.Option value="home">홈</Select.Option>
                <Select.Option value="spot">스팟</Select.Option>
                <Select.Option value="service">서비스</Select.Option>
                <Select.Option value="mypage">마이페이지</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="permission" label="배너 타깃">
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
          </Form>
        </Card>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        <Card
          title="상단 띠배너"
          bodyStyle={{ padding: "1rem" }}
          className="mb-2"
        >
          <Form
            form={topBannerForm}
            onFinish={() => {
              handleBannerItemSubmit("top");
            }}
          >
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <>
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={topBannerImage}
                  onChange={handleTopBannerImageChange}
                  onPreview={handleTopBannerPreview}
                >
                  {topBannerImage.length < 1 && (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  )}
                </Upload>
                <Modal
                  visible={topBannerPreviewVisible}
                  footer={null}
                  onCancel={() => {
                    setTopBannerPreviewVisible(false);
                  }}
                >
                  <img
                    alt="상단 배너"
                    style={{ width: "100%" }}
                    src={topBannerPreviewImage}
                  />
                </Modal>
              </>
            </Form.Item>
            <Form.Item name="url_link" label="URL 링크">
              <Input.Group compact>
                <Form.Item name="link">
                  <Input />
                </Form.Item>
                <Form.Item name="target">
                  <Checkbox.Group options={targetOption} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item name="banner_item_id">
              <Input type="hidden" />
            </Form.Item>
            <Button type="primary" htmlType="submit" name="button">
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
          </Form>
        </Card>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        <Card
          bodyStyle={{ padding: "1rem" }}
          className="mb-2"
          title="하단 띠배너"
        >
          <Form
            form={bottomBannerForm}
            onFinish={() => {
              handleBannerItemSubmit("bottom");
            }}
          >
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <>
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={bottomBannerImage}
                  onChange={handleBottomBannerImageChange}
                  onPreview={handleBottomBannerPreview}
                >
                  {bottomBannerImage.length < 1 && (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  )}
                </Upload>
                <Modal
                  visible={bottomBannerPreviewVisible}
                  footer={null}
                  onCancel={() => {
                    setBottomBannerPreviewVisible(false);
                  }}
                >
                  <img
                    alt="하단 배너"
                    style={{ width: "100%" }}
                    src={bottomBannerPreviewImage}
                  />
                </Modal>
              </>
            </Form.Item>
            <Form.Item name="url_link" label="URL 링크">
              <Input.Group compact>
                <Form.Item name="link">
                  <Input />
                </Form.Item>
                <Form.Item name="target">
                  <Checkbox.Group options={targetOption} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item name="banner_item_id">
              <Input type="hidden" />
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
          </Form>
        </Card>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
        {hasSwiperBanner && (
          <>
            <Card
              title="롤링 배너"
              bodyStyle={{ padding: "1rem" }}
              className="mb-2"
            >
              <Form
                form={swiperBannerForm}
                onFinish={() => {
                  handleBannerItemSubmit("swiper");
                }}
              >
                <Form.Item
                  name="title"
                  label="제목"
                  rules={[{ required: true, message: "제목을 입력해주세요" }]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item name="images" label="이미지">
                  <>
                    <Upload
                      name="images"
                      listType="picture-card"
                      fileList={swiperBannerImage}
                      onChange={handleSwiperBannerImageChange}
                      onPreview={handleSwiperBannerPreview}
                    >
                      {swiperBannerImage.length < 5 && (
                        <Button icon={<UploadOutlined />}>업로드</Button>
                      )}
                    </Upload>
                    <Modal
                      visible={swiperBannerPreviewVisible}
                      footer={null}
                      onCancel={() => {
                        setSwiperBannerPreviewVisible(false);
                      }}
                    >
                      <img
                        alt="롤링 배너"
                        style={{ width: "100%" }}
                        src={swiperBannerPreviewImage}
                      />
                    </Modal>
                  </>
                </Form.Item>
                <Form.Item name="url_link" label="URL 링크">
                  <Input.Group compact>
                    <Form.Item name="link">
                      <Input />
                    </Form.Item>
                    <Form.Item name="target">
                      <Checkbox.Group options={targetOption} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Form.Item name="banner_item_id">
                  <Input type="hidden" />
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
              </Form>
            </Card>

            <Row type="flex" align="middle" className="py-4">
              <span className="px-2 w-10"></span>
            </Row>
          </>
        )}

        <Card
          title="팝업 배너"
          bodyStyle={{ padding: "1rem" }}
          className="mb-2"
        >
          <Form
            form={popupBannerForm}
            onFinish={() => {
              handleBannerItemSubmit("popup");
            }}
          >
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item name="images" label="이미지">
              <>
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={popupBannerImage}
                  onChange={handlePopupBannerImageChange}
                  onPreview={handlePopupBannerPreview}
                >
                  {popupBannerImage.length < 1 && (
                    <Button icon={<UploadOutlined />}>업로드</Button>
                  )}
                </Upload>
                <Modal
                  visible={popupBannerPreviewVisible}
                  footer={null}
                  onCancel={() => {
                    setPopupBannerPreviewVisible(false);
                  }}
                >
                  <img
                    alt="팝업 배너"
                    style={{ width: "100%" }}
                    src={popupBannerPreviewImage}
                  />
                </Modal>
              </>
            </Form.Item>
            <Form.Item name="url_link" label="URL 링크">
              <Input.Group compact>
                <Form.Item name="link">
                  <Input />
                </Form.Item>
                <Form.Item name="target">
                  <Checkbox.Group options={targetOption} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item name="banner_item_id">
              <Input type="hidden" />
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
          </Form>
        </Card>

        <Row type="flex" align="middle" className="py-4">
          <span className="px-2 w-10"></span>
        </Row>
      </Card>
    </>
  );
};

export default connect((state) => state)(BannerDetail);
