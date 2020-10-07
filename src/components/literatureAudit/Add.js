import React from 'react';

import { VtxModal, VtxModalList } from 'vtx-ui';
import { Button, Input,message } from 'antd';
import styles from './index.less'
class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save,auditReason } = contentProps;
        const _t = this;
        return [
            
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    save('ysh'); 
                }
            }>审核通过</Button>,
            <Button key='refuse' size='large'
                loading={loading}
                onClick={() => {
                    if(!auditReason){
                        message.warn('请输入拒绝理由')
                    }else{
                        save('btg'); 
                    }
                }
                }>审核不通过</Button>,
            <Button key='cancel' size='large' onClick={() => {
                updateWindow(false);
            }}>暂不处理</Button>,
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, auditReason, annx, uploadManName, uploadUnitName, uploadDate, title} = contentProps
        const { updateItem } = contentProps;
        const ip = window.location.href.split("#")[0]
        const fileId = annx[0].id
        const fileSuffix = annx[0].name ? annx[0].name.split('.')[1] : ''
        return (
            <VtxModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <center><h2 style={{ fontWeight: 'bold' }}>{title}</h2></center>
                <div className={styles.infoLine}>
                    <div className={styles.item}>{uploadManName}</div>
                    <div className={styles.item}>{uploadUnitName}</div>
                    <div className={styles.item}>上传时间:{uploadDate}</div>
                    <div className={styles.item}><Button onClick={() => { window.open(`/cloudFile/common/download/${fileId}.${fileSuffix}`) }} size='small' type='primary'>下载</Button></div>
                </div>
                <iframe frameBorder={0} src={`${ip}wjyl/onlinePreview?url=${ip}cloudFile/common/download/${fileId}.${fileSuffix}`} className={styles.fileContainer} />
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    <Input
                        value={auditReason}
                        onChange={(e) => {
                            updateItem({
                                auditReason : e.target.value
                            })
                        }}
                        placeholder="请输入原因"
                        maxLength="32"
                        data-modallist={{
                            layout:{
                                comType: 'input',
                                require: false,
                                name: '原因',
                                width: '100',
                                key: 'auditReason'
                            },
                            regexp : {
                                value: auditReason
                            }
                        }}
                    />
                    <div
                        data-modallist={{
                            layout: {
                                require: false,
                                width: '50',
                                key: 'blank'
                            }
                        }}
                        />
                </VtxModalList>
            </VtxModal>
        )
    }
}

export default ADD;