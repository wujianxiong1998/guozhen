import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import ReactEcharts from "echarts-for-react";

moment.locale('zh-cn');

export default class PollutionPotency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        const _this = this;
        $('#pollutionPotency').on({
            mouseover: function () {
                _this.props.mouseMove(0)
            },
            mouseout: function () {
                _this.props.mouseMove(1)
            }
        });
    }
    
    render() {
        const {pollutionPotencyData, pollutionTab, clickTab} = this.props;
        
        //折线配置
        const chartOption = {
            color: ['#7cdfff'],
            grid: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 10,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                confine: true
            },
            xAxis: {
                type: 'category',
                data: pollutionPotencyData[`xAxisData${pollutionTab}`] || [],
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
                    name: '浓度(mg/L)',
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
                    data: pollutionPotencyData[`yAxisData${pollutionTab}`] || [],
                    type: 'line',
                    symbolSize: 0,
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
            <div className={styles.pollutionPotency} id='pollutionPotency'>
                <div style={{height: '14%'}}>
                    <div className={styles.tabBar}>
                        {
                            pollutionPotency.map((item, index) => (
                                <div key={item.code} className={styles.tabItem}
                                     onClick={() => clickTab(item.code)}
                                     style={{
                                         left: `${index * 25}%`,
                                         borderColor: item.code === pollutionTab ? '#fff' : 'transparent'
                                     }}>{item.name}</div>
                            ))
                        }
                    </div>
                </div>
                <ReactEcharts style={{width: '100%', height: '86%', marginTop: '2%'}} option={chartOption}
                              notMerge={true}/>
            </div>
        );
    };
}
