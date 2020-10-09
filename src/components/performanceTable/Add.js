import React from 'react';

import { VtxModal, VtxModalList, VtxDate, VtxImport } from 'vtx-ui';
const { VtxDatePicker } = VtxDate;
import PublicModal from '../../components/publicModal'
import { Button,Table,Input,message, Select, Radio, Icon } from 'antd';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import moment from 'moment'
import FullScreenModal from '../FullScreenModal'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import { VtxUtil, openImportView } from '../../utils/util'
import styles from './index.less'
import { useDebugValue } from 'react';
class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            isOpen: false
        };
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save, editType, btnType, dataType, saveAfterCalculateConsumeValue } = contentProps;
        const fillData = contentProps.fillData||[]
        const _t = this;
        //验证表格中是否有未填项
        let isAllFill = true
        return [
            <Button key='save' size='large' loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        state && save()
                    })
                }}>保存</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, dataType, btnType, floorArea, sewageLicense,
                waterFactoryName,permissionCode,
                orgCode,legalRepresentative,issueUnit,
                mainContaminant,emissionsWay,dischargeOutletNum,
                endDate,permitRemark,permission,
                regionalCompanySelect,waterFactoryId,waterFactorySelect,
                // 管网业绩表
                middleWaterPipeline, projectName, projectType, projectTypeStr,
                rainWaterPump, rainwaterPipeline, regionalCompanyId, regionalCompanyName,
                remark, sewagePipeline, sewagePump, waterSupplyPipeline,pipeNet,
                // 污水厂汇总表
                address, bottomWater, chargingModel, contractEndTime, contractStartTime,
                designProcess, designScale, operationTime, operationTimeStr, operationYear,
                price,  projectTypeOne, projectTypeThree, projectTypeTwo, waterTarget

        } = contentProps
        const { updateItem } = contentProps;
        let isDisabled = btnType==='view'?true:false
        
        let pipelLine = <FullScreenModal
                {...modalProps}
                footer={this.footerRender()}>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    
                    <Select
                        value={regionalCompanyName}
                        onSelect={(value,option) => {   
                            updateItem({
                                regionalCompanyName: option.props.children,
                                regionalCompanyId: value
                            })
                        }}
                        defaultValue={regionalCompanyName}
                        placeholder="请选择区域（必选项）"
                        // allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '区域',
                                width: '40',
                                key: 'regionalCompanyId'
                            },
                            regexp: {
                                value: regionalCompanyId
                            }
                        }}
                    >
                        {regionalCompanySelect.map(item => {
                            return <Select.Option unitId={item.parentId} key={item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
                    <Input
                        disabled={isDisabled}
                        defaultValue={projectName}
                        value={projectName}
                        onChange={(e) => {
                            updateItem({
                                projectName : e.target.value
                            })
                        }}
                        //placeholder="请输入排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '项目名称',
                                width: '40',
                                key: 'projectName'
                            },
                            regexp : {
                                value : projectName,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={rainwaterPipeline}
                        value={rainwaterPipeline}
                        onChange={(e) => {
                            updateItem({
                                rainwaterPipeline : e.target.value
                            })
                        }}
                        //placeholder="请输入证书编号"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '雨水管网(公里)',
                                width: '40',
                                key: 'rainwaterPipeline'
                            },
                            regexp : {
                                value : rainwaterPipeline,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={sewagePipeline}
                        value={sewagePipeline}
                        onChange={(e) => {
                            updateItem({
                                sewagePipeline : e.target.value
                            })
                        }}
                        //placeholder="请输入组织机构代码"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '污水管网(公里)',
                                width: '40',
                                key: 'sewagePipeline'
                            },
                            regexp : {
                                value : sewagePipeline,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={middleWaterPipeline}
                        value={middleWaterPipeline}
                        onChange={(e) => {
                            updateItem({
                                middleWaterPipeline : e.target.value
                            })
                        }}
                        //placeholder="请输入法定代表人"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '中水管网(公里)',
                                width: '40',
                                key: 'middleWaterPipeline'
                            },
                            regexp : {
                                value : middleWaterPipeline,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={waterSupplyPipeline}
                        value={waterSupplyPipeline}
                        onChange={(e) => {
                            updateItem({
                                waterSupplyPipeline : e.target.value
                            })
                        }}
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '给水管网(公里)',
                                width: '40',
                                key: 'waterSupplyPipeline'
                            },
                            regexp : {
                                value : waterSupplyPipeline,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={rainWaterPump}
                        value={rainWaterPump}
                        onChange={(e) => {
                            updateItem({
                                rainWaterPump : e.target.value
                            })
                        }}
                        //placeholder="请输入主要污染物种类及限排污染物名称"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '雨水泵站(座)',
                                width: '40',
                                key: 'rainWaterPump'
                            },
                            regexp : {
                                value : rainWaterPump,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={sewagePump}
                        value={sewagePump}
                        onChange={(e) => {
                            updateItem({
                                sewagePump : e.target.value
                            })
                        }}
                        //placeholder="请输入排放方式"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '污水泵站(座)',
                                width: '40',
                                key: 'sewagePump'
                            },
                            regexp : {
                                value : sewagePump,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={pipeNet}
                        value={pipeNet}
                        onChange={(e) => {
                            updateItem({
                                pipeNet : e.target.value
                            })
                        }}
                        //placeholder="请输入排放口数量(座)"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '管网(万元/年)',
                                width: '40',
                                key: 'pipeNet'
                            },
                            regexp : {
                                value : pipeNet,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Select
                        value={projectType}
                        onSelect={(value,option) => {   
                            updateItem({
                                projectType: value
                            })
                        }}
                        defaultValue={projectType}
                        // allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '项目类型',
                                width: '40',
                                key: 'projectType'
                            },
                            regexp: {
                                value: projectType
                            }
                        }}
                    >
                        <Select.Option key={'0'} value={'zj'}>在建</Select.Option>
                        <Select.Option key={'1'} value={'yx'}>运行</Select.Option>
                        <Select.Option key={'2'} value={'bhyw'}>不含运维</Select.Option>
                        <Select.Option key={'3'} value={'ppp'}>PPP</Select.Option>
                    </Select>
                    <TextArea
                        disabled={isDisabled}
                        defaultValue={remark}
                        value={remark}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                remark : e.target.value
                            })
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '备注',
                                width: '70',
                                maxNum: 500,
                                key: 'remark'
                            },
                            regexp : {
                                value : remark
                            }
                        }}
                    />
                </VtxModalList>
            </FullScreenModal>
        let sewage = <FullScreenModal
            {...modalProps}
            footer={this.footerRender()}>
            <VtxModalList
                isRequired
                visible={modalProps.visible}
                ref={this.modalListRef}
            >
                
                <Select
                    value={regionalCompanyName}
                    onSelect={(value,option) => {   
                        updateItem({
                            regionalCompanyName: option.props.children,
                            regionalCompanyId: value
                        })
                    }}
                    defaultValue={regionalCompanyName}
                    placeholder="请选择区域（必选项）"
                    // allowClear
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '区域',
                            width: '40',
                            key: 'regionalCompanyId'
                        },
                        regexp: {
                            value: regionalCompanyId
                        }
                    }}
                >
                    {regionalCompanySelect.map(item => {
                        return <Select.Option unitId={item.parentId} key={item.id}>{item.name}</Select.Option>
                    })}
                </Select>
                <Select
                    value={waterFactoryName}
                    onSelect={(value,option) => {  
                        updateItem({
                            waterFactoryName: option.props.children,
                            waterFactoryId: value
                        })
                    }}
                    defaultValue={waterFactoryName}
                    // allowClear
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '公司名称',
                            width: '40',
                            key: 'waterFactoryName'
                        },
                        regexp: {
                            value: waterFactoryName
                        }
                    }}
                >
                    {waterFactorySelect.map(item => {
                        return <Select.Option unitId={item.parentId} key={item.id}>{item.name}</Select.Option>
                    })}
                </Select>
                <Input
                    disabled={isDisabled}
                    defaultValue={projectName}
                    value={projectName}
                    onChange={(e) => {
                        updateItem({
                            projectName : e.target.value
                        })
                    }}
                    //placeholder="请输入排污许可证"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: true,
                            name: '项目名称',
                            width: '40',
                            key: 'projectName'
                        },
                        regexp : {
                            value : projectName,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Select
                    value={projectTypeOne}
                    onSelect={(value,option) => {   
                        updateItem({
                            projectTypeOne: value
                        })
                    }}
                    defaultValue={projectTypeOne}
                    // allowClear
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '项目类型1',
                            width: '40',
                            key: 'projectTypeOne'
                        },
                        regexp: {
                            value: projectTypeOne
                        }
                    }}
                >
                    <Select.Option key={'0'} value={'bot'}>BOT</Select.Option>
                    <Select.Option key={'tot'} value={'tot'}>TOT</Select.Option>
                    <Select.Option key={'ppp'} value={'ppp'}>PPP</Select.Option>
                    <Select.Option key={'wtyy'} value={'wtyy'}>委托运营</Select.Option>
                </Select>
                <Select
                    value={projectTypeTwo}
                    onSelect={(value,option) => {   
                        updateItem({
                            projectTypeTwo: value
                        })
                    }}
                    defaultValue={projectTypeTwo}
                    // allowClear
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '项目类型2',
                            width: '40',
                            key: 'projectTypeTwo'
                        },
                        regexp: {
                            value: projectTypeTwo
                        }
                    }}
                >
                    <Select.Option key={'0'} value={'yx'}>运行</Select.Option>
                    <Select.Option key={'1'} value={'zj'}>在建</Select.Option>
                    <Select.Option key={'2'} value={'jsfw'}>技术服务</Select.Option>
                </Select>
                <Select
                    value={projectTypeThree}
                    onSelect={(value,option) => {   
                        updateItem({
                            projectTypeThree: value
                        })
                    }}
                    defaultValue={projectTypeThree}
                    // allowClear
                    data-modallist={{
                        layout: {
                            comType: 'input',
                            require: true,
                            name: '项目类型3',
                            width: '40',
                            key: 'projectTypeThree'
                        },
                        regexp: {
                            value: projectTypeThree
                        }
                    }}
                >
                    <Select.Option key={'0'} value={'sz'}>市政</Select.Option>
                    <Select.Option key={'1'} value={'xz'}>乡（村）镇</Select.Option>
                    <Select.Option key={'2'} value={'zls'}>自来水</Select.Option>
                    <Select.Option key={'2'} value={'zs'}>中水</Select.Option>
                    <Select.Option key={'2'} value={'ys'}>雨水</Select.Option>
                    <Select.Option key={'2'} value={'dx'}>调蓄</Select.Option>
                </Select>
                <Input
                    disabled={isDisabled}
                    defaultValue={designScale}
                    value={designScale}
                    onChange={(e) => {
                        updateItem({
                            designScale : e.target.value
                        })
                    }}
                    //placeholder="请输入证书编号"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '设计规模(万元/日)',
                            width: '40',
                            key: 'designScale'
                        },
                        regexp : {
                            value : designScale,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Input
                    disabled={isDisabled}
                    defaultValue={bottomWater}
                    value={bottomWater}
                    onChange={(e) => {
                        updateItem({
                            bottomWater : e.target.value
                        })
                    }}
                    //placeholder="请输入组织机构代码"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '保底水量(万吨/日)',
                            width: '40',
                            key: 'bottomWater'
                        },
                        regexp : {
                            value : bottomWater,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Input
                    disabled={isDisabled}
                    defaultValue={price}
                    value={price}
                    onChange={(e) => {
                        updateItem({
                            price : e.target.value
                        })
                    }}
                    //placeholder="请输入法定代表人"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '目前单价',
                            width: '40',
                            key: 'price'
                        },
                        regexp : {
                            value : price,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <VtxDatePicker
                    value={contractStartTime}
                    disabled={isDisabled}
                    onChange={(date, dateString) => {
                        updateItem({
                            contractStartTime: dateString
                        });
                        if (dataType=='consum'){
                            calculateConsumeTargetValue()
                        }
                        
                    }}
                    disabledDate={
                        (current)=>{
                            return VtxTimeUtil.isAfterDate(current);
                        }
                    }
                    data-modallist={{
                        layout: {
                            comType: '',
                            require: false,
                            name: '合同开始日期',
                            width: '40',
                            key: 'contractStartTime'
                        },
                        regexp: {
                            value: contractStartTime
                        }
                    }}
                />
                <VtxDatePicker
                    value={contractEndTime}
                    disabled={isDisabled}
                    onChange={(date, dateString) => {
                        updateItem({
                            contractEndTime: dateString
                        });
                        if (dataType=='consum'){
                            calculateConsumeTargetValue()
                        }
                        
                    }}
                    disabledDate={
                        (current)=>{
                            return VtxTimeUtil.isAfterDate(current);
                        }
                    }
                    data-modallist={{
                        layout: {
                            comType: '',
                            require: false,
                            name: '合同终止日期',
                            width: '40',
                            key: 'contractEndTime'
                        },
                        regexp: {
                            value: contractEndTime
                        }
                    }}
                />
                <Input
                    disabled={isDisabled}
                    defaultValue={operationYear}
                    value={operationYear}
                    onChange={(e) => {
                        updateItem({
                            operationYear : e.target.value
                        })
                    }}
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '运营年限',
                            width: '40',
                            key: 'operationYear'
                        },
                        regexp : {
                            value : operationYear,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <VtxDatePicker
                    value={operationTime}
                    disabled={isDisabled}
                    onChange={(date, dateString) => {
                        updateItem({
                            operationTime: dateString
                        });
                        if (dataType=='consum'){
                            calculateConsumeTargetValue()
                        }
                        
                    }}
                    disabledDate={
                        (current)=>{
                            return VtxTimeUtil.isAfterDate(current);
                        }
                    }
                    data-modallist={{
                        layout: {
                            comType: '',
                            require: false,
                            name: '投入商业运营时间',
                            width: '40',
                            key: 'operationTime'
                        },
                        regexp: {
                            value: operationTime
                        }
                    }}
                />
                
                <Input
                    disabled={isDisabled}
                    defaultValue={chargingModel}
                    value={chargingModel}
                    onChange={(e) => {
                        updateItem({
                            chargingModel : e.target.value
                        })
                    }}
                    //placeholder="请输入主要污染物种类及限排污染物名称"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '收费模式',
                            width: '40',
                            key: 'chargingModel'
                        },
                        regexp : {
                            value : chargingModel,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Input
                    disabled={isDisabled}
                    defaultValue={waterTarget}
                    value={waterTarget}
                    onChange={(e) => {
                        updateItem({
                            waterTarget : e.target.value
                        })
                    }}
                    //placeholder="请输入排放方式"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '出水指标',
                            width: '40',
                            key: 'waterTarget'
                        },
                        regexp : {
                            value : waterTarget,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Input
                    disabled={isDisabled}
                    defaultValue={designProcess}
                    value={designProcess}
                    onChange={(e) => {
                        updateItem({
                            designProcess : e.target.value
                        })
                    }}
                    //placeholder="请输入排放口数量(座)"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '设计工艺',
                            width: '40',
                            key: 'designProcess'
                        },
                        regexp : {
                            value : designProcess,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
                <Input
                    disabled={isDisabled}
                    defaultValue={address}
                    value={address}
                    onChange={(e) => {
                        updateItem({
                            address : e.target.value
                        })
                    }}
                    //placeholder="请输入排放口数量(座)"
                    maxLength="32"
                    data-modallist={{
                        layout:{
                            comType: 'input',
                            require: false,
                            name: '所在地',
                            width: '40',
                            key: 'address'
                        },
                        regexp : {
                            value : address,
                            exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                        }
                    }}/>
            </VtxModalList>
        </FullScreenModal>
        let tableDatas
        switch (dataType) {
            case 'produce':
                tableDatas = pipelLine;
                break;
            case 'assay':
                tableDatas = sewage;
                break;
        }
        return (
            tableDatas       
        )
    }
}

export default ADD;