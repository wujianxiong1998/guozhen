import React from 'react';

import { VtxModalList, VtxModal, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload
import { Button, Input,message } from 'antd';
const TextArea = Input.TextArea

class View extends React.Component{
    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, handleAudit, auditContent, } = contentProps;
        const _t = this;

        return [
                <Button key='save' size='large' loading={loading}
                    onClick={() => {
                        if (!auditContent) {
                            message.warn('请填写拒绝理由！')
                        } else {
                            handleAudit('wtg')
                        }
                    }}>拒绝</Button>,
                <Button key='submit' type='primary' size='large'
                    loading={loading}
                    onClick={() => {
                        handleAudit('ytg')
                    }
                    }>通过</Button>
            ]
    }
    render(){
        const { updateWindow, modalProps, contentProps } = this.props;
        const { exceptionTypeName, exceptionSmallTypeName, exceptionDescription, taskName, taskDealDate, dealManName, content, attachment, auditContent, updateItem } = contentProps

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '异常大类', width: 100, key: 'exceptionTypeName' }
                        }}
                    >{exceptionTypeName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '异常小类', width: 100, key: 'exceptionSmallTypeName' }
                        }}
                    >{exceptionSmallTypeName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '异常描述', width: 100, key: 'exceptionDescription' }
                        }}
                    >{exceptionDescription}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '附件', width: 50, key: 'attachment' }
                        }}
                    >
                        <VtxUpload2
                            showUploadList={true}
                            fileList={attachment}
                            mode="multiple"
                            action="/cloudFile/common/uploadFile"
                            downLoadURL="/cloudFile/common/downloadFile?id="
                            viewMode={true}
                        />
                    </div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '任务名称', width: 100, key: 'taskName' }
                        }}
                    >{taskName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '处理日期', width: 100, key: 'taskDealDate' }
                        }}
                    >{taskDealDate}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '处理人', width: 100, key: 'dealManName' }
                        }}
                    >{dealManName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '处理内容', width: 100, key: 'content' }
                        }}
                    >{content}</div>
                    <TextArea
                        value={auditContent}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                auditContent: e.target.value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                name: '审核意见', width: 100, key: 'auditContent'
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
    
}

export default View;