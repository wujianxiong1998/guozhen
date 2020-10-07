import React from 'react';
import { Input, Button, Select, TreeSelect } from 'antd';
import { VtxModal, VtxModalList } from 'vtx-ui';
const Option = Select.Option;

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
        this.lis2 = null;
    }

    render() {
        let { modalPropsItem, contentProps, AlertLocationSel, AlertGradeSel, AlertTypeSel, userList } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, code, name,
            modelLonding, updateItem, onSave, onUpdate } = contentProps;

        let modalProps = {
            title: id?`${title} > 上报`:`${title} > 新增`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                        this.lis2.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            if (id) {
                                onUpdate()
                            } else {
                                onSave()
                            }
                        }
                    })
                }}>保存</Button>
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
                    <TreeSelect 
                        data-modallist={{
                            layout: {width: 100,name: '上报人员',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        value={code}
                        multiple
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'chargeManId': extra.triggerNode.props.eventKey});
                                updateItem({'chargeManName': value});
                            } else {
                                updateItem({'chargeManId': ''});
                                updateItem({'chargeManName': ''});
                            }
                        }}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default AddItem;