/**
 * 报警分析
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Row, Col } from 'antd';
const Option = Select.Option;
const { VtxRangePicker } = VtxDate;
import styles from './style.less';

import { handleColumns } from '../../utils/tools';
import PieChart from './PieChart';
import LineChart from './LineChart';

function AlarmAnalyze({ dispatch, alarmAnalyze }) {

    const { queryParams, dataSource, deviceGrade, viewItem, unitSel, typeSel,
    } = alarmAnalyze;

    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'alarmAnalyze/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };

    const updateState = (obj) => {
        dispatch({
            type : 'alarmAnalyze/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'alarmAnalyze/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 报警时间
        timeProps : {
			value : [queryParams.startDay, queryParams.endDay],
			onChange(date, dateString) {
				ParamsUpdateState({
					startDay : dateString[0],
					endDay : dateString[1]
				})
				getList();
			},
			showTime : false,
			style : {
				width : '100%'
			},
			// disabledDate(current) {
			// 	return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
			// }
        },
        // 设备等级
        gradeProps: {
			value : queryParams.code,
			onChange(value) {
				ParamsUpdateState({
					code : value,
				});
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
        // 报警类型
        typeProps: {
			value : queryParams.code,
			onChange(value) {
				ParamsUpdateState({
					code : value,
				});
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
    };

    return (
        <div className={styles.main_page1}>
            <div className={styles.top}>
                <div className={styles.threePart}>
                    <img height={'50px'} width={'50px'} src={'./resources/images/alarms.png'} />
                    <div className={styles.text}>
                        <div className={styles.textInfo}>本月设备报警总数23</div>
                        <div className={styles.textInfo}>环比上涨10%</div>
                    </div>
                </div>
                <div className={styles.threeT}>
                    <div className={styles.partT}>
                        <img height={'50px'} width={'50px'} src={'./resources/images/alarms.png'} />
                        <div className={styles.text}>
                            <div className={styles.textInfo1}>本月设备报警总数23</div>
                            <div className={styles.textInfo1}>环比上涨10%</div>
                        </div>
                    </div>
                    <div className={styles.partT}>
                        <img height={'50px'} width={'50px'} src={'./resources/images/alarms.png'} />
                        <div className={styles.text}>
                            <div className={styles.textInfo1}>本月设备报警总数23</div>
                            <div className={styles.textInfo1}>环比上涨10%</div>
                        </div>
                    </div>
                </div>
                <div className={styles.threeT}>
                    <div className={styles.partT}>
                        <img height={'50px'} width={'50px'} src={'./resources/images/alarms.png'} />
                        <div className={styles.text}>
                            <div className={styles.textInfo1}>本月设备报警总数23</div>
                            <div className={styles.textInfo1}>环比上涨10%</div>
                        </div>
                    </div>
                    <div  className={styles.partT}>
                        <img height={'50px'} width={'50px'} src={'./resources/images/alarms.png'} />
                        <div className={styles.text}>
                            <div className={styles.textInfo1}>本月设备报警总数23</div>
                            <div className={styles.textInfo1}>环比上涨10%</div>
                        </div>
                    </div>
                </div>
            </div>
            <VtxGrid
                titles={['报警时间', '设备等级', '报警类型']}
                gridweight={[2, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*报警时间*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
                {/*设备等级*/}
                <Select {...vtxGridParams.gradeProps}>
					{
						[{id: '1', name: '11'},{id: '2', name: '22'}].map(item => {
							return <Option key={item.id}>{item.name}</Option>
						})
					}
				</Select>
                {/*报警类型*/}
                <Select {...vtxGridParams.typeProps}>
					{
						[{id: '1', name: '11'},{id: '2', name: '22'}].map(item => {
							return <Option key={item.id}>{item.name}</Option>
						})
					}
				</Select>
            </VtxGrid>
            <div className="table-wrapper" style={{paddingTop: '86px'}}>
                <div className={styles.tableBox}>
                    <Row>
                        <Col span={12}>
                            <div className={styles.chartsFonts}>停运时间记录</div>
                            {/* <PieChart data={pieData} data={pieData} title={pieTitle} xAxis={pieXy}/> */}
                            <PieChart /> 
                        </Col>
                        <Col span={12}>
                            <div className={styles.chartsFonts}>停运时间占比图</div>
                            {/* <LineChart data={barData} title={barTitle} xAxis={barXy}/> */}
                            {/* <LineChart /> */}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );

}
export default connect(({ alarmAnalyze }) => ({ alarmAnalyze }))(AlarmAnalyze);