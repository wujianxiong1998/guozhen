/**
 * 养护计划
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

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import MissionItem from './mission';
import ViewItem from './view';

function MaintainPlay({ dispatch, maintainPlay, accessControlM}) {

    const { queryParams, newItem, missionItem, structureList, userList, maintainType, viewItem, getData,
        equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = maintainPlay;
    let buttonLimit = {};
    if (accessControlM['maintainPlay'.toLowerCase()]) {
        buttonLimit = accessControlM['maintainPlay'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'maintainPlay/updateState',
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
            type : 'maintainPlay/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'maintainPlay/getList'});
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
			dispatch({type : 'maintainPlay/initQueryParams'});
			dispatch({type : 'maintainPlay/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name'],
        ['养护类型', 'typeStr'],
        ['开始时间', 'maintainDateStr'],
        ['养护周期', 'period', {render: (text, record, index) => {
            return <span>{text}天</span>
        }}],
        ['养护部位', 'part'],
        ['养护内容', 'content'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					dispatch({
                        type : 'maintainPlay/getD',
                        payload : {
                            id: rowData.id
                        }
                    }).then(() => {
                        dispatch({
                            type : 'maintainPlay/updateState',
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
            if (buttonLimit['ASSIGNTASK']) {
            btns.push({
                name: <Icon type='tubiaozhizuomoban-'
                    title='任务下达' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'maintainPlay/updateState',
                        payload : {
                            missionItem: {
                                ...rowData,
                                ...missionItem,
                                stoptime: moment(rowData.maintainDateStr).add(rowData.period, 'days').format('YYYY-MM-DD HH:mm:ss'),
                            }
                        }
                    })
                    showMissionWindow();
        		}
            });
        }
        if (buttonLimit['EDIT']) {
            btns.push({
                name: <Icon type='file-edit'
                    title='编辑' />,
                onClick(rowData) {
                    const data = equipmentSelectList.filter(item => item.id === rowData.deviceId);
                    dispatch({
                        type : 'maintainPlay/updateState',
                        payload : {
                            newItem: {
                                ...newItem,
                                ...rowData,
                                deviceName: data[0].name,
                                maintainDate: rowData.maintainDateStr
                            }
                        }
                    });
                    showNewWindow();
                }
            });
        }
            if (buttonLimit['DELETE']) {
        	btns.push({
                name: <Icon type='delete'
                    title='删除' />,
        		onClick(rowData) {
                    dispatch({type:'maintainPlay/delete',payload: {
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
		}, width : '180px'}]
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
            		type: 'maintainPlay/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'maintainPlay/getList',
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
    		type : 'maintainPlay/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'maintainPlay/initParams' });
    	}
    	dispatch({
    		type : 'maintainPlay/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'maintainPlay/clearEquipmentSearchParams'});
        dispatch({type: 'maintainPlay/getEquipmentList'});
        dispatch({
            type : 'maintainPlay/updateNewItem',
            payload : {
                deviceId: '',
                deviceName: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'maintainPlay/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'maintainPlay/getEquipmentList'});
    };
    const newItemProps = {
        updateWindow : updateNewWindow,
        structureList,
        userList,
        maintainType,
        modalPropsItem: {
            title:'养护计划',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'maintainPlay/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'structuresId') {
                    dispatch({type: 'maintainPlay/getEquipmentList'});
                }
            },
            onSave() {
                dispatch({
                    type:'maintainPlay/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'maintainPlay/update'
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
    		type : 'maintainPlay/updateMissionItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateMissionWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'maintainPlay/initParams' });
    	}
    	dispatch({
    		type : 'maintainPlay/updateMissionItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const missionItemProps = {
        updateWindow : updateMissionWindow,
        userList,
        modalPropsItem: {
            title:'养护计划',
            visible: missionItem.visible,
            onCancel:() => updateMissionWindow(false),
            width:500
        },
        contentProps:{
            ...missionItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'maintainPlay/updateMissionItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onPublish() {
                dispatch({
                    type:'maintainPlay/publish'
                }).then(() => updateMissionWindow(false));
            },

        }
    }

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'maintainPlay/updateState',
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
            title:`养护计划 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
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
                dispatch({type:'maintainPlay/delete',payload: {
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
                    {buttonLimit['ADD'] &&  <Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                    {buttonLimit['YEARPLAN'] && <Button icon="calendar" onClick={() => {
                        const Path = window.location.origin + window.location.pathname + '#/yearMaintainPlay';
                        window.open(`${Path}?deviceName=${queryParams.name}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}`);
                    }}>全年计划</Button>}
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
export default connect(({ maintainPlay, accessControlM }) => ({ maintainPlay ,accessControlM}))(MaintainPlay);
