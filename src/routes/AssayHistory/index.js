/**
 * 化验数据填报历史
 * author : vtx xxy
 * createTime : 2019-06-03 16:47:50
 */
import React from 'react';
import { connect } from 'dva';

import { VtxDatagrid, VtxGrid, VtxDate, } from 'vtx-ui';
import { Icon, Select } from 'antd';
const Option = Select.Option;
const VtxRangePicker = VtxDate.VtxRangePicker;

import { handleColumns } from '../../utils/tools';
import { VtxUtil } from '../../utils/util';
import styles from './index.less';

class AssayHistory extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'assayHistory/loadWaterFactorySelect' }).then(() => {
            dispatch({ type: 'assayHistory/getList' });
        });
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    render() {
        const { dispatch } = this.props;
        const {
            searchParams, waterFactorySelect,
            loading, dataSource, title
        } = this.props.assayHistory;

        const updateState = (obj) => {
            dispatch({
                type: 'assayHistory/updateState',
                payload: {
                    ...obj
                }
            })
        }

        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'assayHistory/updateQueryParams' });
            dispatch({ type: 'assayHistory/getList' });
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

            // 开始时间
            dateProps: {
                value: [searchParams.startTime, searchParams.endTime],
                placeholder: '请选择时间',
                disabledDate: this.disabledDate,
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            startTime: dateString[0],
                            endTime: dateString[1]
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
                dispatch({ type: 'assayHistory/initQueryParams' });
                dispatch({ type: 'assayHistory/getList' });
            }
        };

        // 列表
        const columns =title.map(item=>{return [item,item==='时间'?'dateValue':item]});
        let vtxDatagridProps = {
            columns: handleColumns(columns),
            dataSource,
            indexColumn: true,
            startIndex: 1,
            autoFit: true,
            loading,
            pagination: false,
        };


        return (
            <div className={styles.normal}>
                <div className={styles.normal_body}>
                    <VtxGrid
                        titles={['水厂', '日期']}
                        gridweight={[1, 2]}
                        confirm={vtxGridParams.query}
                        hiddenclearButtion
                    // clear={vtxGridParams.clear}
                    >
                        <Select {...vtxGridParams.waterFactoryIdProps}>
                            {waterFactorySelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                        <VtxRangePicker {...vtxGridParams.dateProps} />
                    </VtxGrid>
                    {
                        VtxUtil.getUrlParam('hasBack') ?
                            <div onClick={() => { window.history.back() }} className={styles.closeBtn}><Icon type='close' /></div>
                            : ''
                    }
                    <div className={styles.tableContainer}>
                        <VtxDatagrid {...vtxDatagridProps} />
                    </div>
                </div>
            </div>
        )
    }

}

export default connect(
    ({ assayHistory }) => ({ assayHistory })
)(AssayHistory);