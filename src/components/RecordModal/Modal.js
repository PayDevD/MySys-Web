import React from 'react';
import './Modal.scss';

const RecordModal = ({ isOpen, close, type, handleType, content, handleContent, register }) => {
    if(isOpen) {
        return (
            <React.Fragment>
            <div className="Modal-overlay" onClick={close} />
            <div className="Modal">
              <p className="title">일지 등록</p>
              <div className="content">
                <select value={type} onChange={handleType}>
                  <option value='growing'>재배</option>
                  <option value='circulation'>유통</option>
                </select>
                <input value={content} onChange={handleContent}></input>
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
export default RecordModal;