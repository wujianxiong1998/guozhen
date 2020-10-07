/**
 * 积分汇总及配置
 * author : vtx xxy
 * createTime : 2019-08-20 15:53:17
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid } from 'vtx-ui';
import { Modal, Button, message, Input } from 'antd';

import NewItem from '../../components/scoreConfig/Add';
import EditItem from '../../components/scoreConfig/Add';

import styles from './index.less';
import { handleColumns } from '../../utils/tools';

function ScoreConfig({ dispatch, scoreConfig, accessControlM}) {
	const {
		searchParams,
		currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
		newItem, editItem, viewItem
	} = scoreConfig;
    let buttonLimit = {};
    if (accessControlM['scoreConfig'.toLowerCase()]) {
        buttonLimit = accessControlM['scoreConfig'.toLowerCase()];
    }
	const updateState = (obj) => {
		dispatch({
			type : 'scoreConfig/updateState',
			payload : {
				...obj
			}
		})
	}

    // 更新表格数据
    const getList = () => {
    	dispatch({type : 'scoreConfig/updateQueryParams'});
    	dispatch({type : 'scoreConfig/getList'});
    }
    
    // 查询
    const vtxGridParams = {
        // 姓名
        nameProps : {
        	value : searchParams.name,
        	onChange(e) {
        		updateState({
                    searchParams : {
                        name : e.target.value
                    }
                })
        	},
            onPressEnter() {
                getList();
            },
        	placeholder : '请输入姓名',
        	maxLength : '32'
        },
    
    	query() {
    		getList();
    	},
    
    	clear() {
    		dispatch({type : 'scoreConfig/initQueryParams'});
    		dispatch({type : 'scoreConfig/getList'});
    	}
    };

    // 列表
    const columns = [
        ['姓名', 'userName', { sorter: true, sortOrder: searchParams.sortField === 'name'? searchParams.order:false}],
        ['单位', 'unitName', { sorter: true, sortOrder: searchParams.sortField === 'unitName' ? searchParams.order : false }],
        ['提问得分', 'askScore', { sorter: true, sortOrder: searchParams.sortField === 'askScore' ? searchParams.order : false}],
        ['回答得分', 'answerScore', { sorter: true, sortOrder: searchParams.sortField === 'answerScore'? searchParams.order:false}],
        ['上传得分', 'uploadScore', { sorter: true, sortOrder: searchParams.sortField === 'uploadScore' ? searchParams.order : false}],
    ];
    let vtxDatagridProps = {
    	columns : handleColumns(columns),
    	dataSource,
    	indexColumn : true,
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        loading,
        onChange(pagination, filters, sorter){
            updateState({
                searchParams: {
                    sortField: sorter.columnKey,
                    order: sorter.order ,
                            
                }
            })
            dispatch({ type: 'scoreConfig/updateQueryParams' });
            dispatch({
            	type:'scoreConfig/getList',
            	payload : {
            		currentPage : pagination.current,
                	pageSize: pagination.pageSize
            	}
            })
        },
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:currentPage,
            total:total,
            pageSize,
            showTotal: total => `合计 ${total} 条`
        },
    };
    vtxDatagridProps = _.assign(vtxDatagridProps, {
        rowSelection : {
            type:'checkbox',
            selectedRowKeys,
            onChange(selectedRowKeys, selectedRows){
                updateState({
                    selectedRowKeys
                });
            }
        }
    })

	//----------------新增------------------
    const updateNewWindow = (status = true) => {
		updateState({
            newItem : {
                visible : status
            }
        })
    	if(status) {
            dispatch({ type: 'scoreConfig/getScoreConfig' });
    	}
    }
    const newItemProps = {
    	updateWindow : updateNewWindow,
        modalProps:{
            title:'积分规则',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:900
        },
        contentProps:{
            ...newItem,
            btnType : 'add',
            updateItem(obj) {
				updateState({
                    newItem : {
                        ...obj
                    }
                })
            },
            save() {
            	dispatch({type:'scoreConfig/saveOrUpdate',payload:{
					btnType : 'add',
                    onSuccess:function(){
                        message.success('新增成功');
                        updateNewWindow(false);
                    },
                    onError:function(){
                        message.error('新增失败');
                    }
                }})
            }
        }
    };
    
	//--------------编辑-----------------
    const updateEditWindow = (status = true) => {
		updateState({
            editItem : {
                visible : status
            }
        })
    }
    const editItemProps = {
    	updateWindow : updateEditWindow,
        modalProps:{
            title:'积分规则',
            visible: editItem.visible,
            onCancel:() => updateEditWindow(false),
            width:900
        },
        contentProps:{
            ...editItem,
            btnType : 'edit',
            updateItem(obj) {
				updateState({
                    editItem : {
                        ...obj
                    }
                })
            },
            save() {
            	dispatch({type:'scoreConfig/saveOrUpdate',payload:{
					btnType : 'edit',
                    onSuccess:function(){
                        message.success('编辑成功');
                        updateEditWindow(false);
                    },
                    onError:function(){
                        message.error('编辑失败');
                    }
                }})
            }
        }
    };
    
    
	return (
        <div className="main_page">
            <div style={{marginTop:0}} className="table-wrapper">

                {/*按钮*/}
                <div className="handle_box">
                    {buttonLimit['UPDATE'] &&<Button icon="jifen1" onClick={() => updateNewWindow()}>积分规则</Button>}
				</div>
                <div className="table-content">
					<VtxDatagrid {...vtxDatagridProps}/>
                </div>
			</div>
			{/*新增*/}
			{newItem.visible && <NewItem {...newItemProps}/>}
			{/*编辑*/}
			{editItem.visible && <EditItem {...editItemProps}/>}
        </div>
	)
}

export default connect(
    ({ scoreConfig, accessControlM }) => ({ scoreConfig, accessControlM})
)(ScoreConfig);