import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fetchById } from '../service';
import { CustomerFormStateType } from '../data';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: CustomerFormStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: CustomerFormStateType;
  effects: {
    submitAdvancedForm: Effect;
    fetchById: Effect;
  };

  reducers: {
    save: Reducer<CustomerFormStateType>;
  };
}

const Model: ModelType = {
  namespace: 'customerforms',

  state: {
    data: {
      customer: { name: 'dsjifjwiefjwief', desc: 'jdifjwiefjiwef', channel: 'jinrong' },
    },
  },

  effects: {
    *submitAdvancedForm({ payload }, { call }) {
      message.success('提交成功');
    },
    *fetchById({ payload, callback }, { call, put }) {
      const response = yield call(fetchById, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
