import React from 'react';

import { VtxModalList, VtxModal  } from 'vtx-ui';
import { Button,Table,message,Input } from 'antd';
const TextArea = Input.TextArea
import FullScreenModal from '../FullScreenModal'
import styles from './index.less'
import { handleColumns } from '../../utils/tools';
class View extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, handleAudit, editType, auditMemo, dataStatus } = contentProps;
        const _t = this;

        return dataStatus === 'tg' ? [
        ] :[
           <Button key='save' size='large' loading={loading}
                onClick={() => {
                    if(!auditMemo){
                        message.warn('请填写拒绝理由！')
                    }else{
                        handleAudit('dxg')
                    }
                }}>拒绝</Button>,
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={() => {
                    handleAudit('tg')
                }
                }>通过</Button>
        ]
    }
    render(){
        const { updateWindow, modalProps, contentProps } = this.props;
        const { dateValue, fillData, waterFactoryName, updateItem, auditMemo,dataStatus } = contentProps
        const monthNames = ['januaryData', 'februaryData', 'marchData', 'aprilData', 'mayData', 'juneData', 'julyData', 'augustData', 'septemberData', 'octoberData',
            'novemberData', 'decemberData']
        let monthLines = []
        for (let i = 0; i < 12; i++) {
            monthLines.push([i + 1 + '月', monthNames[i], {width: 100}])
        }
        const columns = [
            ['类型', 'smallTypeName', { width: 80 }],
            ['计划项目', 'name', { width: 80 }],
            ['单位', 'unitName', { width: 80 }],
            ['年度预算', 'yearBudget', { width: 80 }],
            ...monthLines
        ]
        return (
            <FullScreenModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList>
                    <span data-modallist={{layout:{type:'text',style:{height:0}}}}/>
                    <div key='title' data-modallist={{ layout: { type: 'title', require: false, } }}>{dateValue ? dateValue + '年' : ''}{waterFactoryName}数据填报</div>
                </VtxModalList>
                <div className={styles.tableBox}>
                    <Table
                        bordered
                        className={styles.table}
                        columns={handleColumns(columns)}
                        dataSource={fillData}
                        pagination={false}
                        rowKey={record => record.id}
                        scroll={{ x: 1500 }}
                    />
                </div>
                {
                    dataStatus === 'tg' ?''
                    :
                        <VtxModalList>
                            <div data-modallist={{ layout: { type: 'title', require: false, } }}>审核意见</div>
                            <TextArea
                                value={auditMemo}
                                rows={3}
                                onChange={(e) => {
                                    updateItem({
                                        auditMemo: e.target.value
                                    })
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        name: '审核意见', width: 60, key: 'auditMemo'
                                    }
                                }}
                            />
                            <div />
                        </VtxModalList>
                }
                
            </FullScreenModal>
        )
    }
    
}

export default View;