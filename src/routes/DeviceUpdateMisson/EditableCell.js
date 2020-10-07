import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import styles from './EditableCell.less';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles['editable-cell']}>
        {
          editable ?
            <div className={styles['editable-cell-input-wrapper']}>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className={styles['editable-cell-icon-check']}
                onClick={this.check}
              />
            </div>
            :
            <div className={styles['editable-cell-text-wrapper']}>
              {value || ' '}
              <Icon
                type="edit"
                className={styles['editable-cell-icon']}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

export default EditableCell;