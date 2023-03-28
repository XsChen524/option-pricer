import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "../style/view/global.css";
import { BGParams, BGRawParams } from "service";
import BasketGeometric from "service/basketGeo";
import { parseRawParams } from "utils/utils";

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};

interface ResultDataType {
	key: string;
	key1: string;
	value1: number | string;
	key2?: string;
	value2?: number | string;
}

const ResultColumns: ColumnsType<ResultDataType> = [
	{
		title: "key1",
		dataIndex: "key1",
	},
	{
		title: "value1",
		dataIndex: "value1",
		render: (text) => <span>{text}</span>,
	},
	{
		title: "key2",
		dataIndex: "key2",
	},
	{
		title: "value2",
		dataIndex: "value2",
		render: (text) => <span>{text}</span>,
	},
];

const parseData = (bg: BGParams | undefined): ResultDataType[] => {
	if (bg) {
		return [
			{
				key: "1",
				key1: "Spot Price 1",
				value1: bg.spot1,
				key2: "Spot Price 2",
				value2: bg.spot2,
			},
			{
				key: "2",
				key1: "Volatility 1",
				value1: bg.volatility1,
				key2: "Volatility 2",
				value2: bg.volatility2,
			},
			{
				key: "3",
				key1: "Risk-free Rate",
				value1: bg.riskFreeRate,
				key2: "Time to Maturity",
				value2: bg.timeToMaturity,
			},
			{
				key: "4",
				key1: "Strike",
				value1: bg.strike,
				key2: "Correlation",
				value2: bg.correlation,
			},
			{
				key: "5",
				key1: "Option Type",
				value1: bg.optionType === "C" ? "Call" : "Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number;
	bgParams: BGParams | undefined;
}> = (props: { value: number; bgParams: BGParams | undefined }) => {
	const tableTitle = () => {
		return <h3>Price of Geometric Basket Option: {props.value}</h3>;
	};

	return (
		<>
			{" "}
			{props.bgParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.bgParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const BasketGeoView: React.FunctionComponent<{}> = () => {
	const [bgParams, setBgParams] = useState<BGParams | undefined>(undefined);
	const [bg, setBg] = useState<BasketGeometric | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof bgParams !== "undefined")
			setBg(new BasketGeometric(bgParams));
	}, [bgParams]);

	const onFinish = (value: BGRawParams) => {
		setBgParams(parseRawParams<BGRawParams, BGParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setBgParams(undefined);
		setBg(undefined);
	};

	return (
		<Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
			<Row className="input-form-row" gutter={16}>
				<Col className="gutter-row input-form-col" span={12}>
					<Form.Item
						name="spot1"
						label="Spot Price 1"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="volatility1"
						label="Volatility1"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="riskFreeRate"
						label="Risk-free Rate"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="strike"
						label="Strike"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
					</Form.Item>
				</Col>
				<Col className="gutter-row input-form-col" span={12}>
					<Form.Item
						name="spot2"
						label="Spot Price 2"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="volatility2"
						label="Volatility2"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="timeToMaturity"
						label="TM in year"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="correlation"
						label="Correlation"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="optionType"
						label="Type"
						rules={[{ required: true }]}
					>
						<Select placeholder="Option Type" allowClear>
							<Select.Option value="C">Call</Select.Option>
							<Select.Option value="P">Put</Select.Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row className="input-form-row" gutter={[48, 0]}>
				<Col span={6}>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Submit
						</Button>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item>
						<Button
							type="primary"
							htmlType="button"
							onClick={onReset}
							block
						>
							Reset
						</Button>
					</Form.Item>
				</Col>
			</Row>
			{typeof bg !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable bgParams={bgParams} value={bg.price()} />
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default BasketGeoView;
