/**
 * 更新任务
 * author : vtx sjb
 * createTime : 2019-7-08
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxGrid, VtxDate } from 'vtx-ui';
import { Input, Button, Select, message, Modal, Popconfirm, Tabs, Icon } from 'antd';
const { VtxRangePicker } = VtxDate;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import { VtxUtil } from "../../utils/util";
import { handleColumns } from '../../utils/tools';
import AddItem from './add';
import ViewItem from './view';
import CheckItem from './check';
import EditableCell from './EditableCell.js';
import Detail from './Detail';

class DeviceUpdateMisson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }

// function DeviceUpdateMisson({ dispatch, deviceUpdateMisson, loading, submitLoading, sparePartsLoading, repairListLoading, maintainListLoading }) {
    render() {
    const {dispatch,accessControlM, deviceUpdateMisson, loading, submitLoading, sparePartsLoading, repairListLoading, maintainListLoading} = this.props;
    const { queryParams, newItem, viewItem, updataItem, getData, fileListVersion, userList, checkItem, Btype, actManId,
        // equipmentSelectList, equipmentSelectTotal,
        currentPage, pageSize, dataSource, total, selectedRowKeys, modelLonding, isShow,
        partParams,

        waterFactoryList, equipmentStatus, equipmentTypes, modalParams, structureList, equipmentGrades,
        manufacturerList, equipmentSelectList, equipmentSelectTotal, sparePartsParams, technicalParameterParams, detailRepair, maintainRepair
    } = deviceUpdateMisson;
    const {type, visible, title, detail} = modalParams;
    let buttonLimit = {};
    if (accessControlM['deviceUpdateMisson'.toLowerCase()]) {
        buttonLimit = accessControlM['deviceUpdateMisson'.toLowerCase()];
    }
    
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'deviceUpdateMisson/updateState',
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
            type : 'deviceUpdateMisson/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'deviceUpdateMisson/updateState', payload: { currentPage: 1, pageSize: 10 }})
		dispatch({type : 'deviceUpdateMisson/getList'});
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
			dispatch({type : 'deviceUpdateMisson/initQueryParams'});
			dispatch({type : 'deviceUpdateMisson/getList'});
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
                    Promise.all([
                        dispatch({
                            type : 'deviceUpdateMisson/getD',
                            payload : {
                                id: rowData.id
                            }
                        }),
                        dispatch({
                            type : 'deviceUpdateMisson/BgetD',
                            payload : {
                                id: rowData.id
                            }
                        }),
                    ]).then((e) => {
                        if (!e.includes(false)) {
                            dispatch({
                                type : 'deviceUpdateMisson/updateState',
                                payload : {
                                    numId: rowData.id,
                                    newItem: {
                                        ...newItem,
                                        // ...rowData,
                                        ...getData,
                                        structuresId: rowData.structuresId || '全部',
                                        picIds11: rowData.picIds?JSON.parse(rowData.picIds):[],
                                    },
                                }
                            });
                            // showNewWindow();
                            updateModalParams('type', 'view');
                            updateModalParams('visible', true);
                            updateModalParams('title', '更新任务 > 查看');
                        }
                        
                    })
                }
            });
        }
            if (record.dataStatus === 'onDeal' && buttonLimit['EDIT']) {
                btns.push({
                    name: <Icon type='file-edit'
                        title='编辑' />,
                    onClick(rowData) {
                        rowData.tempDeviceId?Promise.all([
                            dispatch({
                                type : 'deviceUpdateMisson/getD',
                                payload : {
                                    id: rowData.id
                                }
                            }),
                            dispatch({
                                type : 'deviceUpdateMisson/BgetD',
                                payload : {
                                    id: rowData.tempDeviceId
                                }
                            }),
                        ]).then((e) => {
                            if (!e.includes(false)) {
                                dispatch({
                                    type: 'deviceUpdateMisson/getStructureList',
                                    payload: {waterFactoryId: detail.waterFactoryId}
                                })
                                dispatch({
                                    type : 'deviceUpdateMisson/updateState',
                                    payload : {
                                        numId: rowData.id,
                                        actManId: rowData.actManId,
                                        newItem: {
                                            ...newItem,
                                            ...rowData,
                                            // ...getData,
                                            structuresId: rowData.structuresId || '全部',
                                            picIds11: rowData.picIds?JSON.parse(rowData.picIds):[],
                                        },
                                    }
                                });
                                // showNewWindow();
                                updateModalParams('type', 'update');
                                updateModalParams('visible', true);
                                updateModalParams('title', '更新任务 > 编辑');
                            }
                            
                        }):
                        Promise.all([
                            dispatch({
                                type : 'deviceUpdateMisson/getD',
                                payload : {
                                    id: rowData.id
                                }
                            }),
                        ]).then((e) => {
                            if (!e.includes(false)) {
                                dispatch({
                                    type : 'deviceUpdateMisson/updateState',
                                    payload : {
                                        numId: rowData.id,
                                        newItem: {
                                            ...newItem,
                                            ...rowData,
                                            // ...getData,
                                            structuresId: rowData.structuresId || '全部',
                                            picIds11: rowData.picIds?JSON.parse(rowData.picIds):[],
                                        },
                                    }
                                });
                                // showNewWindow();
                                updateModalParams('type', 'add');
                                updateModalParams('visible', true);
                                updateModalParams('title', '更新任务 > 编辑');
                            }
                            
                        })
                    }
                });
            }
            if (record.dataStatus === 'onAudit' && buttonLimit['AUDIT']) {
                btns.push({
                    name: <Icon type='examine'
                        title='审核' />,
                    onClick(rowData) {
                        dispatch({
                            type : 'deviceUpdateMisson/checkItemParams',
                            payload : {
                                visible: true,
                                id: rowData.id,
                            }
                        })
                    }
                });
            }
            if (record.dataStatus === 'onDeal' && buttonLimit['DELETE']) {
                btns.push({
                    name: <Icon type='delete'
                        title='删除' />,
                    onClick(rowData) {
                        dispatch({type:'deviceUpdateMisson/delete',payload: {
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
            		type: 'deviceUpdateMisson/updateState',
            		payload: {
                		selectedRowKeys: selectedRowKeys,
            		}
        		})
            }
        },
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'deviceUpdateMisson/getList',
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
    		type : 'deviceUpdateMisson/updateNewItem',
    		payload : {
    			visible : true
    		}
    	});
	}
    const updateNewWindow = (status = true) => {
    	if(!status) {
    		dispatch({ type : 'deviceUpdateMisson/initParams' });
    	}
    	dispatch({
    		type : 'deviceUpdateMisson/updateNewItem',
    		payload : {
    			visible : status
    		}
    	})
    }
    const clearEquipmentList = () => {
        dispatch({type: 'deviceUpdateMisson/clearEquipmentSearchParams'});
        dispatch({type: 'deviceUpdateMisson/getEquipmentList'});
        dispatch({
            type : 'deviceUpdateMisson/updateNewItem',
            payload : {
                deviceId: '',
                deviceName: '',
            }
        });
    };
    const getEquipmentList = (name, page, size) => {
        dispatch({type: 'deviceUpdateMisson/updateEquipmentSearchParams', payload: {name, page, size}});
        dispatch({type: 'deviceUpdateMisson/getEquipmentList'});
    };

    const updatePartParams = (target, value) => {
        dispatch({
            type: 'deviceUpdateMisson/updatePartParams',
            payload: {
                [target]: value
                
            }
        });
    }

    const newItemProps = {              //..............................................................................................
        updateWindow : updateNewWindow,
        // structureList,
        userList,
        fileListVersion,
        
        modalPropsItem: {
            title:'更新任务',
            visible: newItem.visible,
            onCancel:() => updateNewWindow(false),
            width:800
        },
        contentProps:{
            ...newItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceUpdateMisson/updateNewItem',
            		payload : {
            			...obj
            		}
                });
                // if (Object.keys(obj)[0] === 'structuresId') {
                //     dispatch({type: 'deviceUpdateMisson/getEquipmentList'});
                // }
            },
            onSave(e) {
                dispatch({
                    type:'deviceUpdateMisson/BaddSave',
                    payload: {
                        status: e
                    }
                }).then(() => updateNewWindow(false));
            },
            onUpdate(e) {
                dispatch({
                    type:'deviceUpdateMisson/update',
                    payload: {
                        status: e
                    }
                }).then(() => updateNewWindow(false));
            },

            getSparePartsList() {
                dispatch({type: 'deviceUpdateMisson/getSparePartsList'})
            },

            openModal() {
                dispatch({type: 'deviceUpdateMisson/getSparePartsList'}).then(() => {
                    dispatch({
                        type: 'deviceUpdateMisson/updatePartParams',
                        payload: {
                            modalVisible: true
                        }
                    })
                })
                
                // dispatch({type: 'deviceUpdateMisson/getPartList'})
            },

        },
        clearEquipmentList: clearEquipmentList,
        getEquipmentList: getEquipmentList,
        // equipmentSelectList,
        // equipmentSelectTotal,

        // 配件信息
        partParams,
        updatePartParams,
        // partProps: {
        // }
    }


    //--------------大修计划生成的编辑-----------------
    const updateUpdataWindow = (status = true) => {
        dispatch({
            type : 'deviceUpdateMisson/updateState',
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
            title:`更新任务 > 编辑`,
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
            type : 'deviceUpdateMisson/updateState',
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
            title:`更新任务 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false),
            width:800
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
    }
    
    //--------------审核-----------------
    const updateCheckWindow = (status = true) => {
        if(!status) {
    		dispatch({ type : 'deviceUpdateMisson/initParams' });
    	}
        dispatch({
            type : 'deviceUpdateMisson/checkItemParams',
            payload : {
                visible : status
            }
        })
    }
    const checkItemProps = {
		updateWindow : updateCheckWindow,
		checkItem,
        modalPropsItem:{
            title:`更新任务 > 审核`,
            visible: checkItem.visible,
            onCancel:() => updateCheckWindow(false),
            width:800
        },
        contentProps:{
            ...checkItem,
            modelLonding,
            updateItem(obj) {
            	dispatch({
            		type : 'deviceUpdateMisson/checkItemParams',
            		payload : {
            			...obj
            		}
            	})
            },
            check(e) {
                dispatch({
                    type:'deviceUpdateMisson/audit',
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
                dispatch({type:'deviceUpdateMisson/delete',payload: {
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

    //--------------新增台账------------------
    //新增或编辑
    const handle = (type, e) => {
        const childForm = this.modalForm.getForm();
        childForm.validateFieldsAndScroll((err, values) => {
            if (type === 'add') {
                if (!values.actEndDay) {
                    message.error('请填写回单');
                    return;
                }
                if (!moment(values.actStartDay).isBefore(values.actEndDay)) {
                    message.error('开始时间必须在结束时间之前');
                    return;
                }
            }
           
            if (typeof(values.actEndDay) !== 'string') {
                values.actEndDay = values.actEndDay.format('YYYY-MM-DD HH:mm:ss')
            }
            if (typeof(values.actStartDay) !== 'string') {
                values.actStartDay = values.actStartDay.format('YYYY-MM-DD HH:mm:ss')
            }
            if (err) {
                message.warn("存在未填写或错误字段，无法提交");
                return;
            }
            if (typeof(values.buyDate) !== 'string') {
                values.buyDate = values.buyDate.format('YYYY-MM-DD')
            }
            if (typeof(values.installDate) !== 'string') {
                values.installDate = values.installDate.format('YYYY-MM-DD')
            }
            if (typeof(values.operationDate) !== 'string') {
                values.operationDate = values.operationDate.format('YYYY-MM-DD')
            }
            const method = type === 'add' && 'deviceUpdateMisson/BaddSave' || type === 'edit' && 'deviceUpdateMisson/addUpdate';
            const {sureRows} = sparePartsParams;
            const {technicalParameterList} = technicalParameterParams;
            const {fileIds} = detail;
            if (type === 'add') {
                dispatch({
                    type: 'deviceUpdateMisson/BaddSave',
                    payload: {
                        values: {
                            ...values,
                            status: e,
                            sparePartIds: sureRows.map(item => item.id).join(','),
                            technicalParameters: technicalParameterList.length !== 0 ? JSON.stringify(technicalParameterList) : '',
                            picIds11: values.picIds11.length !== 0 ? JSON.stringify(values.picIds11) : '',
                            picIds: values.picIds.length !== 0 ? JSON.stringify(values.picIds) : '',
                            gdCode: values.values || '',
                            fileIds
                        },
                        onComplete: () => closeModal()
                    }
                }).then(() => {
                    dispatch({
                        type: 'deviceUpdateMisson/update',
                        payload: {
                            values: {
                                ...values,
                                status: e,
                                sparePartIds: sureRows.map(item => item.id).join(','),
                                technicalParameters: technicalParameterList.length !== 0 ? JSON.stringify(technicalParameterList) : '',
                                picIds11: values.picIds11.length !== 0 ? JSON.stringify(values.picIds11) : '',
                                picIds: values.picIds.length !== 0 ? JSON.stringify(values.picIds) : '',
                                gdCode: values.values || '',
                                fileIds
                            },
                            onComplete: () => closeModal()
                        }
                    })
                })
            } else {
                dispatch({
                    type: 'deviceUpdateMisson/BaddUpdate',
                    payload: {
                        values: {
                            ...values,
                            status: e,
                            sparePartIds: sureRows.map(item => item.id).join(','),
                            technicalParameters: technicalParameterList.length !== 0 ? JSON.stringify(technicalParameterList) : '',
                            picIds11: values.picIds11.length !== 0 ? JSON.stringify(values.picIds11) : '',
                            picIds: values.picIds.length !== 0 ? JSON.stringify(values.picIds) : '',
                            gdCode: values.values || '',
                            fileIds
                        },
                        onComplete: () => closeModal()
                    }
                }).then(() => {
                    dispatch({
                        type: 'deviceUpdateMisson/update',
                        payload: {
                            values: {
                                ...values,
                                status: e,
                                sparePartIds: sureRows.map(item => item.id).join(','),
                                technicalParameters: technicalParameterList.length !== 0 ? JSON.stringify(technicalParameterList) : '',
                                picIds11: values.picIds11.length !== 0 ? JSON.stringify(values.picIds11) : '',
                                picIds: values.picIds.length !== 0 ? JSON.stringify(values.picIds) : '',
                                gdCode: values.values || '',
                                fileIds
                            },
                            onComplete: () => closeModal()
                        }
                    })
                })
            }
            
        })
    };
    //关闭模态框
    const closeModal = () => {
        dispatch({type: 'deviceUpdateMisson/clearModalParams'});
        dispatch({
            type: 'deviceUpdateMisson/updateState',
            payload: {
                structureList: [],
                manufacturerList: []
            }
        });
        dispatch({type: 'deviceUpdateMisson/initParams'});
        this.modalForm.getForm().resetFields();
    };
    //更改模态框相关配置
    const updateModalParams = (target, value) => {
        dispatch({
            type: 'deviceUpdateMisson/updateModalParams',
            payload: {
                [target]: value
            }
        })
    };
    //模态框配置
    const modalProps = {
        visible,
        title,
        maskClosable: false,
        width: 800,
        onCancel: () => closeModal()
    };
    //模态框内容配置
    const detailProps = {
        ...newItemProps,
        waterFactoryList,
        detail,
        type,
        equipmentStatus,
        equipmentTypes,
        structureList,
        equipmentGrades,
        manufacturerList,
        checkName: (value, callback) => {
            if (value === detail.name || !value) {
                callback();
                return;
            }
            dispatch({
                type: 'deviceUpdateMisson/nameExist',
                payload: {
                    id: detail.id,
                    key: 'name',
                    value
                }
            }).then((data) => {
                if (!!data) {
                    callback()
                } else {
                    callback('名称不能重复')
                }
            });
        },
        getStructuresList: (value, callback) => dispatch({
            type: 'deviceUpdateMisson/getStructureList',
            payload: {waterFactoryId: value}
        }).then((data) => {
            if (callback) {
                callback(data)
            }
        }),
        wrappedComponentRef: dom => this.modalForm = dom,
        equipmentSelectList,
        equipmentSelectTotal,
        getEquipmentList: (name, page, size) => {
            dispatch({type: 'deviceUpdateMisson/updateEquipmentSearchParams', payload: {name, page, size}});
            dispatch({type: 'deviceUpdateMisson/getEquipmentList'});
        },
        clearEquipmentList: () => {
            dispatch({type: 'deviceUpdateMisson/clearEquipmentSearchParams'});
            dispatch({type: 'deviceUpdateMisson/getEquipmentList'});
        },
        getManufacturerList: (value) => dispatch({
            type: 'deviceUpdateMisson/getManufacturerList',
            payload: {manufacturer: value}
        }),
        changeDetail: (target, value) => {
            dispatch({
                type: 'deviceUpdateMisson/updateDetail',
                payload: {
                    [target]: value
                }
            })
        },
        changeDetailNew: (target, value) => {
            dispatch({
                type: 'deviceUpdateMisson/updateNewPic',
                payload: {
                    [target]: value
                }
            })
        },
        sparePartsParams,
        updateSparePartsParams: (target, value) => {
            dispatch({
                type: 'deviceUpdateMisson/updateSparePartsParams',
                payload: {
                    [target]: value
                }
            })
        },
        getSparePartsList: () => {
            dispatch({
                type: 'deviceUpdateMisson/updateSparePartsParams',
                payload: {
                    modalVisible: true
                }
            });
            dispatch({type: 'deviceUpdateMisson/getSparePartsList1'})
        },
        sparePartsLoading,
        technicalParameterParams,
        updateTechnicalParameterParams: (target, value) => {
            dispatch({
                type: 'deviceUpdateMisson/updateTechnicalParameterParams',
                payload: {
                    [target]: value
                }
            })
        },
        changeParams: (target, value) => dispatch({
            type: 'deviceUpdateMisson/updateState',
            payload: {
                [target]: value
            }
        }),
        changeTab: (key, id) => {
            switch (key) {
                case 'repair':
                    dispatch({
                        type: 'deviceUpdateMisson/getRepairList',
                        payload: {
                            deviceId: id
                        }
                    });
                    break;
                case 'maintain':
                    dispatch({
                        type: 'deviceUpdateMisson/getMaintainList',
                        payload: {
                            deviceId: id
                        }
                    });
                    break;
            }
        },
        detailRepair,
        repairListLoading,
        maintainRepair,
        maintainListLoading
    };

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
                    {isShow && buttonLimit['DELETE'] && <Button icon="delete"
                            disabled={selectedRowKeys.length === 0}
                            onClick={deleteItems}>删除</Button>}
                </div>
                <div className="table-content" >
                    <VtxDatagrid {...vtxDatagridProps} />
                </div>
            </div>
            {/*新增&&编辑*/}
            {newItem.visible && <AddItem {...detailProps}/>}
            {/*查看*/}
            {viewItem.visible && <ViewItem {...viewItemProps}/>}
            {/*审核*/}
            {checkItem.visible && <CheckItem {...checkItemProps}/>}
            {/*台账*/}
            {!!modalParams.visible && <Modal {...modalProps}
                                    footer={type === 'view' ?[
                                        <Button key='cancel'
                                                onClick={() => closeModal()}>取消</Button>,
                                        // <Button key='submit'
                                        //         type='primary'
                                        //         loading={submitLoading}
                                        //         onClick={() => handle(type, 0)}>保存</Button>,
                                        // <Button key='submitAndSave'
                                        //         type='primary'
                                        //         loading={submitLoading}
                                        //         onClick={() => handle(type, 1)}>保存并提交</Button>
                                    ]:[
                                        <Button key='cancel'
                                                onClick={() => closeModal()}>取消</Button>,
                                        <Button key='submit'
                                                type='primary'
                                                loading={submitLoading}
                                                onClick={() => handle(type, 0)}>保存</Button>,
                                        <Button key='submitAndSave'
                                                type='primary'
                                                loading={submitLoading}
                                                onClick={() => handle(type, 1)}>保存并提交</Button>
                                    ]}
            >
                {/* <Tabs defaultActiveKey="1">
                    <TabPane tab="新增台账" key="1"><Detail {...detailProps}/></TabPane>
                    <TabPane tab="回单填写" key="2"><div></div><AddItem {...newItemProps}/></TabPane>
                </Tabs> */}
                <Detail {...detailProps}/>
            </Modal>}
        </div>
    );
    }
}

const deviceUpdateMissonProps = (state) => {
    return {
        accessControlM: state.accessControlM,
        deviceUpdateMisson: state.deviceUpdateMisson,
        loading: state.loading.effects['deviceUpdateMisson/pageList'] || state.loading.effects['deviceUpdateMisson/loadWaterFactorySelect'] || state.loading.effects['deviceUpdateMisson/getDetail'],
        submitLoading: state.loading.effects['deviceUpdateMisson/addSave'] || state.loading.effects['deviceUpdateMisson/addUpdate'] || state.loading.effects['deviceUpdateMisson/update'],
        sparePartsLoading: state.loading.effects['deviceUpdateMisson/getSparePartsList'],
        repairListLoading: state.loading.effects['deviceUpdateMisson/getRepairList'],
        maintainListLoading: state.loading.effects['deviceUpdateMisson/getMaintainList']
    };
};
export default connect(deviceUpdateMissonProps)(DeviceUpdateMisson);
