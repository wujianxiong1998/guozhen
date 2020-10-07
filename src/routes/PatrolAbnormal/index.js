/**
 * 巡检异常
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
import HandleItem from './handle';
import ViewItem from './view';
// import { VtxTimeUtil } from '../../utils/vtxUtil';

function PatrolAbnormal({ dispatch, patrolAbnormal, accessControlM }) {

    const { queryParams, newItem, missionItem, fileListVersion, handleItem, getViewDateSource, faultSelectList, faultSelectTotal, faultSelect, viewItem,
        deviceGrade, projectName, structureList, equipmentSelectList, equipmentSelectTotal, equipmentSelect, userList, projectNameNew, getData,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = patrolAbnormal;
    let buttonLimit = {};
    if (accessControlM['patrolAbnormal'.toLowerCase()]) {
        buttonLimit = accessControlM['patrolAbnormal'.toLowerCase()];
    }
    
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'patrolAbnormal/updateState',
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
            type : 'patrolAbnormal/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'patrolAbnormal/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 设备等级
        gradeProps: {
			value : queryParams.grade,
			onChange(value) {
                ParamsUpdateState({
                    grade : value,
                    itemId : '',
                });
                if (value === undefined) {
                    dispatch({
						type : 'patrolAbnormal/updateState',
						payload : {
							projectName: [],
						}
					})
                } else {
                    dispatch({
                        type: 'patrolAbnormal/projectSel',
                        payload: {
                            code: value
                        }
                    });
                }
                
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
        // 项目名称
        projectNameProps: {
            value : queryParams.itemId,
			onChange(value) {
				ParamsUpdateState({
					itemId : value,
                });
                
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
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
			dispatch({type : 'patrolAbnormal/initQueryParams'});
			dispatch({type : 'patrolAbnormal/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备等级', 'grade'],
        ['设备名称', 'deviceName'],
        ['安装位置', 'structuresName'],
        ['巡检项目', 'itemName'],
        ['巡检时间', 'inspectionTimeStr'],
        ['巡检人员', 'inspectionMan'],
        ['异常内容', 'inspectionAbnormal'],
        ['维修工单编号', 'code'],
        ['状态', 'dataStatusStr'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					dispatch({
                        type : 'patrolAbnormal/getD',
                        payload : {
                            id: rowData.id
                        }
                    }).then(() => {
                        dispatch({
                            type : 'patrolAbnormal/updateState',
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
                if (record.dataStatus === 0 && buttonLimit['HANDLE']) {
                btns.push({
                    name: <Icon type="pushpin"
                        title='处理' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'patrolAbnormal/updateState',
                            payload : {
                                missionItem: {
                                    ...missionItem,
                                    ...rowData,
                                    // fileIds: rowData.fileIds?JSON.parse(rowData.fileIds):[],
                                    // inspectionTime: rowData.inspectionTimeStr
                                },
                                fileListVersion:fileListVersion+1,
                            }
                        })
                        showMissionWindow();
                    }
                });
            }
            if (record.dataStatus === 0 && buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'patrolAbnormal/updateState',
                            payload : {
                                newItem: {
                                    ...newItem,
                                    ...rowData,
                                    fileListVersion:fileListVersion+1,
                                    // fileIds: rowData.fileIds?JSON.parse(rowData.fileIds):[],
                                    inspectionTime: rowData.inspectionTimeStr
                                }
                            }
                        });
                        showNewWindow();
                    }
                });
            }
            if (record.dataStatus !== 1 && buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({type:'patrolAbnormal/delete',payload: {
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
            		type: 'patrolAbnormal/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            },
            getCheckboxProps: (record) => {
                if (record.dataStatus == 1) {
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
            	type:'patrolAbnormal/getList',
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
    		type : 'patrolAbnormal/updateNewItem',
    		payload : {
    			visible : true
    		}
        });
        dispatch({
    		type : 'patrolAbnormal/updateState',
    		payload : {
    			fileListVersion:fileListVersion+1,
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolAbnormal/initParams' });
    	}
    	dispatch({
    		type : 'patrolAbnormal/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    // 项目
    const clearEquipmentList = () => {
        dispatch({type: 'patrolAbnormal/clearEquipmentSearchParams'});
        dispatch({type: 'patrolAbnormal/getUpdateDeviceList'});
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'patrolAbnormal/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'patrolAbnormal/getUpdateDeviceList'});
    };
    const newItemProps = {
    	updateWindow : updateNewWindow,
        modalPropsItem: {
            title:'巡检异常',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:800
        },
        fileListVersion,
        structureList,
        projectNameNew,
        userList,
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolAbnormal/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'structuresId') {
                    dispatch({
                        type : 'patrolAbnormal/updateNewItem',
                        payload : {
                            deviceId: '',
                            deviceName: '',
                        }
                    });
                    dispatch({type: 'patrolAbnormal/getUpdateDeviceList'});
                }
            },
            onSave() {
                dispatch({
                    type:'patrolAbnormal/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'patrolAbnormal/update'
                }).then(() => updateNewWindow(false));
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,
    }

    //----------------处理------------------
	const showMissionWindow = () => {
		dispatch({
    		type : 'patrolAbnormal/updateMissionItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateMissionWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolAbnormal/initParams' });
    	}
    	dispatch({
    		type : 'patrolAbnormal/updateMissionItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const missionItemProps = {
    	updateWindow : updateMissionWindow,
        modalPropsItem: {
            title:'巡检异常',
            visible: missionItem.visible,
            onCancel:() => updateMissionWindow(false), 
            width:800
        },
        fileListVersion,
        contentProps:{
            ...missionItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolAbnormal/updateMissionItem',
            		payload : {
            			...obj
            		}
            	})
            },
            ignore() {
                // console.log(missionItem);
                dispatch({
                    type:'patrolAbnormal/ignore',
                    payload: {
                        id: missionItem.id
                    }
                }).then(() => updateMissionWindow(false));
            },
            build() {
                dispatch({
                    type : 'patrolAbnormal/getView',
                    payload : {
                        id: missionItem.id
                    }
                }).then(() => {
                    showHandleWindow();
                });
                
            }

        }
    }

    //----------------处理中的处理------------------
	const showHandleWindow = () => {
		dispatch({
    		type : 'patrolAbnormal/updateHandleItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateHandleWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolAbnormal/initParams' });
    	}
    	dispatch({
    		type : 'patrolAbnormal/updateHandleItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    // 故障类型
    const clearFaultmentList = () => {
        dispatch({type: 'patrolAbnormal/clearFaultSearchParams'});
        dispatch({type: 'patrolAbnormal/getFaultList'});
    };
    const getFaultmentList = (name, page, size) => {
        dispatch({type: 'patrolAbnormal/updateFaultSearchParams', payload: {name, page, size}});
        dispatch({type: 'patrolAbnormal/getFaultList'});
    };
    const handleItemProps = {
    	updateWindow : updateHandleWindow,
        modalPropsItem: {
            title:'生成故障',
            visible: handleItem.visible,
            onCancel:() => updateHandleWindow(false), 
            width:800
        },
        getViewDateSource,
        fileListVersion,
        userList,
        contentProps:{
            ...handleItem,
            id: missionItem.id,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolAbnormal/updateHandleItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'patrolAbnormal/createBreakdown'
                }).then(() => updateHandleWindow(false));
            },

        },
        clearEquipmentList: clearFaultmentList,
        getEquipmentList: getFaultmentList,
        faultSelectList,
        faultSelectTotal,
    }

    //--------------删除------------------
    const deleteItems = () => {
    	Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({type:'patrolAbnormal/delete',payload: {
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
            type : 'patrolAbnormal/updateState',
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
            title:`巡检异常 > 查看`,
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
                titles={['设备等级', '项目名称', '设备名称', '起始日期']}
                gridweight={[1, 1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*设备等级*/}
                <Select {...vtxGridParams.gradeProps}>
					{
						deviceGrade.map(item => {
							return <Option key={item.value}>{item.text}</Option>
						})
					}
				</Select>
                {/*项目名称*/}
                <Select {...vtxGridParams.projectNameProps}>
					{
						projectName.map(item => {
							return <Option key={item.id}>{item.name}</Option>
						})
					}
				</Select>
                {/*设备名称*/}
                <Input {...vtxGridParams.nameProps}/>
                {/*起始日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => showNewWindow()}>异常上报</Button>}
                    {buttonLimit['DELETE'] && <Button icon="delete"
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
            {/*处理中的处理*/}
            {handleItem.visible && <HandleItem {...handleItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ patrolAbnormal, accessControlM }) => ({ patrolAbnormal, accessControlM}))(PatrolAbnormal);
