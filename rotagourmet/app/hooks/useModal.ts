import { useState } from "react";

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onOk, setOnOk] = useState<(() => void) | null>(null);

  const showModal = (msg: string, onModalOk?: () => void) => {
    setMessage(msg);
     setOnOk(() => onModalOk || null);
    setVisible(true);
  };

    const hideModal = () => {
    setVisible(false);
    onOk?.();
    setOnOk(null);
  };

  return { visible, message, showModal, hideModal };
};
