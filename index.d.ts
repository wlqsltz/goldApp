declare module 'dva-model-extend' {
  import {Model} from 'dva-core-ts';
  export default function modelExtend(...model: Model[]): Model;
}
declare module 'react-native-marquee-ab' {
  import React from 'react';
  import {StyleProp, TextStyle, ViewStyle} from 'react-native';

  interface TextItem {
    label: string; // 用作点击事件的回调
    value: string; // 文本显示
    [key: string]: any;
  }

  interface MarqueeHorizontalProps {
    duration: number; // 10000ms	执行完成整个动画所需要的时间(ms)不常用
    speed?: number; //	0		平均的滚动速度，跑马灯使用这个属性（建议传入60）
    textList: TextItem[]; // 滚动的文字数组
    width: number; //	375	宽度，不能使用flex
    height: number; //	50	高度，不能使用flex
    direction: 'left' | 'right'; //	left	动画方向(向左向右滚动)
    reverse: boolean; //	false	是否将整个文本数据倒叙显示
    separator: number; //	20	两个item之间的间隙
    bgContainerStyle?: StyleProp<ViewStyle>; // 背景样式
    textStyle?: StyleProp<TextStyle>; // 文本样式
    onTextClick: (item: TextItem) => void; // 点击事件回调：(item) => void
  }

  interface MarqueeVerticalProps {
    duration: number; // 600ms	执行完成整个动画所需要的时间(ms)不常用
    textList: TextItem[]; // 滚动的文字数组
    width?: number; //	375	宽度，不能使用flex
    height?: number; //	50	高度，不能使用flex
    delay?: number; // 12000 文本停顿时间(ms)
    direction: 'up' | 'down'; //	left	动画方向(向左向右滚动)
    numberOfLines: number; // 1 同一个数据的文本行数
    headViews?: React.Component[]; // 在文本最前面加上一个自定义view，效果如图例所示，用法请参照事例用法，length长度与textList必须一致
    viewStyle?: StyleProp<ViewStyle>; // 每一行文本的样式
    bgContainerStyle?: StyleProp<ViewStyle>; // 背景样式
    textStyle?: StyleProp<TextStyle>; // 文本样式
    onTextClick: (item: TextItem) => void; // 点击事件回调：(item) => void
  }

  export class MarqueeHorizontal extends React.Component<MarqueeHorizontalProps> {}
  export class MarqueeVertical extends React.Component<MarqueeVerticalProps> {}
}

declare module 'react-native-motion' {
  import React from 'react';
  interface TranslateYAndOpacityProps {
    opacityMin?: number; // 0
    translateYMin?: number; // -4
    duration?: number; // 500
    animateOnDidMount?: boolean; // false
    delay?: number; // 0
    useNativeDriver?: boolean; // false
  }
  export class TranslateYAndOpacity extends React.Component<TranslateYAndOpacityProps> {}
}

declare module '*.png';

interface IUser {
  accountBalance: string;
  accountId: string;
  apiKeyStatus?: string;
  authenticationStatus: string;
  createDatetime: number;
  id: string;
  inviteCode: string;
  inviteNo: string;
  isChannel: '0' | '1';
  kind: string;
  lastLoginDatetime: number;
  loginName: string;
  memberFlag: '0' | '1';
  mobile: string;
  nickname: string;
  nodeLevel: string;
  nodeRate: string;
  photo: string;
  rate: string;
  referUserCount: number;
  registerDatetime: number;
  registerIp: string;
  status: string;
  tradePwdFlag: '0' | '1';
  userGrade: '1' | '2' | '3' | '4' | '5';
  userId: string;
  userReferee: string;
  virtualIncome: string;
}

interface IAccount {
  accountNumber: string;
  amount: string;
  availableAmount: string;
  createDatetime: number;
  currency: string; // 'USDT'
  frozenAmount: string;
  id: string;
  lastOrder: string;
  lockAmount: string;
  status: string;
  type: string;
  userId: string;
  withdrawalAmount: string;
}

interface IExchange {
  cname: string;
  ename: string;
  id: string;
  logo: string;
  orderNo: number;
  status: string;
  statusName: string;
}

// 账户流水
interface IBill {
  accountNumber: string;
  accountType: string;
  bizCategory: string;
  bizCategoryNote: string;
  bizNote: string;
  bizType: string;
  createDatetime: number;
  currency: string; // 'USDT'
  id: string;
  postAmount: string;
  preAmount: string;
  prevJourCode: string;
  refNo: string;
  remark: string;
  status: string;
  transAmount: string;
  type: string;
  userId: string;
}

// 提币、互转流水
interface ITransfer {
  id: string;
  amount: string;
  currency: string;
  applyDatetime: number;
  fee: string;
  status: string;
  toAddress: string;
  toUser: IUser;
}

interface IPageParams {
  pageSize?: number;
  pageNum?: number;
  [key: string]: any;
}

