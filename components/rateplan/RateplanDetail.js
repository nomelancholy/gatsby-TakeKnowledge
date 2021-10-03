import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Tabs,
  Card,
  Radio,
  Select,
  InputNumber,
  DatePicker,
  Table,
  Typography,
  Popconfirm,
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import { rateBySpotListColumns } from "@utils/columns/rateplan";

const RateplanDetail = (props) => {
  const { rateplanId, token } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const router = useRouter();

  // new / detial 구분 state
  const [registerMode, setRegisterMode] = useState(true);

  // detail로 들어온 경우 요금제 정보 저장 state
  const [rateplanInfo, setRateplanInfo] = useState(undefined);

  // 요금제에 붙어있는 상품 정보 저장 state
  const [productInfo, setProductInfo] = useState(undefined);
  // 상품 구분에 따라 달라지는 상품 리스트 저장 state
  const [optionProductList, setOptionProductList] = useState([]);

  const [okModalVisible, setOkModalVisible] = useState(false);

  // 멤버십 / 부가서비스 구분 state
  const [isService, setIsService] = useState(false);

  // 요금제 table state
  const [rateplanTableData, setRateplanTableData] = useState([]);

  // 테이블에서 변경 시도한 row 의 spotId 저장 state
  const [editingSpotId, setEditingSpotId] = useState("");

  const [form] = Form.useForm();

  // Table 요금 수정시 입력 값 확인을 위한 form
  const [tableForm] = Form.useForm();

  // 요금제 조회
  useEffect(() => {
    if (rateplanId) {
      setRegisterMode(false);

      const config = {
        headers: {
          Authorization: decodeURIComponent(token),
        },
      };

      axios
        .get(
          `${process.env.BACKEND_API}/admin/product/rateplan/get/${rateplanId}`,
          config
        )
        .then(function (response) {
          const rateplanInfo = response.data.item;
          setRateplanInfo(rateplanInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setRegisterMode(true);
    }
  }, []);

  useEffect(() => {
    // 요금제 정보 세팅되면
    if (rateplanInfo) {
      console.log(`rateplanInfo`, rateplanInfo);

      // 상품 구분, 상품명
      // 요금제에 붙어있는 상품 조회
      axios
        .get(
          `${process.env.BACKEND_API}/admin/product/get/${rateplanInfo.product_id}`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: decodeURIComponent(token),
            },
          }
        )
        .then((response) => {
          const productData = response.data;
          setProductInfo(productData);
        })
        .catch((error) => {
          console.log(`error`, error);
        });

      form.setFieldsValue({
        // 노출 여부
        status: rateplanInfo.status,
        // 요금제 이름
        name: rateplanInfo.name,
        // 이용 요금
        price: rateplanInfo.price,
        // 할인 요금
        dc_price: rateplanInfo.dc_price,
        // // 시작일
        start_date: moment(rateplanInfo.start_date),
        // // 종료일
        end_date: moment(rateplanInfo.end_date),
        // 게스트 요금
        guest_price: rateplanInfo.guest_price,
      });
    }
  }, [rateplanInfo]);

  useEffect(() => {
    // 요금제에 붙어있는 상품 정보 세팅되면
    if (productInfo) {
      console.log(`productInfo`, productInfo);
      // 요금제 - 상품의 값 상품 구분에 세팅하고
      form.setFieldsValue({
        product_type: productInfo.item.type,
      });
      // 그에 해당하는 옵션 리스트 조회
      getOptionProductList(productInfo.item.type);

      const spotList = [];

      // 스팟 리스트 조회해 와서 세팅하고
      productInfo.item.maps.map((spotInfo) => {
        console.log(`spotInfo`, spotInfo);
        // console.log(`spot`, spot);
        const spotObj = {
          spot_id: spotInfo.spot.spot_id,
          spot_name: spotInfo.spot.name,
          price: "",
          dc_price: "",
          total: "",
        };

        spotList.push(spotObj);
      });

      setRateplanTableData(spotList);

      console.log(`in pro rateplanInfo`, rateplanInfo);
    }
  }, [productInfo]);

  const [isTableSetting, setIsTableSetting] = useState(false);

  useEffect(() => {
    if (rateplanTableData && !registerMode && !isTableSetting) {
      const spot_prices = rateplanInfo.spot_prices;

      const tempTableData = [...rateplanTableData];

      if (spot_prices && spot_prices.length > 0) {
        spot_prices.map((spotPrice) => {
          const index = tempTableData.findIndex(
            (item) => spotPrice.spot_id === item.spot_id
          );

          const item = tempTableData[index];

          tempTableData.splice(index, 1, {
            ...item,
            price: spotPrice.price,
            dc_price: spotPrice.dc_price,
            total: Number(spotPrice.price) - Number(spotPrice.dc_price),
          });
        });

        // 무한 루프 방지용 state
        setIsTableSetting(true);

        console.log(`tempTableData`, tempTableData);
        setRateplanTableData(tempTableData);
      }
    }
  }, [rateplanTableData]);

  // 상품 구분에 따라 option 상품 리스트 조회
  const getOptionProductList = (type) => {
    console.log(`type`, type);
    axios
      .post(
        `${process.env.BACKEND_API}/admin/product/list`,
        { page: 1, size: 100, status: "active", type: type },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const productList = response.data.items;
        setOptionProductList(productList);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  useEffect(() => {
    console.log(`optionProductList`, optionProductList);
    // 옵션 상품 리스트가 조회되었고, detail로 들어와서 상품 정보도 있는 경우
    if (optionProductList && productInfo) {
      console.log(`optionProductList`, optionProductList);
      // 유저가 상품 구분을 변경해서 상품이 없는 type을 선택했을 경우
      if (optionProductList.length === 0) {
        console.log("1");
        form.setFieldsValue({
          product_id: null,
        });
      } else if (optionProductList[0].type !== productInfo.item.type) {
        console.log("2");
        // 유저가 상품 구분을 변경했을 경우
        form.setFieldsValue({
          product_id: null,
        });
      } else {
        // 상품 상세에 처음 들어와서, 상품 ID를 가지고 해당 타입을 찾고 옵션 세팅을 마쳤을 경우
        form.setFieldsValue({
          product_id: productInfo.item.product_id,
        });
      }
    }
  }, [optionProductList]);

  // 저장 버튼 클릭
  const handleSpotRegisterSubmit = (values) => {
    let url = "";

    console.log(`values`, values);

    let data = {
      status: values.status,
      name: values.name,
      product_id: values.product_id,
      // price: values.price,
      // dc_price: values.dc_price,
      start_date: moment(values.start_date).format("YYYY-MM-DD"),
      end_date: moment(values.end_date).format("YYYY-MM-DD"),
      // guest_price: values.guest_price,
    };

    console.log(`rateplanTableData`, rateplanTableData);

    const price = rateplanTableData.filter(
      (dataObject) => dataObject.price !== ""
    );

    if (price && price.length > 0) {
      if (isService) {
        data.price = price[0].price;
        data.dc_price = price[0].dc_price;
        // 부가서비스 요금제일 경우
      } else {
        data.spot_prices = price;
      }
    }

    if (registerMode) {
      url = `${process.env.BACKEND_API}/admin/product/rateplan/add`;
    } else {
      data.rateplan_id = Number(rateplanId);
      url = `${process.env.BACKEND_API}/admin/product/rateplan/update`;
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
          setOkModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 상품 구분 변경
  const handleProductTypeChange = (type) => {
    if (type === "service") {
      setIsService(true);
    } else {
      setIsService(false);
    }

    // 상품 구분에 따른 option list 재호출
    getOptionProductList(type);
  };

  // 상품명 선택
  const handleProductSelect = (value, record) => {
    console.log(`record`, record);

    if (isService) {
      setRateplanTableData([
        {
          spot_id: value,
          spot_name: record.childern,
          price: "",
          dc_price: "",
          total: "",
        },
      ]);
    } else {
      getProductSpots(value);
    }
  };

  const getProductSpots = (productId) => {
    axios
      .get(`${process.env.BACKEND_API}/admin/product/get/${productId}`, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: decodeURIComponent(token),
        },
      })
      .then((response) => {
        const item = response.data.item;
        console.log(`item`, item);

        if (item.maps && item.maps.length > 0) {
          let spotList = [];

          item.maps.map((spotInfo) => {
            console.log(`spotInfo`, spotInfo);
            // console.log(`spot`, spot);
            const spotObj = {
              spot_id: spotInfo.spot.spot_id,
              spot_name: spotInfo.spot.name,
              price: "",
              dc_price: "",
              total: "",
            };

            spotList.push(spotObj);
          });

          console.log(`spotList`, spotList);
          setRateplanTableData(spotList);
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 요금제 editable table 관련 함수

  const isEditing = (record) => record.spot_id === editingSpotId;

  const edit = (record) => {
    setEditingSpotId(record.spot_id);
  };

  const save = async (key) => {
    try {
      // validateFields() 하면 promise가 return
      // await로 받으면 table에 입력된 값이 확인된다.
      const row = await tableForm.validateFields();

      const newData = [...rateplanTableData];
      // 데이터 변경한 row의 index 찾고
      const index = rateplanTableData.findIndex((item) => key === item.spot_id);
      // 데이터 특정해서
      const item = newData[index];

      // 기존 배열에서 그 row 값만 변경
      newData.splice(index, 1, {
        ...item,
        ...row,
        total: row.price - row.dc_price,
      });

      setRateplanTableData(newData);
      setEditingSpotId("");
    } catch (error) {}
  };

  // 컬럼
  const rateBySpotListColumns = [
    {
      title: "",
      dataIndex: "spot_name",
    },
    {
      title: "상품 요금(A)",
      dataIndex: "price",
      editable: true,
    },
    {
      title: "할인액(B)",
      dataIndex: "dc_price",
      editable: true,
    },
    {
      title: "합계 금액 (A-B)",
      dataIndex: "total",
    },
    {
      title: "",
      dataIndex: "operation",
      render: (text, record) => {
        const editable = isEditing(record);

        console.log(`editable`, editable);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.spot_id)}
              style={{
                marginRight: 8,
              }}
            >
              저장
            </a>
            <Popconfirm
              title="취소하시겠습니까?"
              onConfirm={() => {
                setEditingSpotId("");
              }}
            >
              <a>취소</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            onClick={() => {
              edit(record);
            }}
          >
            수정
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = rateBySpotListColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="요금제 상세" key="1">
          <Card
            title={
              rateplanId && rateplanId !== null
                ? `요금제 ID ${rateplanId}`
                : "요금제 등록"
            }
            extra={<a onClick={() => router.back()}>뒤로 가기</a>}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSpotRegisterSubmit}
            >
              <Card>
                <Form.Item name="status" label="노출 여부">
                  <Radio.Group>
                    <Radio style={radioStyle} value={"active"}>
                      노출
                    </Radio>
                    <Radio style={radioStyle} value={"inactive"}>
                      비노출
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Card>
              <Card>
                <Form.Item name="name" label="요금제 이름">
                  <Input />
                </Form.Item>
                <Form.Item name="product_type" label="상품 구분">
                  <Select
                    style={{ width: 120 }}
                    onChange={handleProductTypeChange}
                  >
                    <Select.Option value="membership">멤버십</Select.Option>
                    <Select.Option value="service">부가서비스</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="product_id" label="상품 명">
                  <Select style={{ width: 120 }} onChange={handleProductSelect}>
                    {optionProductList.map((product) => (
                      <Select.Option
                        key={product.product_id}
                        value={product.product_id}
                      >
                        {product.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="start_date" label="시작일">
                  <DatePicker placeholder="시작일" />
                </Form.Item>
                <Form.Item name="end_date" label="종료일">
                  <DatePicker placeholder="종료일" />
                </Form.Item>
              </Card>
              {/* <Form.Item name="guest_price" label="게스트 요금">
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item> */}
              <Card>
                <Form form={tableForm} component={false}>
                  <Table
                    components={{
                      body: {
                        cell: ({
                          editing,
                          dataIndex,
                          title,
                          record,
                          index,
                          children,
                          ...restProps
                        }) => {
                          return (
                            <td {...restProps}>
                              {editing ? (
                                <Form.Item
                                  name={dataIndex}
                                  rules={[
                                    {
                                      required: true,
                                      message: `${title}을 입력해주세요`,
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                  />
                                </Form.Item>
                              ) : (
                                children
                              )}
                            </td>
                          );
                        },
                      },
                    }}
                    bordered
                    dataSource={rateplanTableData}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                  />
                </Form>
              </Card>
              <>
                <Button type="primary" htmlType="submit">
                  저장
                </Button>
                <Modal
                  visible={okModalVisible}
                  okText="확인"
                  onOk={() => {
                    router.push("/rateplan");
                  }}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
                  {registerMode ? "요금제 등록 완료" : "요금제 수정 완료"}
                </Modal>
              </>
            </Form>
          </Card>

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

export default connect((state) => state)(RateplanDetail);
