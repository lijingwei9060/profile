import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';

export interface WithID {
  id: string;
}

export interface IDTableProps<T extends WithID> extends TableProps<T> {
  data: {
    list: T[];
    pagination: TableProps<T>['pagination'];
  };
  selectedRows: T[];
  onSelectRow: (rows: any) => void;
}

interface IDTableState {
  selectedRowKeys: string[];
}

// --------每个服务不同的配置-------------------------

export interface Customer {
  id: string;
  name: string;
  desc: string;
  createdAt: Date;
}

export interface TablePagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: Customer[];
  pagination: Partial<TablePagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
