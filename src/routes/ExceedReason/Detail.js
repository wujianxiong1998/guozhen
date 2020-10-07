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
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const {type, detail} = this.props;
        if (type !== 'view') {
            getFieldDecorator('targetSmallTypeName');
            if (type === 'edit') {
                setFieldsValue({'targetSmallTypeName': detail.targetSmallTypeName})
            }
        }
    }
    
    render() {
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const {type, detail, targetSmallTypes} = this.props;
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="原因">
                            {getFieldDecorator('reason', {
                                initialValue: detail.reason,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="指标小类">
                            {getFieldDecorator('targetSmallType', {
                                initialValue: detail.targetSmallType,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '100%'}}
                                        disabled={type === 'view'}
                                        onChange={(value) => setFieldsValue({
                                            'targetSmallTypeName': targetSmallTypes.map(item => {
                                                if (item.id === value) {
                                                    return item.name
                                                }
                                            }).filter(item => !!item)[0]
                                        })}
                                >
                                    {targetSmallTypes.map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
