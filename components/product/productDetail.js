import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Tabs,
  Card,
  Radio,
  Upload,
  Checkbox,
  Select,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ProductSpotContainer from "./ProductSpotContainer";

const PostEditor = dynamic(() => import("@utils/Editor"), {
  ssr: false,
});

const ProductDetail = (props) => {
  const { productId, token } = props;

  // 운영 요일 checkbox 옵션
  const workingDaysOptions = [
    { label: "월", value: "mon" },
    { label: "화", value: "tue" },
    { label: "수", value: "wed" },
    { label: "목", value: "thu" },
    { label: "금", value: "fri" },
    { label: "토", value: "sat" },
    { label: "일", value: "sun" },
  ];
  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // detail로 들어온 경우 product info 저장 state
  const [productInfo, setProductInfo] = useState(undefined);

  // 생성된 product ID 저장 state
  const [generatedProductId, setGeneratedProductId] = useState(undefined);

  // 상품 구분 선택 state
  const [type, setType] = useState("membership");
  // 카테고리 선택 state
  const [category, setCategory] = useState("");
  // 상품 구분에 따라 변경되는 카테고리 option 저장 state
  const [categoryOptions, setCategoryOptions] = useState([]);

  // 상품 소개 데이터 저장 state
  const [intro, setIntro] = useState("");

  // 권한 제공 기간 단위 표시 state
  const [timeUnitVisible, setTimeUnitVisible] = useState(false);

  // 차감 단위 state
  const [serviceUnitDisable, setServiceUnitDisable] = useState(false);

  // 권한 제공 기간 단위 저장 state
  const [timeUnit, setTimeUnit] = useState("");

  // file 관련 state
  const [logoImage, setLogoImage] = useState([]);
  const [logoPreviewVisible, setLogoPreviewVisible] = useState(false);
  const [logoPreviewImage, setLogoPreviewImage] = useState("");

  const [productImageList, setProductImageList] = useState([]);
  const [productImagePreviewVisible, setProductImagePreviewVisible] =
    useState(false);
  const [productPreviewImage, setProductPreviewImage] = useState("");
  const [removedFileList, setRemovedFileList] = useState([]);

  // modal 표기 구분 state
  const [okModalVisible, setOkModalVisible] = useState(false);

  const [form] = Form.useForm();

  // 자식 컴포넌트가 먼저 로드되는 경우를 방지하기 위한 state
  // generatedId가 생성되거나 productInfo가 모두 로드되면 true로 변경
  const [isChildLoadReady, setIsChildLoadReady] = useState(undefined);

  // product 정보 조회
  useEffect(() => {
    if (productId) {
      setRegisterMode(false);

      const config = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/admin/product/get/${productId}`,
          config
        )
        .then((response) => {
          const productData = response.data.item;
          setProductInfo(productData);
        })
        .catch((error) => {
          console.log(`error`, error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  // productData 세팅되면 알맞는 엘리먼트에 binding
  useEffect(() => {
    if (productInfo) {
      // console.log(`productInfo`, productInfo);
      // 하위 컴포넌트 호출 준비 완료
      setIsChildLoadReady(true);

      // 권한 제공 기간 단위 저장
      setTimeUnit(productInfo.time_unit);

      // 상품 구분
      handleTypeChange(productInfo.type);
      // 상품 카테고리
      handleCategoryChange(productInfo.category);

      form.setFieldsValue({
        // 활성 / 비활성
        status: productInfo.status,
        // 상품 구분
        type: productInfo.type,
        // 상품명
        name: productInfo.name,
        // 상품 카테고리
        category: productInfo.category,
        // 정산 유형
        service_type: productInfo.service_type,
        // 하위 스팟 권한 범위
        plan_spot: productInfo.plan_spot,
        // 차감 단위
        service_unit: productInfo.service_unit,
        // 자동 결제
        pay_extend: productInfo.pay_extend,
        // 권한 제공 기간
        period_amount: productInfo.period_amount,
        // 총 사용 가능일
        available_days: productInfo.available_days,
      });

      // 권한 제공 기간 값이 있다면
      if (productInfo.period_amount) {
        // 권한 제공 기간 단위 필드 보여지게 하고
        setTimeUnitVisible(true);
        // 권한 제공 기간 단위 값 세팅
        form.setFieldsValue({
          time_unit: productInfo.time_unit,
        });
      }

      // 이미지 파일 세팅
      const productImages = [];

      if (productInfo.images) {
        productInfo.images.map((image) => {
          const newObj = {
            thumbUrl: image.image_path,
            image_key: image.image_key,
          };

          if (image.image_key === "logo") {
            setLogoImage([newObj]);
          } else {
            productImages.push(newObj);
          }
        });
        setProductImageList(productImages);
      }

      // 에디터 컨텐츠
      setIntro(productInfo.intro);

      // 운영 요일 binding
      let workingDays = [];

      if (productInfo.working_days) {
        Object.entries(productInfo.working_days).filter((obj) => {
          if (obj[1]) {
            workingDays.push(obj[0]);
          }
        });

        form.setFieldsValue({
          working_days: workingDays,
        });
      }
    }
  }, [productInfo]);

  useEffect(() => {
    // 방금 상품 등록을 마쳐서 productId를 response로 받은 경우
    if (generatedProductId) {
      // 사용 가능 스팟 표시
      setIsChildLoadReady(true);
    }
  }, [generatedProductId]);

  // 저장 버튼 클릭
  const handleSpotRegisterSubmit = (values) => {
    const formData = new FormData();

    console.log(`values`, values);

    formData.append("status", values.status);
    formData.append("type", values.type);
    formData.append("name", values.name);
    formData.append("category", values.category);
    if (values.service_type) {
      formData.append("service_type", values.service_type);
    }

    if (values.plan_spot) {
      formData.append("plan_spot", values.plan_spot);
    }

    if (values.service_unit) {
      formData.append("service_unit", values.service_unit);
    }

    if (values.pay_extend) {
      formData.append("pay_extend", values.pay_extend);
    }

    if (values.period_amount) {
      formData.append("period_amount", values.period_amount);
    }

    if (values.time_unit) {
      formData.append("time_unit", values.time_unit);
    }

    formData.append("intro", intro);
    // TO-DO 로고 처리
    if (values.logo) {
      formData.append("logo", values.logo[0].originFileObj);
    }

    if (removedFileList.length > 0) {
      formData.append("del_images", JSON.stringify(removedFileList));
    }

    // 상품 이미지 처리
    if (values.productImages) {
      values.productImages.map((image, index) => {
        if (!image.image_key) {
          formData.append(`image${index + 1}`, image.originFileObj);
        }
      });
    }

    // // 전체 요일 정보
    const allWorkginDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    // // 선택한 요일 정보
    const selectedWorkingDays = values.working_days;

    // 운영 요일 객체 생성
    let workingDays = {};
    if (selectedWorkingDays) {
      allWorkginDays.map((workingDay) => {
        if (selectedWorkingDays.includes(workingDay)) {
          workingDays[workingDay] = true;
        } else {
          workingDays[workingDay] = false;
        }
      });
    }

    formData.append("working_days", JSON.stringify(workingDays));

    // 이용권에서만 사용 / 그 외엔 0
    if (type === "voucher") {
      formData.append("available_days", values.available_days);
    } else {
      formData.append("available_days", 0);
    }

    // formData console
    // for (let key of formData.keys()) {
    //   console.log(key);
    // }

    // for (let value of formData.values()) {
    //   console.log(value);
    // }

    let url = "";

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/product/add`;
    } else {
      formData.append("product_id", productId);
      url = `${process.env.BACKEND_API}/admin/product/update`;
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
          // 등록한 상품 ID 값 세팅
          setGeneratedProductId(response.data.item.product_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 상품 구분 변경
  const handleTypeChange = (value) => {
    setType(value);

    form.setFieldsValue({
      category: null,
    });

    setCategory("");

    if (value === "membership") {
      setCategoryOptions([
        { label: "ALL SPOT", value: "allspot" },
        { label: "ONE SPOT", value: "onespot" },
      ]);

      setServiceUnitDisable(false);
    } else if (value === "service") {
      setCategoryOptions([
        { label: "미팅룸", value: "meeting" },
        { label: "코워킹룸", value: "coworking" },
        { label: "라운지", value: "lounge" },
        { label: "스마트 락커", value: "locker" },
      ]);

      setServiceUnitDisable(true);
    } else if (value === "voucher") {
      setServiceUnitDisable(false);
    }
  };

  // 상품 카테고리 변경
  const handleCategoryChange = (value) => {
    // productSpot에 전달할 카테고리 값 세팅
    setCategory(value);
  };

  // 권한 제공 기간 단위 변경
  const handleTimeUnitChange = (e) => {
    setTimeUnit(e.target.value);
  };

  // 로고 변경
  const handleLogoChange = ({ file }) => {
    console.log(`file`, file);
    console.log(`file.status`, file.status);
    if (file.status === "done") {
      // 파일 추가
      setLogoImage([...logoImage, file]);
      form.setFieldsValue({ logo: [...logoImage, file] });
    } else if (file.status === "removed") {
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = logoImage.filter(
        (fileObj) => fileObj.uid !== file.uid
      );
      setLogoImage(newFileList);
      form.setFieldsValue({ logo: newFileList });

      if (file.image_key) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const newRemovedFileList = [...removedFileList, file.image_key];
        setRemovedFileList(newRemovedFileList);
      }
    }
  };

  // 로고 프리뷰
  const handleLogoPreview = (file) => {
    setLogoPreviewVisible(true);
    setLogoPreviewImage(file.url || file.thumbUrl);
  };

  // 상품 이미지 변경
  const handleProductImagesChange = ({ file }) => {
    console.log(`file`, file);
    console.log(`file.status`, file.status);
    if (file.status === "done") {
      // 파일 추가
      setProductImageList([...productImageList, file]);
      form.setFieldsValue({ productImages: [...productImageList, file] });
    } else if (file.status === "removed") {
      console.log("else");
      // 파일 삭제

      // 삭제된 파일 list 에서 삭제
      const newFileList = productImageList.filter(
        (fileObj) => fileObj.uid !== file.uid
      );
      setProductImageList(newFileList);
      form.setFieldsValue({ productImageList: newFileList });

      if (file.image_key) {
        // 서버에서 받아온 파일인 경우
        // 서버에서 삭제하기 위한 배열 세팅
        const newRemovedFileList = [...removedFileList, file.image_key];
        setRemovedFileList(newRemovedFileList);
      }
    }
  };
  const handleProductImagesPreview = (file) => {
    setProductImagePreviewVisible(true);
    setProductPreviewImage(file.url || file.thumbUrl);
  };

  // 에디터 입력
  const handleIntroChange = (values) => {
    setIntro(values);
  };

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="상품 상세" key="1">
          <Card
            title={
              productId && productId !== null
                ? `상품 ID ${productId}`
                : "상품 등록"
            }
            extra={<a onClick={() => router.back()}>뒤로 가기</a>}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSpotRegisterSubmit}
              initialValues={{
                status: "inactive",
                service_type: "accumulate",
                service_unit: "day",
                pay_extend: false,
              }}
            >
              <Card>
                <Form.Item
                  name="status"
                  label="활성 / 비활성"
                  rules={[
                    {
                      required: true,
                      message: "활성 비활성 여부를 선택해주세요",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio style={radioStyle} value={"active"}>
                      활성
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      비활성
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="type"
                  label="상품 구분"
                  rules={[
                    {
                      required: true,
                      message: "상품 구분을 선택해주세요",
                    },
                  ]}
                >
                  <Select style={{ width: 120 }} onChange={handleTypeChange}>
                    <Select.Option value="membership">멤버십</Select.Option>
                    <Select.Option value="service">부가서비스</Select.Option>
                    <Select.Option value="voucher">이용권</Select.Option>
                  </Select>
                </Form.Item>
              </Card>
              <Card
                title={
                  type === "membership"
                    ? "멤버십"
                    : type === "service"
                    ? "부가서비스"
                    : "이용권"
                }
              >
                <Form.Item
                  name="name"
                  label="상품명"
                  rules={[
                    {
                      required: true,
                      message: "상품명을 입력해주세요",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="category"
                  label="상품 카테고리"
                  rules={[
                    {
                      required: true,
                      message: "상품 카테고리를 선택해주세요",
                    },
                  ]}
                >
                  <Select
                    onChange={handleCategoryChange}
                    style={{ width: 120 }}
                    options={categoryOptions}
                  ></Select>
                </Form.Item>
                {type === "membership" && (
                  <Form.Item
                    name="service_type"
                    label="정산 유형"
                    rules={[
                      {
                        required: true,
                        message: "정산 유형을 선택해주세요",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio style={radioStyle} value={"accumulate"}>
                        기본형
                      </Radio>
                      <Radio style={radioStyle} value={"deduction"} disabled>
                        차감형
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                )}

                {type === "membership" && (
                  <Form.Item
                    name="plan_spot"
                    label="하위 스팟 권한 범위"
                    rules={[
                      {
                        required: true,
                        message: "하위 스팟 권한 범위를 선택해주세요",
                      },
                    ]}
                  >
                    <Select style={{ width: 120 }}>
                      <Select.Option value="many">전체</Select.Option>
                      <Select.Option value="single">택1</Select.Option>
                    </Select>
                  </Form.Item>
                )}

                {type === "membership" && (
                  <Form.Item name="service_unit" label="차감 단위">
                    <Radio.Group disabled={serviceUnitDisable} disabled>
                      <Radio style={radioStyle} value={"day"}>
                        일
                      </Radio>
                      <Radio style={radioStyle} value={"hour"}>
                        시간
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                )}

                {type === "membership" && (
                  <Form.Item
                    name="pay_extend"
                    label="자동 결제"
                    rules={[
                      {
                        required: true,
                        message: "자동 결제 여부를 선택해주세요",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio style={radioStyle} value={true}>
                        ON
                      </Radio>
                      <Radio style={radioStyle} value={false}>
                        OFF
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                )}

                <Form.Item name="period_amount" label="권한 제공 기간">
                  <InputNumber
                    min={0}
                    onChange={(value) => {
                      if (value) {
                        setTimeUnitVisible(true);
                      } else {
                        setTimeUnitVisible(false);
                      }
                    }}
                  />
                </Form.Item>

                {timeUnitVisible && (
                  <Form.Item
                    name="time_unit"
                    label="권한 제공 기간 단위"
                    rules={[
                      {
                        required: true,
                        message: "권한 제공 기간 단위를 선택해주세요",
                      },
                    ]}
                  >
                    <Radio.Group onChange={handleTimeUnitChange}>
                      <Radio style={radioStyle} value="hour">
                        시간
                      </Radio>
                      <Radio style={radioStyle} value="day">
                        일
                      </Radio>
                      {type === "membership" && (
                        <Radio style={radioStyle} value="month">
                          월
                        </Radio>
                      )}
                    </Radio.Group>
                  </Form.Item>
                )}

                <Form.Item name="intro" label="상품 소개">
                  <PostEditor
                    onChange={handleIntroChange}
                    setContents={intro}
                  />
                </Form.Item>
                {type === "membership" && (
                  <Form.Item name="logo" label="상품  로고이미지">
                    <Upload
                      name="image"
                      listType="picture-card"
                      fileList={logoImage}
                      onChange={handleLogoChange}
                      onPreview={handleLogoPreview}
                    >
                      {logoImage.length < 1 ? (
                        <Button icon={<UploadOutlined />}>업로드</Button>
                      ) : null}
                    </Upload>
                    <Modal
                      visible={logoPreviewVisible}
                      footer={null}
                      onCancel={() => {
                        setLogoPreviewVisible(false);
                      }}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={logoPreviewImage}
                      />
                    </Modal>
                  </Form.Item>
                )}

                <Form.Item
                  name="productImages"
                  label="상품 이미지 (최대 5장까지 첨부 가능)"
                >
                  <Upload
                    name="image"
                    listType="picture-card"
                    fileList={productImageList}
                    onChange={handleProductImagesChange}
                    onPreview={handleProductImagesPreview}
                  >
                    {productImageList.length < 5 ? (
                      <Button icon={<UploadOutlined />}>업로드</Button>
                    ) : null}
                  </Upload>
                  <Modal
                    visible={productImagePreviewVisible}
                    footer={null}
                    onCancel={() => {
                      setProductImagePreviewVisible(false);
                    }}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={productPreviewImage}
                    />
                  </Modal>
                </Form.Item>

                {type === "membership" && (
                  <Form.Item name="working_days" label="운영 요일">
                    <Checkbox.Group options={workingDaysOptions} />
                  </Form.Item>
                )}

                {type === "voucher" && (
                  <Form.Item name="available_days" label="총 사용 가능일">
                    <Input />
                  </Form.Item>
                )}

                <Button type="primary" htmlType="submit">
                  저장
                </Button>
              </Card>
            </Form>
            <Modal
              visible={okModalVisible}
              okText="확인"
              onOk={() => setOkModalVisible(false)}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              상품 저장 완료
            </Modal>
          </Card>

          {/* 사용 가능 스팟 */}
          {(productId || generatedProductId) && isChildLoadReady && (
            <ProductSpotContainer
              token={token}
              productInfo={productInfo}
              productType={type}
              productCategory={category}
              productTimeUnit={timeUnit}
              productId={productId}
            />
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

export default connect((state) => state)(ProductDetail);
