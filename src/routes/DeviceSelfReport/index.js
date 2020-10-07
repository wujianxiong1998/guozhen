/**
 * 设备统计报表
 * author : vtx sjb
 * createTime : 2019-8-15
 */
import React from 'react';
import {connect} from 'dva';

import {VtxDatagrid, VtxGrid, VtxExport, VtxDate} from 'vtx-ui';
import {Radio, Button, Select, message, Modal} from 'antd';

const Option = Select.Option;
const {VtxRangePicker} = VtxDate;
const {VtxExport2} = VtxExport;
// import style from './style.less';
import {handleColumns} from '../../utils/tools';
import {VtxUtil} from "../../utils/util";
import SAddItem from './sadd';

function DeviceSelfReport({dispatch, deviceSelfReport}) {
    
    const {
        queryParams, newItem, modelLonding, columnsCopy, radiochoose,
        currentPage, pageSize, loading, dataSource, total, waterFactorySelect, regionalCompanySelect,
        subCurrentPage, subPageSize, subLoading, subDataSource, subTotal, subVisable, selectedRowKeys,
        ssubLoading, ssubVisable, plainOptions, chexkBox
    } = deviceSelfReport;
    
    const ParamsUpdateState = (obj) => {
        dispatch({
            type: 'deviceSelfReport/updateState',
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
            type: 'deviceSelfReport/updateState',
            payload: {
                ...obj
            }
        })
    };
    
    // 更新表格数据
    const getList = () => {
        dispatch({type: 'deviceSelfReport/getList'});
    }
    
    // 查询
    const vtxGridParams = {
        // 事业部
        workProps: {
            value: queryParams.businessId,
            showSearch: true,
            optionFilterProp: 'children',
            // placeholder: "请选择水厂名称",
            onChange(value) {
                ParamsUpdateState({
                    businessId: value
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
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
        
        // 起始日期
        timeProps: {
            value: [queryParams.startDay, queryParams.endDay],
            onChange(date, dateString) {
                ParamsUpdateState({
                    startDay: dateString[0],
                    endDay: dateString[1]
                })
                getList();
            },
            showTime: false,
            style: {
                width: '100%'
            },
            // disabledDate(current) {
            // 	return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
            // }
        },
        
        query() {
            getList();
        },
        
        clear() {
            dispatch({type: 'deviceSelfReport/initQueryParams'});
            dispatch({type: 'deviceSelfReport/getList'});
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
                type: 'deviceSelfReport/getList',
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
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys) {
                dispatch({
                    type: 'deviceSelfReport/updateState',
                    payload: {
                        selectedRowKeys: selectedRowKeys,
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
    
    //----------------选择列------------------
    const updateNewWindowS = (status = true) => {
        dispatch({
            type: 'deviceSelfReport/updateState',
            payload: {
                ssubVisable: status
            }
        })
    }
    const sNewItemProps = {
        modalPropsItem: {
            title: '选择列',
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
                    type: 'deviceSelfReport/updateNewItem',
                    payload: {
                        ...obj
                    }
                })
            },
            plainOptions,
            onSave() {
                let columns = JSON.parse(JSON.stringify(plainOptions));
                let checkFilter = columns.filter(item => chexkBox.includes(item.value));
                dispatch({
                    type: 'deviceSelfReport/updateState',
                    payload: {
                        columnsCopy: checkFilter.map(item => {
                            return [item.label, item.value]
                        }),
                        chexkBox: []
                    }
                });
                updateNewWindowS(false);
            },
            checkOnchange(e) {
                dispatch({
                    type: 'deviceSelfReport/updateState',
                    payload: {
                        chexkBox: e
                    }
                });
                
            }
        }
    }
    
    // // 导出配置____new
    // const exportProps = {
    // 	downloadURL:'/cloud/gzzhsw/api/cp/device/selfCount/exportExcel',
    // 	getExportParams(exportType){
    //         let str = columnsCopy.map(item => {
    //             return {
    //                 'title': item[0],
    //                 'field': item[1]
    // //             }
    //         })
    // 		const common = {
    // 			tenantId : VtxUtil.getUrlParam('tenantId'),
    // 			userId : VtxUtil.getUrlParam('userId'),
    //             columnJson : JSON.stringify(str),
    //             startDay: queryParams.startDay,
    //             endDay: queryParams.endDay,
    //             businessId: queryParams.businessId?queryParams.businessId:'',
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
    // 					downloadAll: 'true',
    // 					...common,
    // 				};
    // 		}
    // 	}
    // }
    
    //--------------导出-----------------
    const exportProps = {
        downloadURL: '/cloud/gzzhsw/api/cp/device/selfCount/exportExcel',
        // rowButton: false,
        getExportParams(exportType) {
            let str = columnsCopy.map(item => {
                return {
                    'title': item[0],
                    'field': item[1]
                }
            })
            const common = {
                tenantId: VtxUtil.getUrlParam('tenantId'),
                userId: VtxUtil.getUrlParam('userId'),
                columnJson: JSON.stringify(str),
                startDay: queryParams.startDay,
                endDay: queryParams.endDay,
                businessId: queryParams.businessId ? queryParams.businessId : '',
                waterFactoryId: queryParams.waterFactoryId ? queryParams.waterFactoryId : '',
                companyId: queryParams.regionalCompanyId ? queryParams.regionalCompanyId : '',
                page: currentPage,
                size: pageSize,
            }
            switch (exportType) {
                case 'rows':
                    if (selectedRowKeys.length === 0) {
                        message.warn('当前没有选中行');
                        return null;
                    }
                    return {
                        ...common,
                        downloadAll: false,
                        downloadIds: selectedRowKeys,
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
    
    return (
        <div className="main_page">
            <VtxGrid
                titles={['事业部', '区域公司', '水厂名称', '起始日期']}
                gridweight={[1, 1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.workProps}>
                    {[{id: '1', name: '11'}].map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
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
                {/*起始日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            
            <div className="table-wrapper">
                <div className="handle_box">
                    <Button onClick={() => updateNewWindowS()}>选择列</Button>
                    <VtxExport2 {...exportProps} />
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增模板*/}
            {ssubVisable && <SAddItem {...sNewItemProps}/>}
        </div>
    );
    
}

export default connect(({deviceSelfReport}) => ({deviceSelfReport}))(DeviceSelfReport);
