/**
 * 电耗分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import {  Select, Tooltip, Spin, Radio  } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ReactEcharts from 'echarts-for-react';
import styles from './index.less'
import { VtxTimeUtil } from '../../utils/tools'
class ElectricAnalysis extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            height: 0,
        };
    }
    componentDidMount() {
        this.setState({
            height: $('body').height() - 180 < 300 ? 300 : $('body').height() - 180,
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
            height: $('body').height() - 180 < 300 ? 300 : $('body').height() - 180,
        })
    }
    render(){
        const t = this;
        const { searchParams, regionalCompanySelect, waterFactorySelect,waterFactoryInfo,
            consumeProps,costProps} =this.props.electricAnalysis
        const dispatch = this.props.dispatch
        const chartColors = ['#73abfe', '#2f4554', '#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'electricAnalysis/getWaterFactoryInfo' })
            dispatch({ type: 'electricAnalysis/getChartData', payload: { chartName: 'consumeProps' } })
            dispatch({ type: 'electricAnalysis/getChartData', payload: { chartName: 'costProps' } })
        }
        const updateState = (obj) => {
            dispatch({
                type: 'electricAnalysis/updateState',
                payload: {
                    ...obj
                }
            })
        }
        const vtxGridParams = {
            query(){
                getList()
            },
            clear(){
                dispatch({ type: 'electricAnalysis/initQueryParams' });
                dispatch({ type: 'electricAnalysis/getData' });
            },
            startDateProps: {
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
            waterFactoryIdProps: {
                value: searchParams.waterFactoryId,
                showSearch: true,
                optionFilterProp: 'children',
                placeholder: "请选择水厂名称",
                onChange(value) {
                    updateState({
                        searchParams: {
                            waterFactoryId: value
                        }
                    })
                    getList();
                },
                style: {
                    width: '100%'
                }
            },
            regionalCompanyIdProps: {
                value: searchParams.regionalCompanyId,
                placeholder: "请选择区域",
                onChange(value) {
                    updateState({
                        searchParams: {
                            regionalCompanyId: value
                        }
                    })
                    getList();
                },
                style: {
                    width: '100%'
                }
            },
        }
        const consumeOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
                confine: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: consumeProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis:{
                type: 'value',
                name: '电单耗/度',
                min: 0,
            },
            series: [
                {
                    name: '电单耗',
                    type: 'bar',
                    data: consumeProps.data,
                    itemStyle: {
                        barBorderRadius: 5,
                    },
                },]
        }
        const costOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
                confine: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: costProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: {
                type: 'value',
                name: '电成本/万元',
                min: 0,
            },
            series: [
                {
                    name: '电单耗',
                    type: 'bar',
                    data: costProps.data,
                    itemStyle: {
                        barBorderRadius: 5,
                    },
                },]
        }
        return (
            <div className={styles.normal}>
                <VtxGrid
                    titles={['故障时间', '区域', '水厂']}
                    gridweight={[2, 1, 1]}
                    confirm={vtxGridParams.query}
                    hiddenclearButtion
                >
                    <VtxRangePicker {...vtxGridParams.startDateProps} />
                    <Select {...vtxGridParams.regionalCompanyIdProps}>
                        {regionalCompanySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Select {...vtxGridParams.waterFactoryIdProps}>
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>

                </VtxGrid>
                <div className={styles.normal_body}>
                   
                    <div className={styles.header}>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.waterFactoryName}>
                                【当天水厂】{waterFactoryInfo.waterFactoryName}

                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.productTypeName}>
                                【项目类型】{waterFactoryInfo.productTypeName}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.processSize}>
                                【设计处理水量】{waterFactoryInfo.processSize}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.processTypeName}>
                                【处理工艺】{waterFactoryInfo.processTypeName}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.workDayNum}>
                                【运行天数】{waterFactoryInfo.workDayNum}
                            </Tooltip>
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        <div className={styles.chartBox}>
                            <div className={styles.bigChart}>
                                <div className={styles.tab}>
                                    <RadioGroup value={consumeProps.tabKey} onChange={(e) => {
                                        updateState({
                                            consumeProps:{
                                                tabKey: e.target.value

                                            }
                                        })
                                        dispatch({ type: 'electricAnalysis/getChartData',payload:{
                                            chartName:'consumeProps'
                                        } })
                                    }}>
                                        <RadioButton value='D'>天</RadioButton>
                                        <RadioButton value='M'>月</RadioButton>
                                    </RadioGroup>
                                </div>
                                <div className={styles.chart}>
                                    <Spin spinning={consumeProps.loading}>
                                        <ReactEcharts
                                            option={consumeOptions}
                                            notMerge={true}
                                            lazyUpdate={false}
                                            style={{ width: '100%', height: t.state.height }}
                                        />
                                    </Spin>

                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBox}>
                            <div className={styles.bigChart}>
                                <div className={styles.tab}>
                                    <RadioGroup value={costProps.tabKey} onChange={(e) => {
                                        updateState({
                                            costProps: {
                                                tabKey: e.target.value

                                            }
                                        })
                                        dispatch({
                                            type: 'electricAnalysis/getChartData', payload: {
                                                chartName: 'costProps'
                                            }
                                        })
                                    }}>
                                        <RadioButton value='D'>天</RadioButton>
                                        <RadioButton value='M'>月</RadioButton>
                                    </RadioGroup>
                                </div>
                                <div className={styles.chart}>
                                    <Spin spinning={costProps.loading}>
                                        <ReactEcharts
                                            option={costOptions}
                                            notMerge={true}
                                            lazyUpdate={false}
                                            style={{ width: '100%', height: t.state.height }}
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
    ({ electricAnalysis }) => ({ electricAnalysis })
)(ElectricAnalysis);