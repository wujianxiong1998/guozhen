/**
 * 指标库
 * author : vtx xxy
 * createTime : 2019-05-28 11:33:27
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Select,Icon } from 'antd';
const Option = Select.Option;
import NewItem from '../../components/targetLibrary/Add';
import EditItem from '../../components/targetLibrary/Add';
import ViewItem from '../../components/targetLibrary/View';
import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function TargetLibrary({ dispatch, targetLibrary, accessControlM }) {
    const {
        searchParams,
        businessSelect, typeSelect, smallTypeSelect,categorySelect, unitSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = targetLibrary;
    let buttonLimit = {};
    if (accessControlM['targetLibrary'.toLowerCase()]) {
        buttonLimit = accessControlM['targetLibrary'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'targetLibrary/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'targetLibrary/updateQueryParams' });
        dispatch({ type: 'targetLibrary/getList' });
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

        // 编码
        codeProps: {
            value: searchParams.code,
            onChange(e) {
                updateState({
                    searchParams: {
                        code: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入编码',
            maxLength: '32'
        },
        // 指标大类
        typeIdProps: {
            value: searchParams.typeId,
            placeholder: "请选择指标大类",
            onChange(value) {
                updateState({
                    searchParams: {
                        typeId: value
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
        // 指标小类
        smallTypeIdProps: {
            value: searchParams.smallTypeId,
            placeholder: "请选择指标小类",
            onChange(value) {
                updateState({
                    searchParams: {
                        smallTypeId: value
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
        // 业务范围
        businessIdProps: {
            value: searchParams.businessId,
            placeholder: "请选择业务范围",
            onChange(value) {
                updateState({
                    searchParams: {
                        businessId: value
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
            dispatch({ type: 'targetLibrary/initQueryParams' });
            dispatch({ type: 'targetLibrary/getList' });
        }
    };

    // 列表
    const columns = [
        ['名称', 'name'],
        ['指标编码', 'code'],
        ['计算指标', 'categoryValue'],
        ['指标大类', 'typeName'],
        ['指标小类', 'smallTypeName'],
        ['业务范围', 'businessName'],
        ['合理范围', 'rationalRange'],
        ['单位', 'unitName'],
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
                            type: 'targetLibrary/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'targetLibrary/getList',
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
                type: 'targetLibrary/getList',
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
            dispatch({ type: 'targetLibrary/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '指标库 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 500
        },
        contentProps: {
            ...newItem,
            businessSelect, typeSelect, categorySelect, unitSelect, smallTypeSelect,
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
                    type: 'targetLibrary/saveOrUpdate', payload: {
                        btnType: 'add',
                        onSuccess: function () {
                            message.success('新增成功');
                            updateNewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
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
            title: '指标库 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 500
        },
        contentProps: {
            ...editItem,
            businessSelect, typeSelect, categorySelect, unitSelect, smallTypeSelect,
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
                    type: 'targetLibrary/saveOrUpdate', payload: {
                        btnType: 'edit',
                        onSuccess: function () {
                            message.success('编辑成功');
                            updateEditWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
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
            title: '指标库 > 查看',
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
                    type: 'targetLibrary/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'targetLibrary/getList',
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
                titles={['名称', '编码', '指标大类', '指标小类', '业务范围']}
                gridweight={[1, 1, 1, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.nameProps} />
                <Input {...vtxGridParams.codeProps} />
                <Select {...vtxGridParams.typeIdProps}>
                    {typeSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.smallTypeIdProps}>
                    {smallTypeSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.businessIdProps}>
                    {businessSelect.map(item => {
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
    ({ targetLibrary, accessControlM }) => ({ targetLibrary, accessControlM })
)(TargetLibrary);