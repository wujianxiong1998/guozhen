/**
 * 填报数据报警
 * createTime : 2019-8-13
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon } from 'antd';
const Option = Select.Option;

import { handleColumns } from '../../utils/tools';
import style from './styles.less';
import AddItem from './add';
import ViewItem from './view';

function AlarmDataFill({ dispatch, alarmDataFill, accessControlM  }) {

    const { queryParams, newItem, deviceGrade, viewItem, getData, waterFactoryList, userList, typeList, libList,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = alarmDataFill;
    let buttonLimit = {};
    if (accessControlM['alarmDataFill'.toLowerCase()]) {
        buttonLimit = accessControlM['alarmDataFill'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'alarmDataFill/updateState',
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
            type : 'alarmDataFill/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'alarmDataFill/updateState', payload: { currentPage: 1, pageSize: 10 }});
		dispatch({type : 'alarmDataFill/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 设备等级
        gradeProps: {
			value : queryParams.code,
			onChange(value) {
				ParamsUpdateState({
					code : value,
				});
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
			dispatch({type : 'alarmDataFill/initQueryParams'});
			dispatch({type : 'alarmDataFill/getList'});
		}
    };

    // 列表
	const columns = [
        ['污水处理厂', 'waterFactoryName'],
        ['报警指标', 'libName'],
        ['指标单位', 'libUnitName'],
        ['上限值', 'upValue'],
        ['下限值', 'downValue'],
        ['通知人员', 'sendPeopleName'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = []; 
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'alarmDataFill/updateState',
                        payload : {
                            viewItem: {
                                ...rowData,
                                visible: true,
                            }
                        }
                    })
        		}
        	});           
            btns.push({
                name: <Icon type='file-edit'
                    title='编辑' />,
                onClick(rowData) {
                    let sendPeopleIdName = []
                    const sendPeopleIdArr= rowData.sendPeopleId?rowData.sendPeopleId.split(','): []
                    const sendPeopleNameArr= rowData.sendPeopleName?rowData.sendPeopleName.split(','): []
                    sendPeopleIdArr.map((item,index)=>{
                        sendPeopleIdName.push({ value: item, label: sendPeopleNameArr[index]})
                    })

                    dispatch({
                        type : 'alarmDataFill/updateState',
                        payload : {
                            newItem: {
                                ...newItem,
                                ...rowData,
                                sendPeopleIdName,
                                sendPeopleId: rowData.sendPeopleId?rowData.sendPeopleId.split(','):[],
                                sendPeopleName: rowData.sendPeopleName?rowData.sendPeopleName.split(','):[],
                            }
                        }
                    });
                    dispatch({ 
                        type:'alarmDataFill/loadLibSelect',
                        payload: {
                            isEdit:true,
                            waterFactoryId: rowData.waterFactoryId,
                            typeCode: rowData.typeCode,
                        }
                     }).then(() => {
                        showNewWindow();
                     })
                    
                }
            });
        	btns.push({
                name: <Icon type='delete'
                    title='删除' />,
        		onClick(rowData) {
                    dispatch({type:'alarmDataFill/delete',payload: {
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
        	return btns;
		}, width : '150px'}]
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
            		type: 'alarmDataFill/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'alarmDataFill/getList',
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
    		type : 'alarmDataFill/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'alarmDataFill/initParams' });
    	}
    	dispatch({
    		type : 'alarmDataFill/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        waterFactoryList,
        typeList,
        libList,
        userList,
        modalPropsItem: {
            title:'填报数据报警',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'alarmDataFill/updateNewItem',
            		payload : {
            			...obj
            		}
                })
                if (Object.keys(obj)[0] === 'typeCode' || Object.keys(obj)[0] === 'waterFactoryId') {
                    dispatch({ type:'alarmDataFill/loadLibSelect' });
                }
            },
            onSave() {
                dispatch({
                    type:'alarmDataFill/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'alarmDataFill/update'
                }).then(() => updateNewWindow(false));
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
                dispatch({type:'alarmDataFill/delete',payload: {
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
            type : 'alarmDataFill/updateState',
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
            title:`填报数据报警 > 查看`,
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
            <div className="table-wrapper" style={{marginTop: '5px'}}>
                <div className="handle_box">
                    <Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>
                    <Button icon="delete"
                        disabled={selectedRowKeys.length === 0}
                        onClick={deleteItems}>删除</Button>
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
export default connect(({ alarmDataFill, accessControlM }) => ({ alarmDataFill, accessControlM }))(AlarmDataFill);