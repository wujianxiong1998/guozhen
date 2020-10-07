import React from 'react';
import { Input, Button, Select } from 'antd';
import { VtxModal, VtxModalList } from 'vtx-ui';
const Option = Select.Option;

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, deviceGrade } = this.props;
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
                    <Select
                        value={code}
                        data-modallist={{
                            layout: {width: 100,name: '设备等级',require: true},
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
                            deviceGrade.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '巡检项目',require: true},
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
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;