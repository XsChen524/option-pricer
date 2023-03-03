import React, { useState } from "react";
import { HomeOutlined, FunctionOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import AppRouter from "router";
import "../style/layout/mainLayoutStyle.css";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC<{}> = () => {
	const [title, setTitle] = useState<string>("Option Pricer");
	const navigate = useNavigate();

	const items: MenuProps["items"] = [
		{
			key: "1",
			icon: React.createElement(HomeOutlined),
			label: "Home",
			onClick: () => {
				setTitle("Option Pricer");
				navigate("/");
			},
		},
		{
			key: "2",
			icon: React.createElement(FunctionOutlined),
			label: "Extended BS",
			onClick: () => {
				setTitle("Entended Black Scholes");
				navigate("ebs");
			},
		},
		{
			key: "3",
			icon: React.createElement(FunctionOutlined),
			label: "Implied Volatility",
			onClick: () => {
				setTitle("Implied Volatility");
				navigate("iv");
			},
		},
	];

	return (
		<Layout hasSider>
			<Sider id="main-layout-sider" breakpoint="sm" collapsedWidth="0">
				<Menu theme="dark" mode="inline" items={items} />
			</Sider>
			<Layout className="site-layout" style={{ marginLeft: 200 }}>
				<Header id="main-layout-header">
					<h3>{title}</h3>
				</Header>
				<Content style={{ margin: "24px 24px 0", overflow: "initial" }}>
					<div id="main-layout-content-container">
						<AppRouter />
					</div>
				</Content>
				<Footer style={{ textAlign: "center" }}>
					© 2023 Chen Xingsheng
				</Footer>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
