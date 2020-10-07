import React from 'react';
import { Input, Button, Select, InputNumber, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid } from 'vtx-ui';
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;
import moment from 'moment';

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let {
            modalPropsItem, contentProps, structureList, userList, maintainType,
            clearEquipmentList, getEquipmentList, equipmentSelectList, equipmentSelectTotal,
         } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, structuresId, deviceId, deviceName, maintainDate, period, part, type, content, designerId, designer, chargeManId, chargeMan,
            modelLonding, updateItem, onSave, onUpdate } = contentProps;

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
                            if (id) {
                                onUpdate();
                            } else {
                                onSave();
                            }
                        }
                    })
                }}>保存</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <Select
                        value={structuresId}
                        data-modallist={{
                            layout: {width: 50,name: '安装位置',require: true},
                            regexp: {
                                value: structuresId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                structuresId: value
                            });
                        }}
                    >
                        {
                            structureList.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <VtxCombogrid
                        clear={() => clearEquipmentList()}
                        search={(form, pagination) => structuresId?getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize):null}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    deviceId: rows.id,
                                    deviceName: rows.name,
                                });
                            }
                        }
                        tableCfg={{
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
                        }}
                        formCfg={
                            [{name: '设备名称', type: 'input', key: 'name'},]
                        }
                        value={deviceName}
                        name={'设备名称'}
                        data-modallist={{
                            layout: {width: 50,name: '设备名称',require: true},
                            regexp: {
                                value: deviceId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                deviceId: value
                            });
                        }}
                    />
                    <VtxDatePicker
                        data-modallist={{
                            layout:{width:50,name:'起始日期',require:true},
                            regexp:{
                                value:maintainDate
                            }
                        }}
                        value={maintainDate}
                        showTime={true}
                        onChange={(date,dateString)=>updateItem({maintainDate: dateString})}
                        // disabledDate={date=>{
                        //     if(maintainDate && date){
                        //         return date.valueOf() > moment(maintainDate).valueOf()
                        //     }
                        //     return false
                        // }}
                    />
                    <InputNumber
                        data-modallist={{
                            layout: {width: 50,name: '养护周期',require: true},
                            regexp: {
                                value: period,
                            }
                        }}
                        value={period}
                        min={1}
                        precision={0}
                        onChange={value=>updateItem({period: value})}
                    />
                    <Input
                        data-modallist={{
                            layout: {width: 50,name: '养护部位',require: true},
                            regexp: {
                                value: part,
                            }
                        }}
                        value={part}
                        onChange={e=>updateItem({part: e.target.value})}
                    />
                    <Select
                        value={type}
                        data-modallist={{
                            layout: {width: 50,name: '养护类别',require: true},
                            regexp: {
                                value: type
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                type: value
                            });
                        }}
                    >
                        {
                            maintainType.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '养护内容',require: true},
                            regexp: {
                                value: content
                            }
                        }}
                        value={content}
                        onChange={e=>updateItem({content:e.target.value})}
                    />
                    <TreeSelect
                        data-modallist={{
                            layout: {width: 50,name: '计划制定人',require: true},
                            regexp: {
                                value: designer
                            }
                        }}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={designer}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'designerId': extra.triggerNode.props.eventKey});
                                updateItem({'designer': value});
                            } else {
                                updateItem({'designerId': ''});
                                updateItem({'designer': ''});
                            }
                        }}
                    />
                    <TreeSelect
                        data-modallist={{
                            layout: {width: 50,name: '责任人',require: true},
                            regexp: {
                                value: chargeMan
                            }
                        }}
                        value={chargeMan}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'chargeManId': extra.triggerNode.props.eventKey});
                                updateItem({'chargeMan': value});
                            } else {
                                updateItem({'chargeManId': ''});
                                updateItem({'chargeMan': ''});
                            }
                        }}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;
