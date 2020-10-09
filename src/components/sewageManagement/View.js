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
    } = contentProps;
    console.log(props)
    return (
        dataType==='produce'?
        <VtxModal
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
                            layout: {type: 'text', name: '排污许可证', width: 100, key: 'permission'}
                        }}
                    >{permission}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '证书编号', width: 100, key: 'permissionCode' }
                        }}
                    >{permissionCode}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '组织机构代码', width: 100, key: 'orgCode' }
                        }}
                    >{orgCode}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '法定代表人', width: 100, key: 'legalRepresentative'}
                        }}
                    >{legalRepresentative}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '发证单位', width: 100, key: 'issueUnit'}
                        }}
                    >{issueUnit}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '主要污染物种类及限排污染物名称', width: 100, key: 'mainContaminant'}
                        }}
                    >{mainContaminant}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排放方式', width: 100, key: 'emissionsWay'}
                        }}
                    >{emissionsWay}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排放口数量(座)', width: 100, key: 'dischargeOutletNum'}
                        }}
                    >{dischargeOutletNum}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排放口分布情况', width: 100, key: 'dischargeOutletDistribution'}
                        }}
                    >{dischargeOutletDistribution}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '设计规模', width: 100, key: 'scale'}
                        }}
                    >{scale}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '执行的污染物排放标准', width: 100, key: 'exeStandard'}
                        }}
                    >{exeStandard}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '主要污染物排放浓度限值', width: 100, key: 'limitConcentrationVolume'}
                        }}
                    >{limitConcentrationVolume}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '年度污染物排放限值', width: 100, key: 'yearLimitVolume'}
                        }}
                    >{yearLimitVolume}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排污许可证发证日期', width: 100, key: 'startDate'}
                        }}
                    >{startDate}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排污许可证有效期', width: 100, key: 'endDate'}
                        }}
                    >{endDate}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排污许可备注', width: 100, key: 'permitRemark'}
                        }}
                    >{permitRemark}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '环境影响评价报告', width: 100, key: 'envReport'}
                        }}
                    >{envReport}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '环境自行监测方案', width: 100, key: 'envScheme'}
                        }}
                    >{envScheme}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '突发环境应急预案', width: 100, key: 'contingencyPlan'}
                        }}
                    >{contingencyPlan}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '备注', width: 100, key: 'remark'}
                        }}
                    >{remark}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '登录名', width: 100, key: 'username'}
                        }}
                    >{username}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '登录密码', width: 100, key: 'password'}
                        }}
                    >{password}</div>
                </VtxModalList>
            </div>      
        </VtxModal>:
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <div className={styles.viewModalContainer}>
                <VtxModalList>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '填报日期', width: 100, key: 'date'}
                        }}
                    >{date}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '区域', width: 100, key: 'regionalCompanyName' }
                        }}
                    >{regionalCompanyName}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '公司名称', width: 100, key: 'waterFactoryName'}
                        }}
                    >{waterFactoryName}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '主要污染物种类', width: 100, key: 'mainContaminant' }
                        }}
                    >{mainContaminant}</div>
                    <div
                        data-modallist={{
                            layout: { type: 'text', name: '排污物名称', width: 100, key: 'name' }
                        }}
                    >{name}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '设计规模', width: 100, key: 'scale'}
                        }}
                    >{scale}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '执行的污染物排放标准', width: 100, key: 'exeStandard'}
                        }}
                    >{exeStandard}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '主要污染物排放浓度限量', width: 100, key: 'limitConcentrationVolume'}
                        }}
                    >{limitConcentrationVolume}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '年度排污物排放值', width: 100, key: 'yearLimitVolume'}
                        }}
                    >{yearLimitVolume}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: '排放水量(万吨)', width: 100, key: 'waterVolume'}
                        }}
                    >{waterVolume}</div>
                </VtxModalList>
                <PublicModal title="排放水质指标浓度(mg/L)"></PublicModal>
                <VtxModalList>    
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'COD', width: 100, key: 'concentrationCod'}
                        }}
                    >{concentrationCod}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'NH3-N', width: 100, key: 'concentrationNh3n'}
                        }}
                    >{concentrationNh3n}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'TN', width: 100, key: 'concentrationTn'}
                        }}
                    >{concentrationTn}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'TP', width: 100, key: 'concentrationTp'}
                        }}
                    >{concentrationTp}</div>
                </VtxModalList>
                <PublicModal title="排放水质指标污染量(t)"></PublicModal>
                <VtxModalList> 
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'COD', width: 100, key: 'pollutionCod'}
                        }}
                    >{pollutionCod}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'NH3-N', width: 100, key: 'pollutionNh3n'}
                        }}
                    >{pollutionNh3n}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'TN', width: 100, key: 'pollutionTn'}
                        }}
                    >{pollutionTn}</div>
                    <div
                        data-modallist={{
                            layout: {type: 'text', name: 'TP', width: 100, key: 'pollutionTp'}
                        }}
                    >{pollutionTp}</div>
                    
                </VtxModalList>
            </div>
        </VtxModal>
    )
}

export default View;