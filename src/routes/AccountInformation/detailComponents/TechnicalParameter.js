import React from 'react';
import moment from 'moment';
import {Form, Button, Input, Modal, Table, Row, Col, message} from 'antd';
import {VtxDatagrid} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_4} from '../../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;

class SpareParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {type: parentType, modalParams, technicalParameterList, updateTechnicalParameterParams} = this.props;
        const {type, visible, title, detail} = modalParams;
        const {getFieldDecorator} = this.props.form;
        
        const columns = [{
            title: '参数名称',
            dataIndex: 'name',
            key: 'name',
            nowrap: true
        }, {
            title: '参数值',
            dataIndex: 'dataValue',
            key: 'dataValue',
            nowrap: true
        }, {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
            nowrap: true
        }];
        //内容列表参数
        const delContentItem = (id) => {
            const resultList = technicalParameterList.map(item => {
                if (item.id !== id) {
                    return item
                }
            }).filter(item => !!item);
            updateTechnicalParameterParams('technicalParameterList', resultList);
        };
        const contentTableProps = {
            columns: parentType !== 'view' ? columns.concat({
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                width: 100,
                render: (text, rowData) => (
                    <div>
                        <a onClick={() => {
                            updateTechnicalParameterParams('modalParams', {
                                type: 'edit',
                                visible: true,
                                title: '技术参数>编辑',
                                detail: rowData
                            });
                        }}>编辑</a>
                        <span className="ant-divider"/>
                        <a onClick={() => delContentItem(rowData.id)}>删除</a>
                    </div>
                )
            }) : columns,
            dataSource: technicalParameterList,
            rowKey: record => record.id,
            autoFit: true
        };
        
        //模态框配置
        const closeModal = () => {
            updateTechnicalParameterParams('modalParams', {
                type: '',
                visible: false,
                title: '',
                detail: {}
            });
            this.props.form.resetFields();
        };
        //新增或编辑
        const handle = (type) => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法提交");
                    return;
                }
                if (type === 'add') {
                    const resultList = technicalParameterList.concat({
                        id: Number(new Date()),
                        ...values
                    });
                    updateTechnicalParameterParams('technicalParameterList', resultList);
                    closeModal()
                } else if (type === 'edit') {
                    const resultList = technicalParameterList.map(item => {
                        if (item.id === detail.id) {
                            return {...values}
                        } else {
                            return item
                        }
                    });
                    updateTechnicalParameterParams('technicalParameterList', resultList);
                    closeModal()
                }
            })
        };
        const modalProps = {
            visible,
            title,
            maskClosable: false,
            width: 500,
            footer: [
                <Button key='submit'
                        type='primary'
                        onClick={() => handle(type)}>保存</Button>
            ],
            onCancel: () => closeModal()
        };
        
        return (
            <div style={{width: '100%', overflow: 'hidden'}}>
                {parentType !== 'view' && <div style={{overflow: 'hidden', marginBottom: '10px'}}>
                    <Button type='primary'
                            style={{float: 'right'}}
                            onClick={() => {
                                updateTechnicalParameterParams('modalParams', {
                                    type: 'add',
                                    visible: true,
                                    title: '技术参数>新增',
                                    detail: {}
                                });
                            }}
                    >新增</Button>
                </div>}
                <div style={technicalParameterList.length !== 0 ? {
                    height: `${(technicalParameterList.length * 38) + 120}px`,
                    maxHeight: '500px'
                } : {height: '120px', maxHeight: '500px'}}>
                    <VtxDatagrid {...contentTableProps}/>
                </div>
                {!!visible && <Modal {...modalProps}>
                    <Form>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_4} label="参数名称">
                                    {getFieldDecorator('name', {
                                        initialValue: detail.name,
                                        rules: [
                                            {required: true, whitespace: true, message: '必填项'}
                                        ]
                                    })(
                                        type === 'view' ?
                                            <span>{detail.name}</span>
                                            :
                                            <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_4} label="参数值">
                                    {getFieldDecorator('dataValue', {
                                        initialValue: detail.dataValue,
                                        rules: [
                                            {required: true, whitespace: true, message: '必填项'}
                                        ]
                                    })(
                                        type === 'view' ?
                                            <span>{detail.dataValue}</span>
                                            :
                                            <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem {...formStyle_4} label="备注">
                                    {getFieldDecorator('memo', {
                                        initialValue: detail.memo,
                                        rules: [
                                            {required: true, whitespace: true, message: '必填项'}
                                        ]
                                    })(
                                        type === 'view' ?
                                            <span>{detail.memo}</span>
                                            :
                                            <Input/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>}
            </div>
        );
    };
}

export default Form.create()(SpareParts);
