/**
 * 问题库
 * author : vtx xxy
 * createTime : 2019-08-12 16:51:03
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon } from 'antd';

import NewItem from '../../components/questionLibrary/Add';
import EditItem from '../../components/questionLibrary/Add';
import ViewItem from '../../components/questionLibrary/View';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function QuestionLibrary({ dispatch, questionLibrary, accessControlM  }) {
    const {
        searchParams,
        businessSelect, typeSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = questionLibrary;
    let buttonLimit = {};
    if (accessControlM['questionLibrary'.toLowerCase()]) {
        buttonLimit = accessControlM['questionLibrary'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'questionLibrary/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'questionLibrary/updateQueryParams' });
        dispatch({ type: 'questionLibrary/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 问题检索
        keywordProps: {
            value: searchParams.problemTitle,
            onChange(e) {
                updateState({
                    searchParams: {
                        problemTitle: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入关键字',
            maxLength: '32'
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'questionLibrary/initQueryParams' });
            dispatch({ type: 'questionLibrary/getList' });
        }
    };

    // 列表
    const columns = [
        ['标题', 'title'],
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
                            type: 'questionLibrary/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'questionLibrary/getList',
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
                type: 'questionLibrary/getList',
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
            dispatch({ type: 'questionLibrary/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '问题库 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
        },
        contentProps: {
            ...newItem,
            businessSelect, typeSelect,
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
                    type: 'questionLibrary/saveOrUpdate', payload: {
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
            title: '问题库 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 600
        },
        contentProps: {
            ...editItem,
            businessSelect, typeSelect,
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
                    type: 'questionLibrary/saveOrUpdate', payload: {
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
            title: '问题库 > 查看',
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
                    type: 'questionLibrary/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'questionLibrary/getList',
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
                titles={['问题检索']}
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
    ({ questionLibrary, accessControlM }) => ({ questionLibrary, accessControlM  })
)(QuestionLibrary);