import React from 'react';
import { Input, Button, Select, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid } from 'vtx-ui';
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;

class UpdateItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { 
            modalPropsItem, contentProps, deviceGrade, equipmentSelectList, deviceDataSource, clearEquipmentList, getEquipmentList, equipmentSelectTotal,
            clearEquipmentListD, getEquipmentListD, equipmentSelectListD, equipmentSelectTotalD,
         } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, deviceId, deviceName, grade, itemId, itemName,
            modelLonding, updateItem, onSave } = contentProps;

        let modalProps = {
            title: `${title} > 编辑`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onSave()
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
                        value={grade}
                        data-modallist={{
                            layout: {width: 100,name: '设备等级',require: true},
                            regexp: {
                                value: grade
                            }
                        }}
                        style={{display: 'inline-block', width: '50%'}}
                        onChange={(value)=>{
                            updateItem({
                                grade: value
                            }); 
                        }}
                    >
                        {
                            deviceGrade.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <VtxCombogrid 
                        clear={() => clearEquipmentList()}
                        search={(form, pagination) => getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize)}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    itemId: rows.id,
                                    itemName: rows.name,
                                }); 
                            }
                        }
                        tableCfg={{
                            tableData: equipmentSelectList,
                            tableColumns: [{
                                title: '巡检项目',
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
                            [{name: '巡检项目', type: 'input', key: 'name'},]
                        }
                        value={itemName}
                        name={'巡检项目'}
                        data-modallist={{
                            layout: {width: 100,name: '巡检项目',require: true},
                            regexp: {
                                value: itemId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                itemId: value
                            }); 
                        }}
                    />
                    <VtxCombogrid 
                        clear={() => clearEquipmentListD()}
                        search={(form, pagination) => getEquipmentListD(form.name, pagination.currentPage - 1, pagination.pageSize)}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    deviceId: rows.id,
                                    deviceName: rows.name,
                                }); 
                            }
                        }
                        tableCfg={{
                            tableData: equipmentSelectListD,
                            tableColumns: [{
                                title: '设备名称',
                                dataIndex: 'name',
                                key: 'name'
                            }, {
                                title: '安装位置',
                                dataIndex: 'structuresName',
                                key: 'structuresName'
                            }],
                            total: equipmentSelectTotalD,
                            rowKey: record => record.id,
                        }}
                        formCfg={
                            [{name: '设备名称', type: 'input', key: 'name'},]
                        }
                        value={deviceName}
                        name={'设备名称'}
                        data-modallist={{
                            layout: {width: 100,name: '设备名称',require: true},
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
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default UpdateItem;