import React from 'react';

import { VtxModal, VtxModalList, VtxUpload, VtxDate } from 'vtx-ui';
const { VtxDatePicker } = VtxDate;
const {VtxUpload2} = VtxUpload
import { Button, Input, Select,message } from 'antd';
const Option = Select.Option;

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>申请</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, waterFactoryId, waterFactorySelect, date, delayReason, attachment } = contentProps
        const { updateItem } = contentProps;

        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Select
                        value={waterFactoryId}
                        onChange={(value) => {
                            updateItem({
                                waterFactoryId : value
                            })
                        }}
                        placeholder="请选择水厂名称（必选项）"
                        allowClear
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '水厂名称',
                                width: '100',
                                key: 'waterFactoryId'
                            },
                            regexp : {
                                value : waterFactoryId
                            }
                        }}
                    >
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        }) }
                    </Select>
                    <VtxDatePicker
                        value={date}
                        onChange={(date, dateString) => {
                            updateItem({
                                date : dateString
                            });
                            this.modalList.clear()
                        }}
                        format='YYYY-MM-DD'
                        data-modallist={{
                            layout:{
                                comType: '',
                                require: true,
                                name: '报表日期',
                                width: '100',
                                key: 'date'
                            },
                            regexp : {
                                value : date,
                                errorMsg: date ? '当天该水厂已存在延迟审批' : '必填项',
                                repete: {
                                    key: {
                                        waterFactoryId,
                                        dateValue:date
                                    },
                                    url: '/cloud/gzzhsw/api/cp/fill/delay/wheatherExit.smvc'
                                }
                            }
                        }}
                    />
                    <Input
                        value={delayReason}
                        rows={3}
                        type='textarea'
                        onChange={(e) => {
                            updateItem({
                                delayReason : e.target.value
                            })
                        }}
                        placeholder="请输入延期原因（必填项）"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: true,
                                name: '延期原因',
                                width: '100',
                                maxNum: 300,
                                key: 'delayReason'
                            },
                            regexp : {
                                value : delayReason
                            }
                        }}
                    />
                    <VtxUpload2
                        fileList={attachment}
                        mode='multiple'
                        action='/cloudFile/common/uploadFile'
                        downLoadURL='/cloudFile/common/downloadFile?id='
                        disabled={false}
                        multiple={true}
                        showUploadList
                        onSuccess={(file) => {
                            message.info(`${file.name} 上传成功.`);
                            updateItem({
                                attachment: attachment.concat({
                                    id : file.id,
                                    name : file.name
                                })
                            });
                        }}
                        onError={(file) => {
                            message.info(`${file.name} 上传失败.`);
                        }}
                        onRemove={(file) => {
                            let files = attachment.filter(item => item.id != file.id);
                            updateItem({attachment : files});
                        }}
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                name: '附件上传',
                                width: '100',
                                key: 'attachment'
                            },
                            regexp : {
                                value : attachment.length > 0 ? '1' : ''
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;