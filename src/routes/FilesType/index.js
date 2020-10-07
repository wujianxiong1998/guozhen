/**
 * 档案类型
 * author : vtx sjb
 * createTime : 2019-8-10
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

function FilesType({ dispatch, filesType, accessControlM}) {

    const { queryParams, newItem, viewItem, getData,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = filesType;
    let buttonLimit = {};
    if (accessControlM['filesType'.toLowerCase()]) {
        buttonLimit = accessControlM['filesType'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'filesType/updateState',
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
            type : 'filesType/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		dispatch({type : 'filesType/getList'});
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
			dispatch({type : 'filesType/initQueryParams'});
			dispatch({type : 'filesType/getList'});
		}
    };

    // 列表
    const columns = [
        ['类型名称', 'typeName'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = []; 
            btns.push({
                name: <Icon type='file-edit'
                    title='编辑' />,
                onClick(rowData) {
                    dispatch({
                        type : 'filesType/updateState',
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
                    title='删除' />,
        		onClick(rowData) {
                    dispatch({type:'filesType/wheatherDelete',payload: {
                        ids: rowData.id,
                    }}).then((data) => {
                        if (data) {
                            dispatch({type:'filesType/delete',payload: {
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
                        } else {
                            message.error('此档案类型不能删除');
                        }
                    })
                    
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
            		type: 'filesType/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'filesType/getList',
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
    		type : 'filesType/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'filesType/initParams' });
    	}
    	dispatch({
    		type : 'filesType/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        modalPropsItem: {
            title:'档案类型',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:500
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'filesType/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'filesType/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'filesType/update'
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
                dispatch({type:'filesType/delete',payload: {
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
            type : 'filesType/updateState',
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
            title:`档案类型 > 查看`,
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
export default connect(({ filesType, accessControlM }) => ({ filesType, accessControlM }))(FilesType);