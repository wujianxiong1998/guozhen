/**
 * 诊断配置
 * author : vtx xxy
 * createTime : 2019-08-15 17:20:28
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input,Icon} from 'antd';

import NewItem from '../../components/diagnoseConfig/Add';
import EditItem from '../../components/diagnoseConfig/Add';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function DiagnoseConfig({ dispatch, diagnoseConfig, accessControlM }) {
    const {
        searchParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem,
    } = diagnoseConfig;
     let buttonLimit = {};
    if (accessControlM['diagnoseConfig'.toLowerCase()]) {
        buttonLimit = accessControlM['diagnoseConfig'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'diagnoseConfig/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'diagnoseConfig/updateQueryParams' });
        dispatch({ type: 'diagnoseConfig/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 诊断检索
        keywordProps: {
            value: searchParams.rule,
            onChange(e) {
                updateState({
                    searchParams: {
                        rule: e.target.value
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
            dispatch({ type: 'diagnoseConfig/initQueryParams' });
            dispatch({ type: 'diagnoseConfig/getList' });
        }
    };

    // 列表
    const columns = [
        // ['序号', 'index', { render: (text, record, index) => record.wheatherRoot==='true'?((currentPage - 1) * pageSize + index+1):'',width:80}],
        ['规则', 'rule', { className: styles.singleLine, render: (text, record, index) => record.wheatherRoot === 'true' ? <span>{(currentPage - 1) * pageSize + index + 1}<span style={{marginLeft:'20px'}}>{text}</span></span> : text}],
        ['操作', 'action', {
            renderButtons: () => {
                let btns = [];
                if (buttonLimit['ADD']) {
                btns.push({
                    name: <Icon type='file-add'
                        title='添加子规则' />,
                    onClick(rowData) {
                        updateState({
                            editItem: {
                                parentNode:rowData.id,
                                parentNodeName:rowData.rule,
                                rule:'',
                                wheatherRoot: false,
                            }
                        })
                        updateEditWindow();
                    }
                })}
                return btns;
            }, width: '120px'
        }]
    ];
    let vtxDatagridProps = {
        columns: handleColumns(columns),
        dataSource,
        indexColumn: false,
        // startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        indentSize:20,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'diagnoseConfig/getList',
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
    // vtxDatagridProps = _.assign(vtxDatagridProps, {
    //     rowSelection: {
    //         type: 'checkbox',
    //         selectedRowKeys,
    //         onChange(selectedRowKeys, selectedRows) {
    //             updateState({
    //                 selectedRowKeys
    //             });
    //         }
    //     }
    // })

    //----------------新增------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'diagnoseConfig/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
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
                    type: 'diagnoseConfig/saveOrUpdate', payload: {
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
            title: '诊断配置 > 添加子规则',
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
                    type: 'diagnoseConfig/saveOrUpdate', payload: {
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



    return (
        <div className="main_page">
            <VtxGrid
                titles={['诊断检索']}
                gridweight={[2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Input {...vtxGridParams.keywordProps} />
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => updateNewWindow()}>添加根规则</Button>}
                </div>
                <div className={`table-content  ${styles.tableContainer}`}>
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
    ({ diagnoseConfig, accessControlM }) => ({ diagnoseConfig, accessControlM})
)(DiagnoseConfig);