/**
 * 排污许可证
 * author : vtx xxy
 * createTime : 2019-07-23 11:38:59
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, VtxExport, VtxImport } from 'vtx-ui';
const { VtxMonthPicker, VtxRangePicker } = VtxDate;
const { VtxExport2 } = VtxExport;
import { Modal, Button, message, Select,Tabs,Icon,Input } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane
import moment from 'moment';

import NewItem from '../../components/performanceTable/Add';
import EditItem from '../../components/performanceTable/Add';
import ViewItem from '../../components/performanceTable/View';
import UpdateItem from '../../components/performanceTable/Update';
import styles from './index.less';
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import {VtxUtil} from '../../utils/util'

function PerformanceTable({ dispatch, performanceTable, accessControlM }) {
    const {
        searchParams, isAdministrator,
        performanceTableSelect,queryParams,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, selectedRows,
        updateItem, newItem, editItem, viewItem, title, importError, showUploadModal, chartItem,regionalCompanySelect, waterFactorySelect
    } = performanceTable;
    let buttonLimit = {};
    if (accessControlM['ProductionManageFill'.toLowerCase()]) {
        buttonLimit = accessControlM['ProductionManageFill'.toLowerCase()];
    }
    const updateState = (obj) => {
        dispatch({
            type: 'performanceTable/updateState',
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
        dispatch({ type: 'performanceTable/updateQueryParams' });
        dispatch({ type: 'performanceTable/getList' });
    }

    // 查询
    const vtxGridParams = {
        // 名称
        nameProps: {
            value: searchParams.projectName,
            onChange(e) {
                updateState({
                    searchParams: {
                        projectName: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入项目名称',
            maxLength: '32'
        },

         // 事业部
         waterFactoryIdProps: {
            value: searchParams.waterFactoryId,
            placeholder: "请选择事业部",
            onChange(value) {
                updateState({
                    searchParams: {
                        waterFactoryId: value
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },

        // 区域公司
        regionalCompanyIdProps: {
            value: searchParams.regionalCompanyId,
            placeholder: "请选择区域公司",
            onChange(value) {
                console.log(value)
                updateState({
                    searchParams: {
                        regionalCompanyId: value
                    }
                })
                getList();
            },
            allowClear: true,
            style: {
                width: '100%'
            }
        },
        // 水厂
        performanceTableIdProps: {
            value: searchParams.performanceTableId,
            showSearch: true,
            optionFilterProp: 'children',
            placeholder: "请选择水厂",
            onChange(value) {
                updateState({
                    searchParams: {
                        performanceTableId: value
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
            dispatch({ type: 'performanceTable/initQueryParams' });
            dispatch({ type: 'performanceTable/getList' });
        }
    };
    // 列表
    let opt = [['操作', 'action', {
        renderButtons: (text,record) => {
            let btns = [];
                // 查看
                btns.push({
                    name: <Icon type='view'
                        title='查看' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'performanceTable/getDetail',
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
                            type: 'performanceTable/getDetail',
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
                            type: 'performanceTable/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'performanceTable/getList',
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
    }]]
    // tab1
    let columns = [
        [ '区域', 'regionalCompanyName' ],
        [ '项目名称', 'projectName'],
        [ '雨水管网(公里)', 'rainwaterPipeline' ],
        [ '污水管网(公里)', 'sewagePipeline' ],
        ['中水管网(公里)', 'middleWaterPipeline'],
        ['给水管网(公里)', 'waterSupplyPipeline'],
        ['雨水泵站(座)', 'rainWaterPump'],
        ['污水泵站(座)', 'sewagePump'],
        ['管网(万元/年)', 'pipeNet'],
        ['项目类型', 'projectTypeStr'],
        ['备注', 'remark' ],
    ]
    columns = columns.concat(opt)
    
    // tab2
    let sewageColumns = [
        [ '区域', 'regionalCompanyName' ],
        [ '公司名称', 'waterFactoryName'],
        [ '项目名称(打包项目填写具体子项目明细)', 'projectName' ],
        [ '项目类型1', 'projectTypeOneStr' ],
        [ '项目类型2', 'projectTypeTwoStr'],
        [ '项目类型3(市政/乡(村)镇/自来水/中水/雨水调蓄)', 'projectTypeThreeStr'],
        [ '设计规模(万吨/日)', 'designScale'],
        [ '保底水量(万吨/日)', 'bottomWater'],
        [ '目前单价', 'price'],
        [ '合同开始日期', 'contractStartTime'],
        [ '合同终止日期', 'contractEndTime' ],
        [ '运营年限', 'operationYear' ],
        [ '投入商业运营时间', 'operationTime' ],
        [ '收费模式', 'chargingModel' ],
        [ '出水指标', 'waterTarget' ],
        [ '设计工艺', 'designProcess' ],
        [ '所在地', 'address' ],
    ]
    sewageColumns = sewageColumns.concat(opt)

    // tab3
    let performanceColumns = [
        {
            title: '区域',
            dataIndex: 'regionalCompanyName',
            key: 'regionalCompanyName',
        },
        {
            title: '传统市政水运营',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'szAllScale',
                            key: 'szAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'szAllNum',
                            key: 'szAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'szRunScale',
                            key: 'szRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'szRunNum',
                            key: 'szRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '乡(村)镇污水运营',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'xzAllScale',
                            key: 'xzAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'xzAllNum',
                            key: 'xzAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'xzRunScale',
                            key: 'xzRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'xzRunNum',
                            key: 'xzRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '自来水运营',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'zlsAllScale',
                            key: 'zlsAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'zlsAllNum',
                            key: 'zlsAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'zlsRunScale',
                            key: 'zlsRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'zlsRunNum',
                            key: 'zlsRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '雨水调蓄',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'ysAllScale',
                            key: 'ysAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'ysAllNum',
                            key: 'ysAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'ysRunScale',
                            key: 'ysRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'ysRunNum',
                            key: 'ysRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '中水',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'zsAllScale',
                            key: 'zsAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'zsAllNum',
                            key: 'zsAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'zsRunScale',
                            key: 'zsRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'zsRunNum',
                            key: 'zsRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '合计',
            children: [
                {
                    title: '所有项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'hjAllScale',
                            key: 'hjAllScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'hjAllNum',
                            key: 'hjAllNum',
                        }
                    ]
                },
                {
                    title: '运行项目',
                    children: [
                        {
                            title: '规模',
                            dataIndex: 'hjRunScale',
                            key: 'hjRunScale',
                        },
                        {
                            title: '数量',
                            dataIndex: 'hjRunNum',
                            key: 'hjRunNum',
                        }
                    ]
                }
            ]
        },
        {
            title: '管网运营',
            children: [
                {
                    title: '雨水长度(公里)',
                    dataIndex: 'ysLength',
                    key: 'ysLength',
                }
            ]
        },
        {
            title: '管网运营',
            children: [
                {
                    title: '污水长度(公里)',
                    dataIndex: 'wsLength',
                    key: 'wsLength',
                }
            ]
        },
        {
            title: '管网运营',
            children: [
                {
                    title: '总长度(公里)',
                    dataIndex: 'totalLength',
                    key: 'totalLength',
                }
            ]
        },
    ]

    let columnsData
    switch (searchParams.dataFillType) {
        case 'produce':
            columnsData = handleColumns(columns);
            break;
        case 'assay':
            columnsData = handleColumns(sewageColumns);
            break;
        case 'third':
            columnsData = performanceColumns;
            break;
    }

    let vtxDatagridProps = {
        bordered:true,
        columns: columnsData,
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
                type: 'performanceTable/getList',
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
    let modalTitle
    let vtxGridTitle
    let vtxGridWeight
    let vtxGridSearch
    switch (searchParams.dataFillType) {
        case 'produce':
            modalTitle = '管网业绩表';
            vtxGridTitle = ['区域', '项目名称']
            vtxGridWeight = [1,1]
            vtxGridSearch = <VtxGrid
                                titles={vtxGridTitle}
                                gridweight={vtxGridWeight}
                                confirm={vtxGridParams.query}
                                clear={vtxGridParams.clear}
                            >
                                <Select {...vtxGridParams.regionalCompanyIdProps}>
                                    {regionalCompanySelect.map(item => {
                                        return <Select.Option key={item.id}>{item.name}</Select.Option>
                                    })}
                                </Select>
                                <Input {...vtxGridParams.nameProps} />
                            </VtxGrid>
            break;
        case 'assay':
            modalTitle = '污水厂汇总表';
            vtxGridTitle = ['区域', '公司名称', '项目名称', '投入商业运营时间']
            vtxGridWeight = [1,1,1,1]
            vtxGridSearch = <VtxGrid
                                titles={vtxGridTitle}
                                gridweight={vtxGridWeight}
                                confirm={vtxGridParams.query}
                                clear={vtxGridParams.clear}
                            >
                                <Select {...vtxGridParams.regionalCompanyIdProps}>
                                    {regionalCompanySelect.map(item => {
                                        return <Select.Option key={item.id}>{item.name}</Select.Option>
                                    })}
                                </Select>
                                <Select {...vtxGridParams.waterFactoryIdProps}>
                                    {waterFactorySelect.map(i => {
                                        return <Select.Option key={i.id}>{i.name}</Select.Option>
                                    })}
                                </Select>
                                <Input {...vtxGridParams.nameProps} />
                                <VtxRangePicker {...vtxGridParams.startDateProps}/>
                            </VtxGrid>
            break;
        case 'third':
            vtxGridTitle = ['区域']
            vtxGridWeight = [1]
            vtxGridSearch = <VtxGrid
                                titles={vtxGridTitle}
                                gridweight={vtxGridWeight}
                                confirm={vtxGridParams.query}
                                clear={vtxGridParams.clear}
                            >
                                <Select {...vtxGridParams.regionalCompanyIdProps}>
                                    {regionalCompanySelect.map(item => {
                                        return <Select.Option key={item.id}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </VtxGrid>
            break;
    }

    //----------------新增------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'performanceTable/initNewItem' });
        }else{
            dispatch({ type:'performanceTable/getDefaultperformanceTable'})
        }
    }
    //----------------上传------------------
    const updateFile = (status = true) => {
        updateState({
            updateItem: {
                visible: status
            }
        })
        // if (!status) {
        //     dispatch({ type: 'performanceTable/initUpdateItem' });
        // }
    }
    const updateItemProps = {
        updateWindow: updateFile,
        modalProps: {
            title: `${modalTitle} > 上传`,
            visible: updateItem.visible,
            onCancel: () => updateFileWindow(false),
            width: 900,
            minHeight: 500
        },
        contentProps: {
            ...updateItem,
            dataType:searchParams.dataFillType,
            btnType: 'update',
            updateItem(obj) {
                updateState({
                    updateItem: {
                        ...obj
                    }
                })
            },
            save(dataStatus) {
                dispatch({
                    type: 'performanceTable/updateFile', payload: {
                        btnType: 'update',
                        dataType: searchParams.dataFillType,
                        onSuccess: function () {
                            message.success('上传成功');
                            updateEditWindow(false);
                        },
                        onError: function () {
                            message.error('上传失败');
                        }
                    }
                })
            }
        }
    };

    
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: `${modalTitle} > 新增`,
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            performanceTableId: searchParams.performanceTableId,
            importError, showUploadModal,
            dataType:searchParams.dataFillType,
            regionalCompanySelect,waterFactorySelect,
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
                    type: 'performanceTable/saveOrUpdate', payload: {
                        btnType: 'add',
                        dataStatus,
                        dataType: searchParams.dataFillType,
                        performanceTableId: searchParams.performanceTableId,
                        onSuccess: function () {
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
                    type:'performanceTable/calculateTargetValue',
                    payload:{
                        itemName:'newItem'
                    }
                })
            },
            calculateConsumeTargetValue(){
                dispatch({
                    type: 'performanceTable/calculateConsumeTargetValue',
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
            title: `${modalTitle} > 编辑`,
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps: {
            dataSource,
            ...editItem,
            dataType:searchParams.dataFillType,
            performanceTableId: searchParams.performanceTableId,
            importError, showUploadModal,regionalCompanySelect,waterFactorySelect,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            save(dataStatus) {
                console.log('保存')
                dispatch({
                    type: 'performanceTable/saveOrUpdate', payload: {
                        btnType: 'edit',
                        dataType: searchParams.dataFillType,
                        onSuccess: function () {
                            message.success('编辑成功');
                            updateEditWindow(false);
                        },
                        onError: function () {
                            message.error('编辑失败');
                        }
                    }
                })
            },
            calculateTargetValue() {
                dispatch({
                    type: 'performanceTable/calculateTargetValue',
                    payload: {
                        itemName: 'editItem'
                    }
                })
            },
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
    //--------------上传-----------------
    const updateFileWindow = (status = true) => {
        updateState({
            updateItem: {
                visible: status
            }
        })
    }
    const viewItemProps = {
        updateWindow: updateViewWindow,
        modalProps: {
            title: `${modalTitle} > 查看`,
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            dataSource,
            dataType:searchParams.dataFillType,
            btnType: 'view',
            updateChartItem(obj){
                updateState({
                    chartItem: {
                        ...obj,
                    }
                })
            },
            getChartData({dateValue, performanceTableId, libraryId} ){
                dispatch({
                    type:'performanceTable/getSevenDayData',
                    payload:{
                        dateValue, performanceTableId, libraryId
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
                    type: 'performanceTable/handleAudit', payload: {
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
                    type: 'performanceTable/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'performanceTable/getList',
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
    let downloadURL = searchParams.dataFillType==='produce'?'/cloud/gzzhsw/api/cp/basic/pipelineNetPerformance/exportDataExcel':'/cloud/gzzhsw/api/cp/basic/sewageFactory/exportDataExcel'
    const exportProps = {
        downloadURL,
        getExportParams(exportType) {
            const param = {
                regionalCompanyId: '',
                projectName: '',
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
    const fileId = searchParams.dataFillType==='produce'?'8390383f8ce8427eb47cb56e2676aee6':'786d67b64594424f89344513e9727e74'
    
    return (
        <div className={styles.normal}>
            {vtxGridSearch}
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
                        <TabPane tab='管网业绩表' key='produce' />
                        <TabPane tab='污水厂汇总表' key='assay' />
                        <TabPane tab='业绩汇总表' key='third' />
                    </Tabs>
                </div>
                <div className={styles.buttonContainer}>
                    {buttonLimit['ADD']&&searchParams.dataFillType!=='third'&&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE']&&searchParams.dataFillType!=='third'&&<Button icon="delete" onClick={deleteItems}>删除</Button>}
                    <Button icon='download' onClick={() => { window.open(`http://103.14.132.101:9391/cloudFile/common/downloadFile?id=${fileId}`) }}>模版下载</Button>
                    {searchParams.dataFillType!=='third'&&buttonLimit['EXPORT']&&<Button icon="upload" onClick={() => updateFile()}>上传</Button>}
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
            {/*上传 */}
            {updateItem.visible && <UpdateItem {...updateItemProps} />}
        </div>
    )
}

export default connect(
    ({ performanceTable, accessControlM }) => ({ performanceTable, accessControlM })
)(PerformanceTable);