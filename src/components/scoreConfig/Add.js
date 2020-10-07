import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, InputNumber,Input } from 'antd';
const InputGroup = Input.Group;
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
            <Button key='cancel' size='large' onClick={()=>{
                updateWindow(false);
            }}>取消</Button>,
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
            id, askOnceScore, askUpper, answerOnceScore, answerUpper, uploadOnceScore, uploadUpper
        } = contentProps;
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <div className={styles.viewModalContainer}>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                 <InputGroup compact
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '提问1次得',
                                width: '50',
                                key: 'askOnceScore'
                            },
                            regexp: {
                                value: askOnceScore
                            }
                        }}>
                    <InputNumber
                        style={{width:"90%"}}
                        value={askOnceScore}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                askOnceScore : value
                            })
                        }}
                        placeholder="请输入提问1次得分（必填项）"
                        
                    />
                    <Input
                        style={{width:'10%'}}
                        value='分'
                        disabled
                    />
                    </InputGroup>

                    <InputGroup compact 
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '每月上限',
                                width: '50',
                                key: 'askUpper'
                            },
                            regexp: {
                                value: askUpper
                            }
                        }}>
                    <InputNumber
                            style={{ width: "90%" }}
                        value={askUpper}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                askUpper : value
                            })
                        }}
                        placeholder="请输入每月上限（必填项）"
                        
                    />
                        <Input
                            style={{ width: '10%' }}
                            value='次'
                            disabled
                        />
                    </InputGroup>
                    <InputGroup compact 
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '回答1次得',
                                width: '50',
                                key: 'answerOnceScore'
                            },
                            regexp: {
                                value: answerOnceScore
                            }
                        }}
                    >
                    <InputNumber
                         style={{ width: '90%' }}
                        value={answerOnceScore}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                answerOnceScore : value
                            })
                        }}
                        placeholder="请输入回答1次得分（必填项）"
                        
                       
                    />
                        <Input
                            style={{ width: '10%' }}
                            value='分'
                            disabled
                        />
                    </InputGroup>
                    <InputGroup compact
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '每月上限',
                                width: '50',
                                key: 'answerUpper'
                            },
                            regexp: {
                                value: answerUpper
                            }
                        }}
                    >
                    <InputNumber
                            style={{ width: "90%" }}
                        value={answerUpper}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                answerUpper : value
                            })
                        }}
                        placeholder="请输入每月上限（必填项）"
                        
                        
                    />
                        <Input
                            style={{ width: '10%' }}
                            value='次'
                            disabled
                        />
                    </InputGroup>
                    <InputGroup compact
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '上传1次得',
                                width: '50',
                                key: 'uploadOnceScore'
                            },
                            regexp: {
                                value: uploadOnceScore
                            }
                        }}>
                    <InputNumber
                            style={{ width: "90%" }}
                        value={uploadOnceScore}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                uploadOnceScore : value
                            })
                        }}
                        placeholder="请输入上传1次得分（必填项）"
                        
                       
                    />
                        <Input
                            style={{ width: '10%' }}
                            value='分'
                            disabled
                        />
                    </InputGroup>
                    <InputGroup compact
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '每月上限',
                                width: '50',
                                key: 'uploadUpper'
                            },
                            regexp: {
                                value: uploadUpper
                            }
                        }}>
                    <InputNumber
                        value={uploadUpper}
                            style={{ width: "90%" }}
                        precision={0}
                        min={0}
                        onChange={(value) => {
                            updateItem({
                                uploadUpper : value
                            })
                        }}
                        placeholder="请输入每月上限（必填项）"
                        
                        
                    />
                        <Input
                            style={{ width: '10%' }}
                            value='次'
                            disabled
                        />
                    </InputGroup>
                </VtxModalList>
                </div>
            </VtxModal>
        )
    }
}

export default ADD;