import React from 'react';
import { Input, Button, Select, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate } from 'vtx-ui';
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;

class MissionItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, userList } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, code, stoptime, repareManId, repareMan,
            modelLonding, updateItem, onPublish } = contentProps;

        let modalProps = {
            title: `${title} > 任务下达`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onPublish()
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
                            layout: {width: 100,name: '养护人',require: true},
                            regexp: {
                                value: repareMan
                            }
                        }}
                        value={repareMan}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'repareManId': extra.triggerNode.props.attributes.userId});
                                updateItem({'repareMan': value});
                            } else {
                                updateItem({'repareManId': ''});
                                updateItem({'repareMan': ''});
                            }
                        }}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 100,name: '养护期限',require: true},
                            regexp: {
                                value: stoptime,
                            }
                        }}
                        value={stoptime}
                        disabled={true}
                        // onChange={e=>updateItem({stoptime: e.target.value})}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default MissionItem;