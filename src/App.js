import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // first, we sett all necessary data for api call such as before, after, count
  // also I set currentPageIndex(to check if it's the first page and disable previous click) and items array 
  const [ items, setItems ] = useState([]);
  const [ before, setBefore ] = useState(null);
  const [ after, setAfter ] = useState(null);
  const [ count, setCount ] = useState(12);
  const [ currentPageIndex , setCurrentPageIndex ] = useState(0)
  // set basic reddit apiurl
  const apiurl = `https://www.reddit.com/r/Images.json?limit=12&count=${count}&`
  useEffect(() => {
    // when component loads we fetch data
    fetchData('');
    // add event listener to notify user when he leaves the page
    // in Chromes works when leaving the page
    // in Safari works when you interacted with the page(for example, click the buttons) and want to close tab
    window.onbeforeunload = function(e) {
      e.preventDefault()
      e.returnValue = 'Are you sure you want to leave?'
    }
  }, [])
  // possible values for fetch data are 'next', 'previous' and ''
  const fetchData = (val) => {
    let callurl;
    // check if value is for next page call and modify url to include after parameter
    if (val === 'next') {
      callurl = apiurl + `after=${after}`
      setCount(count + 12)
     // check if value is for previous page call and modify url to include before parameter
    } else if (val === 'previous') {
      callurl = apiurl + `before=${before}`
      setCount(count - 12)
      // initial function call on page load
      // keep the url as initial apiurl variable
    } else {
      callurl = apiurl
    }
    // fetching data from reddit api
    fetch(callurl)
    .then( (res) => {
      return res.json()
    })
    .then((dataObject) => {
      // updating before, after and count values
      setBefore(dataObject.data.before)
      setAfter(dataObject.data.after)
      setItems(dataObject.data.children)
    })
    .catch(err => console.log(err))
  }
  // change page event is called on footer buttons click
  const changePage = (e) => {
    // if previous button is clicked
    if (e.target.value === 'previous' && currentPageIndex !== 0){
      fetchData('previous')
      setCurrentPageIndex(currentPageIndex - 1)
    }
    // if next button is clicked
    else if (e.target.value === 'next' && currentPageIndex >= 0) {
      fetchData('next');
      setCurrentPageIndex(currentPageIndex + 1)
    } 
    // if user can not see previous photos because the current page has the latest photos we just return
    else {
      return
    }
  }
  return (
    <div className="App">
      <nav className="navbar bg-dark">
          <h6 className="text-white mb-0 shadow-sm">Reddit Coding Project</h6>
      </nav>
        <div className="row mx-0 px-2 py-2 cards-container">
          {items.map((el, i) => {
            return (
              <a className="bg-dark single-card mx-auto mb-2" key={i}
              href={`https://www.reddit.com/r/Images/comments/${el.data.id}/${el.data.title}/`}
              style={{backgroundImage: `url(${el.data.url})`}}>
              <div className="single-card-body">
                <div className="col-8">{el.data.title}</div>
                <div className="col-4">{el.data.score} likes</div>
              </div>
            </a>
            )
          })
          }
        </div>
      <div className="buttons-row bg-dark">
          <button className={`btn btn-info mr-2 ${currentPageIndex === 0 ? 'disabled' : ''}`} value="previous" onClick={(e) => changePage(e)}>Previous</button>
          <button className="btn btn-info" value="next" onClick={(e) => changePage(e)}>Next</button>
      </div>
    </div>
  );
}

export default App;
