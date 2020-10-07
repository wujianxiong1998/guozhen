import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import styles from './reportUtil.less';

const Report = ({
    iframeSrc,rows
}) =>{
  return (
    <div className={styles.iframeParent} style={{top: (rows || 1)*50  +'px'}}>
        <iframe className={styles.iframe + ' wrapper'} src={iframeSrc} width="100%" height="100%"></iframe> 
    </div>
  );
}
export default Report;
