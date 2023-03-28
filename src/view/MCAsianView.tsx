import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "../style/view/global.css";
import { MCAsianParams, MCAsianRawParams } from "service";
import ArithmeticAsian from "service/arithmeticAsian";
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

const parseData = (mc: MCAsianParams | undefined): ResultDataType[] => {
	if (mc) {
		return [
			{
				key: "1",
				key1: "Spot Price",
				value1: mc.spot,
				key2: "Strike",
				value2: mc.strike,
			},
			{
				key: "2",
				key1: "Time to Maturity",
				value1: mc.timeToMaturity,
				key2: "Risk-Free Rate",
				value2: mc.riskFreeRate,
			},
			{
				key: "3",
				key1: "Volatility",
				value1: mc.volatility,
				key2: "N",
				value2: mc.observeTime,
			},
			{
				key: "4",
				key1: "Monte Carlo Observe Time",
				value1: mc.path,
				key2: "Price Method",
				value2: mc.method === "Geo" ? "Control Variate" : "Standard",
			},
			{
				key: "5",
				key1: "Option Type",
				value1: mc.optionType === "C" ? "Call" : "Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number[];
	mcParams: MCAsianParams | undefined;
}> = (props: { value: number[]; mcParams: MCAsianParams | undefined }) => {
	const tableTitle = () => {
		return props.mcParams ? (
			<h3>
				Price of Arithmetic Asian Option using
				{props.mcParams.method === "MC"
					? " Standard Monte Carlo "
					: " Control Variate Monte Carlo "}
				method : [{props.value[0]},{props.value[1]}]
			</h3>
		) : undefined;
	};

	return (
		<>
			{" "}
			{props.mcParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.mcParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const MCAsianView: React.FunctionComponent<{}> = () => {
	const [mcParams, setMcParams] = useState<MCAsianParams | undefined>(
		undefined
	);
	const [mc, setMc] = useState<ArithmeticAsian | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof mcParams !== "undefined")
			setMc(new ArithmeticAsian(mcParams));
	}, [mcParams]);

	const onFinish = (value: MCAsianRawParams) => {
		setMcParams(parseRawParams<MCAsianRawParams, MCAsianParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setMcParams(undefined);
		setMc(undefined);
	};

	return (
		<Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
			<Row className="input-form-row" gutter={16}>
				<Col className="gutter-row input-form-col" span={12}>
					<Form.Item
						name="spot"
						label="Spot Price"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="strike"
						label="Strike"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="timeToMaturity"
						label="TM in year"
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
				</Col>
				<Col className="gutter-row input-form-col" span={12}>
					<Form.Item
						name="volatility"
						label="Volatility"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="observeTime"
						label="N"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="path"
						label="M: Monte Carlo Observe Path"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="method"
						label="Monte Carlo Method"
						rules={[{ required: true }]}
					>
						<Select placeholder="MC Method" allowClear>
							<Select.Option value="MC">Standard</Select.Option>
							<Select.Option value="Geo">
								Control Variate
							</Select.Option>
						</Select>
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
			{typeof mc !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable mcParams={mcParams} value={mc.price()} />
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default MCAsianView;
