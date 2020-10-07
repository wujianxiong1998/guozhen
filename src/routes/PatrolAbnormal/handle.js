import React from 'react';
import { Input, Button, Select, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxUpload, VtxCombogrid } from 'vtx-ui';
import styles from './styles.less';
const Option = Select.Option;
const {VtxUpload2} = VtxUpload;
const {VtxDatePicker} = VtxDate;

class HandleItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, fileListVersion, userList, clearEquipmentList, getEquipmentList, faultSelectList, faultSelectTotal, getViewDateSource } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { structuresName, deviceName, deviceCode, inspectionMan, inspectionAbnormal, fileIds } = getViewDateSource;
        
        // let { id, structuresName, deviceName, deviceCode, inspectionMan, inspectionAbnormal,
        //     modelLonding, updateItem, ignore, build } = contentProps;
        let { id, actInspectionManId, actInspectionMan, faultTypeId, faultTypeName, limitDate,
            modelLonding, updateItem, onSave } = contentProps;
        let modalProps = {
            title: `${title} > 处理`,
            visible: visible,
            footer: <div>
                {/* <Button type='default' onClick={onCancel}>取消</Button> */}
                {/* <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            ignore()
                        }
                    })
                }}>忽略</Button> */}
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onSave()
                        }
                    })
                }}>生成故障</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };

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
        //             // regexp:{
        //             //     value:photoIds
        //             // }
        //         },
        //         listType:"picture-card",
        //         viewMode:true,
        //         // onSuccess(file){
        //         //     photoIds.push({id: file.id, name: file.name});
        //         //     updateItem({[fieldCode]: photoIds})
        //         // },
        //         // onRemove(file){
        //         //     let ph = photoIds.filter(item => item.id !== file.id);
        //         //     updateItem({[fieldCode]: ph})
        //         // },
        //         fileList:photoIds?photoIds:[],
        //         accept:'image/png, image/jpeg, image/jpg',
        //         fileListVersion,
        //     }
        // }
        // 这是传id的
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
                    // regexp:{
                    //     value:photoIds
                    // }
                },
                listType:"picture-card",
                mode:'multiple',
                viewMode:true,
                // onSuccess(file){
                //     let ids = photoIds?photoIds.split(','):[];
                //     ids.push(file.id);
                //     updateItem({[fieldCode]:ids.join(',')})
                // },
                // onRemove(file){
                //     let ids = photoIds.split(',');
                //     ids.splice(ids.indexOf(file.id),1);
                //     updateItem({[fieldCode]:ids.join(',')})
                // },
                fileList:photoIds?photoIds.split(',').map(item=>({id:item,name:item})):[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{deviceCode}</div>
                    <div data-modallist={{layout:{width:50,name:'上报人',type:'text'}}}>{inspectionMan}</div>
                    <div data-modallist={{layout:{width:50,name:'故障详情',type:'text'}}}>{inspectionAbnormal}</div>
                    <VtxUpload2
                        {...uploadProps('附件上传','fileIds', fileIds)}
                    />
                    <VtxCombogrid 
                        clear={() => clearEquipmentList()}
                        search={(form, pagination) => getEquipmentList(form.name, pagination.currentPage - 1, pagination.pageSize)}
                        selectRow={
                            (rows) => {
                                updateItem({
                                    faultTypeId: rows.id,
                                    faultTypeName: rows.name,
                                }); 
                            }
                        }
                        tableCfg={{
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
                            rowKey: record => record.id,
                        }}
                        formCfg={
                            [{name: '故障类型', type: 'input', key: 'name'},]
                        }
                        value={faultTypeName}
                        name={'故障类型'}
                        data-modallist={{
                            layout: {width: 50,name: '故障类型',require: true},
                            regexp: {
                                value: faultTypeId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                faultTypeId: value
                            }); 
                        }}
                    />
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '维修负责人',require: false},
                            regexp: {
                                value: actInspectionMan
                            }
                        }}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={actInspectionMan}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'actInspectionManId': extra.triggerNode.props.eventKey});
                                updateItem({'actInspectionMan': value});
                            } else {
                                updateItem({'actInspectionManId': ''});
                                updateItem({'actInspectionMan': ''});
                            }
                        }}
                    />
                    <VtxDatePicker 
                        data-modallist={{
                            layout:{width:50,name:'限定期限',require:false},
                            regexp:{
                                value:limitDate
                            }
                        }}
                        value={limitDate}
                        showTime={false}
                        onChange={(date,dateString)=>updateItem({limitDate: dateString})}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default HandleItem;