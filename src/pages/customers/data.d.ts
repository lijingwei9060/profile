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
  id?: string;
  name: string;
  desc?: string;
  up?: string;
  url?: string;
  addr?: string;
  channel: string;
  createdAt?: Date;
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

export interface CustomerParams {
  id: string;
  name?: string;
  channel?: string;
}

export interface Contact {
  id?: string;
  name: string;
  cid: string;
  email?: string;
  phone?: string;
  title?: string;
  depart?: string;
  createdAt?: Date;
  status?: boolean;
}

export interface AppKey {
  id?: string;
  cid: string;
  name: string;
  secKey: string;
  to: Date;
  createdAt?: Date;
  status?: boolean;
}

export interface CustomerFormStateType {
  data: {
    customer?: Customer;
    contacts?: Contact[];
    appKeys?: AppKey[];
  };
}
