import React from 'react';

import { VtxModal, VtxModalList, VtxDate, VtxUpload } from 'vtx-ui';
const { VtxDatePicker,VtxRangePicker } = VtxDate;
import { Button, Input, Select,InputNumber,Upload,Icon, message } from 'antd';
import {VtxUtil} from '../../utils/util';
import styles from './index.less';
import PublicModal from '../../components/publicModal/index'

const Option = Select.Option;

class ADD extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
            historyModalVisible: false
        };
	}

    modalListRef = ref => this.modalList = ref;

    footerRender() {
        const { contentProps, updateWindow } = this.props;
        const { loading, save } = contentProps;
        const _t = this;
        return [
            <Button key='submit' type='primary' size='large'
                loading={loading}
                onClick={()=>{
                    _t.modalList.submit().then((state) => {
                        state && save(); // 保存事件
                    })
                }
            }>保存</Button>
        ]
    }
    // 上传
    handleChange = (name, info) => {
        // ('科研及批复', 'research')
        // ('环评及批复', 'envAssessment')
        // ('环保验收资料', 'acceptance')
        const { updateItem } = this.props.contentProps
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
          if(info.file.status === 'done') {
                switch(name) {
                    case 'research':
                        updateItem({
                            research: info.file.name
                        });break;
                    case 'envAssessment':
                        updateItem({
                            envAssessment: info.file.name
                        });break;
                    case 'acceptance':
                        updateItem({
                            acceptance: info.file.name
                        });break;
                }
            
          }
        }
        if(info.file.response) {
            info.file.response.result===1?message.error(info.file.response.msg):message.success(info.file.response.msg)
        }
    }

    render() {
        const { dispatch, modalProps, contentProps } = this.props;
        const {
            id, businessUnitId,regionalCompanyId,
            endDate, endDateBuild, endDateSure, fileListVersion, acceptance, acceptanceTime, 
            businessUnitName, constructionTime, constructionUnit, designUnit, envAssessment, investment, operationTime,
            waterFactoryNameSelect,
            regionalCompanyName, research, waterFactoryName, waterFactoryId,businessUnitIdSelect,regionalCompanyIdSelect
        } = contentProps;
        const { historyModalVisible } = this.state;

        const { updateItem } = contentProps;
        const searchHistory = () => {
            this.setState({ historyModalVisible: true })
        }
        const updateProps = {
            name: 'file',
            accept: '.xls',
            action: '/cloud/gzzhsw/api/cp/basic/0neFactoryOneGear/importExcel'+'?tenantId='+VtxUtil.getUrlParam('tenantId'),
            headers: {
              authorization: 'authorization-text',
            },
            
          };
        return (
            <div>
                <VtxModal
                    {...modalProps}
                    footer={this.footerRender()}
                >
                    <div className={styles.modalContainer}>
                        <VtxModalList
                            isRequired
                            visible={modalProps.visible}
                            ref={this.modalListRef}
                        >
                            <PublicModal title={'水厂信息'}></PublicModal>
                            <Select
                                value={businessUnitId}
                                onChange={(value,option) => {                                
                                    updateItem({
                                        // option.props.unitId
                                        businessUnitId: value
                                    })
                                }}
                                placeholder="请选择事业部（必选项）"
                                // allowClear
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '事业部',
                                        width: '100',
                                        key: 'businessUnitId'
                                    },
                                    regexp: {
                                        value: businessUnitId
                                    }
                                }}
                            >
                                {businessUnitIdSelect.map(item => {
                                    return <Option unitId={item.parentId} key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                            <Select
                                value={regionalCompanyId}
                                onChange={(value,option) => {                                
                                    updateItem({
                                        regionalCompanyId:value
                                    })
                                }}
                                placeholder="请选择区域公司（必选项）"
                                // allowClear
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '区域公司',
                                        width: '100',
                                        key: 'regionalCompanyId'
                                    },
                                    regexp: {
                                        value: regionalCompanyId
                                    }
                                }}
                            >
                                {regionalCompanyIdSelect.map(item => {
                                    return <Option unitId={item.parentId} key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                            <Select
                                value={waterFactoryName}
                                onSelect={(value,option) => {   
                                    updateItem({
                                        waterFactoryName: value,
                                        waterFactoryId: option.props.eventKey
                                    })
                                }}
                                placeholder="请选择水厂名称（必选项）"
                                // allowClear
                                data-modallist={{
                                    layout: {
                                        comType: 'input',
                                        require: true,
                                        name: '水厂名称',
                                        width: '100',
                                        key: 'waterFactoryName'
                                    },
                                    regexp: {
                                        value: waterFactoryName,
                                        repete: {
                                            url: '/cloud/gzzhsw/api/cp/basic/0neFactoryOneGear/check.smvc',
                                            key: {
                                                tenantId: '35163d2c58a140cd8d6770262683178b',
                                                id,
                                                paramCode: 'waterFactoryId',
                                                paramValue: waterFactoryName
                                            }
                                        }
                                    }
                                }}
                            >
                                {waterFactoryNameSelect.map(item => {
                                    return <Option unitId={item.parentId} key={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        {/* second part */}
                            <PublicModal title={'前期资料'}></PublicModal>
                            <div 
                                data-modallist={{
                                    layout: {
                                        name: '科研及批复',
                                        require: false,
                                        width: '100',
                                    }
                            }}>
                                <Upload {...updateProps} onChange={this.handleChange.bind(this, 'research')}>
                                    <Button>
                                    <Icon type="upload" /> 上传
                                    </Button>
                                </Upload>
                            </div>

                            <div 
                                data-modallist={{
                                    layout: {
                                        name: '环评及批复',
                                        require: false,
                                        width: '100',
                                    }
                            }}>
                                <Upload {...updateProps} onChange={this.handleChange.bind(this, 'envAssessment')}>
                                    <Button>
                                    <Icon type="upload" /> 上传
                                    </Button>
                                </Upload>
                            </div>

                            <div 
                                data-modallist={{
                                    layout: {
                                        name: '环保验收资料',
                                        require: false,
                                        width: '100',
                                    }
                            }}>
                                <Upload {...updateProps} onChange={this.handleChange.bind(this, 'acceptance')}>
                                    <Button>
                                    <Icon type="upload" /> 上传
                                    </Button>
                                </Upload>
                            </div>
                            {/* <VtxUpload
                                {...uploadProps('科研及批复', 'research', research)}
                            />*/}

                        {/* third part */}
                            <PublicModal title={'基本情况'}></PublicModal>
                            <Input
                                value={investment}
                                onChange={(e) => {
                                    updateItem({
                                        investment : e.target.value
                                    })
                                }}
                                placeholder="请输入项目总投资"
                                maxLength="32"
                                data-modallist={{
                                    layout:{
                                        comType: 'input',
                                        require: false,
                                        name: '项目总投资',
                                        width: '100',
                                        key: 'investment'
                                    },
                                    regexp : {
                                        value : investment,
                                        exp: (val) => { if (/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(val)) { return true } else { return false } }
                                    }
                                }}
                            />
                            <Input
                                value={designUnit}
                                onChange={(e) => {
                                    updateItem({
                                        designUnit : e.target.value
                                    })
                                }}
                                placeholder="请输入设计单位"
                                maxLength="32"
                                data-modallist={{
                                    layout:{
                                        comType: 'input',
                                        require: false,
                                        name: '设计单位',
                                        width: '100',
                                        key: 'designUnit'
                                    },
                                    regexp : {
                                        value : designUnit,
                                    }
                                }}/>
                            <Input
                                value={constructionUnit}
                                onChange={(e) => {
                                    updateItem({
                                        constructionUnit : e.target.value
                                    })
                                }}
                                placeholder="请输入建设单位"
                                maxLength="32"
                                data-modallist={{
                                    layout:{
                                        comType: 'input',
                                        require: false,
                                        name: '建设单位',
                                        width: '100',
                                        key: 'constructionUnit'
                                    },
                                    regexp : {
                                        value : constructionUnit,
                                    }
                                }}/>
                            <VtxRangePicker
                                value={[constructionTime,endDateBuild]}
                                onChange={(date,dateString)=>{
                                    updateItem({
                                        constructionTime: dateString[0],
                                        endDateBuild:dateString[1]
                                    });
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: '',
                                        require: false,
                                        name: '建设时间',
                                        width: '100',
                                        key: 'constructionTime'
                                    },
                                    regexp: {
                                        value: constructionTime
                                    }
                                }}/>
                            <VtxRangePicker
                                value={[acceptanceTime,endDateSure]}
                                onChange={(date,dateString)=>{
                                    updateItem({
                                        acceptanceTime: dateString[0],
                                        endDateSure:dateString[1]
                                    });
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: '',
                                        require: false,
                                        name: '环保验收时间',
                                        width: '100',
                                        key: 'acceptanceTime'
                                    },
                                    regexp: {
                                        value: acceptanceTime
                                    }
                                }}/>
                            <VtxRangePicker
                                value={[operationTime,endDate]}
                                onChange={(date,dateString)=>{
                                    updateItem({
                                        operationTime: dateString[0],
                                        endDate:dateString[1]
                                    });
                                }}
                                data-modallist={{
                                    layout: {
                                        comType: '',
                                        require: false,
                                        name: '投运时间',
                                        width: '100',
                                        key: 'operationTime'
                                    },
                                    regexp: {
                                        value: operationTime
                                    }
                                }}/>
                        </VtxModalList>
                    </div>
                        
                </VtxModal>
            </div>
        )
    }
}

export default ADD;