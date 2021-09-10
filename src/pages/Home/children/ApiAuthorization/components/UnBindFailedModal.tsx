import React from 'react';
import CommonModal from './CommonModal';

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const descriptions = [
  '请先手动将相关策略切为单次循环；',
  '再等待由本工具自动止盈卖出停止策略后进行解绑操作。',
];

const UnBindFailedModal: React.FC<IProps> = React.memo(
  ({visible, setVisible}) => {
    return (
      <CommonModal
        visible={visible}
        setVisible={setVisible}
        title="您有运行中的策略交易，无法解绑"
        subTitle="若要解绑"
        descriptions={descriptions}
        btnText="我知道了"
        hideCloseIcon
      />
    );
  },
);

export default UnBindFailedModal;
