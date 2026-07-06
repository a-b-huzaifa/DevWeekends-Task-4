# Advanced JavaScript — Three Interactive Demos

This project is an interactive showcase demonstrating advanced JavaScript concepts: prototypes, ES6+ syntax, iterators, generators, ES modules, and design patterns. The visual interface is built with a high-contrast **Neo-Brutalist** design aesthetic (utilizing heavy shadows, bold black borders, and retro typefaces like Space Grotesk and Space Mono).

---

## Detailed Demo Walkthroughs

### 1. Prototype Chain Explorer

This demo visualizes how **Prototypal Inheritance** and **Property Lookup** work in JavaScript.

#### How It Works:
- **Base Type Selector**: Switching between *Plain Object*, *Array*, *Function*, and *ES6 Class* renders their respective prototype hierarchies in a vertical diagram.
- **Prototype Chain Nodes**:
  - **Instance level (e.g., `myObj { }`)**: The actual object instance containing its own properties (e.g., `name: "Ali"`).
  - **[[Prototype]] Pointer (`__proto__`)**: The internal link connecting the object to its parent prototype, accessed via `Object.getPrototypeOf()`.
  - **Prototype blueprint (e.g., `Object.prototype`)**: The parent object that shares methods (e.g., `hasOwnProperty`, `toString`) among instances.
  - **null**: The final terminal point of the chain.
- **Live Property Lookup Engine**:
  - Type a property name (like `toString` or `name`) and click **Look Up**.
  - The tool simulates the JavaScript engine's resolution mechanism:
    - Checks the target object first (returns **Own property** if found).
    - Walks up the `[[Prototype]]` chain to check parent prototypes (returns **Inherited property** if found).
    - If it reaches `null` without finding it, returns `undefined`.

---

### 2. Generator & Iterator Visualizer

This demo steps through the execution of JavaScript generator functions (`function*`) to visualize how they yield values over time.

#### How It Works:
- **Generator Types**:
  - **Range**: Generates numbers between custom *start*, *end*, and *step* limits.
  - **Fibonacci**: Generates Fibonacci sequence terms up to a custom cap value.
  - **Infinite Naturals**: Generates a continuous incremental sequence of natural numbers (1, 2, 3, ...) with no endpoint.
- **Step-by-Step Execution (`Next →`)**: Calling `.next()` triggers the generator to run until it encounters the next `yield` statement. The yielded value is appended as a physical block onto an interactive "tape" timeline.
- **State Panel**:
  - **last value**: The most recent yielded value (`value` property from the iterator result).
  - **done**: Boolean flag (`done` property) indicating if the generator has run to completion.
  - **calls so far**: Counters how many times `.next()` has been executed.
- **Spread Operator Simulation (`[...spread]`)**: Automatically drains all remaining values of finite generators at once and collects them into a list, demonstrating how the spread syntax behaves on iterable objects under the hood (disabled for the Infinite generator to prevent infinite loops).

---

### 3. Advanced JS Quiz

An interactive test designed to challenge and verify understanding of modern JS specifications.

#### How It Works:
- **Concept Coverage**: Questions cover prototype resolution, destructuring, rest/spread parameters, optional chaining, generator behavior, ES module loading, and the Singleton design pattern.
- **Asynchronous loading**: Uses `Promise` and `async/await` syntaxes (simulating API delays with `setTimeout`) to load each question.
- **Live Diagnostics**:
  - Tracks running scores dynamically.
  - Updates a progress indicator.
  - Displays instant visual correct/incorrect feedback with a deep-dive explanation of the underlying logic on answer selection.
  - Computes a final letter grade and descriptive evaluation based on correct responses on completion.

---

## Technical & Implementation Details

- **Modular Architecture**: The codebase in [script.js](file:///c:/Users/HUZI/OneDrive/Desktop/DevWeekends/DevWeekends%20Task%204/script.js) is structured using Immediately Invoked Function Expressions (IIFEs) ([protoModule](file:///c:/Users/HUZI/OneDrive/Desktop/DevWeekends/DevWeekends%20Task%204/script.js#L20), [generatorModule](file:///c:/Users/HUZI/OneDrive/Desktop/DevWeekends/DevWeekends%20Task%204/script.js#L232), and [quizModule](file:///c:/Users/HUZI/OneDrive/Desktop/DevWeekends/DevWeekends%20Task%204/script.js#L474)) to encapsulate logic, avoid global scope pollution, and demonstrate clean code isolation.
- **Dynamic Tab Routing**: Uses custom HTML `data-` attributes to toggle section visibility without reloading.
- **CSS Custom Properties**: The styling in [style.css](file:///c:/Users/HUZI/OneDrive/Desktop/DevWeekends/DevWeekends%20Task%204/style.css) utilizes design tokens to maintain a consistent Neo-Brutalist color palette and spacing layout across components.
