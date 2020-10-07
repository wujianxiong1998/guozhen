import React from 'react';

import { VtxModalList, VtxModal, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { waterFactoryName, exceptionTypeName, exceptionSmallTypeName, description, attachment, exceptionStatus, handleNeglect } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
                
                exceptionStatus==='dcl'?
                    <Button key="neglect" type='danger' size="large" onClick={() => {
                        handleNeglect();
                    }}>忽略</Button> : ''
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '运营厂', width:100, key: 'waterFactoryName'}
                    }}
                >{waterFactoryName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '异常大类', width:100, key: 'exceptionTypeName'}
                    }}
                >{exceptionTypeName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '异常小类', width:100, key: 'exceptionSmallTypeName'}
                    }}
                >{exceptionSmallTypeName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '异常描述', width: 100, key: 'description'}
                    }}
                >{description}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '附件', width:100, key: 'attachment'}
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
            </VtxModalList>
        </VtxModal>
    )
}

export default View;