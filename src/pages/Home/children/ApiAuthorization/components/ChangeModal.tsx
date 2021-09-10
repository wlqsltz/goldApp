import React, {useMemo} from 'react';
import CommonModal from './CommonModal';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  exchangeNo: string;
  onConfirm: () => Promise<void>;
}

const ChangeModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, exchangeNo, onConfirm}) => {
    const descriptions = useMemo(
      () => [
        `所有策略交易针对${exchangeNo === '1' ? '火币' : '币安'}交易所`,
        `所有仓位显示切换为${exchangeNo === '1' ? '火币' : '币安'}交易所`,
        '其他交易所仓位正常监控',
      ],
      [exchangeNo],
    );

    return (
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        title={`确认切换至${exchangeNo === '1' ? '火币' : '币安'}交易所？`}
        subTitle="切换后"
        descriptions={descriptions}
        btnText="确认切换"
        onConfirm={onConfirm}
      />
    );
  },
);

export default ChangeModal;
