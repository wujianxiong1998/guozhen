import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input } from 'antd';
import {VtxUtil} from '../../utils/util'
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
        const { id, name, code,type } = contentProps
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
                                repete:{
                                    url:'/cloud/gzzhsw/api/cp/common/parameter/check.smvc',
                                    key:{
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        paramCode:'type,name',
                                        paramValue:type+','+name
                                    }
                                }
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
                        placeholder="请输入编码（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '编码',
                                width: '100',
                                key: 'code'
                            },
                            regexp: {
                                value: code,
                                repete: {
                                    url: '/cloud/gzzhsw/api/cp/common/parameter/check.smvc',
                                    key: {
                                        tenantId: VtxUtil.getUrlParam('tenantId'),
                                        id,
                                        paramCode: 'type,code',
                                        paramValue: type + ',' + code
                                    }
                                }
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;