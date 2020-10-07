/**
 * 文献审核
 * author : vtx xxy
 * createTime : 2019-08-12 11:08:43
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Modal, Button, message, Input, Select,Icon } from 'antd';
const Option = Select.Option;
import moment from 'moment'
import NewItem from '../../components/literatureAudit/Upload';
import EditItem from '../../components/literatureAudit/Add';
import ViewItem from '../../components/literatureAudit/View';

import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

function LiteratureAudit({ dispatch, literatureAudit, accessControlM}) {
    const {
        searchParams,
        typeSelect, uploadUnitSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem,
        businessSelect,
        uploaderInfo
    } = literatureAudit;
    let buttonLimit = {};
    if (accessControlM['literatureAudit'.toLowerCase()]) {
        buttonLimit = accessControlM['literatureAudit'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'literatureAudit/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'literatureAudit/updateQueryParams' });
        dispatch({ type: 'literatureAudit/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 类别
        typeIdProps: {
            value: searchParams.knowledgeTypeId,
            placeholder: "请选择类别",
            onChange(value) {
                updateState({
                    searchParams: {
                        knowledgeTypeId: value
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            }
        },

        // 上传日期
        startTimeProps: {
            value: [searchParams.uploadDateStart, searchParams.uploadDateEnd],
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        uploadDateStart: dateString[0],
                        uploadDateEnd: dateString[1]
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            },
            disabledDate(current) {
                return current && VtxTimeUtil.isAfterDate(current);
            }
        },

        // 上传单位
        uploadUnitIdProps: {
            value: searchParams.uploadUnit,
            placeholder: "请选择上传单位",
            onChange(e) {
                updateState({
                    searchParams: {
                        uploadUnit: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            style: {
                width: '100%'
            }
        },

        // 关键词
        keywordProps: {
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
            placeholder: '请输入关键词',
            maxLength: '32'
        },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'literatureAudit/initQueryParams' });
            dispatch({ type: 'literatureAudit/getList' });
        }
    };

    // 列表
    const columns = [
        ['标题', 'title',{nowrap:true}],
        ['类别', 'knowledgeTypeName'],
        ['上传人', 'uploadManName'],
        ['上传单位', 'uploadUnitName'],
        ['上传日期','uploadDate',{render:(text)=>moment(text).format('YYYY-MM-DD')}],
        ['审核状态', 'auditStatusStr'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                if (record.auditStatus !== 'dsh' && buttonLimit['VIEW']){
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        updateState({
                            viewItem: {
                                ...rowData,
                                auditReason:record.auditStatus==='ysh'?'':record.auditReason,
                                annx: JSON.parse(rowData.annx||'[]')
                            }
                        })
                        updateViewWindow();
                    }
                })}
                if (record.auditStatus==='dsh'&&buttonLimit['AUDIT']){
                    btns.push({
                        name: <Icon type='examine'
                            title='审核' />,
                        onClick(rowData) {
                            updateState({
                                editItem: {
                                    ...rowData,
                                    auditReason: record.auditStatus === 'ysh' ? '' : record.auditReason,
                                    annx: JSON.parse(rowData.annx || '[]')
                                }
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
                type: 'literatureAudit/getList',
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
            dispatch({ type: 'literatureAudit/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '文献上传',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
        },
        contentProps: {
            ...newItem,
            uploaderInfo,
            businessSelect,
            typeSelect,
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
                    type: 'literatureAudit/saveFile', payload: {
                        btnType: 'add',
                        onSuccess: function () {
                            message.success('上传成功');
                            updateNewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg || '上传失败');
                        }
                    }
                })
            },
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
            title: '文献审核',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
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
            save(auditStatus) {
                dispatch({
                    type: 'literatureAudit/handleAudit', payload: {
                        auditStatus,
                        btnType: 'edit',
                        onSuccess: function () {
                            message.success('操作成功');
                            updateEditWindow(false);
                        },
                        onError: function () {
                            message.error('操作失败');
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
            title: '文献审核 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'view',
            onDelete:()=>{
                deleteItems(viewItem.id)
            },
            updateItem(obj) {
                updateState({
                    viewItem: {
                        ...obj
                    }
                })
            },
        }
    };

    //--------------删除------------------
    const deleteItems = (id) => {
        dispatch({
            type: 'literatureAudit/deleteItems', payload: {
                id,
                onSuccess: function (ids) {
                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                        currentPage - 1 : currentPage;
                    dispatch({
                        type: 'literatureAudit/getList',
                        payload: {
                            selectedRowKeys: [],
                            currentPage: page
                        }
                    })
                    updateViewWindow(false)
                    message.success('删除成功');
                },
                onError: function (msg) {
                    message.error(msg);
                }
            }
        });
    }

    return (
        <div className="main_page">
            <VtxGrid
                titles={['类别', '上传日期', '上传单位', '关键词']}
                gridweight={[1, 2, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.typeIdProps}>
                    <Option key='' value=''>全部</Option>
                    {typeSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxRangePicker {...vtxGridParams.startTimeProps} />
                <Input {...vtxGridParams.uploadUnitIdProps} />
                <Input {...vtxGridParams.keywordProps} />
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>文献上传</Button>}
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            
        </div>
            {/*上传 */}
            {newItem.visible && <NewItem {...newItemProps} />}
            {/*编辑*/}
            {editItem.visible && <EditItem {...editItemProps} />}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps} />}
    </div>
    )
}

export default connect(
    ({ literatureAudit, accessControlM }) => ({ literatureAudit, accessControlM })
)(LiteratureAudit);