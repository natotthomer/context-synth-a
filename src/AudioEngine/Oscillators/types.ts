import type Analyser from "../Analyser";
import type Filter from "../Filter";
import type Gain from "../Gain";

export type OscillatorDestination = Filter | Gain | Analyser;
export type OscillatorParent = Filter | Gain | Analyser;
