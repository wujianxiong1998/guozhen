/**
 * 养护任务
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon } from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import MissionItem from './mission';
import ViewItem from './view';

function MaintainTask({ dispatch, maintainTask, accessControlM }) {

    const { queryParams, newItem, missionItem, userList, detail, viewItem, getData,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding, fileListVersion,
    } = maintainTask;
     let buttonLimit = {};
    if (accessControlM['maintainTask'.toLowerCase()]) {
        buttonLimit = accessControlM['maintainTask'.toLowerCase()];
    }
    
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'maintainTask/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };

    const updateState = (obj) => {
        dispatch({
            type : 'maintainTask/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'maintainTask/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 设备编号
        numProps: {
			value: queryParams.code,
            onChange(e) {
				ParamsUpdateState({code : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        // 设备名称
        nameProps: {
			value: queryParams.name,
            onChange(e) {
				ParamsUpdateState({name : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        // 起始日期
        timeProps : {
			value : [queryParams.startDay, queryParams.endDay],
			onChange(date, dateString) {
				ParamsUpdateState({
					startDay : dateString[0],
					endDay : dateString[1]
				})
				getList();
			},
			showTime : false,
			style : {
				width : '100%'
			},
			disabledDate(current) {
				return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
			}
        },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'maintainTask/initQueryParams'});
			dispatch({type : 'maintainTask/getList'});
		}
    };

    const defaultMissionItem = {
        id: '',
        accRepareManId: '',  // 保养执行人id
        accRepareMan: '',  // 保养执行人
        completeTime : '',  // 养护时间
        picIds: [],  // 附件
    };

    // 列表
	const columns = [
        ['工单编号', 'code'],
        ['设备编号', 'deviceCode'],
        ['设备名称', 'deviceName'],
        ['养护类型', 'typeStr'],
        ['养护人', 'repareMan'],
        ['养护期限', 'maintainPeriodStr'],
        ['养护内容', 'content'],
        ['工单状态', 'maintainStatusStr'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					dispatch({
                        type : 'maintainTask/getD',
                        payload : {
                            id: rowData.id
                        }
                    }).then(() => {
                        dispatch({
                            type : 'maintainTask/updateState',
                            payload : {
                                viewItem: {
                                    ...rowData,
                                    visible: true,
                                }
                            }
                        })
                    });
        		}
            });
        }
            if (record.maintainStatus === 'waitYh' && buttonLimit['UPLOADMISSION']) {
                btns.push({
                    name: <Icon type='upload'
                        title='回单' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'maintainTask/updateState',
                            payload : {
                                missionItem: {
                                    ...missionItem,
                                    ...rowData,
                                    picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
                                    id: rowData.id,
                                    accRepareManId: rowData.actRepareManId,
                                    accRepareMan: rowData.actRepareMan,
                                    completeTime: rowData.completeTimeStr,
                                }
                            }
                        })
                        showMissionWindow();
                    }
                });
            }
            if (record.maintainStatus === 'waitAudit' && buttonLimit['AUDIT']) {
                btns.push({
                    name: <Icon type='examine'
                        title='审核' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'maintainTask/getDetail',
                            payload: {
                                id: rowData.id,
                            }
                        }).then(() => {
                            dispatch({
                                type : 'maintainTask/updateState',
                                payload : {
                                    newItem: {
                                        ...rowData,
                                        ...newItem,
                                        id: rowData.id,
                                        picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
                                    }
                                }
                            });
                            showNewWindow();
                        });
                    }
                });
            }
            if (record.maintainStatus === 'waitYh' && buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({type:'maintainTask/delete',payload: {
                            ids: rowData.id,
                            onSuccess: function(){
                                updateState({
                                    selectedRowKeys : []
                                })
                                message.success('删除成功');
                            },
                            onError: function(msg){
                                message.error(msg);
                            }
                        }})
                    }
                });
            }
        	
        	return btns;
		}, width : '120px'}]
	];
	let vtxDatagridProps = {
		columns : handleColumns(columns),
    	dataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                const allowDelIds = selectedRows.map(item => {
                    if (item.maintainStatus === 'waitYh') {
                        return item.id
                    }
                }).filter(item => !!item);
                if (allowDelIds.length < selectedRowKeys.length) {
                    message.info('非待处理状态数据不能删除')
                }
            	dispatch({
            		type: 'maintainTask/updateState',
            		payload: {
                		selectedRowKeys: allowDelIds,
            		}
        		})
            },
            getCheckboxProps: (record) => {
                if (record.maintainStatus !== 'waitYh') {
                    return {
                        disabled: true
                    }
                } else {
                    return {
                        disabled: false
                    }
                }
            },
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'maintainTask/getList',
            	payload : {
            		currentPage : pagination.current,
                	pageSize: pagination.pageSize
            	}
            }).then((status) => {
            	if(status) {
            		updateState({
		        		currentPage : pagination.current,
		                pageSize: pagination.pageSize
		        	})
            	}
            });
        },
        
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:currentPage,  //后端分页数据配置参数1
            total:total, //后端分页数据配置参数2
            pageSize, //后端分页数据配置参数3
            showTotal: total => `合计 ${total} 条`
        },
    };

    //----------------审批------------------
	const showNewWindow = () => {
		dispatch({
    		type : 'maintainTask/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'maintainTask/initParams' });
    	}
    	dispatch({
    		type : 'maintainTask/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        fileListVersion,
        detail,
        modalPropsItem: {
            title:'养护任务',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'maintainTask/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onAduit(e) {
                dispatch({
                    type:'maintainTask/aduit',
                    payload: {
                        auditStatus: e
                    }
                }).then(() => updateNewWindow(false));
            },

        }
    }

    //----------------回单------------------
	const showMissionWindow = () => {
		dispatch({
    		type : 'maintainTask/updateMissionItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateMissionWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'maintainTask/initParams' });
    	}
    	dispatch({
    		type : 'maintainTask/updateMissionItem',
    		payload : {
                visible : status,
                picIds: []
    		}
    	})
    }
    const missionItemProps = {
        updateWindow : updateMissionWindow,
        fileListVersion,
        userList,
        modalPropsItem: {
            title:'养护任务',
            visible: missionItem.visible,
            onCancel:() => updateMissionWindow(false),
            width:500
        },
        contentProps:{
            ...missionItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'maintainTask/updateMissionItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave(e) {
                dispatch({
                    type:'maintainTask/publish',
                    payload: {
                        dataStatus: e
                    }
                }).then(() => updateMissionWindow(false));
            },

        }
    }

    //--------------删除------------------
    const deleteItems = () => {
    	Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({type:'maintainTask/delete',payload: {
                    ids: selectedRowKeys.join(','),
                    onSuccess: function(){
                    	updateState({
                    		selectedRowKeys : []
                    	})
                        message.success('删除成功');
                    },
                    onError: function(msg){
                        message.error(msg);
                    }
                }});
            }
        });
    }

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'maintainTask/updateState',
            payload : {
                viewItem: {
                    ...viewItem,
                    visible : status
                }
            }
        })
    }
    const viewItemProps = {
		updateWindow : updateViewWindow,
        getData,
        fileListVersion,
        modalPropsItem:{
            title:`养护任务 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            width:800
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
	}

    return (
        <div className="main_page">
            <VtxGrid
                titles={['设备编号', '设备名称', '起始日期']}
                gridweight={[1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*设备编号*/}
                <Input {...vtxGridParams.numProps}/>
                {/*设备名称*/}
                <Input {...vtxGridParams.nameProps}/>
                {/*起始日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['DELETE'] &&<Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content">
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*任务下达*/}
            {missionItem.visible && <MissionItem {...missionItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ maintainTask, accessControlM }) => ({ maintainTask, accessControlM}))(MaintainTask);
