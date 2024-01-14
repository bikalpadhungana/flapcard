import { Outlet } from "react-router-dom";
import { useState } from "react";
const { Header, Sider, Content } = Layout;
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import FlapLogo from "/images/flap.png"
import { Layout, Menu, Button, theme } from "antd";

function AdminAppLayout() {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "white", height: "100vh" }}
      >
        <header>
            <img src={FlapLogo} alt="flap_logo" className="p-12" />
        </header>
        <Menu
          mode="inline"
          theme="light"
          defaultSelectedKeys={[`${pathname.split("/").at(2)}`]}
          items={[
            {
              key: "dashboard",
              icon: <AreaChartOutlined/>,
              label: "Dashboard",
              onClick: () => navigate("dashboard")
            },
            {
              key: "orders",
              icon: <ShoppingCartOutlined />,
              label: "Orders",
              onClick: () => navigate("orders"),
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: "Users",
              onClick: () => navigate("users"),
            },

          ]}

        />  
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "white",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "20px",
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            overflow: "auto",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminAppLayout;