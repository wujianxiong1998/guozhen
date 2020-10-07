/**
 * 计划分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate, VtxModalList } from 'vtx-ui';
const { VtxMonthPicker} = VtxDate;
import {  Select, Spin, } from 'antd';
const Option = Select.Option;
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {VtxTimeUtil} from '../../utils/tools'
import styles from './index.less'
class BenchmarkAnalysis extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const t = this;
        const { regionalCompanySelect, waterStandardSelect, processTypeSelect, businessUnitList, targetSelect,
            diffAreaProps, diffFactoryProps, diffCraftProps,
            sameCraftProps, sameCraftStandardProps} =this.props.benchmarkAnalysis
        const dispatch = this.props.dispatch
        const chartColors = ['#73abfe', '#2f4554', '#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'benchmarkAnalysis/getData' });
        }
        const updateState = (obj) => {
            dispatch({
                type: 'benchmarkAnalysis/updateState',
                payload: {
                    ...obj
                }
            })
        }
        const diffAreaQueryProps = {
            startTimeProps:{
                value: diffAreaProps.startTime,
                onChange(date, dateString) {
                    updateState({
                        diffAreaProps: {
                            startTime: dateString,
                        }
                    })

                    dispatch({ type: 'benchmarkAnalysis/getDiffAreaChart' });
                    // if (moment(dateString).isSameOrBefore(moment(diffAreaProps.endTime))) {
                    //     getList()
                    // }

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(diffAreaProps.endTime)));
                }
            },
            endTimeProps:{
                value: diffAreaProps.endTime,
                onChange(date, dateString) {
                    updateState({
                        diffAreaProps: {
                            endTime: dateString,
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffAreaChart' });
                    // if (moment(dateString).isSameOrBefore(moment(diffAreaProps.endTime))) {
                    //     getList()
                    // }

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(diffAreaProps.startTime)));
                }
            },
            businessUnitIdProps:{
                value: diffAreaProps.businessUnitId,
                onChange:(value) => {
                    updateState({
                        diffAreaProps:{
                            businessUnitId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffAreaChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder:"请选择事业部"
            },
            libraryIdProps:{
                value: diffAreaProps.libraryId,
                onChange: (value) => {
                    updateState({
                        diffAreaProps: {
                            libraryId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffAreaChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择指标"
            }
        }
        const diffAreaOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: diffAreaProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis:[{
                type:'value'
            }],
            series:[{
                type:'bar',
                data:diffAreaProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        const diffFactoryQueryProps={
            startTimeProps: {
                value: diffFactoryProps.startTime,
                onChange(date, dateString) {
                    updateState({
                        diffFactoryProps: {
                            startTime: dateString,
                        }
                    })

                    dispatch({ type: 'benchmarkAnalysis/getDiffFactoryChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(diffFactoryProps.endTime)));
                }
            },
            endTimeProps: {
                value: diffFactoryProps.endTime,
                onChange(date, dateString) {
                    updateState({
                        diffFactoryProps: {
                            endTime: dateString,
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffFactoryChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(diffFactoryProps.startTime)));
                }
            },
            libraryIdProps: {
                value: diffFactoryProps.libraryId,
                onChange: (value) => {
                    updateState({
                        diffFactoryProps: {
                            libraryId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffFactoryChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择指标"
            },
            regionalCompanyIdProps: {
                value: diffFactoryProps.regionalCompanyId,
                onChange: (value) => {
                    updateState({
                        diffFactoryProps: {
                            regionalCompanyId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffFactoryChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择区域"
            }
        }
        const diffFactoryOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: diffFactoryProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                type: 'bar',
                data: diffFactoryProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        const diffCraftQueryProps = {
            startTimeProps: {
                value: diffCraftProps.startTime,
                onChange(date, dateString) {
                    updateState({
                        diffCraftProps: {
                            startTime: dateString,
                        }
                    })

                    dispatch({ type: 'benchmarkAnalysis/getDiffCraftChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(diffCraftProps.endTime)));
                }
            },
            endTimeProps: {
                value: diffCraftProps.endTime,
                onChange(date, dateString) {
                    updateState({
                        diffCraftProps: {
                            endTime: dateString,
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffCraftChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(diffCraftProps.startTime)));
                }
            },
            businessUnitIdProps: {
                value: diffCraftProps.businessUnitId,
                onChange: (value) => {
                    updateState({
                        diffCraftProps: {
                            businessUnitId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffCraftChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择事业部"
            },
            libraryIdProps: {
                value: diffCraftProps.libraryId,
                onChange: (value) => {
                    updateState({
                        diffCraftProps: {
                            libraryId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getDiffCraftChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择指标"
            }
        }
        const diffCraftOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: diffCraftProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                type: 'bar',
                data: diffCraftProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }

        const sameCraftQueryProps = {
            startTimeProps: {
                value: sameCraftProps.startTime,
                onChange(date, dateString) {
                    updateState({
                        sameCraftProps: {
                            startTime: dateString,
                        }
                    })

                    dispatch({ type: 'benchmarkAnalysis/getSameCraftChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(sameCraftProps.endTime)));
                }
            },
            endTimeProps: {
                value: sameCraftProps.endTime,
                onChange(date, dateString) {
                    updateState({
                        sameCraftProps: {
                            endTime: dateString,
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(sameCraftProps.startTime)));
                }
            },
            libraryIdProps: {
                value: sameCraftProps.libraryId,
                onChange: (value) => {
                    updateState({
                        sameCraftProps: {
                            libraryId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择指标"
            },
            processTypeIdProps: {
                value: sameCraftProps.processTypeId,
                onChange: (value) => {
                    updateState({
                        sameCraftProps: {
                            processTypeId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择工艺"
            },
            regionalCompanyIdProps: {
                value: sameCraftProps.regionalCompanyId,
                onChange: (value) => {
                    updateState({
                        sameCraftProps: {
                            regionalCompanyId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择区域"
            }
        }
        const sameCraftOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: sameCraftProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                type: 'bar',
                data: sameCraftProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        const sameCraftStandardQueryProps = {
            startTimeProps: {
                value: sameCraftStandardProps.startTime,
                onChange(date, dateString) {
                    updateState({
                        sameCraftStandardProps: {
                            startTime: dateString,
                        }
                    })

                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(sameCraftStandardProps.endTime)));
                }
            },
            endTimeProps: {
                value: sameCraftStandardProps.endTime,
                onChange(date, dateString) {
                    updateState({
                        sameCraftStandardProps: {
                            endTime: dateString,
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(sameCraftStandardProps.startTime)));
                }
            },
            libraryIdProps: {
                value: sameCraftStandardProps.libraryId,
                onChange: (value) => {
                    updateState({
                        sameCraftStandardProps: {
                            libraryId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择指标"
            },
            processTypeIdProps: {
                value: sameCraftStandardProps.processTypeId,
                onChange: (value) => {
                    updateState({
                        sameCraftStandardProps: {
                            processTypeId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择工艺"
            },
            regionalCompanyIdProps: {
                value: sameCraftStandardProps.regionalCompanyId,
                onChange: (value) => {
                    updateState({
                        sameCraftStandardProps: {
                            regionalCompanyId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择区域"
            },
            waterStandardIdProps:{
                value: sameCraftStandardProps.waterStandardId,
                onChange: (value) => {
                    updateState({
                        sameCraftStandardProps: {
                            waterStandardId: value
                        }
                    })
                    dispatch({ type: 'benchmarkAnalysis/getSameCraftStandardChart' });
                },
                style: {
                    width: '100%'
                },
                placeholder: "请选择出水标准"
            }
        }
        const sameCraftStandardOptions = {
            color: chartColors,
            tooltip: {
                trigger: 'item',
            },
            xAxis: [
                {
                    type: 'category',
                    data: sameCraftStandardProps.xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                type: 'bar',
                data: sameCraftStandardProps.data,
                itemStyle: {
                    barBorderRadius: 5,
                },
                barMaxWidth: 40,
            }]
        }
        return (
            <div className={styles.normal}>
                <div className={styles.chartContainer}>
                    <div className={styles.chartBox}>
                        <div className={styles.bigChart}>
                            <div className={styles.headerContainer}>
                                <div className={styles.title}>
                                    不同区域之间对比
                                </div>
                                <div className={styles.select}>
                                    <div 
                                        className={styles.singleLine}
                                    >
                                        <VtxMonthPicker {...diffAreaQueryProps.startTimeProps} />
                                        <div className={styles.splitContainer}>~</div>
                                        <VtxMonthPicker {...diffAreaQueryProps.endTimeProps} />
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select
                                            
                                        {...diffAreaQueryProps.businessUnitIdProps}>
                                        {businessUnitList.map(item => {
                                            return <Option key={item.id}>{item.name}</Option>
                                        })}
                                        </Select>
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...diffAreaQueryProps.libraryIdProps}>
                                            {targetSelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.chart}
                                style={{height:'380px'}}
                            >
                                <Spin spinning={diffAreaProps.loading}>
                                    <ReactEcharts
                                        option={diffAreaOptions}
                                        notMerge={true}
                                        lazyUpdate={false}
                                        style={{ width: '100%', height: 360 }}
                                    />
                                </Spin>
                            </div>
                         </div>
                    </div>
                    <div className={styles.chartBox}>
                        <div className={styles.bigChart}>
                            <div className={styles.headerContainer}>
                                <div className={styles.title}>
                                    同区域各水厂之间对比
                                </div>
                                <div className={styles.select}>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <VtxMonthPicker {...diffFactoryQueryProps.startTimeProps} />
                                        <div className={styles.splitContainer}>~</div>
                                        <VtxMonthPicker {...diffFactoryQueryProps.endTimeProps} />
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...diffFactoryQueryProps.regionalCompanyIdProps}>
                                            {regionalCompanySelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...diffFactoryQueryProps.libraryIdProps}>
                                            {targetSelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.chart}
                                style={{ height: '380px' }}
                            >
                                <Spin spinning={diffFactoryProps.loading}>
                                    <ReactEcharts
                                        option={diffFactoryOptions}
                                        notMerge={true}
                                        lazyUpdate={false}
                                        style={{ width: '100%', height: 360 }}
                                    />
                                </Spin>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chartBox}>
                        <div className={styles.bigChart}>
                            <div className={styles.headerContainer}>
                                <div className={styles.title}>
                                    不同工艺之间对比
                                </div>
                                <div className={styles.select}>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <VtxMonthPicker {...diffCraftQueryProps.startTimeProps} />
                                        <div className={styles.splitContainer}>~</div>
                                        <VtxMonthPicker {...diffCraftQueryProps.endTimeProps} />
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...diffCraftQueryProps.businessUnitIdProps}>
                                            {businessUnitList.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...diffCraftQueryProps.libraryIdProps}>
                                            {targetSelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.chart}
                                style={{ height: '380px' }}
                            >
                                <Spin spinning={diffCraftProps.loading}>
                                    <ReactEcharts
                                        option={diffCraftOptions}
                                        notMerge={true}
                                        lazyUpdate={false}
                                        style={{ width: '100%', height: 360 }}
                                    />
                                </Spin>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chartBox}>
                        <div className={styles.bigChart}>
                            <div className={styles.headerContainer}>
                                <div className={styles.title}>
                                    同工艺之间对比
                                </div>
                                <div className={styles.select}>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <VtxMonthPicker {...sameCraftQueryProps.startTimeProps} />
                                        <div className={styles.splitContainer}>~</div>
                                        <VtxMonthPicker {...sameCraftQueryProps.endTimeProps} />
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...sameCraftQueryProps.processTypeIdProps}>
                                            {processTypeSelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...sameCraftQueryProps.regionalCompanyIdProps}>
                                            {regionalCompanySelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                    <div
                                        className={styles.singleLine}
                                    >
                                        <Select

                                            {...sameCraftQueryProps.libraryIdProps}>
                                            {targetSelect.map(item => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={styles.chart}
                                style={{ height: '350px' }}
                            >
                                <Spin spinning={sameCraftProps.loading}>
                                    <ReactEcharts
                                        option={sameCraftOptions}
                                        notMerge={true}
                                        lazyUpdate={false}
                                        style={{ width: '100%', height: 330 }}
                                    />
                                </Spin>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chartBox}>
                        <div className={styles.bigChart}>
                            <div className={styles.bigChart}>
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        同工艺、同出水标准之间的对比
                                    </div>
                                    <div className={styles.select}>
                                        <div
                                            className={styles.singleLine}
                                        >
                                            <VtxMonthPicker {...sameCraftStandardQueryProps.startTimeProps} />
                                            <div className={styles.splitContainer}>~</div>
                                            <VtxMonthPicker {...sameCraftStandardQueryProps.endTimeProps} />
                                        </div>
                                        <div
                                            className={styles.singleLine}
                                        >
                                            <Select

                                                {...sameCraftStandardQueryProps.processTypeIdProps}>
                                                {processTypeSelect.map(item => {
                                                    return <Option key={item.id}>{item.name}</Option>
                                                })}
                                            </Select>
                                        </div>
                                        <div
                                            className={styles.singleLine}
                                        >
                                            <Select

                                                {...sameCraftStandardQueryProps.waterStandardIdProps}>
                                                {waterStandardSelect.map(item => {
                                                    return <Option key={item.id}>{item.name}</Option>
                                                })}
                                            </Select>
                                        </div>
                                        <div
                                            className={styles.singleLine}
                                        >
                                            <Select

                                                {...sameCraftStandardQueryProps.regionalCompanyIdProps}>
                                                {regionalCompanySelect.map(item => {
                                                    return <Option key={item.id}>{item.name}</Option>
                                                })}
                                            </Select>
                                        </div>
                                        <div
                                            className={styles.singleLine}
                                        >
                                            <Select

                                                {...sameCraftStandardQueryProps.libraryIdProps}>
                                                {targetSelect.map(item => {
                                                    return <Option key={item.id}>{item.name}</Option>
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={styles.chart}
                                    style={{ height: '320px' }}
                                >
                                    <Spin spinning={sameCraftStandardProps.loading}>
                                        <ReactEcharts
                                            option={sameCraftStandardOptions}
                                            notMerge={true}
                                            lazyUpdate={false}
                                            style={{ width: '100%', height: 300 }}
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
    ({ benchmarkAnalysis }) => ({ benchmarkAnalysis })
)(BenchmarkAnalysis);