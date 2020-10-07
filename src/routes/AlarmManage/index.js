/**
 * 报警管理
 * createTime : 2019-8-9
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

function AlarmManage({ dispatch, alarmManage, accessControlM }) {

    const { queryParams, newItem, viewItem, getData, AlertLocationSel, AlertTypeSel, AlertGradeSel, userList,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = alarmManage;
    let buttonLimit = {};
    if (accessControlM['alarmManage'.toLowerCase()]) {
        buttonLimit = accessControlM['alarmManage'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'alarmManage/updateState',
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
            type : 'alarmManage/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'alarmManage/getList'});
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
			dispatch({type : 'alarmManage/initQueryParams'});
			dispatch({type : 'alarmManage/getList'});
		}
    };

    // 列表
	const columns = [
        ['报警时间', 'code1'],
        ['污水处理厂', 'code'],
        ['报警位置', 'name1'],
        ['报警指标', 'name2'],
        ['报警类型', 'name4'],
        ['报警级别', 'name7'],
        ['报警概要', 'name8'],
        ['事件状态', 'name88'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = []; 
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					// dispatch({
                    //     type : 'alarmManage/getD',
                    //     payload : {
                    //         id: rowData.id
                    //     }
                    // }).then(() => {
                        dispatch({
                            type : 'alarmManage/updateState',
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
            btns.push({
                name: <Icon type='upload'
                    title='上报' />,
                onClick(rowData) {
                    dispatch({
                        type : 'alarmManage/updateState',
                        payload : {
                            newItem: {
                                ...newItem,
                                ...rowData
                            }
                        }
                    });
                    showNewWindow();
                }
            });
        	btns.push({
                name: <Icon type='delete'
                    title='解除' />,
        		onClick(rowData) {
                    dispatch({type:'alarmManage/delete',payload: {
                        ids: rowData.id,
                        onSuccess: function(){
                            updateState({
                                selectedRowKeys : []
                            })
                            message.success('解除成功');
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
        // rowSelection: {
        //     type: 'checkbox',
        //     selectedRowKeys: selectedRowKeys,
        //     onChange(selectedRowKeys) {
        //     	dispatch({
        //     		type: 'alarmManage/updateState',
        //     		payload: {
        //         		selectedRowKeys: selectedRowKeys,
        //     		}
        // 		})
        //     }
        // },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'alarmManage/getList',
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
    		type : 'alarmManage/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'alarmManage/initParams' });
    	}
    	dispatch({
    		type : 'alarmManage/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        AlertLocationSel,
        AlertGradeSel,
        AlertTypeSel,
        userList,
        modalPropsItem: {
            title:'报警管理',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'alarmManage/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'alarmManage/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'alarmManage/update'
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
                dispatch({type:'alarmManage/delete',payload: {
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
            type : 'alarmManage/updateState',
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
            title:`报警管理 > 查看`,
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
            {/* <div className={style.handle_box1}>
                <Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>
                <Button icon="delete"
                        disabled={selectedRowKeys.length === 0}
                        onClick={deleteItems}>删除</Button>
            </div> */}
            <div className="table-wrapper" style={{marginTop: '5px'}}>
                <VtxDatagrid {...vtxDatagridProps} />
            </div>
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ alarmManage, accessControlM }) => ({ alarmManage, accessControlM }))(AlarmManage);