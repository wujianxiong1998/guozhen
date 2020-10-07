/**
 * 指标模版
 * author : vtx 
 * createTime : 2019-05-28 16:52:56
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Select ,Icon} from 'antd';

import NewItem from '../../components/targetTemplate/Add';
import EditItem from '../../components/targetTemplate/Add';
import ViewItem from '../../components/targetTemplate/View';

import styles from './index.less'
import { handleColumns } from '../../utils/tools';

const Option = Select.Option;
function TargetTemplate({ dispatch, targetTemplate, accessControlM }) {
    const {
        searchParams,
        businessSelect, processTypeSelect, smallTypeSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem
    } = targetTemplate;
    let buttonLimit = {};
    if (accessControlM['targetTemplate'.toLowerCase()]) {
        buttonLimit = accessControlM['targetTemplate'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'targetTemplate/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'targetTemplate/updateQueryParams' });
        dispatch({ type: 'targetTemplate/getList' });
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
        //业务范围
        businessIdProps:{
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
            dispatch({ type: 'targetTemplate/initQueryParams' });
            dispatch({ type: 'targetTemplate/getList' });
        }
    };

    // 列表
    const columns = [
        ['模版名称', 'name'],
        ['业务范围', 'businessName'],
        ['工艺类别', 'processTypeName'],
        ['包含指标', 'libraryNames', { nowrap:true}],
        ['操作', 'action', {
            renderButtons: () => {
                let btns = [];
                // btns.push({
                //     name: '查看',
                //     onClick(rowData) {
                //         updateState({
                //             viewItem: {
                //                 ...rowData
                //             }
                //         })
                //         updateViewWindow();
                //     }
                // })
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        const { libraryIds, libraryNames} = rowData;
                        const libraryIdArr = libraryIds ? libraryIds.split(','):[];
                        const libraryNameArr = libraryNames ? libraryNames.split(',') : [];
                        let checkedTargets = [];
                        const selectedTargets = libraryIdArr.map((item,index)=>{
                            checkedTargets.push(item)
                            return {
                                id:item,
                                name:libraryNameArr[index]
                            }
                        })
                        updateState({
                            editItem: {
                                ...rowData,
                                selectedTargets,//已选指标
                                searchName: '',//搜索条件 指标名称
                                targetList: [],//搜索结果 指标列表
                                targetListLoading: false,
                                checkedTargets,//选中的指标
                            }
                        })
                        dispatch({
                            type: 'targetTemplate/getTargetLibrarySelect',
                            payload: {
                                searchValue: '',
                                itemName: 'editItem'
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
                            type: 'targetTemplate/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'targetTemplate/getList',
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
                type: 'targetTemplate/getList',
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
            dispatch({ type: 'targetTemplate/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '指标模版 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 700
        },
        contentProps: {
            ...newItem,
            businessSelect, processTypeSelect, smallTypeSelect,
            btnType: 'add',
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            handleSearch(value, smallTypeId) {
                dispatch({
                    type:'targetTemplate/getTargetLibrarySelect',
                    payload:{
                        searchValue: value,
                        itemName:'newItem',
                        smallTypeId: smallTypeId||''
                    }
                })
            },
            clearTargets() {
                updateState({
                    newItem: {
                        selectedTargets: [],
                        targetList:[],
                        checkedTargets:[]
                    }
                })
            },
            save() {
                dispatch({
                    type: 'targetTemplate/saveOrUpdate', payload: {
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
            title: '指标模版 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 700
        },
        contentProps: {
            ...editItem,
            businessSelect, processTypeSelect, smallTypeSelect,
            btnType: 'edit',
            handleSearch(value, smallTypeId) {
                dispatch({
                    type: 'targetTemplate/getTargetLibrarySelect',
                    payload: {
                        searchValue: value,
                        itemName: 'editItem',
                        smallTypeId: smallTypeId||''
                    }
                })
            },
            clearTargets(){
                updateState({
                    editItem: {
                        selectedTargets:[],
                        targetList: [],
                        checkedTargets: [],

                    }
                })
            },
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save() {
                dispatch({
                    type: 'targetTemplate/saveOrUpdate', payload: {
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
            title: '指标模版 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 700
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
                    type: 'targetTemplate/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'targetTemplate/getList',
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
                titles={['名称', '业务范围']}
                gridweight={[1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.nameProps} />
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
    ({ targetTemplate, accessControlM }) => ({ targetTemplate, accessControlM })
)(TargetTemplate);