import {useState} from "react"

export const useVisualMode = function(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

    function transition(next, replace = false) {
      setMode(next);
      if(!replace){
        setHistory([...history, next]);
      }
   }
    function back() {
      if(history.length <= 1) {
        return;
      }
      const historyCopy = history.slice(0, history.length-1);
      setHistory(historyCopy);
      setMode(historyCopy[historyCopy.length - 1]);
    };
  
  return {mode, transition, back}
};