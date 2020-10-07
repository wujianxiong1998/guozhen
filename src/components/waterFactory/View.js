import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';
import styles from './index.less';

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const {
        name, floorArea, businessName, longitude, latitude, processTypeName, productTypeName, startDate, endDate,
        processSize, waterStandard, minWaterFlow, waterPrice, regionalCompanyName, businessUnitName
    } = contentProps;

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <div className={styles.viewModalContainer}>
                <VtxModalList>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '名称', width: 100, key: 'name'}
                        }}
                    >{name}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '经纬度', width: 100, key: 'longitude' }
                        }}
                    >{longitude+','+latitude}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '占地面积', width: 100, key: 'floorArea'}
                        }}
                    >{floorArea+'亩'}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '事业部', width: 100, key: 'regionalCompanyName' }
                        }}
                    >{regionalCompanyName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '区域公司', width: 100, key: 'businessUnitName' }
                        }}
                    >{businessUnitName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '业务范围', width: 100, key: 'businessName'}
                        }}
                    >{businessName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '工艺类型', width: 100, key: 'processTypeName'}
                        }}
                    >{processTypeName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目类别', width: 100, key: 'productTypeName'}
                        }}
                    >{productTypeName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目开始时间', width: 100, key: 'startDate'}
                        }}
                    >{startDate}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目结束时间', width: 100, key: 'endDate'}
                        }}
                    >{endDate}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '处理规模', width: 100, key: 'processSize'}
                        }}
                    >{processSize+'万吨/日'}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '出水标准', width: 100, key: 'waterStandard'}
                        }}
                    >{waterStandard}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '保底水量', width: 100, key: 'minWaterFlow'}
                        }}
                    >{minWaterFlow+'万吨/日'}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '水价', width: 100, key: 'waterPrice'}
                        }}
                    >{waterPrice+'元/吨水'}</div>
                </VtxModalList>
            </div>
        </VtxModal>
    )
}

export default View;