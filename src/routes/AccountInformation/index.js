import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {VtxDatagrid, VtxGrid, VtxExport} from "vtx-ui";
const { VtxExport2 } = VtxExport;
import {Input, Button, Modal, message, Select, Icon} from "antd";
import Detail from './Detail';
import {delPopconfirm} from "../../utils/util";
import {VtxUtil} from '../../utils/util';
import UpdateItem from '../../components/accountInformation/Update'

moment.locale('zh-cn');
const Option = Select.Option;

class AccountInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {dispatch, accountInformationM, accessControlM, loading, submitLoading, sparePartsLoading, repairListLoading, maintainListLoading} = this.props;
        const {waterFactoryList, equipmentStatus, equipmentTypes, gridParams, searchParams, dataList, dataTotal, delIds, modalParams, structureList, equipmentGrades, manufacturerList, equipmentSelectList, equipmentSelectTotal, sparePartsParams, technicalParameterParams, detailRepair, maintainRepair, copyContent} = accountInformationM;
        const {waterFactoryName, deviceStatus, code, name} = gridParams;
        const {page, size} = searchParams;
        const {type, visible, title, detail, isUpdate} = modalParams;
        
        let buttonLimit = {};
        if (accessControlM['accountInfo'.toLowerCase()]) {
            buttonLimit = accessControlM['accountInfo'.toLowerCase()]
        }
        //更改搜索条件
        const changeGridParams = (target, value) => {
            dispatch({
                type: 'accountInformationM/updateGridParams',
                payload: {
                    [target]: value
                }
            })
        };
        const changeSearchParams = (target, value) => {
            dispatch({
                type: 'accountInformationM/updateSearchParams',
                payload: {
                    [target]: value
                }
            })
        };
        //选择水厂
        const waterFactorySelect = {
            style: {width: '100%'},
            showSearch: true,
            value: waterFactoryName,
            onChange: (value) => {
                changeGridParams('waterFactoryName', value);
                changeGridParams('waterFactoryId', waterFactoryList.map(item => {
                        if (item.name === value) {
                            return item.id
                        }
                    }).filter(item => !!item)[0]
                );
                changeSearchParams('waterFactoryName', value);
                changeSearchParams('waterFactoryId', waterFactoryList.map(item => {
                        if (item.name === value) {
                            return item.id
                        }
                    }).filter(item => !!item)[0]
                );
                dispatch({type: 'accountInformationM/pageList'})
            }
        };
        //选择状态
        const statusSelect = {
            style: {width: '100%'},
            value: deviceStatus,
            onChange: (value) => {
                changeGridParams('deviceStatus', value);
                changeSearchParams('deviceStatus', value);
                dispatch({type: 'accountInformationM/pageList'})
            }
        };
        //列表配置
        const tableProps = {
            loading,
            columns: [{
                title: '设备编号',
                dataIndex: 'code',
                key: 'code',
                nowrap: true
            }, {
                title: '设备名称',
                dataIndex: 'name',
                key: 'name',
                nowrap: true
            }, {
                title: '设备类型',
                dataIndex: 'typeName',
                key: 'typeName',
                nowrap: true
            }, {
                title: '型号',
                dataIndex: 'modelNum',
                key: 'modelNum',
                nowrap: true
            }, {
                title: '安装位置',
                dataIndex: 'structuresName',
                key: 'structuresName',
                nowrap: true
            }, {
                title: '生产厂商',
                dataIndex: 'manufacturer',
                key: 'manufacturer',
                nowrap: true
            }, {
                title: '状态',
                dataIndex: 'deviceStatusStr',
                key: 'deviceStatusStr',
                nowrap: true
            }, {
                title: '操作',
                dataIndex: 'edit',
                key: 'edit',
                render: (text, rowData) => (
                    <span>
                        {buttonLimit['VIEW'] && <Icon type='view'
                                                      title='查看'
                                                      onClick={() => {
                                                          updateModalParams('type', 'view');
                                                          updateModalParams('title', '台账管理>查看');
                                                          dispatch({
                                                              type: 'accountInformationM/getDetail',
                                                              payload: {id: rowData.id}
                                                          })
                                                      }}/>}
                        {buttonLimit['EDIT'] && <span>
                            <span className="ant-divider"/>
                        <Icon type='file-edit'
                              title='编辑'
                              onClick={() => {
                                  updateModalParams('type', 'edit');
                                  updateModalParams('title', '台账管理>编辑');
                                  dispatch({type: 'accountInformationM/getDetail', payload: {id: rowData.id}})
                              }}/>
                        </span>}
                        {buttonLimit['DELETE'] && <span>
                            <span className="ant-divider"/>
                            {
                                delPopconfirm(() => dispatch({
                                    type: 'accountInformationM/deleteEntity',
                                    payload: {ids: rowData.id}
                                }))
                            }
                        </span>}
                    </span>
                )
            }],
            dataSource: dataList,
            rowKey: record => record.id,
            indexColumn: true,
            autoFit: true,
            scroll: {
                x: 1000,
            },
            startIndex: page * size + 1, //后端分页
            indexTitle: '序号',
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: page + 1,
                total: dataTotal,
                pageSize: size,
                // 当前页码改变的回调
                onChange(page, pageSize) {
                    changeSearchParams('page', page - 1);
                    changeSearchParams('size', pageSize);
                    dispatch({
                        type: 'accountInformationM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'accountInformationM/pageList'})
                },
                // size 变化的回调
                onShowSizeChange(current, size) {
                    changeSearchParams('page', current - 1);
                    changeSearchParams('size', size);
                    dispatch({
                        type: 'accountInformationM/updateState',
                        payload: {gridParams: {...gridParams, ...searchParams}}
                    });
                    dispatch({type: 'accountInformationM/pageList'})
                },
                showTotal: total => `合计 ${total} 条`
            },
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: delIds,
                onChange: (selectedRowKeys, selectedRows) => dispatch({
                    type: 'accountInformationM/updateState',
                    payload: {delIds: selectedRowKeys}
                })
            }
        };
        //新增或编辑
        const handle = (type) => {
            if(type==='update') {
                closeModal()
                return
            }
            const childForm = this.modalForm.getForm();
            childForm.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.warn("存在未填写或错误字段，无法提交");
                    return;
                }
                if (typeof(values.buyDate) !== 'string') {
                    values.buyDate = values.buyDate.format('YYYY-MM-DD')
                }
                if (typeof(values.installDate) !== 'string') {
                    values.installDate = values.installDate.format('YYYY-MM-DD')
                }
                if (typeof(values.operationDate) !== 'string') {
                    values.operationDate = values.operationDate.format('YYYY-MM-DD')
                }
                const method = type === 'add' && 'accountInformationM/addSave' || type === 'edit' && 'accountInformationM/addUpdate';
                const {sureRows} = sparePartsParams;
                const {technicalParameterList} = technicalParameterParams;
                const {fileIds} = detail;
                dispatch({
                    type: method,
                    payload: {
                        values: {
                            ...values,
                            sparePartIds: sureRows.map(item => item.id).join(','),
                            technicalParameters: technicalParameterList.length !== 0 ? JSON.stringify(technicalParameterList) : null,
                            fileIds
                        },
                        onComplete: () => closeModal()
                    }
                })
            })
        };
        //关闭模态框
        const closeModal = () => {
            dispatch({type: 'accountInformationM/clearModalParams'});
            dispatch({
                type: 'accountInformationM/updateState',
                payload: {
                    structureList: [],
                    manufacturerList: []
                }
            });
            if(type==='update') {
                return   
            }
            this.modalForm.getForm().resetFields();
        };
        //更改模态框相关配置
        const updateModalParams = (target, value) => {
            dispatch({
                type: 'accountInformationM/updateModalParams',
                payload: {
                    [target]: value
                }
            })
        };
        //模态框配置
        const modalProps = {
            visible,
            title,
            maskClosable: false,
            width: '100%',
            onCancel: () => closeModal()
        };
        //模态框内容配置
        const detailProps = {
            copyContent,
            waterFactoryList,
            detail,
            type,
            equipmentStatus,
            equipmentTypes,
            structureList,
            equipmentGrades,
            manufacturerList,
            checkName: (value, callback) => {
                if (value === detail.name || !value) {
                    callback();
                    return;
                }
                dispatch({
                    type: 'accountInformationM/nameExist',
                    payload: {
                        id: detail.id,
                        key: 'name',
                        value
                    }
                }).then((data) => {
                    if (!!data) {
                        callback()
                    } else {
                        callback('名称不能重复')
                    }
                });
            },
            getStructuresList: (value, callback) => dispatch({
                type: 'accountInformationM/getStructureList',
                payload: {waterFactoryId: value}
            }).then((data) => {
                if (callback) {
                    callback(data)
                }
            }),
            wrappedComponentRef: dom => this.modalForm = dom,
            equipmentSelectList,
            equipmentSelectTotal,
            getEquipmentList: (name, page, size) => {
                dispatch({type: 'accountInformationM/updateEquipmentSearchParams', payload: {name, page, size}});
                dispatch({type: 'accountInformationM/getEquipmentList'});
            },
            clearEquipmentList: () => {
                dispatch({type: 'accountInformationM/clearEquipmentSearchParams'});
                dispatch({type: 'accountInformationM/getEquipmentList'});
            },
            getManufacturerList: (value) => dispatch({
                type: 'accountInformationM/getManufacturerList',
                payload: {manufacturer: value}
            }),
            changeDetail: (target, value) => {
                dispatch({
                    type: 'accountInformationM/updateDetail',
                    payload: {
                        [target]: value
                    }
                })
            },
            sparePartsParams,
            updateSparePartsParams: (target, value) => {
                dispatch({
                    type: 'accountInformationM/updateSparePartsParams',
                    payload: {
                        [target]: value
                    }
                })
            },
            getSparePartsList: () => {
                dispatch({
                    type: 'accountInformationM/updateSparePartsParams',
                    payload: {
                        modalVisible: true
                    }
                });
                dispatch({type: 'accountInformationM/getSparePartsList'})
            },
            sparePartsLoading,
            technicalParameterParams,
            updateTechnicalParameterParams: (target, value) => {
                dispatch({
                    type: 'accountInformationM/updateTechnicalParameterParams',
                    payload: {
                        [target]: value
                    }
                })
            },
            changeParams: (target, value) => dispatch({
                type: 'accountInformationM/updateState',
                payload: {
                    [target]: value
                }
            }),
            changeTab: (key, id) => {
                switch (key) {
                    case 'repair':
                        dispatch({
                            type: 'accountInformationM/getRepairList',
                            payload: {
                                deviceId: id
                            }
                        });
                        break;
                    case 'maintain':
                        dispatch({
                            type: 'accountInformationM/getMaintainList',
                            payload: {
                                deviceId: id
                            }
                        });
                        break;
                }
            },
            detailRepair,
            repairListLoading,
            maintainRepair,
            maintainListLoading
        };
        // 导出
        const exportProps = {
            downloadURL: '/cloud/gzzhsw/api/cp/device/exportDataExcel',
            getExportParams(exportType) {
                const param = {
                    tenantId: VtxUtil.getUrlParam('tenantId'),
                };
                switch (exportType) {
                    case 'rows':
                        if (delIds.length === 0) {
                            message.info('需要选择一项进行导出');
                            return;
                        }
                        param.isAll = false;
                        param.ids = delIds.join();
                        break;
                    case 'page':
                        if (dataList.length === 0) {
                            message.info('当前页没有数据');
                            return;
                        }
                        const ids = dataList.map((item, index) => {
                            return item.id;
                        });
                        param.isAll = false;
                        param.ids = ids.join();
                        break;
                    case 'all':
                        if (dataTotal === 0) {
                            message.info('暂无数据可进行导出');
                            return;
                        }
                        param.isAll = true;
                }
                return param
            }
        }
        // 导入
        const updateItemProps = {
            modalProps: {
                title: `台账信息 > 上传`,
                visible: true,
                onCancel: () => updateModalParams('type', ''),
                width: 900,
                minHeight: 500
            }
        };
        const fileId = '32f60426b4a04bbea8fa424957ffbb28'
        return (
            <div className="main_page">
                <VtxGrid titles={['水厂名称', '设备编号', '设备名称', '设备状态']}
                         gridweight={[1, 1, 1, 1]}
                         confirm={() => {
                             dispatch({
                                 type: 'accountInformationM/updateState',
                                 payload: {searchParams: {...searchParams, ...gridParams}}
                             });
                             dispatch({type: 'accountInformationM/pageList'})
                         }}
                         clear={() => {
                             dispatch({type: 'accountInformationM/clearGridParams'});
                             dispatch({type: 'accountInformationM/clearSearchParams'});
                             dispatch({type: 'accountInformationM/pageList'})
                         }}>
                    <Select {...waterFactorySelect}>
                        {waterFactoryList.map(item => (
                            <Option value={item.name} key={item.name}>{item.name}</Option>
                        ))}
                    </Select>
                    <Input value={code}
                           onChange={(e) => changeGridParams('code', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'accountInformationM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'accountInformationM/pageList'})
                           }}
                    />
                    <Input value={name}
                           onChange={(e) => changeGridParams('name', e.target.value)}
                           onPressEnter={() => {
                               dispatch({
                                   type: 'accountInformationM/updateState',
                                   payload: {searchParams: {...searchParams, ...gridParams}}
                               });
                               dispatch({type: 'accountInformationM/pageList'})
                           }}
                    />
                    <Select {...statusSelect}>
                        {equipmentStatus.map(item => (
                            <Option value={item.value} key={item.value}>{item.text}</Option>
                        ))}
                    </Select>
                </VtxGrid>
                <div className="table-wrapper">
                    <div className="handle_box">
                        {buttonLimit['ADD'] && <Button icon="file-add" onClick={() => {
                                                           updateModalParams('type', 'add');
                                                           updateModalParams('visible', true);
                                                           updateModalParams('title', '台账管理>新增');
                                                       }}>新增</Button>}

                        {buttonLimit['DELETE'] && <Button icon="delete"
                                                          disabled={delIds.length === 0}
                                                          onClick={() => {
                                                              Modal.confirm({
                                                                  title: null,
                                                                  content: `确定删除此${delIds.length}条数据？`,
                                                                  onOk: () => dispatch({
                                                                      type: 'accountInformationM/deleteEntity',
                                                                      payload: {ids: delIds.join(',')}
                                                                  })
                                                              })
                                                          }}>删除</Button>}
                        
                        <Button icon='download' onClick={() => { window.open(`http://103.14.132.101:9391/cloudFile/common/downloadFile?id=${fileId}`) }}>模版下载</Button>
                        <Button icon="upload" onClick={() => {updateModalParams('type', 'update')}}>上传</Button>
                        <VtxExport2  {...exportProps}><Button icon="export">导出</Button></VtxExport2>

                    </div>
                    <div className='table-content'>
                        <VtxDatagrid {...tableProps} />
                    </div>
                </div>
                {!!visible && <Modal {...modalProps}
                                     className="bigModal"
                                     footer={type !== 'view' ? [
                                         <Button key='submit'
                                                 type='primary'
                                                 loading={submitLoading}
                                                 onClick={() => handle(type)}>保存</Button>
                                     ] : null}
                >
                    <Detail {...detailProps} handleDispatch={dispatch}/>
                </Modal>}
                {/*上传 */}
                {type==='update' && <UpdateItem {...updateItemProps} />}
            </div>
        );
    };
}

const accountInformationProps = (state) => {
    return {
        accountInformationM: state.accountInformationM,
        accessControlM: state.accessControlM,
        loading: state.loading.effects['accountInformationM/pageList'] || state.loading.effects['accountInformationM/loadWaterFactorySelect'] || state.loading.effects['accountInformationM/getDetail'],
        submitLoading: state.loading.effects['accountInformationM/addSave'] || state.loading.effects['accountInformationM/addUpdate'],
        sparePartsLoading: state.loading.effects['accountInformationM/getSparePartsList'],
        repairListLoading: state.loading.effects['accountInformationM/getRepairList'],
        maintainListLoading: state.loading.effects['accountInformationM/getMaintainList']
    };
};

export default connect(accountInformationProps)(AccountInformation);
