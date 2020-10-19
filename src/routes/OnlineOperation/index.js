/*
    Created by wujianxiong on 10/12/2020
*/

import React from 'react';
import { connect } from 'dva';
import { VtxGrid, VtxDatagrid, VtxExport } from 'vtx-ui';
const { VtxExport2 } = VtxExport;
import { Select, Input, Button, Icon, Tabs, message, Modal } from 'antd';
const TabPane = Tabs.TabPane;
import ViewItem from '../../components/onlineOperation/View';
import EditItem from '../../components/onlineOperation/View';
import NewItem from '../../components/onlineOperation/View';
import { handleColumns } from '../../utils/tools';
import styles from './index.less';
import { update } from 'lodash';
const Option = Select.Option;

function OnlineOperation({ dispatch, onlineOperation,  accessControlM }) {
    
    // onlineOperationM.js传递过来的参数
    const { searchParams, dataSource, currentPage, pageSize, loading, total,
    viewItem, editItem, newItem, selectedRowKeys } = onlineOperation;
    
    // 获取新增删除等权限
    let buttonLimit = {}
    if(accessControlM['waterFactory'.toLowerCase()]) {
        buttonLimit = accessControlM['waterFactory'.toLowerCase()]
    }

    // 更新参数
    const updateState = (obj) => {
        dispatch({ type: 'onlineOperation/updateState', payload: {...obj} })
    }

    // mock columns
    let columns = []
    let overViewcolumns = [
        {
            dataIndex: "a",
            key: "a",
            title: "区域"
        },
        {
            dataIndex: "b",
            key: "b",
            title: "事业部"
        },
        {
            dataIndex: "c",
            key: "c",
            title: "水厂"
        },
        {
            dataIndex: "d",
            key: "d",
            title: "运维模式"
        }
    ]
    // mock columns
    let recordColumns = [
        {
            dataIndex: "a",
            key: "a",
            title: "日期"
        },
        {
            dataIndex: "b",
            key: "b",
            title: "指标（为可选项）"
        },
        {
            dataIndex: "c",
            key: "c",
            title: "起始时间"
        },
        {
            dataIndex: "d",
            key: "d",
            title: "结束时间"
        },
        {
            dataIndex: "e",
            key: "e",
            title: "情况说明"
        },
        {
            dataIndex: "f",
            key: "f",
            title: "标液浓度（mg/L）"
        },
        {
            dataIndex: "g",
            key: "g",
            title: "设备结果（mg/L）"
        },
        {
            dataIndex: "h",
            key: "h",
            title: "人工监测结果（mg/L）"
        },
        {
            dataIndex: "i",
            key: "i",
            title: "备注"
        },
    ]
    const optCol = [['操作', 'action', {
        renderButtons: ()=>{
            let btns = [];
            if(buttonLimit['VIEW']) {
                // 查看
                btns.push({ name: <Icon type='view' title='查看'/>, onClick(rowData) {
                    updateState({
                        viewItem: {
                            ...rowData
                        }
                    })
                    updateViewWindow()
                } })
                // 编辑
                btns.push({ name: <Icon type='file-edit' title='编辑'/>, onClick(rowData) {
                    updateState({
                        editItem: {
                            ...rowData
                        }
                    })
                    updateEditWindow();
                }})
                // 删除
                btns.push({ name: <Icon type='delete' title='删除'/>, onClick(rowData) {
                    dispatch({
                        type: 'onlineOperation/deleteItems',
                        payload: ({
                            ids: [rowData.id],
                            onSuccess: (ids) => {
                                let page = currentPage !=1 && ids.length === (total - (currentPage -1) * pageSize) ? currentPage -1 : currentPage;
                                dispatch({ type: 'onlineOperation/getList', payload: { selectedRowKeys: [], currentPage: page } });
                                message.success('删除成功！')
                            },
                            onError: (msg) => { message.error(msg) }
                        })
                    })
                }})
            }
            return btns
        }, width: '150px'
    }]]
    columns = searchParams.dataFillType === 'produce' ? overViewcolumns : recordColumns
    columns = columns.concat(handleColumns(optCol))
    // 表格数据项配置
    let vtxDatagridProps = {
        columns,
        dataSource,
        indexColumn: true,
        startIndex: (currentPage-1) * pageSize + 1,
        autoFit: true,
        loading,
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            showQuickJumper: true,
            current: currentPage,
            total,
            pageSize,
            showTotal: total => `合计 ${total} 条`
        },
        onChange(pagination, filters, sorter) {
            dispatch({ type: 'onlineOperation', payload: {
                currentPage: pagination.current,
                pageSize: pagination.pageSize
            }})
        }
    }
    // 选择表格行
    vtxDatagridProps = _.assign(vtxDatagridProps, {
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                updateState({ selectedRowKeys })
            }
        }
    })
    // 获取表格数据
    const getList = () => {
        dispatch({ type: 'onlineOperation/updateQueryParams' });
        dispatch({ type: 'onlineOperation/getList' });
    }

    // 查询
    const vtxGridParams = {
        nameProps: {
            value: searchParams.name,
            placeholder: '请输入名称',
            allowClear: true,
            style: {
                width: '100%'
            },
            onChange(value) {
                updateState({
                    searchParams: {
                        name: value
                    }
                })
            },
            onPressEnter() {
                getList()
            },
        },
        query() {
            getList()
        },
        clear() {
            dispatch({ type: 'onlineOperation/initQueryParams'});
            dispatch({ type: 'onlineOperation/getList' });
        }
    }

    // mock下拉数据
    const waterFactoryList = [ {
        "id" : "08ffc34f7b7444249d9a9e3750a34e91",
        "value" : "测试水厂0001",
        "name" : "测试水厂0001",
        "parentId" : "e6a34203250b471c969fba90fccc6c87"
      }, {
        "id" : "c3e5d28d0da94357ad3625af1e58f342",
        "value" : "水厂测试门户1",
        "name" : "水厂测试门户1",
        "parentId" : "e6a34203250b471c969fba90fccc6c87"
      }, {
        "id" : "757bc4e466b745b1adbfc39b887d4038",
        "value" : "水厂5",
        "name" : "水厂5",
        "parentId" : "c95fe0e685a54030970e90e17864ace1"
    }]

    // 模态框名称
    const modalTitle = searchParams.dataFillType==='produce' ? '在线概况' : '在线异常运维记录'

    // 查看窗口
    const updateViewWindow = (status = true) => {
        updateState({
            viewItem: {
                visible: status
            }
        })
    }
    const viewItemProps = {
        modalProps: {
            title: `${modalTitle} > 查看`,
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 1000
        },
        contentProps: {
            ...viewItem,
            btnType: 'view'
        }
    }

    // 编辑窗口
    const updateEditWindow = (status = true) => {
        updateState({
            editItem: {
                visible: status
            }
        })
    }
    const editItemProps = {
        modalProps: {
            title: `${modalTitle} > 编辑`,
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 1000
        },
        contentProps: {
            ...editItem,
            btnType: 'edit'
        }
    }

    // 新增窗口
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                visible: status
            }
        })
        if(!status) {
            dispatch({ type: 'onlineOperation/initNewItem' })
        }
    }
    const newItemProps = {
        modalProps: {
            title: `${modalTitle} > 新增`,
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 1000
        },
        contentProps: {
            ...newItem,
            btnType: 'add'
        }
    }

    // 表格外功能-删除
    const deleteItems = () => {
        Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({ 
                    type: 'onlineOperation/deleteItems',
                    payload: {
                        ids: selectedRowKeys,
                        onSuccess: (ids) => {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ? currentPage - 1 : currentPage;
                            dispatch({
                                type: 'onlineOperation/getList',
                                payload: {
                                    selectedRowKeys: [],
                                    currentPage: page
                                }
                            })
                            message.success('删除成功');
                        },
                        onError: (msg) => { message.error(msg); }
                    } 
                })
            }
        })
    }

    // 表格外功能-导出
    let downloadURL = searchParams.dataFillType==='produce'?'/cloud/gzzhsw/api/cp/basic/pipelineNetPerformance/exportDataExcel':'/cloud/gzzhsw/api/cp/basic/sewageFactory/exportDataExcel'
    const exportProps = {
        downloadURL,
        getExportParams(exportType) {
            const param = {
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
            {/* 条件查询 */}
            <VtxGrid
                titles={['水厂名称', '运维模式']}
                gridweight={[1,1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                <Select {...vtxGridParams.nameProps}>
                    {waterFactoryList.map(item=>{
                        return (
                            <Option key={item.id}>{item.name}</Option>
                        )
                    })}
                </Select>
                <Select {...vtxGridParams.nameProps}>
                    {waterFactoryList.map(item=>{
                        return (
                            <Option key={item.id}>{item.name}</Option>
                        )
                    })}
                </Select>
            </VtxGrid>

            {/* tabs */}
            <div className={styles.normal_body}>
                <div className={styles.tabContainer}>
                    <Tabs activeKey={searchParams.dataFillType} onChange={(key)=>{ 
                        updateState({ searchParams: {dataFillType: key}})  
                        getList()}
                    }>
                        <TabPane tab='在线概况' key='produce'></TabPane>
                        <TabPane tab='在线异常运维记录' key='assay'></TabPane>
                    </Tabs>
                </div>
                
                {/* 功能按钮 */}
                <div className={styles.buttonContainer}>
                    {buttonLimit['ADD']&&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE']&&<Button icon="delete" onClick={deleteItems}>删除</Button>}
                    {buttonLimit['DELETE'] &&<VtxExport2  {...exportProps}><Button icon="export">导出</Button></VtxExport2>}
                </div>

                {/* 表格 */}
                <div className={styles.tableContainer}>
                    <VtxDatagrid {...vtxDatagridProps}></VtxDatagrid>
                </div>
            </div>

            {/* 操作 */}
            {/* 查看 */}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
            {/* 编辑 */}
            {editItem.visible && <EditItem {...editItemProps}/>}
            {/* 新增 */}
            {newItem.visible && <NewItem {...newItemProps}/>}
        </div>
    )
}

export default connect( ({onlineOperation, accessControlM}) => ({onlineOperation, accessControlM}) )(OnlineOperation);