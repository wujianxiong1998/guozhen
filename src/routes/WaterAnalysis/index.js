/**
 * 计划分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Select, Tooltip, Radio,Spin } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from './index.less'
import {VtxTimeUtil} from '../../utils/tools'
class WaterAnalysis extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            height:0,
        };
    }
    componentDidMount() {
        this.setState({
            height: $('body').height() - 250 < 300 ? 300 : $('body').height() - 250,
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
            height: $('body').height() - 250 < 300 ? 300 : $('body').height() - 250,
        })
    }
    render(){
        const t = this;
        const { searchParams, regionalCompanySelect, waterFactorySelect, waterAnalysisInfo,
            xList,yBurden,yWater, waterFactoryInfo, tabKey,chartLoading} =this.props.waterAnalysis
        const dispatch = this.props.dispatch
        const chartColors = ['#73abfe', '#2f4554', '#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'waterAnalysis/getWaterFactoryInfo' })
            dispatch({ type: 'waterAnalysis/getWaterAnalysisInfo' })
            dispatch({ type: 'waterAnalysis/getChartData' })
        }
        const updateState = (obj) => {
            dispatch({
                type: 'waterAnalysis/updateState',
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
                dispatch({ type: 'waterAnalysis/initQueryParams' });
                dispatch({ type: 'waterAnalysis/getData' });
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
        const options = {
            color:chartColors,
            tooltip: {
                trigger: 'axis',
                confine: true
            },
            legend: {
                data: ['水量', '负荷']
            },
            xAxis: [
                {
                    type: 'category',
                    data: xList,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '水量/万吨',
                    min: 0,
                    // max: 250,
                    // interval: 50,
                    // axisLabel: {
                    //     formatter: '{value}万吨'
                    // }
                },
                {
                    type: 'value',
                    name: '负荷/万吨',
                    // min: 0,
                    // max: 25,
                    // interval: 5,
                    // axisLabel: {
                    //     formatter: '{value}万吨'
                    // }
                }
            ],
            series:[
                {
                    name:'水量',
                    type:'bar',
                    data:yWater,
                    itemStyle: {
                        barBorderRadius: 5,
                    },
                },
                {
                    name:'负荷',
                    type:'line',
                    data:yBurden,
                    yAxisIndex: 1,
                }
            ]
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
                        <div className={styles.title}>
                        {
                            searchParams.startTime?
                                moment(searchParams.startTime).isSame(moment(searchParams.endTime))?
                                    <div className={styles.text}>{moment(searchParams.startTime).format(' YYYY年MMMDo')+'：'}</div>
                                    :
                                    <div className={styles.text}>{'从'+moment(searchParams.startTime).format('YYYY年MMMDo') + '至' + moment(searchParams.endTime).format('YYYY年MMMDo')+'：'}</div>
                                :''
                         }
                         {
                             waterAnalysisInfo.dealWaterPer?
                             <div style={{marginLeft:'30px',fontWeight:'normal'}} className={styles.text}>
                                        处理水量{waterAnalysisInfo.dealWaterValue}万吨    同比{waterAnalysisInfo.dealWaterPer}
                                        <div style={{display:'inline-block', width:"50px"}}/>
                                        收费水量{waterAnalysisInfo.moneyWaterValue}万吨    同比{waterAnalysisInfo.moneyWaterPer}
    
                             </div>
                             :<div className={styles.text} />
                         }
                        </div>
                        <div className={styles.tab}>
                            <RadioGroup value={tabKey} onChange={(e) => {
                                updateState({
                                    tabKey: e.target.value
                                })
                                dispatch({ type: 'waterAnalysis/getChartData' })
                            }}>
                                <RadioButton value='clsl'>处理水量</RadioButton>
                                <RadioButton value='sfsl'>收费水量</RadioButton>
                            </RadioGroup>
                        </div>
                        <div className={styles.chart}>
                            <Spin spinning={chartLoading}>
                                <ReactEcharts
                                    option={options}
                                    notMerge={true}
                                    lazyUpdate={false}
                                    style={{ width: '100%', height: t.state.height }}
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
    ({ waterAnalysis }) => ({ waterAnalysis })
)(WaterAnalysis);