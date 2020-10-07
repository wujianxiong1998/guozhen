import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select, DatePicker, Radio, InputNumber, TreeSelect} from 'antd';
import {VtxCombogrid, VtxUpload} from 'vtx-ui';
import 'moment/locale/zh-cn';
import {formStyle_8, formStyle_4, PositiveInteger, emptyInput} from '../../../utils/util';

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    // componentDidMount() {
    //     const {getFieldDecorator, setFieldsValue, detail, type, getStructuresList} = this.props;
    //     if (type !== 'view') {
    //         getFieldDecorator('waterFactoryId');
    //         getFieldDecorator('parentId');
    //         if (type === 'edit') {
    //             setFieldsValue({'waterFactoryId': detail.waterFactoryId});
    //             setFieldsValue({'parentId': detail.parentId});
    //             if (!!detail.waterFactoryId) {
    //                 getStructuresList(detail.waterFactoryId, null)
    //             }
    //         }
    //     }
    // }
    
    render() {
        const {getFieldDecorator, setFieldsValue, type, contentProps, userList, changeDetailNew, changeDetail} = this.props;
        //时间配置
        const dateProps = {
            style: {width: '100%'},
            format: 'YYYY-MM-DD HH:mm:ss',
            allowClear: false,
            showTime: true,
        };


        //文件上传
        const fileProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "text",
            viewMode: type === 'view',
            fileList: contentProps.picIds11 !== 0 ? contentProps.picIds11 : [],
            onSuccess: (file) => {
                let result = contentProps.picIds11 !== 0 ? contentProps.picIds11 : [];
                result.push({id: file.id, name: file.name});
                changeDetailNew('picIds11', JSON.stringify(result))
            },
            onRemove: (file) => {
                let result = contentProps.picIds11 !== 0 ? contentProps.picIds11 : [];
                changeDetailNew('picIds11', JSON.stringify(result.map(item => {
                    if (item.id !== file.id) {
                        return item
                    }
                }).filter(item => !!item)))
            },
        };

        //选择人员
        const peopleSelect = {
            style: {width: '100%'},
            treeData: userList,
            treeDefaultExpandAll: true,
            showSearch: true,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            onChange: (value, label, extra) => {
                getFieldDecorator('actManId');
                if (!!value) {
                    setFieldsValue({'actManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'actManId': ''})
                }
            }
        };
        
        return (
            <div>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="工单编号">
                            {getFieldDecorator('gdCode', {
                                initialValue: contentProps.gdCode
                            })(
                                <span>{contentProps.gdCode}</span>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="安装位置">
                            {getFieldDecorator('structuresName', {
                                initialValue: contentProps.structuresName
                            })(
                                <span>{contentProps.structuresName}</span>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备名称">
                            {getFieldDecorator('name', {
                                initialValue: contentProps.name
                            })(
                                <span>{contentProps.name}</span>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备编码">
                            {getFieldDecorator('code', {
                                initialValue: contentProps.code
                            })(
                                <span>{contentProps.code}</span>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="计划执行时间">
                            {getFieldDecorator('planDateStr', {
                                initialValue: contentProps.planDateStr
                            })(
                                <span>{contentProps.planDateStr}</span>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="负责人">
                            {getFieldDecorator('chargeManName', {
                                initialValue: contentProps.chargeManName
                            })(
                                <span>{contentProps.chargeManName}</span>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="预算总价（万元）">
                            {getFieldDecorator('planMoney', {
                                initialValue: contentProps.planMoney
                            })(
                                <span>{contentProps.planMoney}</span>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="实际费用（万元）">
                            {getFieldDecorator('actMoney', {
                                initialValue: contentProps.actMoney,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{contentProps.actMoney}</span>
                                    :
                                    <InputNumber style={{width: '100%'}} min={0.01} precision={2} step={0.01}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="开始时间">
                            {getFieldDecorator('actStartDay', {
                                initialValue: !!contentProps.actStartDay ? moment(contentProps.actStartDay) : null,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{contentProps.actStartDay}</span>
                                    :
                                    <DatePicker {...dateProps}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="完成时间">
                            {getFieldDecorator('actEndDay', {
                                initialValue: !!contentProps.actEndDay ? moment(contentProps.actEndDay) : null,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{contentProps.actEndDay}</span>
                                    :
                                    <DatePicker {...dateProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="执行人">
                            {getFieldDecorator('actManName', {
                                initialValue: contentProps.actManName,
                                rules: [
                                    {required: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{contentProps.actManName}</span>
                                    :
                                    <TreeSelect {...peopleSelect}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="大修改进明细">
                            {getFieldDecorator('details', {
                                initialValue: contentProps.details,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'},
                                ]
                            })(
                                type === 'view' ?
                                    <span>{contentProps.details}</span>
                                    :
                                    <Input.TextArea/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="上传文件">
                            {getFieldDecorator('picIds11', {
                                    initialValue: contentProps.picIds11
                                }
                            )(
                                !contentProps.picIds11 && type === 'view' ?
                                    <span>暂无</span>
                                    :
                                    <VtxUpload {...fileProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };
}
