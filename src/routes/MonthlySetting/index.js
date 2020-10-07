import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid} from "vtx-ui";
import {Button, Modal, message, Select, Collapse, Col, Row, Form, Spin} from "antd";
import styles from './style.less';
import {formStyle_2, formStyle_4, changArr} from "../../utils/util";
import SingleSelect from './components/SingleSelect'; //单选
import MoreSelect from './components/MoreSelect'; //多选
import DrugConsume from './components/DrugConsume'; //多选

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

class MonthlySetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const {dispatch, monthlySettingM, loading, tableLoading, submitLoading} = this.props;
        const {
            targetSmallTypes, businessScope, waterFactoryList,
            type, visible, libraryList, libraryListA, dealWaterTarget,
            inWaterTargetSmallType, outWaterTargetSmallType, powerConsumeTarget, consumeTarget,
            mudCakeTarget, moreModalVisible, drugTableSelectList,
            drugSureList, technologyModalVisible, moreTableSelectList, moreType, biologicalSureList, biologicalDOSureList
        } = monthlySettingM;
        
        const changeParams = (target, value) => dispatch({
            type: 'monthlySettingM/updateState',
            payload: {
                [target]: value
            }
        });
        
        //公共指标配置
        const commonProps = {
            getFieldDecorator,
            openModal: (type) => openModal(type)
        };
        //处理水量分析
        const waterWeightProps = {
            ...commonProps,
            listA: libraryListA,
            name: '处理水量',
            target: 'dealWaterTarget',
            value: dealWaterTarget
        };
        //进水指标小类
        const inWaterProps = {
            ...commonProps,
            listA: targetSmallTypes,
            name: '进水小类',
            target: 'inWaterTargetSmallType',
            value: inWaterTargetSmallType
        };
        //出水指标小类
        const outWaterProps = {
            ...commonProps,
            listA: targetSmallTypes,
            name: '出水小类',
            target: 'outWaterTargetSmallType',
            value: outWaterTargetSmallType
        };
        //耗电指标
        const powerConsumeProps = {
            ...commonProps,
            listA: libraryListA,
            name: '耗电指标',
            target: 'powerConsumeTarget',
            value: powerConsumeTarget
        };
        //耗电指标
        const powerConsumeSProps = {
            ...commonProps,
            listA: libraryListA,
            name: '单耗指标',
            target: 'consumeTarget',
            value: consumeTarget
        };
        //泥饼指标
        const mudCakeProps = {
            ...commonProps,
            listA: libraryListA,
            name: '泥饼指标',
            target: 'mudCakeTarget',
            value: mudCakeTarget
        };
        //药耗指标
        const drugConsumeProps = {
            businessScope,
            libraryList,
            moreModalVisible,
            drugSureList,
            changeParams,
            getTargetLibrarySelect: (value) => dispatch({
                type: 'monthlySettingM/getTargetLibrarySelect',
                payload: {businessId: value}
            }),
            openModal: () => {
                changeParams('moreModalVisible', true);
                if (businessScope.length !== 0) {
                    dispatch({
                        type: 'monthlySettingM/getTargetLibrarySelect',
                        payload: {businessId: businessScope[0].id}
                    })
                }
            },
            closeModal: () => changeParams('moreModalVisible', false),
            selectTableRows: (rows) => {
                const names = rows.map(item => {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });
                const list = [{id: Number(new Date()), name: JSON.stringify(names)}];
                changeParams('drugTableSelectList', list);
            },
            sureAdd: () => {
                changeParams('drugSureList', [...drugSureList].concat(drugTableSelectList));
                changeParams('moreModalVisible', false)
            }
        };
        //生化污泥指标
        const biologicalMudProps = {
            businessScope,
            openModal: (type) => openModalM(type),
            name: '生化污泥',
            target: 'biologicalSureList',
            value: biologicalSureList,
            changeParams
        };
        //生化池DO
        const biologicalDOTMudProps = {
            businessScope,
            openModal: (type) => openModalM(type),
            name: '生化池DO',
            target: 'biologicalDOSureList',
            value: biologicalDOSureList,
            changeParams
        };
        
        //提交
        const handle = () => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法保存");
                    return;
                }
                if (drugSureList.length === 0) {
                    message.warn("药耗及药单耗分析未选择，无法保存");
                    return;
                }
                if (biologicalSureList.length === 0) {
                    message.warn("生化污泥指标未选择，无法保存");
                    return;
                }
                if (biologicalDOSureList.length === 0) {
                    message.warn("生化池DO指标未选择，无法保存");
                    return;
                }
                const params = {
                    ...values,
                    drugConsumeAndAnalysis: JSON.stringify(drugSureList),
                    biologicalMudTarget: JSON.stringify(biologicalSureList.map(item => {
                        return {id: item.id, name: item.name}
                    })),
                    biologicalDOTarget: JSON.stringify(biologicalDOSureList.map(item => {
                        return {id: item.id, name: item.name}
                    }))
                };
                dispatch({
                    type: 'monthlySettingM/saveOredit',
                    payload: {
                        values: {
                            ...params
                        },
                        onComplete: () => this.props.form.resetFields()
                    }
                })
            })
        };
        //单选模态框配置
        const openModal = (type) => {
            changeParams('type', type);
            changeParams('visible', true);
            if (businessScope.length !== 0 && type !== 'outWaterTargetSmallType' && type !== 'inWaterTargetSmallType') {
                dispatch({type: 'monthlySettingM/getTargetLibrarySelect', payload: {businessId: businessScope[0].id}})
            }
        };
        const modalProps = {
            visible,
            title: '指标>选择',
            width: 800,
            footer: null,
            maskClosable: false,
            onCancel: () => {
                changeParams('type', '');
                changeParams('visible', false)
            }
        };
        //列表配置
        const tableProps = {
            loading: tableLoading,
            columns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                nowrap: true
            }],
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            indexTitle: '序号',
            pagination: {
                showSizeChanger: false,
                showQuickJumper: false
            },
            onRowClick: (record, index) => {
                setFieldsValue({[type]: record.id});
                changeParams('type', '');
                changeParams('visible', false)
            }
        };
        //多选模态框
        const openModalM = (type) => {
            changeParams('moreType', type);
            changeParams('technologyModalVisible', true);
            if (businessScope.length !== 0) {
                dispatch({type: 'monthlySettingM/getTargetLibrarySelect', payload: {businessId: businessScope[0].id}})
            }
        };
        const sureAdd = () => {
            const list = moreType === 'biologicalDOSureList' ? [...biologicalDOSureList] : [...biologicalSureList];
            changeParams(moreType, changArr(list.concat(moreTableSelectList), 'id'));
            changeParams('technologyModalVisible', false)
        };
        const modalPropsM = {
            visible: technologyModalVisible,
            title: '指标>选择',
            width: 800,
            maskClosable: false,
            footer: [
                <Button key='cancel'
                        type='primary'
                        onClick={() => sureAdd()}>确定</Button>
            ],
            onCancel: () => changeParams('technologyModalVisible', false)
        };
        //列表配置
        const tablePropsS = {
            columns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                nowrap: true
            }],
            dataSource: libraryList,
            indexColumn: true,
            autoFit: true,
            indexTitle: '序号',
            pagination: {
                showSizeChanger: false,
                showQuickJumper: false
            },
            rowKey: record => record.id,
            rowSelection: {
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => changeParams('moreTableSelectList', selectedRows.map(item => {
                    return {id: item.id, name: item.name}
                }))
            }
        };
        
        return (
            <Form className="main_page monthlySetting">
                {!!loading && <div className={styles.loadingBg}>
                    <Spin className={styles.loading}/>
                </div>}
                <div className={styles.topBtn}>
                    <Button type='primary' loading={submitLoading} className={styles.btn} onClick={() => handle()}>保存</Button>
                </div>
                <div className={styles.mainContent}>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formStyle_4} label="水厂名称">
                                {getFieldDecorator('waterFactoryId', {
                                    initialValue: waterFactoryList[0] ? waterFactoryList[0].id : '',
                                    rules: [
                                        {required: true, message: '必填项'}
                                    ]
                                })(
                                    <Select style={{width: '400px'}}
                                            onChange={(value) => {
                                                changeParams('currentWaterFactoryId', value);
                                                dispatch({
                                                    type: 'monthlySettingM/getOne',
                                                    payload: {waterFactoryId: value}
                                                })
                                            }}>
                                        {waterFactoryList.map(item => (
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6']}>
                        <Panel header="处理水量分析" key="1" disabled>
                            <SingleSelect {...waterWeightProps}/>
                        </Panel>
                        <Panel header="进出水水质及达标率分析" key="2" disabled>
                            <SingleSelect  {...inWaterProps}/>
                            <SingleSelect  {...outWaterProps}/>
                        </Panel>
                        <Panel header="电耗及电单耗分析" key="3" disabled>
                            <SingleSelect  {...powerConsumeProps}/>
                            <SingleSelect  {...powerConsumeSProps}/>
                        </Panel>
                        <Panel header="药耗及药单耗分析" key="4" disabled>
                            <DrugConsume {...drugConsumeProps}/>
                        </Panel>
                        <Panel header="污泥脱水系统运行及污泥量分析" key="5" disabled>
                            <SingleSelect  {...mudCakeProps}/>
                        </Panel>
                        <Panel header="工艺调整情况" key="6" disabled>
                            <MoreSelect {...biologicalMudProps}/>
                            <MoreSelect {...biologicalDOTMudProps}/>
                        </Panel>
                    </Collapse>
                </div>
                {!!visible && <Modal {...modalProps}>
                    {type === 'outWaterTargetSmallType' || type === 'inWaterTargetSmallType' ?
                        (
                            <div style={{height: '400px'}}>
                                <VtxDatagrid {...tableProps} dataSource={targetSmallTypes}/>
                            </div>
                        ) : (
                            <div>
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formStyle_2} label="业务范围">
                                            <Select style={{width: '100%'}}
                                                    defaultValue={!!businessScope[0] ? businessScope[0].id : ''}
                                                    onChange={(value) => dispatch({
                                                        type: 'monthlySettingM/getTargetLibrarySelect',
                                                        payload: {businessId: value}
                                                    })}>
                                                {
                                                    businessScope.map(item => (
                                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div style={{height: '400px'}}>
                                    <VtxDatagrid {...tableProps} dataSource={libraryList}/>
                                </div>
                            </div>
                        )
                    }
                </Modal>}
                {!!technologyModalVisible && <Modal {...modalPropsM}>
                    <div>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formStyle_2} label="业务范围">
                                    <Select style={{width: '100%'}}
                                            defaultValue={!!businessScope[0] ? businessScope[0].id : ''}
                                            onChange={(value) => dispatch({
                                                type: 'monthlySettingM/getTargetLibrarySelect',
                                                payload: {businessId: value}
                                            })}>
                                        {
                                            businessScope.map(item => (
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{height: '400px'}}>
                            <VtxDatagrid {...tablePropsS}/>
                        </div>
                    </div>
                </Modal>}
            </Form>
        );
    };
}

const monthlySettingProps = (state) => {
    return {
        monthlySettingM: state.monthlySettingM,
        loading: state.loading.effects['monthlySettingM/getOne'] || state.loading.effects['monthlySettingM/saveOredit'],
        tableLoading: state.loading.effects['monthlySettingM/getTargetLibrarySelect'],
        submitLoading: state.loading.effects['monthlySettingM/saveOredit']
    };
};

export default connect(monthlySettingProps)(Form.create()(MonthlySetting));
