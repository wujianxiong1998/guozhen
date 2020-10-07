import React from 'react';

import { VtxModalList, VtxModal, VtxUpload } from 'vtx-ui';
const {VtxUpload2} = VtxUpload
import { Button,message } from 'antd';

class View extends React.Component{
    render(){
        const { updateWindow, modalProps, contentProps } = this.props;
        const { exceptionTypeName, exceptionSmallTypeName, exceptionDescription, taskName, taskDealDate, dealManName, content, attachment, } = contentProps

        return (
            <VtxModal
                {...modalProps}
                footer={[]}
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
                            layout: { type: 'text', name: '附件', width: 100, key: 'attachment' }
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
                </VtxModalList>
            </VtxModal>
        )
    }
    
}

export default View;