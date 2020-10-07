import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const {
        name, code, businessName, typeName, smallTypeName, categoryValue, unitName, decimalDigits, rationalRange,
        formula
    } = contentProps;

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <VtxModalList>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '指标名称', width: 100, key: 'name'}
                    }}
                >{name}</div>
                <div
                    data-modallist={{
                        layout: { type: 'text', name: '指标编码', width: 100, key: 'code' }
                    }}
                >{code}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '业务范围', width: 100, key: 'businessName'}
                    }}
                >{businessName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '指标大类', width: 100, key: 'typeName'}
                    }}
                >{typeName}</div>
                <div
                    data-modallist={{
                        layout: { type: 'text', name: '指标小类', width: 100, key: 'smallTypeName' }
                    }}
                >{smallTypeName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '计算指标', width: 100, key: 'categoryValue'}
                    }}
                >{categoryValue}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '指标单位', width: 100, key: 'unitName'}
                    }}
                >{unitName}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '保留位数', width: 100, key: 'decimalDigits'}
                    }}
                >{decimalDigits}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '合理范围', width: 100, key: 'rationalRange'}
                    }}
                >{rationalRange}</div>
                <div
                    data-modallist={{
                        layout: {type: 'text', name: '公式', width: 100, key: 'formula'}
                    }}
                >{formula}</div>
            </VtxModalList>
        </VtxModal>
    )
}

export default View;