import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { name,businessUnitName } = contentProps

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '名称', width: 100, key: 'name'}
                    }}
                >{name}</div>
                <div
                    data-modallist={{
                        layout: { type: 'text', name: '事业部', width: 100, key: 'businessUnitName' }
                    }}
                >{businessUnitName}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;