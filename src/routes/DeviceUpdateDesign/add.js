import React from 'react';
import { Input, Button, Select, InputNumber, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid, VtxUpload } from 'vtx-ui';
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
            modalPropsItem, contentProps, structureList, fileListVersion, userList,
            clearEquipmentList, getEquipmentList, equipmentSelectList, equipmentSelectTotal,
         } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, structuresId, structuresName, deviceId, name, code, planDateStr, planMoney, reason, specificThing, picIds,
            chargeManName, chargeManId, planId,
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
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate(1);
                            } else {
                                onSave(1);
                            }
                        }
                    })
                }}>保存并提交审核</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
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
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    {planId?<div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>:
                    <Select
                        value={structuresId}
                        data-modallist={{
                            layout: {width: 50,name: '安装位置',require: false},
                            regexp: {
                                value: structuresId
                            }
                        }}
                        showSearch={true}
                        optionFilterProp={"children"}
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
                    </Select>}
                    {planId?<div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>:
                    <VtxCombogrid 
                        clear={() => clearEquipmentList()}
                        search={(form, pagination) => structuresId?getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize):null}
                        selectRow={
                            (rows) => {
                                if (rows.id === deviceId) {
                                    updateItem({
                                        deviceId: '',  
                                        name: '',  
                                        code: '',  
                                    });
                                } else {
                                    updateItem({
                                        deviceId: rows.id,
                                        name: rows.name,
                                        code: rows.code
                                    });
                                }
                            }
                        }
                        tableCfg={{
                            tableData: equipmentSelectList,
                            tableColumns: [{
                                title: '设备名称',
                                dataIndex: 'name',
                                key: 'name'
                            }, {
                                title: '安装位置',
                                dataIndex: 'structuresName',
                                key: 'structuresName'
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
                            layout: {width: 50,name: '设备名称',require: false},
                            regexp: {
                                value: deviceId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                deviceId: value
                            }); 
                        }}
                    />}
                    {planId?<div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>:
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '设备编码',require: false},
                            regexp: {
                                value: code,
                            }
                        }}
                        disabled={true}
                        value={code}
                        onChange={e=>updateItem({code: e.target.value})}
                    />}
                    {planId?<div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>:
                    <VtxDatePicker 
                        data-modallist={{
                            layout:{width:50,name:'计划执行时间',require:true},
                            regexp:{
                                value:planDateStr
                            }
                        }}
                        value={planDateStr}
                        showTime={true}
                        onChange={(date,dateString)=>updateItem({planDateStr: dateString})}
                        disabledDate={date=>{
                            if(planDateStr && date){
                                return date.valueOf() > moment(planDateStr).valueOf()
                            }
                            return false
                        }}
                    />}
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '养护人',require: true},
                            regexp: {
                                value: chargeManName
                            }
                        }}
                        value={chargeManName}
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
                                updateItem({'chargeManName': value});
                            } else {
                                updateItem({'chargeManId': ''});
                                updateItem({'chargeManName': ''});
                            }
                        }}
                    />
                    <Input
                        data-modallist={{
                            layout: {width: 50,name: '预算总价(万元)',require: true},
                            regexp: {
                                value: planMoney,
                                exp:/^[1-9]\d*(\.\d{1,4})?$/,
                                errorMsg:'必须输入正确金额',
                            }
                        }}
                        value={planMoney}
                        addonAfter="万元"
                        onChange={e=>updateItem({planMoney:e.target.value})}
                    />
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '原因描述',require: true},
                            regexp: {
                                value: reason
                            }
                        }}
                        value={reason}
                        onChange={e=>updateItem({reason:e.target.value})}
                    />
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '具体事项',require: true},
                            regexp: {
                                value: specificThing
                            }
                        }}
                        value={specificThing}
                        onChange={e=>updateItem({specificThing:e.target.value})}
                    />
                    <VtxUpload
                        {...uploadProps('上传文件', 'picIds', picIds)}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;