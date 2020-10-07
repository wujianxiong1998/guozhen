/**
 * 设备统计报表
 * author : vtx sjb
 * createTime : 2019-8-15
 */
import React from 'react';
import {connect} from 'dva';

import {VtxDatagrid, VtxGrid, VtxExport} from 'vtx-ui';
import {Radio, Button, Select, message, Modal, Icon} from 'antd';

const Option = Select.Option;
const {VtxExport2} = VtxExport;
import style from './style.less';
import {handleColumns} from '../../utils/tools';
import {VtxUtil} from "../../utils/util";
import AddItem from './add';
import SAddItem from './sadd';

function DeviceStatisticReport({dispatch, deviceStatisticReport, accessControlM}) {
    
    const {
        queryParams, newItem, modelLonding, columnsCopy, radiochoose,
        currentPage, pageSize, loading, dataSource, total, waterFactorySelect, regionalCompanySelect, selectedRowKeys2,
        subCurrentPage, subPageSize, subLoading, subDataSource, subTotal, subVisable, selectedRowKeys,
        ssubLoading, ssubVisable, plainOptions, chexkBox
    } = deviceStatisticReport;
    let buttonLimit = {};
    if (accessControlM['deviceStatisticReport'.toLowerCase()]) {
        buttonLimit = accessControlM['deviceStatisticReport'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };
    
    const updateState = (obj) => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                ...obj
            }
        })
    };
    
    // 更新表格数据
    const getList = () => {
        dispatch({type: 'deviceStatisticReport/getList'});
    }
    
    // 查询
    const vtxGridParams = {
        // 水厂名称
        waterFactoryIdProps: {
            value: queryParams.waterFactoryId,
            showSearch: true,
            optionFilterProp: 'children',
            // placeholder: "请选择水厂名称",
            onChange(value) {
                ParamsUpdateState({
                    waterFactoryId: value
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
        //区域公司
        regionalCompanyIdProps: {
            value: queryParams.regionalCompanyId,
            // placeholder: "请选择区域公司",
            onChange(value) {
                ParamsUpdateState({
                    regionalCompanyId: value
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
            dispatch({type: 'deviceStatisticReport/initQueryParams'});
            dispatch({type: 'deviceStatisticReport/getList'});
        }
    };
    
    // 列表
    let vtxDatagridProps = {
        columns: handleColumns(columnsCopy),
        dataSource,
        indexColumn: true,
        indexTitle: '序号',
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'deviceStatisticReport/getList',
                payload: {
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize
                }
            }).then((status) => {
                if (status) {
                    updateState({
                        currentPage: pagination.current,
                        pageSize: pagination.pageSize
                    })
                }
            });
        },
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys2,
            onChange(selectedRowKeys) {
                dispatch({
                    type: 'deviceStatisticReport/updateState',
                    payload: {
                        selectedRowKeys2: selectedRowKeys,
                    }
                })
            }
        },
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            showQuickJumper: true,
            current: currentPage,  //后端分页数据配置参数1
            total: total, //后端分页数据配置参数2
            pageSize, //后端分页数据配置参数3
            showTotal: total => `合计 ${total} 条`
        },
    };
    
    //----------------新增table------------------
    const showNewWindow = () => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                subVisable: true
            }
        });
        
    }
    const updateNewWindow = (status = true) => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                subVisable: status
            }
        })
    }
    const newItemProps = {
        modalPropsItem: {
            title: '设备统计报表',
            visible: subVisable,
            onCancel: () => updateNewWindow(false),
            width: 800
        },
        contentProps: {
            subVtxDatagridProps: {
                columns: handleColumns([
                    ['模版名称', 'templateName'],
                    ['排序', 'orderIndex'],
                    ['操作', 'action', {
                        renderButtons: (text, record) => {
                            let btns = [];
                            btns.push({
                                name: <Icon type='file-edit'
                                            title='编辑'/>,
                                onClick(rowData) {
                                    let checkRowData = [];
                                    for (let i in rowData) {
                                        if (rowData[i] === 1) {
                                            checkRowData.push(i);
                                        }
                                    }
                                    dispatch({
                                        type: 'deviceStatisticReport/updateState',
                                        payload: {
                                            newItem: {
                                                ...newItem,
                                                ...rowData,
                                            },
                                            chexkBox: checkRowData
                                        }
                                    });
                                    updateNewWindowS();
                                }
                            });
                            btns.push({
                                name: <Icon type='delete'
                                            title='删除'/>,
                                onClick(rowData) {
                                    dispatch({
                                        type: 'deviceStatisticReport/delete', payload: {
                                            ids: rowData.id,
                                            onSuccess: function () {
                                                updateState({
                                                    selectedRowKeys: []
                                                })
                                                message.success('删除成功');
                                            },
                                            onError: function (msg) {
                                                message.error(msg);
                                            }
                                        }
                                    })
                                }
                            });
                            return btns;
                        }, width: '220px'
                    }]
                ]),
                dataSource: subDataSource,
                indexColumn: true,
                indexTitle: '序号',
                startIndex: (subCurrentPage - 1) * subPageSize + 1,
                autoFit: true,
                loading: subLoading,
                rowSelection: {
                    type: 'checkbox',
                    selectedRowKeys: selectedRowKeys,
                    onChange(selectedRowKeys) {
                        dispatch({
                            type: 'deviceStatisticReport/updateState',
                            payload: {
                                selectedRowKeys: selectedRowKeys,
                            }
                        })
                    }
                },
                onChange(pagination, filters, sorter) {
                    dispatch({
                        type: 'deviceStatisticReport/getList',
                        payload: {
                            subCurrentPage: pagination.current,
                            subPageSize: pagination.pageSize
                        }
                    }).then((status) => {
                        if (status) {
                            updateState({
                                subCurrentPage: pagination.current,
                                subPageSize: pagination.pageSize
                            })
                        }
                    });
                },
                pagination: 'none'
            },
            addOnChange() {
                dispatch({
                    type: 'deviceStatisticReport/updateState',
                    payload: {
                        ssubVisable: true,
                        chexkBox: [],
                        newItem: {
                            id: '',
                            templateName: '',  // 模板名称
                            orderIndex: '',  // 排序
                            device: [],  // 设备选择
                        }
                        
                    }
                });
            }
        }
    }
    
    //----------------新增模板------------------
    const updateNewWindowS = (status = true) => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                ssubVisable: status
            }
        })
    }
    const sNewItemProps = {
        modalPropsItem: {
            title: '设备统计报表',
            visible: ssubVisable,
            onCancel: () => updateNewWindowS(false),
            width: 800
        },
        contentProps: {
            ...newItem,
            ssubLoading,
            chexkBox,
            updateItem(obj) {
                dispatch({
                    type: 'deviceStatisticReport/updateNewItem',
                    payload: {
                        ...obj
                    }
                })
            },
            plainOptions,
            onSave() {
                dispatch({
                    type: 'deviceStatisticReport/save'
                }).then(() => updateNewWindowS(false));
            },
            onUpdate() {
                dispatch({
                    type: 'deviceStatisticReport/update'
                }).then(() => updateNewWindowS(false));
            },
            checkOnchange(e) {
                dispatch({
                    type: 'deviceStatisticReport/updateState',
                    payload: {
                        chexkBox: e
                    }
                });
            }
        }
    }
    
    // // 导出配置____new
    // const exportProps = {
    // 	downloadURL:'/cloud/gzzhsw/api/cp/device/totalCount/exportExcel',
    // 	getExportParams(exportType){
    //         let str = columnsCopy.map(item => {
    //             return {
    //                 'title': item[0],
    //                 'field': item[1]
    //             }
    //         })
    // 		const common = {
    // 			tenantId : VtxUtil.getUrlParam('tenantId'),
    // 			userId : VtxUtil.getUrlParam('userId'),
    // 			columnJson : JSON.stringify(str),
    // 			waterFactoryId: queryParams.waterFactoryId?queryParams.waterFactoryId:'',
    // 			companyId: queryParams.regionalCompanyId?queryParams.regionalCompanyId:'',
    // 			page: currentPage-1,
    // 			size: pageSize,
    // 		}
    // 		switch (exportType){
    // 			case 'rows':
    // 				if(selectedRowKeys.length==0){
    // 					message.warn('当前没有选中行');
    // 					return null;
    // 				}
    // 				return {
    // 					...common,
    // 					downloadIds: selectedRowKeys.join(',')
    // 				};
    // 			case 'page':
    // 				return {
    // 					...common,
    // 					downloadIds: dataSource.map((item)=>item.key).join(',')
    // 				};
    // 			case 'all':
    // 				return {
    // 					downloadIds: '',
    // 					...common,
    // 				};
    // 		}
    // 	}
    // }
    
    //--------------导出-----------------
    const exportProps = {
        downloadURL: '/cloud/gzzhsw/api/cp/device/totalCount/exportExcel',
        // rowButton: false,
        getExportParams(exportType) {
            let str = columnsCopy.map(item => {
                return {
                    'title': item[0],
                    'field': item[1]
                }
            });
            const common = {
                tenantId: VtxUtil.getUrlParam('tenantId'),
                userId: VtxUtil.getUrlParam('userId'),
                columnJson: JSON.stringify(str),
                waterFactoryId: queryParams.waterFactoryId ? queryParams.waterFactoryId : '',
                companyId: queryParams.regionalCompanyId ? queryParams.regionalCompanyId : '',
                page: currentPage - 1,
                size: pageSize,
            }
            switch (exportType) {
                case 'rows':
                    if (selectedRowKeys2.length === 0) {
                        message.warn('当前没有选中行');
                        return null;
                    }
                    return {
                        ...common,
                        downloadAll: false,
                        downloadIds: selectedRowKeys2,
                        page: currentPage,
                        size: pageSize,
                    };
                case 'page':
                    if (dataSource.length === 0) {
                        message.warn('当前页无数据');
                        return null;
                    }
                    return {
                        ...common,
                        downloadAll: false,
                        page: currentPage,
                        rows: pageSize
                    };
                case 'all':
                    if (total === 0) {
                        message.warn('当前无数据');
                        return null;
                    }
                    return {
                        ...common,
                        downloadAll: true,
                        page: currentPage,
                        rows: pageSize
                    };
            }
        }
    }
    
    const radioOnChange = (e) => {
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                radiochoose: e.target.value
            }
        })
        let checkRows = [], columnsCopy = [];
        let redioFilter = subDataSource.filter(item => item.id === e.target.value);
        for (let i in redioFilter[0]) {
            if (redioFilter[0][i] === 1) {
                checkRows.push(i);
            }
        }
        let columns = JSON.parse(JSON.stringify(plainOptions));
        columnsCopy = columns.filter(item => checkRows.includes(item.value)).map(item => {
            return [item.label, item.value]
        })
        dispatch({
            type: 'deviceStatisticReport/updateState',
            payload: {
                columnsCopy
            }
        })
    }
    
    return (
        <div className="main_page">
            <VtxGrid
                titles={['区域公司', '水厂名称']}
                gridweight={[1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.regionalCompanyIdProps}>
                    {regionalCompanySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
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
                    <div>
                        <Button onClick={() => showNewWindow()}>模板配置</Button>
                        <VtxExport2 {...exportProps} />
                    </div>
                    <Radio.Group onChange={(e) => radioOnChange(e)} value={radiochoose} style={{float: 'right'}}>
                        {
                            subDataSource.map(item => <Radio value={item.id} key={item.id}>{item.templateName}</Radio>)
                        }
                    </Radio.Group>
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增table*/}
            {subVisable && <AddItem {...newItemProps}/>}
            {/*新增模板*/}
            {ssubVisable && <SAddItem {...sNewItemProps}/>}
        </div>
    );
    
}

export default connect(({deviceStatisticReport, accessControlM}) => ({
    deviceStatisticReport,
    accessControlM
}))(DeviceStatisticReport);
