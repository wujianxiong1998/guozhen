import React from 'react';
import { VtxModal,VtxModalList } from 'vtx-ui';

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            gradeStr, deviceName, structuresName, itemName,
        } = contentProps;
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
                    <div data-modallist={{layout:{width:50,name:'设备等级',type:'text'}}}>{gradeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检项目',type:'text'}}}>{itemName}</div>
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;