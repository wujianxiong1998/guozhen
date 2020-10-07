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
        let { 
            structuresName, name, code, planDateStr, planMoney, reason, specificThing, dataStatus, chargeManName,
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
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                    <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>
                    <div data-modallist={{layout:{width:50,name:'负责人',type:'text'}}}>{chargeManName}</div>
                    <div data-modallist={{layout:{width:50,name:'预算总价（万元）',type:'text'}}}>{planMoney}</div>
                    <div data-modallist={{layout:{width:100,name:'原因描述',type:'text'}}}>{reason}</div>
                    <div data-modallist={{layout:{width:100,name:'具体事项',type:'text'}}}>{specificThing}</div>
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;