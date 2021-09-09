// 이벤트 관리 리스트
// api 주소
export const eventListcolumns = [
  {
    title: "이벤트 ID",
    dataIndex: "event_id",
  },
  {
    title: "이벤트 제목",
    dataIndex: "title",
    render: (text, record) => {
      return <a href={`/event/${record.event_id}`}>{text}</a>;
    },
  },
  {
    title: "경로",
    dataIndex: "path",
  },

  {
    title: "사용 여부",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "publish") {
        renderText = "활성";
      } else if (text === "private") {
        renderText = "비활성";
      } else if (text === "trash") {
        renderText = "삭제";
      }

      return renderText;
    },
  },
  {
    title: "시작 일시",
    dataIndex: "start_date",
  },
  {
    title: "종료 일시",
    dataIndex: "end_date",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
