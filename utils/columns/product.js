// productListColumns 요일 render 함수
const renderWorkingDays = (value, row, index) => {
  let workingDays = [];

  Object.entries(value).filter((obj) => {
    if (obj[1]) {
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
    title: "멤버십 유형",
    dataIndex: "service_type",
    render: (text, record) => {
      let renderText = "";
      if (text === "accumulate") {
        renderText = "기본형";
      } else if (text === "deduction") {
        renderText = "차감형";
      }

      return renderText;
    },
  },
  {
    title: "결제 유형",
    dataIndex: "pay_demand",
    render: (text, record) => {
      let renderText = "";
      if (text === "pre") {
        renderText = "선불";
      } else if (text === "deffered") {
        renderText = "후불";
      }

      return renderText;
    },
  },
  {
    title: "요일",
    dataIndex: "working_days",
    render: renderWorkingDays,
  },
  {
    title: "시작시간",
    dataIndex: "start_time",
  },
  {
    title: "종료시간",
    dataIndex: "end_time",
  },
  {
    title: "사용 가능 공간ID",
    dataIndex: "spaces",
    render: (text, record) => {
      return text.join(", ");
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
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
