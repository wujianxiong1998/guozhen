/**
 * 异常记录
 * author : vtx xxy
 * createTime : 2019-07-31 11：12
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Modal, Button, message, Select,Icon } from 'antd';
const Option = Select.Option;
import ViewItem from '../../components/abnormalRecord/View';
import styles from './index.less'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

function AbnormalRecord({ dispatch, abnormalRecord, accessControlM  }) {
    const {
        searchParams, auditStatusSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        viewItem
    } = abnormalRecord;
    let buttonLimit = {};
    if (accessControlM['abnormalRecord'.toLowerCase()]) {
        buttonLimit = accessControlM['abnormalRecord'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'abnormalRecord/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'abnormalRecord/updateQueryParams' });
        dispatch({ type: 'abnormalRecord/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 任务状态
       auditStatusProps: {
            value: searchParams.auditStatus,
            placeholder: "请选择任务状态",
            onChange(value) {
                updateState({
                    searchParams: {
                        auditStatus: value || ''
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
        // 起止时间
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
            // showTime: true,
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
            dispatch({ type: 'abnormalRecord/initQueryParams' });
            dispatch({ type: 'abnormalRecord/getList' });
        }
    };

    // 列表
    const columns = [
        ['异常大类', 'exceptionTypeName'],
        ['异常小类', 'exceptionSmallTypeName'],
        ['上报时间', 'reportDate'],
        ['异常描述', 'exceptionDescription', { nowrap: true }],
        ['上报人', 'reportPersonName'],
        ['任务名称', 'taskName'],
        ['执行人', 'executeManName'],
        ['处理日期', 'taskDealDate'],
        ['处理内容', 'content'],
        ['状态', 'auditStatusStr'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                if (buttonLimit['VIEW']) {
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        updateState({
                            viewItem: {
                                ...rowData,
                                attachment: JSON.parse(rowData.annex || '[]'),
                            }
                        })
                        updateViewWindow();
                    }
                })
            }
                if (buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'abnormalRecord/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'abnormalRecord/getList',
                                        payload: {
                                            selectedRowKeys: [],
                                            currentPage: page
                                        }
                                    })
                                    message.success('删除成功');
                                },
                                onError: function (msg) {
                                    message.error(msg);
                                }
                            }
                        });
                    }
                })
            }
                return btns;
            }, width: '150px'
        }]
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
                type: 'abnormalRecord/getList',
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
    vtxDatagridProps = _.assign(vtxDatagridProps, {
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                updateState({
                    selectedRowKeys
                });
            }
        }
    })



    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        updateState({
            viewItem: {
                visible: status
            }
        })
    }
    const viewItemProps = {
        updateWindow: updateViewWindow,
        modalProps: {
            title: '异常记录 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 600
        },
        contentProps: {
            ...viewItem,
            btnType: 'view',
        }
    };

    //--------------删除------------------
    const deleteItems = () => {
        Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'abnormalRecord/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'abnormalRecord/getList',
                                payload: {
                                    selectedRowKeys: [],
                                    currentPage: page
                                }
                            })
                            message.success('删除成功');
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                });
            }
        });
    }

    return (
        <div className="main_page">
            <VtxGrid
                titles={['任务状态', '起止时间']}
                gridweight={[1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.auditStatusProps}>
                    {auditStatusSelect.map(item => {
                        return <Option key={item.value}>{item.text}</Option>
                    })}
                </Select>
                <VtxRangePicker {...vtxGridParams.startDateProps} />
            </VtxGrid>
            <div className="table-wrapper">
                
                <div className="handle_box">
                    {buttonLimit['DELETE'] &&  <Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*审核*/}
            {viewItem.visible && <ViewItem {...viewItemProps} />}
        </div>
    )
}

export default connect(
    ({ abnormalRecord, accessControlM }) => ({ abnormalRecord, accessControlM  })
)(AbnormalRecord);