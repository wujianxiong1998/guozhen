import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button } from 'antd';
import styles from './index.less';
import PublicModal from '../../components/publicModal'
function View(props) {

    const { updateWindow, modalProps, contentProps } = props;
    const {
        regionalCompanyName,waterFactoryName,permissionCode,
        orgCode,legalRepresentative,issueUnit,
        mainContaminant,emissionsWay,dischargeOutletNum,
        dischargeOutletDistribution,scale,exeStandard,
        limitConcentrationVolume,yearLimitVolume,startDate,
        endDate,permitRemark,envReport,envScheme,contingencyPlan,permission,username,password,
        remark,state,regionalCompanySelect,dataType,
        concentrationCod,concentrationNh3n,concentrationTn,concentrationTp,date,name,pollutionCod,pollutionNh3n,
        pollutionTn,pollutionTp,
        waterVolume,
        middleWaterPipeline, pipeNet, projectName, projectType, projectTypeStr, rainWaterPump, rainwaterPipeline,
        sewagePipeline, sewagePump, waterSupplyPipeline,
        address, bottomWater, chargingModel, contractEndTime, contractStartTime, designProcess, designScale, 
        operationTime, operationYear, price, projectTypeOneStr, projectTypeThreeStr, projectTypeTwoStr,
        waterTarget
    } = contentProps;
    let pipeline = <VtxModal
                        {...modalProps}
                        footer={[
                        ]}
                    >
                        <div className={styles.viewModalContainer}>
                            <VtxModalList>
                                <div
                                    data-modallist={{
                                        layout: {type: 'text', name: '区域', width: 100, key: 'regionalCompanyName'}
                                    }}
                                >{regionalCompanyName}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '项目名称', width: 100, key: 'projectName' }
                                    }}
                                >{projectName}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '雨水管网(公里)', width: 100, key: 'rainwaterPipeline' }
                                    }}
                                >{rainwaterPipeline}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '污水管网(公里)', width: 100, key: 'sewagePipeline' }
                                    }}
                                >{sewagePipeline}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '中水管网(公里)', width: 100, key: 'middleWaterPipeline' }
                                    }}
                                >{middleWaterPipeline}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '给水管网(公里)', width: 100, key: 'waterSupplyPipeline' }
                                    }}
                                >{waterSupplyPipeline}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '雨水泵站(座)', width: 100, key: 'rainWaterPump' }
                                    }}
                                >{rainWaterPump}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '污水泵站(座)', width: 100, key: 'sewagePump' }
                                    }}
                                >{sewagePump}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '管网(万元/年)', width: 100, key: 'pipeNet' }
                                    }}
                                >{pipeNet}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '项目类型', width: 100, key: 'projectTypeStr' }
                                    }}
                                >{projectTypeStr}</div>
                                <div
                                    data-modallist={{
                                        layout: { type: 'text', name: '备注', width: 100, key: 'remark' }
                                    }}
                                >{remark}</div>
                            </VtxModalList>
                        </div>      
                    </VtxModal>

        let sewage = <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <div className={styles.viewModalContainer}>
                <VtxModalList>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '区域', width: 100, key: 'regionalCompanyName'}
                        }}
                    >{regionalCompanyName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '公司名称', width: 100, key: 'waterFactoryName' }
                        }}
                    >{waterFactoryName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目名称', width: 100, key: 'projectName'}
                        }}
                    >{projectName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '项目类型1', width: 100, key: 'projectTypeOneStr' }
                        }}
                    >{projectTypeOneStr}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '项目类型2', width: 100, key: 'projectTypeTwoStr' }
                        }}
                    >{projectTypeTwoStr}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '项目类型3', width: 100, key: 'projectTypeThreeStr'}
                        }}
                    >{projectTypeThreeStr}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '设计规模(万吨/日)', width: 100, key: 'designScale'}
                        }}
                    >{designScale}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '保底水量(万吨/日)', width: 100, key: 'bottomWater'}
                        }}
                    >{bottomWater}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '目前单价', width: 100, key: 'price'}
                        }}
                    >{price}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '合同开始日期', width: 100, key: 'contractStartTime'}
                        }}
                    >{contractStartTime}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '合同终止日期', width: 100, key: 'contractEndTime'}
                        }}
                    >{contractEndTime}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '运营年限', width: 100, key: 'operationYear'}
                        }}
                    >{operationYear}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '投入商业运营时间', width: 100, key: 'operationTime'}
                        }}
                    >{operationTime}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '收费模式', width: 100, key: 'chargingModel'}
                        }}
                    >{chargingModel}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '出水指标', width: 100, key: 'waterTarget'}
                        }}
                    >{waterTarget}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '设计工艺', width: 100, key: 'designProcess'}
                        }}
                    >{designProcess}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '所在地', width: 100, key: 'address'}
                        }}
                    >{address}</div>
                </VtxModalList>
            </div>
        </VtxModal>
    
    return (
        dataType==='produce'?pipeline:sewage
    )
}

export default View;