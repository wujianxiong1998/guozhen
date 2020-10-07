import React from 'react';

import { VtxModalList, VtxModal,  } from 'vtx-ui';
import { Button, Table, message, Input,Icon,Modal} from 'antd';
const TextArea = Input.TextArea

import moment from 'moment'
import FullScreenModal from '../FullScreenModal'
import styles from './index.less'
import { handleColumns } from '../../utils/tools';
class View extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        const { updateWindow, modalProps, contentProps } = this.props;
        const { dateValue, fillData, waterFactoryName, waterFactoryId, auditMemo, dataType, dataStatus } = contentProps
        const { updateItem, updateChartItem,getChartData} = contentProps
        return (
            <FullScreenModal
                {...modalProps}
            >
                <VtxModalList>
                    
                </VtxModalList>

                <VtxModalList>
                   
                </VtxModalList>
            </FullScreenModal>
        )
    }
   
}

export default View;