/**
 * 指标配置
 * author : vtx xxy
 * createTime : 2019-05-29 16:11:50
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input, Select,Tabs,Icon } from 'antd';
import _orderBy from 'lodash/orderBy'
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import NewItem from '../../components/targetConfig/Add';
import EditItem from '../../components/targetConfig/Add';
import ViewItem from '../../components/targetConfig/View';

import { handleColumns } from '../../utils/tools';
import styles from './index.less';

import MyTree from '../../components/targetConfig/myTree'

function TargetConfig({ dispatch, targetConfig, accessControlM }) {
    const {
        searchParams,
        businessUnitSelect, regionalCompanySelect, waterFactorySelect, templateSelect,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
        newItem, editItem, viewItem, treeDatas, isToggle
    } = targetConfig;
    let buttonLimit = {};
    if (accessControlM['targetConfig'.toLowerCase()]) {
        buttonLimit = accessControlM['targetConfig'.toLowerCase()];
    }
    const typeCodeName = {
        'JHZB':'计划指标',
        'SCZB':'生产指标',
        'HYZB':'化验指标',
        'DHZB':'单耗指标'
    }
    const updateState = (obj) => {
        dispatch({
            type: 'targetConfig/updateState',
            payload: {
                ...obj
            }
        })
    }
    // 更新表格数据
    const getList = () => {
        dispatch({ type: 'targetConfig/updateQueryParams' });
        dispatch({ type: 'targetConfig/getList' });
    }
    // 查询
    const vtxGridParams = {
        // 名称
        waterFactoryNameProps: {
            value: searchParams.businessName,
            onChange(e) {
                updateState({
                    searchParams: {
                        businessName: e.target.value
                    }
                })
            },
            onPressEnter() {
                getList();
            },
            placeholder: '请输入业务范围',
            maxLength: '32'
        },

        // 事业部
        businessUnitIdProps: {
            value: searchParams.businessUnitId,
            placeholder: "请选择事业部",
            onChange(value) {
                updateState({
                    searchParams: {
                        businessUnitId: value
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

        query() {
            getList();
        },

        clear() {
            dispatch({ type: 'targetConfig/initQueryParams' });
            dispatch({ type: 'targetConfig/getList' });
        }
    };

    // 列表
    const columns = [
        ['水厂名称', 'waterFactoryName'],
        ['区域公司', 'regionalCompanyName'],
        ['事业部', 'businessUnitName'],
        ['业务范围', 'businessName'],
        ['操作', 'action', {
            renderButtons: () => {
                let btns = [];
                // btns.push({
                //     name: '查看',
                //     onClick(rowData) {
                //         updateState({
                //             viewItem: {
                //                 ...rowData
                //             }
                //         })
                //         updateViewWindow();
                //     }
                // })
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        const {libraryInfoList} = rowData;
                        const sortedTargets = _orderBy(libraryInfoList, ['orderIndex'],['asc'])
                        updateState({
                            editItem: {
                                ...rowData,
                                typeCode: searchParams.typeCode,
                                selectedTargets: sortedTargets.map(item => { return { id: item.libraryId, name: item.libraryName, rationalRange: item.rationalRange}}),//已选指标
                                checkedTemplates: [],//勾中的模版多选框
                                checkedTargets: sortedTargets.map(item => item.libraryId),//勾中的指标行
                                targetList: [],
                                targetListLoading: false,
                            }
                        })
                        updateEditWindow();
                    }
                })
            }
                if (buttonLimit['COPY']) {
                btns.push({
                    name: <Icon type = 'fuzhi'
                        title = '复制' />,
                    onClick(rowData) {
                        const { libraryInfoList } = rowData;
                        const sortedTargets = _orderBy(libraryInfoList, ['orderIndex'], ['asc'])
                        updateState({
                            newItem: {
                                ...rowData,
                                id:'',
                                selectedTargets: sortedTargets.map(item => { return { id: item.libraryId, name: item.libraryName, rationalRange: item.rationalRange } }),//已选指标
                                checkedTemplates: [],//勾中的模版多选框
                                checkedTargets: sortedTargets.map(item => item.libraryId),//勾中的指标行
                                targetList: [],
                                targetListLoading: false,
                            }
                        })
                        updateNewWindow();
                    }
                })
            }
                if (buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({
                            type: 'targetConfig/deleteItems', payload: {
                                ids: [rowData.id],
                                onSuccess: function (ids) {
                                    let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                        currentPage - 1 : currentPage;
                                    dispatch({
                                        type: 'targetConfig/getList',
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
                type: 'targetConfig/getList',
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
            }
        }
    })

    //----------------新增------------------
    const updateNewWindow = (status = true) => {
        updateState({
            newItem: {
                typeCode:searchParams.typeCode,
                visible: status
            }
        })
        if (!status) {
            dispatch({ type: 'targetConfig/initNewItem' });
        }
    }
    const newItemProps = {
        updateWindow: updateNewWindow,
        modalProps: {
            title: typeCodeName[searchParams.typeCode]+' > 新增',
            visible: newItem.visible,
            onCancel: () => updateNewWindow(false),
            width: 900
        },
        contentProps: {
            ...newItem,
            waterFactorySelect,
            templateSelect,
            btnType: 'add',
            updateItem(obj) {
                updateState({
                    newItem: {
                        ...obj
                    }
                })
            },
            //根据模版id查询指标列表
            queryTargetsByTemplateId(ids, typeCode){
                dispatch({
                    type: 'targetConfig/queryTargetsByTemplateId', payload: {
                        itemName:'newItem',
                        ids,
                        typeCode
                    }
                })
            },
            save() {
                dispatch({
                    type: 'targetConfig/saveOrUpdate', payload: {
                        btnType: 'add',
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
            title: typeCodeName[searchParams.typeCode] +' > 编辑',
            visible: editItem.visible,
            onCancel: () => updateEditWindow(false),
            width: 900
        },
        contentProps: {
            ...editItem,
            waterFactorySelect,
            templateSelect,
            btnType: 'edit',
            updateItem(obj) {
                updateState({
                    editItem: {
                        ...obj
                    }
                })
            },
            //根据模版id查询指标列表
            queryTargetsByTemplateId(ids, typeCode) {
                dispatch({
                    type: 'targetConfig/queryTargetsByTemplateId', payload: {
                        itemName: 'editItem',
                        ids,
                        typeCode
                    }
                })
            },
            save() {
                dispatch({
                    type: 'targetConfig/saveOrUpdate', payload: {
                        btnType: 'edit',
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
            title: '指标配置 > 查看',
            visible: viewItem.visible,
            onCancel: () => updateViewWindow(false),
            width: 900
        },
        contentProps: {
            ...viewItem,
            btnType: 'view'
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
                    type: 'targetConfig/deleteItems', payload: {
                        ids: selectedRowKeys,
                        onSuccess: function (ids) {
                            let page = currentPage != 1 && ids.length === (total - (currentPage - 1) * pageSize) ?
                                currentPage - 1 : currentPage;
                            dispatch({
                                type: 'targetConfig/getList',
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

    // ------------切换树和表
    const toggleTree = () => {
        updateState({
            isToggle: !isToggle
        })
    }
    return (
        <div className={styles.normal}>
            <div style={{display: 'flex', height: '100%'}}>
                {/* 树 */}
                {!isToggle&&<div className={styles.treeContainer}>
                    <MyTree dataSource={treeDatas} updateState={updateState} getList={getList}/>
                    <div className={styles.swap} style={{right: '-20px'}} onClick={toggleTree}>
                        <Icon type="swap" />
                    </div>
                </div>}

                {/* 表格 */}
                <div style={{width: '82%'}} className={styles.normal}>
                    <VtxGrid titles={['业务范围']} gridweight={[1]}
                            confirm={vtxGridParams.query}
                            clear={vtxGridParams.clear}>
                        <Input {...vtxGridParams.waterFactoryNameProps} />
                    </VtxGrid>
                    <div className={styles.normal_body}>
                
                        <div className={styles.tabContainer}>
                            <Tabs activeKey={searchParams.typeCode == 'JHZB' ? 'JHZB' : 'TBZB'} onChange={(key) => {
                                updateState({
                                    searchParams: {
                                        typeCode: key === 'JHZB' ?'JHZB':'SCZB'
                                    }
                                })
                                getList();
                            }}>
                                <TabPane tab='计划指标' key='JHZB' />
                                <TabPane tab='填报指标' key='TBZB' />
                            </Tabs>
                        </div>
                        {
                            searchParams.typeCode !=='JHZB'?
                                <Tabs activeKey={searchParams.typeCode} onChange={(key) => {
                                    updateState({
                                        searchParams: {
                                            typeCode: key
                                        }
                                    })
                                    getList();
                                }}>
                                    <TabPane tab='生产指标' key='SCZB' />
                                    <TabPane tab='化验指标' key='HYZB' />
                                    <TabPane tab='单耗指标' key='DHZB' />
                                </Tabs>
                            :''
                        }
                    {/*按钮*/}
                        <div className={styles.buttonContainer}>
                            {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => updateNewWindow()}>新增</Button>}
                            {buttonLimit['DELETE'] && <Button icon="delete" disabled={selectedRowKeys.length == 0} onClick={deleteItems}>删除</Button>}
                        </div>
                        <div style={{ height: searchParams.typeCode === 'JHZB' ? "calc(100% - 88px)" : "calc(100% - 138px)"}} className={styles.tableContainer}>
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

                {/* 树 */}
                {isToggle&&<div className={styles.treeContainer}>
                    <MyTree dataSource={treeDatas} updateState={updateState} getList={getList}/>
                    <div className={styles.swap} style={{left: '-20px'}} onClick={toggleTree}>
                        <Icon type="swap" />
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default connect(
    ({ targetConfig, accessControlM }) => ({ targetConfig, accessControlM})
)(TargetConfig);