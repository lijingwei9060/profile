import { Button, Card, Icon, Table, Input, Divider } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';

import { ColumnProps, FilterDropdownProps } from 'antd/es/table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';

import { Customer, TablePagination, TableListParams } from './data';

import styles from './style.less';

const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  customers: StateType;
}

interface TableListState {
  selectedRows: Customer[];
  searchText: string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    customers,
    loading,
  }: {
    customers: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    customers,
    loading: loading.models.customers,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  private searchInput: any;
  private columns: ColumnProps<Customer>[];
  private filterSet: Map<string, FilterDropdownProps>;

  constructor(props: TableListProps) {
    super(props);
    this.searchInput = React.createRef();
    this.filterSet = new Map();
    this.state = {
      selectedRows: [],
      searchText: '',
    };

    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        ...this.getColumeSearchProps('name'),
      },
      {
        title: '描述',
        dataIndex: 'desc',
        ...this.getColumeSearchProps('desc'),
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
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
            <Divider type="vertical" />
            <a href="">统计</a>
          </Fragment>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customers/fetch',
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

    onFilter: (value: string, record: Customer) =>
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
    pagination: Partial<TablePagination>,
    filtersArg: Record<keyof Customer, string[]>,
    sorter: SorterResult<Customer>,
  ) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customers/fetch',
      payload: params,
    });
  };

  handleSelectRows = (rows: Customer[]) => {
    this.setState({
      selectedRows: rows,
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

  render() {
    const {
      customers: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary">
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
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
