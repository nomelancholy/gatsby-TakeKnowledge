import { Button } from "antd";
import axios from "axios";

// 쿠폰 관리 리스트
// api 주소
export const couponListcolumns = [
  {
    title: "쿠폰 ID",
    dataIndex: "coupon_id",
    render: (text, record) => {
      return <a href={`/coupon/${text}`}>{text}</a>;
    },
  },
  {
    title: "쿠폰명",
    dataIndex: "name",
  },
  {
    title: "쿠폰 유형",
    dataIndex: "coupon_type",
    render: (text, record) => {
      let renderText = "";

      if (text === "flat") {
        renderText = "정액 할인";
      } else if (text === "ratio") {
        renderText = "비율 할인";
      }

      return renderText;
    },
  },
  {
    title: "활성/비활성",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "active") {
        renderText = "활성";
      } else if (text === "inactive") {
        renderText = "비활성";
      }

      return renderText;
    },
  },
  {
    title: "쿠폰 구분",
    dataIndex: "coupon_category",
    render: (text, record) => {
      let renderText = "";

      if (text === "meeting") {
        renderText = "미팅룸";
      } else if (text === "coworking") {
        renderText = "코워킹룸";
      } else if (text === "locker") {
        renderText = "락커룸";
      } else if (text === "lounge") {
        renderText = "라운지";
      } else if (text === "membership") {
        renderText = "멤버쉽";
      }

      return renderText;
    },
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "desc",
  },
  {
    title: "할인액",
    dataIndex: "discount",
    render: (text, record) => {
      let renderText = "";

      if (record.coupon_type === "flat") {
        renderText = text.toLocaleString("ko-KR");
      }

      return renderText;
    },
  },
  {
    title: "할인 비율",
    dataIndex: "discount",
    render: (text, record) => {
      let renderText = "";

      if (record.coupon_type === "ratio") {
        renderText = text;
      }

      return renderText;
    },
  },
  {
    title: "적용 상품 id",
    dataIndex: "product_ids",
    render: (text, record) => {
      let renderText = "";

      let array = [];

      if (text && text.length > 0) {
        array = text.split("|");

        renderText = array.join(", ");
      }

      return renderText;
    },
  },
  {
    title: "발행량",
    dataIndex: "total",
    render: (text, record) => {
      return text.toLocaleString("ko-KR");
    },
  },
  {
    title: "발급 현황",
    dataIndex: "email",
  },
  {
    title: "사용 현황",
    dataIndex: "email",
  },
  {
    title: "발행 시작일",
    dataIndex: "pub_date_start",
  },
  {
    title: "발행 종료일",
    dataIndex: "pub_date_end",
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];

// 쿠폰 자동 발급 리스트
export const couponAutoListcolumns = [
  {
    title: "자동 발급 ID",
    dataIndex: "cai_id",
    render: (text, record) => {
      return <a href={`/coupon/auto/${text}`}>{text}</a>;
    },
  },
  {
    title: "쿠폰명",
    dataIndex: "coupon",
    render: (text, record) => {
      return <a href={`/coupon/${text.coupon_id}`}>{text.name}</a>;
    },
  },
  {
    title: "자동 발급 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "active") {
        renderText = "실행";
      } else if (text === "inactive") {
        renderText = "중단";
      }

      return renderText;
    },
  },
  {
    title: "이용",
    dataIndex: "coupon",
    render: (text, record) => {
      let renderText = "";

      if (text.available) {
        renderText = "활성";
      } else {
        renderText = "비활성";
      }

      return renderText;
    },
  },
  {
    title: "대상",
    dataIndex: "target",
    render: (text, record) => {
      let renderText = "";

      if (text === "all") {
        renderText = "전체";
      } else if (text === "user") {
        renderText = "회원";
      } else if (text === "member") {
        renderText = "멤버";
      } else if (text === "referral") {
        renderText = "추천인";
      } else if (text === "niminee") {
        renderText = "피추천인";
      }

      return renderText;
    },
  },
  {
    title: "자동발급 유형",
    dataIndex: "issue_category",
    render: (text, record) => {
      let renderText = "";

      if (text === "birthday") {
        renderText = "생일";
      } else if (text === "issue_day") {
        renderText = "지정일";
      } else if (text === "join") {
        renderText = "회원가입";
      } else if (text === "membership_expired") {
        renderText = "멤버십 만료";
      } else if (text === "membership_terminate") {
        renderText = "멤버십 해지";
      } else if (text === "referral") {
        renderText = "리퍼럴";
      }

      return renderText;
    },
  },
  {
    title: "쿠폰 구분",
    dataIndex: "coupon",
    render: (text, record) => {
      let renderText = "";

      if (text.coupon_category === "meeting") {
        renderText = "미팅룸";
      } else if (text.coupon_category === "coworking") {
        renderText = "코워킹룸";
      } else if (text.coupon_category === "locker") {
        renderText = "락커룸";
      } else if (text.coupon_category === "lounge") {
        renderText = "라운지";
      } else if (text.coupon_category === "membership") {
        renderText = "멤버쉽";
      }

      return renderText;
    },
  },
  {
    title: "적용 쿠폰 id",
    dataIndex: "coupon_id",
  },
  {
    title: "쿠폰 설명(고객 노출)",
    dataIndex: "coupon",
    render: (text, record) => {
      return text.desc;
    },
  },
  {
    title: "쿠폰 유형",
    dataIndex: "coupon",
    render: (text, record) => {
      let renderText = "";

      if (text.coupon_type === "flat") {
        renderText = "정액 할인";
      } else if (text === "ratio") {
        renderText = "비율 할인";
      }

      return renderText;
    },
  },
  {
    title: "할인액",
    dataIndex: "coupon",
    render: (text, record) => {
      let renderText = "";

      if (text.coupon_type === "flat") {
        renderText = text.discount.toLocaleString("ko-KR");
      }

      return renderText;
    },
  },
  {
    title: "할인 비율",
    dataIndex: "coupon",
    render: (text, record) => {
      let renderText = "";

      if (text.coupon_type === "ratio") {
        renderText = text.discount;
      }

      return renderText;
    },
  },
  {
    title: "발급량",
    dataIndex: "coupon",
    render: (text, record) => {
      return text.total;
    },
  },
  {
    title: "생성 일시",
    dataIndex: "regdate",
  },
];

