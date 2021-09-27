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

// 요금제 상세 - 지점별 상품 요금 테이블 컬럼
// 구현 단계에서 state 활용 필요해 RateplanDetail.js 내부로 이동
// export const rateBySpotListColumns = [
//   {
//     title: "",
//     dataIndex: "spot_name",
//   },
//   {
//     title: "상품 요금(A)",
//     dataIndex: "price",
//     editable: true,
//     onCell: () => ({
//       editing: true,
//     }),

//     // render: (text, record) => {
//     //   let renderText = "";

//     //   if (text.type === "membership") {
//     //     renderText = "멤버십";
//     //   } else if (text.type === "service") {
//     //     renderText = "부가서비스";
//     //   } else if (text.type === "voucher") {
//     //     renderText = "이용권";
//     //   }

//     //   return renderText;
//     // },
//   },
//   {
//     title: "할인액(B)",
//     dataIndex: "dc_price",
//     editable: true,
//     // render: (text, record) => {
//     //   return text.name;
//     // },
//     onCell: () => ({
//       editing: false,
//     }),
//   },
//   {
//     title: "합계 금액 (A-B)",
//     dataIndex: "total",
//     render: (text, record) => {
//       return <a href={`/rateplan/${record.rateplan_id}`}>{text}</a>;
//     },
//   },
//   {
//     title: "",
//     dataIndex: "operation",
//     render: (text, record) => {
//       return (
//         <Typography.Link
//           onClick={() => {
//             console.log(`record`, record);
//           }}
//         >
//           수정
//         </Typography.Link>
//       );
//       // const editable =
//       // return <a href={`/rateplan/${record.rateplan_id}`}>{text}</a>;
//     },
//   },
// ];
