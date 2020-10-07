import React from 'react';
import { Input, Button, Select, Radio } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxUpload } from 'vtx-ui';
import styles from './styles.less';
const Option = Select.Option;
const {VtxUpload2} = VtxUpload;
const {VtxDatePicker} = VtxDate;

class MissionItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, fileListVersion, } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, structuresName, deviceName, itemName, inspectionMan, inspectionTimeStr, inspectionAbnormal, fileIds, enable,
            modelLonding, updateItem, ignore, build } = contentProps;

        let modalProps = {
            title: `${title} > 处理`,
            visible: visible,
            footer: <div>
                {/* <Button type='default' onClick={onCancel}>取消</Button> */}
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            ignore()
                        }
                    })
                }}>忽略</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            build()
                        }
                    })
                }}>生成故障</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };

        // let uploadProps = (name,fieldCode,photoIds,require = true)=>{
        //     return {
        //         action:"/cloudFile/common/uploadFile",
        //         downLoadURL:'/cloudFile/common/downloadFile?id=',
        //         "data-modallist":{
        //             layout:{
        //                 width:100,
        //                 name,
        //                 // require
        //             },
        //             // regexp:{
        //             //     value:photoIds
        //             // }
        //         },
        //         listType:"picture-card",
        //         viewMode:true,
        //         // onSuccess(file){
        //         //     photoIds.push({id: file.id, name: file.name});
        //         //     updateItem({[fieldCode]: photoIds})
        //         // },
        //         // onRemove(file){
        //         //     let ph = photoIds.filter(item => item.id !== file.id);
        //         //     updateItem({[fieldCode]: ph})
        //         // },
        //         fileList:photoIds?photoIds:[],
        //         accept:'image/png, image/jpeg, image/jpg',
        //         fileListVersion,
        //     }
        // }
        // 这是传id的
        let uploadProps = (name,fieldCode,photoIds,require = true)=>{
            return {
                action:"/cloudFile/common/uploadFile",
                downLoadURL:'/cloudFile/common/downloadFile?id=',
                "data-modallist":{
                    layout:{
                        width:100,
                        name,
                        require
                    },
                    regexp:{
                        value:photoIds
                    }
                },
                listType:"picture-card",
                mode:'multiple',
                viewMode:true,
                onSuccess(file){
                    let ids = photoIds?photoIds.split(','):[];
                    ids.push(file.id);
                    updateItem({[fieldCode]:ids.join(',')})
                },
                onRemove(file){
                    let ids = photoIds.split(',');
                    ids.splice(ids.indexOf(file.id),1);
                    updateItem({[fieldCode]:ids.join(',')})
                },
                fileList:photoIds?photoIds.split(',').map(item=>({id:item,name:item})):[],
                accept:'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <div data-modallist={{layout:{width:50,name:'安装位置',type:'text'}}}>{structuresName}</div>
                    <div data-modallist={{layout:{width:50,name:'设备名称',type:'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检项目',type:'text'}}}>{itemName}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检人员',type:'text'}}}>{inspectionMan}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检时间',type:'text'}}}>{inspectionTimeStr}</div>
                    <div data-modallist={{layout:{width:50,name:'巡检异常',type:'text'}}}>{inspectionAbnormal}</div>
                    <VtxUpload2
                        {...uploadProps('图片','fileIds', fileIds)}
                    />
                    <Radio.Group 
                        onChange={e=>updateItem({enable: e.target.value})} 
                        value={enable}
                        data-modallist={{
                            layout: {width: 50,name: '是否合并同类异常',require: true},
                            regexp: {
                                value: enable
                            }
                        }}
                    >
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>
                </VtxModalList>
                
            </VtxModal>
        )
    }
}

export default MissionItem;