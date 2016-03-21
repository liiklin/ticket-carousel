import React, {
	Component
}
from 'react';

import {
	Carousel, Table
}
from 'antd';

import _ from 'underscore';
import moment from "moment";

import "./TicketCarousel.less";

const baseUrl = 'http://gugud.com:8880/tickets/';

const columns = [{
	title: '序号',
	dataIndex: 'id',
	key: 'id',
}, {
	title: '客户',
	dataIndex: 'customer',
	key: 'customer',
}, {
	title: '描述',
	dataIndex: 'descr',
	key: 'descr',
}, {
	title: '地点',
	dataIndex: 'location',
	key: 'location',
}, {
	title: '编号(sn)',
	dataIndex: 'sn',
	key: 'sn',
}, {
	title: '状态',
	dataIndex: 'state',
	key: 'state',
}, {
	title: '指定负责人',
	dataIndex: 'worker',
	key: 'worker',
}, {
	title: '提交时间',
	dataIndex: 'inserted_at',
	key: 'inserted_at',
}, {
	title: '安排时间',
	dataIndex: 'deploy_at',
	key: 'deploy_at',
}, {
	title: '安排时间',
	dataIndex: 'finish_at',
	key: 'finish_at',
}, {
	title: '地点',
	dataIndex: 'location',
	key: 'location',
}];

class TicketCarousel extends React.Component {
	constructor() {
		super();
		this.state = {
			playSpeed: 5000,
			autoPlay: true,
			startLoop: true,
			datas: new Array()
		};
	}
	componentDidMount() {
		this.fetchData();
		if (this.state.startLoop) {
			this.timer = setInterval(function() {
				this.fetchData();
			}.bind(this), 30000);
		}
	}
	fetchData() {
		fetch(baseUrl)
			.then(response => response.json())
			.then((json) => {
				json = _.map(json, (val) => { //格式化
					return {
						"key": val.id,
						"worker": val.worker,
						"state": val.state,
						"sn": val.sn,
						"location": val.location,
						"inserted_at": moment(val.inserted_at).format("YYYY-MM-DD HH:mm:ss"),
						"id": val.id,
						"finish_at": val.finish_at ? moment(val.finish_at).format("YYYY-MM-DD HH:mm:ss") : '',
						"descr": val.descr,
						"deploy_at": moment(val.deploy_at).format("YYYY-MM-DD HH:mm:ss"),
						"customer": val.customer,
					}
				});
				this.setState({
					datas: json
				});
			})
			.catch(e => console.error('error: ' + e));
	}
	render() {
		let rows = 5, //每屏显示多少条
			pages = Math.ceil(this.state.datas.length / rows);
		let tables = _.map(_.range(pages), (page) => {
			let dataSub = this.state.datas.slice(page * rows, (page + 1) * rows);
			let table = _.map(dataSub, (val) => {
				let columns = _.map(_.keys(val), (key) => {
						return {
							"title": key,
							"dataIndex": key,
							"key": key,
							"width": 100
						}
					}),
					dataSource = new Array();
				dataSource.push(val);
				return (
					<div>
						<Table
							rowKey={record => record.key}
					    	columns={columns}
					    	className={val.state}
					    	dataSource={dataSource}
					    	showHeader={false}
					    	pagination={false}/>
					</div>
				);
			});
			return (
				<div>
					{table}
				</div>
			);
		});
		return (
			<Carousel autoplaySpeed={this.state.playSpeed} autoplay={this.state.autoPlay}  effect="fade">
				{tables}
			</Carousel>
		)
	}
}

export default TicketCarousel;