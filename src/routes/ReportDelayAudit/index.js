/**
 * 数据上报延迟审批
 * author : vtx xxy
 * createTime : 2019-08-07 15:27:57
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Select,Icon} from 'antd';
const Option = Select.Option;

import NewItem from '../../components/reportDelayAudit/Add';
import EditItem from '../../components/reportDelayAudit/Add';
import ViewItem from '../../components/reportDelayAudit/View';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function ReportDelayAudit({ dispatch, reportDelayAudit, accessControlM }) {
    const {
        searchParams,
        waterFactorySelect, applyStatusSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = reportDelayAudit;
    let buttonLimit = {};
    if (accessControlM['reportDelayAudit'.toLowerCase()]) {
        buttonLimit = accessControlM['reportDelayAudit'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'reportDelayAudit/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'reportDelayAudit/updateQueryParams' });
        dispatch({ type: 'reportDelayAudit/getList' });
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

        // 申请状态
        applyStatusProps: {
            value: searchParams.applyStatus,
            placeholder: "请选择申请状态",
            onChange(value) {
                updateState({
                    searchParams: {
                        applyStatus: value
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'reportDelayAudit/initQueryParams' });
            dispatch({ type: 'reportDelayAudit/getList' });
        }
    };

    // 列表
    const columns = [
        ['水厂名称', 'waterFactoryName'],
        ['报表日期', 'dateValue'],
        ['申请状态', 'applyStatusStr'],
        ['延迟原因', 'delayReason'],
        ['附件信息', 'annx',{render:text=>{
            let nameArr = []
            const attachment = JSON.parse(text||'[]')
            attachment.map(item=>{
                nameArr.push(
                    // <div>{item.name}</div>
                    item.name
                )
            })

            return nameArr.join('、')
        }}],
        ['审核意见', 'auditMemo'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                if (record.applyStatusStr === '待审核' && buttonLimit['AUDIT'] ){
                btns.push({
                    name: <Icon type='examine' title='审核'/>,
                    onClick(rowData) {
                        updateState({
                            viewItem: {
                                ...rowData,
                                date: rowData.dateValue,
                                attachment:JSON.parse(rowData.annx||'[]'),
                                auditMemo:''
                            }
                        })
                        updateViewWindow();
                    }
                })
            }
                if (buttonLimit['DELETE'] && record.applyStatusStr!=='待审核') {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'reportDelayAudit/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'reportDelayAudit/getList',
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
            }, width: '120px'
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
                type: 'reportDelayAudit/getList',
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
            },
            getCheckboxProps: (record) => {
                if (record.applyStatusStr === '待审核') {
                    return {
                        disabled: true
                    }
                } else {
                    return {
                        disabled: false
                    }
                }
            }
        }
    })

    //----------------申请------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'reportDelayAudit/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '数据上报延迟审批 > 申请',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
        },
        contentProps: {
            ...newItem,
            waterFactorySelect,
            btnType: 'add',
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            save() {
                dispatch({
                    type: 'reportDelayAudit/saveOrUpdate', payload: {
                        btnType: 'add',
                        onSuccess: function () {
                            message.success('新增成功');
                            updateNewWindow(false);
                        },
                        onError: function () {
                            message.error('新增失败');
                        }
                    }
                })
            }
        }
    };

    //--------------编辑-----------------
    const updateEditWindow = (status = true) => {
        updateState({
            editItem: {
                visible: status
            }
        })
    }
    const editItemProps = {
        updateWindow: updateEditWindow,
        modalProps: {
            title: '数据上报延迟审批 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 600
        },
        contentProps: {
            ...editItem,
            waterFactorySelect,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save() {
                dispatch({
                    type: 'reportDelayAudit/saveOrUpdate', payload: {
                        btnType: 'edit',
                        onSuccess: function () {
                            message.success('编辑成功');
                            updateEditWindow(false);
                        },
                        onError: function () {
                            message.error('编辑失败');
                        }
                    }
                })
            }
        }
    };

    //--------------审核-----------------
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
            title: '数据上报延迟审批 > 审核',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 600
        },
        contentProps: {
            ...viewItem,
            btnType: 'view',
            updateItem(obj) {
                updateState({
                    viewItem: {
                        ...obj,
                    }
                })
            },
            handleAudit(applyStatus) {
                dispatch({
                    type: 'reportDelayAudit/handleAudit', payload: {
                        applyStatus,
                        onSuccess: function () {
                            message.success('提交审核成功');
                            updateViewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                })
            }
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
                    type: 'reportDelayAudit/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'reportDelayAudit/getList',
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
                titles={['水厂名称', '申请状态']}
                gridweight={[1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.applyStatusProps}>
                    {applyStatusSelect.map(item => {
                        return <Option key={item.value}>{item.text}</Option>
                    })}
                </Select>
            </VtxGrid>
            <div className="table-wrapper">
                
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>申请延迟</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content" >
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增*/}
            {newItem.visible && <NewItem {...newItemProps} />}
            {/*编辑*/}
            {editItem.visible && <EditItem {...editItemProps} />}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps} />}
        </div>
    )
}

export default connect(
    ({ reportDelayAudit, accessControlM }) => ({ reportDelayAudit, accessControlM })
)(ReportDelayAudit);