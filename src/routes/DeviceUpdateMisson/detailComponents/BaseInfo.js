import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select, DatePicker, Radio, InputNumber} from 'antd';
import {VtxCombogrid, VtxUpload} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_8, formStyle_4, PositiveInteger, emptyInput} from '../../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class BaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        const {getFieldDecorator, setFieldsValue, detail, type, getStructuresList} = this.props;
        if (type !== 'view') {
            getFieldDecorator('waterFactoryId');
            getFieldDecorator('parentId');
            if (type === 'edit') {
                setFieldsValue({'waterFactoryId': detail.waterFactoryId});
                setFieldsValue({'parentId': detail.parentId});
                if (!!detail.waterFactoryId) {
                    getStructuresList(detail.waterFactoryId, null)
                }
            }
        }
    }
    
    render() {
        const {getFieldDecorator, setFieldsValue, setFields, getFieldValue, type, detail, checkName, equipmentStatus, equipmentTypes, waterFactoryList, structureList, getStructuresList, equipmentGrades, manufacturerList, equipmentSelect, getManufacturerList, changeDetail} = this.props;
        
        //选择水厂
        const waterFactorySelect = {
            style: {width: '100%'},
            showSearch: true,
            onChange: (value) => {
                const currentId = waterFactoryList.map(item => {
                    if (item.name === value) {
                        return item.id
                    }
                }).filter(item => !!item)[0];
                setFieldsValue({'waterFactoryId': currentId});
                getStructuresList(currentId, (data) => {
                    if (!!data && data.length !== 0) {
                        setFieldsValue({'structuresId': data[0].id})
                    } else {
                        setFields({'structuresId': {value: '', errors: [new Error('必填项')]}});
                    }
                })
            }
        };
        //时间配置
        const dateProps = {
            style: {width: '100%'},
            format: 'YYYY-MM-DD',
            allowClear: false
        };
        //选择生产厂家
        const manufacturerSelect = {
            style: {width: '100%'},
            mode: 'combobox',
            onChange: (value) => getManufacturerList(value)
        };
        //图片上传
        const imgProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: type === 'view',
            fileList: !!detail.picIds ? detail.picIds.split(',').map((item, index) => {
                return {
                    id: item,
                    name: index
                }
            }) : [],
            onSuccess: (file) => {
                let result = !!detail.picIds ? detail.picIds.split(',') : [];
                result.push(file.id);
                setFieldsValue({'picIds': result.join(',')});
                changeDetail('picIds', result.join(','))
            },
            onRemove: (file) => {
                let result = !!detail.picIds ? detail.picIds.split(',') : [];
                setFieldsValue({
                    'picIds': result.map(item => {
                        if (item !== file.id) {
                            return item
                        }
                    }).filter(item => !!item).join(',')
                });
                changeDetail('picIds', result.map(item => {
                    if (item !== file.id) {
                        return item
                    }
                }).filter(item => !!item).join(','))
            },
        };
        
        return (
            <div>
                {type !== 'add' && <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备名称">
                            {getFieldDecorator('name', {
                                initialValue: detail.name
                            })(
                                type === 'view' ?
                                    <span>{detail.name}</span>
                                    :
                                    <Input disabled/>
                            )}
                        </FormItem>
                    </Col>
                </Row>}
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备编码">
                            {getFieldDecorator('code', {
                                initialValue: detail.code,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                    {validator: (rule, value, callback) => checkName(value, callback)}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.code}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备类型">
                            {getFieldDecorator('typeId', {
                                initialValue: detail.typeId,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.typeName}</span>
                                    :
                                    <Select style={{width: '100%'}}>
                                        {equipmentTypes.map(item => (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备型号">
                            {getFieldDecorator('modelNum', {
                                initialValue: detail.modelNum,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.modelNum}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备状态">
                            {getFieldDecorator('deviceStatus', {
                                initialValue: detail.deviceStatus,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.deviceStatusStr}</span>
                                    :
                                    <Select style={{width: '100%'}}>
                                        {equipmentStatus.map(item => (
                                            <Option value={item.value} key={item.value}>{item.text}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="所属水厂">
                            {getFieldDecorator('waterFactoryName', {
                                initialValue: detail.waterFactoryName,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.waterFactoryName}</span>
                                    :
                                    <Select {...waterFactorySelect}>
                                        {waterFactoryList.map(item => (
                                            <Option value={item.name} key={item.name}>{item.name}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="安装位置">
                            {getFieldDecorator('structuresId', {
                                initialValue: detail.structuresId,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.structuresName}</span>
                                    :
                                    <Select style={{width: '100%'}} disabled={!getFieldValue('waterFactoryName')}>
                                        {structureList.map(item => (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="所属设备">
                            {getFieldDecorator('parentName')(
                                type === 'view' ?
                                    <span>{detail.parentName}</span>
                                    :
                                    <VtxCombogrid {...equipmentSelect}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备级别">
                            {getFieldDecorator('grade', {
                                initialValue: detail.grade,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.gradeStr}</span>
                                    :
                                    <Select style={{width: '100%'}}>
                                        {equipmentGrades.map(item => (
                                            <Option value={item.value} key={item.value}>{item.text}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="购买时间">
                            {getFieldDecorator('buyDate', {
                                initialValue: !!detail.buyDate ? moment(detail.buyDate) : null,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.buyDate}</span>
                                    :
                                    <DatePicker {...dateProps}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="安装时间">
                            {getFieldDecorator('installDate', {
                                initialValue: !!detail.installDate ? moment(detail.installDate) : null,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.installDate}</span>
                                    :
                                    <DatePicker {...dateProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="投运时间">
                            {getFieldDecorator('operationDate', {
                                initialValue: !!detail.operationDate ? moment(detail.operationDate) : null,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.operationDate}</span>
                                    :
                                    <DatePicker {...dateProps}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="生产厂家">
                            {getFieldDecorator('manufacturer', {
                                initialValue: detail.manufacturer,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.manufacturer}</span>
                                    :
                                    <Select {...manufacturerSelect}>
                                        {manufacturerList.map(item => (
                                            <Option key={item} value={item}>{item}</Option>
                                        ))}
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="遥控设备">
                            {getFieldDecorator('isRemote', {
                                initialValue: detail.isRemote,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.isRemoteStr}</span>
                                    :
                                    <RadioGroup>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="物料编码">
                            {getFieldDecorator('materialName', {
                                initialValue: detail.materialName,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.materialName}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="重量(千克)">
                            {getFieldDecorator('weight', {
                                initialValue: detail.weight
                            })(
                                type === 'view' ?
                                    <span>{detail.weight}</span>
                                    :
                                    <InputNumber style={{width: '100%'}} min={0.01} precision={2} step={0.01}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="尺寸">
                            {getFieldDecorator('dimension', {
                                initialValue: detail.dimension
                            })(
                                type === 'view' ?
                                    <span>{detail.dimension}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="购买价格">
                            {getFieldDecorator('price', {
                                initialValue: detail.price
                            })(
                                type === 'view' ?
                                    <span>{detail.price}</span>
                                    :
                                    <InputNumber style={{width: '100%'}} min={0.01} precision={2} step={0.01}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设计寿命(年)">
                            {getFieldDecorator('lifeTime', {
                                initialValue: detail.lifeTime
                            })(
                                type === 'view' ?
                                    <span>{detail.lifeTime}</span>
                                    :
                                    <InputNumber style={{width: '100%'}} min={1} step={0.1}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="厂家联系方式">
                            {getFieldDecorator('manufacturerContact', {
                                initialValue: detail.manufacturerContact,
                                rules: [
                                    {pattern: new RegExp(PositiveInteger || emptyInput, "g"), message: '联系方式必须为纯数字'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.manufacturerContact}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="图片">
                            {getFieldDecorator('picIds', {
                                    initialValue: detail.picIds
                                }
                            )(
                                !detail.picIds && type === 'view' ?
                                    <span>暂无</span>
                                    :
                                    <VtxUpload {...imgProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
