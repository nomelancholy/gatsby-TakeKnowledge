// 청구/결제 리스트
// /admin/contract/order/list
export const orderListColumns = [
  {
    title: "청구 ID(계약 ID)",
    dataIndex: "order",
    render: (text, record) => {
      const renderText = `${text.order_id} (${record.contract.contract_id})`;
      return renderText;
    },
  },
  {
    title: "계약자명",
    dataIndex: "user",
    render: (text, record) => {
      console.log(`record`, record);
      return (
        <a href={`/order/${record.contract.contract_id}`}>
          {`${text.user_name}(${text.uid})`}
        </a>
      );
    },
  },
  {
    title: "계약 상태",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      if (text.status === "wait") {
        renderText = "계약 신청(입금전)";
      } else if (text.status === "buy") {
        renderText = "계약 신청(이용전)";
      } else if (text.status === "pay") {
        renderText = "계약 완료(이용중)";
      } else if (text.status === "refund") {
        renderText = "계약 해지(환불)";
      } else if (text.status === "expired") {
        renderText = "계약 해지(만료)";
      } else if (text.status === "terminate") {
        renderText = "계약 해지(중도)";
      } else if (text.status === "canceled") {
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
    title: "구분",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      if (text.contract_type === "service") {
        renderText = "부가서비스";
      } else if (text.contract_type === "membershipt") {
        renderText = "멤버십";
      } else if (text.contract_type === "voucher") {
        renderText = "이용권";
      }

      return renderText;
    },
  },
  {
    title: "상품명",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "정기 결제일",
    dataIndex: "contract",
    render: (text, record) => {
      console.log(`text`, text);
      return text.next_paydate;
    },
  },
  {
    title: "결제 방식",
    dataIndex: "pay_method",
    render: (text, record) => {
      let renderText = "";

      if (text.type == "personal") {
        renderText = "개인 카드 결제";
      } else {
        renderText = "법인 카드 결제";
      }

      return renderText;
    },
  },
  {
    title: "결제 유형",
    dataIndex: "product",
    render: (text, record) => {
      let renderText = "";

      if (text.pay_demand == "pre") {
        renderText = "선불";
      } else if (text.pay_demand == "deffered") {
        renderText = "후불";
      } else if (text.pay_demand == "last") {
        renderText = "말일 결제";
      }

      return renderText;
    },
  },
  {
    title: "청구상태",
    dataIndex: "order",
    render: (text, record) => {
      let renderText = "";

      if (text.status == "purchase") {
        renderText = "성공";
      } else if (text.status == "canceled") {
        renderText = "취소";
      } else if (text.status == "end") {
        renderText = "종료";
      }

      return renderText;
    },
  },
  {
    title: "청구 금액",
    dataIndex: "order",
    render: (text, record) => {
      return text.amount.toLocaleString("ko-KR");
    },
  },
  {
    title: "결제 금액",
    dataIndex: "payment",
    render: (text, record) => {
      return text.total.toLocaleString("ko-KR");
    },
  },
  {
    title: "결제 상태",
    dataIndex: "payment",
    render: (text, record) => {
      let renderText = "";

      if (text.status == "wait") {
        renderText = "대기";
      } else if (text.status == "buy") {
        renderText = "결제";
      } else if (text.status == "unpaid") {
        renderText = "미납";
      } else if (text.status == "canceld") {
        renderText = "취소";
      }

      return renderText;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "order",
    render: (text, record) => {
      return text.regdate;
    },
  },
];
