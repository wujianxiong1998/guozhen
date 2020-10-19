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
            editType === 'edit' ? 
            <Button key='save' size='large' loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        state && save()
                    })
                }}>保存</Button> : '',
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, dataType, btnType, floorArea,regionalCompanyId, sewageLicense,
            regionalCompanyName,waterFactoryName,permissionCode,
                orgCode,legalRepresentative,issueUnit,
                mainContaminant,emissionsWay,dischargeOutletNum,
                dischargeOutletDistribution,scale,exeStandard,
                limitConcentrationVolume,yearLimitVolume,startDate,
                endDate,permitRemark,envReport,envScheme,contingencyPlan,permission,username,password,
                remark,state,regionalCompanySelect,waterFactoryId,waterFactorySelect,
                // 填报
                concentrationCod,concentrationNh3n,concentrationTn,concentrationTp,date,name,pollutionCod,pollutionNh3n,
                pollutionTn,pollutionTp,
                waterVolume,

        } = contentProps
        const { updateItem, updateState, getList, calculateTargetValue, calculateConsumeTargetValue } = contentProps;
        let {isOpen} = this.state
        // btnType === 'add' ?
        let isDisabled = btnType==='view'?true:false
        let isDefault = btnType==='add'?false:true
        console.log(dataType)
        
        return (
            dataType==='produce'?<FullScreenModal
                {...modalProps}
                footer={this.footerRender()}>
                <PublicModal title={'排污许可证信息'}></PublicModal>
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
                        defaultValue={permission}
                        value={permission}
                        onChange={(e) => {
                            updateItem({
                                permission : e.target.value
                            })
                        }}
                        //placeholder="请输入排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排污许可证',
                                width: '40',
                                key: 'permission'
                            },
                            regexp : {
                                value : permission,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={permissionCode}
                        value={permissionCode}
                        onChange={(e) => {
                            updateItem({
                                permissionCode : e.target.value
                            })
                        }}
                        //placeholder="请输入证书编号"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '证书编号',
                                width: '40',
                                key: 'permissionCode'
                            },
                            regexp : {
                                value : permissionCode,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={orgCode}
                        value={orgCode}
                        onChange={(e) => {
                            updateItem({
                                orgCode : e.target.value
                            })
                        }}
                        //placeholder="请输入组织机构代码"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '组织机构代码',
                                width: '40',
                                key: 'orgCode'
                            },
                            regexp : {
                                value : orgCode,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={legalRepresentative}
                        value={legalRepresentative}
                        onChange={(e) => {
                            updateItem({
                                legalRepresentative : e.target.value
                            })
                        }}
                        //placeholder="请输入法定代表人"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '法定代表人',
                                width: '40',
                                key: 'legalRepresentative'
                            },
                            regexp : {
                                value : legalRepresentative,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={issueUnit}
                        value={issueUnit}
                        onChange={(e) => {
                            updateItem({
                                issueUnit : e.target.value
                            })
                        }}
                        //placeholder="请输入发证单位"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '发证单位',
                                width: '40',
                                key: 'issueUnit'
                            },
                            regexp : {
                                value : issueUnit,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={mainContaminant}
                        value={mainContaminant}
                        onChange={(e) => {
                            updateItem({
                                mainContaminant : e.target.value
                            })
                        }}
                        //placeholder="请输入主要污染物种类及限排污染物名称"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '主要污染物种类及限排污染物名称',
                                width: '40',
                                key: 'mainContaminant'
                            },
                            regexp : {
                                value : mainContaminant,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={emissionsWay}
                        value={emissionsWay}
                        onChange={(e) => {
                            updateItem({
                                emissionsWay : e.target.value
                            })
                        }}
                        //placeholder="请输入排放方式"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排放方式',
                                width: '40',
                                key: 'emissionsWay'
                            },
                            regexp : {
                                value : emissionsWay,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        addonAfter={'座'}
                        defaultValue={dischargeOutletNum}
                        value={dischargeOutletNum}
                        onChange={(e) => {
                            updateItem({
                                dischargeOutletNum : e.target.value
                            })
                        }}
                        //placeholder="请输入排放口数量(座)"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排放口数量',
                                width: '40',
                                key: 'dischargeOutletNum'
                            },
                            regexp : {
                                value : dischargeOutletNum,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={dischargeOutletDistribution}
                        value={dischargeOutletDistribution}
                        onChange={(e) => {
                            updateItem({
                                dischargeOutletDistribution : e.target.value
                            })
                        }}
                        //placeholder="请输入排放口分布情况"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排放口分布情况',
                                width: '40',
                                key: 'dischargeOutletDistribution'
                            },
                            regexp : {
                                value : dischargeOutletDistribution,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={scale}
                        value={scale}
                        onChange={(e) => {
                            updateItem({
                                scale : e.target.value
                            })
                        }}
                        //placeholder="请输入设计规模"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '设计规模',
                                width: '40',
                                key: 'scale'
                            },
                            regexp : {
                                value : scale,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={exeStandard}
                        value={exeStandard}
                        onChange={(e) => {
                            updateItem({
                                exeStandard : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '执行的污染物排放标准',
                                width: '40',
                                key: 'exeStandard'
                            },
                            regexp : {
                                value : exeStandard,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={limitConcentrationVolume}
                        value={limitConcentrationVolume}
                        onChange={(e) => {
                            updateItem({
                                limitConcentrationVolume : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '主要污染物排放浓度限值',
                                width: '40',
                                key: 'limitConcentrationVolume'
                            },
                            regexp : {
                                value : limitConcentrationVolume,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={yearLimitVolume}
                        value={yearLimitVolume}
                        onChange={(e) => {
                            updateItem({
                                yearLimitVolume : e.target.value
                            })
                        }}
                        // defaultValue={}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '年度污染物排放限值',
                                width: '40',
                                key: 'yearLimitVolume'
                            },
                            regexp : {
                                value : yearLimitVolume,
                            }
                        }}/>
                    <VtxDatePicker
                        value={startDate}
                        disabled={isDisabled}
                        onChange={(date, dateString) => {
                            updateItem({
                                startDate: dateString
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
                                name: '排污许可证发证日期',
                                width: '40',
                                key: 'startDate'
                            },
                            regexp: {
                                value: startDate
                            }
                        }}
                    />
                    <VtxDatePicker
                        disabled={isDisabled}
                        value={endDate}
                        onChange={(date, dateString) => {
                            updateItem({
                                endDate: dateString
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
                                name: '排污许可证有效期',
                                width: '40',
                                key: 'endDate'
                            },
                            regexp: {
                                value: endDate
                            }
                        }}
                    />
                    <TextArea
                        disabled={isDisabled}
                        defaultValue={permitRemark}
                        value={permitRemark}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                permitRemark : e.target.value
                            })
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排污许可备注',
                                width: '70',
                                maxNum: 500,
                                key: 'permitRemark'
                            },
                            regexp : {
                                value : permitRemark
                            }
                        }}
                    />
                    <RadioGroup 
                        disabled={isDisabled}
                        onChange={(e)=>{
                            updateItem({
                                envReport:e.target.value || 0
                            })
                        }}
                        defaultValue={envReport==='有'?1:0}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: false,
                                name: '环境影响评价报告',
                                width: '40',
                                key: 'envReport'
                            },
                        }}
                    >
                        <Radio value={1}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                        disabled={isDisabled}
                        defaultValue={envScheme==='有'?1:0}
                        onChange={(e)=>{
                            updateItem({
                                envScheme:e.target.value || 0
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: false,
                                name: '环境自行监测方案',
                                width: '40',
                                key: 'envScheme'
                            },
                        }}
                    >
                        <Radio value={1}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                        disabled={isDisabled}
                        defaultValue={contingencyPlan==='有'?1:0}
                        onChange={(e)=>{
                            updateItem({
                                contingencyPlan :e.target.value || 0
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: false,
                                name: '突发环境应急预案',
                                width: '40',
                                key: 'contingencyPlan'
                            },
                        }}
                    >
                        <Radio value={1}>有备案</Radio>
                        <Radio value={0}>无备案</Radio>
                    </RadioGroup>
                    <TextArea
                        value={remark}
                        disabled={isDisabled}
                        defaultValue={remark}
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
                <PublicModal title={'账户信息'}></PublicModal>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Input
                        value={username}
                        disabled={isDisabled}
                        defaultValue={username}
                        onChange={(e) => {
                            updateItem({
                                username : e.target.value
                            })
                        }}
                        //placeholder="请输入主要污染物种类"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '登录名',
                                width: '40',
                                key: 'username'
                            },
                            regexp : {
                                value : username,
                            }
                        }}/>
                    <div
                        data-modallist={{
                            layout:{
                                comType: 'password',
                                require: false,
                                name: '登录密码',
                                width: '40',
                                key: 'password'
                            },
                            regexp : {
                                value : password,
                            }
                        }}>
                        <input
                            type={isOpen?'text':'password'}
                            value={password}
                            disabled={isDisabled}
                            defaultValue={password}
                            onChange={(e) => {
                                updateItem({
                                    password : e.target.value
                                })
                            }}
                            //placeholder="请输入限排污染物名称"
                            maxLength="32"
                            className={styles.my_input}
                        />
                        <Icon onClick={()=>this.setState({
                            isOpen:!isOpen
                        })} type={isOpen?'eye-o':'eye'} style={{position: 'absolute', top: '7px', right: '10px'}}/>
                    </div>
                    
                </VtxModalList>
            </FullScreenModal>:<FullScreenModal {...modalProps}
                footer={this.footerRender()}>
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <VtxDatePicker
                        value={date}
                        disabled={isDisabled}
                        onChange={(date, dateString) => {
                            updateItem({
                                date: dateString
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
                                require: true,
                                name: '填报日期',
                                width: '40',
                                key: 'date'
                            },
                            regexp: {
                                value: startDate
                            }
                        }}
                    />
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
                        }}>
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
                        defaultValue={mainContaminant}
                        value={mainContaminant}
                        onChange={(e) => {
                            updateItem({
                                mainContaminant : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '主要污染物种类',
                                width: '40',
                                key: 'mainContaminant'
                            },
                            regexp : {
                                value : mainContaminant,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={name}
                        value={name}
                        onChange={(e) => {
                            updateItem({
                                name : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排污物名称',
                                width: '40',
                                key: 'name'
                            },
                            regexp : {
                                value : name,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={scale}
                        value={scale}
                        onChange={(e) => {
                            updateItem({
                                scale : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '设计规模',
                                width: '40',
                                key: 'scale'
                            },
                            regexp : {
                                value : scale,
                            }
                        }}/>

                    <Input
                        disabled={isDisabled}
                        defaultValue={exeStandard}
                        value={exeStandard}
                        onChange={(e) => {
                            updateItem({
                                exeStandard : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '执行的污染物排放标准',
                                width: '40',
                                key: 'exeStandard'
                            },
                            regexp : {
                                value : exeStandard,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={limitConcentrationVolume}
                        value={limitConcentrationVolume}
                        onChange={(e) => {
                            updateItem({
                                limitConcentrationVolume : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '主要污染物排放浓度限量',
                                width: '40',
                                key: 'limitConcentrationVolume'
                            },
                            regexp : {
                                value : limitConcentrationVolume,
                            }
                        }}/>

                    <Input
                        disabled={isDisabled}
                        defaultValue={yearLimitVolume}
                        value={yearLimitVolume}
                        onChange={(e) => {
                            updateItem({
                                yearLimitVolume : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '年度排污物排放值',
                                width: '40',
                                key: 'yearLimitVolume'
                            },
                            regexp : {
                                value : yearLimitVolume,
                            }
                        }}/>

                    <Input
                        addonAfter={'万吨'}
                        disabled={isDisabled}
                        defaultValue={waterVolume}
                        value={waterVolume}
                        onChange={(e) => {
                            updateItem({
                                waterVolume : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排放水量',
                                width: '40',
                                key: 'waterVolume'
                            },
                            regexp : {
                                value : waterVolume,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    </VtxModalList>
                    <PublicModal title={'排放水质指标浓度(mg/L)'}></PublicModal>
                    <VtxModalList
                        isRequired
                        visible={modalProps.visible}
                        ref={this.modalListRef}
                    >
                        <Input
                        disabled={isDisabled}
                        defaultValue={concentrationCod}
                        value={concentrationCod}
                        onChange={(e) => {
                            updateItem({
                                concentrationCod : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: 'COD',
                                width: '40',
                                key: 'concentrationCod'
                            },
                            regexp : {
                                value : concentrationCod,
                            }
                        }}/>
                        <Input
                        disabled={isDisabled}
                        defaultValue={concentrationNh3n}
                        value={concentrationNh3n}
                        onChange={(e) => {
                            updateItem({
                                concentrationNh3n : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: 'NH3-N',
                                width: '40',
                                key: 'concentrationNh3n'
                            },
                            regexp : {
                                value : concentrationNh3n,
                            }
                        }}/>
                        <Input
                        disabled={isDisabled}
                        defaultValue={concentrationTn}
                        value={concentrationTn}
                        onChange={(e) => {
                            updateItem({
                                concentrationTn : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: 'TN',
                                width: '40',
                                key: 'concentrationTn'
                            },
                            regexp : {
                                value : concentrationTn,
                            }
                        }}/>
                        <Input
                        disabled={isDisabled}
                        defaultValue={concentrationTp}
                        value={concentrationTp}
                        onChange={(e) => {
                            updateItem({
                                concentrationTp : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: 'TP',
                                width: '40',
                                key: 'concentrationTp'
                            },
                            regexp : {
                                value : concentrationTp,
                            }
                        }}/>
                        </VtxModalList>
                        <PublicModal title={'排放水质指标污染量(t)'}></PublicModal>
                        <VtxModalList
                            isRequired
                            visible={modalProps.visible}
                            ref={this.modalListRef}
                        >
                            <Input
                            disabled={isDisabled}
                            defaultValue={pollutionCod}
                            value={pollutionCod}
                            onChange={(e) => {
                                updateItem({
                                    pollutionCod : e.target.value
                                })
                            }}
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: false,
                                    name: 'COD',
                                    width: '40',
                                    key: 'pollutionCod'
                                },
                                regexp : {
                                    value : pollutionCod,
                                }
                            }}/>
                            <Input
                            disabled={isDisabled}
                            defaultValue={pollutionNh3n}
                            value={pollutionNh3n}
                            onChange={(e) => {
                                updateItem({
                                    pollutionNh3n : e.target.value
                                })
                            }}
                            //placeholder="排污许可证"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: false,
                                    name: 'NH3-N',
                                    width: '40',
                                    key: 'pollutionNh3n'
                                },
                                regexp : {
                                    value : pollutionNh3n,
                                }
                            }}/>
                            <Input
                            disabled={isDisabled}
                            defaultValue={pollutionTn}
                            value={pollutionTn}
                            onChange={(e) => {
                                updateItem({
                                    pollutionTn : e.target.value
                                })
                            }}
                            //placeholder="排污许可证"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: false,
                                    name: 'TN',
                                    width: '40',
                                    key: 'pollutionTn'
                                },
                                regexp : {
                                    value : pollutionTn,
                                }
                            }}/>
                            <Input
                            disabled={isDisabled}
                            defaultValue={pollutionTp}
                            value={pollutionTp}
                            onChange={(e) => {
                                updateItem({
                                    pollutionTp : e.target.value
                                })
                            }}
                            //placeholder="排污许可证"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: false,
                                    name: 'TP',
                                    width: '40',
                                    key: 'pollutionTp'
                                },
                                regexp : {
                                    value : pollutionTp,
                                }
                            }}/>
                    </VtxModalList>
            </FullScreenModal>
                
        )
    }
}

export default ADD;