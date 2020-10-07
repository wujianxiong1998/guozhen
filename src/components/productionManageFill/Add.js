import React from 'react';

import { VtxModal, VtxModalList, VtxDate, VtxImport } from 'vtx-ui';
const { VtxDatePicker } = VtxDate;
import { Button,Table,Input,message, } from 'antd';
import moment from 'moment'
import FullScreenModal from '../FullScreenModal'
import { handleColumns, VtxTimeUtil } from '../../utils/tools';
import { VtxUtil, openImportView } from '../../utils/util'
import styles from './index.less'
class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save, editType, btnType, dataType, saveAfterCalculateConsumeValue } = contentProps;
        const fillData = contentProps.fillData||[]
        const _t = this;
        //验证表格中是否有未填项
        let isAllFill = true
        return [
            editType === 'edit' ? <Button disabled={!fillData.length} key='save' size='large' loading={loading}
                onClick={() => {
                    _t.modalList.submit().then((state) => {
                        if(state){
                            if (btnType === 'edit' && dataType==='consum'){
                                saveAfterCalculateConsumeValue('xj')
                            } else {
                                save('xj', dataType)
                            }
                        }
                    })
                }}>保存</Button> : '',
            <Button disabled={!fillData.length}  key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        if (state) {
                            if (btnType === 'edit' && dataType === 'consum') {
                                saveAfterCalculateConsumeValue('dsh')
                            } else {
                                save('dsh', dataType)
                            }
                        }
                    })
                }
            }>保存并提交</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, dateValue, fillData, dataType, waterFactoryName, waterFactoryId,importError, showUploadModal, btnType} = contentProps
        const { updateItem, updateState, getList, calculateTargetValue, calculateConsumeTargetValue } = contentProps;
        const dataTypeTitles = {
            'produce':'生产数据',
            'assay':'化验数据',
            'consum':'单耗数据'
        }
        const dataTypeColumns = {
            'produce':[
                ['指标大类','typeName'],
                ['指标小类','smallTypeName'],
                ['指标','name'],
                ['范围','rationalRange'],
                ['值', 'dataValue', { render: (text, record,index) =>{
                    if (record.categoryKey === 'primitiveTarget'){
                        return <Input value={text}
                        onBlur={()=>{calculateTargetValue()}}
                        onChange={(e) => {
                            updateItem({
                                fillData: {
                                    [index]: {
                                        dataValue: e.target.value
                                    }
                                }
                            })
                        }} />
                    }else{
                        return text
                    }}
                    }],
                ['单位','unitName'],
                ['备注', 'dataMemo', {
                    render: (text, record,index) => <Input value={text} onChange={(e) => {
                        updateItem({
                            fillData: {
                                [index]: {
                                    dataMemo: e.target.value
                                }
                            }
                        })
                    }} />
                }]
            ],
            'assay':[
                ['指标大类', 'typeName'],
                ['指标小类', 'smallTypeName'],
                ['指标', 'name'],
                ['范围', 'rationalRange'],
                ['值', 'dataValue', {
                    render: (text, record, index) => {
                        if (record.categoryKey === 'primitiveTarget') {
                            return <Input value={text}
                                onBlur={() => { calculateTargetValue() }}
                                onChange={(e) => {
                                    updateItem({
                                        fillData: {
                                            [index]: {
                                                dataValue: e.target.value
                                            }
                                        }
                                    })
                                }} />
                        } else {
                            return text
                        }
                    }
                }],
                ['单位', 'unitName'],
                ['备注', 'dataMemo', {
                    render: (text, record, index) => <Input value={text} onChange={(e) => {
                        updateItem({
                            fillData: {
                                [index]: {
                                    dataMemo: e.target.value
                                }
                            }
                        })
                    }} />
                }]
            ],
            'consum':[
                ['指标大类', 'typeName'],
                ['指标小类', 'smallTypeName'],
                ['指标', 'name'],
                ['范围', 'rationalRange'],
                ['值', 'dataValue', {
                    render: (text, record, index) => {
                        if (record.categoryKey === 'primitiveTarget') {
                            return <Input disabled={!dateValue}
                            placeholder={!dateValue?'请先选择填报时间':''} value={text}
                                onBlur={() => { calculateConsumeTargetValue() }}
                                onChange={(e) => {
                                    updateItem({
                                        fillData: {
                                            [index]: {
                                                dataValue: e.target.value
                                            }
                                        }
                                    })
                                }} />
                        } else {
                            return text
                        }
                    }
                }],
                ['单位', 'unitName'],
                ['备注', 'dataMemo', {
                    render: (text, record, index) => <Input value={text} onChange={(e) => {
                        updateItem({
                            fillData: {
                                [index]: {
                                    dataMemo: e.target.value
                                }
                            }
                        })
                    }} />
                }]
            ]
        }
        let importProps = {
            templateURL: `/cloud/gzzhsw/api/cp/data/fill/exportExcel?waterFactoryId=${waterFactoryId}&dataFillType=${dataType}&tenantId=${VtxUtil.getUrlParam('tenantId')}`,
            uploadURL: '/cloud/gzzhsw/api/cp/data/fill/importExcel',
            postData: {
                waterFactoryId,
                dateValue,
                dataFillType: dataType,
                tenantId: VtxUtil.getUrlParam('tenantId'),
                userId: VtxUtil.getUrlParam('userId'),
            },
            visible: showUploadModal,
            close() {
                updateState({ showUploadModal: false });
            },
            afterUpload(data) {
                data = JSON.parse(data)
                if (data && data.result == 0 && 'data' in data && Array.isArray(data.data)) {
                    if (data.data.length > 0) {//导入失败
                        openImportView(data.data)
                        message.error('上传失败');
                    } else {
                        message.success('上传成功');
                        updateItem({
                            visible: false
                        })
                        getList();
                        updateState({ showUploadModal: false });
                    }
                } else {
                    message.error(data.msg ? data.msg : '操作失败')
                }
            }
        }
        return (
            <FullScreenModal
                {...modalProps}
                footer={this.footerRender()}
            >
                <VtxModalList
                    isRequired
                    visible={modalProps.visible}
                    ref={this.modalListRef}
                >
                    {
                        btnType === 'add' ?
                            <VtxDatePicker
                                value={dateValue}
                                onChange={(date, dateString) => {
                                    updateItem({
                                        dateValue: dateString
                                    });
                                    if (dataType=='consum'){
                                        calculateConsumeTargetValue()
                                    }
                                    
                                }}
                                disabledDate={
                                    (current)=>{
                                        return VtxTimeUtil.isAfterDate(current);
                                    }
                                }
                                data-modallist={{
                                    layout: {
                                        comType: '',
                                        require: true,
                                        name: '选择时间',
                                        width: '30',
                                        key: 'dateValue'
                                    },
                                    regexp: {
                                        value: dateValue
                                    }
                                }}
                            />
                            :''
                    }
                    {
                        btnType === 'add' ?
                            <div data-modallist={{
                                layout: {
                                    comType: '',
                                    width: '1',
                                    key: 'blank'
                                }
                            }} />
                            : ''
                    }
                    {
                        btnType === 'add' ?
                            <Button style={{marginTop:'15px'}} data-modallist={{
                                layout: {
                                    comType: '',
                                    width: '10',
                                    key: 'upload'
                                }
                            }} icon="cloud-upload-o" onClick={() => {
                                if (!dateValue) {
                                    message.warn('请先选择填报时间')
                                } else {
                                    updateState({ showUploadModal: true, importError: '' });
                                }
                            }}>上传</Button>
                            : ''
                    }
                    <div data-modallist={{ layout: { type: 'title', require: false, } }}>{dateValue ? moment(dateValue).format('YYYY-MM-DD') : ''}{waterFactoryName}{dataTypeTitles[dataType]}填报</div>
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
                <VtxImport {...importProps}>{importError}</VtxImport>
            </FullScreenModal>
        )
    }
}

export default ADD;