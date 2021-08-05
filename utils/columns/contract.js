// 계약 리스트 컬럼 정의
// /admin/contract/list

export const contractListColumns = [
  {
    title: "계약 ID",
    dataIndex: "contract_id",
  },
  {
    title: "계약자명",
    dataIndex: "user",
    render: (text, record) => {
      return (
        <a href={`/contract/${record.contract_id}`}>
          {`${text.user_name}(${text.uid})`}
        </a>
      );
    },
  },
  {
    title: "계약 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "buy":
          renderText = "계약 신청";
          break;
        case "canceled":
          renderText = "계약 취소";
          break;
        case "pay":
          renderText = "계약 완료(이용중)";
          break;
        case "expired":
          renderText = "계약 해지 (만료)";
          break;
        case "terminate":
          renderText = "계약 해지 (중도)";
          break;
        case "withdraw":
          renderText = "계약 해지 (청약 철회)";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  // {
  //   title: "그룹",
  //   dataIndex: "group_id",
  // },
  {
    title: "상품",
    dataIndex: "rateplan",
    render: (text, record) => {
      return text.product.name;
    },
  },
  {
    title: "선호 지점",
    dataIndex: "favorite_spot",
    render: (text, record) => {
      return text ? text : "-";
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
    title: "취소일",
    dataIndex: "cancel_date",
  },
  {
    title: "해지일",
    dataIndex: "expired_date",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
