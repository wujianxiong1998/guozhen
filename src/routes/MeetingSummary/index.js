import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {Input, Button, Row, Col, Form, message, Spin} from "antd";
import styles from './style.less';
import {formStyle_6} from "../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;

class MeetingSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {getFieldDecorator} = this.props.form;
        const {dispatch, meetingSummaryM, loading, submitLoading} = this.props;
        const {detail} = meetingSummaryM;
        
        //提交
        const handle = () => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法提交");
                    return;
                }
                if (!!detail) {
                    dispatch({
                        type: 'meetingSummaryM/addUpdate',
                        payload: {
                            ...detail,
                            ...values
                        }
                    })
                } else {
                    dispatch({
                        type: 'meetingSummaryM/addSave',
                        payload: {
                            ...values
                        }
                    })
                }
            })
        };
        
        return (
            <Form className={styles.mainContainer}>
                <Row style={{textAlign: 'center', fontSize: '20px', lineHeight: '60px'}}>早会纪要</Row>
                <div className={styles.loading}>
                    {loading && <Spin/>}
                </div>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="生产技术部">
                            {getFieldDecorator('produceDept', {
                                initialValue: !!detail ? detail.produceDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="中控班">
                            {getFieldDecorator('ctrlDept', {
                                initialValue: !!detail ? detail.ctrlDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="化验班">
                            {getFieldDecorator('hyDept', {
                                initialValue: !!detail ? detail.hyDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="污泥班">
                            {getFieldDecorator('wnDept', {
                                initialValue: !!detail ? detail.wnDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="维修班">
                            {getFieldDecorator('repareDept', {
                                initialValue: !!detail ? detail.repareDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_6} label="综合办">
                            {getFieldDecorator('totalDept', {
                                initialValue: !!detail ? detail.totalDept : '',
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{textAlign: 'center'}}>
                    <Button type='primary'
                            className={styles.btn}
                            onClick={() => handle()}
                            loading={submitLoading}
                    >提交</Button>
                </Row>
            </Form>
        );
    };
}

const meetingSummaryProps = (state) => {
    return {
        meetingSummaryM: state.meetingSummaryM,
        loading: state.loading.effects['meetingSummaryM/pageList'],
        submitLoading: state.loading.effects['meetingSummaryM/addSave'] || state.loading.effects['meetingSummaryM/addUpdate']
    };
};

export default connect(meetingSummaryProps)(Form.create()(MeetingSummary));
