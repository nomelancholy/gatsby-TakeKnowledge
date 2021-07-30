export const contractListColumns = [
  {
    title: "계약 ID",
    dataIndex: "contract_id",
  },
  {
    title: "계약자명",
    dataIndex: "user",
    render: (text, record) => {
      console.log(`record`, record);
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
    dataIndex: "-",
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

// 부가서비스 예약 관리 컬럼 정의
const serviceColumns = [
  {
    title: "예약 ID",
    dataIndex: "contract_id",
  },
  {
    title: "계약자명",
    dataIndex: "user",
    render: (text, record) => {
      return (
        <a href={`/service/${record.contract_id}`}>
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
        renderText = "계좌이체 대기";
      } else if (text === "buy") {
        renderText = "구매";
      } else if (text === "pay") {
        renderText = "이용중";
      } else if (text === "refund") {
        renderText = "환불";
      } else if (text === "expired") {
        renderText = "종료";
      } else if (text === "terminate") {
        renderText = "해지";
      } else if (text === "canceled") {
        renderText = "취소";
      }

      return renderText;
    },
  },
  {
    title: "부가서비스",
    dataIndex: "rateplan",
    render: (text, record) => {
      let renderText = "";

      // console.log(`record`, record);

      // console.log(`text.product`, text.product.type);
      // console.log(`type`, type);

      const type = text.product.type;

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
    dataIndex: "rateplan",
    render: (text, record) => {
      let renderText = "";

      if (text.product.time_unit === "day") {
        const endDate = new Date(record.end_date);
        const startDate = new Date(record.start_date);

        const diffDate =
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;

        renderText = `${diffDate} 일`;
      } else {
        const diffTimes = text.product.end_time - text.product.start_time;
        renderText = `${diffTimes} 시간`;
      }

      return renderText;
    },
  },
  {
    title: "사용 지점",
    dataIndex: "spot_id",
  },
  {
    title: "금액",
    dataIndex: "rateplan",
    render: (text, record) => {
      const price = (text.price - text.dc_price).toLocaleString("ko-KR");
      return price;
    },
  },
  {
    title: "결제일",
    dataIndex: "regdate",
    render: (text, record) => {
      const payDate = text.split(" ")[0];
      return payDate;
    },
  },
  {
    title: "사용 시작일",
    dataIndex: "start_date",
  },
  {
    title: "사용 종료일",
    dataIndex: "end_date",
  },
  {
    title: "취소일시",
    dataIndex: "cancel_date",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
