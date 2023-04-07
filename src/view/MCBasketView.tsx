import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "../style/view/global.css";
import { MCBasketParams, MCBasketRawParams } from "service";
import ArithmeticBasket from "service/arithmeticBasket";
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

const parseData = (mc: MCBasketParams | undefined): ResultDataType[] => {
	if (mc) {
		return [
			{
				key: "1",
				key1: "Spot Price 1",
				value1: mc.spot1,
				key2: "Spot Price 1",
				value2: mc.spot2,
			},
			{
				key: "2",
				key1: "Volatility1",
				value1: mc.volatility1,
				key2: "Volatility1",
				value2: mc.volatility2,
			},
			{
				key: "3",
				key1: "Risk-free Rate",
				value1: mc.riskFreeRate,
				key2: "Time to Maturity",
				value2: mc.timeToMaturity,
			},
			{
				key: "4",
				key1: "Strike",
				value1: mc.strike,
				key2: "Correlation",
				value2: mc.correlation,
			},
			{
				key: "5",
				key1: "Monte Carlo Observe Time",
				value1: mc.path,
				key2: "Price Method",
				value2: mc.method === "Geo" ? "Control Variate" : "Standard",
			},
			{
				key: "6",
				key1: "Option Type",
				value1: mc.optionType === "C" ? "Call" : "Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number[];
	mcParams: MCBasketParams | undefined;
}> = (props: { value: number[]; mcParams: MCBasketParams | undefined }) => {
	const tableTitle = () => {
		return props.mcParams ? (
			<h3>
				Price of Arithmetic Mean Basket Option using
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
	const [mcParams, setMcParams] = useState<MCBasketParams | undefined>(
		undefined
	);
	const [mc, setMc] = useState<ArithmeticBasket | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof mcParams !== "undefined")
			setMc(new ArithmeticBasket(mcParams));
	}, [mcParams]);

	const onFinish = (value: MCBasketRawParams) => {
		setMcParams(parseRawParams<MCBasketRawParams, MCBasketParams>(value));
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
					<Form.Item
						name="path"
						label="M: Monte Carlo Observe Path"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
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
