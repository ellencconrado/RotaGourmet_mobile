import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { globalStyles } from "../styles/global";

interface ModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const GenericModal: React.FC<ModalProps> = ({
  visible,
  message,
  onClose,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={globalStyles.modalBackground}>
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.modalText}>{message}</Text>
        <TouchableOpacity style={globalStyles.modalButton} onPress={onClose}>
          <Text style={{ color: "white" }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
