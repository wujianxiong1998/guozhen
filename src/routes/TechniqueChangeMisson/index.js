/**
 * 技改任务
 * author : vtx sjb
 * createTime : 2019-7-08
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal, Popconfirm,Icon } from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';
import ViewUpItem from './viewUp';
import CheckItem from './check';
// import EditableCell from './EditableCell.js';

function TechniqueChangeMisson({ dispatch, techniqueChangeMisson, accessControlM }) {

    const { queryParams, newItem, structureList, viewItem, updataItem, getData, fileListVersion, userList, checkItem, accessItem,
        equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
        partParams,
    } = techniqueChangeMisson;
    let buttonLimit = {};
    if (accessControlM['techniqueChangeMisson'.toLowerCase()]) {
        buttonLimit = accessControlM['techniqueChangeMisson'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'techniqueChangeMisson/updateState',
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
            type : 'techniqueChangeMisson/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'techniqueChangeMisson/updateState', payload: { currentPage: 1, pageSize: 10 }})
		dispatch({type : 'techniqueChangeMisson/getList'});
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
        
        query() {
			getList();
		},

		clear() {
			dispatch({type : 'techniqueChangeMisson/initQueryParams'});
			dispatch({type : 'techniqueChangeMisson/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name'],
        ['安装位置', 'structuresName'],
        ['责任人', 'chargeManName'],

        ['计划完成时间', 'planDateStr'],
        ['具体事项', 'specificThing'],
        ['状态', 'dataStatusStr'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					dispatch({
                        type : 'techniqueChangeMisson/getD',
                        payload : {
                            id: rowData.id
                        }
                    }).then(() => {
                        dispatch({
                            type : 'techniqueChangeMisson/updateState',
                            payload : {
                                viewItem: {
                                    // ...getData,
                                    visible: true,
                                    // sparePart: JSON.parse(getData.sparePart),
                                    // picIds: getData.picIds?JSON.parse(getData.picIds):[],
                                }
                            }
                        })
                    });
        		}
            });
        }
            if (record.dataStatus === 'onAudit' && buttonLimit['AUDIT']) {
                btns.push({
                    name: <Icon type='examine'
                        title='审核' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'techniqueChangeMisson/checkItemParams',
                            payload : {
                                visible: true,
                                id: rowData.id,
                            }
                        })
                    }
                });
            }
            if (record.dataStatus === 'onDeal' && buttonLimit['BACKFILL']) {
                btns.push({
                    name: <Icon type='huida'
                        title='回单填写' />, 
                    onClick(rowData) {
                        dispatch({
                            type : 'techniqueChangeMisson/getD',
                            payload : {
                                id: rowData.id
                            }
                        }).then(() => {
                            dispatch({
                                type : 'techniqueChangeMisson/updateState',
                                payload : {
                                    newItem: {
                                        ...newItem,
                                        ...rowData,
                                        structuresId: rowData.structuresId || '全部',
                                        picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
                                    }
                                }
                            });
                            showNewWindow();
                        })
                    }
                });
            }
            if (record.dataStatus === 'after_access'&&buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='后评估编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'techniqueChangeMisson/getD',
                            payload : {
                                id: rowData.id
                            }
                        }).then(() => {
                            dispatch({
                                type : 'techniqueChangeMisson/accessItemParams',
                                payload : {
                                    visible: true,
                                    id: rowData.id,
                                    afterPicIds: rowData.afterPicIds?JSON.parse(rowData.afterPicIds):[],
                                }
                            })
                        });
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
            		type: 'techniqueChangeMisson/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'techniqueChangeMisson/getList',
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
    		type : 'techniqueChangeMisson/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'techniqueChangeMisson/initParams' });
    	}
    	dispatch({
    		type : 'techniqueChangeMisson/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'techniqueChangeMisson/clearEquipmentSearchParams'});
        dispatch({type: 'techniqueChangeMisson/getEquipmentList'});
        dispatch({
            type : 'techniqueChangeMisson/updateNewItem',
            payload : {
                deviceId: '',
                deviceName: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'techniqueChangeMisson/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'techniqueChangeMisson/getEquipmentList'});
    };

    const updatePartParams = (target, value) => {
        dispatch({
            type: 'techniqueChangeMisson/updatePartParams',
            payload: {
                [target]: value
                
            }
        });
    }

    const newItemProps = {
        updateWindow : updateNewWindow,
        structureList,
        userList,
        fileListVersion,
        
        modalPropsItem: {
            title:'技改任务',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'techniqueChangeMisson/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'structuresId') {
                    dispatch({type: 'techniqueChangeMisson/getEquipmentList'});
                }
            },
            onSave(e) {
                dispatch({
                    type:'techniqueChangeMisson/save',
                    payload: {
                        status: e
                    }
                }).then(() => updateNewWindow(false));
            },
            onUpdate(e) {
                dispatch({
                    type:'techniqueChangeMisson/update',
                    payload: {
                        status: e
                    }
                }).then(() => updateNewWindow(false));
            },

            getSparePartsList() {
                dispatch({type: 'techniqueChangeMisson/getSparePartsList'})
            },

            openModal() {
                dispatch({type: 'techniqueChangeMisson/getSparePartsList'}).then(() => {
                    dispatch({
                        type: 'techniqueChangeMisson/updatePartParams',
                        payload: {
                            modalVisible: true
                        }
                    })
                })
                
                // dispatch({type: 'techniqueChangeMisson/getPartList'})
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,

        // 配件信息
        partParams,
        updatePartParams,
        // partProps: {
        // }
    }


    //--------------技改计划生成的编辑-----------------
    const updateUpdataWindow = (status = true) => {
        dispatch({
            type : 'techniqueChangeMisson/updateState',
            payload : {
                updataItem: {
                    ...updataItem,
                    visible : status
                }
            }
        })
    }
    const updataItemProps = {
		updateWindow : updateUpdataWindow,
        modalPropsItem:{
            title:`技改任务 > 编辑`,
            visible: updataItem.visible,
            onCancel:() => updateViewWindow(false),
            width:800
        },
        contentProps:{
            ...updataItem,
            btnType : 'view'
        }
	}

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'techniqueChangeMisson/updateState',
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
            title:`技改任务 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            width:800
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
    }

    //--------------后评估-----------------
    const updateAccessWindow = (status = true) => {
        if(!status) {
    		dispatch({ type : 'techniqueChangeMisson/initParams' });
    	}
        dispatch({
            type : 'techniqueChangeMisson/accessItemParams',
            payload : {
                visible : status
            }
        })
    }
    const accessItemProps = {
		updateWindow : updateAccessWindow,
		getData,
        modalPropsItem:{
            title:`技改任务 > 编辑`,
            visible: accessItem.visible,
            onCancel:() => updateAccessWindow(false),
            width:800
        },
        contentProps:{
            ...accessItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'techniqueChangeMisson/accessItemParams',
            		payload : {
            			...obj
            		}
            	})
            },
            access(e) {
                dispatch({
                    type:'techniqueChangeMisson/access',
                    payload: {
                        saveStatus: e
                    }
                }).then(() => updateAccessWindow(false));
            },
        }
    }
    
    //--------------审核-----------------
    const updateCheckWindow = (status = true) => {
        if(!status) {
    		dispatch({ type : 'techniqueChangeMisson/initParams' });
    	}
        dispatch({
            type : 'techniqueChangeMisson/checkItemParams',
            payload : {
                visible : status
            }
        })
    }
    const checkItemProps = {
		updateWindow : updateCheckWindow,
		checkItem,
        modalPropsItem:{
            title:`技改任务 > 审核`,
            visible: checkItem.visible,
            onCancel:() => updateCheckWindow(false),
            width:800
        },
        contentProps:{
            ...checkItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'techniqueChangeMisson/checkItemParams',
            		payload : {
            			...obj
            		}
            	})
            },
            check(e) {
                dispatch({
                    type:'techniqueChangeMisson/audit',
                    payload: {
                        auditStatus: e
                    }
                }).then(() => updateCheckWindow(false));
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
                dispatch({type:'techniqueChangeMisson/delete',payload: {
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
                titles={['设备编号', '设备名称', '限定时间']}
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
                    {buttonLimit['DELETE'] && <Button icon="delete"
                        disabled={selectedRowKeys.length === 0}
                        onClick={deleteItems}>删除</Button>}
            </div>
            <div className="table-content">
                <VtxDatagrid {...vtxDatagridProps} />
            </div>
            </div>
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
            {/*审核*/}
            {checkItem.visible && <CheckItem {...checkItemProps}/>}
            {/*编辑*/}
            {accessItem.visible && <ViewUpItem {...accessItemProps}/>}
        </div>
    );

}
export default connect(({ techniqueChangeMisson, accessControlM }) => ({ techniqueChangeMisson, accessControlM }))(TechniqueChangeMisson);
