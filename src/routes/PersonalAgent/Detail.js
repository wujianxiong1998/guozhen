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
        const type = 'edit';
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="原因">
                            {getFieldDecorator('code', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>123</span>
                                    :
                                    <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="指标小类">
                            {getFieldDecorator('name', {
                                initialValue: '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                    {validator: (rule, value, callback) => checkName(getFieldValue('code'), value, callback)}
                                ]
                            })(
                                type === 'view' ?
                                    <span>123</span>
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
