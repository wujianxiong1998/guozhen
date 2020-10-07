import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Button, Select, Modal} from 'antd';
import {VtxDatagrid} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_2} from "../../../utils/util";

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

export default class DrugConsume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {businessScope, libraryList, moreModalVisible, getTargetLibrarySelect, openModal, closeModal, selectTableRows, sureAdd, drugSureList, changeParams} = this.props;
        
        //列表配置
        const tableProps = {
            columns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true,
                render: (text, record) => (<span>{JSON.parse(text).map(item => {
                    return item.name
                }).join(',')}</span>)
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                renderButtons: [
                    {
                        name: '删除', onClick: (rowData) => {
                            const resultList = [...drugSureList].map(item => {
                                if (item.id !== rowData.id) {
                                    return item;
                                }
                            }).filter(item => !!item);
                            changeParams('drugSureList', resultList);
                        }
                    }
                ]
            }],
            dataSource: drugSureList,
            autoFit: true,
            scroll: {
                x: '100%',
            },
            rowKey: record => record.id
        };
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
                onChange: (selectedRowKeys, selectedRows) => selectTableRows(selectedRows)
            }
        };
        //模态框配置
        const modalProps = {
            visible: moreModalVisible,
            title: '指标>选择',
            width: 800,
            maskClosable: false,
            footer: [
                <Button key='cancel'
                        type='primary'
                        onClick={() => sureAdd()}>确定</Button>
            ],
            onCancel: () => closeModal()
        };
        
        return (
            <div className="main_page">
                <div style={{overflow: 'hidden', marginBottom: '10px'}}>
                    <Button type='primary'
                            style={{float: 'right'}}
                            onClick={() => openModal()}
                    >新增</Button>
                </div>
                <div style={drugSureList.length !== 0 ? {
                    height: `${(drugSureList.length * 38) + 120}px`,
                    maxHeight: '500px'
                } : {height: '120px', maxHeight: '500px'}}>
                    <VtxDatagrid {...tableProps}/>
                </div>
                {!!moreModalVisible && <Modal {...modalProps}>
                    <div>
                        <Row>
                            <Col span={24}>
                                <FormItem {...formStyle_2} label="业务范围">
                                    <Select style={{width: '100%'}}
                                            defaultValue={!!businessScope[0] ? businessScope[0].id : ''}
                                            onChange={(value) => getTargetLibrarySelect(value)}>
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
            </div>
        );
    };
}
