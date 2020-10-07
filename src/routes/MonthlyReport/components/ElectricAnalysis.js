import React from 'react';
import moment from 'moment';
import {Form, message, Input, Row, Col, Button, InputNumber} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_8} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

export default class ElectricAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, powerConsumeAnalysis} = this.props;
        const {powerBias = 0, powerConsume = '', powerPlanConsume = 0, powerRealConsume = 0, powerBiasReason = ''} = powerConsumeAnalysis;
        
        return (
            <div className="main_page">
                <div style={{height: '20px'}}/>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月共耗电">
                            {getFieldDecorator('powerConsume', {
                                initialValue: powerConsume,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月实际电单耗">
                            {getFieldDecorator('powerRealConsume', {
                                initialValue: powerRealConsume,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月计划电单耗">
                            {getFieldDecorator('powerPlanConsume', {
                                initialValue: powerPlanConsume,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划实际偏差">
                            {getFieldDecorator('powerBias', {
                                initialValue: powerBias,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="计划实际偏差分析">
                            {getFieldDecorator('powerBiasReason', {
                                initialValue: powerBiasReason,
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
