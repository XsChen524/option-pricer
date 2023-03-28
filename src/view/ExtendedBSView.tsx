import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { ExtendedBSParams, ExtendedBSRawParams } from "service";
import ExtendedBS from "service/extendedBs";
import "../style/view/global.css";
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

const parseData = (ebs: ExtendedBSParams | undefined): ResultDataType[] => {
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
				value1: ebs.termToMaturity,
				key2: "Risk-Free Rate",
				value2: ebs.riskFreeRate,
			},
			{
				key: "3",
				key1: "Repo Rate",
				value1: ebs.repoRate,
				key2: "Volatility",
				value2: ebs.volatility,
			},
			{
				key: "4",
				key1: "Option Type",
				value1:
					ebs.optionType === "C" ? "European Call" : "European Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number;
	ebsParams: ExtendedBSParams | undefined;
}> = (props: { value: number; ebsParams: ExtendedBSParams | undefined }) => {
	const tableTitle = () => {
		return <h3>Option value by Extened Black Scholes: {props.value}</h3>;
	};

	return (
		<>
			{" "}
			{props.ebsParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.ebsParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const ExtendedBSView: React.FunctionComponent<{}> = () => {
	const [ebsParams, setEbsParams] = useState<ExtendedBSParams | undefined>(
		undefined
	);
	const [ebs, setEbs] = useState<ExtendedBS | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof ebsParams !== "undefined") setEbs(new ExtendedBS(ebsParams));
	}, [ebsParams]);

	const onFinish = (value: ExtendedBSRawParams) => {
		setEbsParams(
			parseRawParams<ExtendedBSRawParams, ExtendedBSParams>(value)
		);
	};

	const onReset = () => {
		form.resetFields();
		setEbsParams(undefined);
		setEbs(undefined);
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
						name="termToMaturity"
						label="TM in year"
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
						name="repoRate"
						label="Repo Rate"
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
						name="optionType"
						label="Type"
						rules={[{ required: true }]}
					>
						<Select placeholder="Option Type" allowClear>
							<Select.Option value="C">
								European Call
							</Select.Option>
							<Select.Option value="P">
								European Put
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
			{typeof ebs !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable
							ebsParams={ebsParams}
							value={ebs.vanilla()}
						/>
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default ExtendedBSView;
