import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input, Select,InputNumber,Switch } from 'antd';
import { VtxUtil } from '../../utils/util';
const Option = Select.Option;

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }
    jumpToDisplay(){
        window.open(location.href.replace(/#\/targetLibrary/i, '#/formulaDisplay'))
    }
    render() {
        const t = this;
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            id, name, code, businessId, businessSelect, typeId, smallTypeId, smallTypeSelect, typeSelect, categoryKey,
            categorySelect, unitId, unitSelect, decimalDigits, rationalRange, formula
        } = contentProps;
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Input
                        value={name}
                        onChange={(e) => {
                            updateItem({
                                name : e.target.value
                            })
                        }}
                        placeholder="请输入指标名称（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '指标名称',
                                width: '100',
                                key: 'name'
                            },
                            regexp: {
                                value : name,
                                repete: businessId && typeId && smallTypeId ? {
                                    url: '/cloud/gzzhsw/api/cp/target/library/nameCheck.smvc',
                                    key: {
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        name,
                                        businessId,
                                        typeId,
                                        smallTypeId
                                    }
                                }:null
                            }
                        }}
                    />
                    <Input
                        value={code}
                        onChange={(e) => {
                            updateItem({
                                code: e.target.value
                            })
                        }}
                        placeholder="请输入指标编码（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '指标编码',
                                width: '100',
                                key: 'code'
                            },
                            regexp: {
                                value: code,
                                repete: {
                                    url: '/cloud/gzzhsw/api/cp/target/library/check.smvc',
                                    key: {
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        paramCode: 'code',
                                        paramValue: code
                                    }
                                }
                            }
                        }}
                    />
                    <Select
                        value={businessId}
                        onChange={(value) => {
                            updateItem({
                                businessId : value
                            })
                        }}
                        placeholder="请选择业务范围（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '业务范围',
                                width: '100',
                                key: 'businessId'
                            },
                            regexp : {
                                value : businessId
                            }
                        }}
                    >
                        {businessSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <Select
                        value={typeId}
                        onChange={(value) => {
                            updateItem({
                                typeId : value
                            })
                        }}
                        placeholder="请选择指标大类（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '指标大类',
                                width: '100',
                                key: 'typeId'
                            },
                            regexp : {
                                value : typeId
                            }
                        }}
                    >
                        {typeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <Select
                        value={smallTypeId}
                        onChange={(value) => {
                            updateItem({
                                smallTypeId: value
                            })
                        }}
                        placeholder="请选择指标小类（必选项）"
                        allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '指标小类',
                                width: '100',
                                key: 'smallTypeId'
                            },
                            regexp: {
                                value: smallTypeId
                            }
                        }}
                    >
                        {smallTypeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <div 
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                name: '计算指标',
                                width: '100',
                                key: 'categoryKey'
                            },
                        }}>
                    <Switch
                        checked={categoryKey !=='primitiveTarget'}
                        
                        onChange={(checked)=>{
                            updateItem({
                                categoryKey: checked ?'noPrimitiveTarget': 'primitiveTarget'
                            })
                        }}
                    />
                    </div>
                    <Select
                        value={unitId}
                        onChange={(value) => {
                            updateItem({
                                unitId : value
                            })
                        }}
                        placeholder="请选择指标单位（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '指标单位',
                                width: '100',
                                key: 'unitId'
                            },
                            regexp : {
                                value : unitId
                            }
                        }}
                    >
                        {unitSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <InputNumber
                        value={decimalDigits}
                        min={0}
                        precision={0}
                        onChange={(value) => {
                            updateItem({
                                decimalDigits :value
                            })
                        }}
                        
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                // require: true,
                                name: '保留位数',
                                width: '100',
                                key: 'decimalDigits'
                            },
                            regexp : {
                                value : decimalDigits
                            }
                        }}
                    />
                    <Input
                        value={rationalRange}
                        onChange={(e) => {
                            updateItem({
                                rationalRange : e.target.value
                            })
                        }}
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                // require: true,
                                name: '合理范围',
                                width: '100',
                                key: 'rationalRange'
                            },
                            regexp : {
                                value : rationalRange
                            }
                        }}
                    />
                    <Input
                        value={formula}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                formula : e.target.value
                            })
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                // require: true,
                                name: '公式',
                                width: '80',
                                maxNum: 300,
                                key: 'formula'
                            },
                            regexp : {
                                value : formula
                            }
                        }}
                    />
                    <a onClick={()=>{t.jumpToDisplay()}} data-modallist={{layout:{width:'20',style:{textAlign:'right'}}}}>查看内置函数</a>
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;