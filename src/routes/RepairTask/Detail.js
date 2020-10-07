import React from 'react';
import moment from 'moment';
import {Form, Row, Col, Input, Select, TreeSelect, InputNumber, DatePicker, Radio, Icon, Button} from 'antd';
import 'moment/locale/zh-cn';
import {formStyle_9, formStyle_3} from '../../utils/util';
import {VtxUpload} from "vtx-ui";
import SpareParts from "../AccountInformation/detailComponents/SpareParts";

moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {VtxUpload2} = VtxUpload;

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
        getFieldDecorator('actRepareManId');
        setFieldsValue({'actRepareManId': detail.actRepareManId || userInfo.id});
    }
    
    render() {
        const {userInfo, userList, repairType, detail, type, changeDetail, sparePartsLoading, sparePartsParams, updateSparePartsParams, getSparePartsList, handle, submitLoading} = this.props;
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const {countTotal} = sparePartsParams;
        
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
                    setFieldsValue({'actRepareManId': extra.triggerNode.props.eventKey})
                } else {
                    setFieldsValue({'actRepareManId': ''})
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
        //故障图片
        const picProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: true,
            fileList: !!detail.picIds ? detail.picIds.split(',').map((item, index) => {
                return {
                    id: item,
                    name: index
                }
            }) : []
        };
        //图片上传
        const imgProps = {
            action: "/cloudFile/common/uploadFile",
            downLoadURL: '/cloudFile/common/downloadFile?id=',
            multiple: false,
            listType: "picture-card",
            accept: 'image/png, image/jpeg, image/jpg',
            viewMode: type !== 'receipt',
            fileList: !!detail.fileIds ? detail.fileIds.split(',').map((item, index) => {
                return {
                    id: item,
                    name: index
                }
            }) : [],
            onSuccess: (file) => {
                let result = !!detail.fileIds ? detail.fileIds.split(',') : [];
                result.push(file.id);
                setFieldsValue({'fileIds': result.join(',')});
                changeDetail('fileIds', result.join(','))
            },
            onRemove: (file) => {
                let result = !!detail.fileIds ? detail.fileIds.split(',') : [];
                setFieldsValue({
                    'fileIds': result.map(item => {
                        if (item !== file.id) {
                            return item
                        }
                    }).filter(item => !!item).join(',')
                });
                changeDetail('fileIds', result.map(item => {
                    if (item !== file.id) {
                        return item
                    }
                }).filter(item => !!item).join(','))
            },
        };
        //配件库
        const sparePartsProps = {
            type,
            sparePartsLoading,
            ...sparePartsParams,
            updateSparePartsParams,
            getSparePartsList,
            from: 'repairTask'
        };
        
        return (
            <Form className="main_page">
                {type !== 'receipt' && type !== 'view' && <Row className='topBtn'>
                    <Col span={8}/>
                    <Col span={4} style={{textAlign: 'center'}}>
                        <Button key='cancel'
                                loading={submitLoading}
                                onClick={() => handle(type, -1)}>不通过</Button>
                    </Col>
                    <Col span={4} style={{textAlign: 'center'}}>
                        <Button key='submit'
                                type='primary'
                                loading={submitLoading}
                                onClick={() => handle(type, 1)}>通过</Button>
                    </Col>
                    <Col span={8}/>
                </Row>}
                {type !== 'receipt' && <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="审批内容">
                            {getFieldDecorator('auditMemo', {
                                initialValue: detail.auditMemo
                            })(
                                <Input disabled={type === 'view'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>}
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="设备位置">
                            <Input value={detail.structuresName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障设备">
                            <Input value={detail.deviceName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="设备类型">
                            <Input value={detail.typeName} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障类型">
                            <Input value={detail.faultTypeName} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="故障时间">
                            <Input value={detail.breakdownTimeStr} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="上报人">
                            <Input value={detail.reportMan} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="故障详情">
                            <Input value={detail.details} disabled/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="故障图片">
                            {
                                !!detail.picIds ? <VtxUpload2 {...picProps}/>
                                    :
                                    <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                         src="./resources/images/no_pic.png"
                                         alt="noPic"/>
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修人">
                            <Input value={detail.repareMan} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="限定时间">
                            <Input value={detail.limitDate} disabled/>
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="实际维修人">
                            {getFieldDecorator('actRepareMan', {
                                initialValue: detail.actRepareMan || userInfo.name,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <TreeSelect {...peopleSelect} disabled={type !== 'receipt'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修类型">
                            {getFieldDecorator('repareType', {
                                initialValue: detail.repareType,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <Select style={{width: '100%'}} disabled={type !== 'receipt'}>
                                    {repairType.map(item => (
                                        <Option key={item.value} value={item.value}>{item.text}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="维修费用">
                            {getFieldDecorator('reparePrice', {
                                initialValue: detail.reparePrice,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <InputNumber style={{width: '100%'}} min={0.01} precision={2} step={0.01}
                                             disabled={type !== 'receipt'}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formStyle_9} label="完成时间">
                            {getFieldDecorator('completeTime', {
                                initialValue: !!detail.completeTime ? moment(detail.completeTime) : null,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <DatePicker {...dateProps} disabled={type !== 'receipt'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="维修详情">
                            {getFieldDecorator('repareDetail', {
                                initialValue: detail.repareDetail,
                                rules: [
                                    {required: true, whitespace: true, message: '必填项'}
                                ]
                            })(
                                <Input disabled={type !== 'receipt'}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="是否为返修">
                            {getFieldDecorator('isBackRepare', {
                                initialValue: detail.isBackRepare,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                <RadioGroup disabled={type === 'view'}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem {...formStyle_3} label="上报附件">
                            {getFieldDecorator('fileIds', {
                                initialValue: detail.fileIds,
                                rules: [
                                    {required: true, message: '必填项'}
                                ]
                            })(
                                !detail.fileIds && type !== 'receipt' ?
                                    <img style={{width: '94px', height: '94px', border: '1px solid #dedede'}}
                                         src="./resources/images/no_pic.png"
                                         alt="noPic"/>
                                    :
                                    <VtxUpload2 {...imgProps}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={21}>
                        <FormItem className='modalTable' {...formStyle_3} label="配件信息">
                            <SpareParts {...sparePartsProps}/>
                            <div style={{float: 'right'}}>总计:{countTotal}</div>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };
}

export default Form.create()(Detail);
