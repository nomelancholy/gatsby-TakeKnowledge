// productListColumns 요일 render 함수
const renderWorkingDays = (value, row, index) => {
  // console.log(`value`, value);
  // console.log(`row`, row);
  // console.log(`index`, index);
  let workingDays = [];
  let dayCheckFlag = false;

  Object.entries(value).filter((obj) => {
    if (obj[1]) {
      dayCheckFlag = true;
      workingDays.push(obj[0]);
    }
  });

  const startDay = covertEngDayToKorDay(workingDays[0]);
  const endDay = covertEngDayToKorDay(workingDays[workingDays.length - 1]);

  const renderDay = `${startDay}~${endDay}`;

  return renderDay;
};

const covertEngDayToKorDay = (value) => {
  switch (value) {
    case "mon":
      return "월";
    case "tue":
      return "화";
    case "wed":
      return "수";
    case "thu":
      return "목";
    case "fri":
      return "금";
    case "sat":
      return "토";
    case "sun":
      return "일";
    default:
      break;
  }
};

// 상품 관리 리스트
// /admin/product/list
export const productListColumns = [
  {
    title: "상품 ID",
    dataIndex: "product_id",
  },
  {
    title: "상품 구분",
    dataIndex: "type",
    render: (text, record) => {
      let renderText = "";
      if (text === "membership") {
        renderText = "멤버십";
      } else if (text === "service") {
        renderText = "부가서비스";
      } else if (text === "voucher") {
        renderText = "이용권";
      }

      return renderText;
    },
  },

  {
    title: "상품명",
    dataIndex: "name",
    render: (text, record) => {
      return <a href={`/product/${record.product_id}`}>{text}</a>;
    },
  },

  {
    title: "상품 카테고리",
    dataIndex: "category",
  },
  {
    title: "정산 유형",
    dataIndex: "service_type",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "accumulate":
          renderText = "기본형";
          break;
        case "deduction":
          renderText = "차감형";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "하위 스팟 권한 범위",
    dataIndex: "plan_spot",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "many":
          renderText = "전체";
          break;
        case "single":
          renderText = "택 1";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "포함된 스팟 수",
    dataIndex: "spaces",
    render: (text, record) => {
      return text.length;
    },
  },
  {
    title: "차감 단위",
    dataIndex: "service_unit",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "day":
          renderText = "일";
          break;
        case "hour":
          renderText = "시간";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "권한 제공 기간",
    dataIndex: "period_amount",
  },
  {
    title: "권한 제공 기간 단위",
    dataIndex: "time_unit",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "hour":
          renderText = "시간";
          break;
        case "day":
          renderText = "일";
          break;
        case "month":
          renderText = "월";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];

// 계약 상세 - 이용 내역 정보
const contractVoucherColumns = [
  {
    title: "이용 ID",
    dataIndex: "order",
    render: (text, record) => {
      const renderText = `${text.order_id} (${record.contract.contract_id})`;
      return renderText;
    },
  },
  {
    title: "구분",
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
    title: "상품명",
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
    title: "유형",
    dataIndex: "group_id",
  },
  {
    title: "요일",
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
    title: "시간제",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "시작일",
    dataIndex: "contract",
    render: (text, record) => {
      console.log(`text`, text);
      return text.next_paydate;
    },
  },
  {
    title: "종료일",
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
    title: "사용일수",
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
    title: "사용 지점",
    dataIndex: "product",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "사용 공간",
    dataIndex: "contract",
    render: (text, record) => {
      console.log(`text`, text);
      return text.next_paydate;
    },
  },
  {
    title: "이용 상태",
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
    title: "생성 일시",
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
];
