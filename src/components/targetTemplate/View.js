import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { businessName, processTypeName } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '业务范围', width: 50, key: 'businessName'}
                    }}
                >{businessName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '工艺名称', width: 50, key: 'processTypeName'}
                    }}
                >{processTypeName}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;