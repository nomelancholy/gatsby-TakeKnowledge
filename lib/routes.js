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
    path: "/billing",
    name: "청구/결제",
    icon: (
      <CreditCardTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
  },
  {
    path: "/group",
    name: "그룹 관리",
    icon: <HomeTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
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
    path: "/payment",
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
  {
    path: "/coupon",
    name: "쿠폰",
    icon: <SmileTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
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
  {
    path: "/home",
    name: "Home",
    icon: <HomeTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
  },
  {
    name: "Apps",
    icon: (
      <ShoppingTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
    children: [
      {
        path: "/apps/calendar",
        name: "Calendar",
      },
      {
        path: "/apps/messages",
        name: "Messages",
      },
      {
        path: "/apps/social",
        name: "Social",
      },
      {
        path: "/apps/chat",
        name: "Chat",
      },
    ],
  },
  {
    name: "Authentication",
    icon: <UnlockTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/signin",
        name: "Signin",
      },
      {
        path: "/signup",
        name: "Signup",
      },
      {
        path: "/forgot",
        name: "Forgot",
      },
      {
        path: "/lockscreen",
        name: "Lockscreen",
      },
    ],
  },
  {
    name: "Error",
    icon: (
      <WarningTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
    children: [
      {
        path: "/thisroutedoesntwork",
        name: "404",
      },
      {
        path: "/500",
        name: "Error",
      },
    ],
  },
  {
    name: "General elements",
    icon: <FolderTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/general/button",
        name: "Button",
      },
      {
        path: "/general/icon",
        name: "Icon",
      },
    ],
  },
  {
    name: "Navigation",
    icon: (
      <SwitcherTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />
    ),
    children: [
      {
        path: "/navigation/breadcrumb",
        name: "Breadcrumb",
      },
      {
        path: "/navigation/dropdown",
        name: "Dropdown",
      },
      {
        path: "/navigation/menu",
        name: "Menu",
      },
      {
        path: "/navigation/pagination",
        name: "Pagination",
      },
      {
        path: "/navigation/steps",
        name: "Steps",
      },
    ],
  },
  {
    name: "Data entry",
    icon: <EditTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/data-entry/autocomplete",
        name: "AutoComplete",
      },
      {
        path: "/data-entry/checkbox",
        name: "Checkbox",
      },
      {
        path: "/data-entry/cascader",
        name: "Cascader",
      },
      {
        path: "/data-entry/datepicker",
        name: "Date picker",
      },
      {
        path: "/data-entry/form",
        name: "form",
      },
      {
        path: "/data-entry/inputnumber",
        name: "Input number",
      },
      {
        path: "/data-entry/input",
        name: "Input",
      },
      {
        path: "/data-entry/mention",
        name: "Mention",
      },
      {
        path: "/data-entry/rate",
        name: "Rate",
      },
      {
        path: "/data-entry/radio",
        name: "Radio",
      },
      {
        path: "/data-entry/switch",
        name: "Switch",
      },
      {
        path: "/data-entry/slider",
        name: "Slider",
      },
      {
        path: "/data-entry/select",
        name: "Select",
      },
      {
        path: "/data-entry/treeselect",
        name: "Tree select",
      },
      {
        path: "/data-entry/transfer",
        name: "Transfer",
      },
      {
        path: "/data-entry/timepicker",
        name: "Time picker",
      },
      {
        path: "/data-entry/upload",
        name: "Upload",
      },
    ],
  },
  {
    name: "Data display",
    icon: <DiffTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/data-display/avatar",
        name: "Avatar",
      },
      {
        path: "/data-display/badge",
        name: "Badge",
      },
      {
        path: "/data-display/collapse",
        name: "Collapse",
      },
      {
        path: "/data-display/carousel",
        name: "Carousel",
      },
      {
        path: "/data-display/card",
        name: "Card",
      },
      {
        path: "/data-display/calendar",
        name: "Calendar",
      },
      {
        path: "/data-display/list",
        name: "List",
      },
      {
        path: "/data-display/popover",
        name: "Popover",
      },
      {
        path: "/data-display/tree",
        name: "Tree",
      },
      {
        path: "/data-display/tooltip",
        name: "Tooltip",
      },
      {
        path: "/data-display/timeline",
        name: "Timeline",
      },
      {
        path: "/data-display/tag",
        name: "Tag",
      },
      {
        path: "/data-display/tabs",
        name: "Tabs",
      },
      {
        path: "/data-display/table",
        name: "Table",
      },
    ],
  },
  {
    name: "Feedback",
    icon: <AlertTwoTone style={{ fontSize: "16px" }} twoToneColor="#F26224" />,
    children: [
      {
        path: "/feedback/alert",
        name: "Alert",
      },
      {
        path: "/feedback/drawer",
        name: "Drawer",
      },
      {
        path: "/feedback/modal",
        name: "Modal",
      },
      {
        path: "/feedback/message",
        name: "Message",
      },
      {
        path: "/feedback/notification",
        name: "Notification",
      },
      {
        path: "/feedback/progress",
        name: "Progress",
      },
      {
        path: "/feedback/popconfirm",
        name: "Pop confirm",
      },
      {
        path: "/feedback/spin",
        name: "Spin",
      },
      {
        path: "/feedback/skeleton",
        name: "Skeleton",
      },
    ],
  },
];
