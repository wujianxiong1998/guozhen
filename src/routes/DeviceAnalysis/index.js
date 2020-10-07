/**
 * 设备分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Select, Tooltip, Progress, Radio,Spin } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';
import {VtxTimeUtil} from '../../utils/tools';
class DeviceAnalysis extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            height:0
        }
    }
    componentDidMount() {
        this.setState({
            height: $('body').height() - 130 < 300 ? 300 : $('body').height() - 130,
        })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.setState = () => {
            return;
        };
    }
    onWindowResize = () => {
        this.setState({
            height: $('body').height() - 130 < 300 ? 300 : $('body').height() - 130,
        })
    }
    render(){
        const t = this;
        const {height} = t.state
        const { searchParams, deviceSelect, businessUnitList, diffLevelProps,
            diffFacrotyProps }= this.props.deviceAnalysis
        const dispatch = t.props.dispatch
        const chartColors = ['#73abfe', '#2f4554', '#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'deviceAnalysis/getMalfunctionData' });
            dispatch({ type: 'deviceAnalysis/getDeviceChartData' });
        }
        const updateState = (obj) => {
            dispatch({
                type: 'deviceAnalysis/updateState',
                payload: {
                    ...obj
                }
            })
        }
        const vtxGridParams = {
            query() {
                getList()
            },
            clear() {
                dispatch({ type: 'deviceAnalysis/initQueryParams' });
                dispatch({ type: 'deviceAnalysis/getData' });
            },
            startTimeProps: {
                value: [searchParams.startTime, searchParams.endTime],
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            startTime: dateString[0],
                            endTime: dateString[1]
                        }
                    })
                    getList();
                },
                style: {
                    width: '100%'
                },
                disabledDate(current) {
                    return current && VtxTimeUtil.isAfterDate(current);
                }
            },
            businessUnitIdProps: {
                value: searchParams.businessUnitId,
                showSearch: true,
                optionFilterProp: 'children',
                placeholder: "请选择事业部",
                onChange(value) {
                    updateState({
                        searchParams: {
                            businessUnitId: value
                        }
                    })
                    getList();
                },
                allowClear: true,
                style: {
                    width: '100%'
                }
            },
            deviceIdProps: {
                value: searchParams.deviceId?{ key: searchParams.deviceId, label:searchParams.deviceName}:undefined,
                labelInValue:true,
                placeholder: "请选择设备",
                onChange(value) {
                    updateState({
                        searchParams: {
                            deviceId: value?value.key:'',
                            deviceName:value?value.label:''
                        }
                    })
                    getList();
                },
                allowClear: true,
                style: {
                    width: '100%'
                }
            },
        }
        const diffLevelOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: diffLevelProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value',
                name:'故障频次'
            }],
            series: [{
                type: 'bar',
                data: diffLevelProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        const diffFactoryOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: diffFacrotyProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value',
            }],
            series: [{
                type: 'bar',
                data: diffFacrotyProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        return(
            <div className={styles.normal}>
                <VtxGrid
                    titles={['时间', '事业部','设备']}
                    gridweight={[2, 1, 1]}
                    confirm={vtxGridParams.query}
                    hiddenclearButtion
                >
                    <VtxRangePicker {...vtxGridParams.startTimeProps} />
                    <Select {...vtxGridParams.businessUnitIdProps}>
                        {businessUnitList.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Select {...vtxGridParams.deviceIdProps}>
                        {deviceSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    

                </VtxGrid>
                <div className={styles.normal_body}>
                    <div className={styles.chartContainer}>
                        <div className={styles.chartBox}>
                            <div className={styles.bigChart}>
                                <div className={styles.headerContainer}>
                                    <RadioGroup value={diffLevelProps.dataType} onChange={(e)=>{
                                        updateState({
                                            diffLevelProps:{
                                                dataType:e.target.value
                                            }
                                        })
                                        dispatch({ type: 'deviceAnalysis/getMalfunctionData' });
                                    }}>
                                        <RadioButton value='grade'>等级</RadioButton>
                                        <RadioButton value='type'>类型</RadioButton>
                                    </RadioGroup>
                                </div>
                                <div className={styles.chart}>
                                    <Spin spinning={diffLevelProps.loading}>
                                        <ReactEcharts
                                            option={diffLevelOptions}
                                            notMerge={true}
                                            lazyUpdate={false}
                                            style={{ width: '100%', height }}
                                        />
                                    </Spin>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBox}>
                            <div className={styles.bigChart}>
                                <div className={styles.headerContainer}>
                                    <RadioGroup value={diffFacrotyProps.dataType} onChange={(e) => {
                                        updateState({
                                            diffFacrotyProps: {
                                                dataType: e.target.value
                                            }
                                        })
                                        dispatch({ type: 'deviceAnalysis/getDeviceChartData' });
                                    }}>
                                        <RadioButton value='price'>采购价格</RadioButton>
                                        <RadioButton value='breakCount'>故障频次</RadioButton>
                                        <RadioButton value='life'>使用寿命</RadioButton>
                                        <RadioButton value='allMoney'>全生命周期费用</RadioButton>
                                    </RadioGroup>
                                </div>
                                <div className={styles.chart}>
                                    <Spin spinning={diffFacrotyProps.loading}>
                                        <ReactEcharts
                                            option={diffFactoryOptions}
                                            notMerge={true}
                                            lazyUpdate={false}
                                            style={{ width: '100%', height }}
                                        />
                                    </Spin>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    ({ deviceAnalysis }) => ({ deviceAnalysis })
)(DeviceAnalysis);