interface IArticle {
  id: string;
  title: string;
  content: string;
  typeId: string;
  type: string;
  updater: string;
  updaterName: string;
  updateDatetime: number;
  orderNo: number;
  remark: string;
  status: string;
}

// 行情
interface IMarket {
  id: number;
  exchangeCode: string; // 'huobi'
  exchangeName: string; // '火币'
  exchangeNo: string;
  exchangePair: string; // "DOGE/USDT"
  high: string; // '46783.00'
  low: string; // '45518.00'
  lastPrice: string; // "0.279933"
  lastPriceCny: string;
  lastPriceUsd: string;
  pricePrecision: number; // 2;
  percent24h: string; // "0.0031"
  referCurrency: string; // USDT
  symbol: string; // DOGE
  volume: string; // 2.65亿
  amount24h: string; // '11.37亿'
  existFlag?: string; // null
  isOpenFlag?: string; // null;
  status?: string; // null;
  statusDesc?: string; // null;
  xstrategyId?: string; // null;
}

// 操盘手
interface IOperator {
  accountId: string;
  availableAmount?: string;
  dayIncomeRate: string; // '9.7900'
  dayTradeAmount?: string;
  entrustAmountRange: string;
  entrustRatio: string; // '5.20'
  firstOrderAmount: string;
  grantAmount?: string;
  id: string;
  isJoinFlag: '1' | '0';
  isTgFlag?: '1' | '0';
  joinRate: string; // '5.00'
  nickname: string;
  openStatus: '1' | '0';
  operatorAccountId?: string;
  photo: string;
  selfDesc: string;
  stopRatioRange: string; // '11,20'
  todayIncome: string;
  totalIncome: string;
  totalIncomeAmount: string;
}

interface IApiKey {
  id: string;
  exchangeNo: string;
  accessKey: string;
  secretKey: string;
  createDatetime: number;
  updateDatetime?: number;
}

interface IMessage {
  content: string;
  createDatetime: number;
  id: string;
  isRead: '0' | '1';
  refNo: string;
  refType: string;
  status: string;
  statusName: string;
  target: string;
  targetName: string;
  title: string;
  type: string;
  updateDatetime: number;
  updater: string;
  updaterName: string;
}

interface ITgMessage {
  content: string;
  createDatetime: number;
  creator: string;
  creatorName: string;
  id: string;
  isRead: '0' | '1';
  keywords?: string;
  nickname: string;
  number?: number;
  numberStatua?: string;
  photo: string;
  refNo: string;
  refType?: string;
  remark?: string;
  status: string;
  statusName: string;
  target: string;
  title: string;
  tsrStatus?: string;
  type: string;
  updateDatetime: number;
  updater: string;
  updaterName: string;
  userId: string;
  userName?: string;
}

interface IBillAccountItem {
  accountId: string;
  amount: string;
  fee: string;
  grantAmount: string;
  nickname: string;
  photo: string;
  totalAmount: string;
  type: string;
}

interface IElectronicBilling {
  cumulativeIncome: string;
  dayIncomeAmount: string;
  documentaryAccount: IBillAccountItem[];
  entrustAmount: string;
  hostingAccount: IBillAccountItem[];
  id?: string;
  totalCumulativeIncome: string;
  totalDayIncomeAmount: string;
  totalEntrustAmount: string;
  totalIncomeRate: string;
}

interface IDict {
  id: string;
  key: string;
  value: string;
}

interface IPairDayIncome {
  exchangeName: string;
  exchangeNo: string;
  symbol: string;
  toSymbol: string;
  todayIncome: string;
  totalIncome: string;
}

interface IDayIncome {
  todayIncome: string;
  totalIncome: string;
  currency: string;
  pairDayIncomeList: IPairDayIncome[];
}

interface IXStrategyHistory {
  createTime: number;
  currentTimes: number;
  entrustAmount: string;
  exchangeCode: string;
  exchangeName: string;
  id: string;
  lastEnstrustCommandId: string;
  lastTradePrice: string;
  plAmount: string;
  positionCount: string;
  positionPrice: string;
  strategyId: string;
  symbol: string;
  toSymbol: string;
}

interface ITradeRecord {
  actionType: string;
  actionTypeName: string;
  avgPrice: string;
  cancelDatetime: number | null;
  createDatetime: number;
  dataTime: number | null;
  direction: string;
  enstrustExchange: string;
  enstrustStatus: string;
  enstrustTradeCode: string;
  feeSymbol: string;
  id: string;
  lastTradedDatetime: number;
  price: string;
  source: string;
  status: string;
  strategyCycleId: string;
  strategyId: string;
  symbol: string;
  toSymbol: string;
  totalAmount: string;
  totalCount: string;
  tradedAmount: string;
  tradedCount: string;
  tradedFee: string;
  type: string;
}