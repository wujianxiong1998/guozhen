import React from 'react';
import moment from 'moment';
import {Form, Collapse, Input, Row, Col} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_1, formStyle_9, formStyle_2} from "../../../utils/util";

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
        const {type, getFieldDecorator, processChange} = this.props;
        const {data = []} = processChange;
        
        return (
            <div className="main_page">
                <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
                    <Panel header="工艺运行总体情况简述" key="1" disabled>
                        <Col span={24}>
                            <FormItem {...formStyle_1} label={(<span>&nbsp;</span>)} colon={false}>
                                {getFieldDecorator('totalContent', {
                                    initialValue: !!data[0] ? data[0].totalContent : '',
                                    rules: [
                                        {required: true, message: '必填项'}
                                    ]
                                })(
                                    <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Panel>
                    <Panel header="生化污泥三要素分析" key="2" disabled>
                        {!!data[1] && JSON.parse(data[1].mudTarget).map(item => (
                            <div key={item.id}>
                                <Row>
                                    <Col span={22}>
                                        <div style={{
                                            textAlign: 'center',
                                            lineHeight: '32px',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}>{item.name}</div>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='平均'>
                                            {getFieldDecorator(`${item.id}avg`, {
                                                initialValue: item.avg,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='最高'>
                                            {getFieldDecorator(`${item.id}max`, {
                                                initialValue: item.max,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='最低'>
                                            {getFieldDecorator(`${item.id}min`, {
                                                initialValue: item.min,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_2} label='说明'>
                                    {getFieldDecorator('mudTargetReason', {
                                        initialValue: data[1].mudReason,
                                        rules: [
                                            {required: true, message: '必填项'}
                                        ]
                                    })(
                                        <Input style={{width: '100%'}}
                                               disabled={type === 'view' || type === 'examine'}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Panel>
                    <Panel header="生化池DO变化范围" key="3" disabled>
                        {!!data[2] && JSON.parse(data[2].doTarget).map(item => (
                            <div key={item.id}>
                                <Row>
                                    <Col span={22}>
                                        <div style={{
                                            textAlign: 'center',
                                            lineHeight: '32px',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}>{item.name}</div>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='平均'>
                                            {getFieldDecorator(`${item.id}avg`, {
                                                initialValue: item.avg,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='最高'>
                                            {getFieldDecorator(`${item.id}max`, {
                                                initialValue: item.max,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem {...formStyle_9} label='最低'>
                                            {getFieldDecorator(`${item.id}min`, {
                                                initialValue: item.min,
                                                rules: [
                                                    {required: true, message: '必填项'}
                                                ]
                                            })(
                                                <Input style={{width: '100%'}}
                                                       disabled={type === 'view' || type === 'examine'}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_2} label='说明'>
                                    {getFieldDecorator('doTargetReason', {
                                        initialValue: data[2].doReason,
                                        rules: [
                                            {required: true, message: '必填项'}
                                        ]
                                    })(
                                        <Input style={{width: '100%'}}
                                               disabled={type === 'view' || type === 'examine'}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Panel>
                    <Panel header="构筑物表现情况" key="4" disabled>
                        <Col span={24}>
                            <FormItem {...formStyle_1} label={(<span>&nbsp;</span>)} colon={false}>
                                {getFieldDecorator('gzwContent', {
                                    initialValue: !!data[3] ? data[3].gzwContent : '',
                                    rules: [
                                        {required: true, message: '必填项'}
                                    ]
                                })(
                                    <Input style={{width: '100%'}} disabled={type === 'view' || type === 'examine'}/>
                                )}
                            </FormItem>
                        </Col>
                    </Panel>
                    <Panel header="污泥镜检（各种指示性微生物的活性和数量情况）" key="5" disabled>
                        <Col span={24}>
                            <FormItem {...formStyle_1} label={(<span>&nbsp;</span>)} colon={false}>
                                {getFieldDecorator('wnjjContent', {
                                    initialValue: !!data[4] ? data[4].wnjjContent : '',
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
