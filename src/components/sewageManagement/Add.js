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
        console.log(contentProps)
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
                remark,state,regionalCompanySelect
        } = contentProps
        const { updateItem, updateState, getList, calculateTargetValue, calculateConsumeTargetValue } = contentProps;
        let {isOpen} = this.state
        // btnType === 'add' ?
        let isDisabled = btnType==='view'?true:false
        let isDefault = btnType==='add'?false:true
        return (
            <FullScreenModal
                {...modalProps}
                footer={this.footerRender()}
            >
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
                                regionalCompanyName: value,
                                regionalCompanyId: option.props.unitId
                            })
                        }}
                        placeholder="请选择区域（必选项）"
                        // allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '区域',
                                width: '80',
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
                        defaultValue={isDefault?waterFactoryName:''}
                        value={waterFactoryName}
                        onChange={(e) => {
                            updateItem({
                                waterFactoryName : e.target.value
                            })
                        }}
                        //placeholder="请输入公司名称"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '公司名称',
                                width: '33',
                                key: 'waterFactoryName'
                            },
                            regexp : {
                                value : waterFactoryName,
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?permission:''}
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
                                width: '33',
                                key: 'permission'
                            },
                            regexp : {
                                value : permission,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?permissionCode:''}
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
                                width: '33',
                                key: 'permissionCode'
                            },
                            regexp : {
                                value : permissionCode,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?orgCode:''}
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
                                width: '33',
                                key: 'orgCode'
                            },
                            regexp : {
                                value : orgCode,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?legalRepresentative:''}
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
                                width: '33',
                                key: 'legalRepresentative'
                            },
                            regexp : {
                                value : legalRepresentative,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?issueUnit:''}
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
                                width: '33',
                                key: 'issueUnit'
                            },
                            regexp : {
                                value : issueUnit,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?mainContaminant:''}
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
                                width: '33',
                                key: 'mainContaminant'
                            },
                            regexp : {
                                value : mainContaminant,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?emissionsWay:''}
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
                                width: '33',
                                key: 'emissionsWay'
                            },
                            regexp : {
                                value : emissionsWay,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?dischargeOutletNum:''}
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
                                name: '排放口数量(座)',
                                width: '33',
                                key: 'dischargeOutletNum'
                            },
                            regexp : {
                                value : dischargeOutletNum,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?dischargeOutletDistribution:''}
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
                                width: '33',
                                key: 'dischargeOutletDistribution'
                            },
                            regexp : {
                                value : dischargeOutletDistribution,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?scale:''}
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
                                width: '33',
                                key: 'scale'
                            },
                            regexp : {
                                value : scale,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    {/* <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?mainContaminant:''}
                        value={mainContaminant}
                        onChange={(e) => {
                            updateItem({
                                mainContaminant : e.target.value
                            })
                        }}
                        //placeholder="请输入主要污染物种类"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '主要污染物种类',
                                width: '33',
                                key: 'mainContaminant'
                            },
                            regexp : {
                                value : mainContaminant,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/> */}
                    {/* <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?mainContaminant:''}
                        value={mainContaminant}
                        onChange={(e) => {
                            updateItem({
                                mainContaminant : e.target.value
                            })
                        }}
                        //placeholder="请输入限排污染物名称"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '限排污染物名称',
                                width: '33',
                                key: 'mainContaminant'
                            },
                            regexp : {
                                value : mainContaminant,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/> */}
                    {/* <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?emissionsWay:''}
                        value={emissionsWay}
                        onChange={(e) => {
                            updateItem({
                                emissionsWay : e.target.value
                            })
                        }}
                        //placeholder="排污许可证"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '排放方式',
                                width: '33',
                                key: 'emissionsWay'
                            },
                            regexp : {
                                value : emissionsWay,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/> */}
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?exeStandard:''}
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
                                width: '33',
                                key: 'exeStandard'
                            },
                            regexp : {
                                value : exeStandard,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?limitConcentrationVolume:''}
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
                                width: '33',
                                key: 'limitConcentrationVolume'
                            },
                            regexp : {
                                value : limitConcentrationVolume,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?yearLimitVolume:''}
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
                                width: '33',
                                key: 'yearLimitVolume'
                            },
                            regexp : {
                                value : yearLimitVolume,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
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
                                require: true,
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
                                require: true,
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
                                require: true,
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
                        defaultValue={isDefault?envReport:0}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '环境影响评价报告',
                                width: '33',
                                key: 'envReport'
                            },
                        }}
                    >
                        <Radio value={envReport}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                        disabled={isDisabled}
                        defaultValue={isDefault?envScheme:0}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '环境自行监测方案',
                                width: '33',
                                key: 'envScheme'
                            },
                        }}
                    >
                        <Radio value={envScheme}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                            disabled={isDisabled}
                            defaultValue={isDefault?contingencyPlan:0}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '突发环境应急预案',
                                width: '33',
                                key: 'contingencyPlan'
                            },
                        }}
                    >
                        <Radio value={contingencyPlan}>有备案</Radio>
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
                                require: true,
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
                        defaultValue={isDefault?username:''}
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
                                width: '33',
                                key: 'username'
                            },
                            regexp : {
                                value : username,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <div
                        data-modallist={{
                            layout:{
                                comType: 'password',
                                require: false,
                                name: '登录密码',
                                width: '33',
                                key: 'password'
                            },
                            regexp : {
                                value : password,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}>
                        <input
                            type={isOpen?'text':'password'}
                            value={password}
                            disabled={isDisabled}
                            defaultValue={isDefault?password:''}
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
            </FullScreenModal>
                
        )
    }
}

export default ADD;