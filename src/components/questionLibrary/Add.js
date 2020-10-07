import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input, Select } from 'antd';
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
        const {
            id, title, content, reasonAnalysis, responses, businessId, businessSelect,
            type, typeSelect
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
                        value={title}
                        onChange={(e) => {
                            updateItem({
                                title : e.target.value
                            })
                        }}
                        placeholder="请输入问题标题（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '问题标题',
                                width: '100',
                                key: 'title'
                            },
                            regexp : {
                                value : title
                            }
                        }}
                    />
                    <Input
                        value={content}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                content : e.target.value
                            })
                        }}
                        placeholder="请输入问题描述（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '问题描述',
                                width: '100',
                                maxNum: 300,
                                key: 'content'
                            },
                            regexp : {
                                value : content
                            }
                        }}
                    />
                    <Input
                        value={reasonAnalysis}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                reasonAnalysis : e.target.value
                            })
                        }}
                        placeholder="请输入原因分析（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '原因分析',
                                width: '100',
                                maxNum: 300,
                                key: 'reasonAnalysis'
                            },
                            regexp : {
                                value : reasonAnalysis
                            }
                        }}
                    />
                    <Input
                        value={responses}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                responses : e.target.value
                            })
                        }}
                        placeholder="请输入应对措施（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '应对措施',
                                width: '100',
                                maxNum: 300,
                                key: 'responses'
                            },
                            regexp : {
                                value : responses
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
                                width: '60',
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
                        value={type}
                        onChange={(value) => {
                            updateItem({
                                type : value
                            })
                        }}
                        placeholder="请选择类型（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '类型',
                                width: '60',
                                key: 'type'
                            },
                            regexp : {
                                value : type
                            }
                        }}
                    >
                        {typeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;