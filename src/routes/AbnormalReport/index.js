/**
 * 异常上报
 * author : vtx xxy
 * createTime : 2019-07-29 10:48:28
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
import { Modal, Button, message, Select,Icon } from 'antd';
const Option = Select.Option;

import NewItem from '../../components/abnormalReport/Add';
import EditItem from '../../components/abnormalReport/Add';
import ViewItem from '../../components/abnormalReport/View';
import AssignItem from '../../components/abnormalReport/Assign';

import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';

function AbnormalReport({ dispatch, abnormalReport, accessControlM }) {
    const {
        searchParams,
        exceptionStatusSelect, waterFactorySelect, exceptionTypeSelect, exceptionSmallTypeSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,userTree,
        newItem, editItem, viewItem, assignItem
    } = abnormalReport;
    let buttonLimit = {};
    if (accessControlM['abnormalReport'.toLowerCase()]) {
        buttonLimit = accessControlM['abnormalReport'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'abnormalReport/updateState',
            payload: {
                ...obj
            }
        })
    }

    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'abnormalReport/updateQueryParams' });
        dispatch({ type: 'abnormalReport/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 上报时间
        startDateProps: {
            value: [searchParams.startTime, searchParams.endTime],
            onChange(date, dateString) {
                updateState({
                    searchParams: {
                        startTime: dateString[0],
                        endTime: dateString[1]
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

        // 异常状态
        exceptionStatusProps: {
            value: searchParams.exceptionStatus,
            placeholder: "请选择异常状态",
            onChange(value) {
                updateState({
                    searchParams: {
                        exceptionStatus: value || ''
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },

        // 运营厂
        waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
            placeholder: "请选择运营厂",
            showSearch:true,
            optionFilterProp:'children',
            onChange(value) {
                updateState({
                    searchParams: {
                        waterFactoryId: value||''
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
            dispatch({ type: 'abnormalReport/initQueryParams' });
            dispatch({ type: 'abnormalReport/getList' });
        }
    };

    // 列表
    const columns = [
        ['异常大类', 'exceptionTypeName'],
        ['异常小类', 'exceptionSmallTypeName'],
        ['上报时间', 'reportDate'],
        ['异常描述', 'exceptionDescription',{nowrap:true}],
        ['上报人', 'reportPersonName'],
        ['状态', 'exceptionStatusStr'],
        ['运营厂', 'waterFactoryName'],
        ['操作', 'action', {
            renderButtons: (text,record) => {
                let btns = [];
                if (record.exceptionStatus==='dcl'){
                        if (buttonLimit['ASSIGN']){
                        btns.push({
                            name: <Icon type='tubiaozhizuomoban-'
                                title='任务下达' />,
                            onClick(rowData){
                                updateState({
                                    assignItem:{
                                        exceptionReportId:rowData.id,
                                    }
                                })
                                updateAssignWindow()
                            }
                        })
                    }
                    if (buttonLimit['NEGLECT']) {
                        btns.push({
                            name: <Icon type='hulve'
                                title='忽略' />,
                            onClick(rowData) {
                                updateState({
                                    viewItem: {
                                        ...rowData,
                                        description: rowData.exceptionDescription,
                                        attachment: JSON.parse(rowData.annex || "[]"),
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
                            dispatch({
                                type: 'abnormalReport/loadExceptionSmallTypeSelect',
                                payload: {
                                    exceptionTypeId: rowData.exceptionTypeId
                                }
                            })
                            updateState({
                                editItem: {
                                    description: rowData.exceptionDescription,
                                    attachment: JSON.parse(rowData.annex || "[]"),
                                    exceptionTypeList: JSON.parse(rowData.exceptionTypeJson || "[]"),
                                    ...rowData
                                }
                            })
                            updateEditWindow();
                        }
                    })
                }
            }
                // }else{
                    if (buttonLimit['VIEW']) {
                    btns.push({
                        name: <Icon type='view'
                            title='查看任务' />,
                        onClick(rowData) {
                            updateState({
                                viewItem: {
                                    ...rowData,
                                    description: rowData.exceptionDescription,
                                    attachment: JSON.parse(rowData.annex || "[]"),
                                }
                            })
                            updateViewWindow();
                        },
                        handleNeglect() {
                        }
                    })
                }
                if (buttonLimit['DELETE'] && record.exceptionStatus !== 'clz' && record.exceptionStatus !== 'ycl') {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'abnormalReport/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'abnormalReport/getList',
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
                type: 'abnormalReport/getList',
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
                if (record.exceptionStatus === 'clz' || record.exceptionStatus === 'ycl'){
                    return {
                        disabled:true
                    }
                }else{
                    return {
                        disabled: false
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
            dispatch({ type: 'abnormalReport/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '异常上报 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 600
        },
        contentProps: {
            ...newItem,
            waterFactorySelect, exceptionTypeSelect, exceptionSmallTypeSelect,
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
                    type: 'abnormalReport/saveOrUpdate', payload: {
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
            },
            loadExceptionSmallTypeSelect(exceptionTypeId){
                dispatch({
                    type: 'abnormalReport/loadExceptionSmallTypeSelect',
                    payload: {
                        exceptionTypeId
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
            title: '异常上报 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 600
        },
        contentProps: {
            ...editItem,
            waterFactorySelect, exceptionTypeSelect, exceptionSmallTypeSelect,
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
                    type: 'abnormalReport/saveOrUpdate', payload: {
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
            },
            loadExceptionSmallTypeSelect(exceptionTypeId) {
                dispatch({
                    type: 'abnormalReport/loadExceptionSmallTypeSelect',
                    payload: {
                        exceptionTypeId
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
            title: '异常上报 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 600
        },
        contentProps: {
            ...viewItem,
            btnType: 'view',
            handleNeglect() {
                dispatch({
                    type: 'abnormalReport/handleNeglect',
                    payload: {
                        id: viewItem.id,
                        onSuccess: function () {
                            updateViewWindow(false);
                            getList()
                            message.success('操作成功');
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                })
            }
        }
    };
    //---------------下达任务----------------------
    const updateAssignWindow = (status = true) => {
        updateState({
            assignItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'abnormalReport/initAssignItem' });
        }
    }
    const assignItemProps = {
        updateWindow: updateAssignWindow,
        modalProps: {
            title: '异常上报 > 下达任务',
            visible: assignItem.visible,
            onCancel: () => updateAssignWindow(false),
            width: 600
        },
        contentProps: {
            ...assignItem,
            userTree,
            updateItem(obj) {
                updateState({
                    assignItem: {
                        ...obj
                    }
                })
            },
            handleAssign(){
                dispatch({
                    type: 'abnormalReport/assignMission', payload: {
                        onSuccess: function () {
                            message.success('下达成功');
                            updateAssignWindow(false);
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
                    type: 'abnormalReport/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'abnormalReport/getList',
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
                titles={['上报时间', '异常状态', '运营厂']}
                gridweight={[2, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <VtxRangePicker {...vtxGridParams.startDateProps} />
                <Select {...vtxGridParams.exceptionStatusProps}>
                    {exceptionStatusSelect.map(item => {
                        return <Option key={item.value}>{item.text}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
            </VtxGrid>
            <div className="table-wrapper">
               
                <div className="handle_box">
                    {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => updateNewWindow()}>异常上报</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
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
            {/*任务下达*/}
            {assignItem.visible && <AssignItem {...assignItemProps} />}
        </div>
    )
}

export default connect(
    ({ abnormalReport, accessControlM }) => ({ abnormalReport, accessControlM })
)(AbnormalReport);