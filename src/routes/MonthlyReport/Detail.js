import React from 'react';
import moment from 'moment';
import {Select, Form, Icon, Tabs, Input, Row, Col, Button, DatePicker} from 'antd';
import 'moment/locale/zh-cn';
import DaysRuning from './components/DaysRuning'; //运行天数说明及停产分析
import WaterQuantity from './components/WaterQuantity'; //处理水量分析
import WaterAnalysis from './components/WaterAnalysis'; //进出水水质及达标率分析
import ElectricAnalysis from './components/ElectricAnalysis'; //电耗及电单耗分析
import DrugAnalysis from './components/DrugAnalysis'; //药耗及药单耗分析
import SludgeAnalysis from './components/SludgeAnalysis'; //污泥脱水系统运行及污泥量分析
import TechnologConditions from './components/TechnologConditions'; //工艺调整情况
import {formStyle_4, formStyle_2} from "../../utils/util"; //工艺调整情况

moment.locale('zh-cn');
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {MonthPicker} = DatePicker;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    getForm = () => {
        return this.props.form;
    };
    
    componentDidMount() {
        const {type, wheatherExit} = this.props;
        if (type === 'add') {
            wheatherExit()
        }
    }
    
    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            type, waterFactoryList, currentDateValue,
            currentWaterFactoryId, handle, changeDate, changeWaterFactory,
            canSubmit, initialIndicators, reasonList, submitLoading, audit
        } = this.props;
        
        const commonProps = {
            type,
            getFieldDecorator,
            ...initialIndicators
        };
        
        //时间选择
        const DateProps = {
            style: {width: '400px'},
            allowClear: false,
            disabledDate: (value) => {
                if (!value) {
                    return;
                }
                return value.valueOf() > moment().valueOf()
            },
            onChange: (date, dateString) => changeDate(date)
        };
        
        return (
            <Form className="main_page">
                {type === 'view' ? null : <Row className='topBtn'>
                    <Col span={8}/>
                    {
                        type === 'examine' ?
                            <span>
                                <Col span={4} style={{textAlign: 'center'}}>
                                    <Button key='save'
                                            type='primary'
                                            loading={submitLoading}
                                            onClick={() => audit('audit_unpass')}>不通过</Button>
                                </Col>
                                <Col span={4} style={{textAlign: 'center'}}>
                                    <Button key='submit'
                                            type='primary'
                                            loading={submitLoading}
                                            onClick={() => audit('audit_pass')}>通过</Button>
                                </Col>
                            </span>
                            :
                            (!initialIndicators.fillStatus || initialIndicators.fillStatus === 'audit_xj') ?
                                <span>
                                    <Col span={4} style={{textAlign: 'center'}}>
                                        <Button key='save'
                                                type='primary'
                                                loading={submitLoading}
                                                onClick={() => handle('save')}>保存</Button>
                                    </Col>
                                    <Col span={4} style={{textAlign: 'center'}}>
                                        <Button key='submit'
                                                type='primary'
                                                loading={submitLoading}
                                                onClick={() => handle('submit')}>提交</Button>
                                    </Col>
                                </span>
                                :
                                <Col span={8} style={{textAlign: 'center'}}>
                                    <Button key='submit'
                                            type='primary'
                                            loading={submitLoading}
                                            onClick={() => handle('submit')}>提交</Button>
                                </Col>
                    }
                    <Col span={8}/>
                </Row>}
                {type === 'examine' && <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_2} label="本月运营情况总评">
                            {getFieldDecorator('workAssess', {
                                initialValue: initialIndicators.workAssess,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>}
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_4} label="水厂名称">
                            {getFieldDecorator('waterFactoryId', {
                                initialValue: type === 'add' ? currentWaterFactoryId : initialIndicators.waterFactoryId,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '400px'}} disabled={type !== 'add'}
                                        onChange={(value) => changeWaterFactory(value)}>
                                    {waterFactoryList.map(item => (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_4} label="日期">
                            {getFieldDecorator('dateValue', {
                                initialValue: !!initialIndicators.dateValue ? moment(initialIndicators.dateValue) : currentDateValue,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <MonthPicker {...DateProps} disabled={type !== 'add'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {!!canSubmit ? <Tabs defaultActiveKey="1">
                    <TabPane tab="运行天数说明及停产分析" key="1">
                        <DaysRuning {...commonProps}/>
                    </TabPane>
                    <TabPane tab="处理水量分析" key="2">
                        <WaterQuantity {...commonProps}/>
                    </TabPane>
                    <TabPane tab="进出水水质及达标率分析" key="3">
                        <WaterAnalysis {...commonProps} reasonList={reasonList}/>
                    </TabPane>
                    <TabPane tab="电耗及电单耗分析" key="4">
                        <ElectricAnalysis {...commonProps}/>
                    </TabPane>
                    <TabPane tab="药耗及药单耗分析" key="5">
                        <DrugAnalysis {...commonProps}/>
                    </TabPane>
                    <TabPane tab="污泥脱水系统运行及污泥量分析" key="6">
                        <SludgeAnalysis {...commonProps}/>
                    </TabPane>
                    <TabPane tab="工艺调整情况" key="7">
                        <TechnologConditions {...commonProps}/>
                    </TabPane>
                </Tabs> : <div style={{textAlign: 'center', color: '#ff323c'}}>请先选择需要填报的水厂和日期</div>}
            </Form>
        );
    };
}

export default Form.create()(Detail);
