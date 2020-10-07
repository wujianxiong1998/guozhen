import React from 'react';
import moment from 'moment';
import {Table} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import ReactEcharts from "echarts-for-react";

moment.locale('zh-cn');

export default class EffluentVolume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        const _this = this;
        $('#effluentVolume').on({
            mouseover: function () {
                _this.props.mouseMove(0)
            },
            mouseout: function () {
                _this.props.mouseMove(1)
            }
        });
    }
    
    render() {
        const {effluentVolume} = this.props;
        
        //表格配置
        const chartOption = {
            color: ['#7cdfff'],
            grid: {
                top: 20,
                left: 10,
                right: 20,
                bottom: 0,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                confine: true
            },
            xAxis: {
                type: 'category',
                data: effluentVolume.xAxisDataWater || [],
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '(万吨)',
                    nameGap: 7,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            fontSize: 12,
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '负荷率(%)',
                    nameGap: 7,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            fontSize: 12,
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                }
            ],
            series: [
                {
                    data: effluentVolume.yAxisDataWater || [],
                    type: 'bar',
                    barWidth: '30%',
                    itemStyle: {
                        normal: {
                            color: '#ffd091'
                        }
                    }
                },
                {
                    data: !!effluentVolume.yAxisLoad ? effluentVolume.yAxisLoad.map(item => {
                        return item * 100
                    }) : [],
                    type: 'line',
                    symbolSize: 0,
                    yAxisIndex: 1,
                    lineStyle: {
                        color: '#bdf698'
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff'
                        }
                    }
                }
            ]
        };
        
        return (
            <div className={styles.effluentVolume} id='effluentVolume'>
                <ReactEcharts style={{width: '100%', height: '100%'}} option={chartOption}
                              notMerge={true}/>
            </div>
        );
    };
}
