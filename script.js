/* Tabs */
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + id).classList.add('active');
  });
});

/* 
   DEMO 1 — PROTOTYPE CHAIN EXPLORER
   Concepts: prototypes, Object.create, ES6 classes,
             prototype chain lookup, hasOwnProperty
 */
(function protoModule() {

  // Chain definitions for each type    
  const chainDefs = {
    object: [
      {
        label: 'myObj  { }',
        kind: 'own',
        props: 'name: "Ali"  ·  age: 25  ·  city: "Lahore"',
        desc: 'Your object — own properties live here.'
      },
      {
        label: 'Object.prototype',
        kind: 'proto',
        props: 'hasOwnProperty()  ·  toString()  ·  valueOf()\nisPrototypeOf()  ·  toLocaleString()',
        desc: 'Every plain object inherits from Object.prototype.'
      },
      {
        label: 'null',
        kind: 'null',
        props: 'End of the chain.',
        desc: 'null — no further prototype.'
      }
    ],
    array: [
      {
        label: 'myArr  [ ]',
        kind: 'own',
        props: '0: "JS"  ·  1: "Python"  ·  length: 2',
        desc: 'Your array — indexed elements + length live here.'
      },
      {
        label: 'Array.prototype',
        kind: 'proto',
        props: 'push()  ·  pop()  ·  map()  ·  filter()  ·  reduce()\nforEach()  ·  find()  ·  slice()  ·  splice()  ·  includes()',
        desc: 'All array methods come from Array.prototype.'
      },
      {
        label: 'Object.prototype',
        kind: 'proto',
        props: 'hasOwnProperty()  ·  toString()  ·  valueOf()',
        desc: 'Array.prototype itself inherits from Object.prototype.'
      },
      {
        label: 'null',
        kind: 'null',
        props: 'End of the chain.',
        desc: 'null — no further prototype.'
      }
    ],
    function: [
      {
        label: 'myFunc  ( )',
        kind: 'own',
        props: 'name: "myFunc"  ·  length: 1  ·  prototype: { }',
        desc: 'Your function — name, length, and prototype are own properties.'
      },
      {
        label: 'Function.prototype',
        kind: 'proto',
        props: 'call()  ·  apply()  ·  bind()  ·  toString()\nlength  ·  name',
        desc: 'All functions inherit call, apply, and bind from here.'
      },
      {
        label: 'Object.prototype',
        kind: 'proto',
        props: 'hasOwnProperty()  ·  toString()  ·  valueOf()',
        desc: 'Function.prototype itself inherits from Object.prototype.'
      },
      {
        label: 'null',
        kind: 'null',
        props: 'End of the chain.',
        desc: 'null — no further prototype.'
      }
    ],
    class: [
      {
        label: 'new Car( )  instance',
        kind: 'own',
        props: 'make: "Toyota"  ·  speed: 120  ·  doors: 4',
        desc: 'Properties assigned in constructor() live directly on the instance.'
      },
      {
        label: 'Car.prototype',
        kind: 'proto',
        props: 'describe()  ·  constructor()',
        desc: 'Methods defined in the class body sit on Car.prototype — shared by all instances.'
      },
      {
        label: 'Vehicle.prototype  (parent class)',
        kind: 'proto',
        props: 'accelerate()  ·  constructor()',
        desc: 'extends sets up this link — Car.prototype inherits from Vehicle.prototype.'
      },
      {
        label: 'Object.prototype',
        kind: 'proto',
        props: 'hasOwnProperty()  ·  toString()  ·  valueOf()',
        desc: 'The top of every chain (except null itself).'
      },
      {
        label: 'null',
        kind: 'null',
        props: 'End of the chain.',
        desc: 'null — no further prototype.'
      }
    ]
  };

  //  Lookup table: property → where it lives
  const lookupTable = {
    // own / universal
    hasOwnProperty: { layer: 'Object.prototype', type: 'chain' },
    toString: { layer: 'Object.prototype', type: 'chain' },
    valueOf: { layer: 'Object.prototype', type: 'chain' },
    isPrototypeOf: { layer: 'Object.prototype', type: 'chain' },
    toLocaleString: { layer: 'Object.prototype', type: 'chain' },
    constructor: { layer: 'prototype of your type', type: 'chain' },
    // array
    push: { layer: 'Array.prototype', type: 'chain' },
    pop: { layer: 'Array.prototype', type: 'chain' },
    map: { layer: 'Array.prototype', type: 'chain' },
    filter: { layer: 'Array.prototype', type: 'chain' },
    reduce: { layer: 'Array.prototype', type: 'chain' },
    forEach: { layer: 'Array.prototype', type: 'chain' },
    find: { layer: 'Array.prototype', type: 'chain' },
    slice: { layer: 'Array.prototype', type: 'chain' },
    splice: { layer: 'Array.prototype', type: 'chain' },
    includes: { layer: 'Array.prototype', type: 'chain' },
    length: { layer: 'the object itself (own)', type: 'own' },
    // function
    call: { layer: 'Function.prototype', type: 'chain' },
    apply: { layer: 'Function.prototype', type: 'chain' },
    bind: { layer: 'Function.prototype', type: 'chain' },
    name: { layer: 'the object itself (own)', type: 'own' },
    // own example props
    make: { layer: 'the instance (own)', type: 'own' },
    speed: { layer: 'the instance (own)', type: 'own' },
    doors: { layer: 'the instance (own)', type: 'own' },
    // class methods
    describe: { layer: 'Car.prototype', type: 'chain' },
    accelerate: { layer: 'Vehicle.prototype', type: 'chain' },
  };

  let activeType = 'object';

  function renderChain(type) {
    const nodes = chainDefs[type];
    const wrap = document.getElementById('protoChain');
    wrap.innerHTML = '';
    nodes.forEach((node, i) => {
      const el = document.createElement('div');
      el.className = 'chain-node ' + node.kind;
      el.innerHTML = `<div class="node-name">${node.label}</div>
                      <div class="node-props">${node.props}</div>`;
      el.title = node.desc;
      wrap.appendChild(el);
      if (i < nodes.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'chain-arrow';
        arrow.textContent = '↑  [[Prototype]]';
        wrap.appendChild(arrow);
      }
    });
  }

  function lookupProp(prop) {
    const resultEl = document.getElementById('protoResult');
    if (!prop.trim()) { resultEl.innerHTML = '<span>Type a property name above.</span>'; return; }

    const entry = lookupTable[prop.trim()];
    if (entry) {
      const cls = entry.type === 'own' ? 'found-own' : 'found-chain';
      const icon = entry.type === 'own' ? '✓ Own property' : '↑ Found on chain';
      resultEl.innerHTML =
        `<span class="${cls}">${icon}: <strong>${prop}</strong></span> lives on <strong>${entry.layer}</strong>.<br>
         <span style="color:var(--muted);font-size:.72rem">JS walks up the prototype chain until it finds it.</span>`;
    } else {
      resultEl.innerHTML =
        `<span class="not-found">✗ "${prop}" not found on the chain → returns <strong>undefined</strong>.</span>`;
    }
  }

  // Type buttons
  document.getElementById('protoTypeBtns').addEventListener('click', e => {
    const btn = e.target.closest('.proto-type-btn');
    if (!btn) return;
    document.querySelectorAll('.proto-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.type;
    renderChain(activeType);
    document.getElementById('protoResult').innerHTML = '';
    document.getElementById('protoLookup').value = '';
  });

  document.getElementById('btnLookup').addEventListener('click', () => {
    lookupProp(document.getElementById('protoLookup').value);
  });

  document.getElementById('protoLookup').addEventListener('keydown', e => {
    if (e.key === 'Enter') lookupProp(e.target.value);
  });

  renderChain('object');
})();

/* 
   DEMO 2 — GENERATOR & ITERATOR VISUALISER
   Concepts: function*, yield, iterator protocol,
             Symbol.iterator, spread, for...of
*/
(function generatorModule() {

  // Generator factory definitions
  const genDefs = {
    range: {
      label: 'Range Generator',
      controls: [
        { id: 'rangeStart', label: 'start', default: 1 },
        { id: 'rangeEnd', label: 'end', default: 8 },
        { id: 'rangeStep', label: 'step', default: 1 },
      ],
      make(inputs) {
        const start = parseInt(inputs.rangeStart) || 1;
        const end = parseInt(inputs.rangeEnd) || 8;
        const step = parseInt(inputs.rangeStep) || 1;
        function* range(s, e, st) {
          let cur = s;
          while (cur <= e) { yield cur; cur += st; }
        }
        return { gen: range(start, end, step), finite: true };
      },
      code(inputs) {
        const s = inputs.rangeStart || 1, e = inputs.rangeEnd || 8, st = inputs.rangeStep || 1;
        return [
          ['kw', 'function'], ['', '* '], ['fn', 'range'], ['', '(start, end, step = 1) {'],
          ['cm', '  // pauses at each yield, resumes on .next()'],
          ['kw', '  let'], ['', ' cur = start;'],
          ['kw', '  while'], [' (cur <= end) {'],
          ['kw', '    yield'], [' cur;'],
          ['', '    cur += step;'],
          ['', '}'],
          ['cm', `\n// current call: range(${s}, ${e}, ${st})`],
        ];
      }
    },

    fibonacci: {
      label: 'Fibonacci Generator',
      controls: [
        { id: 'fibMax', label: 'stop after value >', default: 100 },
      ],
      make(inputs) {
        const max = parseInt(inputs.fibMax) || 100;
        function* fibonacci(limit) {
          let [a, b] = [0, 1];
          while (a <= limit) { yield a;[a, b] = [b, a + b]; }
        }
        return { gen: fibonacci(max), finite: true };
      },
      code(inputs) {
        const m = inputs.fibMax || 100;
        return [
          ['kw', 'function'], ['', '* '], ['fn', 'fibonacci'], ['', '(limit) {'],
          ['kw', '  let'], [' [a, b] = ['], ['num', '0'], [', '], ['num', '1'], ['];'],
          ['kw', '  while'], [' (a <= limit) {'],
          ['kw', '    yield'], [' a;'],
          ['', '    [a, b] = [b, a + b];'],
          ['', '}'],
          ['cm', `\n// stop after value > ${m}`],
        ];
      }
    },

    infinite: {
      label: 'Infinite Naturals',
      controls: [],
      make() {
        function* naturals() { let n = 1; while (true) yield n++; }
        return { gen: naturals(), finite: false };
      },
      code() {
        return [
          ['kw', 'function'], ['', '* '], ['fn', 'naturals'], ['', '() {'],
          ['kw', '  let'], [' n = '], ['num', '1'], [';'],
          ['kw', '  while'], [' ('], ['kw', 'true'], [') {'],
          ['kw', '    yield'], [' n++;'],
          ['', '}'],
          ['cm', '\n// infinite — use .next() or break in for...of'],
        ];
      }
    }
  };

  let activeGenKey = 'range';
  let currentGen = null;
  let callCount = 0;
  let isDone = false;
  let inputValues = {};

  function getInputValues() {
    const def = genDefs[activeGenKey];
    const vals = {};
    def.controls.forEach(c => {
      const el = document.getElementById('gen-ctrl-' + c.id);
      vals[c.id] = el ? el.value : c.default;
    });
    return vals;
  }

  function renderControls() {
    const ctrl = document.getElementById('genControls');
    const def = genDefs[activeGenKey];
    ctrl.innerHTML = '';
    def.controls.forEach(c => {
      const grp = document.createElement('div');
      grp.className = 'gen-control-group';
      grp.innerHTML = `<span class="gen-control-label">${c.label}:</span>
        <input class="gen-input" id="gen-ctrl-${c.id}" type="number" value="${c.default}" />`;
      ctrl.appendChild(grp);
    });
  }

  function renderCode() {
    const def = genDefs[activeGenKey];
    const tokens = def.code(inputValues);
    const box = document.getElementById('genCode');
    box.innerHTML = tokens.map(([cls, txt]) =>
      cls ? `<span class="${cls}">${txt}</span>` : txt
    ).join('');
  }

  function resetGenerator() {
    inputValues = getInputValues();
    const result = genDefs[activeGenKey].make(inputValues);
    currentGen = result.gen;
    callCount = 0;
    isDone = false;

    document.getElementById('genTape').innerHTML = '<span class="tape-empty">Press Next to start the generator…</span>';
    document.getElementById('genValue').textContent = '—';
    document.getElementById('genDone').textContent = 'false';
    document.getElementById('genCalls').textContent = '0';
    document.getElementById('btnGenNext').disabled = false;
    document.getElementById('genDone').style.color = 'var(--accent2)';
    renderCode();
  }

  function stepGenerator() {
    if (!currentGen || isDone) return;
    const { value, done } = currentGen.next();
    callCount++;

    const tape = document.getElementById('genTape');

    // remove tape-empty placeholder
    const empty = tape.querySelector('.tape-empty');
    if (empty) empty.remove();

    // remove 'latest' from previous cell
    tape.querySelectorAll('.tape-cell.latest').forEach(c => c.classList.remove('latest'));

    if (!done) {
      const cell = document.createElement('span');
      cell.className = 'tape-cell latest';
      cell.textContent = value;
      tape.appendChild(cell);
      document.getElementById('genValue').textContent = value;
    } else {
      isDone = true;
      const cell = document.createElement('span');
      cell.className = 'tape-cell done-cell';
      cell.textContent = 'done';
      tape.appendChild(cell);
      document.getElementById('genValue').textContent = 'undefined';
      document.getElementById('btnGenNext').disabled = true;
    }

    document.getElementById('genDone').textContent = String(done);
    document.getElementById('genDone').style.color = done ? 'var(--accent3)' : 'var(--accent2)';
    document.getElementById('genCalls').textContent = callCount;
  }

  function spreadGenerator() {
    // Restart and collect all values (safe only for finite)
    const def = genDefs[activeGenKey];
    if (!def.make(getInputValues()).finite) {
      alert('Cannot spread an infinite generator — it would run forever!\nUse for...of with a break instead.');
      return;
    }

    inputValues = getInputValues();
    const freshGen = def.make(inputValues).gen;
    const values = [];
    let result;
    while (!(result = freshGen.next()).done) {
      values.push(result.value);
      if (values.length > 200) break; // safety cap
    }

    const tape = document.getElementById('genTape');
    tape.innerHTML = '';
    values.forEach((v, i) => {
      const cell = document.createElement('span');
      cell.className = 'tape-cell' + (i === values.length - 1 ? ' latest' : '');
      cell.textContent = v;
      tape.appendChild(cell);
    });

    // Show done state
    const doneCell = document.createElement('span');
    doneCell.className = 'tape-cell done-cell';
    doneCell.textContent = 'done';
    tape.appendChild(doneCell);

    callCount = values.length + 1;
    isDone = true;
    document.getElementById('genValue').textContent = 'undefined';
    document.getElementById('genDone').textContent = 'true';
    document.getElementById('genDone').style.color = 'var(--accent3)';
    document.getElementById('genCalls').textContent = callCount;
    document.getElementById('btnGenNext').disabled = true;

    // Reset so user can step again
    setTimeout(resetGenerator, 1200);
  }

  // Event wiring
  document.querySelectorAll('.gen-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gen-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGenKey = btn.dataset.gen;
      renderControls();
      resetGenerator();
    });
  });

  document.getElementById('btnGenNext').addEventListener('click', stepGenerator);
  document.getElementById('btnGenReset').addEventListener('click', resetGenerator);
  document.getElementById('btnSpread').addEventListener('click', spreadGenerator);

  // Init
  renderControls();
  resetGenerator();
})();

