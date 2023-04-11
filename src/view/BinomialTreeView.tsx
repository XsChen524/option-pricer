import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { AmericanParams, AmericanRawParams } from "service";
import "../style/view/global.css";
import { parseRawParams } from "utils/utils";
import BinomialTree from "service/binomialTree";

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

const parseData = (ebs: AmericanParams | undefined): ResultDataType[] => {
	if (ebs) {
		return [
			{
				key: "1",
				key1: "Spot Price",
				value1: ebs.spot,
				key2: "Strike",
				value2: ebs.strike,
			},
			{
				key: "2",
				key1: "Term to Maturity",
				value1: ebs.timeToMaturity,
				key2: "Risk-Free Rate",
				value2: ebs.riskFreeRate,
			},
			{
				key: "3",
				key1: "Volatility",
				value1: ebs.volatility,
				key2: "Number of Steps",
				value2: ebs.steps,
			},
			{
				key: "4",
				key1: "Option Type",
				value1:
					ebs.optionType === "C" ? "American Call" : "American Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number;
	amerParams: AmericanParams | undefined;
}> = (props: { value: number; amerParams: AmericanParams | undefined }) => {
	const tableTitle = () => {
		return <h3>American Option price by Binomial Tree: {props.value}</h3>;
	};

	return (
		<>
			{" "}
			{props.amerParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.amerParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const BinomialTreeView: React.FunctionComponent<{}> = () => {
	const [amerParams, setAmerParams] = useState<AmericanParams | undefined>(
		undefined
	);
	const [amer, setAmer] = useState<BinomialTree | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (amerParams) {
			console.log(amerParams);
			setAmer(new BinomialTree(amerParams));
		}
	}, [amerParams]);

	useEffect(() => {
		if (amer) amer.debug();
	}, [amer]);

	const onFinish = (value: AmericanRawParams) => {
		setAmerParams(parseRawParams<AmericanRawParams, AmericanParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setAmerParams(undefined);
		setAmer(undefined);
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
						label="TTM in year"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
				</Col>
				<Col className="gutter-row input-form-col" span={12}>
					<Form.Item
						name="riskFreeRate"
						label="Risk-Free"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="volatility"
						label="Volatility"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="steps"
						label="Steps"
						rules={[{ required: true }]}
					>
						<Input type="number" step="1" />
					</Form.Item>
					<Form.Item
						name="optionType"
						label="Type"
						rules={[{ required: true }]}
					>
						<Select placeholder="Option Type" allowClear>
							<Select.Option value="C">
								American Call
							</Select.Option>
							<Select.Option value="P">
								American Put
							</Select.Option>
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
			{typeof amer !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable amerParams={amerParams} value={0} />
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default BinomialTreeView;
