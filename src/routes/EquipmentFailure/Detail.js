import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, TreeSelect, DatePicker} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_4, formStyle_8} from '../../utils/util';
import {VtxCombogrid, VtxUpload} from "vtx-ui";

moment.locale('zh-cn');
const FormItem = Form.Item;
const VtxUpload2 = VtxUpload.VtxUpload2;

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    getForm = () => {
        return this.props.form;
    };
    
    componentDidMount() {
        const {userInfo, detail, type} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        if (type !== 'view') {
            getFieldDecorator('structuresId');
            getFieldDecorator('reportManId');
            getFieldDecorator('deviceId');
            getFieldDecorator('typeId');
            getFieldDecorator('faultTypeId');
            if (type === 'add') {
                setFieldsValue({'reportManId': userInfo.id});
            }
            if (type === 'edit') {
                setFieldsValue({'structuresId': detail.structuresId});
                setFieldsValue({'reportManId': detail.reportManId});
                setFieldsValue({'deviceId': detail.deviceId});
                setFieldsValue({'typeId': detail.typeId});
                setFieldsValue({'faultTypeId': detail.faultTypeId});
            }
        }
    }
    
    render() {
        const {userInfo, userList, detail, type, addressSelect, equipmentSelect, faultSelect, changeDetail} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        
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
                if (!!value) {
                    setFieldsValue({'reportManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'reportManId': ''})
                }
            }
        };
        //时间配置
        const dateProps = {
            style: {width: '100%'},
            format: 'YYYY-MM-DD HH:mm:ss',
            allowClear: false,
            showTime: true
        };
        //图片上传
        const imgProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: type === 'view',
            fileList: !!detail.picIds ? detail.picIds.split(',').map((item, index) => {
                return {
                    id: item,
                    name: index
                }
            }) : [],
            onSuccess: (file) => {
                let result = !!detail.picIds ? detail.picIds.split(',') : [];
                result.push(file.id);
                setFieldsValue({'picIds': result.join(',')});
                changeDetail('picIds', result.join(','))
            },
            onRemove: (file) => {
                let result = !!detail.picIds ? detail.picIds.split(',') : [];
                setFieldsValue({
                    'picIds': result.map(item => {
                        if (item !== file.id) {
                            return item
                        }
                    }).filter(item => !!item).join(',')
                });
                changeDetail('picIds', result.map(item => {
                    if (item !== file.id) {
                        return item
                    }
                }).filter(item => !!item).join(','))
            },
        };
        
        return (
            <Form className="main_page">
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="安装位置">
                            {getFieldDecorator('structuresName', {
                                initialValue: detail.structuresName,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <Input disabled/>
                                    :
                                    <VtxCombogrid {...addressSelect} disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备名称">
                            {getFieldDecorator('name', {
                                initialValue: detail.name,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <Input disabled/>
                                    :
                                    <VtxCombogrid {...equipmentSelect} disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备编码">
                            {getFieldDecorator('code', {
                                initialValue: detail.code
                            })(
                                <Input placeholder='选中设备后自动带出' disabled/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="设备类型">
                            {getFieldDecorator('typeName', {
                                initialValue: detail.typeName
                            })(
                                <Input placeholder='选中设备后自动带出' disabled/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="故障类型">
                            {getFieldDecorator('faultTypeName', {
                                initialValue: detail.faultTypeName,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                type === 'view' ?
                                    <Input disabled/>
                                    :
                                    <VtxCombogrid {...faultSelect}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="故障时间">
                            {getFieldDecorator('breakdownTime', {
                                initialValue: !!detail.breakdownTime ? moment(detail.breakdownTime) : null,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <DatePicker {...dateProps} disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="上报人">
                            {getFieldDecorator('reportMan', {
                                initialValue: detail.fillManName || userInfo.name,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <TreeSelect {...peopleSelect} disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formStyle_8} label="故障详情">
                            {getFieldDecorator('details', {
                                initialValue: detail.details,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem {...formStyle_4} label="图片">
                            {getFieldDecorator('picIds')(
                                !detail.picIds && type === 'view' ?
                                    <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                         src="./resources/images/no_pic.png"
                                         alt="noPic"/>
                                    :
                                    <VtxUpload2 {...imgProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
