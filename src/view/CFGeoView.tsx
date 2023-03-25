import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import "../style/view/closedformGeo.css";
import { CFGeoParams, CFGeoRawParams } from "service";
import CFGeoAsian from "service/closedformGeometricAsian";
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

const parseData = (cfg: CFGeoParams | undefined): ResultDataType[] => {
	if (cfg) {
		return [
			{
				key: "1",
				key1: "Spot Price",
				value1: cfg.spot,
				key2: "Strike",
				value2: cfg.strike,
			},
			{
				key: "2",
				key1: "Time to Maturity",
				value1: cfg.timeToMaturity,
				key2: "Risk-Free Rate",
				value2: cfg.riskFreeRate,
			},
			{
				key: "3",
				key1: "Volatility",
				value1: cfg.volatility,
				key2: "N",
				value2: cfg.observeTime,
			},
			{
				key: "4",
				key1: "Option Type",
				value1: cfg.optionType === "C" ? "Call" : "Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	value: number;
	cfgParams: CFGeoParams | undefined;
}> = (props: { value: number; cfgParams: CFGeoParams | undefined }) => {
	const tableTitle = () => {
		return <h3>Price of Geometric Asian Option: {props.value}</h3>;
	};

	return (
		<>
			{" "}
			{props.cfgParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.cfgParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const GeometricView: React.FunctionComponent<{}> = () => {
	const [cfgParams, setCfgParams] = useState<CFGeoParams | undefined>(
		undefined
	);
	const [cfg, setCfg] = useState<CFGeoAsian | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof cfgParams !== "undefined") setCfg(new CFGeoAsian(cfgParams));
	}, [cfgParams]);

	const onFinish = (value: CFGeoRawParams) => {
		setCfgParams(parseRawParams<CFGeoRawParams, CFGeoParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setCfgParams(undefined);
		setCfg(undefined);
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
						name="observeTime"
						label="N"
						rules={[{ required: true }]}
					>
						<Input type="number" />
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
			{typeof cfg !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable
							cfgParams={cfgParams}
							value={cfg.price()}
						/>
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default GeometricView;
