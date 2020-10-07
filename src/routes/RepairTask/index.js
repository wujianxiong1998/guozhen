import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, DatePicker, Select, Popconfirm, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const Option = Select.Option;

class RepairTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, repairTaskM, accessControlM, loading, submitLoading, sparePartsLoading} = this.props;
        const {userInfo, userList, repairType, gridParams, searchParams, dataList, dataTotal, delIds, modalParams, sparePartsParams} = repairTaskM;
        const {code, name, startDay, endDay} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['repairTask'.toLowerCase()]) {
            buttonLimit = accessControlM['repairTask'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'repairTaskM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'repairTaskM/updateSearchParams',
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
                dispatch({type: 'repairTaskM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '工单编号',
                dataIndex: 'code',
                key: 'code',
                nowrap: true
            }, {
                title: '设备编号',
                dataIndex: 'deviceCode',
                key: 'deviceCode',
                nowrap: true
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
                nowrap: true
            }, {
                title: '故障详情',
                dataIndex: 'details',
                key: 'details',
                nowrap: true
            }, {
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan',
                nowrap: true
            }, {
                title: '上报时间',
                dataIndex: 'breakdownTimeStr',
                key: 'breakdownTimeStr',
                nowrap: true
            }, {
                title: '维修人员',
                dataIndex: 'repareMan',
                key: 'repareMan',
                nowrap: true
            }, {
                title: '限定时间',
                dataIndex: 'limitDate',
                key: 'limitDate',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'dealStatusStr',
                key: 'dealStatusStr',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => {
                    return (
                        <div>
                            {buttonLimit['VIEW'] && <Icon type='view'
                                                          title='查看'
                                                          onClick={() => {
                                                              updateModalParams('type', 'view');
                                                              updateModalParams('title', '维修任务管理>查看');
                                                              dispatch({
                                                                  type: 'repairTaskM/getDetail',
                                                                  payload: {id: rowData.id}
                                                              })
                                                          }}/>}
                            {rowData.dealStatus === 'waitRepare' && buttonLimit['RECEIPT'] &&
                            <span>
                                <span className='ant-divider'/>
                                <Icon type='refresh'
                                      title='回单'
                                      onClick={() => {
                                          updateModalParams('type', 'receipt');
                                          updateModalParams('title', '维修任务管理>回单');
                                          dispatch({type: 'repairTaskM/getDetail', payload: {id: rowData.id}})
                                      }}/>
                                </span>
                            }
                            {rowData.dealStatus === 'waitAudit' && buttonLimit['EXAMINE'] &&
                            <span>
                                <span className='ant-divider'/>
                                <Icon type='examine'
                                      title='审核'
                                      onClick={() => {
                                          updateModalParams('type', 'examine');
                                          updateModalParams('title', '维修任务管理>审核');
                                          dispatch({type: 'repairTaskM/getDetail', payload: {id: rowData.id}})
                                      }}/>
                            </span>
                            }
                            {rowData.dealStatus === 'waitRepare' && buttonLimit['DELETE'] &&
                            <span>
                                <span className='ant-divider'/>
                                {
                                    delPopconfirm(() => dispatch({
                                        type: 'repairTaskM/deleteEntity',
                                        payload: {ids: rowData.id}
                                    }))
                                }
                            </span>
                            }
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
                        type: 'repairTaskM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'repairTaskM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'repairTaskM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'repairTaskM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => {
                    const allowDelIds = selectedRows.map(item => {
                        if (item.dealStatus === 'waitRepare') {
                            return item.id
                        }
                    }).filter(item => !!item);
                    if (allowDelIds.length < selectedRowKeys.length) {
                        message.info('非待维修状态数据不能删除')
                    }
                    dispatch({
                        type: 'repairTaskM/updateState',
                        payload: {
                            delIds: allowDelIds
                        }
                    })
                }
            }
        };
        //新增或编辑
        const handle = (type, target) => {
            const childForm = this.modalForm.getForm();
            childForm.validateFieldsAndScroll((err, values) => {
                const {sureRows, countTotal} = sparePartsParams;
                const sureTotal = [...sureRows].map(item => item.total).filter(item => !!item);
                if (err) {
                    message.warn("存在未填写或错误字段，无法保存或提交");
                    return;
                }
                if (sureTotal.length < sureRows.length) {
                    message.warn("请在配件信息填写完全后再提交");
                    return;
                }
                if (typeof(values.completeTime) !== 'string') {
                    values.completeTime = values.completeTime.format('YYYY-MM-DD HH:mm:ss')
                }
                if (type === 'receipt') {
                    dispatch({
                        type: 'repairTaskM/publish',
                        payload: {
                            values: {
                                ...values,
                                sparePart: JSON.stringify([...sureRows].map((item, index) => {
                                    return {
                                        orderIndex: index,
                                        id: item.id,
                                        modelNum: item.modelNum,
                                        manufacturer: item.manufacturer,
                                        name: item.name,
                                        num: item.num.toString(),
                                        price: item.price.toString(),
                                        total: item.total.toString()
                                    }
                                })),
                                status: target,
                                countTotal
                            },
                            onComplete: () => closeModal()
                        }
                    })
                } else if (type === 'examine') {
                    if (!values.auditMemo && target === -1) {
                        message.info('请填写审核失败原因');
                        return;
                    }
                    dispatch({
                        type: 'repairTaskM/audit',
                        payload: {
                            values: {
                                auditMemo: values.auditMemo,
                                auditStatus: target
                            },
                            onComplete: () => closeModal()
                        }
                    })
                }
            })
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'repairTaskM/clearModalParams'});
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'repairTaskM/updateModalParams',
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
            width: '100%',
            footer: null,
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            detail,
            type,
            userInfo,
            userList,
            repairType,
            handle,
            submitLoading,
            wrappedComponentRef: dom => this.modalForm = dom,
            changeDetail: (target, value) => {
                dispatch({
                    type: 'repairTaskM/updateDetail',
                    payload: {
                        [target]: value
                    }
                })
            },
            sparePartsParams,
            updateSparePartsParams: (target, value) => {
                dispatch({
                    type: 'repairTaskM/updateSparePartsParams',
                    payload: {
                        [target]: value
                    }
                })
            },
            getSparePartsList: () => {
                dispatch({
                    type: 'repairTaskM/updateSparePartsParams',
                    payload: {
                        modalVisible: true
                    }
                });
                dispatch({type: 'repairTaskM/getSparePartsList'})
            },
            sparePartsLoading
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['设备编号', '设备名称', '上报时间']}
                         gridweight={[1, 1, 2]}
                         confirm={() => {
                             dispatch({
                                 type: 'repairTaskM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'repairTaskM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'repairTaskM/clearGridParams'});
                             dispatch({type: 'repairTaskM/clearSearchParams'});
                             dispatch({type: 'repairTaskM/pageList'})
                         }}>
                    <Input value={code}
                           onChange={(e) => changeGridParams('code', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'repairTaskM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'repairTaskM/pageList'})
                           }}
                    />
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'repairTaskM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'repairTaskM/pageList'})
                           }}
                    />
                    <RangePicker {...DateProps}/>
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {buttonLimit['DELETE'] && <Button icon="delete"
                                                          disabled={delIds.length === 0}
                                                          onClick={() => {
                                                              Modal.confirm({
                                                                  title: null,
                                                                  content: `确定删除此${delIds.length}条数据？`,
                                                                  onOk: () => dispatch({
                                                                      type: 'repairTaskM/deleteEntity',
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
                                     className="bigModal"
                                     footer={type === 'view' && null || type === 'receipt' && [
                                         <Button key='cancel'
                                                 loading={submitLoading}
                                                 onClick={() => handle(type, 0)}>保存</Button>,
                                         <Button key='submit'
                                                 type='primary'
                                                 loading={submitLoading}
                                                 onClick={() => handle(type, 1)}>保存并提交</Button>
                                     ]}
                >
                    <Detail {...detailProps}/>
                </Modal>}
            </div>
        );
    };
}

const repairTaskProps = (state) => {
    return {
        repairTaskM: state.repairTaskM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['repairTaskM/pageList'],
        submitLoading: state.loading.effects['repairTaskM/addSave'] || state.loading.effects['repairTaskM/addUpdate'],
        sparePartsLoading: state.loading.effects['repairTaskM/getSparePartsList']
    };
};

export default connect(repairTaskProps)(RepairTask);
