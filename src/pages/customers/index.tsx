import { Button, Card, Dropdown, Icon, Menu, Table } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';

import { ColumnProps } from 'antd/es/table';
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
  state: TableListState = {
    selectedRows: [],
  };

  columns: ColumnProps<Customer>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customers/fetch',
    });
  }

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

  render() {
    const {
      customers: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;
    const menu = (
      <Menu selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary">
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <Table
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
