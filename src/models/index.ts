import {DvaLoadingState} from 'dva-loading-ts';
import upgrade, {UpgradeState} from './upgrade';
import user, {UserState} from './user';
import home, {HomeState} from './home';
import market, {MarketState} from './market';
import strategy, {StrategyState} from './strategy';
import message, {MessageState} from './message';

export type RootState = {
  upgrade: UpgradeState;
  user: UserState;
  home: HomeState;
  market: MarketState;
  strategy: StrategyState;
  message: MessageState;
  loading: DvaLoadingState;
};

const models = [upgrade, user, home, market, strategy, message];

export default models;
