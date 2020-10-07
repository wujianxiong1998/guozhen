import React from 'react';
import moment from 'moment';
import {Input, Button, Select, TreeSelect} from 'antd';
import {VtxModal, VtxModalList, VtxDate, VtxUpload, VtxCombogrid} from 'vtx-ui';

const Option = Select.Option;
const {VtxUpload2} = VtxUpload;
const {VtxDatePicker} = VtxDate;

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.lis1 = null;
    }
    
    render() {
        let {
            modalPropsItem, contentProps, fileListVersion,
            structureList, clearEquipmentList, getEquipmentList, equipmentSelectList, equipmentSelectTotal, userList, projectNameNew,
        } = this.props;
        let {title, visible, onCancel, width} = modalPropsItem;
        let {
            id, structuresId, deviceId, deviceName, itemId, inspectionManId, inspectionTime, inspectionAbnormal, fileIds, inspectionMan,
            modelLonding, updateItem, onSave, onUpdate
        } = contentProps;
        
        let modalProps = {
            title: id ? `${title} > 编辑` : `${title} > 新增`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate()
                            } else {
                                onSave()
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
        
        // 这是传id和name
        // let uploadProps = (name,fieldCode,photoIds,require = true)=>{
        //     return {
        //         action:"/cloudFile/common/uploadFile",
        //         downLoadURL:'/cloudFile/common/downloadFile?id=',
        //         "data-modallist":{
        //             layout:{
        //                 width:100,
        //                 name,
        //                 // require
        //             },
        //             regexp:{
        //                 value:photoIds
        //             }
        //         },
        //         listType:"picture-card",
        //         mode:'multiple',
        //         onSuccess(file){
        //             photoIds.push({id: file.id, name: file.name});
        //             updateItem({[fieldCode]: photoIds})
        //         },
        //         onRemove(file){
        //             let ph = photoIds.filter(item => item.id !== file.id);
        //             updateItem({[fieldCode]: ph})
        //         },
        //         fileList:photoIds?photoIds:[],
        //         accept:'image/png, image/jpeg, image/jpg',
        //         fileListVersion,
        //     }
        // }
        
        // 这是传id的
        let uploadProps = (name, fieldCode, photoIds, require = true) => {
            return {
                action: "/cloudFile/common/uploadFile",
                downLoadURL: '/cloudFile/common/downloadFile?id=',
                "data-modallist": {
                    layout: {
                        width: 100,
                        name,
                        require
                    },
                    regexp: {
                        value: photoIds
                    }
                },
                listType: "picture-card",
                mode: 'multiple',
                onSuccess(file) {
                    let ids = photoIds ? photoIds.split(',') : [];
                    ids.push(file.id);
                    updateItem({[fieldCode]: ids.join(',')})
                },
                onRemove(file) {
                    let ids = photoIds.split(',');
                    ids.splice(ids.indexOf(file.id), 1);
                    updateItem({[fieldCode]: ids.join(',')})
                },
                fileList: photoIds ? photoIds.split(',').map(item => ({id: item, name: item})) : [],
                accept: 'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <Select
                        value={structuresId}
                        data-modallist={{
                            layout: {width: 50, name: '安装位置', require: true},
                            regexp: {
                                value: structuresId
                            }
                        }}
                        onChange={(value) => {
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
                        search={(form, pagination) => structuresId ? getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize) : null}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    deviceId: rows.id,
                                    deviceName: rows.name,
                                    grade: rows.grade,
                                });
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
                        value={deviceName}
                        name={'设备名称'}
                        data-modallist={{
                            layout: {width: 50, name: '设备名称', require: true},
                            regexp: {
                                value: deviceId
                            }
                        }}
                        onChange={(value) => {
                            updateItem({
                                deviceId: value
                            });
                        }}
                    />
                    <Select
                        value={itemId}
                        data-modallist={{
                            layout: {width: 50, name: '巡检项目', require: true},
                            regexp: {
                                value: itemId
                            }
                        }}
                        onChange={(value) => {
                            updateItem({
                                itemId: value
                            });
                        }}
                    >
                        {
                            projectNameNew.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <TreeSelect
                        data-modallist={{
                            layout: {width: 50, name: '巡检人员', require: true},
                            regexp: {
                                value: inspectionMan
                            }
                        }}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={inspectionMan}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'inspectionManId': extra.triggerNode.props.eventKey});
                                updateItem({'inspectionMan': value});
                            } else {
                                updateItem({'inspectionManId': ''});
                                updateItem({'inspectionMan': ''});
                            }
                        }}
                    />
                    <VtxDatePicker
                        data-modallist={{
                            layout: {width: 50, name: '巡检时间', require: true},
                            regexp: {
                                value: inspectionTime
                            }
                        }}
                        value={inspectionTime}
                        showTime={true}
                        onChange={(date, dateString) => updateItem({inspectionTime: dateString})}
                        // disabledDate={date=>{
                        //     if(inspectionTime && date){
                        //         return date.valueOf() > moment(inspectionTime).valueOf()
                        //     }
                        //     return false
                        // }}
                    />
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100, name: '巡检异常', require: true},
                            regexp: {
                                value: inspectionAbnormal
                            }
                        }}
                        value={inspectionAbnormal}
                        onChange={e => updateItem({inspectionAbnormal: e.target.value})}
                    />
                    <VtxUpload2
                        {...uploadProps('附件', 'fileIds', fileIds)}
                    />
                </VtxModalList>
            
            </VtxModal>
        )
    }
}

export default AddItem;
