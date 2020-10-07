import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { waterFactoryName } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '选择水厂', width: 50, key: 'waterFactoryName'}
                    }}
                >{waterFactoryName}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;