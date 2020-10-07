import React from 'react';
import { Input, Button, Select, Checkbox, TreeSelect } from 'antd';
import { VtxModal, VtxModalList, VtxDate, VtxCombogrid } from 'vtx-ui';
import style from './style.less';
const Option = Select.Option;
const {VtxDatePicker} = VtxDate;
import moment from 'moment';

class SAddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, templateName, orderIndex, chexkBox,
            ssubLoading, updateItem, onSave, plainOptions, checkOnchange, onUpdate } = contentProps;
        let modalProps = {
            title: title,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={ssubLoading} onClick={() => {
                    // Promise.all([
                    //     this.lis1.submit(),
                    // ]).then(data => {
                    //     if (data.indexOf(false) === -1) {
                    //         if (chexkBox.length === 0) {
                    //             message.warning('请选择模板内容');
                    //         } else {
                    //             if (id) {
                    //                 onUpdate();
                    //             } else {
                    //                 onSave();
                    //             }
                    //         }
                    //     }
                    // })

                    if (chexkBox.length === 0) {
                        message.warning('请选择模板内容');
                    } else {
                        onSave();
                    }
                }}>保存</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };
        
        return (
            <VtxModal {...modalProps} className={style.modal}>
                {/* <VtxModalList {...modallistProps} ref={(lis) => this.lis1 = lis}>
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '模版名称',require: true},
                            regexp: {
                                value: templateName,
                            }
                        }}
                        value={templateName}
                        onChange={e=>updateItem({templateName: e.target.value})}
                    />
                    <Input 
                        data-modallist={{
                            layout: {width: 50,name: '排序',require: true},
                            regexp: {
                                value: orderIndex,
                            }
                        }}
                        value={orderIndex}
                        onChange={e=>updateItem({orderIndex: e.target.value})}
                    />
                </VtxModalList> */}
                <Checkbox.Group options={plainOptions} value={chexkBox} onChange={checkOnchange} className={style.check} />
            </VtxModal>
        )
    }
}

export default SAddItem;