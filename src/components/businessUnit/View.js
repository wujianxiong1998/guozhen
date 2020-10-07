import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { name,code } = contentProps

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
                        layout: { type: 'text', name: '编码', width: 100, key: 'code' }
                    }}
                >{code}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;