/* 
   DEMO 3 — ADVANCED JS QUIZ
   Topics: prototypes, destructuring, spread/rest,
           optional chaining, generators, ES modules,
           design patterns
*/
(function quizModule() {
  const questions = [
    {
      q: 'What does `Object.getPrototypeOf(obj)` return?',
      opts: [
        'A copy of the object\'s own properties.',
        'The [[Prototype]] of obj — the next object in the chain.',
        'The constructor function that created obj.',
        'null always.'
      ],
      ans: 1,
      exp: 'Object.getPrototypeOf() returns the internal [[Prototype]] link — the next object JS will search when a property isn\'t found on obj itself.'
    },
    {
      q: 'What does this destructuring do?\n`const { a: x = 10 } = { b: 5 };`',
      opts: [
        'Creates a variable `a` with value 5.',
        'Creates a variable `x` with value 5.',
        'Creates a variable `x` with value 10 (default, since `a` is missing).',
        'Throws a ReferenceError.'
      ],
      ans: 2,
      exp: '`a: x` renames the property `a` to variable `x`. Since `a` doesn\'t exist in the object, the default value 10 is used. Result: x = 10.'
    },
    {
      q: 'What is the difference between rest and spread — same `...` syntax?',
      opts: [
        'They are identical in all contexts.',
        'Rest collects multiple values INTO an array; spread expands an iterable into individual values.',
        'Rest only works with objects; spread only works with arrays.',
        'Spread collects; rest expands.'
      ],
      ans: 1,
      exp: 'Context determines which it is. In function parameters and destructuring, `...` is REST (collects). When calling a function or building arrays/objects, `...` is SPREAD (expands).'
    },
    {
      q: 'What does `user?.address?.city` return when `user` is null?',
      opts: [
        'Throws a TypeError.',
        '"undefined" (the string).',
        'undefined (the value).',
        'null.'
      ],
      ans: 2,
      exp: 'Optional chaining (`?.`) short-circuits and returns undefined instead of throwing when it hits a nullish value. No crash, no TypeError.'
    },
    {
      q: 'When a generator function is called, what is returned immediately?',
      opts: [
        'The return value of the function body.',
        'The first yielded value.',
        'A generator object — no code in the body runs yet.',
        'A Promise.'
      ],
      ans: 2,
      exp: 'Calling a generator function does NOT execute its body. It returns a generator object (iterator). The body runs only when you call .next() for the first time.'
    },
    {
      q: 'What is the key difference between ES Modules and CommonJS?',
      opts: [
        'ES Modules use require(); CommonJS uses import.',
        'ES Module imports are static (resolved at parse time); CommonJS require() is dynamic (resolved at runtime).',
        'CommonJS works in browsers natively; ES Modules do not.',
        'There is no functional difference — they are interchangeable.'
      ],
      ans: 1,
      exp: 'ESM import statements are static — the bundler knows at parse time what is imported, enabling tree-shaking. CommonJS require() can appear inside functions/conditions, so it\'s resolved at runtime.'
    },
    {
      q: 'Which design pattern ensures a class has exactly one instance?',
      opts: [
        'Factory Pattern.',
        'Observer Pattern.',
        'Singleton Pattern.',
        'Module Pattern.'
      ],
      ans: 2,
      exp: 'The Singleton Pattern restricts a class to one instance and provides a global access point to it. Useful for shared resources like a database connection or config object.'
    },
    {
      q: 'What is the output of:\n`const [a, , b, ...rest] = [1, 2, 3, 4, 5];`\n`console.log(a, b, rest);`',
      opts: [
        '1  2  [3, 4, 5]',
        '1  3  [4, 5]',
        '1  2  [4, 5]',
        '1  3  [3, 4, 5]'
      ],
      ans: 1,
      exp: 'Array destructuring: a=1, the second slot (2) is skipped by the empty comma, b=3, and rest collects the remaining values [4, 5]. Result: 1  3  [4, 5].'
    }
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  const qEl = document.getElementById('quizQ');
  const optsEl = document.getElementById('quizOpts');
  const feedEl = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('btnNext');
  const barEl = document.getElementById('quizBar');
  const counterEl = document.getElementById('quizCounter');
  const scoreEl = document.getElementById('quizScore');
  const bodyEl = document.getElementById('quizBody');
  const resultEl = document.getElementById('quizResult');

  function loadQuestion(index) {
    return new Promise(resolve => setTimeout(() => resolve(questions[index]), 80));
  }

  async function showQuestion(index) {
    answered = false;
    feedEl.className = 'quiz-feedback hidden';
    feedEl.textContent = '';
    nextBtn.classList.remove('visible');

    const q = await loadQuestion(index);

    // Preserve line breaks in the question text
    qEl.innerHTML = q.q.replace(/\n/g, '<br><code style="font-size:.82rem;color:var(--accent2)">');
    qEl.textContent = q.q; // reset — use textContent since questions already have \n
    qEl.style.whiteSpace = 'pre-line';

    counterEl.textContent = `Question ${index + 1} / ${questions.length}`;
    scoreEl.textContent = `Score: ${score}`;
    barEl.style.width = ((index / questions.length) * 100) + '%';

    optsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, q));
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(chosen, q) {
    if (answered) return;
    answered = true;

    const optBtns = optsEl.querySelectorAll('.quiz-opt');
    optBtns.forEach(b => b.disabled = true);

    const correct = chosen === q.ans;
    if (correct) score++;

    optBtns[q.ans].classList.add('correct');
    if (!correct) optBtns[chosen].classList.add('wrong');

    feedEl.className = 'quiz-feedback ' + (correct ? 'correct' : 'wrong');
    feedEl.textContent = (correct ? '✓ Correct! ' : '✗ Not quite. ') + q.exp;
    nextBtn.classList.add('visible');
    scoreEl.textContent = `Score: ${score}`;
  }

  nextBtn.addEventListener('click', () => {
    current++;
    if (current < questions.length) {
      showQuestion(current);
    } else {
      showResult();
    }
  });

  document.getElementById('btnRestart').addEventListener('click', () => {
    current = 0;
    score = 0;
    resultEl.classList.remove('show');
    bodyEl.style.display = 'block';
    showQuestion(0);
  });

  function showResult() {
    barEl.style.width = '100%';
    bodyEl.style.display = 'none';
    resultEl.classList.add('show');

    const pct = score / questions.length;
    document.getElementById('resultScore').textContent = score;

    let grade, msg;
    if (pct === 1) { grade = 'Perfect!'; msg = 'You nailed every Advanced JS concept. You\'re ready for videos 52+!'; }
    else if (pct >= .87) { grade = 'Excellent'; msg = 'Strong grasp of advanced JS. Review the ones you missed and you\'re set.'; }
    else if (pct >= .62) { grade = 'Good job'; msg = 'Solid foundation. Re-watch the relevant videos to fill the gaps.'; }
    else if (pct >= .5) { grade = 'Keep going'; msg = 'Half way there — prototypes and generators are tricky, keep practising.'; }
    else { grade = 'Try again'; msg = 'Core concepts need more practice. Re-watch videos 36–51 and try again!'; }

    document.getElementById('resultGrade').textContent = grade;
    document.getElementById('resultMsg').textContent = msg;
  }

  showQuestion(0);
})();
