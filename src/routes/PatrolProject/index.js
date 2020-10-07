/**
 * 巡检项目
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon } from 'antd';
const Option = Select.Option;

import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';

function PatrolProject({ dispatch, patrolProject, accessControlM }) {

    const { queryParams, newItem, deviceGrade, viewItem, getData,
        currentPage, pageSize, loading, dataSource, total, selectedRowKeys, modelLonding,
    } = patrolProject;
    let buttonLimit = {};
    if (accessControlM['patrolProject'.toLowerCase()]) {
        buttonLimit = accessControlM['patrolProject'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'patrolProject/updateState',
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
            type : 'patrolProject/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		// dispatch({type : 'abnormalReportLog/updateQueryParams'});
		dispatch({type : 'patrolProject/getList'});
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
			dispatch({type : 'patrolProject/initQueryParams'});
			dispatch({type : 'patrolProject/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备等级', 'code'],
        ['项目名称', 'name'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) { 
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
					// dispatch({
                    //     type : 'patrolProject/getD',
                    //     payload : {
                    //         id: rowData.id
                    //     }
                    // }).then(() => {
                        dispatch({
                            type : 'patrolProject/updateState',
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
            if (buttonLimit['EDIT']) {         
            btns.push({
                name: <Icon type='file-edit'
                    title='编辑' />,
                onClick(rowData) {
                    dispatch({
                        type : 'patrolProject/updateState',
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
        }
            if (buttonLimit['DELETE']) {
        	btns.push({
                name: <Icon type='delete'
                    title='删除' />,
        		onClick(rowData) {
                    dispatch({type:'patrolProject/delete',payload: {
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
            		type: 'patrolProject/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'patrolProject/getList',
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
    		type : 'patrolProject/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'patrolProject/initParams' });
    	}
    	dispatch({
    		type : 'patrolProject/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        deviceGrade,
        modalPropsItem: {
            title:'巡检项目',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:500
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'patrolProject/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'patrolProject/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'patrolProject/update'
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
                dispatch({type:'patrolProject/delete',payload: {
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
            type : 'patrolProject/updateState',
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
                titles={['设备等级', '项目名称']}
                gridweight={[1, 1]}
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
                <Input {...vtxGridParams.projectNameProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => showNewWindow()}>新增</Button>}
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
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
    );

}
export default connect(({ patrolProject, accessControlM }) => ({ patrolProject, accessControlM }))(PatrolProject);
