/**
 * 计划分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate, } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Select,Tooltip ,Spin} from 'antd';
const Option = Select.Option;
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from './index.less'
import {VtxTimeUtil} from '../../utils/tools'
class DrugAnalysis extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            height:0,
        };
    }
    componentDidMount() {
        this.setState({
            height: $('body').height() -100 < 300 ? 300 : $('body').height() -100,
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
            height: $('body').height() -100 < 300 ? 300 : $('body').height() -100,
        })
    }
    render(){
        const t = this;
        const { searchParams, regionalCompanySelect, waterFactorySelect, drugNameSelect, waterFactoryInfo,
            xList, yDrugCost, yDrugConsume,loading
            } =this.props.drugAnalysis
        const dispatch = this.props.dispatch
        const chartColors = ['#73abfe', '#2f4554', '#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'drugAnalysis/getWaterFactoryInfo' });
            dispatch({ type: 'drugAnalysis/getData' });
        }
        const updateState = (obj) => {
            dispatch({
                type: 'drugAnalysis/updateState',
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
                dispatch({ type: 'drugAnalysis/initQueryParams' });
                dispatch({ type: 'drugAnalysis/getData' });
            },
            startDateProps:{
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
                allowClear: true,
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
                allowClear: true,
                style: {
                    width: '100%'
                }
            },
            drugNameProps: {
                value: searchParams.libraryId,
                placeholder: "请选择药剂名称",
                onChange(value) {
                    updateState({
                        searchParams: {
                            libraryId: value
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
        const options = {
            color: chartColors,
            tooltip: {
                trigger: 'axis',
                confine: true
            },
            // title: {
            //     left: 'center',
            //     text: '药耗分析',
            // },
            legend: {
                data: ['药剂单耗', '药剂成本'],
            },
            xAxis: [
                {
                    type: 'category',
                    data:xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '药剂单耗/m³',
                    min: 0,
                    // max: 250,
                    // interval: 50,
                    // axisLabel: {
                    //     formatter: '{value}'
                    // }
                },
                {
                    type: 'value',
                    name: '药剂成本/元',
                    min: 0,
                    // max: 25,
                    // interval: 5,
                    // axisLabel: {
                    //     formatter: '{value}'
                    // }
                }
            ],
            series:[
                {
                    name:'药剂单耗',
                    type:'bar',
                    data:yDrugConsume,
                    itemStyle: {
                        barBorderRadius: 5,
                    },
                },
                {
                    name:'药剂成本',
                    type:'line',
                    data:yDrugCost,
                    yAxisIndex: 1,
                }
            ]
        }
        return (
            <div className={styles.normal}>
                <VtxGrid
                    titles={['故障时间', '区域', '水厂', '药剂名称']}
                    gridweight={[2, 1, 1, 1]}
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
                    <Select {...vtxGridParams.drugNameProps}>
                        {drugNameSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                </VtxGrid>
                <div className={styles.normal_body}>
                    
                    <div className={styles.chartContainer}>
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
                        <div className={styles.chart}>
                            <Spin spinning={loading}>
                            <ReactEcharts
                                option={options}
                                notMerge={true}
                                lazyUpdate={false}
                                style={{ width: '100%',height:t.state.height}}
                            />
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    ({ drugAnalysis }) => ({ drugAnalysis })
)(DrugAnalysis);