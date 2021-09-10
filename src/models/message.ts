import {getTgSmsList, smsNoticeNumber, smsPageFront} from '@/api/message';
import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'redux';
import {RootState} from './index';

export interface IUnReadInfo {
  messageCount: number;
  noticeCount: number;
}

export interface IPagination {
  pageNum: number;
  hasMore: boolean;
}

export interface MessageState {
  unReadInfo: IUnReadInfo;
  activeIndex: number;
  pagination: IPagination;
  messageList: IMessage[];
  noticeList: IMessage[];
  tgMessageList: ITgMessage[];
}

interface MessageModel extends Model {
  namespace: 'message';
  state: MessageState;
  reducers: {
    setState: Reducer<MessageState>;
  };
  effects: {
    getUnReadCount: Effect;
    getMessages: Effect;
    getTgMessages: Effect;
    changeActiveIndex: Effect;
  };
}

const initialState = {
  unReadInfo: {
    messageCount: 0,
    noticeCount: 0,
  },
  activeIndex: 0,
  pagination: {
    pageNum: 1,
    hasMore: true,
  },
  messageList: [],
  noticeList: [],
  tgMessageList: [],
};

const homeModel: MessageModel = {
  namespace: 'message',
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
    *getUnReadCount(_, {call, put}) {
      const {msgMyUnreadCount = 0, myUnreadCount = 0} = yield call(
        smsNoticeNumber,
      );
      yield put({
        type: 'setState',
        payload: {
          unReadInfo: {
            messageCount: +msgMyUnreadCount,
            noticeCount: +myUnreadCount,
          },
        },
      });
    },
    *getMessages({payload, callback}, {call, put, select}) {
      const {messageList, noticeList, pagination, activeIndex} = yield select(
        (state: RootState) => state.message,
      );
      let pageNum = 1;
      if (payload && payload.loadMore) {
        pageNum = pagination.pageNum + 1;
      }
      const data = yield call(smsPageFront, {
        pageNum,
        type: activeIndex === 0 ? '2' : '1',
      });
      let newList = data.list.filter(
        (item: IMessage) =>
          (item.refType !== 'tg' && item.refType !== 'tg refuse') ||
          item.isRead === '1',
      );
      let keyName = activeIndex === 0 ? 'messageList' : 'noticeList';
      if (payload && payload.loadMore) {
        if (activeIndex === 0) {
          newList = messageList.concat(newList);
        } else {
          newList = noticeList.concat(newList);
        }
      }
      yield put({
        type: 'setState',
        payload: {
          [keyName]: newList,
          pagination: {
            pageNum: data.pageNum,
            hasMore: newList.length < data.total,
          },
        },
      });
      callback?.();
    },
    *getTgMessages({callback}, {call, put, select}) {
      const {activeIndex} = yield select((state: RootState) => state.message);
      if (activeIndex !== 0) {
        return;
      }
      const data = yield call(getTgSmsList);
      yield put({
        type: 'setState',
        payload: {
          tgMessageList: data,
        },
      });
      callback?.();
    },
    *changeActiveIndex({payload, callback}, {put, select}) {
      const {activeIndex} = yield select((state: RootState) => state.message);
      const {index} = payload;
      if (activeIndex === index) {
        return;
      }
      yield put({
        type: 'setState',
        payload: {
          activeIndex: index,
        },
      });
      yield put({
        type: 'getMessages',
        payload: {
          activeIndex: index,
        },
        callback,
      });
    },
  },
};

export default homeModel;
