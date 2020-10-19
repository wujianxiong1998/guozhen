import React from 'react';
import { VtxModal, } from 'vtx-ui';
import { Upload, message, Button, Icon } from 'antd';

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
          errorList:info.file.response.data
        })
      }
  }
  render() {
    const { updateWindow, modalProps, contentProps} = this.props;
    
    let actionUrl = '/cloud/gzzhsw/api/cp/device/importExcel'
    const updateProps = {
        name: 'file',
        accept: '.xls',
        action: actionUrl,
        headers: {
          authorization: 'authorization-text',
        },
        
      };
      console.log(this.state.errorList)
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
                <div>{item.messages.map((i,cursor)=>{
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
