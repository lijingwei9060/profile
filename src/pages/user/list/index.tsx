import { Button, Card, Icon, Table, Input, Divider, Tag, Modal } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';

import { ColumnProps, FilterDropdownProps, PaginationConfig } from 'antd/es/table';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';

import UserForm from './CreateForm';
import { IUser, IUserStateType, IUserParam } from './model';
import { queryRoles } from '../../../services/common';

import styles from './style.less';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  users: IUserStateType;
}

interface TableListState {
  user?: IUser;
  searchText: string;
  modalVisible: boolean;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    um,
    loading,
  }: {
    um: IUserStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    users: um,
    loading: loading.models.um,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  private searchInput: any;
  private columns: ColumnProps<IUser>[];
  private filterSet: Map<string, FilterDropdownProps>;
  private roles: { name: string; id: string }[];

  constructor(props: TableListProps) {
    super(props);
    this.searchInput = React.createRef();
    this.filterSet = new Map();
    this.state = {
      searchText: '',
      modalVisible: false,
    };
    this.roles = [];

    this.columns = [
      {
        title: '登录名',
        dataIndex: 'name',
        ...this.getColumeSearchProps('name'),
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        ...this.getColumeSearchProps('realName'),
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        ...this.getColumeSearchProps('mobile'),
      },
      {
        title: 'email',
        dataIndex: 'email',
      },
      {
        title: 'status',
        dataIndex: 'status',
        render: (val: boolean) =>
          val ? <Tag color="green">可以登录</Tag> : <Tag color="red">禁止登录</Tag>,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {record.status ? (
              <a onClick={() => this.showDisableConfirm(record)}>禁用</a>
            ) : (
              <a onClick={() => this.showDisableConfirm(record)}>启用</a>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.handleUpdate(record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.showDeleteConfirm(record)}>删除</a>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'um/fetch',
    });
    //获取roles
    queryRoles().then(res => {
      if (res && res.status === 'ok') {
        this.roles = res.data.list;
      }
    });
  }

  /**
   * @param string dataIndex
   */
  getColumeSearchProps = (dataIndex: string) => ({
    filterDropdown: (fd: FilterDropdownProps) => {
      this.filterSet.set(dataIndex, fd);
      return (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node: any) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={fd.selectedKeys![0]}
            onChange={e => fd.setSelectedKeys!(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(fd.selectedKeys, fd.confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          ></Input>
          <Button
            type="primary"
            onClick={() => this.handleSearch(fd.selectedKeys, fd.confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(fd.selectedKeys, fd.clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value: string, record: IUser) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  //显示确认登录框
  showDisableConfirm(record: IUser) {
    if (record.status) {
      //禁用
      Modal.confirm({
        title: `你想禁止${record.realName}登录吗？`,
        content: `你想禁止${record.realName}登录吗？`,
        onOk: () => this.disableUser(false, record),
      });
    } else {
      //启用
      Modal.confirm({
        title: `你想启用${record.realName}登录吗？`,
        content: `你想启用${record.realName}登录吗？`,
        onOk: () => this.disableUser(true, record),
      });
    }
  }

  /**
   * @param status true for allow, false for unallow
   * @param user which user to be disalbed
   */
  disableUser = (status: boolean, user: IUser) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'um/update',
      payload: { ...user, status: status },
    });
  };

  //显示删除确认框
  showDeleteConfirm(record: IUser) {
    //禁用
    Modal.confirm({
      title: `你想删除${record.realName}吗？`,
      content: `你想删除${record.realName}吗？`,
      onOk: () => this.deleteUser(record),
    });
  }

  deleteUser = (user: IUser) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'um/remove',
      payload: { ...user },
    });
  };

  handleSearch = (
    selectedKeys: FilterDropdownProps['selectedKeys'],
    confirm: FilterDropdownProps['confirm'],
  ) => {
    confirm!();
    this.setState({ searchText: selectedKeys![0] });
  };

  handleReset = (
    selectedKeys: FilterDropdownProps['selectedKeys'],
    clearFilters: FilterDropdownProps['clearFilters'],
  ) => {
    clearFilters!(selectedKeys!);
    this.setState({ searchText: '' });
  };

  handleStandardTableChange = (
    pagination: Partial<PaginationConfig>,
    filtersArg: Record<keyof IUser, string[]>,
    sorter: SorterResult<IUser>,
  ) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<IUserParam> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'um/fetch',
      payload: params,
    });
  };

  resetFilterSets = () => {
    this.filterSet.forEach(
      (fd: FilterDropdownProps, di: string, map: Map<string, FilterDropdownProps>) => {
        fd.clearFilters!(fd.selectedKeys!);
      },
    );
    this.filterSet.clear();
    this.setState({ searchText: '' });
  };

  //处理新增
  handleModalVisible = (flag?: boolean) => {
    this.setState({ user: undefined, modalVisible: !!flag });
  };
  handleAdd = (fieldsValue: { [key: string]: string }) => {
    const { dispatch } = this.props;
    if (fieldsValue['id']) {
      dispatch({
        type: 'um/update',
        payload: fieldsValue,
      });
    } else {
      dispatch({
        type: 'um/add',
        payload: fieldsValue,
      });
    }

    this.handleModalVisible();
  };

  //处理修改
  handleUpdate = (user: IUser) => {
    this.setState({ user: user, modalVisible: true });
  };
  render() {
    const {
      users: { data },
      loading,
    } = this.props;
    const { user, modalVisible } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <Button icon="sync" onClick={() => this.resetFilterSets()}>
                Reset Search
              </Button>
              <Button icon="setting">Setting columns</Button>
            </div>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={data.list}
              loading={loading}
              onChange={this.handleStandardTableChange}
              pagination={data.pagination}
            />
          </div>
        </Card>
        <UserForm
          user={user}
          roles={this.roles}
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          modalVisible={modalVisible}
        ></UserForm>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
