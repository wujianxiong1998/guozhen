import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_6} from '../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    getForm = () => {
        return this.props.form;
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {getFieldDecorator} = this.props.form;
        const {detail, type} = this.props;
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="行业动态标题">
                            {getFieldDecorator('title', {
                                initialValue: detail.title,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.title}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="行业动态链接">
                            {getFieldDecorator('src', {
                                initialValue: detail.src,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.src}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="内容摘要">
                            {getFieldDecorator('textContent', {
                                initialValue: detail.textContent,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.textContent}</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
