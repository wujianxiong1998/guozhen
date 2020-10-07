/**
 * 异常小类
 * author : vtx xxy
 * createTime : 2019-07-24 16:16:21
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon} from 'antd';

import NewItem from '../../components/abnormalTypeSmall/Add';
import EditItem from '../../components/abnormalTypeSmall/Add';
import ViewItem from '../../components/abnormalTypeSmall/View';
import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function AbnormalTypeSmall({ dispatch, abnormalTypeSmall, accessControlM }) {
    const {
        searchParams,
        abnormalTypeBigSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = abnormalTypeSmall;
    let buttonLimit = {};
    if (accessControlM['abnormalTypeSmall'.toLowerCase()]) {
        buttonLimit = accessControlM['abnormalTypeSmall'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'abnormalTypeSmall/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'abnormalTypeSmall/updateQueryParams' });
        dispatch({ type: 'abnormalTypeSmall/getList' });
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
            dispatch({ type: 'abnormalTypeSmall/initQueryParams' });
            dispatch({ type: 'abnormalTypeSmall/getList' });
        }
    };

    // 列表
    const columns = [
        ['异常大类', 'exceptionTypeName'],
        ['异常小类', 'name'],
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
                                ...rowData,
                                exceptionTypeId:{
                                    key:rowData.exceptionTypeId,
                                    label:rowData.exceptionTypeName
                                },
                                templateValue: JSON.parse(rowData.exceptionTypeJson || '[]'),

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
                                exceptionTypeId: {
                                    key: rowData.exceptionTypeId,
                                    label: rowData.exceptionTypeName
                                },
                                templateValue: JSON.parse(rowData.exceptionTypeJson||'[]')
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
                            type: 'abnormalTypeSmall/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'abnormalTypeSmall/getList',
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
                type: 'abnormalTypeSmall/getList',
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
            dispatch({ type: 'abnormalTypeSmall/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '异常小类 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
        },
        contentProps: {
            ...newItem,
            abnormalTypeBigSelect,
            btnType: 'add',
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            addTemplate: () => {
                let { templateValue } = newItem;
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        newItem: {
                            templateValue: templateValue.map((item) => { return { ...item } }).concat({ key: '', value: '' })
                        }
                    }
                })
            },
            deleteTemplate: (index) => {
                let { templateValue } = newItem;
                let templateValueCopy = templateValue.map((item) => { return { ...item } });
                templateValueCopy.splice(index, 1);
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        newItem: {
                            templateValue: templateValueCopy
                        }
                    }
                })
            },
            changeTemplate: (index, item) => {
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        newItem: {
                            templateValue: {
                                [index]: item
                            }
                        }
                    }
                })
            },
            save() {
                dispatch({
                    type: 'abnormalTypeSmall/saveOrUpdate', payload: {
                        btnType: 'add',
                        onSuccess: function () {
                            message.success('新增成功');
                            updateNewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg||'新增失败');
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
            title: '异常小类 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 600
        },
        contentProps: {
            ...editItem,
            abnormalTypeBigSelect,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            addTemplate: () => {
                let { templateValue } = editItem;
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        editItem: {
                            templateValue: templateValue.map((item) => { return { ...item } }).concat({ key: '', value: '' })
                        }
                    }
                })
            },
            deleteTemplate: (index) => {
                let { templateValue } = editItem;
                let templateValueCopy = templateValue.map((item) => { return { ...item } });
                templateValueCopy.splice(index, 1);
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        editItem: {
                            templateValue: templateValueCopy
                        }
                    }
                })
            },
            changeTemplate: (index, item) => {
                dispatch({
                    type: 'abnormalTypeSmall/updateState',
                    payload: {
                        editItem: {
                            templateValue: {
                                [index]:item
                            }
                        }
                    }
                })
            },
            save() {
                dispatch({
                    type: 'abnormalTypeSmall/saveOrUpdate', payload: {
                        btnType: 'edit',
                        onSuccess: function () {
                            message.success('编辑成功');
                            updateEditWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg||'编辑失败');
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
            title: '异常小类 > 查看',
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
                    type: 'abnormalTypeSmall/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'abnormalTypeSmall/getList',
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
               
                <div className="handle_box">
                {/*按钮*/}
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE'] &&<Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
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
    ({ abnormalTypeSmall, accessControlM }) => ({ abnormalTypeSmall, accessControlM })
)(AbnormalTypeSmall);