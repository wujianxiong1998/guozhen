/**
 * 设备调拨
 * author : vtx sjb
 * createTime : 2019-7-10
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal,Icon } from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';

function DeviceAllocate({ dispatch, deviceAllocate, accessControlM  }) {

    const { queryParams, newItem, structureList, userList, maintainType, viewItem, getData, equipmentStatus, newStructureListSel, newWaterFactorySel,
        equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, loading, dataSource, total, modelLonding,
    } = deviceAllocate;
    let buttonLimit = {};
    if (accessControlM['deviceAllocate'.toLowerCase()]) {
        buttonLimit = accessControlM['deviceAllocate'.toLowerCase()];
    }
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'deviceAllocate/updateState',
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
            type : 'deviceAllocate/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
		dispatch({type: 'deviceAllocate/updateState', payload: { currentPage: 1, pageSize: 10 }})
		dispatch({type : 'deviceAllocate/getList'});
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
			dispatch({type : 'deviceAllocate/initQueryParams'});
			dispatch({type : 'deviceAllocate/getList'});
		}
    };

    // 列表
	const columns = [
        ['设备编号', 'code'],
        ['设备名称', 'name',{nowrap:true}],
        ['设备类型', 'typeName'],
        ['型号', 'modelNum'],
        ['申请时间', 'applyDay'],
        ['原安装位置', 'structuresName'],
        // ['原状态', 'deviceStatusStr'],
        ['变更后位置', 'newStructuresName'],
        // ['变更后状态', 'newDeviceStatusStr'],
        ['审核人', 'auditPeopleName'],
        ['审批结果', 'typeStr3'],
        ['审核状态', 'dataStatusStr'],
        ['操作', 'action', { renderButtons : (text, record) => {
            let btns = [];
            if (buttonLimit['VIEW']) {
            btns.push({
                name: <Icon type='view'
                    title='查看' />,
        		onClick(rowData) {
                    dispatch({
                        type : 'deviceAllocate/updateState',
                        payload : {
                            viewItem: {
                                ...rowData,
                                visible: true,
                            }
                        }
                    })
        		}
            });
        }
            if (record.dataStatus === 'waitAudit' && buttonLimit['CANCEL']) {
                btns.push({
                    name: <Icon type="rollback" title='撤销' />,
                    onClick(rowData) {
                        Modal.confirm({
                            content: '确定要撤销调拨申请么？',
                            okText: '确定',
                            cancelText: '取消',
                            onOk() {
                                dispatch({type:'deviceAllocate/ignore',payload: {
                                    id: rowData.id,
                                    onSuccess: function(){
                                        message.success('撤销成功');
                                    },
                                    onError: function(msg){
                                        message.error(msg);
                                    }
                                }});
                            }
                        });
                    }
                });
            }
            /*  没有点击事件，暂时注释 */
            // btns.push({
            //     name:'查看流程',
            //     onClick(rowData) {}
            // });
            
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
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'deviceAllocate/getList',
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
    		type : 'deviceAllocate/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'deviceAllocate/initParams' });
    	}
    	dispatch({
    		type : 'deviceAllocate/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'deviceAllocate/clearEquipmentSearchParams'});
        dispatch({type: 'deviceAllocate/getEquipmentList'});
        dispatch({
            type : 'deviceAllocate/updateNewItem',
            payload : {
                deviceId: '',
                deviceName: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'deviceAllocate/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'deviceAllocate/getEquipmentList'});
    };
    const newItemProps = {
        updateWindow : updateNewWindow,
        structureList,
        newStructureListSel,
        newWaterFactorySel,
        userList,
        equipmentStatus,
        maintainType,
        modalPropsItem: {
            title:'设备调拨',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceAllocate/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                if (Object.keys(obj)[0] === 'deviceId') {

                    let structuresName = Object.values(obj)[0];
                    // let structuresItem = structureList.filter(item => item);
                    dispatch({type: 'deviceAllocate/newStructureList', payload: {id: Object.values(obj)[3]}});
                    dispatch({type: 'deviceAllocate/WaterFactoryList', payload: {id: Object.values(obj)[5]}});
                }
            },
            onSave() {
                dispatch({
                    type:'deviceAllocate/save'
                }).then(() => updateNewWindow(false));
            },
            onUpdate() {
                dispatch({
                    type:'deviceAllocate/update'
                }).then(() => updateNewWindow(false));
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        equipmentSelectList,
        equipmentSelectTotal,
    }


    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'deviceAllocate/updateState',
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
            title:`设备调拨 > 查看`,
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
                titles={['设备编号', '设备名称', '申请时间']}
                gridweight={[1, 1, 2]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
            >
                {/*设备编号*/}
                <Input {...vtxGridParams.numProps}/>
                {/*设备名称*/}
                <Input {...vtxGridParams.nameProps}/>
                {/*申请时间*/}
                <VtxRangePicker {...vtxGridParams.timeProps}/>
            </VtxGrid>
            <div className="table-wrapper">
                <div className="handle_box">
                    {buttonLimit['ADD'] &&<Button icon="file-add" onClick={() => showNewWindow()}>变更申请</Button>}
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
export default connect(({ deviceAllocate, accessControlM }) => ({ deviceAllocate, accessControlM  }))(DeviceAllocate);
