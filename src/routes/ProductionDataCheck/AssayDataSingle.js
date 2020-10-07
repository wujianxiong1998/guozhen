/**
 * 数据查看---化验数据（单厂）
 * author : vtx xxy
 * createTime : 2019-07-31 16:21
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, VtxExport } from 'vtx-ui';
const { VtxMonthPicker, VtxRangePicker } = VtxDate;
const { VtxExport2 } = VtxExport;
import { Modal, Button, message, Select,Icon } from 'antd';
const Option = Select.Option;
import moment from 'moment';
import _ from 'lodash'
import MainLayout from '../../components/productionDataCheck/MainLayout'
import ChartItem from '../../components/productionData/Chart'
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import { VtxUtil } from '../../utils/util';
function AssayDataSingle({ dispatch, assayDataSingle, accessControlM, location }) {

    const {
        searchParams,
        businessUnitList,
        waterFactorySelect, chartItem,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,title
    } = assayDataSingle;
    let buttonLimit = {};
    if (accessControlM['productionTotal'.toLowerCase()]) {
        buttonLimit = accessControlM['productionTotal'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'assayDataSingle/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'assayDataSingle/updateQueryParams' });
        dispatch({ type: 'assayDataSingle/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 事业部
        businessUnitIdProps: {
            value: searchParams.businessUnitId,
            placeholder: "请选择事业部",
            onChange(value) {
                updateState({
                    searchParams: {
                        businessUnitId: value
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            }
        },
        //运营厂
        waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
            showSearch: true,
            optionFilterProp: 'children',
            placeholder: "请选择运营厂",
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
        // 时间快速选择
        quickDateProps: {
            value: searchParams.quickDate,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        quickDate: dateString,
                        startTime: moment(dateString).startOf('month').format('YYYY-MM-DD'),
                        endTime: (moment(dateString).month() == moment().month() && moment(dateString).year() == moment().year()) ? moment().format('YYYY-MM-DD') : moment(dateString).endOf('month').format('YYYY-MM-DD')

                    }
                })
                getList();
            },
            style: {
                width: '100%'
            },
            disabledDate(current) {
                return VtxTimeUtil.isAfterDate(current);
            }
        },

        // 开始时间
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
        query() {
            getList();
        },
        clear() {
            dispatch({ type: 'assayDataSingle/initQueryParams' });
            dispatch({ type: 'assayDataSingle/getList' });
        }
    };

    // 列表
    const columns = title.map(item => {
        {
            const codes = item.code.split(',')
            const lines = item.secondRow.split(',')
            return {
                title: item.firstRow,
                children: [{
                    title: item.firstRow==='日期'?'':<Icon onClick={()=>{
                        dispatch({
                            type:'assayDataSingle/getAssaySingleChart',
                            payload:{
                                unit: item.thirdRow,
                                codes:item.code
                            }
                        })
                        updateChartWindow()
                    }} style={{color:'#108eff',cursor:'pointer'}} type="line-chart" />,
                    children:[{
                        title:item.thirdRow,
                        children: codes.map((codeItem, index) => (
                            {
                                title: lines[index],
                                dataIndex: codeItem,
                                key: codeItem
                            }
                        ))
                    }]
                }]
            }
        }

    })
    let vtxDatagridProps = {
        bordered: true,
        columns,
        dataSource,
        indexColumn: true,
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        rowKey: (record, index) => index,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'assayDataSingle/getList',
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
    // vtxDatagridProps = _.assign(vtxDatagridProps, {
    //     rowSelection: {
    //         type: 'checkbox',
    //         selectedRowKeys,
    //         onChange(selectedRowKeys, selectedRows) {
    //             updateState({
    //                 selectedRowKeys
    //             });
    //         },
    //         // getCheckboxProps: (record) => {
    //         //     const dataStatus = record.dataStatus
    //         //     if (dataStatus === 'xj' || (isAdministrator && (dataStatus === 'dsh' || dataStatus === 'dxg' || dataStatus === 'tg'))) {
    //         //         return {
    //         //             disabled: false
    //         //         }
    //         //     } else {
    //         //         return {
    //         //             disabled: true
    //         //         }
    //         //     }
    //         // }
    //     }
    // })
    const exportProps = {
        downloadURL: '/cloud/gzzhsw/api/cp/data/view/exportDataExcel',
        rowButton: false,
        getExportParams(exportType) {
            const param = {
                dataType: 'assay',
                mfOrSf: 'sf',
                businessUnitId: searchParams.businessUnitId||'',
                waterFactoryId: searchParams.waterFactoryId||'',
                startTime: searchParams.startTime,
                endTime: searchParams.endTime,
                tenantId: VtxUtil.getUrlParam('tenantId'),
            };
            switch (exportType) {
                case 'page':
                    if (dataSource.length === 0) {
                        message.info('当前页没有数据');
                        return;
                    }
                    param.page = currentPage - 1
                    param.size = pageSize
                    param.isAll = false;
                case 'all':
                    if (total === 0) {
                        message.info('暂无数据可进行导出');
                        return;
                    }
                    param.isAll = true;
            }
            return param
        }
    }
    //--------------折线图弹窗---------------
    const updateChartWindow = (status = true) => {
        updateState({
            chartItem: {
                visible: status
            }
        })
    }
    const chartItemProps = {
        updateWindow: updateChartWindow,
        modalProps: {
            title: '化验数据查看',
            visible: chartItem.visible,
            onCancel: () => updateChartWindow(false),
            width: 700
        },
        contentProps: {
            ...chartItem,
        }
    }
    return (
        <MainLayout location={location}>
            <div className={styles.normal}>
                <VtxGrid
                    titles={['时间快速选择', '起止时间', '运营厂', '事业部',]}
                    gridweight={[1, 2, 1, 1]}

                    confirm={vtxGridParams.query}
                    clear={vtxGridParams.clear}
                >
                    <VtxMonthPicker {...vtxGridParams.quickDateProps} />
                    <VtxRangePicker {...vtxGridParams.startTimeProps} />
                    <Select {...vtxGridParams.waterFactoryIdProps}>
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Select {...vtxGridParams.businessUnitIdProps}>
                        {businessUnitList.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>


                </VtxGrid>
                <div className={styles.normal_body}>
                    
                    <div className={styles.buttonContainer}>
                        <VtxExport2  {...exportProps}>
                            <Button icon="export">导出</Button>
                        </VtxExport2>
                    </div>
                    <div className={styles.tableContainer}>
                        <VtxDatagrid {...vtxDatagridProps} />
                    </div>
                </div>

                <ChartItem {...chartItemProps} />
            </div>
        </MainLayout>
    )
}

export default connect(
    ({ assayDataSingle, accessControlM }) => ({ assayDataSingle, accessControlM })
)(AssayDataSingle);