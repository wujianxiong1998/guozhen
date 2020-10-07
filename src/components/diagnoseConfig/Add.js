import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input } from 'antd';

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps } = this.props;
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
        const { id, parentNodeName, wheatherRoot, rule } = contentProps
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                title={wheatherRoot ? '诊断配置 > 添加根规则' : '诊断配置 > 添加子规则'}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    {
                        wheatherRoot?''
                        :
                            <div
                                data-modallist={{
                                    layout: { type: 'text', name: '上一级', width: 100, key: 'parentNodeName' }
                                }}
                            >{parentNodeName}</div>
                    }
                   
                    <Input
                        value={rule}
                        onChange={(e) => {
                            updateItem({
                                rule : e.target.value
                            })
                        }}
                        placeholder="请输入规则名称（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '规则名称',
                                width: '100',
                                key: 'rule'
                            },
                            regexp : {
                                value : rule
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;