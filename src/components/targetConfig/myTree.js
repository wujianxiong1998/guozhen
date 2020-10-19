/*
  Created by wujianxiong on 10/15/2020
*/

import React from 'react';
import { Tree, Input } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

export default class MyTree extends React.Component {
    state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    }

    getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    dataList = []
    
    generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        this.dataList.push({ key, title: node.title });
        if (node.children) {
          this.generateList(node.children, node.key);
        }
      }
    };
    

    onExpand = (expandedKeys) => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    }
    onChange = (e) => {
      this.generateList([this.props.dataSource]);
      const value = e.target.value;
      const expandedKeys = this.dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, [this.props.dataSource]);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }

    onSelect = (selectedKeys, info) => {
      // businessUnitId, // 事业部
      // regionalCompanyId // 区域公司
      // waterFactoryId
      this.props.updateState({
        searchParams: {
          businessUnitId: '',
          regionalCompanyId: '',
          waterFactoryId: ''
        }
      });
      switch(info.node.props.pos.split('-').length) {
        case 2: this.props.getList();break;
        case 3: 
          this.props.updateState({
            searchParams: {
              businessUnitId: selectedKeys[0]
            }
          });
          this.props.getList();break;
        case 4: 
          this.props.updateState({
            searchParams: {
              regionalCompanyId: selectedKeys[0]
            }
          });
          this.props.getList();break;
        case 5: 
          this.props.updateState({
            searchParams: {
              waterFactoryId: selectedKeys[0]
            }
          });
          this.props.getList();break;
      }
    }
    
    render() {
        const { dataSource } = this.props;
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = data => data.map((item) => {
          const index = item.title.indexOf(searchValue);
          const beforeStr = item.title.substr(0, index);
          const afterStr = item.title.substr(index + searchValue.length);
          const title = index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : <span>{item.title}</span>;
          if (item.children) {
            return (
              <TreeNode key={item.key} title={title}>
                {!!item.children.length&&loop(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.key} title={title} />;
        });
        return (
            <div>
                <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={this.onChange} />
                <Tree
                  onSelect={this.onSelect}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                >
                  {dataSource.children && loop([dataSource])}
                </Tree>
            </div>
        );
    }
}