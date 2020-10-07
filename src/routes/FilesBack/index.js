/**
 * 档案归档
 * author : vtx sjb
 * createTime : 2019-8-10
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import styles  from './styles.less';

import { VtxTree, VtxGrid, VtxDatagrid, VtxDate, VtxExport } from 'vtx-ui';
const { VtxRangePicker } = VtxDate;
const {VtxExport2} = VtxExport;

import { Input, Select, message, Modal, Button,Icon } from 'antd';
const Option = Select.Option;

import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';

function FilesBack({ dispatch, filesBack, accessControlM }) {

	const {
		queryParams, expandedKeys,  userList, viewItem, modelLonding, newItem, getData, fileListVersion, typeSel, orgList,
		currentPage, pageSize, loading, dataSource, total, selectedRowKeys,
    } = filesBack;
    let buttonLimit = {};
    if (accessControlM['filesBack'.toLowerCase()]) {
        buttonLimit = accessControlM['filesBack'.toLowerCase()];
    }
	// 监测类型
	const monitorTypeProps = {
		expandedKeys : expandedKeys,
		data : orgList,
		isExpandAll : 'openAll',
		autoExpandParent : true,
        isShowSearchInput : true,
        selectedKeys: [queryParams.waterFactoryId],
		onClick({key, treeNode, selectedKeys}) {
            if (queryParams.waterFactoryId===treeNode.key){
                updateState({
                    waterFactoryId: ''
                });
                getList();
            }else{
                updateState({
                    waterFactoryId: treeNode.key
                });
                getList();
            }
            
		}
	};

	const updateState = (obj) => {
        dispatch({
            type : 'filesBack/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };

	// 更新表格数据
	const getList = () => {
        dispatch({
            type : 'filesBack/updateState',
            payload : {
                currentPage : 1,
            }
        })
        dispatch({type : 'filesBack/getList'});
	}

	// 查询
	const vtxGridParams = {
        // 归档类型
        typeProps: {
			value : queryParams.fileType,
			onChange(value) {
				updateState({
					fileType : value,
				});
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
		// 归档日期
        timeProps : {
			value : [queryParams.startTime, queryParams.endTime],
			onChange(date, dateString) {
				updateState({
					startTime : dateString[0],
					endTime : dateString[1]
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
        // 题名包含
        titleProps: {
			value: queryParams.title,
            onChange(e) {
				updateState({title : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },
        // 档案号
        numProps: {
			value: queryParams.fileRecordNo,
            onChange(e) {
				updateState({fileRecordNo : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },

        query() {
			getList();
			
		},

		clear() {
            dispatch({type : 'filesBack/initQueryParams'});
            dispatch({type : 'filesBack/getList'});
		}
	}

	// 列表
	const columns = [
        ['档案号', 'fileRecordNo'],
        ['题名', 'title'],
        ['档案类型', 'fileTypeStr'],
        ['归档部门', 'recordDepartment'],
        ['归档日期', 'recordDate'],
        ['附件数量', 'recordNum'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = []; 
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'filesBack/updateState',
                        payload : {
                            viewItem: {
                                ...rowData,
                                annx: rowData.annx?JSON.parse(rowData.annx):[],
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
                    dispatch({
                        type : 'filesBack/updateState',
                        payload : {
                            newItem: {
                                ...newItem,
                                ...rowData,
                                annx: rowData.annx?JSON.parse(rowData.annx):[],
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
                    dispatch({type:'filesBack/delete',payload: {
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
            		type: 'filesBack/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'filesBack/getList',
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
    		type : 'filesBack/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'filesBack/initParams' });
    	}
    	dispatch({
    		type : 'filesBack/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const newItemProps = {
        updateWindow : updateNewWindow,
        userList,
        fileListVersion,
        typeSel,
        modalPropsItem: {
            titleItem:'档案归档',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false), 
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'filesBack/updateNewItem',
            		payload : {
            			...obj
            		}
            	})
            },
            onSave() {
                dispatch({
                    type:'filesBack/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'filesBack/update'
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
                dispatch({type:'filesBack/delete',payload: {
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
            type : 'filesBack/updateState',
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
        fileListVersion,
        modalPropsItem:{
            titleItem:`档案归档 > 查看`,
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
                titles={['档案类型', '归档日期', '题名包含', '档案号']}
                gridweight={[1, 2, 1, 1]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*档案类型*/}
                <Select {...vtxGridParams.typeProps}>
                    {
                        typeSel.map(item => {
                            return <Option key={item.id}>{item.typeName}</Option>
                        })
                    }
                </Select>
                {/*归档日期*/}
                <VtxRangePicker {...vtxGridParams.timeProps} />
                {/*题名包含*/}
                <Input {...vtxGridParams.titleProps} />
                {/*档案号*/}
                <Input {...vtxGridParams.numProps} />
            </VtxGrid>
            <div className={styles.layout}>
                <div className={styles.left}>
                    <VtxTree {...monitorTypeProps}/>
                </div>
                <div className={styles.right}>
                    
                    <div className="table-wrapper" style={{ marginTop: '0',height:'100%'}}>
                        <div className="handle_box">
                            <Button icon="file-add" onClick={() => queryParams.waterFactoryId?showNewWindow():message.warning('请选择水厂')}>新增</Button>
                            <Button icon="delete"
                                    disabled={selectedRowKeys.length === 0}
                                    onClick={deleteItems}>删除</Button>
                        </div>
                        <div className="table-content" style={{
                            // height: document.documentElement.clientHeight-100,
                            // height:'100%'
                           
                        }}>
                            <VtxDatagrid {...vtxDatagridProps} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...newItemProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
        </div>
	)
}

export default connect(
    ({ filesBack, accessControlM }) => ({ filesBack, accessControlM })
)(FilesBack);
