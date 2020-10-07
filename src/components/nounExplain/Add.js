import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input } from 'antd';
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
        const { id, noun, explain } = contentProps
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <div className={styles.viewContainer}>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Input
                        value={noun}
                        onChange={(e) => {
                            updateItem({
                                noun : e.target.value
                            })
                        }}
                        placeholder="请输入名词（必填项）"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '名词',
                                width: '100',
                                key: 'noun'
                            },
                            regexp : {
                                value : noun
                            }
                        }}
                    />
                    <Input
                        value={explain}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                explain : e.target.value
                            })
                        }}
                        placeholder="请输入名词解释（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '名词解释',
                                width: '100',
                                maxNum: 300,
                                key: 'explain'
                            },
                            regexp : {
                                value : explain
                            }
                        }}
                    />
                </VtxModalList>
                </div>
            </VtxModal>
        )
    }
}

export default ADD;