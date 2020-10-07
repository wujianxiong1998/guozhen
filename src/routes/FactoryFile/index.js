/**
 * 一厂一档
 * author : wjx 
 * createTime : 2020-09-29 09:46:43
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input, Select,Icon } from 'antd';
const Option = Select.Option;

import NewItem from '../../components/factoryFile/Add';
import EditItem from '../../components/factoryFile/Add';
import ViewItem from '../../components/factoryFile/View';
import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function FactoryFile({ dispatch, factoryFile, accessControlM }) {
    const {
        searchParams,
        businessUnitSelect, regionalCompanySelect, businessSelect,waterFactoryNameSelect, processTypeSelect, productTypeSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,waterFactoryId,
        newItem, editItem, viewItem, fileListVersion
    } = factoryFile;
    let buttonLimit = {};
    if (accessControlM['waterFactory'.toLowerCase()]) {
        buttonLimit = accessControlM['waterFactory'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'factoryFile/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'factoryFile/updateQueryParams' });
        dispatch({ type: 'factoryFile/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 名称
        nameProps: {
            value: searchParams.waterFactoryName,
            onChange(e) {
                updateState({
                    searchParams: {
                        waterFactoryName: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入名称',
            maxLength: '32'
        },

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
            allowClear: true,
            style: {
                width: '100%'
            }
        },

        // 区域公司
        regionalCompanyIdProps: {
            value: searchParams.regionalCompanyId,
            placeholder: "请选择区域公司",
            onChange(value) {
                updateState({
                    searchParams: {
                        regionalCompanyId: value
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
            dispatch({ type: 'factoryFile/initQueryParams' });
            dispatch({ type: 'factoryFile/getList' });
        }
    };

    // 列表
    const columns = [
        ['水厂名称', 'waterFactoryName'],
        ['区域公司', 'regionalCompanyName'],
        ['事业部', 'businessUnitName'],
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
                            type: 'factoryFile/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'factoryFile/getList',
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
                type: 'factoryFile/getList',
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
            dispatch({ type: 'factoryFile/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        fileListVersion,
        modalProps: {
            title: '一厂一档 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 500
        },
        contentProps: {
            ...newItem,
            businessUnitIdSelect: businessUnitSelect,
            regionalCompanyIdSelect: regionalCompanySelect,
            waterFactoryNameSelect: waterFactoryNameSelect,
            waterFactoryId: waterFactoryId,
            btnType: 'add',
            picIds: 0, // mock数据
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            save() {
                dispatch({
                    type: 'factoryFile/saveOrUpdate', payload: {
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
            title: '一厂一档 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 500
        },
        contentProps: {
            ...editItem,
            businessUnitIdSelect: businessUnitSelect,
            regionalCompanyIdSelect: regionalCompanySelect,
            waterFactoryNameSelect: waterFactoryNameSelect,
            waterFactoryId: waterFactoryId,
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
                    type: 'factoryFile/saveOrUpdate', payload: {
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
            title: '一厂一档 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 500
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
                    type: 'factoryFile/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'factoryFile/getList',
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
                titles={['名称', '事业部', '区域公司']}
                gridweight={[1, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.nameProps} />
                <Select {...vtxGridParams.businessUnitIdProps}>
                    {businessUnitSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.regionalCompanyIdProps}>
                    {regionalCompanySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
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
    ({ factoryFile, common, accessControlM }) => ({ factoryFile, common, accessControlM })
)(FactoryFile);