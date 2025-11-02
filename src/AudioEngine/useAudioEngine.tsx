import { useContext } from "react";
import { AudioEngineContext } from "./AudioEngineContext";

const useAudioEngine = () => {
  return useContext(AudioEngineContext);
};

export { useAudioEngine };
