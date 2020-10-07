/**
 * 月报审核及时率
 * author : vtx xxy
 * createTime : 2019-08-08
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid,VtxDate } from 'vtx-ui';
const {VtxRangePicker,VtxMonthPicker} = VtxDate
import { Modal, Button, message, Select,Checkbox,Switch } from 'antd';
const Option = Select.Option;
import moment from 'moment'
import styles from './index.less';
import { handleColumns,VtxTimeUtil } from '../../utils/tools';

function MonthAuditIntime({ dispatch, monthAuditIntime }) {
    const {
        searchParams,
        waterFactorySelect,
        currentPage, pageSize, loading, dataSource, total,
    } = monthAuditIntime;

    const updateState = (obj) => {
        dispatch({
            type: 'monthAuditIntime/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'monthAuditIntime/updateQueryParams' });
        dispatch({ type: 'monthAuditIntime/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 水厂名称
        waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
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
        startTimeProps: {
            value: searchParams.startTime,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        startTime: dateString,
                    }
                })
                getList()

            },
            disabledDate(current) {
                return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(searchParams.endTime)));
            }
        },
        endTimeProps: {
            value: searchParams.endTime,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        endTime: dateString
                    }
                })
                getList()

            },
            style: {
                width: '50%'
            },
            disabledDate(current) {
                return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(searchParams.startTime)));
            }
        },


        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'monthAuditIntime/initQueryParams' });
            dispatch({ type: 'monthAuditIntime/getList' });
        }
    };

    // 列表
    const columns = [
        ['水厂名称', 'waterFactoryName'],
        ['审核及时情况', 'auditInTimePer'],
        ['审核人', 'auditMan'],
        ['审核日期', 'auditDate']
    ];
    let vtxDatagridProps = {
        columns: handleColumns(columns),
        dataSource,
        indexColumn: true,
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'monthAuditIntime/getList',
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
                titles={['水厂名称', '开始时间','结束时间']}
                gridweight={[1, 1,2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxMonthPicker {...vtxGridParams.startTimeProps} />
                <span>
                    <VtxMonthPicker {...vtxGridParams.endTimeProps} />
                    <Checkbox checked={searchParams.overTimeFlag} onChange={e => { updateState({ searchParams: { overTimeFlag: e.target.checked } }); getList() }} style={{ marginLeft: '20px' }}>只显示延误</Checkbox>
                </span>
            </VtxGrid>
            <div className={styles.normal_body}>
                
                <div className={styles.tableContainer}>
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
        </div>
    )
}

export default connect(
    ({ monthAuditIntime }) => ({ monthAuditIntime })
)(MonthAuditIntime);