// 회원 관리 리스트
// /admin/user/list
export const userListColumns = [
  {
    title: "회원 ID",
    dataIndex: "uid",
  },
  {
    title: "계약자명",
    dataIndex: "user_name",
    render: (text, record) => {
      return <a href={`/user/${record.uid}`}>{text}</a>;
    },
  },
  {
    title: "회원 구분",
    dataIndex: "user_role",
    render: (text, record) => {
      let renderText = "";
      if (text === "ffadmin") {
        renderText = "관리자";
      } else if (text === "member") {
        renderText = "멤버";
      } else if (text === "group") {
        renderText = "그룹";
      } else if (text === "user") {
        renderText = "회원";
      }

      return renderText;
    },
  },
  {
    title: "계약자 타입",
    dataIndex: "contract",
    render: (text, record) => {
      let renderText = "";

      if (text === null) {
        renderText = "계약 없음";
      } else if (text.status === "wait") {
        renderText = "구매 대기";
      } else if (text.status === "buy") {
        renderText = "구매";
      } else if (text.status === "pay") {
        renderText = "계약중";
      } else if (text.status === "refund") {
        renderText = "환불";
      } else if (text.status === "expired") {
        renderText = "종료";
      } else if (text.status === "terminate") {
        renderText = "해지";
      } else if (text.status === "canceled") {
        renderText = "취소";
      }

      return renderText;
    },
  },
  // {
  //   title: "그룹명(그룹id)",
  //   dataIndex: "-",
  // },
  {
    title: "카드 등록 여부",
    dataIndex: "registed_card",
    render: (text, record) => {
      return text ? "등록" : "미등록";
    },
  },
  {
    title: "활성/휴면 여부",
    dataIndex: "user_status",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "active":
          renderText = "활성";
          break;
        case "inactive":
          renderText = "비활성";
          break;
        case "sleep":
          renderText = "휴면";
          break;
        case "leave":
          renderText = "탈퇴";
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
