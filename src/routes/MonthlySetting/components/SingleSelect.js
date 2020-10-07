import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Button, Select} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

export default class SingleSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {getFieldDecorator, value, target, name, listA, openModal} = this.props;
        
        return (
            <div className="main_page">
                <Row>
                    <Col span={24}>
                        <FormItem {...formStyle_4} label={name}>
                            {getFieldDecorator(target, {
                                initialValue: value,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '400px'}} disabled>
                                    {listA.map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            )}
                            <Button type='primary'
                                    style={{marginLeft: '20px'}}
                                    onClick={() => openModal(target)}
                            >{!!value ? '修改' : '选择'}</Button>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
