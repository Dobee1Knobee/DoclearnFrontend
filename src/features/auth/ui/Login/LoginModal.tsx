"use client"

import type React from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { X } from "lucide-react";
import { useAppDispatch } from "@/shared/hooks";
import { clearAuthError } from "@/features/auth/model/slice";
import LoginForm from "./LoginForm";
import styles from "../styles/AuthModal.module.css";

interface LoginModalProps {
  show: boolean;
  handleClose: () => void;
  switchToRegister: () => void;
  onSuccess: (userId: string) => void;
  onForgotPassword?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  handleClose,
  switchToRegister,
  onSuccess,
  onForgotPassword,
}) => {
  const dispatch = useAppDispatch();

  // Сбрасываем ошибку при каждом открытии окна
  useEffect(() => {
    if (show) {
      dispatch(clearAuthError());
    }
  }, [show, dispatch]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.customModal}
      backdrop="static"
    >
      <button 
        type="button" 
        className={styles.closeButton} 
        onClick={handleClose} 
        aria-label="Закрыть" 
      >
        <X size={20}/>
      </button>
      <Modal.Body>
        <div className="text-center">
          <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
          <h2 className={styles.modalTitle}>Войти</h2>
        </div>
        <LoginForm onSuccess={onSuccess} onForgotPassword={onForgotPassword} />
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
            switchToRegister();
          }}
          className={styles.registrationLink}
        >
          Нет аккаунта? Зарегистрируйся
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
