import {
  AccountBookTwoTone,
  AlertTwoTone,
  BankTwoTone,
  CreditCardTwoTone,
  CompassTwoTone,
  CrownTwoTone,
  ContainerTwoTone,
  DiffTwoTone,
  EditTwoTone,
  FireTwoTone,
  FolderTwoTone,
  HomeTwoTone,
  LayoutTwoTone,
  PictureTwoTone,
  PieChartTwoTone,
  QuestionCircleTwoTone,
  SmileTwoTone,
  ShoppingTwoTone,
  StarTwoTone,
  SwitcherTwoTone,
  UnlockTwoTone,
  WalletTwoTone,
  WarningTwoTone,
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
  // {
  //   path: "/group",
  //   name: "그룹 관리",
  //   icon: <HomeTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  // },
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
    icon: <WalletTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    path: "/spot",
    name: "스팟 관리",
    icon: (
      <CompassTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  // {
  //   path: "/coupon",
  //   name: "쿠폰",
  //   icon: <SmileTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  // },
  {
    path: "/notice",
    name: "알림(공지)",
    icon: <AlertTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
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
