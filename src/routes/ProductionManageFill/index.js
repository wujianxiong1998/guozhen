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

import NewItem from '../../components/productionManageFill/Add';
import EditItem from '../../components/productionManageFill/Add';
import ViewItem from '../../components/productionManageFill/View';
import ChartItem from '../../components/productionManageFill/Chart';
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import {VtxUtil} from '../../utils/util'

function ProductionManageFill({ dispatch, productionManageFill, accessControlM }) {
    const {
        searchParams, isAdministrator,
        waterFactorySelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, selectedRows,
        newItem, editItem, viewItem, title, importError, showUploadModal, chartItem
    } = productionManageFill;
    let buttonLimit = {};
    if (accessControlM['productionManageFill'.toLowerCase()]) {
        buttonLimit = accessControlM['productionManageFill'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'productionManageFill/updateState',
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
        dispatch({ type: 'productionManageFill/updateQueryParams' });
        dispatch({ type: 'productionManageFill/getList' });
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
                        startTime: moment(dateString).startOf('month').format('YYYY-MM-DD'),
                        endTime: (moment(dateString).month() == moment().month() && moment(dateString).year() == moment().year()) ? moment().format('YYYY-MM-DD'):moment(dateString).endOf('month').format('YYYY-MM-DD')
                    }
                })
                getList();
            },
            style: {
                width: '100%'
            },
            disabledDate(current) {
                return VtxTimeUtil.isAfterDate(current);
            }
        },

        // 起止时间
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

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'productionManageFill/initQueryParams' });
            dispatch({ type: 'productionManageFill/getList' });
        }
    };
    // 列表
    let columns = []
    title.map(item => { columns.push([item.value, item.key, { width: '200px' }]) });
    columns = columns.concat([['操作', 'action', {
        renderButtons: (text,record) => {
            let btns = [];
            const dataStatus = record['statusValue']
            if (buttonLimit['EDIT']&&(dataStatus === '新建' || (isAdministrator && (dataStatus === '待审核' || dataStatus === '通过')))) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'productionManageFill/getDetail',
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
                })
            }
             if (dataStatus === '待审核' && buttonLimit['AUDIT']) {
                btns.push({
                    name: <Icon type='examine'
                        title='审核' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'productionManageFill/getDetail',
                            payload: {
                                id: rowData.id,
                                dateValue: rowData.dateValue,
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
            if (dataStatus === '待修改'&&buttonLimit['SUBMIT']) {
                btns.push({
                    name: <Icon type='zhongxintijiao'
                        title='重新提交' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'productionManageFill/getDetail',
                            payload: {
                                id: rowData.id,
                                dateValue: rowData.dateValue,
                                itemName: 'editItem'
                            }
                        })
                        updateState({
                            editItem: {
                                editType: 'submitAgain',
                                ...rowData
                            }
                        })
                        updateEditWindow();
                    }
                })
            }
            if (dataStatus === '通过' &&buttonLimit['VIEW']){
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'productionManageFill/getDetail',
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
            }
            if (buttonLimit['DELETE'] && (dataStatus === '新建' || (isAdministrator && (dataStatus === '待审核' || dataStatus === '待修改' || dataStatus === '通过')))){
            btns.push({
                name: <Icon type='delete'
                        title='删除' />,
                onClick(rowData) {
                    dispatch({
                        type: 'productionManageFill/deleteItems', payload: {
                            ids: [rowData.id],
                            onSuccess: function (ids) {
                                let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                    currentPage - 1 : currentPage;
                                dispatch({
                                    type: 'productionManageFill/getList',
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
                type: 'productionManageFill/getList',
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
            dispatch({ type: 'productionManageFill/initNewItem' });
        }else{
            dispatch({ type:'productionManageFill/getDefaultProductionManageFill'})
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: '数据填报 > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            waterFactoryId: searchParams.waterFactoryId,
            importError, showUploadModal,
            dataType:searchParams.dataFillType,
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
                    type: 'productionManageFill/saveOrUpdate', payload: {
                        btnType: 'add',
                        dataStatus,
                        dataType: searchParams.dataFillType,
                        waterFactoryId: searchParams.waterFactoryId,
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
                    type:'productionManageFill/calculateTargetValue',
                    payload:{
                        itemName:'newItem'
                    }
                })
            },
            calculateConsumeTargetValue(){
                dispatch({
                    type: 'productionManageFill/calculateConsumeTargetValue',
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
            save(dataStatus) {
                dispatch({
                    type: 'productionManageFill/saveOrUpdate', payload: {
                        btnType: 'edit',
                        dataStatus,
                        dataType: searchParams.dataFillType,
                        waterFactoryId: searchParams.waterFactoryId,
                        onSuccess: function () {
                            message.success('填报辛苦了！');
                            updateEditWindow(false);
                        },
                        onError: function (msg) {
                            message.error(msg);
                        }
                    }
                })
            },
            calculateTargetValue() {
                dispatch({
                    type: 'productionManageFill/calculateTargetValue',
                    payload: {
                        itemName: 'editItem'
                    }
                })
            },
            //计算单耗数据
            calculateConsumeTargetValue() {
                dispatch({
                    type: 'productionManageFill/calculateConsumeTargetValue',
                    payload: {
                        itemName: 'editItem'
                    }
                })
            },
            //在计算单耗数据后提交
            saveAfterCalculateConsumeValue(dataStatus){
                dispatch({
                    type: 'productionManageFill/calculateConsumeTargetValue',
                    payload: {
                        itemName: 'editItem'
                    }
                }).then(()=>{
                        dispatch({
                            type: 'productionManageFill/saveOrUpdate', payload: {
                                btnType: 'edit',
                                dataStatus,
                                dataType: searchParams.dataFillType,
                                waterFactoryId: searchParams.waterFactoryId,
                                onSuccess: function () {
                                    message.success('填报辛苦了！');
                                    updateEditWindow(false);
                                },
                                onError: function (msg) {
                                    message.error(msg);
                                }
                            }
                        })
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
            title: viewItem['状态'] === '通过' ? '数据填报 > 查看':'数据填报 > 审核',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'audit',
            updateChartItem(obj){
                updateState({
                    chartItem: {
                        ...obj,
                    }
                })
            },
            getChartData({dateValue, waterFactoryId, libraryId} ){
                dispatch({
                    type:'productionManageFill/getSevenDayData',
                    payload:{
                        dateValue, waterFactoryId, libraryId
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
                    type: 'productionManageFill/handleAudit', payload: {
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
                    type: 'productionManageFill/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'productionManageFill/getList',
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
                waterFactoryId: searchParams.waterFactoryId,
                startTime: searchParams.startTime,
                endTime: searchParams.endTime,
                dataFillType: searchParams.dataFillType,
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
                titles={['水厂', '时间快速选择', '起止时间']}
                gridweight={[1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.waterFactoryIdProps}>
                    {waterFactorySelect.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                    })}
                </Select>
                <VtxMonthPicker {...vtxGridParams.quickDateProps} />
                <VtxRangePicker {...vtxGridParams.startDateProps} />
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
                        <TabPane tab='生产数据' key='produce' />
                        <TabPane tab='化验数据' key='assay' />
                        <TabPane tab='单耗数据' key='consum' />
                    </Tabs>
                </div>
                <div className={styles.buttonContainer}>
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>数据填报</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete" disabled={selectedRowKeys.length == 0 || canDelete()} onClick={deleteItems}>删除</Button>}
                    <Button icon='download' onClick={() => { window.open(`/cloud/gzzhsw/api/cp/data/fill/exportExcel?waterFactoryId=${searchParams.waterFactoryId}&dataFillType=${searchParams.dataFillType}&tenantId=${VtxUtil.getUrlParam('tenantId')}`) }}>上传模版下载</Button>
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
    ({ productionManageFill, accessControlM }) => ({ productionManageFill, accessControlM })
)(ProductionManageFill);