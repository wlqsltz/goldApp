import {RootState} from './index';
import {Model, Effect, SubscriptionsMapObject} from 'dva-core-ts';
import {Reducer} from 'redux';
import storage, {load} from '@/config/storage';
import {
  apiKeyListLoadData,
  editMobile,
  editTradePwd,
  getUserDetail,
  login,
  register,
  resetPwd,
} from '@/api/user';
import {API_KEY_INDEX, TOKEN, USER} from '@/config/storageTypes';
import {articlePublicPage, getSmsCaptcha, getSystemParams} from '@/api/public';

export interface UserState {
  user?: IUser;
  token?: string;
  apiKeyList?: IApiKey[]; // 用户绑定的APIkey列表
  apiKeyIndex: number; // 当前选择的APIkey下标
  inviteFlag: boolean; // 注册时邀请码是否必填
  userProtocol?: IArticle;
  loaded: boolean;
}

export interface UserModel extends Model {
  namespace: 'user';
  state: UserState;
  effects: {
    login: Effect; // 登录
    logout: Effect; // 退出登录
    getUserDetail: Effect; // 获取用户详情
    getExchangeApiKey: Effect; // 获取用户绑定的apiList
    updateExchangeApiKey: Effect; // 用户绑定或修改完的api后，更新apiList和user的apiKeyStatus字段
    changeApiKeyIndex: Effect; // 切换api
    registerInit: Effect; // 获取注册页面初始数据
    sendSmsCode: Effect; // 发送验证码
    register: Effect; // 注册
    resetPwd: Effect; // 重置密码
    editMobile: Effect; // 修改/设置 手机号
    editLoginPwd: Effect; // 修改登录密码
    editTradePwd: Effect; // 修改/设置 交易密码
    loadStorage: Effect; // 应用初始化从storage中加载缓存的数据
  };
  reducers: {
    setState: Reducer<UserState>;
  };
  subscriptions: SubscriptionsMapObject;
}

const initialState = {
  user: undefined,
  token: undefined,
  apiKeyList: undefined,
  apiKeyIndex: 0,
  inviteFlag: false,
  userProtocol: undefined,
  loaded: false,
};

/**
 * 登录模块的model
 */
const UserModel: UserModel = {
  namespace: 'user',
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
    *login({payload}, {call, put}) {
      const {token} = yield call(login, payload);
      yield storage.save({
        key: TOKEN,
        data: token,
      });
      yield put({
        type: 'setState',
        payload: {
          token,
        },
      });
      yield put({
        type: 'getUserDetail',
      });
      yield put({
        type: 'getExchangeApiKey',
      });
    },
    *getUserDetail(_, {call, put}) {
      const data = yield call(getUserDetail);
      yield storage.save({
        key: USER,
        data,
      });
      yield put({
        type: 'setState',
        payload: {
          user: data,
        },
      });
    },
    *getExchangeApiKey({callback}, {call, put}) {
      const data = yield call(apiKeyListLoadData);
      let list: IApiKey[] = [];
      if (Array.isArray(data)) {
        list = data.map(item => ({
          id: item.id,
          exchangeNo: item.exchangeNo,
          accessKey: item.accessKey,
          secretKey: item.secretKey,
          updateDatetime: item.updateDatetime,
          createDatetime: item.createDatetime,
        }));
      }
      yield put({
        type: 'setState',
        payload: {
          apiKeyList: list,
        },
      });
      callback?.();
    },
    *updateExchangeApiKey({callback}, {put}) {
      yield put({
        type: 'getExchangeApiKey',
      });
      yield put({
        type: 'getUserDetail',
      });
      callback?.();
    },
    *changeApiKeyIndex({payload}, {put}) {
      yield storage.save({
        key: API_KEY_INDEX,
        data: payload,
      });
      yield put({
        type: 'setState',
        payload: {
          apiKeyIndex: payload,
        },
      });
    },
    *registerInit(_, {call, put}) {
      const {invite_flag} = yield call(getSystemParams, 'invite_flag');
      const {list} = yield call(articlePublicPage, {title: '用户协议'});
      let userProtocol: IArticle | undefined;
      if (Array.isArray(list) && list.length) {
        userProtocol = list[0];
      }
      yield put({
        type: 'setState',
        payload: {
          inviteFlag: invite_flag === '1',
          userProtocol,
        },
      });
    },
    *sendSmsCode({payload, callback}, {call}) {
      try {
        yield call(getSmsCaptcha, payload);
        callback?.();
      } catch (error) {
        callback?.(error);
      }
    },
    *register({payload, callback}, {call, put}) {
      yield call(register, payload);
      callback?.();
      yield put({
        type: 'login',
        payload: {
          loginName: payload.mobile,
          loginPwd: payload.loginPwd,
        },
      });
    },
    *resetPwd({payload, callback}, {call, put}) {
      yield call(resetPwd, payload);
      callback?.();
      yield put({
        type: 'login',
        payload: {
          loginName: payload.mobile,
          loginPwd: payload.loginPwd,
        },
      });
    },
    *editLoginPwd({payload, callback}, {call, put, select}) {
      const {kind} = yield select((state: RootState) => state.user.user);
      yield call(resetPwd, {
        ...payload,
        userKind: kind,
      });
      callback?.();
    },
    *editMobile({payload, callback}, {call, put}) {
      yield call(editMobile, payload);
      yield put({
        type: 'getUserDetail',
      });
      callback?.();
    },
    *editTradePwd({payload, callback}, {call, put, select}) {
      const params: any = {
        tradePwd: payload.tradePwd,
        smsCaptcha: payload.smsCaptcha,
      };
      // 修改交易密码
      if (payload.pwdFlag) {
        const {userId} = yield select((state: RootState) => state.user.user);
        params.userId = userId;
      }
      yield call(editTradePwd, payload);
      callback?.();
    },
    *logout(_, {put}) {
      yield put({
        type: 'setState',
        payload: {
          user: undefined,
        },
      });
      storage.remove({
        key: USER,
      });
      storage.remove({
        key: TOKEN,
      });
      storage.remove({
        key: API_KEY_INDEX,
      });
    },
    *loadStorage(_, {put, call}) {
      try {
        const user = yield call(load, {key: USER});
        yield put({
          type: 'setState',
          payload: {
            user,
          },
        });
        const token = yield call(load, {key: TOKEN});
        yield put({
          type: 'setState',
          payload: {
            token,
          },
        });
        const apiKeyIndex = yield call(load, {key: API_KEY_INDEX});
        yield put({
          type: 'setState',
          payload: {
            apiKeyIndex,
            loaded: true,
          },
        });
      } catch (error) {
        // console.log('保存用户信息错误', error);
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
      dispatch({type: 'loadStorage'});
    },
  },
};

export default UserModel;
