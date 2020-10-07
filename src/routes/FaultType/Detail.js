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
        const {equipmentTypes, detail, type, checkName} = this.props;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="设备类型">
                            {getFieldDecorator('code', {
                                initialValue: detail.code,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.codeStr}</span>
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
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="故障类型">
                            {getFieldDecorator('name', {
                                initialValue: detail.name,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                    {validator: (rule, value, callback) => checkName(getFieldValue('code'), value, callback)}
                                ]
                            })(
                                type === 'view' ?
                                    <span>{detail.name}</span>
                                    :
                                    <Input disabled={!getFieldValue('code')}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
