/**
 * 指标类别
 * author : xxy 
 * createTime : 2019-05-27 14:37:50
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon } from 'antd';

import NewItem from '../../components/craftClasses/Add';
import EditItem from '../../components/craftClasses/Add';
import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function IndicatorClasses({ dispatch, indicatorClasses, accessControlM }) {
    const {
        searchParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = indicatorClasses;
    let buttonLimit = {};
    if (accessControlM['dataDictionary'.toLowerCase()]) {
        buttonLimit = accessControlM['dataDictionary'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'indicatorClasses/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'indicatorClasses/updateQueryParams' });
        dispatch({ type: 'indicatorClasses/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 名称
        nameProps: {
            value: searchParams.name,
            onChange(e) {
                updateState({
                    searchParams: {
                        name: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入名称',
            maxLength: '32'
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'indicatorClasses/initQueryParams' });
            dispatch({ type: 'indicatorClasses/getList' });
        }
    };

    // 列表
    const columns = [
        ['名称', 'name'],
        ['编码', 'code'],
        ['操作', 'action', {
            renderButtons: () => {
                let btns = [];
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        updateState({
                            editItem: {
                                ...rowData
                            }
                        })
                        updateEditWindow();
                    }
                })
            }
                if (buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'indicatorClasses/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'indicatorClasses/getList',
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
                type: 'indicatorClasses/getList',
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

    //----------------新增------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'indicatorClasses/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '指标类型 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 500
        },
        contentProps: {
            ...newItem,
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
                    type: 'indicatorClasses/saveOrUpdate', payload: {
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
            title: '指标类型 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 500
        },
        contentProps: {
            ...editItem,
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
                    type: 'indicatorClasses/saveOrUpdate', payload: {
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


    //--------------删除------------------
    const deleteItems = () => {
        Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'indicatorClasses/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'indicatorClasses/getList',
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
                titles={['名称']}
                gridweight={[1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.nameProps} />
            </VtxGrid>
            <div className="table-wrapper">
               
                {/*按钮*/}
                <div className="handle_box">
                    {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE'] &&<Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增*/}
            {newItem.visible && <NewItem {...newItemProps} />}
            {/*编辑*/}
            {editItem.visible && <EditItem {...editItemProps} />}
        </div>
    )
}

export default connect(
    ({ indicatorClasses, accessControlM }) => ({ indicatorClasses, accessControlM })
)(IndicatorClasses);