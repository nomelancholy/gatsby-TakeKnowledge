import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  List,
  Menu,
  Popconfirm,
  Row,
  Switch,
  Tooltip,
} from "antd";
import {
  FolderTwoTone,
  PlaySquareTwoTone,
  PushpinTwoTone,
} from "@ant-design/icons";
import { capitalize, lowercase } from "../lib/helpers";
import { useEffect, useState } from "react";

import DashHeader from "./styles/Header";
import Inner from "./styles/Sidebar";
import Link from "next/link";
import Routes from "../lib/routes";
import { useAppState } from "./shared/AppProvider";
import { withRouter } from "next/router";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

let rootSubMenuKeys = [];

const getKey = (name, index) => {
  const string = `${name}-${index}`;
  let key = string.replace(" ", "-");
  return key.charAt(0).toLowerCase() + key.slice(1);
};

const SidebarContent = ({
  sidebarTheme,
  sidebarMode,
  sidebarIcons,
  collapsed,
  router,
}) => {
  const [state, dispatch] = useAppState();
  const [openKeys, setOpenKeys] = useState([]);
  const [appRoutes] = useState(Routes);
  const { pathname } = router;

  const badgeTemplate = (badge) => (
    <Badge
      count={badge.value}
      className={`${state.direction === "rtl" ? "left" : "right"}`}
    />
  );

  useEffect(() => {
    appRoutes.forEach((route, index) => {
      const isCurrentPath =
        pathname.indexOf(lowercase(route.name)) > -1 ? true : false;

      const key = getKey(route.name, index);

      rootSubMenuKeys.push(key);

      // children이 있는 route의 경우 메뉴를 기본적으로 오픈
      if (route.children) {
        setOpenKeys([...openKeys, key]);
      }

      if (isCurrentPath) setOpenKeys([...openKeys, key]);
    });
  }, []);

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.slice(-1);
    if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys([...latestOpenKey]);
    } else {
      setOpenKeys(latestOpenKey ? [...latestOpenKey] : []);
    }
  };

  const menu = (
    <>
      <Menu
        theme={sidebarTheme}
        className="border-0 scroll-y sidebar"
        style={{ flex: 1, height: "100%" }}
        mode={sidebarMode}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {appRoutes.map((route, index) => {
          const hasChildren = route.children ? true : false;
          if (!hasChildren)
            return (
              <Menu.Item
                key={getKey(route.name, index)}
                className={
                  pathname === route.path ? "ant-menu-item-selected" : ""
                }
                onClick={() => {
                  setOpenKeys([getKey(route.name, index)]);
                  if (state.mobile) dispatch({ type: "mobileDrawer" });
                }}
                icon={sidebarIcons && route.icon}
              >
                <Link href={route.path}>
                  <a>
                    <span className="mr-auto">{capitalize(route.name)}</span>
                    {route.badge && badgeTemplate(route.badge)}
                  </a>
                </Link>
              </Menu.Item>
            );

          if (hasChildren)
            return (
              <SubMenu
                key={getKey(route.name, index)}
                icon={sidebarIcons && route.icon}
                title={
                  <>
                    <span>{capitalize(route.name)}</span>
                    {route.badge && badgeTemplate(route.badge)}
                  </>
                }
              >
                {route.children.map((subitem, index) => (
                  <Menu.Item
                    key={getKey(subitem.name, index)}
                    className={
                      pathname === subitem.path ? "ant-menu-item-selected" : ""
                    }
                    onClick={() => {
                      if (state.mobile) dispatch({ type: "mobileDrawer" });
                    }}
                  >
                    <Link href={`${subitem.path ? subitem.path : ""}`}>
                      <a>
                        <span className="mr-auto">
                          {capitalize(subitem.name)}
                        </span>
                        {subitem.badge && badgeTemplate(subitem.badge)}
                      </a>
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
        })}
      </Menu>

      <Divider
        className={`m-0`}
        style={{
          display: `${sidebarTheme === "dark" ? "none" : ""}`,
        }}
      />
    </>
  );

  return (
    <>
      <Inner>
        <Sider
          width={220}
          className={`bg-${sidebarTheme}`}
          theme={sidebarTheme}
          collapsed={collapsed}
        >
          {menu}
        </Sider>
      </Inner>
    </>
  );
};

export default withRouter(SidebarContent);
