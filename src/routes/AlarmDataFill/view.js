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
            id, waterFactoryName, libName, libUnitName, upValue, downValue, sendPeopleId, sendPeopleName, typeCode,
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
                    <div data-modallist={{layout:{width:50,name:'污水处理厂',type:'text'}}}>{waterFactoryName}</div>
                    <div data-modallist={{layout:{width:50,name:'报警指标',type:'text'}}}>{libName}</div>
                    <div data-modallist={{layout:{width:50,name:'指标单位',type:'text'}}}>{libUnitName}</div>
                    <div data-modallist={{layout:{width:50,name:'上限值',type:'text'}}}>{upValue}</div>
                    <div data-modallist={{layout:{width:50,name:'下限值',type:'text'}}}>{downValue}</div>
                    <div data-modallist={{layout:{width:50,name:'通知人员',type:'text'}}}>{sendPeopleName}</div>
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;