import React from 'react';
import { Input, Button, Select } from 'antd';
import { VtxModal, VtxModalList, VtxDatagrid } from 'vtx-ui';
const Option = Select.Option;
import { handleColumns } from '../../utils/tools';
import styles from './styles.less';

class AddPDItem extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let { modalPropsItem, contentProps, updateWindow, DataSource, addCurrentPage, addPageSize, addLoading, addTotal, addSelectedRowKeys, projectOrDevice } = this.props;
        let { title, visible, onCancel, width } = modalPropsItem;
        let { onSave, changeRow, changePageSize, modelLonding } = contentProps;

        let modalProps = {
            title: title,
            visible: visible,
            footer: <div>
                <Button type='default' onClick={onCancel}>取消</Button>
                <Button type='primary' loading={modelLonding} onClick={() => {
                    onSave();
                }}>确定</Button>
            </div>,
            onCancel: onCancel,
            width: width
        };

        let modallistProps = {
            visible: visible,
            isRequired: true,
        };

    // 列表
	const columns = [
        ['设备等级', 'code'],
        ['设备名称', 'name'],
    ];
    const columns2 = [
        ['设备名称', 'name'],
        ['安装位置', 'structuresName'],
	];
	let vtxDatagridProps = {
		columns : projectOrDevice === '1'?handleColumns(columns):handleColumns(columns2),
    	dataSource: DataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( addCurrentPage - 1 )*addPageSize+1,
        autoFit:true,
        // headFootHeight : 150,
        rowSelection: {
            type: 'checkbox',
            selectedRowKeys: addSelectedRowKeys,
            onChange(selectedRowKeys) {
            	changeRow(selectedRowKeys);
            }
        },
        loading: addLoading,
        onChange(pagination, filters, sorter){
            changePageSize(pagination);
        },
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:addCurrentPage,  //后端分页数据配置参数1
            total:addTotal, //后端分页数据配置参数2
            pageSize: addPageSize, //后端分页数据配置参数3
            showTotal: addTotal => `合计 ${addTotal} 条`
        },
    };

       
        
        return (
            <VtxModal {...modalProps}>
                <div style={{ height: document.documentElement.clientHeight - 350 }} >
                    <VtxDatagrid {...vtxDatagridProps}/>
                </div>
            </VtxModal>
        )
    }
}

export default AddPDItem;