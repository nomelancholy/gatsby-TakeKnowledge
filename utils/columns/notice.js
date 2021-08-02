// 알림(공지) 관리 리스트
// /services/notice/list
export const noticeListcolumns = [
  {
    title: "공지 ID",
    dataIndex: "notice_id",
  },
  {
    title: "공지 제목",
    dataIndex: "title",
    render: (text, record) => {
      return <a href={`/notice/${record.notice_id}`}>{text}</a>;
    },
  },
  {
    title: "공지 유형",
    dataIndex: "type",
    render: (text, record) => {
      let renderText = "";

      if (text === "normal") {
        renderText = "일반 공지";
      } else if (text === "group") {
        renderText = "그룹 공지";
      } else if (text === "spot") {
        renderText = "지점 공지";
      }

      return renderText;
    },
  },
  {
    title: "상단 노출",
    dataIndex: "sticky",
    render: (text, record) => {
      return text === 0 ? "X" : "O";
    },
  },
  {
    title: "등록자",
    dataIndex: "user",
    render: (text, record) => {
      return text.user_name;
    },
  },
  {
    title: "사용 여부",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "publish") {
        renderText = "발행";
      } else if (text === "private") {
        renderText = "미발행";
      }

      return renderText;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];