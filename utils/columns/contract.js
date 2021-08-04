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
      // console.log(`record`, record);
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

      if (text === "wait") {
        renderText = "계약 신청(입금전)";
      } else if (text === "buy") {
        renderText = "계약 신청(이용전)";
      } else if (text === "pay") {
        renderText = "계약 완료(이용중)";
      } else if (text === "refund") {
        renderText = "계약 해지(환불)";
      } else if (text === "expired") {
        renderText = "계약 해지(만료)";
      } else if (text === "terminate") {
        renderText = "계약 해지(중도)";
      } else if (text === "canceled") {
        renderText = "계약 해지(취소)";
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
    dataIndex: "user",
    render: (text, record) => {
      let renderText = "-";
      if (text.fav_spot) {
      }

      return renderText;
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

// 유저 상세 - 청구 내역 컬럼 정의
// /admin/contract/list
export const userContractListColumns = [
  {
    title: "계약 ID",
    dataIndex: "contract_id",
  },
  {
    title: "계약 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "wait") {
        renderText = "계약 신청(입금전)";
      } else if (text === "buy") {
        renderText = "계약 신청(이용전)";
      } else if (text === "pay") {
        renderText = "계약 완료(이용중)";
      } else if (text === "refund") {
        renderText = "계약 해지(환불)";
      } else if (text === "expired") {
        renderText = "계약 해지(만료)";
      } else if (text === "terminate") {
        renderText = "계약 해지(중도)";
      } else if (text === "canceled") {
        renderText = "계약 해지(취소)";
      }

      return renderText;
    },
  },
  {
    title: "멤버십 상품",
    dataIndex: "rateplan",
    render: (text, record) => {
      return text.product.name;
    },
  },
  {
    title: "결제 방식",
    dataIndex: "rateplan",
    render: (text, record) => {
      const pay_method = text.product.pay_method;
      const renderText =
        pay_method === "credit_card" ? "카드 결제" : "계좌 이체";
      return renderText;
    },
  },
  {
    title: "결제 유형",
    dataIndex: "rateplan",
    render: (text, record) => {
      let renderText = "";

      if (text.product.pay_demand == "pre") {
        renderText = "선불";
      } else if (text.product.pay_demand == "deffered") {
        renderText = "후불";
      } else if (text.product.pay_demand == "last") {
        renderText = "말일 결제";
      }

      return renderText;
    },
  },
  {
    title: "시작일",
    dataIndex: "start_date",
  },
  {
    title: "정기 결제일",
    dataIndex: "next_paydate",
  },
  {
    title: "취소일",
    dataIndex: "cancel_date",
  },
  {
    title: "해지일",
    dataIndex: "teminate_date",
  },
  {
    title: "만료일",
    dataIndex: "expired_date",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
