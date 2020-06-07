import React, { useState, useEffect } from "react";
import { setSetters } from '../state/CardState'

let logMemory = [];
let gameID = '';

const Log = (props) => {
  return (
    <div className="row">
      <div className="col-sm-6 log__timestamp">{props.timestamp} ({props.order})</div>
      <div className="col-sm-6 log__player">{props.user}</div>
      <div className="col-sm-12 log__message">{props.message}</div>
    </div>
  )
};

const Logs = () => {
  const [logs, setLogs] = useState(logMemory);

  useEffect(() => {
    setSetters({addLog: (l) => {
      if(l.gameID !== gameID) {
        gameID = l.gameID;
        logMemory = [];
      }

      logMemory = logMemory.concat(l);
      setLogs(logMemory);
    }});
    return () => { setSetters({addLog: () => {}}) }
  });

  return (
    <div className="col-md-12">
      <h3>Event Logs ({logs.length})</h3>
      {logs.map(log => <Log {...log} />)}
    </div>
  )
};

export default Logs;
