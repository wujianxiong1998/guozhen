import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, DatePicker} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_6} from '../../utils/util';

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
    
    }
    
    render() {
        const {getFieldDecorator} = this.props.form;
        const {detail, type} = this.props;
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_6} label="时间">
                            {getFieldDecorator('day', {
                                initialValue: !!detail.day ? moment(detail.day) : null,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.day}</span>
                                    :
                                    <DatePicker style={{width: '100%'}} format='YYYY-MM-DD'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_6} label="标题">
                            {getFieldDecorator('title', {
                                initialValue: detail.title,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                    {max: 6, message: '最长6个字符'}
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
                    <Col span={11}>
                        <FormItem {...formStyle_6} label="内容">
                            {getFieldDecorator('content', {
                                initialValue: detail.content,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.content}</span>
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
