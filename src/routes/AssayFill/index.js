/**
 * 生产数据填报
 * author : vtx xxy
 * createTime : 2019-06-03 16:47:50
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, VtxImport } from 'vtx-ui';
import { Modal, Button, message, Input, Select } from 'antd';
const Option = Select.Option;
const VtxDatePicker = VtxDate.VtxDatePicker;
import { VtxUtil,openImportView} from '../../utils/util';
import { handleColumns } from '../../utils/tools';
import styles from './index.less';

class AssayFill extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        const {dispatch}  = this.props;        
        dispatch({ type: 'assayFill/loadWaterFactorySelect' }).then(()=>{
            dispatch({ type: 'assayFill/getList' });
        });
    }
    //保存
    handleSave=()=>{
        this.props.dispatch({ type: "assayFill/calculateTargetValue" }).then(()=>{
            this.props.dispatch({
                type: 'assayFill/saveOrUpdate',
                payload: {
                    dataStatus: 0,
                    onSuccess: () => {
                        message.success('保存成功！')
                    },
                    onError: (msg) => {
                        message.error(msg)
                    }
                }
            })
        })
        
    }
    //保存并提交
    handleSubmit=()=>{
        this.props.dispatch({ type: "assayFill/calculateTargetValue" }).then(() => {
            this.props.dispatch({
                type: 'assayFill/saveOrUpdate',
                payload: {
                    dataStatus: 1,
                    onSuccess: () => {
                        message.success('保存并提交成功！')
                    },
                    onError: (msg) => {
                        message.error(msg)
                    }
                }
            })
        })
    }
    disabledDate(current) {
    // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    }
    jumpToHistory=()=>{
        this.props.history.push(`/assayHistory?tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}&hasBack=1`);

    }
    render(){
        const {dispatch} = this.props;
        const {
            searchParams, waterFactorySelect, waterFactoryName,
            loading, dataSource, showUploadModal, importError
        } = this.props.assayFill;

        const updateState = (obj) => {
            dispatch({
                type: 'assayFill/updateState',
                payload: {
                    ...obj
                }
            })
        }

        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'assayFill/updateQueryParams' });
            dispatch({ type: 'assayFill/getList' });
        }

        // 查询
        const vtxGridParams = {

            // 水厂
            waterFactoryIdProps: {
                value: searchParams.waterFactoryId,
                placeholder: "请选择水厂",
                showSearch: true,
                optionFilterProp: 'children',
                onChange(value) {
                    updateState({
                        searchParams: {
                            waterFactoryId: value
                        }
                    })
                    getList();
                },
                style: {
                    width: '100%'
                }
            },

            // 时间
            dateProps: {
                value: searchParams.dateValue,
                placeholder: '请选择时间',
                disabledDate:this.disabledDate,
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            dateValue: dateString
                        }
                    });
                    getList();
                },
                style: {
                    width: '100%'
                }
            },

            query() {
                getList();
            },

            clear() {
                dispatch({ type: 'assayFill/initQueryParams' });
                dispatch({ type: 'assayFill/getList' });
            }
        };

        // 列表
        const columns = [
            ['指标类型', 'typeName'],
            ['指标', 'name'],
            ['范围', 'rationalRange'],
            ['值', 'dataValue', {
                render: (text, record, index) => {
                    if (record.categoryKey ==='primitiveTarget'){
                        return <Input onBlur={() => { dispatch({ type:"assayFill/calculateTargetValue"})}} value={text} onChange={e => {
                            updateState({
                                dataSource: {
                                    [index]: {
                                        dataValue: e.target.value
                                    }
                                }
                            })
                        }} />
                    }else{
                        return text
                    }
                    
                }
            }],
            ['单位', 'unitName'],
            ['备注', 'dataMemo', {
                render: (text, record, index) => {
                    return <Input value={text} onChange={e => {
                        updateState({
                            dataSource: {
                                [index]: {
                                    dataMemo: e.target.value
                                }
                            }
                        })
                    }} />
                }
            }]
        ];
        let vtxDatagridProps = {
            columns: handleColumns(columns),
            dataSource,
            indexColumn: true,
            startIndex: 1,
            autoFit: true,
            loading,
            pagination: false,
        };

        let importProps = {
            templateURL: `/cloud/gzzhsw/api/cp/data/fill/exportExcel?waterFactoryId=${searchParams.waterFactoryId}&tenantId=${VtxUtil.getUrlParam('tenantId')}`,
            uploadURL: '/cloud/gzzhsw/api/cp/data/fill/importExcel',
            postData: {
                waterFactoryId: searchParams.waterFactoryId,
                dateValue: searchParams.dateValue,
                tenantId: VtxUtil.getUrlParam('tenantId'),
                dataFillType: 'assay',
            },
            visible: showUploadModal,
            close() {
                updateState({ showUploadModal: false });
            },
            afterUpload(data) {
                data = JSON.parse(data)
                if (data && data.result == 0 && 'data' in data && Array.isArray(data.data)) {
                    if (data.data.length>0){//导入失败
                        openImportView(data.data)
                        message.error('上传失败');
                    }else{
                        message.success('上传成功');

                        getList();
                        updateState({ showUploadModal: false });
                    }
                } else {
                    message.error(data.msg ? data.msg : '操作失败')
                }
            }
        }

        return (
            <div className={styles.normal}>
                <VtxGrid
                    titles={['水厂', '时间']}
                    gridweight={[1, 1]}
                    confirm={vtxGridParams.query}
                    hiddenclearButtion
                // clear={vtxGridParams.clear}
                >
                    <Select {...vtxGridParams.waterFactoryIdProps}>
                        {waterFactorySelect.map(item => {
                            return <Option key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <VtxDatePicker {...vtxGridParams.dateProps} />
                </VtxGrid>
                <div className={styles.normal_body}>
                    
                    <div className={styles.buttonContainer}>
                        <Button onClick={this.jumpToHistory}>填报历史</Button>
                        <Button icon="cloud-upload-o" onClick={() => {
                            updateState({ showUploadModal: true, importError: '' });
                        }}>上传</Button>
                       {/* <Button>模版下载</Button>*/}
                    </div>
                    <div className={styles.tableHeader}>
                        {searchParams.dateValue+waterFactoryName+'化验数据填报'}
                    </div>
                    <div style={{ borderBottom:dataSource.length ?'1px solid #c3c3c3':''}} className={styles.tableContainer}>
                        <VtxDatagrid {...vtxDatagridProps} />
                    </div>
                    {
                        dataSource.length?
                            <div className={styles.bottomButtonContainer}>
                                <Button size='large' loading={loading} onClick={()=>{this.handleSave()}}>保存</Button>
                                <Button size='large' loading={loading} onClick={()=>{this.handleSubmit()}} type='primary'>保存并提交</Button>
                            </div>
                        :''
                    }
                    
                </div>
                <VtxImport {...importProps}>{importError}</VtxImport>
            </div>
        )
    }
    
}

export default connect(
    ({ assayFill }) => ({ assayFill })
)(AssayFill);