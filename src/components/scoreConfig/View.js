import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { askOnceScore, askUpper, answerOnceScore, answerUpper, uploadOnceScore, uploadUpper } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
                <Button key="cancel" size="large" onClick={()=>{
                    updateWindow(false);
                }}>取消</Button>
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '提问1次得', width: 50, key: 'askOnceScore'}
                    }}
                >{askOnceScore}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '每月上限', width: 50, key: 'askUpper'}
                    }}
                >{askUpper}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '回答1次得', width: 50, key: 'answerOnceScore'}
                    }}
                >{answerOnceScore}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '每月上限', width: 50, key: 'answerUpper'}
                    }}
                >{answerUpper}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '上传1次得', width: 50, key: 'uploadOnceScore'}
                    }}
                >{uploadOnceScore}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '每月上限', width: 50, key: 'uploadUpper'}
                    }}
                >{uploadUpper}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;