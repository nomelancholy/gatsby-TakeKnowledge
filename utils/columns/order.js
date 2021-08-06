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

      switch (text.status) {
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
  {
    title: "그룹 유형",
    dataIndex: "user",
    render: (text, record) => {
      let renderText = "개인";

      if (text.user_role === "group") {
        renderText = `그룹`;
      }

      return renderText;
    },
  },
  {
    title: "상품 구분",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      switch (text.contract_type) {
        case "service":
          renderText = "부가서비스";
          break;
        case "membership":
          renderText = "멤버십";
          break;
        case "voucher":
          renderText = "이용권";
          break;
        default:
          break;
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
      return text.next_paydate ? text.next_paydate : "-";
    },
  },
  {
    title: "결제 방식",
    dataIndex: "order",
    render: (text, record) => {
      let renderText = "";

      switch (text.pay_method) {
        case "credit_card":
          renderText = "카드 결제";
          break;
        case "bank_transfer ":
          renderText = "계좌 이체";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "결제 유형",
    dataIndex: "order",
    render: (text, record) => {
      let renderText = "";

      switch (text.pay_demand) {
        case "pre":
          renderText = "선불";
          break;
        case "deffered":
          renderText = "후불";
          break;
        case "last":
          renderText = "말일 결제";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "청구상태",
    dataIndex: "order",
    render: (text, record) => {
      let renderText = "";

      switch (text.status) {
        case "purchased":
          renderText = "완료";
          break;
        case "end":
          renderText = "완료";
          break;
        case "unpaid":
          renderText = "미납";
          break;
        case "wait":
          renderText = "예정";
          break;
        case "refund":
          renderText = "환불";
          break;
        case "canceled":
          renderText = "취소";
          break;
        default:
          break;
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

      switch (text.status) {
        case "wait":
          renderText = "예정";
          break;
        case "buy":
          renderText = "완료";
          break;
        case "fail":
          renderText = "실패";
          break;
        case "refund":
          renderText = "환불";
          break;
        default:
          break;
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

// 청구 상세 - 청구 항목
export const orderItmesColumns = [
  {
    title: "항목",
    dataIndex: "name",
    // render: (text, record) => {
    //   const renderText = `${text.order_id}`;
    //   return renderText;
    // },
  },
  {
    title: "할인쿠폰",
    dataIndex: "coupon",
    // render: (text, record) => {
    //   const renderText = `${text.order_id}`;
    //   return renderText;
    // },
  },
  {
    title: "금액",
    dataIndex: "amount",
    // render: (text, record) => {
    //   const renderText = `${text.order_id}`;
    //   return renderText;
    // },
  },
  {
    title: "청구 일자",
    dataIndex: "order_date",
    // render: (text, record) => {
    //   const renderText = `${text.order_id}`;
    //   return renderText;
    // },
  },
  {
    title: "청구 사유",
    dataIndex: "reason",
    render: (text, record) => {
      return <Input style={{ width: 160 }}></Input>;
    },
  },
];

// 청구 상세 - 청구서
export const billingColumns = [
  {
    title: "청구 ID",
    dataIndex: "order",
    render: (text, record) => {
      const renderText = `${text.order_id}`;
      return renderText;
    },
  },
  {
    title: "처리 상태",
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
  {
    title: "발송 시간",
    dataIndex: "group_id",
  },
  {
    title: "email 발송 상태",
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
    title: "파일명",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "등록자",
    dataIndex: "contract",
    render: (text, record) => {
      console.log(`text`, text);
      return text.next_paydate;
    },
  },
  {
    title: "다운로드",
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
];

// 청구 상세 - 청구 결제 내역
// /admin/contract/payment/list
export const paymentColumns = [
  {
    title: "결제 ID",
    dataIndex: "payment_id",
  },
  {
    title: "결제 카드",
    dataIndex: "user_paymethod",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "결제 유형",
    dataIndex: "user_paymethod",
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
    title: "결제 방식",
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
    title: "결제 금액",
    dataIndex: "total",
    render: (text, record) => {
      return text.toLocaleString("ko");
    },
  },
  {
    title: "결제 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "wait") {
        renderText = "대기(예정), 결제일 전";
      } else if (text === "buy") {
        renderText = "결제";
      } else if (text === "unpaid") {
        renderText = "미납, 결제일 후";
      } else if (text === "canceled") {
        renderText = "취소";
      } else if (text === "fail") {
        renderText = "실패";
      }

      return renderText;
    },
  },
  {
    title: "등록자",
    dataIndex: "",
    render: (text, record) => {
      return "System";
    },
  },
  {
    title: "등록 일시",
    dataIndex: "regdate",
  },
  {
    title: "환불",
    dataIndex: "",
    render: (text, record) => {
      return <Button>환불</Button>;
    },
  },
];

// 부가서비스 상세 - 청구 결제 정보
// /admin/contract/order/list
export const serviceOrderListColumns = [
  {
    title: "청구 ID",
    dataIndex: "order",
    render: (text, record) => {
      return <a href={`/order/${record.order.order_id}`}>{text.order_id}</a>;
    },
  },
  {
    title: "구분",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      if (text.contract_type === "membership") {
        renderText = "멤버십";
      } else if (text.contract_type === "service") {
        renderText = "부가서비스";
      } else if (text.contract_type === "voucher") {
        renderText = "이용권";
      }

      return renderText;
    },
  },
  {
    title: "청구 항목",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "청구 금액",
    dataIndex: "order",
    render: (text, record) => {
      return text.amount.toLocaleString("ko");
    },
  },
  {
    title: "청구일",
    dataIndex: "order",
    render: (text, record) => {
      return text.regdate;
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

// 계약 상세 - 청구 결제 정보
// /admin/contract/order/list
export const contractOrderColumns = [
  {
    title: "청구 ID",
    dataIndex: "order",
    render: (text, record) => {
      return <a href={`/order/${record.order.order_id}`}>{text.order_id}</a>;
    },
  },
  {
    title: "구분",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      if (text.contract_type === "membership") {
        renderText = "멤버십";
      } else if (text.contract_type === "service") {
        renderText = "부가서비스";
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
    title: "청구 금액",
    dataIndex: "order",
    render: (text, record) => {
      return text.amount.toLocaleString("ko");
    },
  },
  {
    title: "청구일",
    dataIndex: "order",
    render: (text, record) => {
      return text.regdate;
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
