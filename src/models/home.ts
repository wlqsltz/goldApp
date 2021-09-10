import {
  homeMarketList,
  operatorFrontLimit,
  xstrategyTeamRank,
  xstrategyUserRank,
} from '@/api/home';
import {cnavigateList, smsListFront} from '@/api/public';
import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'redux';

export interface ICarousel {
  id: string;
  pic: string;
}

export interface IRank {
  day?: string;
  income: '102.85';
  level?: string;
  photo: string;
  pm?: string;
  profitAmount: string;
  userId: string;
  userName: string;
}

export interface HomeState {
  carouselList: ICarousel[];
  messageList: IMessage[];
  marketList: IMarket[];
  operatorList: IOperator[];
  userRankList: IRank[];
  teamRankList: IRank[];
}

interface HomeModel extends Model {
  namespace: 'home';
  state: HomeState;
  reducers: {
    setState: Reducer<HomeState>;
  };
  effects: {
    getCarousels: Effect;
    getMessages: Effect;
    getMarkets: Effect;
    getOperators: Effect;
    getRanks: Effect;
  };
}

const initialState = {
  carouselList: [],
  messageList: [],
  marketList: [],
  operatorList: [],
  userRankList: [],
  teamRankList: [],
};

const homeModel: HomeModel = {
  namespace: 'home',
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
    *getCarousels(_, {call, put}) {
      const data = yield call(cnavigateList, '0');
      yield put({
        type: 'setState',
        payload: {carouselList: data},
      });
    },
    *getMessages(_, {call, put}) {
      const data = yield call(smsListFront);
      yield put({
        type: 'setState',
        payload: {messageList: data.slice(0, 3)},
      });
    },
    *getMarkets(_, {call, put}) {
      const data = yield call(homeMarketList);
      yield put({
        type: 'setState',
        payload: {marketList: data},
      });
    },
    *getOperators(_, {call, put}) {
      const {list} = yield call(operatorFrontLimit);
      yield put({
        type: 'setState',
        payload: {operatorList: list},
      });
    },
    *getRanks(_, {call, put}) {
      const userList = yield call(xstrategyUserRank);
      const teamList = yield call(xstrategyTeamRank);
      yield put({
        type: 'setState',
        payload: {userRankList: userList, teamRankList: teamList},
      });
    },
  },
};

export default homeModel;
