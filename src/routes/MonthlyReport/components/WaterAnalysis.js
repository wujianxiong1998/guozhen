import React from 'react';
import moment from 'moment';
import {Form, message, Input, Row, Col, Button, Select, InputNumber} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_8} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

export default class WaterAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, waterInOutAnalysis, reasonList} = this.props;
        const {inWaterOverDays = 0, inWaterOverReason = '', inWaterPer = 0, outWaterOverDays = 0, outWaterOverReason = '', outWaterPer = 0} = waterInOutAnalysis;
        
        return (
            <div className="main_page">
                <div style={{height: '20px'}}/>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月进水达标率">
                            {getFieldDecorator('inWaterPer', {
                                initialValue: inWaterPer,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="本月出水达标率">
                            {getFieldDecorator('outWaterPer', {
                                initialValue: outWaterPer,
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
                        <FormItem {...formStyle_8} label="进水超标天数">
                            {getFieldDecorator('inWaterOverDays', {
                                initialValue: inWaterOverDays,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="进水超标原因">
                            {getFieldDecorator('inWaterOverReason', {
                                initialValue: inWaterOverReason,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}>
                                    {reasonList.map(item => (
                                        <Option key={item.id} value={item.id}>{item.reason}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="出水超标天数">
                            {getFieldDecorator('outWaterOverDays', {
                                initialValue: outWaterOverDays,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="出水超标原因">
                            {getFieldDecorator('outWaterOverReason', {
                                initialValue: outWaterOverReason,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}>
                                    {reasonList.map(item => (
                                        <Option key={item.id} value={item.id}>{item.reason}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
