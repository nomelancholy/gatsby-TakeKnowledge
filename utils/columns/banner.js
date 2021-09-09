// 배너 관리 리스트
// api 주소
export const bannerListcolumns = [
  {
    title: "배너 ID",
    dataIndex: "banner_id",
  },
  {
    title: "제목",
    dataIndex: "items",
    render: (text, record) => {
      return <a href={`/banner/${record.banner_id}`}>{text[0].title}</a>;
    },
  },
  {
    title: "위치",
    dataIndex: "path",
    render: (text, record) => {
      let renderText = "";

      if (text === "home") {
        renderText = "홈";
      } else if (text === "spot") {
        renderText = "스팟";
      } else if (text === "service") {
        renderText = "서비스";
      } else if (text === "mypage") {
        renderText = "마이페이지";
      }

      return renderText;
    },
  },
  {
    title: "활성",
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
    title: "타깃",
    dataIndex: "permission",
    render: (text, record) => {
      console.log(`text`, text);

      const targets = text.split("|");

      let targetArray = [];

      targets.map((target) => {
        switch (target) {
          case "guest":
            targetArray.push("비회원");
            break;
          case "user":
            targetArray.push("개인 회원");
            break;
          case "member":
            targetArray.push("개인 멤버");
            break;
          default:
            break;
        }
      });

      const renderText = targetArray.join(", ");

      return renderText;
    },
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
    title: "생성 일시",
    dataIndex: "regdate",
  },
];
