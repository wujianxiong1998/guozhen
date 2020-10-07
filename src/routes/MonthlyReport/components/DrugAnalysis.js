import React from 'react';
import moment from 'moment';
import {Form, message, Input, Row, Col, Button} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_8} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

export default class DrugAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type, getFieldDecorator, drugConsumeAndAnalysis} = this.props;
        const targetParams = JSON.parse(drugConsumeAndAnalysis);
    
        return (
            <div className="main_page">
                <div style={{height: '20px'}}/>
                {targetParams.map(item => (
                    <div key={item.id.toString()}>
                        <Row>
                            {JSON.parse(item.name).map(item => (
                                <Col key={item.id} span={11}>
                                    <FormItem {...formStyle_8} label={item.name}>
                                        {getFieldDecorator(item.id, {
                                            initialValue: item.value,
                                            rules: [
                                                {required: true, message: '必填项'}
                                            ]
                                        })(
                                            <Input style={{width: '100%'}}
                                                   disabled={type === 'view' || type === 'examine'}/>
                                        )}
                                    </FormItem>
                                </Col>
                            ))}
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_4} label="计划实际偏差分析">
                                    {getFieldDecorator(item.id.toString(), {
                                        initialValue: item.reason,
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
            </div>
        );
    };
}
