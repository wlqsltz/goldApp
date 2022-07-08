import {RootState} from '@/models/index';
import {marketListAdd} from '@/api/trade';
import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'redux';

export interface IMarketTab {
  id: string;
  name: string;
  listAddRes: IMarket[];
}

export interface MarketState {
  keyword: string;
  tabList: IMarketTab[];
  curTabId: string;
  sortName: 'pirce' | 'upDown' | '';
  sortValue: '0' | '1' | '';
}

interface MarketModel extends Model {
  namespace: 'market';
  state: MarketState;
  reducers: {
    setState: Reducer<MarketState>;
  };
  effects: {
    getMarketList: Effect;
    sortList: Effect;
  };
}

const initialState: MarketState = {
  keyword: '',
  tabList: [],
  curTabId: '',
  sortName: '',
  sortValue: '',
};

const homeModel: MarketModel = {
  namespace: 'market',
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
    *getMarketList({callback}, {call, put, select}) {
      const {curTabId, keyword, sortName, sortValue} = yield select(
        (state: RootState) => state.market,
      );
      const list = yield call(marketListAdd, {
        symbol: keyword,
        price: sortName === 'price' ? sortValue : '',
        upDown: sortName === 'upDown' ? sortValue : '',
      });
      const _curTabId = curTabId || list[0]?.id;
      yield put({
        type: 'setState',
        payload: {
          tabList: list,
          curTabId: _curTabId,
        },
      });
      callback?.(list, _curTabId);
    },
    *sortList({payload}, {put, select}) {
      const {sortName, sortValue} = yield select(
        (state: RootState) => state.market,
      );
      const params: any = {};
      if (payload.sortName === sortName) {
        params.sortName = sortValue === '1' ? '' : sortName;
        params.sortValue =
          sortValue === '0' ? '1' : sortValue === '1' ? '' : '1';
      } else {
        params.sortValue = '0';
        params.sortName = payload.sortName;
      }
      yield put({
        type: 'setState',
        payload: params,
      });
      yield put({
        type: 'getMarketList',
      });
    },
  },
};

export default homeModel;
