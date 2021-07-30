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
    title: "계약자명",
    dataIndex: "user",
    render: (text, record) => {
      return (
        <a href={`/service/${record.schedule.schedule_id}`}>
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

      const status = text.status;

      if (status === "wait") {
        renderText = "계좌이체 대기";
      } else if (status === "buy") {
        renderText = "구매";
      } else if (status === "pay") {
        renderText = "이용중";
      } else if (status === "refund") {
        renderText = "환불";
      } else if (status === "expired") {
        renderText = "종료";
      } else if (status === "terminate") {
        renderText = "해지";
      } else if (status === "canceled") {
        renderText = "취소";
      }

      return renderText;
    },
  },
  {
    title: "부가서비스",
    dataIndex: "space",
    render: (text, record) => {
      let renderText = "";

      // console.log(`record`, record);

      // console.log(`text.product`, text.product.type);
      // console.log(`type`, type);

      const type = text.type;

      // console.log(`type`, type);

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
    title: "사용 시간",
    dataIndex: "time_diff",
    // render: (text, record) => {
    //   let renderText = "";

    //   if (text.product.time_unit === "day") {
    //     const endDate = new Date(record.end_date);
    //     const startDate = new Date(record.start_date);

    //     const diffDate =
    //       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) +
    //       1;

    //     renderText = `${diffDate} 일`;
    //   } else {
    //     const diffTimes = text.product.end_time - text.product.start_time;
    //     renderText = `${diffTimes} 시간`;
    //   }

    //   return renderText;
    // },
  },
  {
    title: "사용 지점",
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
    title: "결제일",
    dataIndex: "payment",
    render: (text, record) => {
      const payDate = text.regdate.split(" ")[0];
      return payDate;
    },
  },
  {
    title: "사용 시작일",
    dataIndex: "contract",
    render: (text, record) => {
      return text.start_date;
    },
  },
  {
    title: "사용 종료일",
    dataIndex: "contract",
    render: (text, record) => {
      return text.end_date;
    },
  },
  {
    title: "취소일시",
    dataIndex: "contract",
    render: (text, record) => {
      return text.cancel_date;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "contract",
    render: (text, record) => {
      return text.regdate;
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
