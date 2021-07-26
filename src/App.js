import React,{useEffect, useState} from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import {REACT_APP_API_KEY} from './key';
import Autocomplete from '@material-ui/lab/Autocomplete';
  

function App() { 
  const [images, setImages] = useState([]);
  const [searchImage, setSearchImage] = useState("");
  const [page,setPage] = useState([0]);
  const [userSearch, setUserSearch] = useState([]);

//display api call
  const data = () => {
    const datas = fetch('https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=14d38fd077acfa78125c6e1a3ebca9f1&format=json&nojsoncallback=1&auth_token=72157719590788558-e2fe2c8fc6667ff6&api_sig=8391bb610545bb89b877d79623662d8c')
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
      .then(res => {
        setImages(res.photos.photo);
        if(userSearch.indexOf(searchImage) == -1){
          userSearch.push(searchImage);
          window.localStorage.setItem("searchList", JSON.stringify(userSearch));
        }
        //setUserSearch([...userSearch,...[ {userSearch:searchImage}]])
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
        console.log(searchImage);
        fetchdata(searchImage);
      }, 3000);
  
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchImage])


  //const Search=document.getElementById("store");

  const clearData = () => {
    setUserSearch([]);
    localStorage.clear();
  }
  
  return (
    <div className="cotainer">
      <div className="header-container">
        <header>Search Photos</header>
        <input id={"store"} type="text" autoComplete="off"
        onChange={(e) => setSearchImage(e.target.value)} />
      </div>

      <div className="search-history-text">
        {
          userSearch.map((val) => {
            return(
              <ul><li key={val.id}>{val}</li></ul>
            )
          })
        }
        {userSearch.length != 0 ? (<button onClick={clearData} className="clr-btn">CLEAR</button>) : ""}
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
                key={key} />
              )
              
              })
            }
          </InfiniteScroll>
        }  
      </div>
    </div>
  );
}
export default App;