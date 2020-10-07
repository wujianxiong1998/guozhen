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

    // const defaultNewItem = {
    //     id: '',
    //     structuresId: '',  // 安装位置
    //     deviceId: '',  // 设备ID
    //     name: '',  // 设备名称
    //     code: '',  // 设备编码
    //     newDeviceStatus: '',  // 变更状态
    //     changeReason: '',  // 变更原因
    //     auditPeopleId: '',  // 审批人ID
    //     auditPeopleName: '',  //审批人
    // };

    render() {
        let { 
            modalPropsItem, contentProps, structureList, userList, maintainType, equipmentStatus, newStructureListSel,
            clearEquipmentList, getEquipmentList, equipmentSelectList, equipmentSelectTotal,
         } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, structuresId, newStructuresId, structuresName, deviceId, name, code, deviceStatus, newDeviceStatus, changeReason, auditPeopleId, auditPeopleName,
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
                    <VtxCombogrid 
                        clear={() => clearEquipmentList()}
                        search={(form, pagination) => structuresId?getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize):null}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    deviceId: rows.id,
                                    name: rows.name,
                                    code: rows.code,
                                    structuresId: rows.structuresId,
                                    structuresName: rows.structuresName,
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
                        value={name}
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
                    <Input
                        data-modallist={{
                            layout: {width: 50,name: '原安装位置',require: true},
                            regexp: {
                                value: structuresName
                            }
                        }}
                        value={structuresName}
                        disabled
                        onChange={e=>updateItem({structuresName:e.target.value})}
                    />
                    {/* <Select
                        value={structuresId}
                        data-modallist={{
                            layout: {width: 50,name: '原安装位置',require: true},
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
                    </Select> */}
                    <Input
                        data-modallist={{
                            layout: {width: 50,name: '设备编码',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        value={code}
                        disabled
                        onChange={e=>updateItem({code:e.target.value})}
                    />
                    <Select
                        value={newStructuresId}
                        data-modallist={{
                            layout: {width: 50,name: '新安装位置',require: true},
                            regexp: {
                                value: newStructuresId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                newStructuresId: value
                            }); 
                        }}
                    >
                        {
                            newStructureListSel.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    
                    
                    <Select
                        value={deviceStatus}
                        data-modallist={{
                            layout: {width: 50,name: '原状态',require: true},
                            regexp: {
                                value: deviceStatus
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                deviceStatus: value
                            }); 
                        }}
                    >
                        {
                            equipmentStatus.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <Select
                        value={newDeviceStatus}
                        data-modallist={{
                            layout: {width: 50,name: '新状态',require: true},
                            regexp: {
                                value: newDeviceStatus
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                newDeviceStatus: value
                            }); 
                        }}
                    >
                        {
                            equipmentStatus.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '变更原因',require: true},
                            regexp: {
                                value: changeReason
                            }
                        }}
                        value={changeReason}
                        onChange={e=>updateItem({changeReason:e.target.value})}
                    />
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '审批人',require: true},
                            regexp: {
                                value: auditPeopleName
                            }
                        }}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={auditPeopleName}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'auditPeopleId': extra.triggerNode.props.eventKey});
                                updateItem({'auditPeopleName': value});
                            } else {
                                updateItem({'auditPeopleId': ''});
                                updateItem({'designer': ''});
                            }
                        }}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;