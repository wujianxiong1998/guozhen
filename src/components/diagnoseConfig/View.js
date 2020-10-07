import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { parentName, ruleName } = contentProps

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
                        layout: {type: 'text', name: '上一级', width: 100, key: 'parentName'}
                    }}
                >{parentName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '规则名称', width: 100, key: 'ruleName'}
                    }}
                >{ruleName}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;