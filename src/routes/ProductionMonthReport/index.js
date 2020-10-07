/**
 * 生产月报
 * author : vtx xxy
 * createTime : 2019-07-26 11:02:04
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxMonthPicker } = VtxDate;
import { Button, Select, Tabs } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane
import styles from './index.less'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

class ProductionMonthReport extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
        };
    };
    componentDidMount() {
        this.setState({
            width: $('body').width()-10,
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
            width: $('body').width() - 10,
        })
    }
    render(){
        const dispatch = this.props.dispatch;
        const {
            searchParams,
            waterFactorySelect,
            currentPage, pageSize, loading, dataSource, total, title
        } = this.props.productionMonthReport;

        const updateState = (obj) => {
            dispatch({
                type: 'productionMonthReport/updateState',
                payload: {
                    ...obj
                }
            })
        }

        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'productionMonthReport/updateQueryParams' });
            dispatch({ type: 'productionMonthReport/getList' });
        }

        // 查询
        const vtxGridParams = {
            // 水厂名称
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
            // 时间
            dateProps: {
                value: searchParams.date,
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            date: dateString
                        }
                    })
                    getList();
                },
                showTime: true,
                style: {
                    width: '100%'
                },
                disabledDate(current) {
                    return current && VtxTimeUtil.isAfterDate(current);
                }
            },
            query() {
                getList();
            },

            clear() {
                dispatch({ type: 'productionMonthReport/initQueryParams' });
                dispatch({ type: 'productionMonthReport/getList' });
            }
        };

        // 列表
        const columnsObj = {
            //运行天数说明及停产分析
            'yxts': [['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],
                ['运营情况总评', 'workAssess', { width: '200px',nowrap:true }],
                ['共运营(天)','workDayTotal', { width: '100px' }],
                ['正常运营(天)', 'normalDays', { width: '100px' }],
                ['停限产(小时)', 'stopHour', { width: '100px' }],
                ['生产事故(天)', 'produceProblem', { width: '100px' }],
                ['停限产原因说明', 'stopReason', { width: '200px', nowrap: true }],
                ['生产事故说明', 'problemReason', { width: '200px', nowrap: true  }]],
            'clsl':[
                ['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],
                ['本月处理水量(万吨)', 'dealWater', { width: '150px' }],
                ['计划处理水量(万吨)', 'planDealWater', { width: '150px' }],
                ['实际计划偏差(万吨)', 'deviation', { width: '150px' }],
                ['日均处理水量(万吨)','avgDealWater', { width: '150px' }],
                ['计划日均处理水量(万吨)', 'avgPlanDealWater', { width: '180px' }],
                ['偏差原因分析', 'reason', { width: '200px', nowrap: true }]
            ],
            'jcsz':[
                ['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],
                ['本月进水综合达标率(%)', 'inWaterPer', { width: '150px' }],
                ['本月出水综合达标率(%)', 'outWaterPer', { width: '150px' }],
                ['进水水质达标天数(天)','inWaterOverDays', { width: '150px' }],
                ['进水水质超标原因', 'inWaterOverReason', { width: '200px', nowrap: true }],
                ['出水水质超标天数(天)','outWaterOverDays', { width: '150px' }],
                ['出水水质超标原因', 'outWaterOverReason', { width: '200px', nowrap: true}]
            ],
            'dh':[
                ['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],
                ['共耗电(度)', 'powerConsume', { width: '100px' }],
                ['实际电单耗(度/吨水)','powerRealConsume', { width: '150px' }],
                ['计划电单耗(度/吨水)','powerPlanConsume', { width: '150px' }],
                ['计划实际偏差', 'powerBias', { width: '150px' }],
                ['计划实际偏差原因', 'powerBiasReason', { width: '200px', nowrap: true }]
            ],
            'yh': [['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],].concat(title.map(item => ([item.name, item.id, { width: '200px', nowrap: true }]))),
            'wnts':[
                ['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],
                ['本月待机共运行(小时)', 'workTime', { width: '180px' }],
                ['共产生泥饼(吨)', 'produceMudCake', { width: '150px' }],
                ['日均产泥(吨)', 'produceAvg', { width: '150px' }],
                ['本月产泥率(吨干泥/万吨水)', 'producePer', { width: '200px' }],
                ['计划产泥率(吨干泥/万吨水)','planProducePer', { width: '200px' }],
                ['计划实际偏差', 'mudCakeBias', { width: '200px' }],
                ['偏差原因', 'mudCakeBiasAnalysis', { width: '200px', nowrap: true }]
            ],
            'gytz': [['水厂', 'waterFactoryName', { width: '200px' }],
                ['时间', 'dateValue', { width: '100px' }],].concat(title.map(item => ([item.name, item.id, { width: '200px', nowrap: true }]))),
        }
        let vtxDatagridProps = {
            columns: handleColumns(columnsObj[searchParams.dataType]),
            dataSource,
            indexColumn: true,
            startIndex: (currentPage - 1) * pageSize + 1,
            autoFit: true,
            // headFootHeight : 150,
            scroll: { x: true },
            loading,
            onChange(pagination, filters, sorter) {
                dispatch({
                    type: 'productionMonthReport/getList',
                    payload: {
                        currentPage: pagination.current,
                        pageSize: pagination.pageSize
                    }
                })
            },
            pagination: {
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showQuickJumper: true,
                current: currentPage,
                total: total,
                pageSize,
                showTotal: total => `合计 ${total} 条`
            },
        };


        return (
            <div className={styles.normal}>
                <VtxGrid
                    titles={['水厂名称', '日期']}
                    gridweight={[1, 1]}
                    confirm={vtxGridParams.query}
                    clear={vtxGridParams.clear}
                >
                    <Select {...vtxGridParams.waterFactoryIdProps}>
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <VtxMonthPicker {...vtxGridParams.dateProps} />
                </VtxGrid>
                <div className={styles.normal_body}>
                   
                    <div className={styles.tabContainer}>
                        <Tabs style={{ width: this.state.width }} activeKey={searchParams.dataType} onChange={(key) => {
                            updateState({
                                searchParams: {
                                    dataType: key
                                }
                            })
                            getList();
                        }}>

                            <TabPane tab='运行天数说明及停产分析' key='yxts' />
                            <TabPane tab='处理水量分析' key='clsl' />
                            <TabPane tab='进出水水质及达标率分析' key='jcsz' />
                            <TabPane tab='电耗及电单耗分析' key='dh' />
                            <TabPane tab='药耗及药单耗分析' key='yh' />
                            <TabPane tab='污泥脱水系统运行及污泥量分析' key='wnts' />
                            <TabPane tab='工艺调整情况' key='gytz' />
                        </Tabs>
                    </div>
                    <div className={styles.tableContainer}>
                        <VtxDatagrid {...vtxDatagridProps} />
                    </div>
                </div>
            </div>
        )
    }

}

export default connect(
	({productionMonthReport}) => ({productionMonthReport})
)(ProductionMonthReport);