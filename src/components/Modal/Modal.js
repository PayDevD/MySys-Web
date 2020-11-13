import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, close, plantationData, handleData, register }) => {
    if(isOpen) {
        return (
            <React.Fragment>
            <div className="Modal-overlay" onClick={close} />
            <div className="Modal">
              <p className="title">재배지 등록</p>
              <div className="content">
                  <p>재배지 이름을 입력해주세요.</p>
                <input value={plantationData} onChange={handleData}></input>
              </div>
              <div className="button-wrap">
                <button onClick={register}>등록</button>
                <button onClick={close}>취소</button>
              </div>
            </div>
          </React.Fragment>
        )
    } else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
}
export default Modal;