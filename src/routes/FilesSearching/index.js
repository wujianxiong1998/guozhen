/**
 * 档案检索
 * author : vtx sjb
 * createTime : 2019-6-13
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { VtxDatagrid, VtxDate } from 'vtx-ui';
import VtxGrid from './VtxGrid';
import { Input, Radio, Select, Button, Tag, Checkbox,Pagination,Icon,Spin } from 'antd';
const { VtxRangePicker } = VtxDate;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { CheckableTag } = Tag;
const CheckboxGroup = Checkbox.Group;
import { handleColumns } from '../../utils/tools';
import ViewItem from './view';
import styles from './style.less';

function FilesSearching({ dispatch, filesSearching }) {

    const { queryParams, viewItem, showSel, filesType, attFormat, typeSel,
        currentPage, pageSize, loading, dataSource, total
    } = filesSearching;
    const ParamsUpdateState = (obj) => {
        dispatch({
            type : 'filesSearching/updateState',
            payload : {
                queryParams: {
                    ...queryParams,
                    ...obj
                }
            }
        })
    };

    const updateState = (obj) => {
        dispatch({
            type : 'filesSearching/updateState',
            payload : {
                ...obj
            }
        })
    };

    // 更新表格数据
	const getList = () => {
        dispatch({type: 'filesSearching/updateState', payload: { currentPage: 1, pageSize: 10 }});
		dispatch({type : 'filesSearching/getList'});
	}

    // 查询
	const vtxGridParams = {
        // 题目选择
        titleProps: {
			value : queryParams.code,
			onChange(value) {
				ParamsUpdateState({
					code : value,
				});
				getList();
			},
			dropdownMatchSelectWidth : false,
			style : {
				width : '100%'
			},
			allowClear : true,
        },
        // 关键词
        keyWordProps: {
			value: queryParams.title,
            onChange(e) {
				ParamsUpdateState({title : e.target.value});
            },
            onPressEnter() {
				getList();
			},
        },

        // 时间段
        timeProps : {
			value : [queryParams.startTime, queryParams.endTime],
			onChange(date, dateString) {
				ParamsUpdateState({
					startTime : dateString[0],
                    endTime : dateString[1],
                    otherTime: ''
				})
				getList();
			},
			showTime : false,
			style : {
                width : '20%',
                marginLeft: '10px'
			},
        },
        // 时间
        timeSoltProps : {
			value : queryParams.otherTime,
			onChange(e) {
				ParamsUpdateState({
                    otherTime: e.target.value,
                    startTime : '',
                    endTime : '',
				})
				getList();
            },
            buttonStyle: "solid"
        },
        // 附件格式
        attFormat: {
            value: queryParams.annxFormat,
            onChange(e) {
                ParamsUpdateState({
                    annxFormat : e,
                })
                if (e.length === attFormat.length) {
                    dispatch({
                        type : 'filesSearching/updateParamsItem',
                        payload: {
                            annxFormatAll: true
                        }
                    })
                }
                if (e.length === 0) {
                    dispatch({
                        type : 'filesSearching/updateParamsItem',
                        payload: {
                            annxFormatAll: false
                        }
                    })
                }
                getList();
            },
            options: attFormat.map(item => item.value)
        },

        // 文档类型
        fileType: {
            onChange(e) {
                ParamsUpdateState({
                    fileType : e,
                })
                if (e.length === typeSel.length) {
                    dispatch({
                        type : 'filesSearching/updateParamsItem',
                        payload: {
                            fileTypeAll: true
                        }
                    })
                }
                if (e.length === 0) {
                    dispatch({
                        type : 'filesSearching/updateParamsItem',
                        payload: {
                            fileTypeAll: false
                        }
                    })
                }
                getList();
            },
            value: queryParams.fileType,
            options: typeSel.map(item => item.value)
        },
        
        query() {
			getList();
		},

		clear() {
            dispatch({type : 'filesSearching/initQueryParams'});
            dispatch({type : 'filesSearching/loadType'}).then(() => {
                dispatch({type : 'filesSearching/getList'});
            })
			
        },
        
        choose() {
            dispatch({
                type : 'filesSearching/updateState',
                payload: {
                    showSel: true
                }
            });
        }
    };

    // 列表
	const columns = [
        ['文档类型', 'fileTypeStr'],
        ['归档日期', 'recordDate'],
        ['附件格式', 'annxFormat',{render:(text)=>{
            const arr = JSON.parse(text)
            return arr.join()
        }}],
        ['归档部门', 'actRepareMan'],
        ['归档人', 'maintainPeriodStr'],
	];
	let vtxDatagridProps = {
		columns : handleColumns(columns),
    	dataSource,
        indexColumn : true,
        indexTitle: '序号',
        startIndex : ( currentPage - 1 )*pageSize+1,
        autoFit:true,
        loading,
        onChange(pagination, filters, sorter){
            dispatch({
            	type:'filesSearching/getList',
            	payload : {
            		currentPage : pagination.current,
                	pageSize: pagination.pageSize
            	}
            }).then((status) => {
            	if(status) {
            		updateState({
		        		currentPage : pagination.current,
		                pageSize: pagination.pageSize
		        	})
            	}
            });
        },
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40','50'],
            showQuickJumper: true,
            current:currentPage,  //后端分页数据配置参数1
            total:total, //后端分页数据配置参数2
            pageSize, //后端分页数据配置参数3
            showTotal: total => `合计 ${total} 条`
        },
    };

    //--------------查看-----------------
    const updateViewWindow = (status = true) => {
        dispatch({
            type : 'filesSearching/updateViewItem',
            payload : {
                visible : status
            }
        })
    }
    const viewItemProps = {
        updateWindow : updateViewWindow,
        modalPropsItem:{
            title:`报警历史 > 查看`,
            visible: viewItem.visible,
            onCancel:() => updateViewWindow(false), 
            width:900
        },
        contentProps:{
            ...viewItem,
            btnType : 'view'
        }
    }

    const onCheckAllChangeAtt = (e) => {
        dispatch({
            type : 'filesSearching/updateParamsItem',
            payload: {
                annxFormatAll: !queryParams.annxFormatAll
            }
        })
        if (e.target.checked) {
            dispatch({
                type : 'filesSearching/updateParamsItem',
                payload: {
                    annxFormat: attFormat.map(item => item.value)
                }
            })
        } else {
            dispatch({
                type : 'filesSearching/updateParamsItem',
                payload: {
                    annxFormat: []
                }
            })
        }
        getList();
    
    }

    const onCheckAllChangeFile = (e) => {
        dispatch({
            type : 'filesSearching/updateParamsItem',
            payload: {
                fileTypeAll: !queryParams.fileTypeAll
            }
        })
        if (e.target.checked) {
            dispatch({
                type : 'filesSearching/updateParamsItem',
                payload: {
                    fileType: typeSel.map(item => item.value)
                }
            })
        } else {
            dispatch({
                type : 'filesSearching/updateParamsItem',
                payload: {
                    fileType: []
                }
            })
        }
        getList();
    
    }
    //下载文件
    const downLoadFile = (reqURL, paramName, paramVal) => {
        var formDom = document.createElement('form');
        formDom.style.display = 'none';
        formDom.setAttribute('target', '');
        formDom.setAttribute('method', 'post');
        formDom.setAttribute('action', reqURL);

        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', paramName);
        input.setAttribute('value', paramVal);

        document.body.appendChild(formDom);
        formDom.appendChild(input);
        formDom.submit();
        formDom.parentNode.removeChild(formDom);
    }

    return (
        <div className="main_page">
            <VtxGrid
                titles={['题目含']}
                gridweight={[4]}
                confirm={vtxGridParams.query}
                clear={vtxGridParams.clear}
                choose={vtxGridParams.choose}
            >
                {/*题目选择*/}
                {/* <Select {...vtxGridParams.titleProps}>
					{
						[{id: '1', name: '11'}, {id: '2', name: '22'}].map(item => {
							return <Option key={item.id}>{item.name}</Option>
						})
					}
				</Select> */}
                {/*关键字*/}
                <Input {...vtxGridParams.keyWordProps}/>
            </VtxGrid>
            {showSel?<div className={styles.handle_box}>
                <div className={styles.sel}>
                    <span className={styles.spanName}>文档类型 ：</span>
                    <div className={styles.radio}>
                        {/* <RadioGroup {...vtxGridParams.fileTypeM} buttonStyle="solid">
                            {filesType.map(item => <Radio.Button key={item.key} value={item.key}>{item.name}</Radio.Button>)}
                        </RadioGroup> */}
                        <Checkbox checked={queryParams.fileTypeAll} onChange={onCheckAllChangeFile}>{'全部'}</Checkbox>
                        <CheckboxGroup
                            // options={attFormat.map(item => item.value)}
                            {...vtxGridParams.fileType} 
                        />
                    </div>
                    
                </div>
                <div className={styles.sel}>
                    <span className={styles.spanName}>归档日期 ：</span>
                    <div className={styles.radio}>
                        <RadioGroup {...vtxGridParams.timeSoltProps} buttonStyle="solid">
                            {filesType.map(item => <Radio.Button key={item.key} value={item.key}>{item.name}</Radio.Button>)}
                        </RadioGroup>
                        
                    </div>
                    <VtxRangePicker {...vtxGridParams.timeProps}/>
                </div>
                <div className={styles.sel2}>
                    <span className={styles.spanName}>附件格式 ：</span>
                    <div className={styles.radio}>
                        {/* <RadioGroup {...vtxGridParams.fileTypeM} buttonStyle="solid">
                            {attFormat.map(item => <Radio.Button key={item.id} value={item.id}>{item.value}</Radio.Button>)}
                        </RadioGroup> */}
                        <Checkbox checked={queryParams.annxFormatAll} onChange={onCheckAllChangeAtt}>{'全部'}</Checkbox>
                        <CheckboxGroup
                            // options={attFormat.map(item => item.value)}
                            {...vtxGridParams.attFormat} 
                        />
                        
                    </div>
                </div>
            </div>:''}
            {showSel?<div className={styles.handle_bottom}>
                <Button type="primary" onClick={() => {
                    dispatch({
                        type: 'filesSearching/updateState',
                        payload: {
                            showSel: false
                        }
                    })
                }}>收起筛选条件</Button>
            </div>:''}
            <div className="table-wrapper" style={{marginTop: showSel?'210px':'58px'}}>
                
                <div style={{ height: showSel ? 'calc(100% - 192px)':'calc(100% - 40px)'}} className={styles.listContainer}>
                    <Spin spinning={loading}>
                {
                    dataSource.length?
                    dataSource.map((item,index)=>{
                        const arr = JSON.parse(item.annxFormat)
                        const annxArr = JSON.parse(item.annx)
                        const fileIdArr = annxArr.map(item => item.id)
                        return (
                            <div key={item.id} className={styles.singleLine}>
                                <div className={styles.title}>
                                    <span style={{marginRight:'20px',textDecoration:'normal'}}>{(currentPage - 1) * pageSize + index + 1}.</span>
                                    <span onClick={() => {
                                        downLoadFile('/vortex/rest/cloud/np/file/downloadBatch', 'parameters', JSON.stringify({
                                            fileName: item.title,
                                            ids: fileIdArr
                                        }))
                                    }} className={styles.text}>
                                    {item.title}
                                    </span>
                                </div>
                                <div className={styles.infoLine}>
                                    <div className={styles.item}>
                                        {item.fileTypeStr}
                                    </div>
                                    <div className={styles.splitLine} />
                                    <div className={styles.item}>
                                        归档日期：{item.recordDate}
                                    </div>
                                    <div className={styles.splitLine} />
                                    <div className={styles.item}>
                                        文件类型：{arr.join()}
                                    </div>
                                    <div className={styles.splitLine} />
                                    <div className={styles.item}>
                                        归档部门：{item.recordDepartment}
                                    </div>
                                    <div className={styles.splitLine} />
                                    <div className={styles.item}>
                                        归档人：{item.recordManName}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : <center style={{marginTop:'30px'}}><Icon type="frown-o" /> 暂无数据</center>
                }
                    </Spin>
                </div>
                
                <div className={styles.pagination}>
                    {
                        total > 0 ?
                            <Pagination
                                showQuickJumper
                                showTotal={(total, range) => `合计${total}条`}
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                showSizeChanger
                                onShowSizeChange={(page, pageSize)=>{
                                    dispatch({
                                        type: 'filesSearching/getList',
                                        payload: {
                                            currentPage: page,
                                            pageSize
                                        }
                                    }).then((status) => {
                                        if (status) {
                                            updateState({
                                                currentPage: page,
                                                pageSize
                                            })
                                        }
                                    });
                                }}
                                onChange={(page, pageSize) => {
                                    // t.updateState({
                                    //     currentPage: page,
                                    //     pageSize
                                    // })
                                    // t.getList()
                                    dispatch({
                                        type: 'filesSearching/getList',
                                        payload: {
                                            currentPage: page,
                                            pageSize
                                        }
                                    }).then((status) => {
                                        if (status) {
                                            updateState({
                                                currentPage: page,
                                                pageSize
                                            })
                                        }
                                    });
                            }} />
                            : ''

                    }

                </div>
                {/*<VtxDatagrid {...vtxDatagridProps} />*/}
            </div>
        </div>
    );

}
export default connect(({ filesSearching }) => ({ filesSearching }))(FilesSearching);