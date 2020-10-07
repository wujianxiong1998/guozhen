import React from 'react';
import { Input, Button, Select } from 'antd';
import { VtxModal, VtxModalList, VtxDatagrid } from 'vtx-ui';
const Option = Select.Option;
import { handleColumns } from '../../utils/tools';
import styles from './styles.less';

class AddItem extends React.Component {
    constructor(props){
        super(props);
        this.lis1 = null;
    }

    render() {
        let { modalPropsItem, contentProps, projectDataSource, selectedRowKeysP, deviceDataSource, selectedRowKeysD, deviceGrade } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { id, code, name, orderIndex,
            modelLonding, updateItem, onSave, selectedRowKeysPChange, selectedRowKeysDChange, addProject, addDevice, deleteProject, deleteDevice } = contentProps;

        let modalProps = {
            title: id?`${title} > 编辑`:`${title} > 新增`,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    onSave();
                }}>保存</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };

        // 项目列表
        const columnsProject = [
            ['项目名称', 'name'],
            ['操作', 'action', { renderButtons : (text, record) => {
                let btns = [];            
                btns.push({
                    name:'删除',
                    onClick(rowData) {
                        let newData = projectDataSource.filter(item => item.id !== rowData.id);
                        deleteProject(rowData);
                        // dispatch({
                        //     type: 'patrolStandard/updateState',
                        //     payload: {
                        //         projectDataSource: newData,
                        //     }
                        // });
                    }
                });
                return btns;
            }}]
        ];
        let vtxDatagridPropsP = {
            columns : handleColumns(columnsProject),
            dataSource: projectDataSource,
            indexColumn : true,
            indexTitle: '序号',
            autoFit:true,
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: selectedRowKeysP,
                onChange(RowKeys) {
                    selectedRowKeysPChange(RowKeys);
                }
            },
            pagination: false,
        };

        // 设备列表
        const columnsDevice = [
            ['设备名称', 'name'],
            ['安装位置', 'structuresName'],
            ['操作', 'action', { renderButtons : (text, record) => {
                let btns = [];            
                btns.push({
                    name:'删除',
                    onClick(rowData) {
                        let newData = deviceDataSource.filter(item => item.id !== rowData.id);
                        deleteDevice(rowData);
                        // dispatch({
                        //     type: 'patrolStandard/updateState',
                        //     payload: {
                        //         projectDataSource: newData,
                        //     }
                        // });
                    }
                });
                return btns;
            }}]
        ];
        let vtxDatagridPropsD = {
            columns : handleColumns(columnsDevice),
            dataSource: deviceDataSource,
            indexColumn : true,
            indexTitle: '序号',
            autoFit:true,
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys: selectedRowKeysD,
                onChange(RowKeys) {
                    selectedRowKeysDChange(RowKeys);
                }
            },
            pagination: false,
        };
        
        return (
            <VtxModal {...modalProps}>
                <VtxModalList {...modallistProps}>
                    <Select
                        value={code}
                        data-modallist={{
                            layout: {width: 51,name: '设备等级',require: true},
                            regexp: {
                                value: code
                            }
                        }}
                        style={{display: 'inline-block', width: '50%'}}
                        onChange={(value)=>{
                            updateItem({
                                code: value
                            }); 
                        }}
                    >
                        {
                            deviceGrade.map(item => {
                                return <Option key={item.value}>{item.text}</Option>
                            })
                        }
                    </Select>
                    <div
                        data-modallist={{
                            layout: {width: 50,name: '巡检项目',require: false},
                        }}
                        style={{display: 'inline-block', width: '50%'}}
                    >
                        <Button type='primary' onClick={addProject}>添加项目</Button>
                    </div>
                    <div
                        data-modallist={{
                            layout: {width: 50,name: '巡检设备',require: false},
                        }}
                        style={{display: 'inline-block', width: '30%'}}
                    >
                        <Button type='primary' onClick={addDevice}>添加设备</Button>
                    </div>
                </VtxModalList>
                <div className={styles.layout}>
                    <div className={styles.left} style={{ height: document.documentElement.clientHeight - 400 }}>
                        <VtxDatagrid {...vtxDatagridPropsP}/>
                    </div>
                    <div className={styles.right} style={{ height: document.documentElement.clientHeight - 400 }}>
                        <VtxDatagrid {...vtxDatagridPropsD}/>
                    </div>
                </div>
            </VtxModal>
        )
    }
}

export default AddItem;