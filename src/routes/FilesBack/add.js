import React from 'react';
import { Input, Button, Select, InputNumber, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxUpload } from 'vtx-ui';
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, userList, fileListVersion, typeSel } = this.props;
        let { titleItem, visible, onCancel, width } = modalPropsItem;
        let { id, fileRecordNo, title, recordDate, recordDepartment, recordMan, recordManName, fileType, textNo, boxNo, recordNum, 
            putLocation, memo, annx, itemNo, pageNum,
            modelLonding, updateItem, onSave, onUpdate } = contentProps;
        let modalProps = {
            title: id?`${titleItem} > 编辑`:`${titleItem} > 新增`,
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

        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":
                    {
                        layout: {
                            width: 100,
                                name: '上传文件',
                                    require: true
                        },
                        regexp: {
                            value: annx && annx.length ? 1 : ''
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
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '档案号',require: true},
                            regexp: {
                                value: fileRecordNo,
                                // exp: () => { if(code) { return true } else { return false } },
                                // errorMsg: code?'字段重复':'请选择设备等级',
                                // repete:{
                                //     key:{
                                //         id:id,
                                //         paramCode: 'code',
                                //         paramValue: code,
                                //         paramCode2: 'name',
                                //         paramValue2: name,
                                //         type: 'xjxmType',
                                //     },
                                //     url:'/cloud/gzzhsw/api/cp/common/parameter/checkV2.smvc'
                                // }
                            }
                        }}
                        value={fileRecordNo}
                        onChange={e=>updateItem({fileRecordNo: e.target.value})}
                    />
                    <Input.TextArea
                        rows={2}
                        data-modallist={{
                            layout: {width: 100,name: '题名',require: true},
                            regexp: {
                                value: title,
                            }
                        }}
                        value={title}
                        onChange={e=>updateItem({title: e.target.value})}
                    />
                    <VtxDatePicker 
                        data-modallist={{
                            layout:{width:50,name:'归档日期',require:true},
                            regexp:{
                                value:recordDate
                            }
                        }}
                        value={recordDate}
                        onChange={(date,dateString)=>updateItem({recordDate: dateString})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '归档部门',require: true},
                            regexp: {
                                value: recordDepartment,
                            }
                        }}
                        value={recordDepartment}
                        onChange={e=>updateItem({recordDepartment: e.target.value})}
                    />
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '归档人',require: true},
                            regexp: {
                                value: recordManName
                            }
                        }}
                        value={recordManName}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'recordMan': extra.triggerNode.props.eventKey});
                                updateItem({'recordManName': value});
                            } else {
                                updateItem({'recordMan': ''});
                                updateItem({'recordManName': ''});
                            }
                        }}
                    />
                    <Select
                        value={fileType}
                        data-modallist={{
                            layout: {width: 50,name: '档案类型',require: true},
                            regexp: {
                                value: fileType
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                fileType: value
                            }); 
                        }}
                    >
                        {
                            typeSel.map(item => {
                                return <Option key={item.id}>{item.typeName}</Option>
                            })
                        }
                    </Select>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '文号',require: false},
                            regexp: {
                                value: textNo,
                            }
                        }}
                        value={textNo}
                        onChange={e=>updateItem({textNo: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '盒号',require: false},
                            regexp: {
                                value: boxNo,
                            }
                        }}
                        value={boxNo}
                        onChange={e=>updateItem({boxNo: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '件号',require: false},
                            regexp: {
                                value: itemNo,
                            }
                        }}
                        value={itemNo}
                        onChange={e=>updateItem({itemNo: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '页数',require: false},
                            regexp: {
                                value: pageNum,
                                regexp: {
                                    value: pageNum,
                                    exp:/^[0-9]\d*(\.\d{1,4})?$/,
                                    errorMsg:'必须输入正确页数',
                                }
                            }
                        }}
                        value={pageNum}
                        onChange={e=>updateItem({pageNum: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '份数',require: false},
                            regexp: {
                                value: recordNum,
                                regexp: {
                                    value: recordNum,
                                    exp:/^[0-9]\d*(\.\d{1,4})?$/,
                                    errorMsg:'必须输入正确份数',
                                }
                            }
                        }}
                        value={recordNum}
                        onChange={e=>updateItem({recordNum: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '存放位置',require: false},
                            regexp: {
                                value: putLocation,
                            }
                        }}
                        value={putLocation}
                        onChange={e=>updateItem({putLocation: e.target.value})}
                    />
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '备注',require: false},
                            regexp: {
                                value: memo,
                            }
                        }}
                        value={memo}
                        onChange={e=>updateItem({memo: e.target.value})}
                    />
                    {/*<div
                    data-modallist={{
                        layout:{
                            width:100,
                            name: '上传文件',
                            require:true
                        },
                        regexp:{
                            value:annx&&annx.length?1:''
                        }}
                    }
                >*/}
                        <VtxUpload
                            {...uploadProps('上传文件', 'annx', annx)}
                        />
                   
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;