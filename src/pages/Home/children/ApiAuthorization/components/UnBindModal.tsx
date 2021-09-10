import React from 'react';
import CommonModal from './CommonModal';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  exchangeNo: string;
  onConfirm: () => Promise<void>;
}

const descriptions = ['本工具无法实施策略交易', '本工具无法同步持仓和交易数据'];

const UnBindModal: React.FC<IProps> = React.memo(
  ({visible, setVisible, exchangeNo, onConfirm}) => {
    return (
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        title={`确认解绑${exchangeNo === '1' ? '火币' : '币安'}交易所API授权？`}
        subTitle="解绑后"
        descriptions={descriptions}
        btnText="确认解绑"
        onConfirm={onConfirm}
      />
    );
  },
);

export default UnBindModal;
