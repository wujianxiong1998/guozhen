import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button, Table, message, Input,Icon,Modal} from 'antd';
const TextArea = Input.TextArea

import moment from 'moment'
import FullScreenModal from '../FullScreenModal'
import styles from './index.less'
import { handleColumns } from '../../utils/tools';
class View extends React.Component {
    constructor(props){
        super(props)
    }
    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, handleAudit, auditMemo, dataStatus } = contentProps;
        const _t = this;

        return dataStatus==='tg'?[
        ]:[
            <Button key='save' size='large' loading={loading}
                onClick={() => {
                    if (!auditMemo) {
                        message.warn('请填写拒绝理由！')
                    } else {
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
        const { dateValue, fillData, waterFactoryName, waterFactoryId, auditMemo, dataType, dataStatus } = contentProps
        const { updateItem, updateChartItem,getChartData} = contentProps
        const dataTypeTitles = {
            'produce': '生产数据',
            'assay': '化验数据',
            'consum': '单耗数据'
        }
        const dataTypeColumns = {
            'produce': [
                ['指标大类', 'typeName'],
                ['指标小类', 'smallTypeName'],
                ['指标', 'name'],
                ['范围', 'rationalRange'],
                ['值', 'dataValue'],
                ['单位', 'unitName'],
                ['较去年变化', 'lastYearDataChange',],
                ['备注', 'dataMemo']
            ],
            'assay': [
                ['指标大类', 'typeName'],
                ['指标小类', 'smallTypeName'],
                ['指标', 'name'],
                ['范围', 'rationalRange'],
                ['值', 'dataValue'],
                ['单位', 'unitName'],
                ['近七天变化', '', { render: (text, record) => <div style={{ fontSize: '25px', color: '#108eff', }}><Icon onClick={()=>{
                    getChartData({
                        dateValue,
                        waterFactoryId,
                        libraryId: record.libraryId
                    })
                    updateChartItem({
                        visible:true,
                        name:record.name,
                        unit: record.unitName
                    })
                }} style={{ cursor: 'pointer'}} type="line-chart" /></div> },],
                ['备注', 'dataMemo']
            ],
            'consum': [
                ['指标大类', 'typeName'],
                ['指标小类', 'smallTypeName'],
                ['指标', 'name'],
                ['范围', 'rationalRange'],
                ['值', 'dataValue'],
                ['单位', 'unitName'],
                ['备注', 'dataMemo']
            ]
        }
        
        return (
            <FullScreenModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList>
                    <span data-modallist={{ layout: { type: 'text', style: { height: 0 } } }} />
                    <div key='title' data-modallist={{ layout: { type: 'title', require: false, } }}>{dateValue ? moment(dateValue).format('YYYY-MM-DD') : ''}{waterFactoryName}{dataTypeTitles[dataType]}填报</div>
                </VtxModalList>
                <div className={styles.tableBox}>
                    <Table
                        bordered
                        className={styles.table}
                        columns={handleColumns(dataTypeColumns[dataType]||[])}
                        dataSource={fillData}
                        pagination={false}
                        rowKey={record => record.id}
                    />
                </div>
                <VtxModalList>
                    <div data-modallist={{ layout: { type: 'title', require: false, } }}>审核意见</div>
                    {
                        dataStatus==='tg'?
                        <div
                                data-modallist={{
                                    layout: {
                                        type: 'text',
                                        name: '审核意见', width: 60, key: 'auditMemo'
                                    }
                                }}
                        >
                        {auditMemo}
                        </div>
                        :
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
                    }
                    <div />
                    
                </VtxModalList>
            </FullScreenModal>
        )
    }
   
}

export default View;