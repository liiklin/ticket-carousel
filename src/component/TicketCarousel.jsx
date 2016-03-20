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
			datas: new Array()
		};
	}
	componentDidMount() {
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
			// let dataSub = _.difference(_.rest(this.state.datas, page * rows), _.rest(this.state.datas, (page + 1) * rows));
			// console.log(JSON.stringify(dataSub));
			if (dataSub.length) {
				let columns = _.map(_.keys(dataSub[0]), (key) => {
					return {
						"title": key,
						"dataIndex": key,
						"key": key
					}
				});
				let dataSource = dataSub;
				return (
					<div>
					    <Table 
					    	columns={columns}
					    	dataSource={dataSource}
					    	showHeader={false}
					    	pagination={false}/>
					</div>
				)
			}
		});
		return (
			<Carousel autoplaySpeed={this.state.playSpeed} autoplay="true" effect="fade">
				{tables}
			</Carousel>
		)
	}
}

export default TicketCarousel;