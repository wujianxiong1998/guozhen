import React from 'react';

import { VtxModal, VtxModalList, VtxDate } from 'vtx-ui';
const { VtxDatePicker } = VtxDate;
import { Button, Input, Select, TreeSelect } from 'antd';
const Option = Select.Option;
import { VtxTimeUtil} from '../../utils/tools'
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
        const { id, dealMan, userTree, handleDate, handleContent, attachment } = contentProps
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
                    <TreeSelect
                        data-modallist={{
                            layout: { width:100, name: '异常处理人', require: true },
                            regexp: {
                                value: dealMan
                            }
                        }}
                        treeData={userTree}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        value={dealMan}
                        onChange={(value, label, extra) => {

                            if (!!value) {
                                updateItem({ 'dealMan': value });
                            } else {
                                updateItem({ 'dealMan': '' });
                            }
                        }}
                    />
                    <VtxDatePicker
                        value={handleDate}
                        disabledDate={(current)=>{
                        return current && VtxTimeUtil.isAfterDate(current);
                        }}
                        onChange={(date, dateString) => {
                            updateItem({
                                handleDate : dateString
                            });
                        }}
                        // format='YYYY-MM-DD'
                        showTime
                        data-modallist={{
                            layout:{
                                comType: '',
                                require: true,
                                name: '处理日期',
                                width: '100',
                                key: 'handleDate'
                            },
                            regexp : {
                                value : handleDate
                            }
                        }}
                    />
                    <Input
                        value={handleContent}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                handleContent : e.target.value
                            })
                        }}
                        placeholder="请输入处理内容（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '处理内容',
                                width: '100',
                                maxNum: 300,
                                key: 'handleContent'
                            },
                            regexp : {
                                value : handleContent
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;