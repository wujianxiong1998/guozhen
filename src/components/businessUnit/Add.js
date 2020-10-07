import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input, Select } from 'antd';
import {VtxUtil} from '../../utils/util';
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

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, name, businesses, businessScopeList } = contentProps
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
                        placeholder="请输入名称（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '名称',
                                width: '100',
                                key: 'name'
                            },
                            regexp : {
                                value : name,
                                repete: {
                                    url: '/cloud/gzzhsw/api/cp/business/unit/check.smvc',
                                    key: {
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        paramCode: 'name',
                                        paramValue: name
                                    }
                                }
                            }
                        }}
                    />
                    <Select
                        mode='multiple'
                        showSearch={false}
                        value={businesses.map(item=>{return {...item}})}
                        labelInValue
                        filterOption={false}
                        onChange={(value) => {
                            updateItem({
                                businesses: value
                            })
                        }}
                        placeholder="请选择业务范围（必选项）"
                        allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '业务范围',
                                width: '100',
                                key: 'businesses'
                            },
                            regexp: {
                                value: businesses.length > 0 ? '1' : ''
                            }
                        }}
                    >
                        {businessScopeList.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;