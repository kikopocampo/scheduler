import {useState} from "react";
//visualMode is used to switch modes, "replace" is set to true whenever
//an error occurs and replaces the current mode in history so it returns
//to the appropriate mode
export const useVisualMode = function(initial) {
  const [history, setHistory] = useState([initial]);

    function transition(next, replace = false) {
      setHistory(prev => replace ? [...prev.slice(0,-1), next] : [...prev, next])
   }

    function back() {
      if (history.length > 1) setHistory(history.slice(0,-1));
    };
  
  const mode = history[history.length - 1]
  return {mode, transition, back}
};