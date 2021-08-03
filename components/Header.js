import { Avatar, Badge, Layout, List, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import DashHeader, { Notification } from "./styles/Header";

import Link from "next/link";
import MockNotifications from "../demos/mock/notifications";
import { useAppState } from "./shared/AppProvider";
import { useState } from "react";

import Actions from "../state/actions/AuthActionCreators";

const { SubMenu } = Menu;
const { Header } = Layout;

const MainHeader = (props) => {
  const { dispatch } = props;
  const [state] = useAppState();

  const [notifications] = useState(MockNotifications);
  return (
    <DashHeader>
      <Header>
        <Menu mode="horizontal">
          <Menu.Item>
            <Link href="/">
              <a className="brand">
                <strong className="text-black">{state.name}</strong>
              </a>
            </Link>
          </Menu.Item>
          {state.mobile && (
            <a
              // onClick={() => dispatch({ type: "collapse" })}
              className="ml-5 menu-collapse"
            >
              <MenuOutlined />
            </a>
          )}

          <span className="mr-auto" />

          <Menu.Item>
            <a
              onClick={() => {
                dispatch(Actions.deauthenticate());
              }}
            >
              로그아웃
            </a>
          </Menu.Item>
        </Menu>
      </Header>
    </DashHeader>
  );
};

export default MainHeader;
