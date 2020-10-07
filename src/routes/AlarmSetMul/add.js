import React from 'react';
import { Input, Button, Select, TreeSelect } from 'antd';
import { VtxModal, VtxModalList } from 'vtx-ui';
const Option = Select.Option;

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, AlertLocationSel, AlertGradeSel, AlertTypeSel, userList } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, code, name,
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
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '污水处理厂',require: true},
                            regexp: {
                                value: name,
                                exp: () => { if(code) { return true } else { return false } },
                                errorMsg: code?'字段重复':'请选择设备等级',
                                repete:{
                                    key:{
                                        id:id,
                                        paramCode: 'code',
                                        paramValue: code,
                                        paramCode2: 'name',
                                        paramValue2: name,
                                        type: 'xjxmType',
                                    },
                                    url:'/cloud/gzzhsw/api/cp/common/parameter/checkV2.smvc'
                                }
                            }
                        }}
                        value={name}
                        onChange={e=>updateItem({name: e.target.value})}
                    />
                    <Select
                        value={code}
                        data-modallist={{
                            layout: {width: 50,name: '报警位置',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                code: value
                            }); 
                        }}
                    >
                        {
                            [{id: '1', value: '1'},{id: '11', value: '11'}].map(item => {
                                return <Option key={item.id}>{item.value}</Option>
                            })
                        }
                    </Select>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '报警指标',require: true},
                            regexp: {
                                value: name,
                            }
                        }}
                        value={name}
                        onChange={e=>updateItem({name: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '指标单位',require: true},
                            regexp: {
                                value: name,
                            }
                        }}
                        value={name}
                        onChange={e=>updateItem({name: e.target.value})}
                    />
                    <Select
                        value={code}
                        data-modallist={{
                            layout: {width: 50,name: '报警类型',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                code: value
                            }); 
                        }}
                    >
                        {
                            [{id: '1', value: '1'},{id: '11', value: '11'}].map(item => {
                                return <Option key={item.id}>{item.value}</Option>
                            })
                        }
                    </Select>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '上限值',require: true},
                            regexp: {
                                value: name,
                            }
                        }}
                        value={name}
                        onChange={e=>updateItem({name: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '下限值',require: true},
                            regexp: {
                                value: name,
                            }
                        }}
                        value={name}
                        onChange={e=>updateItem({name: e.target.value})}
                    />
                    <Select
                        value={code}
                        data-modallist={{
                            layout: {width: 50,name: '报警级别',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                code: value
                            }); 
                        }}
                    >
                        {
                            [{id: '1', value: '1'},{id: '11', value: '11'}].map(item => {
                                return <Option key={item.id}>{item.value}</Option>
                            })
                        }
                    </Select>
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '通知人员',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        value={code}
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
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;