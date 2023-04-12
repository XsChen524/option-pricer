import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { KikoParams, KikoRawParams, KikoResult } from "service";
import "../style/view/global.css";
import { parseRawParams } from "utils/utils";
import Kiko from "service/kiko";

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
	kikoParams: KikoParams | undefined,
	kiko: KikoResult | undefined
): ResultDataType[] => {
	if (kikoParams && kiko) {
		return [
			{
				key: "1",
				key1: "Spot Price",
				value1: kikoParams.spot,
				key2: "Strike",
				value2: kikoParams.strike,
			},
			{
				key: "2",
				key1: "Time to Maturity",
				value1: kikoParams.timeToMaturity,
				key2: "Risk-Free Rate",
				value2: kikoParams.riskFreeRate,
			},
			{
				key: "3",
				key1: "Volatility",
				value1: kikoParams.volatility,
				key2: "Rebate",
				value2: kikoParams.rebate,
			},
			{
				key: "4",
				key1: "Option Type",
				value1: "KIKO Put",
				key2: "Observe Time",
				value2: kikoParams.observeTime,
			},
			{
				key: "5",
				key1: "Lower Barrier",
				value1: kikoParams.lowerBarrier,
				key2: "Upper Barrier",
				value2: kikoParams.upperBarrier,
			},
			{
				key: "6",
				key1: "Std Dev",
				value1: kiko.std,
				key2: "Conf Int",
				value2: `[${kiko.confInt[0]}, ${kiko.confInt[1]}]`,
			},
		];
	}
	return [];
};

const ResultTable: React.FunctionComponent<{
	kikoParams: KikoParams | undefined;
	kiko: KikoResult | undefined;
}> = (props: {
	kikoParams: KikoParams | undefined;
	kiko: KikoResult | undefined;
}) => {
	const tableTitle = () => {
		if (props.kiko)
			return <h3>KIKO Put value by Quasi-MC: {props.kiko.value}</h3>;
		return undefined;
	};

	return (
		<>
			{" "}
			{props.kikoParams ? (
				<Table
					className="result-table"
					bordered
					columns={ResultColumns}
					showHeader={false}
					dataSource={parseData(props.kikoParams, props.kiko)}
					size="small"
					title={tableTitle}
					pagination={false}
				/>
			) : undefined}
		</>
	);
};

const KikoView: React.FunctionComponent<{}> = () => {
	const [kikoParams, setKikoParams] = useState<KikoParams | undefined>(
		undefined
	);
	const [kiko, setKiko] = useState<Kiko | undefined>(undefined);
	const [form] = Form.useForm();

	useEffect(() => {
		if (kikoParams) setKiko(new Kiko(kikoParams));
	}, [kikoParams]);

	/*
	useEffect(() => {
		if (kiko) kiko.debug();
	}, [kiko]);
	*/

	const onFinish = (value: KikoRawParams) => {
		setKikoParams(parseRawParams<KikoRawParams, KikoParams>(value));
	};

	const onReset = () => {
		form.resetFields();
		setKikoParams(undefined);
		setKiko(undefined);
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
					<Form.Item
						name="rebate"
						label="Rebate"
						rules={[{ required: true }]}
					>
						<Input prefix="$" type="number" step="0.01" />
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
						name="lowerBarrier"
						label="Lower Barrier"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="upperBarrier"
						label="Upper Barrier"
						rules={[{ required: true }]}
					>
						<Input type="number" step="0.01" />
					</Form.Item>
					<Form.Item
						name="observeTime"
						label="Observe Time"
						rules={[{ required: true }]}
					>
						<Input type="number" step="1" />
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
			{kiko ? (
				<Row>
					<Col>
						<ResultTable
							kikoParams={kikoParams}
							kiko={kiko.getResults()}
						/>
					</Col>
				</Row>
			) : null}
		</Form>
	);
};

export default KikoView;
