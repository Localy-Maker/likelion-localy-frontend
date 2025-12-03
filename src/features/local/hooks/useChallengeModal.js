import { useState } from "react";

export function useChallengeModal() {
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const showSuccessModal = (result) => {
    setVerifyResult(result);
    setSuccessModal(true);
  };

  const showErrorModal = (result = null) => {
    setVerifyResult(result);
    setErrorModal(true);
  };

  const closeModal = () => {
    setSuccessModal(false);
    setErrorModal(false);
  };

  return {
    successModal,
    errorModal,
    verifyResult,
    showSuccessModal,
    showErrorModal,
    closeModal
  };
}

