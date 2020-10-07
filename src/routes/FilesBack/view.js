import React from 'react';
import { VtxModal,VtxModalList, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload;

class ViewItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { updateWindow, modalPropsItem, contentProps, fileListVersion } = this.props;
        let { titleItem, visible, onCancel, width } = modalPropsItem;
        let { 
            id, fileRecordNo, title, recordDate, recordDepartment, recordManName, fileTypeStr, textNo, boxNo, recordNum, 
            putLocation, memo, annx, itemNo, pageNum,
        } = contentProps;
        let modalProps = {
            title: titleItem,
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
                listType:"text",
                viewMode:true,
                fileList:photoIds?photoIds:[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
                    <div data-modallist={{layout:{width:50,name:'档案号',type:'text'}}}>{fileRecordNo}</div>
                    <div data-modallist={{layout:{width:50,name:'题名',type:'text'}}}>{title}</div>
                    <div data-modallist={{layout:{width:50,name:'归档日期',type:'text'}}}>{recordDate}</div>
                    <div data-modallist={{layout:{width:50,name:'归档部门',type:'text'}}}>{recordDepartment}</div>
                    <div data-modallist={{layout:{width:50,name:'归档人',type:'text'}}}>{recordManName}</div>
                    <div data-modallist={{layout:{width:50,name:'档案类型',type:'text'}}}>{fileTypeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'文号',type:'text'}}}>{textNo}</div>
                    <div data-modallist={{layout:{width:50,name:'盒号',type:'text'}}}>{boxNo}</div>
                    <div data-modallist={{layout:{width:50,name:'件号',type:'text'}}}>{itemNo}</div>
                    <div data-modallist={{layout:{width:50,name:'页数',type:'text'}}}>{pageNum}</div>
                    <div data-modallist={{layout:{width:50,name:'份数',type:'text'}}}>{recordNum}</div>
                    <div data-modallist={{layout:{width:50,name:'存放位置',type:'text'}}}>{putLocation}</div>
                    <div data-modallist={{layout:{width:100,name:'备注',type:'text'}}}>{memo}</div>
                    <VtxUpload2
                        {...uploadProps('附件','上传文件', annx)}
                    />
                </VtxModalList>   
            </VtxModal>
        )
    }

}

export default ViewItem;