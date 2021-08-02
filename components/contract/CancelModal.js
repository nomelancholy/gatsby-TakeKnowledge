import {
  Button,
  Form,
  Input,
  Row,
  Modal,
  Card,
  Radio,
  Table,
  Col,
  Tabs,
  Select,
  DatePicker,
  Pagination,
  Anchor,
} from "antd";

import React, { useState, useEffect } from "react";

import { contractOrderColumns } from "@utils/columns/order";

const ContractCancelModal = (props) => {
  const {
    visible,
    setVisible,
    contractDetail,
    orderList,
    pagination,
    setPagination,
  } = props;

  const radioStyle = {
    display: "inline",
    height: "30px",
    lineHeight: "30px",
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 해지 유형
  const [terminateTypeForm] = Form.useForm();

  // 월 이용 요금 일할 계산 & 위약금
  const [monthlyCostCalculateForm] = Form.useForm();

  // 계약 상태
  const [contractStatusForm] = Form.useForm();
  return (
    <Modal
      width={1000}
      visible={visible}
      okText="해지 완료"
      cancelText="취소"
      onOk={() => {
        // router.push("/payment");
      }}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Card title={"계약 취소/해지"} style={{ width: 800 }}>
        <Card title={"월 정기 납부 내역"}>
          <Table
            size="middle"
            columns={contractOrderColumns}
            rowKey={(record) => record.order.order_id}
            dataSource={orderList}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Card>
        <Card title={"해지 유형"}>
          <Form form={terminateTypeForm}>
            <Form.Item>
              <Input></Input>
            </Form.Item>
            <Form.Item label="계약 신청일">
              <Input></Input>
            </Form.Item>
            <Form.Item label="계약 시작일">
              <Input></Input>
            </Form.Item>
            <Form.Item label="청구 일">
              <Input></Input>
            </Form.Item>
            <Form.Item label="계약 해지일">
              <DatePicker></DatePicker>
            </Form.Item>
          </Form>
        </Card>
        <Card title={"월 이용 요금 일할 계산 & 위약금"}>
          <Form form={monthlyCostCalculateForm}>
            <Form.Item name="order_item" label="청구 시작일">
              <Select>
                <Select.Option value="membership">멤버십</Select.Option>
                <Select.Option value="coworking">코워킹룸</Select.Option>
                <Select.Option value="locker">스마트 락커</Select.Option>
                <Select.Option value="penalty">패널티</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="order_date" label="청구 종료일">
              <DatePicker></DatePicker>
            </Form.Item>
            <Form.Item namme="memo" label="계약 해지일 (=계약 해지 예정일)">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item namme="total" label="월 이용 요금(A)">
              <Input disabled />
            </Form.Item>
            <Form.Item
              namme="total"
              label="사용 일수(청구 시작일 ~ 계약 해지일)"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              namme="total"
              label="일할 이용 요금 (B) * (월 이용료/(청구 종료일 - 해지일)) * 사용일수"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item namme="total" label="해지 위약금(C) * (월 이용료 * 0.1)">
              <Input disabled />
            </Form.Item>
            <Form.Item namme="total" label="환불 금액 (A-B-C)">
              <Input disabled />
            </Form.Item>
          </Form>
        </Card>
        <Card>
          <Form form={contractStatusForm}>
            <Form.Item name="status">
              <Radio.Group>
                <Radio style={radioStyle} value={"cancel"}>
                  월 정기 해지
                </Radio>
                <Radio style={radioStyle} value={"withdraw"}>
                  청약 철회 해지
                </Radio>
                <Radio style={radioStyle} value={"default"}>
                  전체 환불
                </Radio>
                <Radio style={radioStyle} value={"drop"}>
                  일할 계산
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
      </Card>
    </Modal>
  );
};

export default ContractCancelModal;
