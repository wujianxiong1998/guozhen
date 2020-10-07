import React from 'react';

import { VtxModal, VtxModalList, VtxUpload, } from 'vtx-ui';
const { VtxUpload2 } = VtxUpload
import { Button, Input,Select,message } from 'antd';
const {Option} = Select
class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
                }>保存</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { title, businessId, knowledgeTypeId, author, contact, attachment, fileListVersion, businessSelect, typeSelect, uploaderInfo, updateItem } = contentProps
        const { uploadManName, uploadUnitName} = uploaderInfo
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={true}
                    ref={this.modalListRef}
                >
                    <Input
                        value={title}
                        onChange={e => {
                            updateItem({
                                title: e.target.value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '文献标题',
                                width: '100',
                                key: 'title'
                            },
                            regexp: {
                                value: title
                            }
                        }}
                    />
                    <Select
                        value={businessId}
                        onChange={(value) => {
                            updateItem({
                                businessId: value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '业务范围',
                                width: '50',
                                key: 'businessId'
                            },
                            regexp: {
                                value: businessId
                            }
                        }}
                    >
                        {businessSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Select
                        value={knowledgeTypeId}
                        onChange={(value) => {
                            updateItem({
                                knowledgeTypeId: value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '知识类型',
                                width: '50',
                                key: 'knowledgeTypeId'
                            },
                            regexp: {
                                value: knowledgeTypeId
                            }
                        }}
                    >
                        {typeSelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Input
                        value={author}
                        onChange={e => {
                            updateItem({
                                author: e.target.value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                require: true,
                                name: '作者',
                                width: '50',
                                key: 'author'
                            },
                            regexp: {
                                value: author
                            }
                        }}
                    />
                    <div
                        data-modallist={{
                            layout: {
                                type: 'text',
                                name: '上传人',
                                width: '50',
                                key: 'uploadManName'
                            },
                        }}
                    >
                        {uploadManName}
                    </div>
                    <Input
                        value={contact}
                        onChange={e => {
                            updateItem({
                                contact: e.target.value
                            })
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                name: '联系方式',
                                width: '50',
                                key: 'contact'
                            },
                            regexp: {
                                value: contact
                            }
                        }}
                    />
                    <div
                        data-modallist={{
                            layout: {
                                type: 'text',
                                name: '上传单位',
                                width: '50',
                                key: 'uploadUnitName'
                            },
                        }}
                    >
                        {uploadUnitName}
                    </div>
                    <VtxUpload2
                        fileList={attachment}
                        fileListVersion={fileListVersion}
                        mode='single'
                        action='/cloudFile/common/uploadFile'
                        downLoadURL='/cloudFile/common/downloadFile?id='
                        multiple={false}
                        showUploadList
                        onSuccess={(file) => {
                            message.info(`${file.name} 上传成功.`);
                            updateItem({
                                attachment: [{
                                    id: file.id,
                                    name: file.name
                                }]
                            });
                        }}
                        onError={(file) => {
                            message.info(`${file.name} 上传失败.`);
                        }}
                        onRemove={() => {
                            updateItem({ attachment: [] });
                        }}
                        data-modallist={{
                            layout: {
                                comType: 'input',
                                name: '上传文件',
                                width: '100',
                                key: 'attachment',
                                require:true
                            },
                            regexp: {
                                value: attachment.length>0?1:''
                            }
                        }}
                    />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;