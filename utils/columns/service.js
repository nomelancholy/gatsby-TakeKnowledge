// 부가서비스 예약 관리 리스트
// /admin/contract/service/list
export const serviceListColumns = [
  {
    title: "예약 ID",
    dataIndex: "schedule",
    render: (text, record) => {
      return text.schedule_id;
    },
  },
  {
    title: "사용자",
    dataIndex: "user",
    render: (text, record) => {
      return (
        <a href={`/service/${record.schedule.schedule_id}`}>
          {`${text.user_name}(${text.uid})`}
        </a>
      );
    },
  },
  // 2차
  // {
  //   title: "신청자",
  //   dataIndex: "user",
  //   render: (text, record) => {
  //     return (
  //       <a href={`/service/${record.schedule.schedule_id}`}>
  //         {`${text.user_name}(${text.uid})`}
  //       </a>
  //     );
  //   },
  // },
  {
    title: "예약 상태",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      switch (text.status) {
        case "buy":
          renderText = "예약";
          break;
        case "canceled":
          renderText = "예약 취소";
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
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "상품 유형",
    dataIndex: "space",
    render: (text, record) => {
      let renderText = "";

      const type = text.type;

      switch (type) {
        case "lounge":
          renderText = "라운지";
          break;
        case "meeting":
          renderText = "미팅룸";
          break;
        case "coworking":
          renderText = "코워킹룸";
          break;
        case "locker":
          renderText = "락커";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "상품명",
    dataIndex: "space",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "지점명",
    dataIndex: "spot",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "금액",
    dataIndex: "payment",
    render: (text, record) => {
      // const price = (text.price - text.dc_price).toLocaleString("ko-KR");
      // return price;
      return text.total;
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
    title: "생성 시간",
    dataIndex: "schedule",
    render: (text, record) => {
      return text.regdate;
    },
  },
  {
    title: "시작 시간",
    dataIndex: "schedule",
    render: (text, record) => {
      return text.start_time.split(" ")[0];
    },
  },
  {
    title: "종료 시간",
    dataIndex: "schedule",
    render: (text, record) => {
      return text.end_time.split(" ")[0];
    },
  },
  {
    title: "취소 시간",
    dataIndex: "schedule",
    render: (text, record) => {
      return text.cancel_date;
    },
  },
];

// 계약 상세 - 부가 서비스 이용 정보
// /admin/contract/service/list
export const contractServiceColumns = [
  {
    title: "예약 ID",
    dataIndex: "schedule",
    render: (text, record) => {
      return <a href={`/service/${text.schedule_id}`}>{text.schedule_id}</a>;
    },
  },
  {
    title: "구분",
    dataIndex: "contract",
    render: (text, record) => {
      return "";
    },
  },
  {
    title: "상품명",
    dataIndex: "space",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "유형",
    dataIndex: "contract",
    render: (text, record) => {
      return "";
    },
  },
  {
    title: "요일",
    dataIndex: "product",
    render: (text, record) => {
      return "";
    },
  },
  {
    title: "시간제",
    dataIndex: "schedule",
    render: (text, record) => {
      let renderText = "";

      const startArray = text.start_time.split(" ");
      const endArray = text.end_time.split(" ");

      const startDate = startArray[0];
      const startTime = startArray[1];
      const endDate = endArray[0];
      const endTime = endArray[1];

      renderText = `${startTime}~${endTime}`;

      return renderText;
    },
  },
  {
    title: "시작일",
    dataIndex: "schedule",
    render: (text, record) => {
      let renderText = "";

      const startArray = text.start_time.split(" ");
      const endArray = text.end_time.split(" ");

      const startDate = startArray[0];
      const startTime = startArray[1];
      const endDate = endArray[0];
      const endTime = endArray[1];

      renderText = startDate;

      return renderText;
    },
  },
  {
    title: "종료일",
    dataIndex: "schedule",
    render: (text, record) => {
      let renderText = "";

      const startArray = text.start_time.split(" ");
      const endArray = text.end_time.split(" ");

      const startDate = startArray[0];
      const startTime = startArray[1];
      const endDate = endArray[0];
      const endTime = endArray[1];

      renderText = endDate;

      return renderText;
    },
  },
  {
    title: "사용일수",
    dataIndex: "time_diff",
  },
  {
    title: "사용 지점",
    dataIndex: "pay_method",
    // render: (text, record) => {
    //   let renderText = "";

    //   if (text.type == "personal") {
    //     renderText = "개인 카드 결제";
    //   } else {
    //     renderText = "법인 카드 결제";
    //   }

    //   return renderText;
    // },
  },
  {
    title: "사용 공간",
    dataIndex: "pay_method",
    // render: (text, record) => {
    //   let renderText = "";

    //   if (text.type == "personal") {
    //     renderText = "개인 카드 결제";
    //   } else {
    //     renderText = "법인 카드 결제";
    //   }

    //   return renderText;
    // },
  },
  {
    title: "생성 일시",
    dataIndex: "contract",
    render: (text, record) => {
      return text.regdate;
    },
  },
];
