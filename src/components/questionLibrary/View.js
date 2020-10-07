import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { title, content, reasonAnalysis, responses, businessName, typeName } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '问题标题', width: 100, key: 'title'}
                    }}
                >{title}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '问题描述', width: 100, key: 'content'}
                    }}
                >{content}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '原因分析', width: 100, key: 'reasonAnalysis'}
                    }}
                >{reasonAnalysis}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '应对措施', width: 100, key: 'responses'}
                    }}
                >{responses}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '业务范围', width: 60, key: 'businessName'}
                    }}
                >{businessName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '类型', width: 60, key: 'typeName'}
                    }}
                >{typeName}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;