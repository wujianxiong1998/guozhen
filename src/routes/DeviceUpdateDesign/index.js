/**
 * 大修计划
 * author : vtx sjb
 * createTime : 2019-7-05
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon} from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';

function DeviceUpdateDesign({ dispatch, deviceUpdateDesign, accessControlM  }) {

    const { queryParams, newItem, structureList, viewItem, updataItem, getData, fileListVersion, userList,
        equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding, isShow
    } = deviceUpdateDesign;
    let buttonLimit = {};
    if (accessControlM['deviceUpdateDesign'.toLowerCase()]) {
        buttonLimit = accessControlM['deviceUpdateDesign'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'deviceUpdateDesign/updateState',
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
            type : 'deviceUpdateDesign/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'deviceUpdateDesign/updateState', payload: { currentPage: 1, pageSize: 10 }})
		dispatch({type : 'deviceUpdateDesign/getList'});
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
			dispatch({type : 'deviceUpdateDesign/initQueryParams'});
			dispatch({type : 'deviceUpdateDesign/getList'});
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
                    //     type : 'deviceUpdateDesign/getD',
                    //     payload : {
                    //         id: rowData.id
                    //     }
                    // }).then(() => {
                        dispatch({
                            type : 'deviceUpdateDesign/updateState',
                            payload : {
                                viewItem: {
                                    ...rowData,
                                    picIds: rowData.picIds?JSON.parse(rowData.picIds):[],
                                    visible: true,
                                }
                            }
                        })
                    // });
        		}
            });
        }
            if (record.dataStatus === 'waitPublish') {
                if (buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'deviceUpdateDesign/updateState',
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
                    }
                });
            }
            
                if (isShow && buttonLimit['DELETE']) {
                    btns.push({
                        name: <Icon type='delete'
                            title='删除' />,
                        onClick(rowData) {
                            dispatch({type:'deviceUpdateDesign/delete',payload: {
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
            		type: 'deviceUpdateDesign/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            },
            getCheckboxProps: (record) => {
                if (record.dataStatus !== 'waitPublish') {
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
            	type:'deviceUpdateDesign/getList',
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
    		type : 'deviceUpdateDesign/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'deviceUpdateDesign/initParams' });
    	}
    	dispatch({
    		type : 'deviceUpdateDesign/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'deviceUpdateDesign/clearEquipmentSearchParams'});
        dispatch({type: 'deviceUpdateDesign/getEquipmentList'});
        dispatch({
            type : 'deviceUpdateDesign/updateNewItem',
            payload : {
                deviceId: '',
                deviceName: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'deviceUpdateDesign/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'deviceUpdateDesign/getEquipmentList'});
    };
    const newItemProps = {
        updateWindow : updateNewWindow,
        structureList,
        userList,
        fileListVersion,
        modalPropsItem: {
            title:'大修方案',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceUpdateDesign/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'structuresId') {
                    dispatch({type: 'deviceUpdateDesign/getEquipmentList'});
                }
            },
            onSave(e) {
                dispatch({
                    type:'deviceUpdateDesign/save',
                    payload: {
                        saveOrSubmit: e
                    }
                }).then(() => updateNewWindow(false));
            },
            onUpdate(e) {
                dispatch({
                    type:'deviceUpdateDesign/update',
                    payload: {
                        saveOrSubmit: e
                    }
                }).then(() => updateNewWindow(false));
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,
    }

    //--------------大修计划生成的编辑-----------------
    const updateUpdataWindow = (status = true) => {
        dispatch({
            type : 'deviceUpdateDesign/updateState',
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
            title:`大修方案 > 编辑`,
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
            type : 'deviceUpdateDesign/updateState',
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
            title:`大修方案 > 查看`,
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
                dispatch({type:'deviceUpdateDesign/delete',payload: {
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
                titles={['设备编号', '设备名称', '起始时间']}
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
                    {/* <Button icon="file-add" onClick={() => showNewWindow()}>新增</Button> */}
                    {isShow && buttonLimit['DELETE']&&<Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content" >
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ deviceUpdateDesign, accessControlM }) => ({ deviceUpdateDesign, accessControlM  }))(DeviceUpdateDesign);
