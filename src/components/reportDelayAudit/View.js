import React from 'react';

import { VtxModalList, VtxModal, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload
import { Button,message,Input } from 'antd';
const TextArea = Input.TextArea
function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { waterFactoryName, date, delayReason, attachment, loading, auditMemo, handleAudit, updateItem } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
                <Button key='save' size='large' loading={loading}
                    onClick={() => {
                        if (!auditMemo) {
                            message.warn('请填写拒绝理由！')
                        } else {
                            handleAudit('audit_unpass')
                        }
                    }}>拒绝</Button>,
                <Button key='submit' type='primary' size='large'
                    loading={loading}
                    onClick={() => {
                        handleAudit('audit_pass')
                    }
                    }>通过</Button>
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '水厂名称', width: 100, key: 'waterFactoryName'}
                    }}
                >{waterFactoryName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '报表日期', width: 100, key: 'date'}
                    }}
                >{date}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '延期原因', width: 100, key: 'delayReason'}
                    }}
                >{delayReason}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '附件上传', width: 100, key: 'attachment'}
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
                <TextArea
                    value={auditMemo}
                    rows={3}
                    onChange={(e) => {
                        updateItem({
                            auditMemo: e.target.value
                        })
                    }}
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            name: '审核意见', width: 60, key: 'auditMemo'
                        }
                    }}
                />
                <div />
            </VtxModalList>
        </VtxModal>
    )
}

export default View;