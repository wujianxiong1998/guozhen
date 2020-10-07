/**
 * 巡检标准
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon } from 'antd';
const Option = Select.Option;

import { handleColumns } from '../../utils/tools';
import AddItem from './new';
import AddPDItem from './add';
import UpdateItem from './updata';
import ViewItem from './view';

function PatrolStandard({ dispatch, patrolStandard, accessControlM }) {

    const { queryParams, newItem, updataItem, deviceGrade, projectName, projectDataSource, selectedRowKeysP, deviceDataSource, selectedRowKeysD,
        equipmentSelectTotal, equipmentSelect, equipmentSelectList, equipmentSelectListD, equipmentSelectTotalD, equipmentSelectD,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding, viewItem, getData,
        addProjectDataSource, addDeviceDataSource, addItem, addCurrentPage, addPageSize, addLoading, addDataSource, addTotal, addSelectedRowKeys, projectOrDevice,
    } = patrolStandard;
    let buttonLimit = {};
    if (accessControlM['patrolStandard'.toLowerCase()]) {
        buttonLimit = accessControlM['patrolStandard'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'patrolStandard/updateState',
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
            type : 'patrolStandard/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'patrolStandard/getList'});
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
						type : 'patrolStandard/updateState',
						payload : {
							projectName: [],
						}
					})
                } else {
                    dispatch({
                        type: 'patrolStandard/projectSel',
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
        deviceNameProps: {
			value: queryParams.name,
            onChange(e) {
				ParamsUpdateState({name : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'patrolStandard/initQueryParams'});
			dispatch({type : 'patrolStandard/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备等级', 'gradeStr'],
        ['设备名称', 'deviceName'],
        ['安装位置', 'structuresName'],
        ['巡检项目', 'itemName'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'patrolStandard/updateState',
                        payload : {
                            viewItem: {
                                ...viewItem,
                                ...rowData,
                                visible: true,
                            }
                        }
                    })
        		}
            });        
        }
            if (buttonLimit['EDIT']) {  
            btns.push({
                name: <Icon type='file-edit'
                    title='编辑' />,
                onClick(rowData) {
                    dispatch({
                        type : 'patrolStandard/updateState',
                        payload : {
                            updataItem: {
                                ...updataItem,
                                ...rowData
                            }
                        }
                    });
                    showUpdateWindow();
                    
                }
            });
        }
            if (buttonLimit['DELETE']) {
        	btns.push({
                name: <Icon type='delete'
                    title='删除' />,
        		onClick(rowData) {
                    dispatch({type:'patrolStandard/delete',payload: {
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
            onChange(selectedRowKeys) {
            	dispatch({
            		type: 'patrolStandard/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'patrolStandard/getList',
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

    //----------------新增------------------
	const showNewWindow = () => {
		dispatch({
    		type : 'patrolStandard/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolStandard/initParams' });
    	}
    	dispatch({
    		type : 'patrolStandard/updateNewItem',
    		payload : {
    			visible : status
    		}
        });
        // dispatch({
    	// 	type : 'patrolStandard/updateState',
    	// 	payload : {
    	// 		selectedRowKeysP : [],
        //         selectedRowKeysD : [],
    	// 	}
        // });
        dispatch({
            type: 'patrolStandard/updateState',
            payload: {
                deviceDataSource: [],
                projectDataSource: [],
            }
        });
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        deviceGrade,
        projectDataSource,
        selectedRowKeysP,
        deviceDataSource,
        selectedRowKeysD,
        modalPropsItem: {
            title:'巡检标准',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolStandard/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'patrolStandard/save'
                }).then(() => updateNewWindow(false));
            },
            selectedRowKeysPChange(RowKeys) {
                dispatch({
                    type: 'patrolStandard/updateState',
                    payload: {
                        selectedRowKeysP: RowKeys,
                    }
                })
            },
            selectedRowKeysDChange(RowKeys) {
                dispatch({
                    type: 'patrolStandard/updateState',
                    payload: {
                        selectedRowKeysD: RowKeys,
                    }
                })
            },

            // 删除项目
            deleteProject(e) {
                let newData = projectDataSource.filter(item => item.id !== e.id);
                dispatch({
                    type: 'patrolStandard/updateState',
                    payload: {
                        projectDataSource: newData,
                    }
                });
            },

            // 删除设备
            deleteDevice(e) {
                let newData = deviceDataSource.filter(item => item.id !== e.id);
                dispatch({
                    type: 'patrolStandard/updateState',
                    payload: {
                        deviceDataSource: newData,
                    }
                });
            },

            // 添加项目
            addProject() {
                if (newItem.code) {
                    dispatch({
                        type:'patrolStandard/getProjectList'
                    }).then(() => {
                        showAddWindow();
                        dispatch({
                            type: 'patrolStandard/updateState',
                            payload: {
                                projectOrDevice: '1',
                            }
                        });
                    });
                } else {
                    message.warn('请选择设备等级');
                }
            },
            // 添加设备
            addDevice() {
                if (newItem.code) {
                    dispatch({
                        type:'patrolStandard/getDeviceList'
                    }).then(() => {
                        showAddWindow();
                        dispatch({
                            type: 'patrolStandard/updateState',
                            payload: {
                                projectOrDevice: '2',
                            }
                        });
                    });
                } else {
                    message.warn('请选择设备等级');
                }
            },

        }
    }

    //----------------编辑------------------
	const showUpdateWindow = () => {
		dispatch({
    		type : 'patrolStandard/updateUpdateItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateUpdateWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolStandard/initParams' });
    	}
    	dispatch({
    		type : 'patrolStandard/updateUpdateItem',
    		payload : {
    			visible : status
    		}
        });
    }
    // 项目
    const clearEquipmentList = () => {
        dispatch({type: 'patrolStandard/clearEquipmentSearchParams'});
        dispatch({type: 'patrolStandard/getUpdateProjectList'});
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'patrolStandard/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'patrolStandard/getUpdateProjectList'});
    };
    // 设备
    const clearEquipmentListD = () => {
        dispatch({type: 'patrolStandard/clearEquipmentSearchParamsD'});
        dispatch({type: 'patrolStandard/getUpdateDeviceList'});
    };
    const getEquipmentListD = (name, page, size) => {
        dispatch({type: 'patrolStandard/updateEquipmentSearchParamsD', payload: {name, page, size}});
        dispatch({type: 'patrolStandard/getUpdateDeviceList'});
    };
    const updataItemProps = {
        updateWindow : updateUpdateWindow,
        deviceGrade,
        // projectDataSource,
        // deviceDataSource,
        modalPropsItem: {
            title:'巡检标准',
            visible: updataItem.visible,
            onCancel:() => updateUpdateWindow(false), 
            width:500
        },
        contentProps:{
            ...updataItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolStandard/updateUpdateItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'grade') {
                    dispatch({
                        type : 'patrolStandard/updateUpdateItem',
                        payload : {
                            deviceId: '',
                            deviceName: '',
                        }
                    });
                    dispatch({
                        type : 'patrolStandard/updateUpdateItem',
                        payload : {
                            itemId: '',
                            itemName: '',
                        }
                    });
                    dispatch({type: 'patrolStandard/getUpdateProjectList'});
                    dispatch({type: 'patrolStandard/getUpdateDeviceList'});
                }
            },
            onSave() {
                dispatch({
                    type:'patrolStandard/update'
                }).then(() => updateUpdateWindow(false));
            },
        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,

        clearEquipmentListD: clearEquipmentListD,
        getEquipmentListD: getEquipmentListD,
        equipmentSelectListD,
        equipmentSelectTotalD,
    }

    //----------------添加项目和设备------------------
	const showAddWindow = () => {
		dispatch({
    		type : 'patrolStandard/updateAddItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateAddWindow = (status = true) => {
        dispatch({
    		type : 'patrolStandard/updateState',
    		payload : {
                addSelectedRowKeys : [],
                addCurrentPage : 1,
                addPageSize : 10,
                addTotal : 0,
    		}
        });
    	dispatch({
    		type : 'patrolStandard/updateAddItem',
    		payload : {
    			visible : status
    		}
        });
    }

    const addItemProps = {
        updateWindow : updateAddWindow,
        DataSource: projectOrDevice === '1'?addProjectDataSource:addDeviceDataSource,
        addCurrentPage,
        addPageSize,
        addLoading,
        addTotal,
        addSelectedRowKeys,
        projectOrDevice,
        modalPropsItem: {
            title: projectOrDevice === '1'?'添加项目':'添加设备',
            visible: addItem.visible,
            onCancel:() => updateAddWindow(false), 
            width:800
        },
        contentProps:{
            ...addItem,
            modelLonding,
            onSave() {
                if (projectOrDevice === '1') {
                    let addProjectData = addProjectDataSource.filter(item => {
                        if (addSelectedRowKeys.includes(item.id)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    projectDataSource.push(...addProjectData);
                    let temData = [];
                    let obj = {};
                    for(var i =0; i<projectDataSource.length; i++){
                        if(!obj[projectDataSource[i].id]){
                            temData.push(projectDataSource[i]);
                            obj[projectDataSource[i].id] = true;
                        }
                    }
                    // dispatch({
                    //     type:'patrolStandard/save'
                    // }).then(() => updateAddWindow(false));
                    dispatch({
                        type: 'patrolStandard/updateState',
                        payload: {
                            projectDataSource: temData,
                        }
                    });
                } else {
                    let addDeviceData = addDeviceDataSource.filter(item => {
                        if (addSelectedRowKeys.includes(item.id)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    deviceDataSource.push(...addDeviceData);
                    let temData = [];
                    let obj = {};
                    for(var i =0; i<deviceDataSource.length; i++){
                        if(!obj[deviceDataSource[i].id]){
                            temData.push(deviceDataSource[i]);
                            obj[deviceDataSource[i].id] = true;
                        }
                    }
                    // dispatch({
                    //     type:'patrolStandard/save'
                    // }).then(() => updateAddWindow(false));
                    dispatch({
                        type: 'patrolStandard/updateState',
                        payload: {
                            deviceDataSource: temData,
                        }
                    });
                }
                
                updateAddWindow(false);
                
            },
            changeRow(selectedRowKeys) {
                dispatch({
            		type: 'patrolStandard/updateState',
            		payload: {
                		addSelectedRowKeys: selectedRowKeys,
            		}
        		})
            },
            changePageSize(obj) {
                dispatch({
                    type:projectOrDevice === '1'?'patrolStandard/getProjectList':'patrolStandard/getDeviceList',
                    payload : {
                        addCurrentPage : obj.current,
                        addPageSize: obj.pageSize
                    }
                }).then((status) => {
                    if(status) {
                        dispatch({
                            type:'patrolStandard/updateState',
                            payload : {
                                addCurrentPage : obj.current,
                                addPageSize: obj.pageSize
                            }
                        })
                    }
                    //  选择下一页后，上一页的数据丢失，写在这里就是可以分页多选
                    if (projectOrDevice === '1') {
                        let addProjectData = addProjectDataSource.filter(item => {
                            if (addSelectedRowKeys.includes(item.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        projectDataSource.push(...addProjectData);
                        let temData = [];
                        let obj = {};
                        for(var i =0; i<projectDataSource.length; i++){
                            if(!obj[projectDataSource[i].id]){
                                temData.push(projectDataSource[i]);
                                obj[projectDataSource[i].id] = true;
                            }
                        }
                        // dispatch({
                        //     type:'patrolStandard/save'
                        // }).then(() => updateAddWindow(false));
                        dispatch({
                            type: 'patrolStandard/updateState',
                            payload: {
                                projectDataSource: temData,
                            }
                        });
                    } else {
                        let addDeviceData = addDeviceDataSource.filter(item => {
                            if (addSelectedRowKeys.includes(item.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        deviceDataSource.push(...addDeviceData);
                        let temData = [];
                        let obj = {};
                        for(var i =0; i<deviceDataSource.length; i++){
                            if(!obj[deviceDataSource[i].id]){
                                temData.push(deviceDataSource[i]);
                                obj[deviceDataSource[i].id] = true;
                            }
                        }
                        // dispatch({
                        //     type:'patrolStandard/save'
                        // }).then(() => updateAddWindow(false));
                        dispatch({
                            type: 'patrolStandard/updateState',
                            payload: {
                                deviceDataSource: temData,
                            }
                        });
                    }
                });
            }
        }
    }

    //--------------删除------------------
    const deleteItems = () => {
    	Modal.confirm({
            content: `确定删除选中的${selectedRowKeys.length}条数据吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({type:'patrolStandard/delete',payload: {
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
            type : 'patrolStandard/updateState',
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
            title:`巡检标准 > 查看`,
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
                titles={['设备等级', '项目名称', '设备名称']}
                gridweight={[1, 1, 1]}
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
                <Input {...vtxGridParams.deviceNameProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>}
                    {buttonLimit['DELETE'] &&<Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content" >
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*添加项目还是添加设备*/}
            {addItem.visible && <AddPDItem {...addItemProps}/>}
            {/*编辑*/}
            {updataItem.visible && <UpdateItem {...updataItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ patrolStandard, accessControlM }) => ({ patrolStandard, accessControlM }))(PatrolStandard);
