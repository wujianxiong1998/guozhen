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
import { Modal, Button, message, Select } from 'antd';
const Option = Select.Option;
import moment from 'moment';
import _ from 'lodash'
import MainLayout from '../../components/productionDataCheck/MainLayout'
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import { VtxUtil } from '../../utils/util';
function ProductionConsumeSingle({ dispatch, productionConsumeSingle, accessControlM, location }) {

    const {
        searchParams,
        businessUnitList,
        waterFactorySelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,title
    } = productionConsumeSingle;
    let buttonLimit = {};
    if (accessControlM['productionTotal'.toLowerCase()]) {
        buttonLimit = accessControlM['productionTotal'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'productionConsumeSingle/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'productionConsumeSingle/updateQueryParams' });
        dispatch({ type: 'productionConsumeSingle/getList' });
    }

    // 查询
    const vtxGridParams = {
        //水厂
        waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
            showSearch: true,
            optionFilterProp: 'children',
            placeholder: "请选择水厂",
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
            dispatch({ type: 'productionConsumeSingle/initQueryParams' });
            dispatch({ type: 'productionConsumeSingle/getList' });
        }
    };

    // 列表
    const columns = title.map(item => ({
        title: item.firstRow,
        dataIndex: item.code,
        key: item.code
    }))
    let vtxDatagridProps = {
        bordered: true,
        columns,
        dataSource,
        indexColumn: true,
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'productionConsumeSingle/getList',
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
        downloadURL: '/cloud/gzzhsw/api/cp/data/view/singleExportDataExcel',
        rowButton: false,
        getExportParams(exportType) {
            const param = {
                dataType:'consum',

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
                    break;
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
    return (
        <MainLayout location={location}>
            <div className={styles.normal}>
                <VtxGrid
                    titles={['时间快速选择', '起止时间', '水厂']}
                    gridweight={[1, 2, 1]}
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
            </div>
        </MainLayout>
    )
}

export default connect(
    ({ productionConsumeSingle, accessControlM }) => ({ productionConsumeSingle, accessControlM })
)(ProductionConsumeSingle);