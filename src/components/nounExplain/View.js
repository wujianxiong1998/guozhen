import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { noun, glossary } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '名词', width: 100, key: 'noun'}
                    }}
                >{noun}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '名词解释', width: 100, key: 'glossary'}
                    }}
                >{glossary}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;