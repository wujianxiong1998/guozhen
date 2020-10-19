import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select, DatePicker, Radio, InputNumber, Button} from 'antd';
import {VtxCombogrid, VtxUpload} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_8, formStyle_4, PositiveInteger, emptyInput} from '../../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {VtxUpload2} = VtxUpload;

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
        const {handleCopy, handlePaste} = this.props
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
            // disabled: !!getFieldValue('picIds'),
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
        console.log(detail)
        return (
            <div>
                {(type !== 'view' && type !== 'examine') && <div style={{overflow: 'hidden', marginBottom: '10px'}}>
                    <Button type='primary'
                            style={{float: 'right', marginLeft: '10px'}}
                            onClick={handlePaste}
                    >粘贴</Button>
                    <Button type='primary'
                            style={{float: 'right'}}
                            onClick={handleCopy}
                    >复制</Button>
                </div>}

                <div className='ant-form' style={{width: '75%'}}>
                    <Row>
                        {/* 设备编码 */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="设备编码">
                                {getFieldDecorator('code', {
                                    initialValue: detail.code,
                                    rules: [
                                        {required: true, whitespace: true, message: '必填项'}
                                    ]
                                })(
                                    <Input disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* 设备名称rrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="设备名称">
                                {getFieldDecorator('name', {
                                    initialValue: detail.name,
                                    rules: [
                                        {required: true, whitespace: true, message: '必填项'},
                                        {validator: (rule, value, callback) => checkName(value, callback)}
                                    ]
                                })(
                                    <Input disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                        {/* 设备类型rrrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="设备类型">
                                {getFieldDecorator('typeId', {
                                    initialValue: detail.typeId,
                                    rules: [
                                        {required: true, message: '必填项'},
                                    ]
                                })(
                                    <Select style={{width: '100%'}} disabled={type === 'view'}>
                                        {equipmentTypes.map(item => (
                                            <Option value={item.id} key={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* 设备型号rrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="设备型号">
                                {getFieldDecorator('modelNum', {
                                    initialValue: detail.modelNum,
                                    rules: [
                                        {required: true, whitespace: true, message: '必填项'}
                                    ]
                                })(
                                    <Input disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* 设备状态rrrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="设备状态">
                                {getFieldDecorator('deviceStatus', {
                                    initialValue: detail.deviceStatus,
                                    rules: [
                                        {required: true, message: '必填项'},
                                    ]
                                })(
                                    <Select style={{width: '100%'}} disabled={type === 'view'}>
                                        {equipmentStatus.map(item => (
                                            <Option value={item.value} key={item.value}>{item.text}</Option>
                                        ))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* 投运时间rrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="投运时间">
                                {getFieldDecorator('operationDate', {
                                    initialValue: !!detail.operationDate ? moment(detail.operationDate) : null,
                                    rules: [
                                        {required: true, message: '必填项'},
                                    ]
                                })(
                                    <DatePicker {...dateProps} disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                        {/* 安装位置rrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="安装位置">
                                {getFieldDecorator('structuresId', {
                                    initialValue: type === 'view' ? detail.structuresName : detail.structuresId,
                                    rules: [
                                        {required: true, message: '必填项'},
                                    ]
                                })(
                                    type === 'view' ?
                                        <Input disabled/> :
                                        <Select style={{width: '100%'}}
                                                disabled={!getFieldValue('waterFactoryName') || type === 'view'}>
                                            {structureList.map(item => (
                                                <Option value={item.id} key={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        {/* 生产厂家rrrrrr */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="生产厂家">
                                {getFieldDecorator('manufacturer', {
                                    initialValue: detail.manufacturer,
                                    rules: [
                                        {required: true, message: '必填项'},
                                    ]
                                })(
                                    <Select {...manufacturerSelect} disabled={type === 'view'}>
                                        {manufacturerList.map(item => (
                                            <Option key={item} value={item}>{item}</Option>
                                        ))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {/* 含税总价 */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="含税总价">
                                {getFieldDecorator('totalPrice', {
                                    initialValue: detail.totalPrice,
                                    rules: [
                                        {required: false, whitespace: true, message: '必填项'},
                                    ]
                                })(
                                    <Input disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                        {/* 资产编码 */}
                        <Col span={7}>
                            <FormItem {...formStyle_8} label="资产编码">
                                {getFieldDecorator('assetCode', {
                                    initialValue: detail.assetCode,
                                    rules: [
                                        {required: true, whitespace: true, message: '必填项'},
                                    ]
                                })(
                                    <Input disabled={type === 'view'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                {/* <div className="baseInfoPic" style={{top: type === 'view' ? '130px' : '92px'}}>
                    {getFieldDecorator('picIds', {
                            initialValue: detail.picIds
                        }
                    )(
                        !detail.picIds && type === 'view' ?
                            <img style={{width: '100%', height: '100%', border: '1px solid #dedede'}}
                                 src="./resources/images/no_pic.png"
                                 alt="noPic"/>
                            :
                            type === 'view' ?
                                <div className='viewPic'>
                                    <VtxUpload2 {...imgProps}/>
                                </div>
                                :
                                <VtxUpload {...imgProps}/>
                    )}
                </div> */}
            </div>
        );
    };
}
