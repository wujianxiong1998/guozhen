import React from 'react';

import { VtxModal, VtxModalList, VtxDate, VtxSearchMap } from 'vtx-ui';
const { VtxDatePicker,VtxRangePicker } = VtxDate;
import { Button, Input, Select,InputNumber } from 'antd';
import {VtxUtil} from '../../utils/util';
import styles from './index.less';

const Option = Select.Option;

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            mapModalVisible: false,
        };
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            id, mapCfg, name, longitude, latitude, floorArea, businessId, businessSelect, processTypeId, processTypeSelect, businessUnitId,regionalCompanyId,
            productTypeId, productTypeSelect, startDate, endDate, processSize, waterStandard, minWaterFlow, businessUnitSelect, regionalCompanySelect,
            waterPrice
        } = contentProps;
        const { mapModalVisible } = this.state;

        const { updateItem } = contentProps;
        const searchMap = () => {
            this.setState({ mapModalVisible: true })
        }
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <div className={styles.modalContainer}>
                    <VtxModalList
                        isRequired
                        visible={modalProps.visible}
                        ref={this.modalListRef}
                    >
                        <Input
                            value={name}
                            onChange={(e) => {
                                updateItem({
                                    name : e.target.value
                                })
                            }}
                            placeholder="请输入名称（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '名称',
                                    width: '80',
                                    key: 'name'
                                },
                                regexp : {
                                    value : name,
                                    repete: {
                                        url: '/cloud/gzzhsw/api/cp/water/factory/check.smvc',
                                        key: {
                                            tenantId: VtxUtil.getUrlParam('tenantId'),
                                            id,
                                            paramCode: 'name',
                                            paramValue: name
                                        }
                                    }
                                }
                            }}
                        />
                        
                        <Input
                            disabled
                            value={longitude ? longitude+','+latitude:''}
                            data-modallist={{
                                layout: { width: 80, name: '经纬度', require: true, },
                                regexp: {
                                    value: longitude,
                                }
                            }}
                        />
                        <div data-modallist={{ layout: { width: 20 } }}>
                            <Button style={{marginTop:'10px'}} type='primary' onClick={searchMap}>去地图</Button>
                        </div>
                        <Input
                            addonAfter={'亩'}
                            value={floorArea}
                            onChange={(e) => {
                                updateItem({
                                    floorArea : e.target.value
                                })
                            }}
                            placeholder="请输入占地面积（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '占地面积',
                                    width: '80',
                                    key: 'floorArea'
                                },
                                regexp : {
                                    value : floorArea,
                                    exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                                }
                            }}
                        />
                        <Select
                            value={regionalCompanyId}
                            onSelect={(value,option) => {                                
                                updateItem({
                                    regionalCompanyId: value,
                                    businessUnitId:option.props.unitId
                                })
                            }}
                            placeholder="请选择区域公司（必选项）"
                            // allowClear
                            data-modallist={{
                                layout: {
                                    comType: 'input',
                                    require: true,
                                    name: '区域公司',
                                    width: '80',
                                    key: 'regionalCompanyId'
                                },
                                regexp: {
                                    value: regionalCompanyId
                                }
                            }}
                        >
                            {regionalCompanySelect.map(item => {
                                return <Option unitId={item.parentId} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                        <Select
                            disabled
                            value={businessUnitId ? businessUnitId:undefined}
                            // onChange={(value) => {
                            //     updateItem({
                            //         businessUnitId: value
                            //     })
                            // }}
                            placeholder="根据区域公司自动带出"
                            data-modallist={{
                                layout: {
                                    comType: 'input',
                                    // require: true,
                                    name: '事业部',
                                    width: '80',
                                    key: 'businessUnitId'
                                },
                                regexp: {
                                    value: businessUnitId
                                }
                            }}
                        >
                            {businessUnitSelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                        
                        <Select
                            value={businessId}
                            onChange={(value) => {
                                updateItem({
                                    businessId : value
                                })
                            }}
                            placeholder="请选择业务范围（必选项）"
                            allowClear
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '业务范围',
                                    width: '80',
                                    key: 'businessId'
                                },
                                regexp : {
                                    value : businessId
                                }
                            }}
                        >
                            {businessSelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            }) }
                        </Select>
                        <Select
                            value={processTypeId}
                            onChange={(value) => {
                                updateItem({
                                    processTypeId : value
                                })
                            }}
                            placeholder="请选择工艺类型（必选项）"
                            allowClear
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '工艺类型',
                                    width: '80',
                                    key: 'processTypeId'
                                },
                                regexp : {
                                    value : processTypeId
                                }
                            }}
                        >
                            {processTypeSelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            }) }
                        </Select>
                        <Select
                            value={productTypeId}
                            onChange={(value) => {
                                updateItem({
                                    productTypeId : value
                                })
                            }}
                            placeholder="请选择项目类别（必选项）"
                            allowClear
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '项目类别',
                                    width: '80',
                                    key: 'productTypeId'
                                },
                                regexp : {
                                    value : productTypeId
                                }
                            }}
                        >
                            {productTypeSelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            }) }
                        </Select>
                        <VtxRangePicker
                            value={[startDate,endDate]}
                            onChange={(date,dateString)=>{
                                updateItem({
                                    startDate: dateString[0],
                                    endDate:dateString[1]
                                });
                            }}
                            data-modallist={{
                                layout: {
                                    comType: '',
                                    require: true,
                                    name: '项目起止时间',
                                    width: '80',
                                    key: 'startDate'
                                },
                                regexp: {
                                    value: startDate
                                }
                            }}
                        />
                        <Input
                            addonAfter={'万吨/日'}
                            value={processSize}
                            onChange={(e) => {
                                updateItem({
                                    processSize : e.target.value
                                })
                            }}
                            placeholder="请输入处理规模（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '处理规模',
                                    width: '80',
                                    key: 'processSize'
                                },
                                regexp : {
                                    value : processSize,
                                    exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                                }
                            }}
                        />
                        <Input
                            value={waterStandard}
                            onChange={(e) => {
                                updateItem({
                                    waterStandard : e.target.value
                                })
                            }}
                            placeholder="请输入出水标准（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '出水标准',
                                    width: '80',
                                    key: 'waterStandard'
                                },
                                regexp : {
                                    value : waterStandard
                                }
                            }}
                        />
                        <Input
                            addonAfter={'万吨/日'}
                            value={minWaterFlow}
                            onChange={(e) => {
                                updateItem({
                                    minWaterFlow : e.target.value
                                })
                            }}
                            placeholder="请输入保底水量（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '保底水量',
                                    width: '80',
                                    key: 'minWaterFlow',
                                },
                                regexp : {
                                    value : minWaterFlow,
                                    exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                                }
                            }}
                        />
                        <Input
                            addonAfter={'元/吨水'}
                            value={waterPrice}
                            onChange={(e) => {
                                updateItem({
                                    waterPrice : e.target.value
                                })
                            }}
                            placeholder="请输入水价（必填项）"
                            maxLength="32"
                            data-modallist={{
                                layout:{
                                    comType: 'input',
                                    require: true,
                                    name: '水价',
                                    width: '80',
                                    key: 'waterPrice'
                                },
                                regexp : {
                                    value : waterPrice,
                                    exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                                }
                            }}
                        />
                    </VtxModalList>
                </div>
                <VtxSearchMap
                    {...mapCfg}
                    mapCenter={id ? [longitude,latitude]: mapCfg.tenantPosition}
                    modal1Visible={mapModalVisible}
                    graphicType='point'
                    callback={(lglt) => {
                            updateItem({
                                    longitude:lglt[0],
                                    latitude:lglt[1]
                            })
                            this.setState({
                                mapModalVisible: false,
                            })
                    }}
                    closeModal={() => {
                        this.setState({ mapModalVisible: false })
                    }}
                />
            </VtxModal>
        )
    }
}

export default ADD;