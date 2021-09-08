import {
  AlertTwoTone,
  CreditCardTwoTone,
  CompassTwoTone,
  CrownTwoTone,
  DiffTwoTone,
  DollarCircleTwoTone,
  EditTwoTone,
  HomeTwoTone,
  QuestionCircleTwoTone,
  SmileTwoTone,
  ShoppingTwoTone,
  ScheduleTwoTone,
  LikeTwoTone,
  NotificationTwoTone,
} from "@ant-design/icons";

export default [
  {
    path: "/contract",
    name: "계약",
    icon: <EditTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    path: "/service",
    name: "부가서비스 계약 관리",
    icon: <DiffTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    path: "/order",
    name: "청구/결제",
    icon: (
      <CreditCardTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  {
    path: "/voucher",
    name: "이용 관리",
    icon: (
      <ScheduleTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  {
    path: "/user",
    name: "회원 관리",
    icon: <CrownTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    path: "/product",
    name: "상품 관리",
    icon: (
      <ShoppingTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  {
    path: "/rateplan",
    name: "요금제 관리",
    icon: (
      <DollarCircleTwoTone
        style={{ fontSize: "16px" }}
        twoToneColor="#F26224"
      />
    ),
  },
  {
    path: "/spot",
    name: "스팟 관리",
    icon: (
      <CompassTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  {
    path: "/coupon",
    name: "쿠폰",
    icon: <SmileTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/coupon",
        name: "쿠폰 관리",
      },
      {
        path: "/coupon/auto",
        name: "자동발급",
      },
      {
        path: "/coupon/direct",
        name: "직접 발급",
      },
    ],
  },
  {
    path: "/banner",
    name: "배너",
    icon: <LikeTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    path: "/event",
    name: "이벤트",
    icon: <AlertTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },

  {
    path: "/notice",
    name: "알림(공지)",
    icon: (
      <NotificationTwoTone
        style={{ fontSize: "16px" }}
        twoToneColor="#F26224"
      />
    ),
  },
  {
    path: "/qna",
    name: "문의하기",
    icon: (
      <QuestionCircleTwoTone
        style={{ fontSize: "16px" }}
        twoToneColor="#F26224"
      />
    ),
  },
  // {
  //   name: "Authentication",
  //   icon: <UnlockTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  //   children: [
  //     {
  //       path: "/signin",
  //       name: "Signin",
  //     },
  //     {
  //       path: "/signup",
  //       name: "Signup",
  //     },
  //     {
  //       path: "/forgot",
  //       name: "Forgot",
  //     },
  //     {
  //       path: "/lockscreen",
  //       name: "Lockscreen",
  //     },
  //   ],
  // },
];
