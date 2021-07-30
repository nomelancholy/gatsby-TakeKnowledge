// 요금제 관리 리스트
// /admin/product/rateplan/list

export const rateplanListColumns = [
  {
    title: "요금제 ID",
    dataIndex: "rateplan_id",
  },
  {
    title: "상품 그룹",
    dataIndex: "product",
    render: (text, record) => {
      let renderText = "";

      if (text.type === "membership") {
        renderText = "멤버십";
      } else if (text.type === "service") {
        renderText = "부가서비스";
      } else if (text.type === "voucher") {
        renderText = "이용권";
      }

      return renderText;
    },
  },
  {
    title: "상품 명",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "요금제 이름",
    dataIndex: "name",
    render: (text, record) => {
      return <a href={`/rateplan/${record.rateplan_id}`}>{text}</a>;
    },
  },
  {
    title: "이용 요금",
    dataIndex: "price",
    render: (text, record) => {
      return text.toLocaleString("ko-KR");
    },
  },
  {
    title: "기본 할인 요금",
    dataIndex: "dc_price",
    render: (text, record) => {
      return text.toLocaleString("ko-KR");
    },
  },
  {
    title: "시작일",
    dataIndex: "start_date",
  },
  {
    title: "종료일",
    dataIndex: "end_date",
  },
  {
    title: "노출 여부",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";
      if (text === "active") {
        renderText = "노출";
      } else if (text === "inactive") {
        renderText = "미노출";
      }

      return renderText;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
