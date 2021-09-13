import { Button } from "antd";

// 쿠폰 관리 리스트
// api 주소
export const couponListcolumns = [
  {
    title: "쿠폰 ID",
    dataIndex: "id",
  },
  {
    title: "쿠폰명",
    dataIndex: "name",
  },
  {
    title: "쿠폰 유형",
    dataIndex: "type",
  },
  {
    title: "활성/비활성",
    dataIndex: "status",
  },
  {
    title: "쿠폰 구분",
    dataIndex: "email",
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "email",
  },
  {
    title: "할인액",
    dataIndex: "amount",
  },
  {
    title: "할인 비율",
    dataIndex: "rate",
  },
  {
    title: "적용 상품 id",
    dataIndex: "email",
  },
  {
    title: "발행량",
    dataIndex: "email",
  },
  {
    title: "발급 현황",
    dataIndex: "email",
  },
  {
    title: "사용 현황",
    dataIndex: "email",
  },
  {
    title: "발행 시작일",
    dataIndex: "email",
  },
  {
    title: "발행 종료일",
    dataIndex: "email",
  },
  {
    title: "생성 일시",
    dataIndex: "email",
  },
];

// 쿠폰 자동 발급 리스트
export const couponAutoListcolumns = [
  {
    title: "자동 발급 ID",
    dataIndex: "id",
  },
  {
    title: "쿠폰명",
    dataIndex: "name",
  },
  {
    title: "자동 발급 상태",
    dataIndex: "status",
  },
  {
    title: "대상",
    dataIndex: "target",
  },
  {
    title: "유형",
    dataIndex: "type",
  },
  {
    title: "적용 쿠폰 id",
    dataIndex: "coupon_id",
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "description",
  },
  {
    title: "할인액",
    dataIndex: "amount",
  },
  {
    title: "할인 비율",
    dataIndex: "rate",
  },
  {
    title: "발급량",
    dataIndex: "email",
  },
  {
    title: "생성 일시",
    dataIndex: "email",
  },
];

// 쿠폰 직접 발급 리스트
export const couponDirectListcolumns = [
  {
    title: "직접발급 ID",
    dataIndex: "id",
  },
  {
    title: "쿠폰명",
    dataIndex: "name",
  },
  {
    title: "직접발급 상태",
    dataIndex: "status",
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "email",
  },
  {
    title: "쿠폰 유형",
    dataIndex: "type",
  },
  {
    title: "할인액",
    dataIndex: "amount",
  },
  {
    title: "할인 비율",
    dataIndex: "rate",
  },
  {
    title: "발급량",
    dataIndex: "email",
  },
  {
    title: "발급 방식",
    dataIndex: "email",
  },
  {
    title: "발급 일시",
    dataIndex: "email",
  },
  {
    title: "",
    dataIndex: "",
    render: (text, record) => {
      return <Button>환불</Button>;
    },
  },
];
