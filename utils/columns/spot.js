// 스팟 관리 리스트
// /admin/spot/list
export const spotListcolumns = [
  {
    title: "스팟 ID",
    dataIndex: "spot_id",
  },
  {
    title: "스팟명",
    dataIndex: "name",
    render: (text, record) => {
      // if (record.status === "trash") {
      //   return text;
      // } else {
      //   return <a href={`/spot/${record.spot_id}`}>{text}</a>;
      // }
      return <a href={`/spot/${record.spot_id}`}>{text}</a>;
    },
  },
  {
    title: "좌석 수",
    dataIndex: "seat_capacity",
  },
  {
    title: "최대 허용 수",
    dataIndex: "seat_limit",
  },
  {
    title: "라운지",
    dataIndex: "lounge",
  },
  {
    title: "미팅룸",
    dataIndex: "meeting",
  },
  {
    title: "코워킹 룸",
    dataIndex: "coworking",
  },
  {
    title: "락커",
    dataIndex: "locker",
  },
  {
    title: "활성/비활성",
    dataIndex: "status",
    render: (text) => {
      let renderText = "";

      switch (text) {
        case "active":
          renderText = "활성";
          break;
        case "inactive":
          renderText = "비활성";
          break;
        case "trash":
          renderText = "삭제";
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
