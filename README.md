Every node type needs a wrapper class that exposes the node itself, an interface for directly manipulating its node's (most relevant) AudioParams (for, say, interface control over a param), an interface for applying modulation chains to each of its (most relevant) AudioParams (a modulation matrix, perhaps), and a mechanism for attaching the node to parent nodes and children nodes. A JSON structure should be able to define even the most complex synthesizer routing schema by use of JSONPath queries as non-arborescent references to non-ancestral nodes. This naturally requires a degree of validation to confirm the existence of the node at that address.

Is there a way to avoid using the built-in methods in favor of creating more CV- and gate-like signals? Rather than setting up a transition over time, set up an arbitrarily long square wave as a gate signal (where the amplitude of the oscillator opens a gain node) or use one-shot wave forms as envelopes (again, opening a gain node or modulating another parameter).

PWM
* PeriodicWave?
  * could maybe use one for 0% and one for 100% and use those as gate on/off switches
  * could maybe use a 100% PWM square wave with a 100% gain on it as "CV"
* Could possibly take a sawtooth ramp and inverted ramp and mix them together for a pulse width wave
