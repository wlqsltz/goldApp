import {Model, Effect, SubscriptionsMapObject} from 'dva-core-ts';
import {Reducer} from 'redux';
import {getUpdateConfigs} from '@/api/public';

interface IUpgrade {
  begin_flag: string;
  version: string;
  note_text: string;
}

export interface UpgradeState {
  config?: IUpgrade;
  loaded: boolean;
}

export interface UpgradeModel extends Model {
  namespace: 'upgrade';
  state: UpgradeState;
  effects: {
    getConfig: Effect;
  };
  reducers: {
    setState: Reducer<UpgradeState>;
  };
  subscriptions: SubscriptionsMapObject;
}

const initialState = {
  config: undefined,
  loaded: false,
};

/**
 * 登录模块的model
 */
const upgradeModel: UpgradeModel = {
  namespace: 'upgrade',
  state: initialState,
  reducers: {
    setState(state, {payload}) {
      const newState = {
        ...state,
        ...payload,
      };
      return newState;
    },
  },
  effects: {
    *getConfig(_, {put, call}) {
      try {
        const config = yield call(getUpdateConfigs);
        yield put({
          type: 'setState',
          payload: {
            config,
            loaded: true,
          },
        });
      } catch (error) {
        console.log('获取服务器是否在升级失败', error);
        yield put({
          type: 'setState',
          payload: {
            loaded: true,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({dispatch}) {
      // dispatch({type: 'getConfig'});
    },
  },
};

export default upgradeModel;
