import React from 'react';
import { VtxModal,VtxModalList,VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload;

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, fileListVersion } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            id, code, structuresName, deviceCode, deviceName, typeStr, maintainPeriodStr, repareMan, completeTimeStr,
            content, picIds, part, actRepareMan, approveContent,
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

        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                    },
                },
                listType:"picture-card",
                viewMode:true,
                fileList:photoIds?photoIds:[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }

        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
                    <div data-modallist={{layout:{width:50,name:'工单编号',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备编号',type:'text'}}}>{deviceCode}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout:{width:50,name:'养护类别',type:'text'}}}>{typeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'养护部位',type:'text'}}}>{part}</div>
                    <div data-modallist={{layout:{width:50,name:'计划制定人',type:'text'}}}>{repareMan}</div>
                    <div data-modallist={{layout:{width:50,name:'计划养护时间',type:'text'}}}>{maintainPeriodStr}</div>
                    <div data-modallist={{layout:{width:50,name:'养护执行人',type:'text'}}}>{actRepareMan}</div>
                    <div data-modallist={{layout:{width:50,name:'完成时间',type:'text'}}}>{completeTimeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'保养内容',type:'text'}}}>{content}</div>
                    <div data-modallist={{layout:{width:50,name:'审批内容',type:'text'}}}>{approveContent}</div>
                    <VtxUpload2
                        {...uploadProps('附件','picIds', picIds)}
                    />
                </VtxModalList> 
            </VtxModal>
        )
    }

}

export default ViewItem;