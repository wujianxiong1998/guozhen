import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Form, Input, Button, Modal, message, DatePicker, Select, Col, Row, TreeSelect, Popconfirm, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm, formStyle_6} from "../../utils/util";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;

class EquipmentFailure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, equipmentFailureM, accessControlM, loading, submitLoading} = this.props;
        const {failureStatus, userInfo, userList, gridParams, searchParams, dataList, dataTotal, delIds, modalParams, addressSelectList, addressSelectTotal, equipmentSelectList, equipmentSelectTotal, faultSelectList, faultSelectTotal, taskModalVisible} = equipmentFailureM;
        const {code, name, startDay, endDay, dataStatus} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        
        let buttonLimit = {};
        if (accessControlM['equipFailure'.toLowerCase()]) {
            buttonLimit = accessControlM['equipFailure'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'equipmentFailureM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'equipmentFailureM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //时间选择
        const DateProps = {
            style: {width: '100%'},
            value: [startDay, endDay],
            format: 'YYYY-MM-DD',
            allowClear: false,
            onChange: (date, dateString) => {
                changeGridParams('startDay', date[0]);
                changeGridParams('endDay', date[1]);
                changeSearchParams('startDay', date[0]);
                changeSearchParams('endDay', date[1]);
                dispatch({type: 'equipmentFailureM/pageList'})
            }
        };
        //故障状态选择
        const statusSelect = {
            style: {width: '100%'},
            value: dataStatus,
            onChange: (value) => {
                changeGridParams('dataStatus', value);
                changeSearchParams('dataStatus', value);
                dispatch({type: 'equipmentFailureM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '设备编号',
                dataIndex: 'code',
                key: 'code',
                nowrap: true
            }, {
                title: '设备名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '设备类型',
                dataIndex: 'typeName',
                key: 'typeName',
                nowrap: true
            }, {
                title: '故障详情',
                dataIndex: 'details',
                key: 'details',
                nowrap: true
            }, {
                title: '故障时间',
                dataIndex: 'breakdownTimeStr',
                key: 'breakdownTimeStr',
                nowrap: true
            }, {
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'dataStatusStr',
                key: 'dataStatusStr',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => {
                    return (
                        <div>
                            {buttonLimit['ADD'] && <Icon type='view'
                                                         title='查看'
                                                         onClick={() => {
                                                             updateModalParams('type', 'view');
                                                             updateModalParams('title', '设备故障管理>查看');
                                                             dispatch({
                                                                 type: 'equipmentFailureM/getDetail',
                                                                 payload: {id: rowData.id}
                                                             })
                                                         }}/>}
                            {rowData.dataStatus === 'waitDeal' && <span>
                                {buttonLimit['RELEASE'] && <span>
                                    <span className='ant-divider'/>
                                    <Icon type='tubiaozhizuomoban-'
                                          title='任务下达'
                                          onClick={() => dispatch({
                                              type: 'equipmentFailureM/updateState',
                                              payload: {
                                                  taskId: rowData.id,
                                                  taskModalVisible: true
                                              }
                                          })}/>
                                </span>}
                                {buttonLimit['IGNORE'] && <span>
                                    <span className='ant-divider'/>
                                    <Popconfirm title="上报故障不影响，是否确定不予维修?"
                                                onConfirm={() => dispatch({
                                                    type: 'equipmentFailureM/ignore',
                                                    payload: {id: rowData.id}
                                                })} okText="确定" cancelText="取消">
                                        <Icon type='hulve' title='忽略'/>
                                    </Popconfirm>
                                </span>}
                                {buttonLimit['EDIT'] && <span>
                                    <span className='ant-divider'/>
                                    <Icon type='file-edit'
                                          title='编辑'
                                          onClick={() => {
                                              updateModalParams('type', 'edit');
                                              updateModalParams('title', '设备故障管理>编辑');
                                              dispatch({type: 'equipmentFailureM/getDetail', payload: {id: rowData.id}})
                                          }}/>
                                    </span>}
                                {buttonLimit['DELETE'] && <span>
                                    <span className='ant-divider'/>
                                    {
                                        delPopconfirm(() => dispatch({
                                            type: 'equipmentFailureM/deleteEntity',
                                            payload: {ids: rowData.id}
                                        }))
                                    }
                                </span>}
                            </span>}
                        </div>
                    )
                }
            }],
            dataSource: dataList,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 1000,
            },
            startIndex: page * size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: dataTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('size', pageSize);
                    dispatch({
                        type: 'equipmentFailureM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'equipmentFailureM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'equipmentFailureM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'equipmentFailureM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => {
                    const allowDelIds = selectedRows.map(item => {
                        if (item.dataStatus === 'waitDeal') {
                            return item.id
                        }
                    }).filter(item => !!item);
                    if (allowDelIds.length < selectedRowKeys.length) {
                        message.info('非待处理状态数据不能删除')
                    }
                    dispatch({
                        type: 'equipmentFailureM/updateState',
                        payload: {
                            delIds: allowDelIds
                        }
                    })
                }
            }
        };
        //新增或编辑
        const handle = (type) => {
            const childForm = this.modalForm.getForm();
            childForm.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法提交");
                    return;
                }
                if (typeof(values.breakdownTime) !== 'string') {
                    values.breakdownTime = values.breakdownTime.format('YYYY-MM-DD HH:mm:ss')
                }
                const method = type === 'add' && 'equipmentFailureM/addSave' || type === 'edit' && 'equipmentFailureM/addUpdate';
                dispatch({
                    type: method,
                    payload: {
                        values: {
                            ...values
                        },
                        onComplete: () => closeModal()
                    }
                })
            })
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'equipmentFailureM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'equipmentFailureM/updateModalParams',
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
        //安装位置相关配置
        const clearAddressList = () => {
            dispatch({type: 'equipmentFailureM/clearAddressSearchParams'});
            dispatch({type: 'equipmentFailureM/getAddressList'});
        };
        const getAddressList = (name, page, size) => {
            dispatch({type: 'equipmentFailureM/updateAddressSearchParams', payload: {name, page, size}});
            dispatch({type: 'equipmentFailureM/getAddressList'});
        };
        //设备名称相关配置
        const clearEquipmentList = () => {
            dispatch({type: 'equipmentFailureM/clearEquipmentSearchParams'});
            dispatch({type: 'equipmentFailureM/getEquipmentList'});
        };
        const getEquipmentList = (name, page, size) => {
            dispatch({
                type: 'equipmentFailureM/updateEquipmentSearchParams',
                payload: {structuresId: this.modalForm.getForm().getFieldValue('structuresId'), name, page, size}
            });
            dispatch({type: 'equipmentFailureM/getEquipmentList'});
        };
        //故障类型相关配置
        const clearFaultList = () => {
            dispatch({type: 'equipmentFailureM/clearFaultSearchParams'});
            dispatch({type: 'equipmentFailureM/getFaultList'});
        };
        const getFaultList = (name, page, size) => {
            dispatch({type: 'equipmentFailureM/updateFaultSearchParams', payload: {name, page, size}});
            dispatch({type: 'equipmentFailureM/getFaultList'});
        };
        //模态框内容配置
        const detailProps = {
            userInfo,
            userList,
            detail,
            type,
            wrappedComponentRef: dom => this.modalForm = dom,
            addressSelect: {
                clear: () => clearAddressList(),
                search: (form, pagination) => getAddressList(form.name, pagination.currentPage - 1, pagination.pageSize),
                selectRow: (rows) => {
                    const {setFieldsValue} = this.modalForm.getForm();
                    setFieldsValue({'structuresId': rows.id});
                    setFieldsValue({'structuresName': rows.name});
                    getEquipmentList('', 0, 10);
                    setFieldsValue({'deviceId': ''});
                    setFieldsValue({'name': ''});
                    setFieldsValue({'code': ''});
                    setFieldsValue({'typeId': ''});
                    setFieldsValue({'typeName': ''});
                },
                name: '构筑物名称',
                tableCfg: {
                    tableData: addressSelectList,
                    tableColumns: [{
                        title: '位置',
                        dataIndex: 'name',
                        key: 'name'
                    }, {
                        title: '是否为库房',
                        dataIndex: 'isWarehouseStr',
                        key: 'isWarehouseStr'
                    }],
                    total: addressSelectTotal,
                    rowKey: record => record.id,
                },
                formCfg: [
                    {name: '构筑物名称', type: 'input', key: 'name'},
                ]
            },
            equipmentSelect: {
                clear: () => clearEquipmentList(),
                search: (form, pagination) => getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize),
                selectRow: (rows) => {
                    const {setFieldsValue} = this.modalForm.getForm();
                    setFieldsValue({'deviceId': rows.id});
                    setFieldsValue({'name': rows.name});
                    setFieldsValue({'code': rows.code});
                    setFieldsValue({'typeId': rows.typeId});
                    setFieldsValue({'typeName': rows.typeName});
                },
                name: '设备名称',
                tableCfg: {
                    tableData: equipmentSelectList,
                    tableColumns: [{
                        title: '设备编号',
                        dataIndex: 'code',
                        key: 'code'
                    }, {
                        title: '设备名称',
                        dataIndex: 'name',
                        key: 'name'
                    }],
                    total: equipmentSelectTotal,
                    rowKey: record => record.id,
                },
                formCfg: [
                    {name: '设备名称', type: 'input', key: 'name'},
                ]
            },
            faultSelect: {
                clear: () => clearFaultList(),
                search: (form, pagination) => getFaultList(form.name, pagination.currentPage - 1, pagination.pageSize),
                selectRow: (rows) => {
                    const {setFieldsValue} = this.modalForm.getForm();
                    setFieldsValue({'faultTypeId': rows.id});
                    setFieldsValue({'faultTypeName': rows.name});
                },
                name: '故障类型',
                tableCfg: {
                    tableData: faultSelectList,
                    tableColumns: [{
                        title: '设备类型',
                        dataIndex: 'codeStr',
                        key: 'codeStr'
                    }, {
                        title: '故障类型',
                        dataIndex: 'name',
                        key: 'name'
                    }],
                    total: faultSelectTotal,
                    rowKey: record => record.id
                },
                formCfg: [
                    {name: '故障类型', type: 'input', key: 'name'},
                ]
            },
            equipmentSelectList,
            equipmentSelectTotal,
            changeDetail: (target, value) => {
                dispatch({
                    type: 'equipmentFailureM/updateDetail',
                    payload: {
                        [target]: value
                    }
                })
            },
        };
        //任务下达模态框
        const closeTaskModal = () => {
            dispatch({
                type: 'equipmentFailureM/updateState',
                payload: {
                    taskId: '',
                    taskModalVisible: false
                }
            });
            this.props.form.resetFields();
        };
        const taskModal = {
            visible: taskModalVisible,
            title: '任务下达',
            maskClosable: false,
            width: 500,
            footer: [
                <Button key='submit'
                        type='primary'
                        loading={submitLoading}
                        onClick={() => {
                            this.props.form.validateFieldsAndScroll((err, values) => {
                                if (err) {
                                    message.warn("存在未填写或错误字段，无法提交");
                                    return;
                                }
                                if (typeof(values.limitDate) !== 'string') {
                                    values.limitDate = values.limitDate.format('YYYY-MM-DD')
                                }
                                dispatch({
                                    type: 'equipmentFailureM/publish',
                                    payload: {
                                        values: {
                                            ...values
                                        },
                                        onComplete: () => closeTaskModal()
                                    }
                                })
                            })
                        }}>保存</Button>
            ],
            onCancel: () => closeTaskModal()
        };
        //选择人员
        const peopleSelect = {
            style: {width: '100%'},
            treeData: userList,
            treeDefaultExpandAll: true,
            showSearch: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            onChange: (value, label, extra) => {
                if (!!value) {
                    setFieldsValue({'repareManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'repareManId': ''})
                }
            }
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['设备编号', '设备名称', '故障时间', '故障状态']}
                         gridweight={[1, 1, 1, 1]}
                         confirm={() => {
                             dispatch({
                                 type: 'equipmentFailureM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'equipmentFailureM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'equipmentFailureM/clearGridParams'});
                             dispatch({type: 'equipmentFailureM/clearSearchParams'});
                             dispatch({type: 'equipmentFailureM/pageList'})
                         }}>
                    <Input value={code}
                           onChange={(e) => changeGridParams('code', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'equipmentFailureM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'equipmentFailureM/pageList'})
                           }}
                    />
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'equipmentFailureM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'equipmentFailureM/pageList'})
                           }}
                    />
                    <RangePicker {...DateProps}/>
                    <Select {...statusSelect}>
                        {failureStatus.map(item => (
                            <Option key={item.value} value={item.value}>{item.text}</Option>
                        ))}
                    </Select>
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {buttonLimit['ADD'] && <Button icon="file-add"
                                                       onClick={() => {
                                                           updateModalParams('type', 'add');
                                                           updateModalParams('visible', true);
                                                           updateModalParams('title', '设备故障管理>新增');
                                                       }}>新增</Button>}
                        {buttonLimit['DELETE'] && <Button icon="delete"
                                                          disabled={delIds.length === 0}
                                                          onClick={() => {
                                                              Modal.confirm({
                                                                  title: null,
                                                                  content: `确定删除此${delIds.length}条数据？`,
                                                                  onOk: () => dispatch({
                                                                      type: 'equipmentFailureM/deleteEntity',
                                                                      payload: {ids: delIds.join(',')}
                                                                  })
                                                              })
                                                          }}>删除</Button>}
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                {!!visible && <Modal {...modalProps}
                                     footer={type !== 'view' ? [
                                         <Button key='submit'
                                                 type='primary'
                                                 loading={submitLoading}
                                                 onClick={() => handle(type)}>保存</Button>
                                     ] : null}
                >
                    <Detail {...detailProps}/>
                </Modal>}
                {!!taskModalVisible && <Modal {...taskModal}>
                    <Form ref={dom => this.taskModal = dom}>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_6} label="维修负责人">
                                    {getFieldDecorator('repareMan', {
                                        rules: [
                                            {required: true, message: '必填项'}
                                        ]
                                    })(
                                        <TreeSelect {...peopleSelect}/>
                                    )}
                                </FormItem>
                            </Col>
                            <span style={{display: 'none'}}>{getFieldDecorator('repareManId')(<span/>)}</span>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_6} label="限定期限">
                                    {getFieldDecorator('limitDate', {
                                        rules: [
                                            {required: true, message: '必填项'}
                                        ]
                                    })(
                                        <DatePicker style={{width: '100%'}}
                                                    format='YYYY-MM-DD'
                                                    allowClear={true}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>}
            </div>
        );
    };
}

const equipmentFailureProps = (state) => {
    return {
        equipmentFailureM: state.equipmentFailureM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['equipmentFailureM/pageList'],
        submitLoading: state.loading.effects['equipmentFailureM/addSave'] || state.loading.effects['equipmentFailureM/addUpdate']
    };
};

export default connect(equipmentFailureProps)(Form.create()(EquipmentFailure));
