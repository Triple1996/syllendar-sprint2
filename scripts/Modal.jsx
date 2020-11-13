import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// export default function Modal({isShowing, hide, date}) {
  
//   const [value, setValue] = useState("")  
//   if(isShowing) {
//     return ( ReactDOM.createPortal(
//       <React.Fragment>
//       <div className="modal-overlay"/>
//       <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
//         <div className="modal">
//           <div className="modal-header">
//             <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
//               <span aria-hidden="true">&times;</span>
//             </button>
//           </div>
//           <div className="row">
//             <div className="col-10 text-center">
//               <input 
//                 className="form-group"
//                 value={value}
//                 onChange={setValue(value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//     ),document.body)
//   } else {
//     return null;
//   }
// }

const Modal = ({ isShowing, hide, date }) => isShowing ? ReactDOM.createPortal(
  
  <React.Fragment>
    <div className="modal-overlay"/>
    <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
      <div className="modal">
        <div className="modal-header">
          <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="row">
          <div className="col-10 text-center">
            <input 
              className="form-group"
            />
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>, document.body
) : null;

export default Modal;
