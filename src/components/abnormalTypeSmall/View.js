import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';
import styles from './index.less';
function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const { exceptionTypeName, name, templateValue } = contentProps
    const templateItems = templateValue.map((item, index) => {
        return [
            <div
                data-modallist={{
                    layout: {
                        type: 'text',
                        name: '关键词',
                        width: '50',
                        key: 'key' + index
                    },
                    regexp: {
                        value: item.key
                    }
                }}
            >{item.key}</div>,
            <div
                data-modallist={{
                    layout: {
                        type: 'text',
                        name: '值',
                        width: '50',
                        key: 'value' + index
                    },
                }}
            >{item.value}</div>,
        ]
    })
    return (
        <VtxModal
            {...modalProps}
            footer={[
                
            ]}
        >
            <div className={styles.formContainer}>
                <VtxModalList>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '所属异常大类', width: 100, key: 'exceptionTypeName'}
                        }}
                    >{exceptionTypeName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '异常小类名称', width: 100, key: 'name'}
                        }}
                    >{name}</div>
                    <div data-modallist={{ layout: { type: 'title', require: false, } }}>异常模版</div>
                    {
                        templateItems
                    }
                </VtxModalList>
            </div>
        </VtxModal>
    )
}

export default View;