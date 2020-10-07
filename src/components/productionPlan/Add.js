import React from 'react';

import { VtxModal, VtxModalList, VtxDate,VtxImport } from 'vtx-ui';
const { VtxYearPicker } = VtxDate;
import { Button, InputNumber, Table, message, Modal } from 'antd';
import FullScreenModal from '../FullScreenModal'
import { handleColumns, } from '../../utils/tools';
import { VtxUtil, openImportView} from '../../utils/util'
import styles from './index.less'
class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {};
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save, editType } = contentProps;
        const fillData = contentProps.fillData||[]
        const _t = this;
        //验证表格中是否有未填项
        let isAllFill = true
        let hasZero = false
        const monthNames = ['januaryData', 'februaryData', 'marchData', 'aprilData', 'mayData', 'juneData', 'julyData', 'augustData', 'septemberData', 'octoberData',
            'novemberData', 'decemberData']
        for(let j=0;j<fillData.length;j++){
            if (!isAllFill){
                break
            }
            for (let i = 0; i < monthNames.length; i++) {
                if (!fillData[j][monthNames[i]] && fillData[j][monthNames[i]]!==0) {
                    isAllFill = false
                }
                if (fillData[j][monthNames[i]]==0){
                    hasZero=true
                }
            }
        }
        return [
            editType === 'edit' ? <Button disabled={!fillData.length} key='save' size='large' loading={loading}
                onClick={()=>{
                _t.modalList.submit().then((state) => {
                    if (state) {
                        if (!isAllFill&&!hasZero) {
                            Modal.confirm({
                                title: '存在为空的数据，是否确认提交？',
                                okText: '是',
                                cancelText: '否',
                                onOk() {
                                    save('xj')
                                }
                            })
                        }else if (hasZero&&isAllFill){
                            Modal.confirm({
                                title:'存在值为0的数据，是否确认提交？',
                                okText:'是',
                                cancelText:'否',
                                onOk(){
                                    save('xj')
                                }
                            })
                        } else if (hasZero&&!isAllFill){
                            Modal.confirm({
                                title: '存在为0或为空的数据，是否确认提交？',
                                okText: '是',
                                cancelText: '否',
                                onOk() {
                                    save('xj')
                                }
                            })
                        } else {
                            save('xj')
                        }
                    }
                })
            }}>保存</Button>:'',
            <Button disabled={!fillData.length} key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        if(state){
                            if (!isAllFill && !hasZero) {
                                Modal.confirm({
                                    title: '存在为空的数据，是否确认提交？',
                                    okText: '是',
                                    cancelText: '否',
                                    onOk() {
                                        save('dsh')
                                    }
                                })
                            } else if (hasZero && isAllFill) {
                                Modal.confirm({
                                    title: '存在值为0的数据，是否确认提交？',
                                    okText: '是',
                                    cancelText: '否',
                                    onOk() {
                                        save('dsh')
                                    }
                                })
                            } else if (hasZero && !isAllFill) {
                                Modal.confirm({
                                    title: '存在为0或为空的数据，是否确认提交？',
                                    okText: '是',
                                    cancelText: '否',
                                    onOk() {
                                        save('dsh')
                                    }
                                })
                            }else{
                                save('dsh')
                            }
                        }
                    })
                }
            }>保存并提交</Button>
        ]
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const { id, dateValue, fillData, waterFactoryName, editType, btnType,
            waterFactoryId, importError, showUploadModal,  } = contentProps
        const { updateItem, updateState,getList } = contentProps;
        const monthNames = ['januaryData', 'februaryData', 'marchData', 'aprilData', 'mayData', 'juneData', 'julyData', 'augustData', 'septemberData','octoberData',
            'novemberData','decemberData']
        let monthLines = []
        for (let i=0;i<12;i++){
            monthLines.push([i+1+'月',monthNames[i],{width:100,render:(text,record,index)=><InputNumber min={0} value={text} onChange={(value)=>{
                updateItem({
                    fillData:{
                        [index]:{
                           [monthNames[i]]:value
                        }
                    }
                })
            }} precision={2} />}])
        }
        const columns = [
            ['类型','smallTypeName',{width:80}],
            ['计划项目', 'name', { width: 80 }],
            ['单位', 'unitName', { width: 80 }],
            ['年度预算', 'yearBudget', { width: 80 }],
            ...monthLines
        ]
        let importProps = {
            templateURL: `/cloud/gzzhsw/api/cp/produce/data/fill/exportExcel?waterFactoryId=${waterFactoryId}&tenantId=${VtxUtil.getUrlParam('tenantId')}`,
            uploadURL: '/cloud/gzzhsw/api/cp/produce/data/fill/importExcel',
            postData: {
                waterFactoryId,
                dateValue,
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
                            visible:false
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
                        btnType==='add'?
                            <VtxYearPicker
                                value={dateValue}
                                onChange={(date, dateString) => {
                                    updateItem({
                                        dateValue: dateString
                                    });
                                }}
                                // style={{ width: '100%' }}
                                format='YYYY'
                                data-modallist={{
                                    layout: {
                                        comType: '',
                                        require: true,
                                        name: '计划填报',
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
                        btnType==='add'?
                            <div data-modallist={{
                                layout: {
                                    comType: '',
                                    width: '1',
                                    key: 'blank'
                                }
                            }}/>
                            :''
                    }
                    {
                        btnType==='add'?
                            <Button style={{marginTop:'15px'}} data-modallist={{layout: {
                                    comType: '',
                                    width: '10',
                                    key: 'upload'
                                } }} icon="cloud-upload-o" onClick={() => {
                                if(!dateValue){
                                    message.warn('请先选择填报时间')
                                }else{
                                    updateState({ showUploadModal: true, importError: '' });
                                }
                            }}>上传</Button>
                        :''
                    }
                    <div data-modallist={{ layout: { type: 'title', require: false, } }}>{dateValue ? dateValue+'年':''}{waterFactoryName}数据填报</div>
                </VtxModalList>
                <div className={styles.tableBox}>
                    <Table
                        bordered
                        className={styles.table}
                        columns={handleColumns(columns)}
                        dataSource={fillData}
                        pagination={false}
                        scroll={{ x: 1500 }}
                    />
                </div>
                <VtxImport {...importProps}>{importError}</VtxImport>
            </FullScreenModal>
        )
    }
}

export default ADD;