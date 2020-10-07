/**
 * 数据填报
 * author : vtx xxy
 * createTime : 2019-07-23 11:38:59
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, VtxExport } from 'vtx-ui';
const { VtxMonthPicker, VtxRangePicker } = VtxDate;
const { VtxExport2 } = VtxExport;
import { Modal, Button, message, Select,Tabs,Icon } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane
import moment from 'moment';

import NewItem from '../../components/sewageManagement/Add';
import EditItem from '../../components/sewageManagement/Add';
import ViewItem from '../../components/sewageManagement/Add';
import ChartItem from '../../components/sewageManagement/Chart';
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import {VtxUtil} from '../../utils/util'

function SewageManagement({ dispatch, sewageManagement, accessControlM }) {
    const {
        searchParams, isAdministrator,
        sewageManagementSelect,queryParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, selectedRows,
        newItem, editItem, viewItem, title, importError, showUploadModal, chartItem,regionalCompanySelect
    } = sewageManagement;
    let buttonLimit = {};
    if (accessControlM['ProductionManageFill'.toLowerCase()]) {
        buttonLimit = accessControlM['ProductionManageFill'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'sewageManagement/updateState',
            payload: {
                ...obj
            }
        })
    }
    //判断是否可以删除
    const canDelete=()=>{
        let disabled = false
        for(let i=0;i<selectedRows.length;i++){
            
            const  dataStatus = selectedRows[i]['状态']
            if (dataStatus === '新建' || (isAdministrator && (dataStatus === '待审核' || dataStatus === '待修改' || dataStatus === '通过'))){

            }else{
                disabled = true
                break
            }
        }
        return disabled
    }
    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'sewageManagement/updateQueryParams' });
        dispatch({ type: 'sewageManagement/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 水厂
        sewageManagementIdProps: {
            value: searchParams.sewageManagementId,
            showSearch: true,
            optionFilterProp: 'children',
            placeholder: "请选择水厂",
            onChange(value) {
                updateState({
                    searchParams: {
                        sewageManagementId: value
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            }
        },

        // 时间快速选择
        // quickDateProps: {
        //     value: searchParams.quickDate,
        //     onChange(date, dateString) {
        //         updateState({
        //             searchParams: {
        //                 quickDate: dateString,
        //                 startTime: moment(dateString).startOf('month').format('YYYY-MM-DD'),
        //                 endTime: (moment(dateString).month() == moment().month() && moment(dateString).year() == moment().year()) ? moment().format('YYYY-MM-DD'):moment(dateString).endOf('month').format('YYYY-MM-DD')
        //             }
        //         })
        //         getList();
        //     },
        //     style: {
        //         width: '100%'
        //     },
        //     disabledDate(current) {
        //         return VtxTimeUtil.isAfterDate(current);
        //     }
        // },

        // 起止时间
        // startDateProps: {
        //     value: [searchParams.startTime, searchParams.endTime],
        //     onChange(date, dateString) {
        //         updateState({
        //             searchParams: {
        //                 startTime: dateString[0],
        //                 endTime: dateString[1]
        //             }
        //         })
        //         getList();
        //     },
        //     style: {
        //         width: '100%'
        //     },
        //     disabledDate(current) {
        //         return current && VtxTimeUtil.isAfterDate(current);
        //     }
        // },

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'sewageManagement/initQueryParams' });
            dispatch({ type: 'sewageManagement/getList' });
        }
    };
    // 列表
    let columns;
    columns = searchParams.dataFillType==='produce'?[
        [ '区域', 'regionalCompanyName' ],
        [ '公司名称', 'waterFactoryName'],
        [ '证书编号', 'permissionCode' ],
        [ '组织机构代码', 'orgCode' ],
        ['法定代表人', 'legalRepresentative'],
        ['发证单位', 'issueUnit'],
        ['主要污染物种类及限排污染物名称', 'mainContaminant'],
        ['排放方式', 'emissionsWay'],
        ['排放口数量(座)', 'dischargeOutletNum'],
        ['排放口分布情况', 'dischargeOutletDistribution'],
        ['设计规模', 'scale' ],
        ['执行的污染物排放标准', 'exeStandard'],
        ['主要污染物排放浓度限值', 'limitConcentrationVolume'],
        ['年度污染物排放限值', 'yearLimitVolume'],
        ['排污许可证发证日期', 'startDate'],
        ['排污许可证有效期', 'endDate'], 
        ['排污许可备注', 'permitRemark'], 
        ['环境影响评价报告', 'envReport'], 
        ['环境自行监测方案', 'envScheme'],
        ['突发环境应急预案', 'contingencyPlan'], 
        ['备注', 'remark'], 
        ['排污许可证状态', 'state']
    ]:[
        ['区域',  'a'] ,
        ['公司名称',  'b',  2],
        ['证书编号',  'c',  0],
        ['组织机构代码',  'd',  0] ,
        ['法定代表人',  'e',  1] ,
        ['发证单位',  'f'] ,
        ['主要污染物种类及限排污染物名称',  'g'] ,
        ['排放方式',  'h'] ,
        ['排放口数量(座)',  'i'] ,
        ['排放口分布情况',  'j'] ,
        ['设计规模',  'k'] ,
        ['执行的污染物排放标准',  'l'] ,
        ['主要污染物排放浓度限值',  'm'] ,
        ['年度污染物排放限值',  'n'] ,
        ['排污许可证发证日期',  'o'] ,
        ['排污许可证有效期',  'p'] ,
        ['排污许可备注',  'q'] ,
        ['环境影响评价报告',  'r'] ,
        ['环境自行监测方案',  's'] ,
        ['突发环境应急预案',  't'] ,
        ['备注',  'u'] ,
        ['排污许可证状态',  'v'] 
    ]
    columns = columns.concat([['操作', 'action', {
        renderButtons: (text,record) => {
            let btns = [];
                // 查看
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'sewageManagement/getDetail',
                            payload: {
                                id: rowData.id,
                                dateValue: rowData.dateValue,
                                itemName: 'viewItem'
                            }
                        })
                        updateState({
                            viewItem: {
                                ...rowData,
                            }
                        })
                        updateViewWindow();
                    }
                })
                // 编辑
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'sewageManagement/getDetail',
                            payload: {
                                id: rowData.id,
                                dateValue:rowData.dateValue,
                                itemName: 'editItem'
                            }
                        })
                        updateState({
                            editItem: {
                                editType: 'edit',
                                ...rowData
                            }
                        })
                        updateEditWindow();
                    }
                })                // 删除
                btns.push({
                    name: <Icon type='delete'
                            title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'sewageManagement/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'sewageManagement/getList',
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
            return btns
        }, width: '150px'
    }]])
    
    let vtxDatagridProps = {
        bordered:true,
        columns: handleColumns(columns),
        scroll:{x:true},
        dataSource,
        indexColumn: true,
        startIndex: (currentPage - 1) * pageSize + 1,
        autoFit: true,
        rowKey:record=>record.id,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter) {
            dispatch({
                type: 'sewageManagement/getList',
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
            selectedRows,
            onChange(selectedRowKeys, selectedRows) {
                updateState({
                    selectedRowKeys,
                    selectedRows
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
            dispatch({ type: 'sewageManagement/initNewItem' });
        }else{
            dispatch({ type:'sewageManagement/getDefaultsewageManagement'})
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '排污许可证 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            sewageManagementId: searchParams.sewageManagementId,
            importError, showUploadModal,
            dataType:searchParams.dataFillType,
            regionalCompanySelect,
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
            save(dataStatus) {
                dispatch({
                    type: 'sewageManagement/saveOrUpdate', payload: {
                        btnType: 'add',
                        dataStatus,
                        dataType: searchParams.dataFillType,
                        sewageManagementId: searchParams.sewageManagementId,
                        onSuccess: function () {
                            message.success('填报辛苦了！');
                            updateNewWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                })
            },
            calculateTargetValue(){
                dispatch({
                    type:'sewageManagement/calculateTargetValue',
                    payload:{
                        itemName:'newItem'
                    }
                })
            },
            calculateConsumeTargetValue(){
                dispatch({
                    type: 'sewageManagement/calculateConsumeTargetValue',
                    payload: {
                        itemName: 'newItem'
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
            title: '数据填报 > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps: {
            dataSource,
            ...editItem,
            sewageManagementId: searchParams.sewageManagementId,
            importError, showUploadModal,regionalCompanySelect,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save(dataStatus) {
                dispatch({
                    type: 'sewageManagement/saveOrUpdate', payload: {
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
            },
            calculateTargetValue() {
                dispatch({
                    type: 'sewageManagement/calculateTargetValue',
                    payload: {
                        itemName: 'editItem'
                    }
                })
            },
            // //计算单耗数据
            // calculateConsumeTargetValue() {
            //     dispatch({
            //         type: 'sewageManagement/calculateConsumeTargetValue',
            //         payload: {
            //             itemName: 'editItem'
            //         }
            //     })
            // },
            //在计算单耗数据后提交
            // saveAfterCalculateConsumeValue(dataStatus){
            //     dispatch({
            //         type: 'sewageManagement/calculateConsumeTargetValue',
            //         payload: {
            //             itemName: 'editItem'
            //         }
            //     }).then(()=>{
            //             dispatch({
            //                 type: 'sewageManagement/saveOrUpdate', payload: {
            //                     btnType: 'edit',
            //                     dataStatus,
            //                     dataType: searchParams.dataFillType,
            //                     sewageManagementId: searchParams.sewageManagementId,
            //                     onSuccess: function () {
            //                         message.success('填报辛苦了！');
            //                         updateEditWindow(false);
            //                     },
            //                     onError: function (msg) {
            //                         message.error(msg);
            //                     }
            //                 }
            //             })
            //     })
            // }
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
            title: '数据填报 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            dataSource,
            btnType: 'view',
            updateChartItem(obj){
                updateState({
                    chartItem: {
                        ...obj,
                    }
                })
            },
            getChartData({dateValue, sewageManagementId, libraryId} ){
                dispatch({
                    type:'sewageManagement/getSevenDayData',
                    payload:{
                        dateValue, sewageManagementId, libraryId
                    }
                })
            },
            updateItem(obj) {
                updateState({
                    viewItem: {
                        ...obj,
                    }
                })
            },
            handleAudit(operateType) {
                dispatch({
                    type: 'sewageManagement/handleAudit', payload: {
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
    //--------------折线图弹窗---------------
    const updateChartWindow = (status = true) => {
        updateState({
            chartItem: {
                visible: status
            }
        })
    }
    const chartItemProps = {
        updateWindow: updateChartWindow,
        modalProps: {
            title: '近七天变化',
            visible: chartItem.visible,
            onCancel: () => updateChartWindow(false),
            width:700
        },
        contentProps:{
            ...chartItem,
        }
    }
    //--------------删除------------------
    const deleteItems = () => {
        Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'sewageManagement/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'sewageManagement/getList',
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
    const exportProps = {
        downloadURL: '/cloud/gzzhsw/api/cp/data/fill/exportDataExcel',
        getExportParams(exportType) {
            const param = {
                regionalCompanyId: '',
                waterFactoryId: '',
                tenantId: VtxUtil.getUrlParam('tenantId'),
            };
            switch (exportType) {
                case 'rows':
                    if (selectedRowKeys.length === 0) {
                        message.info('需要选择一项进行导出');
                        return;
                    }
                    param.isAll = false;
                    param.ids = selectedRowKeys.join();
                    break;
                case 'page':
                    if (dataSource.length === 0) {
                        message.info('当前页没有数据');
                        return;
                    }
                    const ids = dataSource.map((item, index) => {
                        return item.id;
                    });
                    param.isAll = false;
                    param.ids = ids.join();
                    break;
                case 'all':
                    if (total === 0) {
                        message.info('暂无数据可进行导出');
                        return;
                    }
                    param.isAll = true;
            }
            return param
        }
    }
    return (
        <div className={styles.normal}>
            <VtxGrid
                titles={['区域', '公司']}
                gridweight={[1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.sewageManagementIdProps}>
                    {sewageManagementSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <Select {...vtxGridParams.sewageManagementIdProps}>
                    {sewageManagementSelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
            </VtxGrid>
            <div className={styles.normal_body}>
                
                <div className={styles.tabContainer}>
                    <Tabs activeKey={searchParams.dataFillType} onChange={(key) => {
                        updateState({
                            searchParams: {
                                dataFillType: key
                            }
                        })
                        getList();
                    }}>
                        <TabPane tab='排污许可证' key='produce' />
                        <TabPane tab='排污量填报' key='assay' />
                    </Tabs>
                </div>
                <div className={styles.buttonContainer}>
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete" disabled={selectedRowKeys.length == 0 || canDelete()} onClick={deleteItems}>删除</Button>}
                    <Button icon='download' onClick={() => { window.open(`/cloud/gzzhsw/api/cp/data/fill/exportExcel?sewageManagementId=${searchParams.sewageManagementId}&dataFillType=${searchParams.dataFillType}&tenantId=${VtxUtil.getUrlParam('tenantId')}`) }}>模版下载</Button>
                    {buttonLimit['EXPORT'] &&<VtxExport2  {...exportProps}>
                        <Button icon="export">导出</Button>
                    </VtxExport2>}
                </div>
                <div className={styles.tableContainer}>
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增*/}
            {newItem.visible && <NewItem {...newItemProps} />}
            {/*编辑*/}
            {editItem.visible && <EditItem {...editItemProps} />}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps} />}
            {/*图表 */}
            {chartItem.visible && <ChartItem {...chartItemProps} />}
        </div>
    )
}

export default connect(
    ({ sewageManagement, accessControlM }) => ({ sewageManagement, accessControlM })
)(SewageManagement);