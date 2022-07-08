import {RootState} from '@/models/index';
import {xstrategyListFront, xstrategyXstrategyHead} from '@/api/trade';
import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'redux';
import {exchangeListFront} from '@/api/public';

export interface IXstrategyHead {
  assets: string;
  balance: string;
  entrustAmount: string;
  plAmount: string;
  plAmountRate: string;
}

export interface IXstrategy {
  accountName?: string;
  btNowCount: number;
  cycleId?: string;
  entrustAmount: string;
  id: string;
  lastPrice: string;
  manualCount: number;
  plAmount: string;
  plAmountRate: string;
  positionCount: string;
  positionPrice: string;
  sorted: string;
  status: string;
  stopPrice?: string;
  stopRate?: string;
  symbol: string;
  toSymbol: string;
  type: string;
}

export interface IOptions {
  type: string;
  status: string;
  minAmount: string;
  maxAmount: string;
}

export interface StrategyState {
  data: {
    [id: string]: {
      name: string; // 交易所名称
      headData: IXstrategyHead;
      listData: IXstrategy[];
      choseIdList: string[];
      options: IOptions;
    };
  };
  curId: string;
  keyword: string;
}

interface StrategyModel extends Model {
  namespace: 'strategy';
  state: StrategyState;
  reducers: {
    setState: Reducer<StrategyState>;
  };
  effects: {
    getInitData: Effect;
    toggleItem: Effect;
    toggleAll: Effect;
    changeOptions: Effect;
  };
}

const initialState = {
  data: {},
  curId: '',
  keyword: '',
};

const strategyModel: StrategyModel = {
  namespace: 'strategy',
  state: initialState,
  reducers: {
    setState(state = initialState, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *getInitData(_, {call, put, select}) {
      const {apiKeyIndex, apiKeyList} = yield select(
        (state: RootState) => state.user,
      );
      const {curId, data, keyword} = yield select(
        (state: RootState) => state.strategy,
      );
      // 第一次加载
      if (!curId) {
        const list: IExchange[] = yield call(exchangeListFront);
        let _curId = list[0].id;
        if (apiKeyList && apiKeyList.length && apiKeyList[apiKeyIndex]) {
          _curId = apiKeyList[apiKeyIndex].exchangeNo;
        }
        const headData = yield call(xstrategyXstrategyHead);
        const listData = yield call(xstrategyListFront);
        let result: any = {};
        list.forEach(item => {
          result[item.id] = {
            name: item.cname,
            choseIdList: [],
            options: {type: '', status: '', minAmount: '', maxAmount: ''},
          };
          if (item.id === _curId) {
            result[item.id].headData = headData;
            result[item.id].listData = listData;
          }
        });
        yield put({
          type: 'setState',
          payload: {
            data: result,
            curId: _curId,
          },
        });
      } else {
        // 后续刷新或筛选
        let params: any = {};
        if (data[curId] && data[curId].options) {
          params = {...data[curId].options};
        }
        keyword && (params.symbol = keyword);
        console.log('params', params, keyword);
        const headData = yield call(xstrategyXstrategyHead);
        const listData = yield call(xstrategyListFront, params);
        yield put({
          type: 'setState',
          payload: {
            data: {
              ...data,
              [curId]: {
                ...data[curId],
                headData,
                listData,
              },
            },
          },
        });
      }
    },
    *toggleItem({payload}, {put, select}) {
      const {curId, data} = yield select((state: RootState) => state.strategy);
      const id = payload.id;
      const index = data[curId].choseIdList.findIndex(
        (_id: string) => _id === id,
      );
      if (index > -1) {
        data[curId].choseIdList.splice(index, 1);
      } else {
        data[curId].choseIdList.push(id);
      }
      yield put({
        type: 'setState',
        payload: {
          data: {
            ...data,
            [curId]: {
              ...data[curId],
              choseIdList: data[curId].choseIdList,
            },
          },
        },
      });
    },
    *toggleAll(_, {put, select}) {
      const {curId, data} = yield select((state: RootState) => state.strategy);
      if (data[curId].choseIdList.length !== data[curId].listData.length) {
        data[curId].choseIdList = data[curId].listData.map(
          (item: IXstrategy) => item.id,
        );
      } else {
        data[curId].choseIdList = [];
      }
      yield put({
        type: 'setState',
        payload: {
          data: {
            ...data,
            [curId]: {
              ...data[curId],
              choseIdList: data[curId].choseIdList,
            },
          },
        },
      });
    },
    *changeOptions({payload}, {put, select}) {
      const {curId, data} = yield select((state: RootState) => state.strategy);
      yield put({
        type: 'setState',
        payload: {
          data: {
            ...data,
            [curId]: {
              ...data[curId],
              options: {...payload},
            },
          },
        },
      });
      yield put({
        type: 'getInitData',
      });
    },
  },
};

export default strategyModel;
