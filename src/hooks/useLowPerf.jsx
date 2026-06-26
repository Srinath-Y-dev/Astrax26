import { useState, useEffect } from "react";

export function useLowPerf() {
  const [lowPerf, setLowPerf] = useState(() => !!window.lowPerfMode);

  useEffect(() => {
    const handleChanged = () => {
      setLowPerf(!!window.lowPerfMode);
    };
    window.addEventListener("lowPerfChanged", handleChanged);
    return () => {
      window.removeEventListener("lowPerfChanged", handleChanged);
    };
  }, []);

  return lowPerf;
}
