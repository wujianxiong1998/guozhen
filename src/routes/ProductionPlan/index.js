/**
 * 生产计划
 * author : vtx xxy
 * createTime : 2019-07-23 11:38:59
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, } from 'vtx-ui';
const { VtxYearPicker, VtxRangePicker } = VtxDate;
import { Modal, Button, message, Select,Icon } from 'antd';
const Option = Select.Option;
import moment from 'moment';

import NewItem from '../../components/productionPlan/Add';
import EditItem from '../../components/productionPlan/Add';
import ViewItem from '../../components/productionPlan/View';
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import { VtxUtil, openImportView } from '../../utils/util';
function ProductionPlan({ dispatch, productionPlan, accessControlM }) {
    const {
        searchParams, isAdministrator,
        waterFactorySelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem, showUploadModal, importError
    } = productionPlan;
    let buttonLimit = {};
    if (accessControlM['productionPlan'.toLowerCase()]) {
        buttonLimit = accessControlM['productionPlan'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'productionPlan/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'productionPlan/updateQueryParams' });
        dispatch({ type: 'productionPlan/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 水厂
        waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
            showSearch: true,
            optionFilterProp: 'children',
            placeholder: "请选择水厂",
            onChange(value) {
                updateState({
                    searchParams: {
                        waterFactoryId: value
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            }
        },

        // 时间快速选择
        quickDateProps: {
            value: searchParams.quickDate,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        quickDate: dateString,
                        startDate: moment(dateString).startOf('month').format('YYYY-MM-DD'),
                         endDate: moment(dateString).endOf('month').format('YYYY-MM-DD')
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            },
            // disabledDate(current) {
            //     return VtxTimeUtil.isAfterDate(current);
            // }
        },

        // 开始时间
        startDateProps: {
            value: searchParams.startDate,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        startDate: dateString,
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            },
            disabledDate(current) {
                return current && moment(current).isAfter(moment(searchParams.endDate));
            }
        },
        //结束时间
        endDateProps:{
            value: searchParams.endDate,
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        endDate: dateString,
                    }
                })
                
                getList();
            },
            style: {
                width: '100%'
            },
            disabledDate(current) {
                return current && moment(current).isBefore(moment(searchParams.startDate).subtract(1,'year'));
            }
        },
        query() {
            // if (moment(searchParams.startDate).isAfter(moment(searchParams.endDate))) {
            //     message.warn('开始时间不能小于结束时间')
            // }else{
                getList();
            // }
        },

        clear() {
            dispatch({ type: 'productionPlan/initQueryParams' });
            dispatch({ type: 'productionPlan/getList' });
        }
    };

    // 列表
    const columns = [
        ['年份', 'dateValue'],
        ['水厂', 'waterFactoryName'],
        ['区域公司', 'regionalCompanyName'],
        ['事业部', 'businessUnitName'],
        ['状态', 'dataStatusStr'],
        ['审核意见', 'auditMemo'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                const dataStatus = record.dataStatus
                // btns.push({
                //     name: '审核',
                //     onClick(rowData) {
                //         updateState({
                //             viewItem: {
                //                 ...rowData
                //             }
                //         })
                //         updateViewWindow();
                //     }
                // })
                if (buttonLimit['EDIT'] && (dataStatus === 'xj' || (isAdministrator && (dataStatus === 'dsh' || dataStatus === 'tg')) )){
                    btns.push({
                        name: <Icon type='file-edit'
                            title='编辑' />,
                        onClick(rowData) {
                            dispatch({
                                type:'productionPlan/getDetail',
                                payload:{
                                    id:rowData.id,
                                    itemName:'editItem'
                                }
                            })
                            updateState({
                                editItem: {
                                    editType:'edit',
                                    ...rowData
                                }
                            })
                            updateEditWindow();
                        }
                    })
                } 
                if (dataStatus === 'dsh' && buttonLimit['AUDIT']){
                    btns.push({
                        name: <Icon type='examine'
                            title='审核' />,
                        onClick(rowData) {
                            dispatch({
                                type: 'productionPlan/getDetail',
                                payload: {
                                    id: rowData.id,
                                    itemName: 'viewItem'
                                }
                            })
                            updateState({
                                viewItem: {
                                    ...rowData,
                                    auditMemo:''
                                }
                            })
                            updateViewWindow();
                        }
                    })
                } 
                if (dataStatus === 'dxg'&&buttonLimit['SUBMIT']){
                    btns.push({
                        name: <Icon type='zhongxintijiao'
                            title='重新提交' />,
                        onClick(rowData) {
                            dispatch({
                                type: 'productionPlan/getDetail',
                                payload: {
                                    id: rowData.id,
                                    itemName: 'editItem'
                                }
                            })
                            updateState({
                                editItem: {
                                    editType:'submitAgain',
                                    ...rowData
                                }
                            })
                            updateEditWindow();
                    }})
                }
                if (dataStatus === 'tg' && buttonLimit['VIEW']) {
                    btns.push({
                        name: <Icon type='view'
                            title='查看' />,
                        onClick(rowData) {
                            dispatch({
                                type: 'productionPlan/getDetail',
                                payload: {
                                    id: rowData.id,
                                    itemName: 'viewItem'
                                }
                            })
                            updateState({
                                viewItem: {
                                    ...rowData,
                                    auditMemo: ''
                                }
                            })
                            updateViewWindow();
                        }
                    })
                }
                if (buttonLimit['DELETE'] && (dataStatus === 'xj' || (isAdministrator && (dataStatus === 'dsh' || dataStatus === 'dxg' || dataStatus === 'tg')))){
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'productionPlan/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'productionPlan/getList',
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
        bordered:true,
        indexColumn: true,
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'productionPlan/getList',
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
            },
            getCheckboxProps: (record) => {
                const dataStatus = record.dataStatus
                if (dataStatus === 'xj' || (isAdministrator && (dataStatus === 'dsh' || dataStatus === 'dxg' || dataStatus === 'tg'))) {
                    return {
                        disabled: false
                    }
                } else {
                    return {
                        disabled: true
                    }
                }
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
            dispatch({ type: 'productionPlan/initNewItem' });
        }else{
            dispatch({ type:'productionPlan/getDefaultProductionFill'})
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '生产计划 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            waterFactoryId:searchParams.waterFactoryId,
            importError,showUploadModal,
            btnType: 'add',
            getList,
            updateState,
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            save(operateType) {
                dispatch({
                    type: 'productionPlan/saveOrUpdate', payload: {
                        btnType: 'add',
                        operateType,
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
            title: '生产计划 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps: {
            ...editItem,
            waterFactoryId: searchParams.waterFactoryId,
            importError, showUploadModal,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save(operateType) {
                dispatch({
                    type: 'productionPlan/saveOrUpdate', payload: {
                        btnType: 'edit',
                        operateType,
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

    //--------------审核-----------------
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
            title: viewItem.dataStatus=== 'tg' ? '生产计划 > 查看' : '生产计划 > 审核',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'audit',
            updateItem(obj) {
                updateState({
                    viewItem: {
                        ...obj,
                    }
                })
            },
            handleAudit(operateType){
                dispatch({
                    type: 'productionPlan/handleAudit', payload: {
                        operateType,
                        onSuccess: function () {
                            message.success('提交审核成功');
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

    //--------------删除------------------
    const deleteItems = () => {
        Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'productionPlan/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'productionPlan/getList',
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
                titles={['水厂', '开始时间', '结束时间']}
                gridweight={[1, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxYearPicker {...vtxGridParams.startDateProps} />
                <VtxYearPicker {...vtxGridParams.endDateProps} />
            </VtxGrid>
            <div className="table-wrapper">
               
                <div className="handle_box">
                    {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => updateNewWindow()}>创建计划</Button>}
                    {buttonLimit['DELETE'] &&<Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
                    <Button icon='download' onClick={() => { window.open(`/cloud/gzzhsw/api/cp/produce/data/fill/exportExcel?waterFactoryId=${searchParams.waterFactoryId}&tenantId=${VtxUtil.getUrlParam('tenantId')}`,)}}>上传模版下载</Button>
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
    ({ productionPlan, accessControlM }) => ({ productionPlan, accessControlM  })
)(ProductionPlan);