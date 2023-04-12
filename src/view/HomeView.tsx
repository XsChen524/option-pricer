import React from "react";
import { Card, Space } from "antd";
import "../style/view/home.css";
import ReactSvg from "../asset/React.svg";
import TsSvg from "../asset/Typescript.svg";

const Home: React.FunctionComponent<{}> = () => {
	const { Meta } = Card;

	return (
		<div id="home-view-container">
			<Space size="large">
				<Card
					hoverable
					style={{ width: 250 }}
					cover={
						<img
							alt="react"
							src={ReactSvg}
							style={{
								backgroundColor: "#343434",
							}}
						/>
					}
				>
					<Meta title="React + Electron + Antd" />
				</Card>
				<Card
					hoverable
					style={{
						width: 250,
						overflow: "hidden",
					}}
					cover={
						<img
							alt="typescript"
							src={TsSvg}
							style={{
								backgroundColor: "#ffffff",
								width: 250,
							}}
						/>
					}
				>
					<Meta
						title="TypeScript"
						description="See details in src/service"
					/>
				</Card>
			</Space>
		</div>
	);
};

export default Home;
