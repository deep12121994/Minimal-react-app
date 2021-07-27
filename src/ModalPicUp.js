import React from 'react';
import './App.css';

const ModalPicUp = (props) => {
    
   // const { server, id, secret } = props.images;
   // console.log(props.images.id);
    //console.log(server);
    return(
        <React.Fragment>
            {props.show && (
                <div className="modal"> 
                    <button className="view-btn" onClick={props.onHide}>Close Modal</button>   
                    <img src={props.imageSrc} alt="image name"/>     
                </div>
            )}
        </React.Fragment>
    )
}

export default ModalPicUp;