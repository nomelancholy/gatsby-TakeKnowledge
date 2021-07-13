import { Avatar, Badge, Layout, List, Menu } from "antd";
import {
  BellTwoTone,
  CaretDownOutlined,
  InteractionTwoTone,
  PlaySquareTwoTone,
  SettingTwoTone,
  MenuOutlined,
} from "@ant-design/icons";
import DashHeader, { Notification } from "./styles/Header";

import Link from "next/link";
import MockNotifications from "../demos/mock/notifications";
import { useAppState } from "./shared/AppProvider";
import { useState } from "react";

import Actions from "../state/actions/AuthActionCreators";

const { SubMenu } = Menu;
const { Header } = Layout;

const MainHeader = () => {
  const [state, dispatch] = useAppState();
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
          {/* {state.mobile && ( */}
          <a
            onClick={() => dispatch({ type: "collapse" })}
            className="ml-5 menu-collapse"
          >
            <MenuOutlined />
          </a>
          {/* )} */}

          <span className="mr-auto" />

          <Menu.Item>
            <a onClick={() => dispatch(Actions.deauthenticate())}>로그아웃</a>
          </Menu.Item>
          {/* 
          {!state.mobile && (
            <Menu.Item onClick={() => dispatch({ type: "fullscreen" })}>
              <InteractionTwoTone style={{ fontSize: "20px" }} />
            </Menu.Item>
          )}
          <Menu.Item onClick={() => dispatch({ type: "options" })}>
            <SettingTwoTone style={{ fontSize: "20px" }} />
          </Menu.Item>
          <SubMenu
            title={
              <Badge count={5}>
                <span className="submenu-title-wrapper">
                  <BellTwoTone style={{ fontSize: "20px" }} />
                </span>
              </Badge>
            }
          >
            <Menu.Item
              className="p-0 bg-transparent"
              style={{ height: "auto" }}
            >
              <List
                className="header-notifications"
                itemLayout="horizontal"
                dataSource={notifications}
                footer={<div>5 Notifications</div>}
                renderItem={(item) => (
                  <Notification>
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.avatar}
                        title={<a href="/">{item.title}</a>}
                        description={<small>{item.description}</small>}
                      />
                    </List.Item>
                  </Notification>
                )}
              />
            </Menu.Item>
          </SubMenu>

          <SubMenu title={<Avatar src="/images/avatar.jpg" />}>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Profile</Menu.Item>
            <Menu.Item>Notifications</Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <Link href="//one-readme.fusepx.com">
                <a>Help?</a>
              </Link>
            </Menu.Item>
            <Menu.Item>Signout</Menu.Item>
          </SubMenu> */}
        </Menu>
      </Header>
    </DashHeader>
  );
};

export default MainHeader;
