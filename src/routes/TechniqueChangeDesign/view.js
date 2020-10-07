import React from 'react';
import { Button } from 'antd';
import { VtxModal,VtxModalList, VtxUpload } from 'vtx-ui';

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, fileListVersion } = this.props;
        let { title, visible, onCancel, width, onJump } = modalPropsItem;
        let { 
            structuresName, name, code, planDateStr, planMoney, reason, specificThing, picIds, chargeManName,
        } = contentProps;
        let modalProps = {
            title: title,
            visible: visible,
            footer: null,
            onCancel: onCancel,
            width: width,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
            </div>,
        }
        let modallistProps = {
            visible: visible,
            isRequired: false,
        }

        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                        // require
                    },
                    regexp:{
                        value:photoIds
                    }
                },
                listType:"text",
                mode:'multiple',
                viewMode: 'true',
                onSuccess(file){
                    photoIds.push({id: file.id, name: file.name});
                    updateItem({[fieldCode]: photoIds})
                },
                onRemove(file){
                    let ph = photoIds.filter(item => item.id !== file.id);
                    updateItem({[fieldCode]: ph})
                },
                fileList:photoIds?photoIds:[],
                // accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }

        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{name}</div>
                    <div data-modallist={{layout:{width:50,name:'设备编码',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'计划执行时间',type:'text'}}}>{planDateStr}</div>
                    <div data-modallist={{layout:{width:50,name:'预算总价（万元）',type:'text'}}}>{planMoney}</div>
                    <div data-modallist={{layout:{width:50,name:'负责人',type:'text'}}}>{chargeManName}</div>
                    <div data-modallist={{layout:{width:100,name:'原因描述',type:'text'}}}>{reason}</div>
                    <div data-modallist={{layout:{width:100,name:'具体事项',type:'text'}}}>{specificThing}</div>
                    <VtxUpload
                        {...uploadProps('下载附件', 'picIds', picIds)}
                    />
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;