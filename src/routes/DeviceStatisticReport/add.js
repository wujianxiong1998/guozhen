import React from 'react';
import { Button } from 'antd';
import { VtxModal, VtxDatagrid } from 'vtx-ui';

class AddItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { subVtxDatagridProps, addOnChange } = contentProps;

        let modalProps = {
            title: title,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };
        
        return (
            <VtxModal {...modalProps}>
                <div className="main_page">
                    <div style={{left:'20px',right:'20px',width:'auto'}} className="handle_box">
                        <Button onClick={() => addOnChange()}>添加</Button>
                        <Button>通用模板</Button>
                    </div>
                    <div className="table-wrapper" style={{height: '400px',marginTop:'10px'}}>
                        <VtxDatagrid {...subVtxDatagridProps} />
                    </div>
                </div>
            </VtxModal>
        )
    }
}

export default AddItem;