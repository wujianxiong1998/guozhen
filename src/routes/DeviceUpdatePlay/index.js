/**
 * 更新计划
 * author : vtx sjb
 * createTime : 2019-7-05
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal ,Icon} from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';
import MissionItem from './mission';

function DeviceUpdatePlay({ dispatch, deviceUpdatePlay, accessControlM }) {

    const { queryParams, newItem, structureList, viewItem, getData, missionItem, userList, statusSel,
        equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding, isShow
    } = deviceUpdatePlay;
    let buttonLimit = {};
    if (accessControlM['deviceUpdatePlay'.toLowerCase()]) {
        buttonLimit = accessControlM['deviceUpdatePlay'.toLowerCase()];
    }
    
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'deviceUpdatePlay/updateState',
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
            type : 'deviceUpdatePlay/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'deviceUpdatePlay/updateState', payload: { currentPage: 1, pageSize: 10 }});
		dispatch({type : 'deviceUpdatePlay/getList'});
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
			// disabledDate(current) {
			// 	return current && moment(moment(current).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'));
			// }
        },
        // 状态
        statusProps: {
			value : queryParams.dataStatus,
			onChange(value) {
				ParamsUpdateState({
					dataStatus : value,
				});
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'deviceUpdatePlay/initQueryParams'});
			dispatch({type : 'deviceUpdatePlay/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name'],
        ['计划执行日期', 'planDateStr'],
        ['费用预算', 'planMoney'],
        ['负责人', 'chargeManName'],
        ['原因', 'reason'],
        ['具体事项', 'specificThing'],
        ['状态', 'dataStatusStr'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					// dispatch({
                    //     type : 'deviceUpdatePlay/getD',
                    //     payload : {
                    //         id: rowData.id
                    //     }
                    // }).then(() => {
                        dispatch({
                            type : 'deviceUpdatePlay/updateState',
                            payload : {
                                viewItem: {
                                    ...rowData,
                                    visible: true,
                                }
                            }
                        })
                    // });
        		}
            });
        }
            if (record.dataStatus !== 'hasPublish') {
                if (buttonLimit['ASSIGN']) {
                btns.push({
                    name: <Icon type='tubiaozhizuomoban-'
                        title='任务下达' />,
                    onClick(rowData) {
                        // dispatch({
                        //     type : 'deviceUpdatePlay/updateState',
                        //     payload : {
                        //         missionItem: {
                        //             ...rowData,
                        //             ...missionItem,
                        //         }
                        //     }
                        // })
                        // showMissionWindow();
                        Modal.confirm({
                            content: `确定派发这条数据吗？`,
                            okText: '确定',
                            cancelText: '取消',
                            onOk() {
                                dispatch({type:'deviceUpdatePlay/publish',payload: {
                                    id: rowData.id,
                                    repareManId: rowData.repareMan,
                                    repareMan: rowData.chargeManName,
                                    onSuccess: function(){
                                        message.success('派发成功');
                                    },
                                    onError: function(msg){
                                        message.error(msg);
                                    }
                                }});
                            }
                        });
                    }
                });
            }
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'deviceUpdatePlay/updateState',
                            payload : {
                                newItem: {
                                    ...newItem,
                                    ...rowData,
                                    // structuresId: rowData.structuresId || '全部'
                                    // fileIds: rowData.fileIds?JSON.parse(rowData.fileIds):[],
                                    // inspectionTime: rowData.inspectionTimeStr
                                }
                            }
                        });
                        showNewWindow();
                    }
                });
            }
                if (buttonLimit['DELETE']) {
                if (isShow) {
                    btns.push({
                        name: <Icon type='delete'
                            title='删除' />,
                        onClick(rowData) {
                            dispatch({type:'deviceUpdatePlay/delete',payload: {
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
            }
                if (buttonLimit['CANCEL']) {
                btns.push({
                    name: <Icon type="rollback" title='撤销' />,
                    onClick(rowData) {
                        Modal.confirm({
                            content: `确定撤销吗？`,
                            okText: '确定',
                            cancelText: '取消',
                            onOk() {
                                dispatch({type:'deviceUpdatePlay/ignore',payload: {
                                    id: rowData.id,
                                    onSuccess: function(){
                                        message.success('撤销成功');
                                    },
                                    onError: function(msg){
                                        message.error(msg);
                                    }
                                }});
                            }
                        });
                    }
                });
            }
            }
        	return btns;
		}, width : '220px'}]
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
            onChange(selectedRowKeys) {
            	dispatch({
            		type: 'deviceUpdatePlay/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            },
            getCheckboxProps: (record) => {
                if (record.dataStatus === 'hasPublish') {
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
            	type:'deviceUpdatePlay/getList',
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

    //----------------新增&&编辑------------------
	const showNewWindow = () => {
		dispatch({
    		type : 'deviceUpdatePlay/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'deviceUpdatePlay/initParams' });
    	}
    	dispatch({
    		type : 'deviceUpdatePlay/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'deviceUpdatePlay/clearEquipmentSearchParams'});
        dispatch({type: 'deviceUpdatePlay/getEquipmentList'});
        dispatch({
            type : 'deviceUpdatePlay/updateNewItem',
            payload : {
                deviceId: '',
                name: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'deviceUpdatePlay/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'deviceUpdatePlay/getEquipmentList'});
    };
    const newItemProps = {
        updateWindow : updateNewWindow,
        structureList,
        userList,
        modalPropsItem: {
            title:'更新计划',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceUpdatePlay/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'structuresId') {
                    dispatch({type: 'deviceUpdatePlay/getEquipmentList'});
                }
            },
            onSave() {
                dispatch({
                    type:'deviceUpdatePlay/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'deviceUpdatePlay/update'
                }).then(() => updateNewWindow(false));
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,
    }

    //----------------任务下达------------------
	const showMissionWindow = () => {
		dispatch({
    		type : 'deviceUpdatePlay/updateMissionItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateMissionWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'deviceUpdatePlay/initParams' });
    	}
    	dispatch({
    		type : 'deviceUpdatePlay/updateMissionItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const missionItemProps = {
        updateWindow : updateMissionWindow,
        userList,
        modalPropsItem: {
            title:'更新计划',
            visible: missionItem.visible,
            onCancel:() => updateMissionWindow(false),
            width:500
        },
        contentProps:{
            ...missionItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceUpdatePlay/updateMissionItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onPublish() {
                dispatch({
                    type:'deviceUpdatePlay/publish'
                }).then(() => updateMissionWindow(false));
            },

        }
    }

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'deviceUpdatePlay/updateState',
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
        modalPropsItem:{
            title:`更新计划 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            onJump: () => {
                // 兼容IE9
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                }
                const Path = window.location.origin + window.location.pathname + '#/overHaulDesign';
                const userId = VtxUtil.getUrlParam('userId');
                const tenantId = VtxUtil.getUrlParam('tenantId');
                window.open(`${Path}?&userId=${userId}&tenantId=${tenantId}`);
            },
            width:800
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
	}

    //--------------删除------------------
    const deleteItems = () => {
    	Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({type:'deviceUpdatePlay/delete',payload: {
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

    return (
        <div className="main_page">
            <VtxGrid
                titles={['设备编号', '设备名称', '起始时间', '状态']}
                gridweight={[1, 1, 2, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*设备编号*/}
                <Input {...vtxGridParams.numProps}/>
                {/*设备名称*/}
                <Input {...vtxGridParams.nameProps}/>
                {/*起始日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
                {/*状态*/}
                <Select {...vtxGridParams.statusProps}>
					{
						statusSel.map(item => {
							return <Option key={item.value}>{item.text}</Option>
						})
					}
				</Select>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>}
                    {isShow && buttonLimit['DELETE']&& <Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content" >
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
export default connect(({ deviceUpdatePlay, accessControlM }) => ({ deviceUpdatePlay, accessControlM }))(DeviceUpdatePlay);
