import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select, InputNumber, Radio} from 'antd';
import {VtxUpload} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_4,formStyle_8} from '../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {VtxUpload2} = VtxUpload;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    getForm = () => {
        return this.props.form;
    };
    
    componentDidMount() {
        const {userInfo, detail, type} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        if (type !== 'view') {
            getFieldDecorator('waterFactoryId');
            if (type === 'add') {
                setFieldsValue({'waterFactoryId': userInfo.waterFactoryId});
            }
            if (type === 'edit') {
                setFieldsValue({'waterFactoryId': detail.waterFactoryId});
            }
        }
    }
    
    render() {
        const {userInfo, waterFactoryList, detail, type, checkName, changeDetail} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        
        //选择水厂
        const waterFactorySelect = {
            style: {width: '100%'},
            showSearch: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            onChange: (value) => {
                if (!!value) {
                    setFieldsValue({
                        waterFactoryId: waterFactoryList.map(item => {
                            if (item.name === value) {
                                return item.id;
                            }
                        }).filter(item => !!item)[0]
                    })
                }
            }
        };
        //图片上传
        const imgProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: type === 'view',
            fileList: !!detail.fileIds ? detail.fileIds.split(',').map((item, index) => {
                return {
                    id: item,
                    name: index
                }
            }) : [],
            onSuccess: (file) => {
                let result = !!detail.fileIds ? detail.fileIds.split(',') : [];
                result.push(file.id);
                setFieldsValue({'fileIds': result.join(',')});
                changeDetail('fileIds', result.join(','))
            },
            onRemove: (file) => {
                let result = !!detail.fileIds ? detail.fileIds.split(',') : [];
                setFieldsValue({
                    'fileIds': result.map(item => {
                        if (item !== file.id) {
                            return item
                        }
                    }).filter(item => !!item).join(',')
                });
                changeDetail('fileIds', result.map(item => {
                    if (item !== file.id) {
                        return item
                    }
                }).filter(item => !!item).join(','))
            },
        };
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="构筑物名称">
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
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="所属水厂">
                            {getFieldDecorator('waterFactoryName', {
                                initialValue: detail.waterFactoryName || userInfo.waterFactoryName,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                ]
                            })(
                                <Select {...waterFactorySelect} disabled={type === 'view'}>
                                    {waterFactoryList.map(item => (
                                        <Option key={item.name} value={item.name}>{item.name}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="有效容积(m³)">
                            {getFieldDecorator('effectiveVolume', {
                                initialValue: detail.effectiveVolume,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                <InputNumber disabled={type === 'view'} style={{width: '100%'}} min={0.01} precision={2}
                                             step={0.01}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="规格尺寸">
                            {getFieldDecorator('dimension', {
                                initialValue: detail.dimension,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="是否库房">
                            {getFieldDecorator('isWarehouse', {
                                initialValue: detail.isWarehouse,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                <RadioGroup disabled={type === 'view'}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="备注">
                            {getFieldDecorator('memo', {
                                initialValue: detail.memo
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="图片">
                            {getFieldDecorator('fileIds')(
                                !detail.fileIds && type === 'view' ?
                                    <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                         src="./resources/images/no_pic.png"
                                         alt="noPic"/>
                                    :
                                    <VtxUpload2 {...imgProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
