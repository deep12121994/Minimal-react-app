import React,{useEffect, useState} from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import {REACT_APP_API_KEY} from './key';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ModalPicUp from './ModalPicUp';
  

function App() { 
  const [images, setImages] = useState([]);
  const [searchImage, setSearchImage] = useState("");
  const [page,setPage] = useState([0]);
  const [userSearch, setUserSearch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const options = [];

//display api call
  const data = () => {
    const datas = fetch('https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=f3ca976d2c0414d193d744b3ddbd1a50&format=json&nojsoncallback=1&auth_token=72157719597914729-49a3480a7f7b9614&api_sig=85ae586f61f9704075d2c4d76fd70139')
      .then(res => res.json())
      .then(res => {
        //console.log(res);
        setImages(res.photos.photo)
    })
  }

//serach api call 
  const fetchdata = (searchImage) => {
    const data = fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${REACT_APP_API_KEY}&tags=${searchImage}&format=json&nojsoncallback=1`, {
      'Access-Control-Allow-Origin': '*'
    })
      .then(res => res.json())
      .then(result => {
        setImages(result.photos.photo);
        if(userSearch.indexOf(searchImage) == -1){
          userSearch.push(searchImage);
          options.push(searchImage);
          window.localStorage.setItem("searchList", JSON.stringify(userSearch));
        }
        setUserSearch(userSearch)
       // setUserSearch([...userSearch,...[ {userSearch:searchImage}]])
        //localStorage.setItem('list', JSON.stringify(userSearch));
        
      })
  }

  useEffect(() => {
    if (!searchImage) {
      data();
    }
    else {
      /*setTimeout(() => {
        //console.log("else part loding");
        fetchdata(searchImage);
      }, 1000)*/
      const delayDebounceFn = setTimeout(() => {
        //console.log(searchImage);
        fetchdata(searchImage);
      }, 3000);
  
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchImage])


  //modal pop up image
  const getModal = (e) => {
    //console.log("event", e.target.attributes[0].nodeValue);
    setImageSrc(e.target.attributes[0].nodeValue);
    setShowModal(true);
  }

  //close modal pop up image
  const hideModal = () => {
    setShowModal(false);
  }

  const clearData = () => {
    setUserSearch([]);
    localStorage.clear();
  }
  
  return (
    <div className="cotainer">
      <div className="header-container">
        <header>Search Photos</header>
        
        <Autocomplete
        id="custom-input-demo"
        options={userSearch}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} onChange={(e) => setSearchImage(e.target.value)}>
            <input style={{ width: 200 }} type="text" autoComplete="off"
            {...params.inputProps} />
            {userSearch.length != 0 ? (<button onClick={clearData} className="clr-btn">CLEAR OPTIONS</button>) : ""}
          </div>
        )}
      />
      </div>

    
      <div className="image-container">
        {
          <InfiniteScroll dataLength={images.length}
          next={(()=>setPage(page +1))} 
          hasMore={true}
          >
            {images.map((data, key) => {
              const { server, id, secret } = data;
              return (
                <img 
                src={`https://live.staticflickr.com/${server}/${id}_${secret}.jpg`} 
                key={key} alt="image name" onClick={getModal}/>
              )
              
              })
            }
          </InfiniteScroll>
        }  
      </div>

    
      <ModalPicUp show={showModal} onHide={hideModal} imageSrc={imageSrc}/>
    </div>
  );
}
export default App;