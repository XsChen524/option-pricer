import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ImpVolParams, ImpVolRawParams } from "service";
import newtonMethod from "service/newtonMethod";
import { parseRawParams } from "utils/utils";
import "../style/view/impVol.css";

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

const parseData = (
	impVolParams: ImpVolParams | undefined
): ResultDataType[] => {
	if (impVolParams) {
		return [
			{
				key: "1",
				key1: "Spot Price",
				value1: impVolParams.spot,
				key2: "Premium",
				value2: impVolParams.value,
			},
			{
				key: "2",
				key1: "Strike",
				value1: impVolParams.strike,
				key2: "Term to Maturity",
				value2: impVolParams.termToMaturity,
			},
			{
				key: "3",
				key1: "Risk-Free Rate",
				value1: impVolParams.riskFreeRate,
				key2: "Repo Rate",
				value2: impVolParams.repoRate,
			},
			{
				key: "4",
				key1: "Option Type",
				value1:
					impVolParams.optionType === "C"
						? "European Call"
						: "European Put",
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	impVolParams: ImpVolParams | undefined;
	impVol: number;
}> = (props: { impVolParams: ImpVolParams | undefined; impVol: number }) => {
	const tableTitle = () => {
		return (
			<h3>Implied Volatility by Newton-Raphson Method: {props.impVol}</h3>
		);
	};

	return (
		<>
			{" "}
			{typeof props.impVolParams !== "undefined" ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.impVolParams)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const ImpVolView: React.FunctionComponent<{}> = () => {
	const [impVolParams, setImpVolParams] = useState<ImpVolParams | undefined>(
		undefined
	);
	const [impVol, setImpVol] = useState<number | undefined>(undefined);

	const [form] = Form.useForm();

	useEffect(() => {
		if (typeof impVolParams !== "undefined")
			setImpVol(newtonMethod(impVolParams));
	}, [impVolParams]);

	const onFinish = (value: ImpVolRawParams) => {
		setImpVolParams(parseRawParams<ImpVolRawParams, ImpVolParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setImpVolParams(undefined);
		setImpVol(undefined);
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
						name="value"
						label="Premium"
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
			{typeof impVol !== "undefined" ? (
				<Row>
					<Col>
						<ResultTable
							impVolParams={impVolParams}
							impVol={impVol}
						/>
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default ImpVolView;
