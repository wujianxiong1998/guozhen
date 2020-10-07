import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input, Select,Icon,message } from 'antd';
const Option = Select.Option;
import styles from './index.less'
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
        const { id, exceptionTypeId, abnormalTypeBigSelect, name, addTemplate, deleteTemplate, changeTemplate} = contentProps
        const templateValue = contentProps.templateValue||[]
        const { updateItem } = contentProps;
        const templateItems = templateValue.map((item,index)=>{
            return[
                <Input
                    value={item.key}
                    onChange={(e) => {
                        changeTemplate(index,{key:e.target.value})
                    }}
                    maxLength="32"
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '关键词',
                            width: '45',
                            key: 'key'+index
                        },
                        regexp: {
                            value: item.key
                        }
                    }}
                />,
                <Input
                    value={item.value}
                    onChange={(e) => {
                        changeTemplate(index, { value: e.target.value })
                    }}
                    maxLength="32"
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '值',
                            width: '45',
                            key: 'value' + index
                        },
                        regexp: {
                            value: item.value
                        }
                    }}
                />,
                <Icon style={{marginTop:'15px'}} onClick={() => {
                    if (templateValue.length === 1) {
                        message.warn('至少需要有一个模版')
                    } else {
                        deleteTemplate(index)
                    }
                }} type='minus-circle-o' data-modallist={{
                    layout: {
                        comType: 'input',
                        width: '5',
                        key: 'minus' + index
                    },
                }} />,
                index === templateValue.length-1?
                <Icon style={{ marginTop: '15px' }} onClick={() => addTemplate(index)} type='plus-circle-o' data-modallist={{
                    layout: {
                        comType: 'input',
                        width: '5',
                        key: 'add' + index
                    },
                }} />:''
            ]
        })
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <div className={styles.formContainer}>
                    <VtxModalList
                        isRequired
                        visible={modalProps.visible}
                        ref={this.modalListRef}
                    >
                        <Select
                            value={{key:exceptionTypeId.key,label:exceptionTypeId.label}}
                            onChange={(value) => {
                                updateItem({
                                    exceptionTypeId : value
                                })
                            }}
                            labelInValue
                            placeholder="请选择异常大类（必选项）"
                            allowClear
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '所属异常大类',
                                    width: '100',
                                    key: 'exceptionTypeId'
                                },
                                regexp : {
                                    value : exceptionTypeId
                                }
                            }}
                        >
                            {abnormalTypeBigSelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            }) }
                        </Select>
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
                                    name: '异常小类名称',
                                    width: '100',
                                    key: 'name'
                                },
                                regexp : {
                                    value : name
                                }
                            }}
                        />
                        <div data-modallist={{ layout: { type: 'title', require: false, } }}>异常模版</div>
                        {
                            templateItems
                        }
                    </VtxModalList>
                </div>
            </VtxModal>
        )
    }
}

export default ADD;