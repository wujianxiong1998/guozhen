import React from 'react';
import moment from 'moment';
import {Button, Input, Modal, Table, InputNumber} from 'antd';
import {VtxDatagrid} from 'vtx-ui';
import 'moment/locale/zh-cn';
import _ from 'lodash';

moment.locale('zh-cn');

export default class SpareParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, searchParams, sparePartsList, sparePartsTotal, sparePartsRows, sparePartsIds, sureRows, modalVisible, updateSparePartsParams, getSparePartsList, sparePartsLoading, from} = this.props;
        const {name, page, size} = searchParams;
        //选择内列表配置
        const columns = !!from && from === 'repairTask' ? [{
            title: '规格型号',
            dataIndex: 'modelNum',
            key: 'modelNum',
            width: 100
        }, {
            title: '生产厂家',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            width: 100
        }] : [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 100
        }, {
            title: '规格型号',
            dataIndex: 'modelNum',
            key: 'modelNum',
            width: 100
        }, {
            title: '用途',
            dataIndex: 'usedBy',
            key: 'usedBy',
            width: 100
        }, {
            title: '生产厂家',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            width: 100
        }, {
            title: '联系方式',
            dataIndex: 'contact',
            key: 'contact',
            width: 100
        }, {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
            width: 100
        }];
        
        //删除已确认列表
        const delContentItem = (id) => {
            const resultList = [...sureRows].map(item => {
                if (item.id !== id) {
                    return item;
                }
            }).filter(item => !!item);
            updateSparePartsParams('sureRows', resultList);
            updateSparePartsParams('countTotal', (_.sum(resultList.map(item => item.total).filter(item => !!item))).toFixed(2));
        };
        //修改已确认列表
        const changeSureRows = (id, target, value) => {
            const resultList = [...sureRows].map(item => {
                if (item.id === id) {
                    if (target === 'num' && !!item.price) {
                        return {
                            ...item,
                            [target]: value,
                            total: value * item.price
                        }
                    }
                    if (target === 'price' && !!item.num) {
                        return {
                            ...item,
                            [target]: value,
                            total: value * item.num
                        }
                    }
                    return {
                        ...item,
                        [target]: value
                    }
                } else {
                    return {
                        ...item
                    }
                }
            });
            updateSparePartsParams('sureRows', resultList);
            updateSparePartsParams('countTotal', (_.sum(resultList.map(item => item.total).filter(item => !!item))).toFixed(2));
        };
        //内容列表参数
        const getContentColumns = () => {
            if (type !== 'view' && type !== 'examine') {
                if (!!from && from === 'repairTask') {
                    return [...columns].concat([{
                        title: '数量',
                        dataIndex: 'num',
                        key: 'num',
                        width: 100,
                        render: (text, record) => (
                            <InputNumber value={text}
                                         style={{width: '100px'}}
                                         min={1} step={1}
                                         onChange={(value) => changeSureRows(record.id, 'num', value)}/>)
                    }, {
                        title: '价格',
                        dataIndex: 'price',
                        key: 'price',
                        width: 100,
                        render: (text, record) => (
                            <InputNumber value={text}
                                         style={{width: '100px'}}
                                         min={0.01} precision={2} step={0.01}
                                         onChange={(value) => changeSureRows(record.id, 'price', value)}/>)
                    }, {
                        title: '小计',
                        dataIndex: 'total',
                        key: 'total',
                        width: 100
                    }, {
                        title: '操作',
                        dataIndex: 'edit',
                        key: 'edit',
                        width: 100,
                        render: (text, rowData) => (
                            <a onClick={() => delContentItem(rowData.id)}>删除</a>
                        )
                    }])
                } else {
                    return [...columns].concat([{
                        title: '操作',
                        dataIndex: 'edit',
                        key: 'edit',
                        render: (text, rowData) => (
                            <a onClick={() => delContentItem(rowData.id)}>删除</a>
                        )
                    }])
                }
            } else {
                if (!!from && from === 'repairTask') {
                    return [...columns].concat([{
                        title: '数量',
                        dataIndex: 'num',
                        key: 'num'
                    }, {
                        title: '价格',
                        dataIndex: 'price',
                        key: 'price'
                    }, {
                        title: '小计',
                        dataIndex: 'total',
                        key: 'total'
                    }])
                } else {
                    return [...columns]
                }
            }
        };
        const contentTableProps = {
            columns: getContentColumns(),
            dataSource: sureRows,
            rowKey: record => record.id
        };
        //选择列表参数
        const sureAdd = () => {
            const List = _.uniqBy(sureRows.concat(sparePartsRows), 'id');
            updateSparePartsParams('sureRows', List);
            closeModal()
        };
        const tableProps = {
            loading: sparePartsLoading,
            columns,
            dataSource: sparePartsList,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 600,
            },
            startIndex: page * size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: sparePartsTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    updateSparePartsParams('searchParams', {
                        name,
                        page: page - 1,
                        size: pageSize
                    });
                    getSparePartsList()
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    updateSparePartsParams('searchParams', {
                        name,
                        page: current - 1,
                        size
                    });
                    getSparePartsList()
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: sparePartsIds,
                onChange: (selectedRowKeys, selectedRows) => {
                    updateSparePartsParams('sparePartsIds', selectedRowKeys);
                    updateSparePartsParams('sparePartsRows', selectedRows);
                }
            }
        };
        
        //模态框配置
        const closeModal = () => {
            updateSparePartsParams('searchParams', {
                name: '',
                page: 0,
                size: 10
            });
            updateSparePartsParams('sparePartsList', []);
            updateSparePartsParams('sparePartsTotal', 0);
            updateSparePartsParams('sparePartsRows', []);
            updateSparePartsParams('sparePartsIds', []);
            updateSparePartsParams('modalVisible', false)
        };
        const modalProps = {
            visible: modalVisible,
            title: '备品备件>列表',
            maskClosable: false,
            width: 700,
            footer: [
                <Button key='cancel'
                        onClick={() => closeModal()}>取消</Button>,
                <Button key='submit'
                        type='primary'
                        onClick={() => sureAdd()}>确定</Button>
            ],
            onCancel: () => closeModal()
        };
        
        return (
            <div>
                {(type !== 'view' && type !== 'examine') && <div style={{overflow: 'hidden', marginBottom: '10px'}}>
                    <Button type='primary'
                            style={{float: 'right'}}
                            onClick={() => getSparePartsList()}
                    >新增</Button>
                </div>}
                <div>
                    <Table {...contentTableProps}/>
                </div>
                {!!modalVisible && <Modal {...modalProps}>
                    <div style={{overflow: 'hidden', padding: '10px 40px'}}>
                        <div style={{float: 'left'}}>名称:&nbsp;&nbsp;&nbsp;&nbsp;
                            <Input value={name}
                                   style={{width: '200px'}}
                                   onChange={(e) => updateSparePartsParams('searchParams', {
                                       name: e.target.value,
                                       page,
                                       size
                                   })}
                            />
                        </div>
                        <div style={{float: 'right'}}>
                            <Button type='primary' onClick={() => getSparePartsList()}>查询</Button>
                            <Button style={{marginLeft: '20px'}}
                                    onClick={() => {
                                        updateSparePartsParams('searchParams', {
                                            name: '',
                                            page: 0,
                                            size: 10
                                        });
                                        getSparePartsList()
                                    }}>清空</Button>
                        </div>
                    </div>
                    <div style={{height: '400px'}}>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </Modal>}
            </div>
        );
    };
}
