import React from 'react';
import { Input, Button, Select, InputNumber, Table, Collapse, Modal, TreeSelect, message } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid, VtxUpload, VtxDatagrid } from 'vtx-ui';
const Option = Select.Option;
const { Panel } = Collapse;
const {VtxDatePicker} = VtxDate;
import _ from 'lodash';
import moment from 'moment';

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { 
            modalPropsItem, contentProps, structureList, fileListVersion, userList,
            clearEquipmentList, getEquipmentList, equipmentSelectList, equipmentSelectTotal,
            partParams, updatePartParams,
        } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, gdCode, structuresId, structuresName, deviceId, name, code, planDateStr, planMoney, reason, specificThing, chargeManName, chargeManId, 
            actMoney, actStartDay, actEndDay, actManId, actManName, details, picIds, sparePart,
            modelLonding, updateItem, onSave, onUpdate, openModal, getSparePartsList } = contentProps;
        let { searchParams, partList, partloading, partTotal, partRows, partIds, sureRows, modalVisible, countTotal } = partParams;
        let {devName, page, size} = searchParams;
        let modalProps = {
            title: id?`${title} > 编辑`:`${title} > 新增`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            if (!moment(actStartDay).isBefore(actEndDay)) {
                                message.error('开始时间必须在结束时间之前');
                                return;
                            }
                            if (sureRows.map(item => item.num).includes(undefined)) {
                                message.error('请在配件信息填写数量后再提交');
                                return;
                            }
                            if (sureRows.map(item => item.price).includes(undefined)) {
                                message.error('请在配件信息填写价格后再提交');
                                return;
                            }
                            if (id) {
                                onUpdate(0);
                            } else {
                                onSave(0);
                            }
                        }
                    })
                }}>保存</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (!moment(actStartDay).isBefore(actEndDay)) {
                            message.error('开始时间必须在结束时间之前');
                            return;
                        }
                        if (sureRows.map(item => item.num).includes(undefined)) {
                            message.error('请在配件信息填写数量后再提交');
                            return;
                        }
                        if (sureRows.map(item => item.price).includes(undefined)) {
                            message.error('请在配件信息填写价格后再提交');
                            return;
                        }
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate(1);
                            } else {
                                onSave(1);
                            }
                        }
                    })
                }}>保存并提交</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };

        
        //选择内列表配置
        const partTableColumns = [{
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
            title: '厂家',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            width: 100
        }];

        //newTable
        const openPartTableColumns = [{
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
            updatePartParams('sureRows', resultList);
            updatePartParams('countTotal', (_.sum(resultList.map(item => item.total).filter(item => !!item))).toFixed(2));
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
            updatePartParams('sureRows', resultList);
            updatePartParams('countTotal', (_.sum(resultList.map(item => item.total).filter(item => !!item))).toFixed(2));
        };


        //内容列表参数
        const getContentColumns = () => {
            return [...partTableColumns].concat([{
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
               
        };

        const contentTableProps = {
            columns: getContentColumns(),
            dataSource: sureRows,
            rowKey: record => record.id
        };

        // ------新增表格---------------
        //模态框配置
        const closeModal = () => {
            updatePartParams('searchParams', {
                devName: '',
                page: 0,
                size: 10
            });
            updatePartParams('partList', []);
            updatePartParams('partTotal', 0);
            updatePartParams('partRows', []);
            updatePartParams('partIds', []);
            updatePartParams('modalVisible', false)
        };

        //选择列表参数
        const sureAdd = () => {
            const List = _.uniqBy(sureRows.concat(partRows), 'id');
            updatePartParams('sureRows', List);
            closeModal()
        };

        const partModalProps = {
            visible: modalVisible,
            title: '配件列表 > 列表',
            maskClosable: false,
            width: 800,
            footer: [
                <Button key='cancel'
                        onClick={() => closeModal()}>取消</Button>,
                <Button key='submit'
                        type='primary'
                        onClick={() => sureAdd()}>确定</Button>
            ],
            onCancel: () => closeModal()
        };

        const tableProps = {
            loading: partloading,
            columns: openPartTableColumns,
            dataSource: partList,
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
                total: partTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    updatePartParams('searchParams', {
                        devName,
                        page: page - 1,
                        size: pageSize
                    });
                    getSparePartsList()
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    updatePartParams('searchParams', {
                        devName,
                        page: current - 1,
                        size
                    });
                    getSparePartsList()
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: partIds,
                onChange: (selectedRowKeys, selectedRows) => {
                    updatePartParams('partIds', selectedRowKeys);
                    updatePartParams('partRows', selectedRows);
                }
            }
        };


        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                        // require
                    },
                    regexp:{
                        value:photoIds
                    }
                },
                listType:"text",
                mode:'multiple',
                onSuccess(file){
                    photoIds.push({id: file.id, name: file.name});
                    updateItem({[fieldCode]: photoIds})
                },
                onRemove(file){
                    let ph = photoIds.filter(item => item.id !== file.id);
                    updateItem({[fieldCode]: ph})
                },
                fileList:photoIds?photoIds:[],
                // accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                <Panel header="基本信息" key="1">
                    <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                        <div data-modallist={{layout:{width:50,name:'工单编号',type:'text'}}}>{gdCode}</div>
                        <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                        <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                        <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>
                        <div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>
                        <div data-modallist={{layout:{width:50,name:'负责人',type:'text'}}}>{chargeManName}</div>
                        <div data-modallist={{layout:{width:50,name:'预算总价（万元）',type:'text'}}}>{planMoney}</div>
                        <Input
                            data-modallist={{
                                layout: {width: 50,name: '实际费用（万元）',require: true},
                                regexp: {
                                    value: actMoney,
                                    exp:/^[0-9]\d*(\.\d{1,4})?$/,
                                    errorMsg:'必须输入正确金额',
                                }
                            }}
                            value={actMoney}
                            addonAfter={<span style={{marginRight: '17px'}}>万元</span>}
                            onChange={e=>updateItem({actMoney:e.target.value})}
                        />
                        <VtxDatePicker 
                            data-modallist={{
                                layout:{width:50,name:'开始时间',require:true},
                                regexp:{
                                    value:actStartDay
                                }
                            }}
                            value={actStartDay}
                            showTime={true}
                            onChange={(date,dateString)=>updateItem({actStartDay: dateString})}
                            // disabledDate={date=>{
                            //     if(actStartDay && date){
                            //         return date.valueOf() > moment(actStartDay).valueOf()
                            //     }
                            //     return false
                            // }}
                        />
                        <VtxDatePicker 
                            data-modallist={{
                                layout:{width:50,name:'完成时间',require:true},
                                regexp:{
                                    value:actEndDay
                                }
                            }}
                            value={actEndDay}
                            showTime={true}
                            onChange={(date,dateString)=>updateItem({actEndDay: dateString})}
                            // disabledDate={date=>{
                            //     if(actEndDay && date){
                            //         return date.valueOf() > moment(actEndDay).valueOf()
                            //     }
                            //     return false
                            // }}
                        />
                        <TreeSelect 
                            data-modallist={{
                                layout: {width: 50,name: '执行人',require: true},
                                regexp: {
                                    value: actManName
                                }
                            }}
                            value={actManName}
                            treeData={userList}
                            treeDefaultExpandAll={true}
                            showSearch={true}
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto'
                            }}
                            onChange={(value, label, extra) => {
                                if (!!value) {
                                    updateItem({'actManId': extra.triggerNode.props.eventKey});
                                    updateItem({'actManName': value});
                                } else {
                                    updateItem({'actManId': ''});
                                    updateItem({'actManName': ''});
                                }
                            }}
                        />
                        <Input.TextArea
                            data-modallist={{
                                layout: {width: 100,name: '大修改进明细',require: true},
                                regexp: {
                                    value: details
                                }
                            }}
                            value={details}
                            onChange={e=>updateItem({details:e.target.value})}
                        />
                        <VtxUpload
                            {...uploadProps('上传文件', 'picIds', picIds)}
                        />
                    </VtxModalList>
                </Panel>
                <Panel header="配件详情" key="2">
                    <div style={{overflow: 'hidden', marginBottom: '10px'}}>
                        <Button type='primary'
                                style={{float: 'right'}}
                                onClick={() => {
                                    openModal()
                                }}
                        >新增</Button>
                    </div>
                    <div>
                        <Table {...contentTableProps} />
                        <div style={{float: 'right'}}>总计:{countTotal}</div>
                    </div>
                    {!!modalVisible && <Modal {...partModalProps}>
                    <div style={{overflow: 'hidden', padding: '10px 40px'}}>
                        <div style={{float: 'left'}}>名称:&nbsp;&nbsp;&nbsp;&nbsp;
                            <Input value={devName}
                                   style={{width: '200px'}}
                                   onChange={(e) => updatePartParams('searchParams', {
                                       devName: e.target.value,
                                       page,
                                       size
                                   })}
                            />
                        </div>
                        <div style={{float: 'right'}}>
                            <Button type='primary' onClick={() => getSparePartsList()}>查询</Button>
                            <Button style={{marginLeft: '20px'}}
                                    onClick={() => {
                                        updatePartParams('searchParams', {
                                            devName: '',
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
                </Panel>
                </Collapse>
            </VtxModal>
        )
    }
}

export default AddItem;