import React from 'react';
import moment from 'moment';
import {Form, message, Input, Row, Col, Button} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_8} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

export default class SludgeAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, mudCakeAnalysis} = this.props;
        const {mudCakeBias = 0, planProducePer = 0, produceAvg = 0, produceMudCake = 0, producePer = '', workTime = '', mudCakeBiasAnalysis = ''} = mudCakeAnalysis;
        
        return (
            <div className="main_page">
                <div style={{height: '20px'}}/>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月待机共运行">
                            {getFieldDecorator('workTime', {
                                initialValue: workTime,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="共产生泥饼">
                            {getFieldDecorator('produceMudCake', {
                                initialValue: produceMudCake,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="日均产泥">
                            {getFieldDecorator('produceAvg', {
                                initialValue: produceAvg,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月产泥率">
                            {getFieldDecorator('producePer', {
                                initialValue: producePer,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划产泥率">
                            {getFieldDecorator('planProducePer', {
                                initialValue: planProducePer,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划实际偏差">
                            {getFieldDecorator('mudCakeBias', {
                                initialValue: mudCakeBias,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="计划实际偏差分析">
                            {getFieldDecorator('mudCakeBiasAnalysis', {
                                initialValue: mudCakeBiasAnalysis,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
