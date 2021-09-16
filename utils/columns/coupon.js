import { Button } from "antd";

// 쿠폰 관리 리스트
// api 주소
export const couponListcolumns = [
  {
    title: "쿠폰 ID",
    dataIndex: "coupon_id",
    render: (text, record) => {
      return <a href={`/coupon/${text}`}>{text}</a>;
    },
  },
  {
    title: "쿠폰명",
    dataIndex: "name",
  },
  {
    title: "쿠폰 유형",
    dataIndex: "coupon_type",
    render: (text, record) => {
      let renderText = "";

      if (text === "flat") {
        renderText = "정액 할인";
      } else if (text === "ratio") {
        renderText = "비율 할인";
      }

      return renderText;
    },
  },
  {
    title: "활성/비활성",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "active") {
        renderText = "활성";
      } else if (text === "inactive") {
        renderText = "비활성";
      }

      return renderText;
    },
  },
  {
    title: "쿠폰 구분",
    dataIndex: "coupon_category",
    render: (text, record) => {
      let renderText = "";

      if (text === "meeting") {
        renderText = "미팅룸";
      } else if (text === "coworking") {
        renderText = "코워킹룸";
      } else if (text === "locker") {
        renderText = "락커룸";
      } else if (text === "lounge") {
        renderText = "라운지";
      } else if (text === "membership") {
        renderText = "멤버쉽";
      }

      return renderText;
    },
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "desc",
  },
  {
    title: "할인액",
    dataIndex: "discount",
    render: (text, record) => {
      let renderText = "";

      if (record.coupon_type === "flat") {
        renderText = text.toLocaleString("ko-KR");
      }

      return renderText;
    },
  },
  {
    title: "할인 비율",
    dataIndex: "discount",
    render: (text, record) => {
      let renderText = "";

      if (record.coupon_type === "ratio") {
        renderText = text;
      }

      return renderText;
    },
  },
  {
    title: "적용 상품 id",
    dataIndex: "product_ids",
    render: (text, record) => {
      let renderText = "";

      let array = [];

      if (text && text.length > 0) {
        array = text.split("|");

        renderText = array.join(", ");
      }

      return renderText;
    },
  },
  {
    title: "발행량",
    dataIndex: "total",
    render: (text, record) => {
      return text.toLocaleString("ko-KR");
    },
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
    dataIndex: "pub_date_start",
  },
  {
    title: "발행 종료일",
    dataIndex: "pub_date_end",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
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

// 쿠폰 발급 결과

export const couponResultColumns = [
  {
    title: "쿠폰 이름",
    dataIndex: "id",
  },
  {
    title: "이메일",
    dataIndex: "name",
  },
  {
    title: "쿠폰 상태",
    dataIndex: "status",
  },
  {
    title: "사용자 상태",
    dataIndex: "email",
  },
  {
    title: "발급 방식",
    dataIndex: "type",
  },
  {
    title: "발급 일시",
    dataIndex: "amount",
  },
  {
    title: "개별 쿠폰 코드",
    dataIndex: "rate",
  },
];
