import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';
import styles from './index.less';
import PublicModal from '../../components/publicModal/index'

function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const {
        acceptance, acceptanceTime, businessUnitId, constructionTime, constructionUnit, designUnit, envAssessment, investment, operationTime,
        regionalCompanyName, research, minWaterFlow, waterPrice, waterFactoryName, businessUnitName
    } = contentProps;

    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <div className={styles.viewModalContainer}>
                <VtxModalList>
                    <PublicModal title={'水厂信息'}></PublicModal>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '事业部', width: 100, key: 'businessUnitName'}
                        }}
                    >{businessUnitName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '区域公司', width: 100, key: 'regionalCompanyName' }
                        }}
                    >{regionalCompanyName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '水厂名称', width: 100, key: 'waterFactoryName'}
                        }}
                    >{waterFactoryName}</div>

                    <PublicModal title={'前期资料'}></PublicModal>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '可研及批复', width: 100, key: 'research' }
                        }}
                    >{research}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '环评及批复', width: 100, key: 'envAssessment' }
                        }}
                    >{envAssessment}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '环保验收资料', width: 100, key: 'acceptance'}
                        }}
                    >{acceptance}</div>

                    <PublicModal title={'基本情况'}></PublicModal>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目总投资', width: 100, key: 'investment'}
                        }}
                    >{investment}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '设计单位', width: 100, key: 'designUnit'}
                        }}
                    >{designUnit}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '建设单位', width: 100, key: 'constructionUnit'}
                        }}
                    >{constructionUnit}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '建设时间', width: 100, key: 'constructionTime'}
                        }}
                    >{constructionTime}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '环保验收时间', width: 100, key: 'acceptanceTime'}
                        }}
                    >{acceptanceTime}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '投运时间', width: 100, key: 'operationTime'}
                        }}
                    >{operationTime}</div>
                </VtxModalList>
            </div>
        </VtxModal>
    )
}

export default View;