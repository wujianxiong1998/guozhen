import React from 'react';
import { Input, Button } from 'antd';
import { VtxModal, VtxModalList } from 'vtx-ui';

class MissionItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, userList } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, code, name, typeName, modelNum, applyDay, structuresName, deviceStatusStr, newStructuresName, newDeviceStatusStr,
            auditPeopleName, auditMemo,
            modelLonding, updateItem, onPublish } = contentProps;

        let modalProps = {
            title: `${title} > 审核`,
            visible: visible,
            footer: <div>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onPublish(0)
                        }
                    })
                }}>拒绝</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onPublish(1)
                        }
                    })
                }}>通过</Button>
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
                    <div data-modallist={{layout:{width:50,name:'设备编号',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                    <div data-modallist={{layout:{width:50,name:'设备类型',type:'text'}}}>{typeName}</div>
                    <div data-modallist={{layout:{width:50,name:'型号',type:'text'}}}>{modelNum}</div>
                    <div data-modallist={{layout:{width:50,name:'申请时间',type:'text'}}}>{applyDay}</div>
                    <div data-modallist={{layout:{width:50,name:'原安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'原状态',type:'text'}}}>{deviceStatusStr}</div>
                    <div data-modallist={{layout:{width:50,name:'变更后位置',type:'text'}}}>{newStructuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'变更后状态',type:'text'}}}>{newDeviceStatusStr}</div>
                    <div data-modallist={{layout:{width:50,name:'审核人',type:'text'}}}>{auditPeopleName}</div>
                    {/* <div data-modallist={{layout:{width:100,name:'审批结果',type:'text'}}}>{typeStr2}</div> */}
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100,name: '审核意见',require: true},
                            regexp: {
                                value: auditMemo,
                            }
                        }}
                        value={auditMemo}
                        // disabled={true}
                        onChange={e=>updateItem({auditMemo: e.target.value})}
                    />
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default MissionItem;