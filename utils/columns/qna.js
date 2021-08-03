// 문의하기 리스트
// /user/qna/list

export const qnaListColumns = [
  {
    title: "문의 ID",
    dataIndex: "qid",
  },
  {
    title: "문의 유형",
    dataIndex: "classification",
  },
  // 기획 변경으로 주석 처리 (21.08.03)
  // {
  //   title: "카테고리",
  //   dataIndex: "category",
  // },
  {
    title: "제목",
    dataIndex: "title",
    render: (text, record) => {
      return <a href={`/qna/${record.qid}`}>{text}</a>;
    },
  },
  {
    title: "요청자(멤버 ID)",
    dataIndex: "user",
    render: (text, record) => {
      return `${text.user_name}(${text.uid})`;
    },
  },
  {
    title: "처리 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "wait") {
        renderText = "대기";
      } else if (text === "done") {
        renderText = "해결";
      } else if (text === "trash") {
        renderText = "삭제";
      }

      return renderText;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
