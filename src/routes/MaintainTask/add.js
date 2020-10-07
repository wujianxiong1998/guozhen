import React from 'react';
import {Input, Button, Select} from 'antd';
import {VtxModal, VtxModalList, VtxUpload} from 'vtx-ui';

const {VtxUpload2} = VtxUpload;

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.lis1 = null;
    }
    
    render() {
        let {modalPropsItem, contentProps, fileListVersion, detail} = this.props;
        let {title, visible, onCancel, width} = modalPropsItem;
        let {
            id, approveContent,
            code, structuresName, deviceCode, deviceName, typeStr,
            maintainPeriodStr, repareMan, completeTimeStr, picIds, part, actRepareMan, maintainStatusStr,
            modelLonding, updateItem, onAduit
        } = contentProps;
        let modalProps = {
            title: `${title} > 审批`,
            visible: visible,
            footer: <div>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onAduit(-1)
                        }
                    })
                }}>拒绝</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onAduit(1)
                        }
                    })
                }}>通过</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };
        
        let modallistProps = {
            visible: visible,
            isRequired: true,
        };
        
        let uploadProps = (name, fieldCode, photoIds, require = true) => {
            return {
                action: "/cloudFile/common/uploadFile",
                downLoadURL: '/cloudFile/common/downloadFile?id=',
                "data-modallist": {
                    layout: {
                        width: 100,
                        name,
                        // require
                    },
                },
                listType: "picture-card",
                viewMode: true,
                fileList: photoIds ? photoIds : [],
                accept: 'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <div data-modallist={{layout: {width: 50, name: '工单编号', type: 'text'}}}>{code}</div>
                    <div
                        data-modallist={{layout: {width: 50, name: '安装位置', type: 'text'}}}>{detail.structuresName}</div>
                    <div data-modallist={{layout: {width: 50, name: '设备编号', type: 'text'}}}>{deviceCode}</div>
                    <div data-modallist={{layout: {width: 50, name: '设备名称', type: 'text'}}}>{deviceName}</div>
                    <div data-modallist={{layout: {width: 50, name: '养护类别', type: 'text'}}}>{typeStr}</div>
                    <div data-modallist={{layout: {width: 50, name: '养护部位', type: 'text'}}}>{part}</div>
                    <div data-modallist={{layout: {width: 50, name: '计划制定人', type: 'text'}}}>{repareMan}</div>
                    {/* <div data-modallist={{layout:{width:50,name:'计划养护时间',type:'text'}}}>{maintainPeriodStr}</div> */}
                    <div data-modallist={{layout: {width: 50, name: '养护执行人', type: 'text'}}}>{actRepareMan}</div>
                    <div data-modallist={{layout: {width: 50, name: '完成时间', type: 'text'}}}>{completeTimeStr}</div>
                    <div data-modallist={{layout: {width: 50, name: '状态', type: 'text'}}}>{maintainStatusStr}</div>
                    <VtxUpload2
                        {...uploadProps('附件', 'picIds', picIds)}
                    />
                    <Input.TextArea
                        data-modallist={{
                            layout: {width: 100, name: '审批内容', require: true},
                            regexp: {
                                value: approveContent
                            }
                        }}
                        value={approveContent}
                        onChange={e => updateItem({approveContent: e.target.value})}
                    />
                </VtxModalList>
            
            </VtxModal>
        )
    }
}

export default AddItem;
