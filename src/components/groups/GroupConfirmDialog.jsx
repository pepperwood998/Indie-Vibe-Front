import React, { useContext } from 'react';
import { CloseIcon } from '../../assets/svgs';
import { ButtonMain, ButtonFrame } from '../buttons';
import { LibraryContext } from '../../contexts';

function ConfirmDialog(props) {
  const {
    state: libState,
    actions: libActions,
    dispatch: libDispatch
  } = useContext(LibraryContext);

  const { confirmDialog } = libState;

  const handlePropagateDialog = e => {
    e.stopPropagation();
  };

  const handleCloseDialog = () => {
    libDispatch(libActions.setConfirmDialog(false));
  };

  const handleConfirm = () => {
    confirmDialog.confirmCb();
    handleCloseDialog();
  };

  const handlCancel = () => {
    confirmDialog.cancelCb();
    handleCloseDialog();
  };

  return (
    <div
      className='screen-overlay center-box fadein'
      onClick={handleCloseDialog}
    >
      <div className='confirm-dialog dialog' onClick={handlePropagateDialog}>
        <div className='confirm-dialog__header'>
          <span>{confirmDialog.message}</span>
          <CloseIcon
            className='close svg--big svg--cursor svg--scale'
            onClick={handleCloseDialog}
          />
        </div>
        <div className='confirm-dialog__body'>
          <ButtonMain className='confirm' onClick={handleConfirm} isFitted>
            Confirm
          </ButtonMain>
          <ButtonFrame className='cancel' onClick={handlCancel} isFitted>
            Cancel
          </ButtonFrame>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
