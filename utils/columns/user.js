// 회원 관리 리스트
// /admin/user/list
export const userListColumns = [
  {
    title: "회원 ID",
    dataIndex: "uid",
  },
  {
    title: "회원명",
    dataIndex: "user_name",
    render: (text, record) => {
      return <a href={`/user/${record.uid}`}>{text}</a>;
    },
  },
  {
    title: "회원 구분",
    dataIndex: "has_contract",
    render: (text, record) => {
      return text ? "멤버" : "회원";
    },
  },
  {
    title: "회원 역할",
    dataIndex: "user_role_ext",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "ffadmin":
          renderText = "파이브스팟 어드민";
          break;
        case "member":
          renderText = "일반";
          break;
        case "group_member":
          renderText = "그룹 멤버";
          break;
        case "group_master":
          renderText = "그룹 관리자 멤버";
          break;
        case "group_admin":
          renderText = "그룹 관리자";
          break;
        default:
          break;
      }

      return renderText;
    },
  },
  {
    title: "그룹/개인",
    dataIndex: "user_role",
    render: (text, record) => {
      let renderText = "개인";

      if (text === "group") {
        renderText = `그룹`;
      }

      return renderText;
    },
  },
  {
    title: "그룹명(그룹id)",
    dataIndex: "user_role",
    render: (text, record) => {
      let renderText = "-";

      if (text === "group") {
        renderText = `${record.group_name}(${record.group_id})`;
      }

      return renderText;
    },
  },
  {
    title: "카드 등록 여부",
    dataIndex: "registed_card",
    render: (text, record) => {
      return text ? "등록" : "미등록";
    },
  },
  {
    title: "회원 상태",
    dataIndex: "user_status",
    render: (text, record) => {
      let renderText = "";

      switch (text) {
        case "active":
          renderText = "활성";
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
    title: "가입 일자",
    dataIndex: "regdate",
  },
];
