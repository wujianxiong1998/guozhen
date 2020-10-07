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
            editType === 'edit' ? <Button disabled={!fillData.length} key='save' size='large' loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        if(state){
                            if (btnType === 'edit' && dataType==='consum'){
                                saveAfterCalculateConsumeValue('xj')
                            } else {
                                save('xj', dataType)
                            }
                        }
                    })
                }}>保存</Button> : '',
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, dateValue, dataType, btnType, floorArea,regionalCompanyId, sewageLicense,
        a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27 } = contentProps
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
                        disabled={isDisabled}
                        defaultValue={isDefault?regionalCompanyId:''}
                        value={regionalCompanyId}
                        onSelect={(value,option) => {                                
                            updateItem({
                                regionalCompanyId: value,
                                businessUnitId:option.props.unitId
                            })
                        }}
                        //placeholder="请选择区域（必选项）"
                        // allowClear
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '区域',
                                width: '33',
                                key: 'regionalCompanyId'
                            },
                            regexp: {
                                value: regionalCompanyId
                            }
                        }}
                    >
                        <Select.Option value="lucy">lucy</Select.Option>
                        <Select.Option value="John">John</Select.Option>
                    </Select>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?floorArea:''}
                        value={floorArea}
                        onChange={(e) => {
                            updateItem({
                                floorArea : e.target.value
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
                                key: 'floorArea'
                            },
                            regexp : {
                                value : floorArea,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?sewageLicense:''}
                        value={sewageLicense}
                        onChange={(e) => {
                            updateItem({
                                sewageLicense : e.target.value
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
                                key: 'sewageLicense'
                            },
                            regexp : {
                                value : sewageLicense,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a4:''}
                        value={a4}
                        onChange={(e) => {
                            updateItem({
                                a4 : e.target.value
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
                                key: 'a4'
                            },
                            regexp : {
                                value : a4,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a5:''}
                        value={a5}
                        onChange={(e) => {
                            updateItem({
                                a5 : e.target.value
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
                                key: 'a5'
                            },
                            regexp : {
                                value : a5,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a6:''}
                        value={a6}
                        onChange={(e) => {
                            updateItem({
                                a6 : e.target.value
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
                                key: 'a6'
                            },
                            regexp : {
                                value : a6,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a7:''}
                        value={a7}
                        onChange={(e) => {
                            updateItem({
                                a7 : e.target.value
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
                                key: 'a7'
                            },
                            regexp : {
                                value : a7,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a8:''}
                        value={a8}
                        onChange={(e) => {
                            updateItem({
                                a8 : e.target.value
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
                                key: 'a8'
                            },
                            regexp : {
                                value : a8,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a9:''}
                        value={a9}
                        onChange={(e) => {
                            updateItem({
                                a9 : e.target.value
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
                                key: 'a9'
                            },
                            regexp : {
                                value : a9,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a10:''}
                        value={a10}
                        onChange={(e) => {
                            updateItem({
                                a10 : e.target.value
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
                                key: 'a10'
                            },
                            regexp : {
                                value : a10,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a11:''}
                        value={a11}
                        onChange={(e) => {
                            updateItem({
                                a11 : e.target.value
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
                                key: 'a11'
                            },
                            regexp : {
                                value : a11,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a12:''}
                        value={a12}
                        onChange={(e) => {
                            updateItem({
                                a12 : e.target.value
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
                                key: 'a12'
                            },
                            regexp : {
                                value : a12,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a13:''}
                        value={a13}
                        onChange={(e) => {
                            updateItem({
                                a13 : e.target.value
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
                                key: 'a13'
                            },
                            regexp : {
                                value : a13,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a14:''}
                        value={a14}
                        onChange={(e) => {
                            updateItem({
                                a14 : e.target.value
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
                                key: 'a14'
                            },
                            regexp : {
                                value : a14,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a15:''}
                        value={a15}
                        onChange={(e) => {
                            updateItem({
                                a15 : e.target.value
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
                                key: 'a15'
                            },
                            regexp : {
                                value : a15,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a16:''}
                        value={a16}
                        onChange={(e) => {
                            updateItem({
                                a16 : e.target.value
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
                                key: 'a16'
                            },
                            regexp : {
                                value : a16,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a17:''}
                        value={a17}
                        onChange={(e) => {
                            updateItem({
                                a17 : e.target.value
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
                                key: 'a17'
                            },
                            regexp : {
                                value : a17,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <Input
                        disabled={isDisabled}
                        defaultValue={isDefault?a18:''}
                        value={a18}
                        onChange={(e) => {
                            updateItem({
                                a18 : e.target.value
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
                                key: 'a18'
                            },
                            regexp : {
                                value : a18,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}/>
                    <VtxDatePicker
                        value={isDisabled?a19:''}
                        disabled={isDisabled}
                        onChange={(date, dateString) => {
                            updateItem({
                                a19: dateString
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
                                name: '选择时间',
                                width: '40',
                                key: 'a19'
                            },
                            regexp: {
                                value: a19
                            }
                        }}
                    />
                    <VtxDatePicker
                        disabled={isDisabled}
                        value={isDisabled?a20:''}
                        onChange={(date, dateString) => {
                            updateItem({
                                dateValue: dateString
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
                                name: '选择时间',
                                width: '40',
                                key: 'dateValue'
                            },
                            regexp: {
                                value: dateValue
                            }
                        }}
                    />
                    <TextArea
                        disabled={isDisabled}
                        defaultValue={isDefault?a20:''}
                        value={a20}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                problemContent : e.target.value
                            })
                        }}
                        placeholder="请输入问题描述（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '排污许可备注',
                                width: '70',
                                maxNum: 500,
                                key: 'a20'
                            },
                            regexp : {
                                value : a20
                            }
                        }}
                    />
                    <RadioGroup 
                        disabled={isDisabled}
                        defaultValue={isDefault?1:''}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '环境影响评价报告',
                                width: '33',
                                key: 'a21'
                            },
                        }}
                    >
                        <Radio value={1}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                        disabled={isDisabled}
                        defaultValue={isDefault?1:''}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '环境自行监测方案',
                                width: '33',
                                key: 'a22'
                            },
                        }}
                    >
                        <Radio value={1}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </RadioGroup>
                    <RadioGroup 
                            disabled={isDisabled}
                            defaultValue={isDefault?1:''}
                        data-modallist={{
                            layout: {
                                comType: '',
                                require: true,
                                name: '突发环境应急预案',
                                width: '33',
                                key: 'a23'
                            },
                        }}
                    >
                        <Radio value={1}>有备案</Radio>
                        <Radio value={0}>无备案</Radio>
                    </RadioGroup>
                    <TextArea
                        value={a24}
                        disabled={isDisabled}
                        defaultValue={isDefault?a24:''}
                        rows={3}
                        onChange={(e) => {
                            updateItem({
                                problemContent : e.target.value
                            })
                        }}
                        placeholder="请输入问题描述（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '备注',
                                width: '70',
                                maxNum: 500,
                                key: 'a24'
                            },
                            regexp : {
                                value : a24
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
                        value={a25}
                        disabled={isDisabled}
                        defaultValue={isDefault?a25:''}
                        onChange={(e) => {
                            updateItem({
                                a25 : e.target.value
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
                                key: 'a25'
                            },
                            regexp : {
                                value : a25,
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
                                key: 'a26'
                            },
                            regexp : {
                                value : a26,
                                exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                            }
                        }}>
                        <input
                            type={isOpen?'text':'password'}
                            value={a26}
                            disabled={isDisabled}
                            defaultValue={isDefault?a26:''}
                            onChange={(e) => {
                                updateItem({
                                    a26 : e.target.value
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