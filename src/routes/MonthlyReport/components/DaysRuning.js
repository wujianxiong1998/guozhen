import React from 'react';
import moment from 'moment';
import {Form, Collapse, message, Input, Col, Button, InputNumber} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_1} from "../../../utils/util";
import {VtxDatagrid} from "vtx-ui";

moment.locale('zh-cn');
const FormItem = Form.Item;
const Panel = Collapse.Panel;

export default class DaysRuning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, workDayAndStopAnalysis} = this.props;
        const {normalDays = 0, problemReason = 0, produceProblem = 0, stopHour = 0, stopReason = '', workDayTotal = 0} = workDayAndStopAnalysis;
        
        //列表配置
        const tableProps = {
            columns: [{
                title: '本月共运营（天）',
                dataIndex: 'code',
                key: 'code',
                render: (text, record) => (
                    <FormItem {...formStyle_4} label={(<span>&nbsp;</span>)} colon={false}>
                        {getFieldDecorator('workDayTotal', {
                            initialValue: workDayTotal,
                            rules: [
                                {required: true, message: '必填项'}
                            ]
                        })(
                            <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                        )}
                    </FormItem>)
            }, {
                title: '正常运营（天）',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <FormItem {...formStyle_4} label={(<span>&nbsp;</span>)} colon={false}>
                        {getFieldDecorator('normalDays', {
                            initialValue: normalDays,
                            rules: [
                                {required: true, message: '必填项'}
                            ]
                        })(
                            <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                        )}
                    </FormItem>)
            }, {
                title: '停限产（小时）',
                dataIndex: 'typeName',
                key: 'typeName',
                render: (text, record) => (
                    <FormItem {...formStyle_4} label={(<span>&nbsp;</span>)} colon={false}>
                        {getFieldDecorator('stopHour', {
                            initialValue: stopHour,
                            rules: [
                                {required: true, message: '必填项'}
                            ]
                        })(
                            <InputNumber min={0.1} precision={1} step={0.1} style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                        )}
                    </FormItem>)
            }, {
                title: '生产事故',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, record) => (
                    <FormItem {...formStyle_4} label={(<span>&nbsp;</span>)} colon={false}>
                        {getFieldDecorator('produceProblem', {
                            initialValue: produceProblem,
                            rules: [
                                {required: true, message: '必填项'}
                            ]
                        })(
                            <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                        )}
                    </FormItem>)
            }],
            dataSource: [{id: 1}],
            rowKey: record => record.id,
            autoFit: true,
            scroll: {
                x: 800,
            },
            pagination: false,
        };
        
        return (
            <div className="main_page">
                <Collapse defaultActiveKey={['1', '2', '3']}>
                    <Panel header="运营状态" key="1" disabled>
                        <div style={{height: '120px'}}>
                            <VtxDatagrid {...tableProps} />
                        </div>
                    </Panel>
                    <Panel header="停限产原因说明" key="2" disabled>
                        <Col span={24}>
                            <FormItem {...formStyle_1} label={(<span>&nbsp;</span>)} colon={false}>
                                {getFieldDecorator('stopReason', {
                                    initialValue: stopReason,
                                    rules: [
                                        {required: true, message: '必填项'}
                                    ]
                                })(
                                    <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Panel>
                    <Panel header="生产事故说明" key="3" disabled>
                        <Col span={24}>
                            <FormItem {...formStyle_1} label={(<span>&nbsp;</span>)} colon={false}>
                                {getFieldDecorator('problemReason', {
                                    initialValue: problemReason,
                                    rules: [
                                        {required: true, message: '必填项'}
                                    ]
                                })(
                                    <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Panel>
                </Collapse>
            </div>
        );
    };
}
