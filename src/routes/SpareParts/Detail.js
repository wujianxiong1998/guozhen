import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, TreeSelect} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_8, formStyle_4, PositiveInteger, emptyInput} from '../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;

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
            getFieldDecorator('fillManId');
            if (type === 'add') {
                setFieldsValue({'fillManId': userInfo.id});
            }
            if (type === 'edit') {
                setFieldsValue({'fillManId': detail.fillManId});
            }
        }
    }
    
    render() {
        const {userInfo, userList, detail, type, checkName} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        
        //选择人员
        const peopleSelect = {
            style: {width: '100%'},
            treeData: userList,
            treeDefaultExpandAll: true,
            showSearch: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            onChange: (value, label, extra) => {
                if (!!value) {
                    setFieldsValue({'fillManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'fillManId': ''})
                }
            }
        };
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="配件名称">
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
                        <FormItem {...formStyle_8} label="配件型号">
                            {getFieldDecorator('modelNum', {
                                initialValue: detail.modelNum,
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
                        <FormItem {...formStyle_8} label="生产厂家">
                            {getFieldDecorator('manufacturer', {
                                initialValue: detail.manufacturer,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="联系方式">
                            {getFieldDecorator('contact', {
                                initialValue: detail.contact,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                    {pattern: new RegExp(PositiveInteger || emptyInput, "g"), message: '联系方式必须为纯数字'}
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="用途">
                            {getFieldDecorator('usedBy', {
                                initialValue: detail.usedBy,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="填报人">
                            {getFieldDecorator('fillManName', {
                                initialValue: detail.fillManName || userInfo.name,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                <TreeSelect {...peopleSelect} disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="备注">
                            {getFieldDecorator('memo', {
                                initialValue: detail.memo
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
