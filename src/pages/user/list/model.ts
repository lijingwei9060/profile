import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { PaginationConfig } from 'antd/es/table';
import { addUser, queryUser, removeUser, updateUser } from './service';

export interface IUser {
  id: string;
  name: string;
  realName: string;
  mobile: string;
  email: string;
  password: string;
  createdAt: Date;
  status: boolean;
  role: {
    id: string;
    name: string;
    access: string;
  };
}
export interface IUserParam {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface IUserStateType {
  data: {
    list: IUser[];
    pagination: Partial<PaginationConfig>;
  };
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IUserStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: IUserStateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<IUserStateType>;
    //add: Reducer<IUserStateType>;
    updateUser: Reducer<IUserStateType>;
  };
}

const Model: ModelType = {
  namespace: 'um',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'updateUser',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateUser(state, action) {
      return {
        ...state,
        data: {
          list: state!.data.list.map(item => {
            if (item.id === action.payload.id) {
              return <IUser>action.payload;
            } else {
              return item;
            }
          }),
          pagination: state!.data.pagination,
        },
      };
    },
  },
};

export default Model;