// 서버 통신 + 토큰 전달 문제로 coupon/manual/index.js 내부로 이동
// 쿠폰 직접 발급 리스트
// export const couponManualListcolumns = [
//   {
//     title: "직접발급 ID",
//     dataIndex: "cmi_id",
//     render: (text, record) => {
//       return <a href={`/coupon/manual/${text}`}>{text}</a>;
//     },
//   },
//   {
//     title: "쿠폰 명",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       return text.name;
//     },
//   },
//   {
//     title: "직접발급 상태",
//     dataIndex: "status",
//     render: (text, record) => {
//       let renderText = "";

//       if (text === "active") {
//         renderText = "실행";
//       } else if (text === "inactive") {
//         renderText = "중단";
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "발급 방식",
//     dataIndex: "issue_type",
//     render: (text, record) => {
//       let renderText = "";

//       if (text === "each") {
//         renderText = "개별 발급";
//       } else if (text === "bundle") {
//         renderText = "대량 발급";
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "쿠폰 구분",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       let renderText = "";

//       if (text.coupon_category === "meeting") {
//         renderText = "미팅룸";
//       } else if (text.coupon_category === "coworking") {
//         renderText = "코워킹룸";
//       } else if (text.coupon_category === "locker") {
//         renderText = "락커룸";
//       } else if (text.coupon_category === "lounge") {
//         renderText = "라운지";
//       } else if (text.coupon_category === "membership") {
//         renderText = "멤버쉽";
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "적용 쿠폰 ID",
//     dataIndex: "coupon_id",
//   },
//   {
//     title: "쿠폰 설명(고객 노출)",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       return text.desc;
//     },
//   },
//   {
//     title: "쿠폰 유형",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       let renderText = "";

//       if (text.coupon_type === "flat") {
//         renderText = "정액 할인";
//       } else if (text === "ratio") {
//         renderText = "비율 할인";
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "할인액",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       let renderText = "";

//       if (text.coupon_type === "flat") {
//         renderText = text.discount.toLocaleString("ko-KR");
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "할인 비율",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       let renderText = "";

//       if (text.coupon_type === "ratio") {
//         renderText = text.discount;
//       }

//       return renderText;
//     },
//   },
//   {
//     title: "발급량",
//     dataIndex: "coupon",
//     render: (text, record) => {
//       return text.total;
//     },
//   },

//   {
//     title: "발급 일시",
//     dataIndex: "regdate",
//   },
//   {
//     title: "",
//     dataIndex: "",
//     render: (text, record) => {
//       return (
//         <Button
//           type="primary"
//           onClick={() => {
//             const config = {
//               headers: {
//                 Authorization: decodeURIComponent(token),
//               },
//             };

//             axios
//               .get(
//                 `${process.env.BACKEND_API}/admin/user/coupon/issued/excel/${record.cmi_id}`,
//                 config
//               )
//               .then(function (response) {
//                 console.log(`response`, response);
//               })
//               .catch(function (error) {
//                 console.log(error);
//               });
//           }}
//         >
//           엑셀 다운로드
//         </Button>
//       );
//     },
//   },
// ];

// 쿠폰 발급 결과

export const couponResultColumns = [
  {
    title: "직접 발급 ID",
    dataIndex: "ci_id",
  },
  {
    title: "쿠폰 이름",
    dataIndex: "coupon",
    render: (text, record) => {
      return text.name;
    },
  },
  {
    title: "이메일",
    dataIndex: "email",
  },
  {
    title: "쿠폰 상태",
    dataIndex: "status",
    render: (text, record) => {
      let renderText = "";

      if (text === "published") {
        renderText = "발행";
      } else if (text === "issued") {
        if (record.user_coupon.status === "expired") {
          renderText = "기간 만료";
        } else if (record.user_coupon.status === "used") {
          renderText = "사용 완료";
        } else if (record.user_coupon.status === "issued") {
          renderText = "발급 완료";
        }
      }

      return renderText;
    },
  },
  {
    title: "사용자 상태",
    dataIndex: "user",
    render: (text, record) => {
      let renderText = "";

      if (text) {
        renderText = "회원";
      } else {
        renderText = "비회원";
      }

      return renderText;
    },
  },
  {
    title: "발급 방식",
    dataIndex: "issue_info",
    render: (text, record) => {
      let renderText = "";

      if (text.issue_type === "bundle") {
        renderText = "대량발급";
      } else if (text.issue_type === "each") {
        renderText = "개별발급";
      }

      return renderText;
    },
  },
  {
    title: "발급 일시",
    dataIndex: "issue_info",
    render: (text, record) => {
      return text.regdate;
    },
  },
  {
    title: "개별 쿠폰 코드",
    dataIndex: "serial",
  },
];
