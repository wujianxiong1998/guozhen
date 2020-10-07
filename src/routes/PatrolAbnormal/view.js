import React from 'react';
import { VtxModal,VtxModalList, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload;

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, getData, fileListVersion } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { 
            deviceName, structuresName, deviceCode, inspectionMan, inspectionAbnormal, fileIds, grade,
            itemName, inspectionTimeStr, code, dataStatusStr
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

        // 这是传id的
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
                mode:'multiple',
                viewMode:true,
                fileList:photoIds?photoIds.split(',').map(item=>({id:item,name:item})):[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }

        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备等级',type:'text'}}}>{grade}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检项目',type:'text'}}}>{itemName}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检时间',type:'text'}}}>{inspectionTimeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'上报人',type:'text'}}}>{inspectionMan}</div>
                    <div data-modallist={{layout:{width:50,name:'故障详情',type:'text'}}}>{inspectionAbnormal}</div>
                    <div data-modallist={{layout:{width:50,name:'维修工单编号',type:'text'}}}>{code}</div>
                    <div data-modallist={{layout:{width:50,name:'状态',type:'text'}}}>{dataStatusStr}</div>
                    <VtxUpload2
                        {...uploadProps('附件上传','fileIds', fileIds)}
                    />
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;