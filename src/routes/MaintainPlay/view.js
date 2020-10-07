import React from 'react';
import { VtxModal,VtxModalList, } from 'vtx-ui';

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, getData } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            structuresName, name, maintainDateStr, period, part, typeStr,
            content, designer, chargeMan,
        } = getData;
        let modalProps = {
            title: title,
            visible: visible,
            footer: null,
            onCancel: onCancel,
            width: width,
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
                    <div data-modallist={{layout:{width:50,name:'起始日期',type:'text'}}}>{maintainDateStr}</div>
                    <div data-modallist={{layout:{width:50,name:'养护周期',type:'text'}}}>{period}</div>
                    <div data-modallist={{layout:{width:50,name:'养护部位',type:'text'}}}>{part}</div>
                    <div data-modallist={{layout:{width:50,name:'养护类别',type:'text'}}}>{typeStr}</div>
                    <div data-modallist={{layout:{width:100,name:'养护内容',type:'text'}}}>{content}</div>
                    <div data-modallist={{layout:{width:50,name:'计划制定人',type:'text'}}}>{designer}</div>
                    <div data-modallist={{layout:{width:50,name:'责任人',type:'text'}}}>{chargeMan}</div>
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;