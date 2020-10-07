import React from 'react';
import { VtxModal,VtxModalList } from 'vtx-ui';

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, getData } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            code, name
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
                    <div data-modallist={{layout:{width:50,name:'设备等级',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'	项目名称',type:'text'}}}>{name}</div>
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;