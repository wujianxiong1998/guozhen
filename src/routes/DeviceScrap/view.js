import React from 'react';
import { Button } from 'antd';
import { VtxModal,VtxModalList, } from 'vtx-ui';

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width, onJump } = modalPropsItem;
        let { id, code, name, typeName, modelNum, applyDay, structuresName, deviceStatusStr, newStructuresName, newDeviceStatusStr,
            auditPeopleName, auditMemo, dropReason,
        } = contentProps;
        let modalProps = {
            title: title,
            visible: visible,
            footer: null,
            onCancel: onCancel,
            width: width,
            footer: <div>
                {/* {dataStatus === 'hasPublish'?<Button type='primary' onClick={onJump}>查看方案</Button>:''} */}
                <Button type='default' onClick={onCancel}>取消</Button>
            </div>,
        }
        let modallistProps = {
            visible: visible,
            isRequired: false,
        }

        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
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
                    <div data-modallist={{layout:{width:100,name:'报废说明',type:'text'}}}>{dropReason}</div>
                    {/* <div data-modallist={{layout:{width:50,name:'审核意见',type:'text'}}}>{auditMemo}</div> */}
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;