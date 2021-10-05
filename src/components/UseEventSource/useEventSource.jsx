/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

const UseEventSource = () => {
    const [listening, setListening] = useState(false);
    const [data, setData] = useState([]);
    var eventSource = undefined;
  
    useEffect(() => {
      if (!listening) {
        eventSource = new EventSource("http://125.63.92.178:8184/api/lat/imports/processing?sortBy=createdDate&clientId=21");
  
        eventSource.onopen = (event) => {
          console.log("connection opened")
        }
        
        eventSource.onmessage = (event) => {
          console.log("result", event.data);
          setData(old => [...old, event.data])
        }
        
        eventSource.onerror = (event) => {
          console.log(event.target.readyState)
          if (event.target.readyState === EventSource.CLOSED) {
            console.log('eventsource closed (' + event.target.readyState + ')')
          }
          eventSource.close();
        }
  
        setListening(true);
      }
        
      return () => {
        eventSource.close();
        console.log("eventsource closed")
      }
  
    }, [])
  
    return (
      <div className="App">
        <header className="App-header">
          Received Data
          {data.map(d =>
            <span key={d}>{d}</span>
          )}
        </header>
      </div>
    );
  }

export default UseEventSource
