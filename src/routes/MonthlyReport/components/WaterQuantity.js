import React from 'react';
import moment from 'moment';
import {Form, message, Input, Row, Col, Button, InputNumber} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_8} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

export default class WaterQuantity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, dealWaterAnalysis} = this.props;
        const {dealWater = 0, planDealWater = 0, avgDealWater = 0, avgPlanDealWater = 0, reason = ''} = dealWaterAnalysis;
        
        return (
            <div className="main_page">
                <div style={{height: '20px'}}/>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月处理水量">
                            {getFieldDecorator('dealWater', {
                                initialValue: dealWater,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划处理水量">
                            {getFieldDecorator('planDealWater', {
                                initialValue: planDealWater,
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
                        <FormItem {...formStyle_8} label="日均处理水量">
                            {getFieldDecorator('avgDealWater', {
                                initialValue: avgDealWater,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划日均处理水量">
                            {getFieldDecorator('avgPlanDealWater', {
                                initialValue: avgPlanDealWater,
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
                        <FormItem {...formStyle_4} label="超产(减产)原因">
                            {getFieldDecorator('reason', {
                                initialValue: reason,
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
