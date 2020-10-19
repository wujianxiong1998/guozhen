import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { VtxModal, } from 'vtx-ui';
import { Upload, message, Button, Icon } from 'antd';
import {VtxUtil} from '../../utils/util'
export default class Update extends React.Component {
  state = {
    errorList: []
  }
  handleChange = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if(info.file.response) {
        info.file.response.result===1?message.error(info.file.response.msg):message.success(info.file.response.msg)
        this.setState({
          errorList:info.file.response.data || []
        })
      }
  }
  render() {
    const { updateWindow, modalProps, contentProps} = this.props;
    const { dataType } = contentProps
    
    let actionUrl = dataType==='produce'?'/cloud/gzzhsw/api/cp/water/sewageDischargePermission/importExcel':'/cloud/gzzhsw/api/cp/water/sewageDischargeReport/importExcel'
    const updateProps = {
      name: 'file',
      accept: '.xls',
      action: actionUrl+'?tenantId='+VtxUtil.getUrlParam('tenantId'),
      headers: {
        authorization: 'authorization-text',
      },
      
    };
    return (
        <VtxModal
            {...modalProps}
            footer={[
            ]}
        >
            <Upload {...updateProps} onChange={this.handleChange}>
                <Button>
                <Icon type="upload" /> 上传文件
                </Button>
            </Upload>
            <div style={{borderBottom: '1px solid #ddd', margin: '10px 0'}}></div>
            {this.state.errorList.length!==0&&<div style={{margin: '10px 0', fontSize: '14px', color: 'black'}}>上传错误提示：</div>}
            {this.state.errorList.map((item,index)=>{
              return (<div key={index}>
                <div>{item.messages.map((i, cursor)=>{
                  return(
                    <div key={cursor} style={{margin: '5px'}}>{i}</div>
                  )
                })}</div>
              </div>)
            })}
        </VtxModal>
    )
  }
    
}
