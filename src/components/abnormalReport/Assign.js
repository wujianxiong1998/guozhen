import React from 'react';

import { VtxModal, VtxModalList, VtxDate} from 'vtx-ui';
const {VtxDatePicker} = VtxDate
import { Button, Input, TreeSelect } from 'antd';
import styles from './index.less'

class Assign extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, handleAssign } = contentProps;
        const _t = this;
        return [
            
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && handleAssign(); // 保存事件
                    })
                }
            }>下达</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            executeMan, taskName,userTree
        } = contentProps;
        const { updateItem} = contentProps;
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
                    <TreeSelect
                        data-modallist={{
                            layout: { width: 100, name: '执行人', require: true },
                            regexp: {
                                value: executeMan
                            }
                        }}
                        treeData={userTree}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={executeMan}
                        onChange={(value, label, extra) => {
                            // console.log(extra);
                            
                            if (!!value) {
                                // updateItem({ 'executeManId': extra.triggerNode.props.eventKey });
                                updateItem({ 'executeMan': value });
                            } else {
                                updateItem({ 'executeMan': '' });
                            }
                        }}
                    />
                    <Input
                        value={taskName}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                taskName: e.target.value
                            })
                        }}
                        placeholder="请输入任务名称（必填项）"
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '任务名称',
                                width: '100',
                                key: 'taskName'
                            },
                            regexp: {
                                value: taskName
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default Assign;