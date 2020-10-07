import React from 'react';
import {Input, Button, Select, TreeSelect} from 'antd';
import {VtxModal, VtxModalList, VtxDate, VtxUpload} from 'vtx-ui';

const {VtxUpload2} = VtxUpload;
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;
import moment from 'moment';

class MissionItem extends React.Component {
    constructor(props) {
        super(props);
        this.lis1 = null;
    }
    
    render() {
        let {modalPropsItem, contentProps, fileListVersion, userList} = this.props;
        let {title, visible, onCancel, width} = modalPropsItem;
        let {
            id, accRepareManId, accRepareMan, completeTime, picIds,
            modelLonding, updateItem, onSave
        } = contentProps;
        
        let modalProps = {
            title: `${title} > 回单`,
            visible: visible,
            footer: <div>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onSave(0)
                        }
                    })
                }}>保存</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    Promise.all([
                        this.lis1.submit(),
                    ]).then(data => {
                        if (data.indexOf(false) === -1) {
                            onSave(1)
                        }
                    })
                }}>保存并提交</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };
        
        let modallistProps = {
            visible: visible,
            isRequired: true,
        };
        
        let uploadProps = (name, fieldCode, photoIds, require = true) => {
            return {
                action: "/cloudFile/common/uploadFile",
                downLoadURL: '/cloudFile/common/downloadFile?id=',
                "data-modallist": {
                    layout: {
                        width: 100,
                        name,
                        // require
                    },
                    regexp: {
                        value: photoIds
                    }
                },
                listType: "picture-card",
                mode: 'multiple',
                onSuccess(file) {
                    photoIds.push({id: file.id, name: file.name});
                    updateItem({[fieldCode]: photoIds})
                },
                onRemove(file) {
                    let ph = photoIds.filter(item => item.id !== file.id);
                    updateItem({[fieldCode]: ph})
                },
                fileList: photoIds ? photoIds : [],
                accept: 'image/png, image/jpeg, image/jpg',
                fileListVersion,
            }
        }
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <TreeSelect
                        data-modallist={{
                            layout: {width: 100, name: '保养执行人', require: true},
                            regexp: {
                                value: accRepareMan
                            }
                        }}
                        value={accRepareMan}
                        treeData={userList}
                        treeDefaultExpandAll={true}
                        showSearch={true}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                        onChange={(value, label, extra) => {
                            if (!!value) {
                                updateItem({'accRepareManId': extra.triggerNode.props.attributes.userId});
                                updateItem({'accRepareMan': value});
                            } else {
                                updateItem({'accRepareManId': ''});
                                updateItem({'accRepareMan': ''});
                            }
                        }}
                    />
                    <VtxDatePicker
                        data-modallist={{
                            layout: {width: 100, name: '养护时间', require: true},
                            regexp: {
                                value: completeTime
                            }
                        }}
                        value={completeTime}
                        showTime={true}
                        onChange={(date, dateString) => updateItem({completeTime: dateString})}
                        // disabledDate={date=>{
                        //     if(completeTime && date){
                        //         return date.valueOf() > moment(completeTime).valueOf()
                        //     }
                        //     return false
                        // }}
                    />
                    <VtxUpload2
                        {...uploadProps('附件', 'picIds', picIds)}
                    />
                </VtxModalList>
            
            </VtxModal>
        )
    }
}

export default MissionItem;
