/**
 * 名词解释
 * author : vtx xxy
 * createTime : 2019-08-12 17:27:18
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon } from 'antd';

import NewItem from '../../components/nounExplain/Add';
import EditItem from '../../components/nounExplain/Add';
import ViewItem from '../../components/nounExplain/View';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function NounExplain({ dispatch, nounExplain, accessControlM }) {
    const {
        searchParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = nounExplain;
    let buttonLimit = {};
    if (accessControlM['nounExplain'.toLowerCase()]) {
        buttonLimit = accessControlM['nounExplain'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'nounExplain/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'nounExplain/updateQueryParams' });
        dispatch({ type: 'nounExplain/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 名词检索
        keywordProps: {
            value: searchParams.noun,
            onChange(e) {
                updateState({
                    searchParams: {
                        noun: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入名词检索',
            maxLength: '32'
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'nounExplain/initQueryParams' });
            dispatch({ type: 'nounExplain/getList' });
        }
    };

    // 列表
    const columns = [
        ['名词', 'noun'],
        ['名词解释', 'glossary',{nowrap:true}],
        ['操作', 'action', {
            renderButtons: () => {
                let btns = [];
                if (buttonLimit['VIEW']) {
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        updateState({
                            viewItem: {
                                ...rowData
                            }
                        })
                        updateViewWindow();
                    }
                })
                }
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        updateState({
                            editItem: {
                                ...rowData,
                                explain:rowData.glossary,
                            }
                        })
                        updateEditWindow();
                    }
                })}
                if (buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'nounExplain/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'nounExplain/getList',
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
                })}
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
                type: 'nounExplain/getList',
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
            dispatch({ type: 'nounExplain/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '名词解释 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
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
                    type: 'nounExplain/saveOrUpdate', payload: {
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
            title: '名词解释 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 600
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
                    type: 'nounExplain/saveOrUpdate', payload: {
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
            title: '名词解释 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 600
        },
        contentProps: {
            ...viewItem,
            btnType: 'view'
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
                    type: 'nounExplain/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'nounExplain/getList',
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
                titles={['名词检索']}
                gridweight={[2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.keywordProps} />
            </VtxGrid>
            <div className="table-wrapper">
            
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
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
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps} />}
        </div>
    )
}

export default connect(
    ({ nounExplain, accessControlM }) => ({ nounExplain, accessControlM  })
)(NounExplain);