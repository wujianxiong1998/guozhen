import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Button, Tag} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

export default class SingleSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {openModal, name, target, value, changeParams} = this.props;
        
        return (
            <div className="main_page">
                <Row>
                    <Col span={24}>
                        <FormItem {...formStyle_4} label={name}>
                            <div style={{display: 'inline-block', maxWidth: '400px'}}>
                                {
                                    value.map(item => (
                                        <Tag key={item.id} closable onClose={() => {
                                            const resultList = [...value].map(each => {
                                                if (item.id !== each.id) {
                                                    return each;
                                                }
                                            }).filter(each => !!each);
                                            changeParams([target], resultList);
                                        }}>{item.name}</Tag>
                                    ))
                                }
                            </div>
                            <Button type='primary'
                                    style={{marginLeft: '20px'}}
                                    onClick={() => openModal(target)}
                            >选择</Button>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
