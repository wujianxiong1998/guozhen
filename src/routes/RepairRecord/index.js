import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid} from "vtx-ui";
import {Input, Button, Modal, message, DatePicker, Select, Popconfirm, Tooltip, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";

moment.locale('zh-cn');
const {RangePicker} = DatePicker;
const Option = Select.Option;

class RepairRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {dispatch, repairRecordM, accessControlM, loading} = this.props;
        const {gridParams, searchParams, dataList, dataTotal, delIds, modalParams} = repairRecordM;
        const {code, name, startDay, endDay} = gridParams;
        const {page, size} = searchParams;
        const {visible, title, detail} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['repaiRecord'.toLowerCase()]) {
            buttonLimit = accessControlM['repaiRecord'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'repairRecordM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'repairRecordM/updateSearchParams',
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
                dispatch({type: 'repairRecordM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
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
                title: '上报人',
                dataIndex: 'reportMan',
                key: 'reportMan',
                nowrap: true
            }, {
                title: '故障类型',
                dataIndex: 'faultTypeName',
                key: 'faultTypeName',
                nowrap: true
            }, {
                title: '故障详情',
                dataIndex: 'details',
                key: 'details',
                nowrap: true
            }, {
                title: '上报时间',
                dataIndex: 'breakdownTimeStr',
                key: 'breakdownTimeStr',
                nowrap: true
            }, {
                title: '维修人',
                dataIndex: 'repareMan',
                key: 'repareMan',
                nowrap: true
            }, {
                title: '完成时间',
                dataIndex: 'completeTimeStr',
                key: 'completeTimeStr',
                nowrap: true
            }, {
                title: '维修费用',
                dataIndex: 'reparePrice',
                key: 'reparePrice',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'dealStatusStr',
                key: 'dealStatusStr',
                render: (text, rowData) => {
                    return (
                        <div>
                            {rowData.dealStatus === -1 ? <span>
                                <Tooltip title={rowData.auditMemo} trigger='click'>
                                    <a>{text}</a>
                                </Tooltip>
                            </span> : <span>{text}</span>}
                        </div>
                    
                    )
                }
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
                                                              updateModalParams('title', '维修记录管理>查看');
                                                              dispatch({
                                                                  type: 'repairRecordM/getDetail',
                                                                  payload: {id: rowData.id}
                                                              })
                                                          }}/>}
                            {buttonLimit['DELETE'] && <span>
                                <span className='ant-divider'/>
                                {
                                    delPopconfirm(() => dispatch({
                                        type: 'repairRecordM/deleteEntity',
                                        payload: {ids: rowData.id}
                                    }))
                                }
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
                        type: 'repairRecordM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'repairRecordM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'repairRecordM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'repairRecordM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'repairRecordM/updateState',
                    payload: {delIds: selectedRowKeys}
                })
            }
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'repairRecordM/clearModalParams'});
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'repairRecordM/updateModalParams',
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
            detail
        };
        
        return (
            <div className="main_page">
                <VtxGrid titles={['设备编号', '设备名称', '上报时间']}
                         gridweight={[1, 1, 2]}
                         confirm={() => {
                             dispatch({
                                 type: 'repairRecordM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'repairRecordM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'repairRecordM/clearGridParams'});
                             dispatch({type: 'repairRecordM/clearSearchParams'});
                             dispatch({type: 'repairRecordM/pageList'})
                         }}>
                    <Input value={code}
                           onChange={(e) => changeGridParams('code', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'repairRecordM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'repairRecordM/pageList'})
                           }}
                    />
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'repairRecordM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'repairRecordM/pageList'})
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
                                                                      type: 'repairRecordM/deleteEntity',
                                                                      payload: {ids: delIds.join(',')}
                                                                  })
                                                              })
                                                          }}>删除</Button>}
                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                {!!visible && <Modal {...modalProps} className="bigModal">
                    <Detail {...detailProps}/>
                </Modal>}
            </div>
        );
    };
}

const faultTypeProps = (state) => {
    return {
        repairRecordM: state.repairRecordM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['repairRecordM/pageList']
    };
};

export default connect(faultTypeProps)(RepairRecord);
