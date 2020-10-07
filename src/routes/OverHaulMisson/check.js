import React from 'react';
import { Input, Button, Select } from 'antd';
import { VtxModal, VtxModalList, VtxDate } from 'vtx-ui';

class CheckItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, auditMemo,
            modelLonding, updateItem, check } = contentProps;

        let modalProps = {
            title: title,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            check(1)
                        }
                    })
                }}>通过</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            check(0)
                        }
                    })
                }}>不通过</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <div></div>
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '审核意见',require: true},
                            regexp: {
                                value: auditMemo,
                            }
                        }}
                        value={auditMemo}
                        onChange={e=>updateItem({auditMemo: e.target.value})}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default CheckItem;