import { useCallback, useMemo, useState } from "react";

const useSwitches = (initial=false) => { 
  const [value, setValue] = useState(initial); 
 
  const setTrue = useCallback(() => setValue(true), []); 
  const setFalse = useCallback(() => setValue(false), []); 
 
  return useMemo(() => [value, setTrue, setFalse, setValue], [setFalse, setTrue, value]); 
}

export default useSwitches;