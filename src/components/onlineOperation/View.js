import React from 'react';
import { VtxModalList, VtxModal } from 'vtx-ui';
import styles from './index.less';
import Title from '../../components/publicModal'
import VtxDatagrid from 'vtx-ui/lib/VtxDatagrid';

class View extends React.Component {
    render() {
        // 获取父组件的内容参数
        const { modalProps, contentProps } = this.props;
        const { } = contentProps;
        // 配置表格

        const inColumns = [
            { dataIndex: "a", key: "a", title: "设备基础信息" },
            { dataIndex: "b", key: "b", title: "数采仪" },
            { dataIndex: "c", key: "c", title: "流量" },
            { dataIndex: "d", key: "d", title: "ph" },
            { dataIndex: "e", key: "e", title: "COD" },
            { dataIndex: "f", key: "f", title: "氨氮" },
            { dataIndex: "g", key: "g", title: "总磷" },
            { dataIndex: "h", key: "h", title: "总氮" },
            { dataIndex: "i", key: "i", title: "温度" },
        ]
        const dataSource = [
            { a: '设备品牌', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: ''},
            { a: '设备型号', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: ''},
            { a: '验收时间', b: '', c: '', d: '', e: '', f: '', g: '', h: '', i: ''},
        ]
        const outColumns = [
            {
                dataIndex: "a",
                key: "a",
                title: "设备基础信息"
            },
            {
                dataIndex: "c",
                key: "c",
                title: "流量"
            },
            {
                dataIndex: "d",
                key: "d",
                title: "ph"
            },
            {
                dataIndex: "e",
                key: "e",
                title: "COD"
            },
            {
                dataIndex: "f",
                key: "f",
                title: "氨氮"
            },
            {
                dataIndex: "g",
                key: "g",
                title: "总磷"
            },
            {
                dataIndex: "h",
                key: "h",
                title: "总氮"
            },
            {
                dataIndex: "i",
                key: "i",
                title: "温度"
            },
        ]
        const inVtxDatagridProps = {
            columns: inColumns,
            dataSource,
            indexColumn: false,
            autoFit: false,
            pagination: false,
        }
        const outVtxDatagridProps = {
            columns: outColumns,
            dataSource,
            indexColumn: false,
            autoFit: false,
            pagination: false,
        }

        return (
            <VtxModal {...modalProps}>
                <div className={styles.viewModalContainer}>
                    <VtxModalList>
                        <div data-modallist={{
                            layout: {type: 'text', name: '运营厂', width: 100, key: 'a'}
                        }}>{'a'}</div>
                    </VtxModalList>
    
                    <Title title='进水'></Title>
                    <VtxModalList>
                        <div data-modallist={{
                            layout: {width: 100}
                        }}>
                            <VtxDatagrid {...inVtxDatagridProps}/>
                        </div>
                    </VtxModalList>
    
                    <Title title='出水'></Title>
                    <VtxModalList>
                        <div data-modallist={{
                            layout: {width: 100}
                        }}>
                            <VtxDatagrid {...outVtxDatagridProps}/>
                        </div>
                    </VtxModalList>
                </div>
            </VtxModal>
        )
    }
}
export default View