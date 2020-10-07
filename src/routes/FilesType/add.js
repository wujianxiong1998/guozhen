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
        let { modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, orderIndex, typeName, typeCode,
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
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '排序号',require: true},
                            regexp: {
                                value: orderIndex,
                                // repete:{
                                //     key:{
                                //         id:id,
                                //         paramCode: 'code',
                                //         paramValue: code,
                                //         tenantId: VtxUtil.getUrlParam('tenantId')
                                //     },
                                //     url:'/cloud/ljsy/api/cp/productType/check.smvc'
                                // }
                            }
                        }}
                        value={orderIndex}
                        onChange={e=>updateItem({orderIndex: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '类型名称',require: true},
                            regexp: {
                                value: typeName,
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
                        value={typeName}
                        onChange={e=>updateItem({typeName: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '编码',require: true},
                            regexp: {
                                value: typeCode,
                                // repete:{
                                //     key:{
                                //         id:id,
                                //         paramCode: 'code',
                                //         paramValue: code,
                                //         tenantId: VtxUtil.getUrlParam('tenantId')
                                //     },
                                //     url:'/cloud/ljsy/api/cp/productType/check.smvc'
                                // }
                            }
                        }}
                        value={typeCode}
                        onChange={e=>updateItem({typeCode: e.target.value})}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;