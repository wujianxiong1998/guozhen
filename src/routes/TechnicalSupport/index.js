/**
 * 技术支持
 * author : vtx xxy
 * createTime : 2019-08-16 14:19:33
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon } from 'antd';

import NewItem from '../../components/technicalSupport/Add';
import EditItem from '../../components/technicalSupport/Add';
import ViewItem from '../../components/technicalSupport/View';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function technicalSupport({ dispatch, technicalSupport, accessControlM }) {
    const {
        searchParams,
        businessSelect, knowledgeTypeSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, userList,
        newItem, editItem, viewItem,uploaderInfo
    } = technicalSupport;
    let buttonLimit = {};
    if (accessControlM['technicalSupport'.toLowerCase()]) {
        buttonLimit = accessControlM['technicalSupport'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'technicalSupport/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'technicalSupport/updateQueryParams' });
        dispatch({ type: 'technicalSupport/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 标题
        titleProps: {
            value: searchParams.title,
            onChange(e) {
                updateState({
                    searchParams: {
                        title: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入标题',
            maxLength: '32'
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'technicalSupport/initQueryParams' });
            dispatch({ type: 'technicalSupport/getList' });
        }
    };

    // 列表
    const columns = [
        ['标题', 'title'],
        ['知识类型', 'knowledgeTypeName'],
        ['状态', 'technicalStatusStr'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                if (record.technicalStatus !== 'bc' && buttonLimit['VIEW']){
                    btns.push({
                        name: <Icon type='view'
                            title='查看' />,
                        onClick(rowData) {
                            dispatch({
                                type: 'technicalSupport/getDetail',
                                payload: {
                                    id: rowData.id,
                                    itemName: 'viewItem'
                                }
                            })
                            updateState({
                                viewItem: {
                                    ...rowData,
                                    annx: JSON.parse(rowData.annx||'[]'),
                                    inviteIds: rowData.inviteIds ? rowData.inviteIds.split(',') : [],
                                    newAnswer:''
                                }
                            })
                            updateViewWindow();
                        }
                    })
                }
                
                if (record.technicalStatus==='bc'&&buttonLimit['EDIT']){
                    btns.push({
                        name: <Icon type='file-edit'
                            title='编辑' />,
                        onClick(rowData) {
                            
                            dispatch({
                                type: 'technicalSupport/getDetail',
                                payload: {
                                    id:rowData.id,
                                    itemName:'editItem'
                                }
                            })
                            updateState({
                                editItem: {
                                    ...rowData,
                                    annx: JSON.parse(rowData.annx || "[]"),
                                    inviteIds: rowData.inviteIds ? rowData.inviteIds.split(',') : []
                                },
                            })
                            updateEditWindow();
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
                type: 'technicalSupport/getList',
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

    //----------------新增------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'technicalSupport/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '申请技术支持',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            uploaderInfo,
            userList,
            businessSelect, knowledgeTypeSelect,
            btnType: 'add',
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            save(technicalStatus) {
                dispatch({
                    type: 'technicalSupport/saveOrUpdate', payload: {
                        technicalStatus,
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
            title: '技术支持 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps: {
            ...editItem,
            businessSelect, knowledgeTypeSelect,
            uploaderInfo,
            userList,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save(technicalStatus) {
                dispatch({
                    type: 'technicalSupport/saveOrUpdate', payload: {
                        technicalStatus,
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
            title: '技术支持 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            uploaderInfo,
            btnType: 'view',
            updateItem(obj) {
                updateState({
                    viewItem: {
                        ...obj
                    }
                })
            },
            save(){
                dispatch({
                    type: 'technicalSupport/addAnswer', payload: {
                        btnType: 'view',
                        onSuccess: function () {
                            message.success('提交成功');
                            updateViewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                })
            },
            acceptAnswer(id,commentId) {
                dispatch({
                    type: 'technicalSupport/acceptAnswer', payload: {
                        id, commentId,
                        onSuccess: function () {
                            message.success('采纳成功');
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

    return (
        <div className="main_page">
            <VtxGrid
                titles={['标题']}
                gridweight={[2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.titleProps} />
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => updateNewWindow()}>申请支持</Button>}
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
    ({ technicalSupport, accessControlM }) => ({ technicalSupport, accessControlM })
)(technicalSupport);