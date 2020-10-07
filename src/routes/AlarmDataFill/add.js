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
        let { modalPropsItem, contentProps, waterFactoryList, userList, typeList, libList } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, waterFactoryId, libId, upValue, downValue, sendPeopleIdName, sendPeopleId, sendPeopleName, typeCode,
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
                    <Select
                        value={waterFactoryId}
                        data-modallist={{
                            layout: {width: 50,name: '污水处理厂',require: true},
                            regexp: {
                                value: waterFactoryId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                waterFactoryId: value
                            }); 
                        }}
                    >
                        {
                            waterFactoryList.map(item => {
                                return <Option key={item.id}>{item.value}</Option>
                            })
                        }
                    </Select>
                    <Select
                        value={typeCode}
                        data-modallist={{
                            layout: {width: 50,name: '类型',require: true},
                            regexp: {
                                value: typeCode
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                typeCode: value
                            }); 
                        }}
                    >
                        {
                            typeList.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <Select
                        value={libId}
                        data-modallist={{
                            layout: {width: 50,name: '报警指标',require: true},
                            regexp: {
                                value: libId
                            }
                        }}
                        onChange={(value)=>{
                            updateItem({
                                libId: value
                            }); 
                        }}
                    >
                        {
                            libList.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '上限值',require: true},
                            regexp: {
                                value: upValue,
                            }
                        }}
                        value={upValue}
                        onChange={e=>updateItem({upValue: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '下限值',require: true},
                            regexp: {
                                value: downValue,
                            }
                        }}
                        value={downValue}
                        onChange={e=>updateItem({downValue: e.target.value})}
                    />
                     <TreeSelect 
                        data-modallist={{
                            layout: {width: 50,name: '通知人员',require: true},
                            regexp: {
                                value: sendPeopleIdName.length?'1':''
                            }
                        }}
                        value={sendPeopleIdName}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        multiple={true}
                        labelInValue
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            updateItem({'sendPeopleIdName': value});
                        }}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;