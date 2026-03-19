window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'Divisibility Puzzles & Games',
    subtitle: 'Playing with numbers',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Play with Numbers?',
            content: `
<h2>Why Play with Numbers?</h2>

<div class="env-block intuition">
    <div class="env-title">Numbers as Toys</div>
    <div class="env-body">
        <p>Mathematics is not only a tool for solving problems; it is also a playground. Many of the deepest ideas in number theory were discovered by people who were, quite literally, playing with numbers. Euler factored Fermat numbers for fun. Ramanujan noticed patterns in partition counts while scribbling in notebooks. Gauss played with quadratic residues as a teenager.</p>
        <p>This chapter collects games, tricks, and puzzles whose underlying logic rests on the divisibility theory we have built up. The goal is twofold: to sharpen your intuition for how divisibility works, and to show that these "serious" theorems have delightful applications.</p>
    </div>
</div>

<p>The themes we will draw on include:</p>
<ul>
    <li><strong>Positional notation and digit sums.</strong> A number's decimal representation encodes divisibility information. The digit sum modulo 9 (casting out nines) is a centuries-old tool for checking arithmetic.</li>
    <li><strong>Binary representation and strategy.</strong> The game of Nim, one of the most celebrated combinatorial games, has a winning strategy governed by XOR, the binary analog of addition modulo 2.</li>
    <li><strong>Algebraic identities.</strong> Many "magic" number tricks work because of identities like \\(10 \\equiv 1 \\pmod{9}\\) or \\(10 \\equiv -1 \\pmod{11}\\).</li>
</ul>

<p>We begin with the game of Nim, move to number magic, then develop casting out nines as a systematic error-detection method. The final sections present puzzles that test (and reward) divisibility thinking.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Game of Nim
        // ================================================================
        {
            id: 'sec-nim',
            title: 'The Game of Nim',
            content: `
<h2>The Game of Nim</h2>

<div class="env-block intuition">
    <div class="env-title">A Deceptively Simple Game</div>
    <div class="env-body">
        <p>Nim is played with several heaps of objects (stones, coins, matchsticks). Two players alternate turns. On each turn, a player must remove at least one object from exactly one heap; they may remove as many as they like from that heap. The player who takes the last object wins. (There is a "misere" variant where taking the last object loses, but we use the normal convention here.)</p>
    </div>
</div>

<p>Despite its simplicity, Nim has a complete mathematical solution discovered by Charles Bouton in 1901. The key is to think in binary.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Nim-Sum)</div>
    <div class="env-body">
        <p>The <strong>nim-sum</strong> of non-negative integers \\(a_1, a_2, \\ldots, a_k\\) is their bitwise XOR:</p>
        \\[a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_k.\\]
        <p>That is, write each number in binary and add digit by digit modulo 2 (no carrying).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Heaps of 3, 5, 7. In binary: \\(011, 101, 111\\). XOR column by column:</p>
        \\[011 \\oplus 101 \\oplus 111 = 001.\\]
        <p>The nim-sum is 1, which is nonzero.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.1 (Bouton's Theorem)</div>
    <div class="env-body">
        <p>A Nim position is a losing position for the player whose turn it is if and only if the nim-sum of all heap sizes is zero. Equivalently, the current player has a winning strategy if and only if the nim-sum is nonzero.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Proof Sketch</div>
    <div class="env-body">
        <p>Two facts establish the theorem:</p>
        <ol>
            <li>From a position with nim-sum 0, every move produces a position with nim-sum \\(\\neq 0\\). (Changing one heap changes at least one bit.)</li>
            <li>From a position with nim-sum \\(\\neq 0\\), there exists a move to a position with nim-sum 0. (Find the highest set bit in the nim-sum; some heap has that bit set. XOR that heap with the nim-sum to get a smaller value; reduce the heap to that value.)</li>
        </ol>
        <p>Since the terminal position (all heaps empty) has nim-sum 0, the player who always moves to nim-sum 0 must eventually win.</p>
    </div>
</div>

<h3>Strategy in Practice</h3>

<p>To find the winning move from a nonzero nim-sum position:</p>
<ol>
    <li>Compute \\(s = h_1 \\oplus h_2 \\oplus \\cdots \\oplus h_k\\).</li>
    <li>Find any heap \\(h_i\\) such that \\(h_i \\oplus s < h_i\\). (At least one such heap exists.)</li>
    <li>Reduce heap \\(i\\) from \\(h_i\\) to \\(h_i \\oplus s\\).</li>
</ol>

<p>Try the interactive visualization below: play Nim against the computer (which plays optimally) and see the binary strategy unfold.</p>

<div class="viz-placeholder" data-viz="viz-nim-game"></div>
`,
            visualizations: [
                {
                    id: 'viz-nim-game',
                    title: 'Play Nim Against the Computer',
                    description: 'Play the game of Nim against an optimal computer opponent. Select a heap and how many to remove. The binary XOR strategy is revealed after each move.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var heaps = [3, 5, 7];
                        var initialHeaps = [3, 5, 7];
                        var selectedHeap = -1;
                        var removeCount = 1;
                        var message = 'Your turn! Click a heap, then remove.';
                        var gameOver = false;
                        var playerTurn = true;
                        var moveHistory = [];

                        function nimSum(h) {
                            var s = 0;
                            for (var i = 0; i < h.length; i++) s ^= h[i];
                            return s;
                        }

                        function totalStones(h) {
                            var t = 0;
                            for (var i = 0; i < h.length; i++) t += h[i];
                            return t;
                        }

                        function computerMove() {
                            var s = nimSum(heaps);
                            if (s !== 0) {
                                for (var i = 0; i < heaps.length; i++) {
                                    var target = heaps[i] ^ s;
                                    if (target < heaps[i]) {
                                        var removed = heaps[i] - target;
                                        heaps[i] = target;
                                        message = 'Computer removes ' + removed + ' from heap ' + (i + 1) + '.';
                                        return;
                                    }
                                }
                            }
                            // Losing position: remove 1 from first nonempty heap
                            for (var j = 0; j < heaps.length; j++) {
                                if (heaps[j] > 0) {
                                    heaps[j]--;
                                    message = 'Computer removes 1 from heap ' + (j + 1) + '.';
                                    return;
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('The Game of Nim', viz.width / 2, 20, viz.colors.white, 16);

                            // Draw heaps as rows of circles
                            var heapNames = ['Heap 1', 'Heap 2', 'Heap 3'];
                            var maxStones = Math.max(initialHeaps[0], initialHeaps[1], initialHeaps[2]);
                            var stoneR = Math.min(18, (viz.width - 160) / (maxStones * 2 + 2));
                            var startY = 70;
                            var rowH = 70;

                            for (var i = 0; i < 3; i++) {
                                var y = startY + i * rowH;
                                var col = (i === selectedHeap) ? viz.colors.yellow : viz.colors.text;
                                ctx.fillStyle = col;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(heapNames[i] + ' (' + heaps[i] + ')', 110, y + stoneR);

                                // Draw stones
                                for (var j = 0; j < heaps[i]; j++) {
                                    var sx = 130 + j * (stoneR * 2 + 4) + stoneR;
                                    var sy = y + stoneR;
                                    var stoneCol = (i === selectedHeap && j >= heaps[i] - removeCount) ?
                                        viz.colors.red : viz.colors.blue;
                                    ctx.fillStyle = stoneCol;
                                    ctx.beginPath();
                                    ctx.arc(sx, sy, stoneR - 2, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.white + '44';
                                    ctx.lineWidth = 1;
                                    ctx.stroke();
                                }

                                // Binary representation
                                var binStr = heaps[i].toString(2).padStart(4, '0');
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'left';
                                ctx.fillText(binStr, viz.width - 70, y + stoneR);
                            }

                            // Nim-sum display
                            var ns = nimSum(heaps);
                            var nsY = startY + 3 * rowH + 10;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText('XOR:', viz.width - 110, nsY);
                            ctx.fillStyle = ns === 0 ? viz.colors.green : viz.colors.orange;
                            ctx.fillText(ns.toString(2).padStart(4, '0') + ' = ' + ns, viz.width - 70, nsY);

                            var statusCol = ns === 0 ? viz.colors.green : viz.colors.orange;
                            var statusText = ns === 0 ? 'Nim-sum = 0 (losing position)' : 'Nim-sum \u2260 0 (winning position)';
                            viz.screenText(statusText, viz.width / 2, nsY + 25, statusCol, 12);

                            // Message
                            viz.screenText(message, viz.width / 2, viz.height - 50, viz.colors.white, 13);

                            if (gameOver) {
                                viz.screenText('Game Over!', viz.width / 2, viz.height - 25, viz.colors.yellow, 15);
                            }
                        }

                        // Click handler for heap selection
                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver || !playerTurn) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var dpr = window.devicePixelRatio || 1;
                            var mx = (e.clientX - rect.left);
                            var my = (e.clientY - rect.top);
                            var startY = 70;
                            var rowH = 70;
                            var stoneR = Math.min(18, (viz.width - 160) / (Math.max(initialHeaps[0], initialHeaps[1], initialHeaps[2]) * 2 + 2));

                            for (var i = 0; i < 3; i++) {
                                var y = startY + i * rowH;
                                if (my >= y && my <= y + stoneR * 2 + 10 && heaps[i] > 0) {
                                    selectedHeap = i;
                                    removeCount = Math.min(removeCount, heaps[i]);
                                    if (removeCount < 1) removeCount = 1;
                                    message = 'Heap ' + (i + 1) + ' selected. Use slider to choose amount, then click Remove.';
                                    draw();
                                    return;
                                }
                            }
                        });

                        // Controls
                        var removeSlider = VizEngine.createSlider(controls, 'Remove', 1, 7, 1, 1, function(v) {
                            removeCount = Math.round(v);
                            if (selectedHeap >= 0) {
                                removeCount = Math.min(removeCount, heaps[selectedHeap]);
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Remove', function() {
                            if (gameOver || !playerTurn || selectedHeap < 0) return;
                            var rc = Math.min(removeCount, heaps[selectedHeap]);
                            if (rc < 1) return;
                            heaps[selectedHeap] -= rc;
                            moveHistory.push('You: -' + rc + ' from heap ' + (selectedHeap + 1));

                            if (totalStones(heaps) === 0) {
                                message = 'You took the last stone. You win!';
                                gameOver = true;
                                draw();
                                return;
                            }

                            selectedHeap = -1;
                            playerTurn = false;
                            message = 'Computer is thinking...';
                            draw();

                            setTimeout(function() {
                                computerMove();
                                if (totalStones(heaps) === 0) {
                                    message = 'Computer took the last stone. Computer wins!';
                                    gameOver = true;
                                } else {
                                    playerTurn = true;
                                    message += ' Your turn!';
                                }
                                draw();
                            }, 600);
                        });

                        VizEngine.createButton(controls, 'New Game', function() {
                            heaps = [3, 5, 7];
                            selectedHeap = -1;
                            removeCount = 1;
                            message = 'Your turn! Click a heap, then remove.';
                            gameOver = false;
                            playerTurn = true;
                            moveHistory = [];
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random Heaps', function() {
                            heaps = [
                                Math.floor(Math.random() * 7) + 1,
                                Math.floor(Math.random() * 7) + 1,
                                Math.floor(Math.random() * 7) + 1
                            ];
                            initialHeaps = heaps.slice();
                            selectedHeap = -1;
                            removeCount = 1;
                            message = 'New random heaps. Your turn!';
                            gameOver = false;
                            playerTurn = true;
                            moveHistory = [];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a Nim game with heaps of sizes 4, 7, and 2, compute the nim-sum. Does the first player have a winning strategy? If so, describe the optimal first move.',
                    hint: 'Write each heap size in binary: 4 = 100, 7 = 111, 2 = 010. XOR them column by column.',
                    solution: '\\(4 \\oplus 7 \\oplus 2 = 100 \\oplus 111 \\oplus 010 = 001 = 1\\). The nim-sum is nonzero, so the first player wins. The winning move: XOR heap 7 with the nim-sum: \\(7 \\oplus 1 = 6\\). Reduce heap 2 (size 7) to 6 by removing 1 stone. The resulting position \\((4, 6, 2)\\) has nim-sum \\(4 \\oplus 6 \\oplus 2 = 0\\).'
                },
                {
                    question: 'Prove that in a two-heap Nim game with heaps of sizes \\(a\\) and \\(b\\), the first player wins if and only if \\(a \\neq b\\). What is the winning strategy?',
                    hint: 'What is \\(a \\oplus b\\) when \\(a = b\\)?',
                    solution: 'When \\(a = b\\), the nim-sum \\(a \\oplus a = 0\\), so the position is losing for the player to move. When \\(a \\neq b\\), nim-sum is nonzero. The winning strategy is to reduce the larger heap to match the smaller one: if \\(a > b\\), reduce heap 1 to \\(b\\). This gives heaps \\((b, b)\\) with nim-sum 0, putting the opponent in the losing position. The opponent is then forced to break the symmetry, and you mirror their move on the other heap.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Magic Tricks with Numbers
        // ================================================================
        {
            id: 'sec-magic',
            title: 'Magic Tricks with Numbers',
            content: `
<h2>Magic Tricks with Numbers</h2>

<div class="env-block intuition">
    <div class="env-title">The Illusion of Mind-Reading</div>
    <div class="env-body">
        <p>Many "think of a number" tricks produce a result that seems to depend on the chosen number but actually does not, or that reveals the number through a predictable algebraic identity. The "magic" is just algebra in disguise.</p>
    </div>
</div>

<h3>Trick 1: The Universal Answer</h3>

<div class="env-block example">
    <div class="env-title">Think of a Number</div>
    <div class="env-body">
        <p>Think of any number \\(n\\). Double it. Add 10. Divide by 2. Subtract your original number. The result is always 5.</p>
        <p><strong>Why?</strong> Let the original number be \\(n\\). After the steps: \\(\\frac{2n + 10}{2} - n = n + 5 - n = 5\\).</p>
    </div>
</div>

<h3>Trick 2: The Reverse-and-Subtract Trick</h3>

<div class="env-block example">
    <div class="env-title">Three-Digit Reversal</div>
    <div class="env-body">
        <p>Take any three-digit number where the first digit exceeds the last (e.g., 732). Reverse it (237). Subtract the smaller from the larger (732 - 237 = 495). Now reverse the result (594) and add: \\(495 + 594 = 1089\\).</p>
        <p>The answer is <strong>always 1089</strong>, regardless of the starting number.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.2 (The 1089 Trick)</div>
    <div class="env-body">
        <p>Let \\(N = 100a + 10b + c\\) be a three-digit number with \\(a > c\\). Let \\(N' = 100c + 10b + a\\). Then</p>
        \\[N - N' = 99(a - c).\\]
        <p>Since \\(1 \\leq a - c \\leq 8\\), the difference is one of \\(99, 198, 297, \\ldots, 792\\). Writing \\(D = 100d_1 + 10d_2 + d_3\\), the reverse of \\(D\\) is \\(D' = 100d_3 + 10d_2 + d_1\\), and one can verify that \\(D + D' = 1089\\) in every case. (The middle digit is always 9, and the outer digits sum to 9.)</p>
    </div>
</div>

<h3>Trick 3: Predicting the Digit Sum</h3>

<div class="env-block example">
    <div class="env-title">Any Number, Same Residue</div>
    <div class="env-body">
        <p>Think of any number. Multiply it by 9. Sum the digits of the result. Keep summing digits until you have a single digit. The answer is always 9.</p>
        <p><strong>Why?</strong> Any multiple of 9 has digit sum divisible by 9. The only single-digit positive multiple of 9 is 9 itself.</p>
    </div>
</div>

<p>Try the interactive trick below: step through any "think of a number" trick and see exactly why the algebra guarantees the result.</p>

<div class="viz-placeholder" data-viz="viz-number-magic"></div>
`,
            visualizations: [
                {
                    id: 'viz-number-magic',
                    title: 'Think-of-a-Number Trick',
                    description: 'Choose a number and watch a "magic" trick step by step. The algebra behind each step is revealed, showing why the result is always the same.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var chosenNumber = 7;
                        var currentTrick = 0;
                        var currentStep = 0;

                        var tricks = [
                            {
                                name: 'The Universal Answer',
                                steps: function(n) {
                                    return [
                                        { desc: 'Start with your number', value: n, algebra: 'n' },
                                        { desc: 'Double it', value: 2 * n, algebra: '2n' },
                                        { desc: 'Add 10', value: 2 * n + 10, algebra: '2n + 10' },
                                        { desc: 'Divide by 2', value: n + 5, algebra: 'n + 5' },
                                        { desc: 'Subtract your original number', value: 5, algebra: '(n + 5) - n = 5' }
                                    ];
                                },
                                reveal: 'The answer is always 5, regardless of n!'
                            },
                            {
                                name: 'The 1089 Trick',
                                steps: function(n) {
                                    // Force a valid 3-digit number with first > last
                                    var num = Math.max(201, Math.min(987, Math.abs(n) * 100 + 32));
                                    var d1 = Math.floor(num / 100);
                                    var d3 = num % 10;
                                    if (d1 <= d3) { var tmp = d1; d1 = d3 + 1; if (d1 > 9) d1 = 9; num = d1 * 100 + Math.floor((num % 100) / 10) * 10 + d3; }
                                    var rev = parseInt(('' + num).split('').reverse().join(''));
                                    var diff = Math.abs(num - rev);
                                    var diffStr = '' + diff;
                                    while (diffStr.length < 3) diffStr = '0' + diffStr;
                                    var revDiff = parseInt(diffStr.split('').reverse().join(''));
                                    return [
                                        { desc: 'Start: ' + num, value: num, algebra: '100a + 10b + c' },
                                        { desc: 'Reverse: ' + rev, value: rev, algebra: '100c + 10b + a' },
                                        { desc: 'Subtract: |' + num + ' - ' + rev + '|', value: diff, algebra: '99|a - c|' },
                                        { desc: 'Reverse the difference: ' + revDiff, value: revDiff, algebra: 'Reverse of 99|a-c|' },
                                        { desc: 'Add: ' + diff + ' + ' + revDiff, value: diff + revDiff, algebra: '= 1089' }
                                    ];
                                },
                                reveal: 'The answer is always 1089!'
                            },
                            {
                                name: 'Multiply by 9, Sum Digits',
                                steps: function(n) {
                                    var prod = Math.abs(n) * 9;
                                    var digitSum = function(x) {
                                        var s = 0;
                                        var str = '' + Math.abs(x);
                                        for (var i = 0; i < str.length; i++) s += parseInt(str[i]);
                                        return s;
                                    };
                                    var ds1 = digitSum(prod);
                                    var ds2 = ds1 >= 10 ? digitSum(ds1) : ds1;
                                    var result = [
                                        { desc: 'Start with your number', value: Math.abs(n), algebra: 'n' },
                                        { desc: 'Multiply by 9', value: prod, algebra: '9n' },
                                        { desc: 'Sum the digits of ' + prod, value: ds1, algebra: 'digit sum of 9n' }
                                    ];
                                    if (ds1 >= 10) {
                                        result.push({ desc: 'Sum digits again: ' + ds1, value: ds2, algebra: 'iterated digit sum = 9' });
                                    }
                                    result.push({ desc: 'Final single digit', value: 9, algebra: '9n \u2261 0 (mod 9), digit root = 9' });
                                    return result;
                                },
                                reveal: 'The digital root of any multiple of 9 is always 9!'
                            }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var trick = tricks[currentTrick];
                            var steps = trick.steps(chosenNumber);

                            // Title
                            viz.screenText(trick.name, viz.width / 2, 22, viz.colors.white, 16);

                            // Steps
                            var startY = 60;
                            var stepH = 55;
                            var maxShow = Math.min(currentStep + 1, steps.length);

                            for (var i = 0; i < maxShow; i++) {
                                var y = startY + i * stepH;
                                var step = steps[i];
                                var isLast = (i === steps.length - 1 && maxShow === steps.length);

                                // Step number circle
                                ctx.fillStyle = isLast ? viz.colors.yellow : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(40, y + 12, 14, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.bg;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('' + (i + 1), 40, y + 12);

                                // Description
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(step.desc, 65, y + 8);

                                // Value
                                ctx.fillStyle = isLast ? viz.colors.yellow : viz.colors.teal;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.fillText('= ' + step.value, 65, y + 30);

                                // Algebra
                                ctx.fillStyle = viz.colors.purple + 'cc';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(step.algebra, viz.width - 30, y + 18);

                                // Arrow between steps
                                if (i < maxShow - 1) {
                                    ctx.strokeStyle = viz.colors.text + '66';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(40, y + 28);
                                    ctx.lineTo(40, y + stepH - 4);
                                    ctx.stroke();
                                    // arrowhead
                                    ctx.fillStyle = viz.colors.text + '66';
                                    ctx.beginPath();
                                    ctx.moveTo(40, y + stepH - 2);
                                    ctx.lineTo(36, y + stepH - 8);
                                    ctx.lineTo(44, y + stepH - 8);
                                    ctx.closePath();
                                    ctx.fill();
                                }
                            }

                            // Reveal message
                            if (maxShow === steps.length) {
                                viz.screenText(trick.reveal, viz.width / 2, viz.height - 30, viz.colors.green, 14);
                            } else {
                                viz.screenText('Click "Next Step" to continue...', viz.width / 2, viz.height - 30, viz.colors.text, 12);
                            }
                        }

                        VizEngine.createSlider(controls, 'Your number', 1, 99, chosenNumber, 1, function(v) {
                            chosenNumber = Math.round(v);
                            currentStep = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Next Step', function() {
                            var steps = tricks[currentTrick].steps(chosenNumber);
                            if (currentStep < steps.length - 1) {
                                currentStep++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            currentStep = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Universal Answer', function() {
                            currentTrick = 0; currentStep = 0; draw();
                        });
                        VizEngine.createButton(controls, '1089 Trick', function() {
                            currentTrick = 1; currentStep = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Digit Sum x9', function() {
                            currentTrick = 2; currentStep = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Invent a "think of a number" trick where the final answer is always 7. Write out the algebraic proof that it works for any starting number \\(n\\).',
                    hint: 'Start with \\(n\\), perform operations that eventually cancel \\(n\\) and leave 7. For example: multiply by 2, add 14, divide by 2, subtract \\(n\\).',
                    solution: 'One example: start with \\(n\\). Multiply by 3: \\(3n\\). Add 21: \\(3n + 21\\). Divide by 3: \\(n + 7\\). Subtract your original number: \\(7\\). Proof: \\(\\frac{3n + 21}{3} - n = n + 7 - n = 7\\). The key is that every operation involving \\(n\\) is eventually undone, leaving only the constant.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Casting Out Nines
        // ================================================================
        {
            id: 'sec-casting',
            title: 'Casting Out Nines',
            content: `
<h2>Casting Out Nines</h2>

<div class="env-block intuition">
    <div class="env-title">A Medieval Error Detector</div>
    <div class="env-body">
        <p>Before calculators, arithmeticians needed a quick way to check whether a long multiplication or addition was correct. "Casting out nines" is such a method: replace each number by the sum of its digits (repeat until single-digit), then check whether the operation is consistent. If it fails, you know there is an error. If it passes, the answer is probably correct.</p>
    </div>
</div>

<p>The method rests on a simple but powerful fact about decimal representation.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 15.3 (Digit Sum and Mod 9)</div>
    <div class="env-body">
        <p>For any positive integer \\(N\\) with decimal digits \\(d_k d_{k-1} \\cdots d_1 d_0\\),</p>
        \\[N \\equiv d_k + d_{k-1} + \\cdots + d_1 + d_0 \\pmod{9}.\\]
        <p>That is, a number and its digit sum have the same remainder when divided by 9.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(10 \\equiv 1 \\pmod{9}\\), we have \\(10^j \\equiv 1 \\pmod{9}\\) for all \\(j \\geq 0\\). Therefore</p>
        \\[N = \\sum_{j=0}^{k} d_j \\cdot 10^j \\equiv \\sum_{j=0}^{k} d_j \\cdot 1 = \\sum_{j=0}^{k} d_j \\pmod{9}.\\]
    </div>
</div>

<h3>Checking Multiplication</h3>

<p>If \\(a \\times b = c\\), then we must have</p>
\\[\\text{dr}(a) \\times \\text{dr}(b) \\equiv \\text{dr}(c) \\pmod{9}\\]
<p>where \\(\\text{dr}(n)\\) denotes the <strong>digital root</strong> of \\(n\\) (iterated digit sum until single-digit). If this congruence fails, the multiplication is definitely wrong.</p>

<div class="env-block example">
    <div class="env-title">Example: Checking 273 x 418 = 114114</div>
    <div class="env-body">
        <p>Digital root of 273: \\(2 + 7 + 3 = 12 \\to 1 + 2 = 3\\).</p>
        <p>Digital root of 418: \\(4 + 1 + 8 = 13 \\to 1 + 3 = 4\\).</p>
        <p>Product of digital roots: \\(3 \\times 4 = 12 \\to 1 + 2 = 3\\).</p>
        <p>Digital root of 114114: \\(1+1+4+1+1+4 = 12 \\to 3\\). Check passes! \\(\\checkmark\\)</p>
        <p>(And indeed \\(273 \\times 418 = 114{,}114\\).)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Limitation</div>
    <div class="env-body">
        <p>Casting out nines cannot detect errors that are multiples of 9 (e.g., transposing two digits, or adding/subtracting 9). It catches about 88.9% of single-digit errors. For stronger checks, one can also "cast out elevens" using alternating digit sums, since \\(10 \\equiv -1 \\pmod{11}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-casting-nines"></div>
`,
            visualizations: [
                {
                    id: 'viz-casting-nines',
                    title: 'Casting Out Nines',
                    description: 'Enter two numbers to multiply. The visualization checks the multiplication by casting out nines, with animated digit-sum reduction.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var numA = 273;
                        var numB = 418;
                        var claimedProduct = 114114;
                        var animPhase = 0;
                        var animTimer = null;

                        function digitalRoot(n) {
                            if (n === 0) return 0;
                            n = Math.abs(n);
                            var r = n % 9;
                            return r === 0 ? 9 : r;
                        }

                        function digitSum(n) {
                            var s = 0;
                            var str = '' + Math.abs(n);
                            for (var i = 0; i < str.length; i++) s += parseInt(str[i]);
                            return s;
                        }

                        function digitSumSteps(n) {
                            var steps = [Math.abs(n)];
                            var current = Math.abs(n);
                            while (current >= 10) {
                                current = digitSum(current);
                                steps.push(current);
                            }
                            return steps;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var actualProduct = numA * numB;

                            viz.screenText('Casting Out Nines: Check Multiplication', viz.width / 2, 22, viz.colors.white, 15);

                            // Show the multiplication
                            viz.screenText(numA + ' \u00D7 ' + numB + ' = ' + claimedProduct + '  (actual: ' + actualProduct + ')', viz.width / 2, 52, viz.colors.text, 13);

                            // Three columns: A, B, Product
                            var colX = [100, 280, 460];
                            var colLabels = ['First number', 'Second number', 'Claimed product'];
                            var nums = [numA, numB, claimedProduct];
                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange];

                            for (var c = 0; c < 3; c++) {
                                var x = colX[c];
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(colLabels[c], x, 82);

                                var steps = digitSumSteps(nums[c]);
                                var maxShow = Math.min(steps.length, animPhase + 1);

                                for (var s = 0; s < maxShow; s++) {
                                    var y = 105 + s * 40;
                                    var isLast = (s === steps.length - 1);
                                    var val = steps[s];

                                    // Show digits with + signs
                                    var valStr = '' + val;
                                    if (s > 0 || valStr.length > 1) {
                                        var digitDisplay = valStr.split('').join(' + ');
                                        ctx.fillStyle = colors[c] + '99';
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.fillText(digitDisplay, x, y);
                                    }

                                    // Result
                                    if (s < steps.length - 1) {
                                        var nextVal = steps[s + 1];
                                        if (s + 1 < maxShow) {
                                            ctx.fillStyle = colors[c];
                                            ctx.font = 'bold 16px -apple-system,sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.fillText('\u2193 ' + nextVal, x, y + 22);
                                        }
                                    } else {
                                        // Final digital root
                                        ctx.fillStyle = isLast ? viz.colors.yellow : colors[c];
                                        ctx.font = 'bold 20px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.fillText(val, x, y + 22);
                                    }
                                }
                            }

                            // Verification at the bottom
                            if (animPhase >= 4) {
                                var drA = digitalRoot(numA);
                                var drB = digitalRoot(numB);
                                var drP = digitalRoot(claimedProduct);
                                var drProduct = digitalRoot(drA * drB);

                                var checkY = 310;
                                viz.screenText('Digital root check:', viz.width / 2, checkY, viz.colors.white, 13);
                                viz.screenText(
                                    'dr(' + numA + ') \u00D7 dr(' + numB + ') = ' + drA + ' \u00D7 ' + drB + ' = ' + (drA * drB) + ' \u2192 dr = ' + drProduct,
                                    viz.width / 2, checkY + 22, viz.colors.teal, 13
                                );
                                viz.screenText(
                                    'dr(' + claimedProduct + ') = ' + drP,
                                    viz.width / 2, checkY + 44, viz.colors.orange, 13
                                );

                                if (drProduct === drP) {
                                    viz.screenText('Check PASSES (consistent mod 9)', viz.width / 2, checkY + 70, viz.colors.green, 14);
                                } else {
                                    viz.screenText('Check FAILS! Error detected!', viz.width / 2, checkY + 70, viz.colors.red, 14);
                                }
                            }
                        }

                        VizEngine.createSlider(controls, 'First', 10, 999, numA, 1, function(v) {
                            numA = Math.round(v);
                            claimedProduct = numA * numB;
                            animPhase = 0;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Second', 10, 999, numB, 1, function(v) {
                            numB = Math.round(v);
                            claimedProduct = numA * numB;
                            animPhase = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate Check', function() {
                            animPhase = 0;
                            draw();
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animPhase++;
                                draw();
                                if (animPhase >= 5) clearInterval(animTimer);
                            }, 700);
                        });

                        VizEngine.createButton(controls, 'Introduce Error', function() {
                            claimedProduct = numA * numB + Math.floor(Math.random() * 8) + 1;
                            animPhase = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Fix Product', function() {
                            claimedProduct = numA * numB;
                            animPhase = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use casting out nines to determine whether the following multiplication is correct: \\(347 \\times 826 = 286{,}522\\).',
                    hint: 'Compute the digital root of each factor and the claimed product. Check whether \\(\\text{dr}(347) \\times \\text{dr}(826) \\equiv \\text{dr}(286522) \\pmod{9}\\).',
                    solution: 'dr(347) = 3 + 4 + 7 = 14, then 1 + 4 = 5. dr(826) = 8 + 2 + 6 = 16, then 1 + 6 = 7. Product of digital roots: 5 \\times 7 = 35, then 3 + 5 = 8. dr(286522) = 2 + 8 + 6 + 5 + 2 + 2 = 25, then 2 + 5 = 7. Since 8 \\neq 7, the multiplication is \\textbf{wrong}. (The correct product is \\(347 \\times 826 = 286{,}622\\).)'
                },
                {
                    question: 'Explain why casting out nines cannot detect an error where two adjacent digits in the answer are transposed (e.g., writing 253 instead of 235).',
                    hint: 'What happens to the digit sum when you swap two digits?',
                    solution: 'Transposing two digits does not change the digit sum. For example, 253 and 235 both have digit sum \\(2 + 5 + 3 = 10 \\to 1\\). Since casting out nines only checks the digit sum modulo 9, and transposition preserves the digit sum, this type of error is invisible to the method. More generally, any error that changes the number by a multiple of 9 is undetectable.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Number Puzzles
        // ================================================================
        {
            id: 'sec-puzzles',
            title: 'Number Puzzles',
            content: `
<h2>Number Puzzles</h2>

<div class="env-block intuition">
    <div class="env-title">Puzzles as Divisibility Tests</div>
    <div class="env-body">
        <p>The puzzles in this section are not arbitrary brain-teasers; they are disguised exercises in modular arithmetic and divisibility. Solving them requires the same skills used in cryptography, error-correcting codes, and algorithm design.</p>
    </div>
</div>

<h3>Puzzle Type 1: Find the Missing Digit</h3>

<p>Given a product with one digit replaced by "?", you can often determine the missing digit using divisibility rules.</p>

<div class="env-block example">
    <div class="env-title">Example: Missing Digit in a Product</div>
    <div class="env-body">
        <p>Suppose \\(37 \\times 4? = 1554\\). What is the missing digit?</p>
        <p>Since \\(1554 / 37 = 42\\), the missing digit is 2. Alternatively, casting out nines: \\(\\text{dr}(37) = 1\\), \\(\\text{dr}(1554) = 6\\). So \\(\\text{dr}(4?) = 6\\). Since \\(4 + ? \\equiv 6 \\pmod{9}\\), we get \\(? = 2\\).</p>
    </div>
</div>

<h3>Puzzle Type 2: Digit Rearrangement</h3>

<p>Given the digits of a number, rearrange them to form a number divisible by a given divisor.</p>

<div class="env-block example">
    <div class="env-title">Example: Make It Divisible</div>
    <div class="env-body">
        <p>Rearrange the digits 1, 2, 3, 4, 5 to form a number divisible by 8.</p>
        <p>Divisibility by 8 depends only on the last three digits. We need a three-digit permutation of three of the five digits that is divisible by 8. For example, 312 is divisible by 8 (\\(312 / 8 = 39\\)), so 45312 works.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Useful Divisibility Facts for Puzzles</div>
    <div class="env-body">
        <ul>
            <li>Divisible by 2: last digit is even.</li>
            <li>Divisible by 3: digit sum is divisible by 3.</li>
            <li>Divisible by 4: last two digits form a number divisible by 4.</li>
            <li>Divisible by 5: last digit is 0 or 5.</li>
            <li>Divisible by 6: divisible by both 2 and 3.</li>
            <li>Divisible by 8: last three digits form a number divisible by 8.</li>
            <li>Divisible by 9: digit sum is divisible by 9.</li>
            <li>Divisible by 11: alternating digit sum is divisible by 11.</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-missing-digit"></div>
<div class="viz-placeholder" data-viz="viz-digit-scramble"></div>
`,
            visualizations: [
                {
                    id: 'viz-missing-digit',
                    title: 'Find the Missing Digit',
                    description: 'A multiplication problem with one digit hidden. Use divisibility rules to find the missing digit.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var factorA, factorB, product, missingPos, missingDigit;
                        var guess = -1;
                        var revealed = false;

                        function generatePuzzle() {
                            factorA = Math.floor(Math.random() * 90) + 10; // 10-99
                            factorB = Math.floor(Math.random() * 90) + 10;
                            product = factorA * factorB;
                            var prodStr = '' + product;
                            missingPos = Math.floor(Math.random() * prodStr.length);
                            missingDigit = parseInt(prodStr[missingPos]);
                            guess = -1;
                            revealed = false;
                        }

                        generatePuzzle();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Find the Missing Digit', viz.width / 2, 25, viz.colors.white, 16);

                            // Show the multiplication
                            var prodStr = '' + product;
                            var displayProd = '';
                            for (var i = 0; i < prodStr.length; i++) {
                                if (i === missingPos && !revealed) {
                                    displayProd += '?';
                                } else {
                                    displayProd += prodStr[i];
                                }
                            }

                            viz.screenText(factorA + ' \u00D7 ' + factorB + ' = ' + displayProd, viz.width / 2, 75, viz.colors.blue, 28);

                            // Digital root hint
                            var drA = factorA % 9 || 9;
                            var drB = factorB % 9 || 9;
                            var drProd = product % 9 || 9;
                            var drFactors = (drA * drB) % 9 || 9;

                            var hintY = 130;
                            viz.screenText('Hint: Use casting out nines', viz.width / 2, hintY, viz.colors.text, 12);
                            viz.screenText('dr(' + factorA + ') = ' + drA + ',   dr(' + factorB + ') = ' + drB, viz.width / 2, hintY + 25, viz.colors.teal, 13);
                            viz.screenText('dr(product) should be ' + drFactors, viz.width / 2, hintY + 50, viz.colors.orange, 13);

                            // Known digits sum
                            var knownSum = 0;
                            for (var j = 0; j < prodStr.length; j++) {
                                if (j !== missingPos) knownSum += parseInt(prodStr[j]);
                            }
                            viz.screenText('Sum of known digits: ' + knownSum, viz.width / 2, hintY + 75, viz.colors.purple, 13);
                            viz.screenText('Known sum + ? \u2261 ' + drFactors + ' (mod 9)', viz.width / 2, hintY + 100, viz.colors.purple, 13);

                            // Digit buttons
                            var btnY = 280;
                            var btnSize = 36;
                            var btnGap = 8;
                            var startBtnX = viz.width / 2 - (10 * (btnSize + btnGap) - btnGap) / 2;

                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            for (var d = 0; d <= 9; d++) {
                                var bx = startBtnX + d * (btnSize + btnGap);
                                var isCorrect = (d === missingDigit);
                                var isGuess = (d === guess);

                                if (revealed && isCorrect) {
                                    ctx.fillStyle = viz.colors.green;
                                } else if (isGuess && !revealed) {
                                    ctx.fillStyle = viz.colors.yellow + '88';
                                } else {
                                    ctx.fillStyle = viz.colors.grid;
                                }
                                ctx.fillRect(bx, btnY, btnSize, btnSize);
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, btnY, btnSize, btnSize);

                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('' + d, bx + btnSize / 2, btnY + btnSize / 2);
                            }

                            // Result
                            if (revealed) {
                                if (guess === missingDigit) {
                                    viz.screenText('Correct! The missing digit is ' + missingDigit + '.', viz.width / 2, 345, viz.colors.green, 15);
                                } else {
                                    viz.screenText('The missing digit was ' + missingDigit + '. (You guessed ' + guess + ')', viz.width / 2, 345, viz.colors.red, 14);
                                }
                                viz.screenText(factorA + ' \u00D7 ' + factorB + ' = ' + product, viz.width / 2, 370, viz.colors.white, 14);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (revealed) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var btnY = 280;
                            var btnSize = 36;
                            var btnGap = 8;
                            var startBtnX = viz.width / 2 - (10 * (btnSize + btnGap) - btnGap) / 2;

                            if (my >= btnY && my <= btnY + btnSize) {
                                for (var d = 0; d <= 9; d++) {
                                    var bx = startBtnX + d * (btnSize + btnGap);
                                    if (mx >= bx && mx <= bx + btnSize) {
                                        guess = d;
                                        revealed = true;
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            generatePuzzle();
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-digit-scramble',
                    title: 'Digit Scramble: Make It Divisible',
                    description: 'Rearrange the given digits to form a number divisible by the target divisor. Click digits to build your number.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var availableDigits = [];
                        var placedDigits = [];
                        var targetDiv = 4;
                        var message = '';

                        function generatePuzzle() {
                            var nDigits = 4;
                            availableDigits = [];
                            // Ensure at least one valid arrangement exists
                            var base = (Math.floor(Math.random() * 200) + 10) * targetDiv;
                            var baseStr = ('' + base).slice(0, nDigits);
                            while (baseStr.length < nDigits) baseStr = '' + (Math.floor(Math.random() * 9) + 1) + baseStr;
                            for (var i = 0; i < baseStr.length; i++) {
                                availableDigits.push(parseInt(baseStr[i]));
                            }
                            // Shuffle
                            for (var j = availableDigits.length - 1; j > 0; j--) {
                                var k = Math.floor(Math.random() * (j + 1));
                                var tmp = availableDigits[j];
                                availableDigits[j] = availableDigits[k];
                                availableDigits[k] = tmp;
                            }
                            placedDigits = [];
                            message = '';
                        }

                        generatePuzzle();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Rearrange Digits to Make Divisible by ' + targetDiv, viz.width / 2, 25, viz.colors.white, 15);

                            // Available digits
                            viz.screenText('Available digits (click to place):', viz.width / 2, 65, viz.colors.text, 12);
                            var digitSize = 44;
                            var digitGap = 10;
                            var totalAvail = availableDigits.length;
                            var startAvailX = viz.width / 2 - (totalAvail * (digitSize + digitGap) - digitGap) / 2;

                            ctx.font = 'bold 22px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            for (var i = 0; i < availableDigits.length; i++) {
                                var ax = startAvailX + i * (digitSize + digitGap);
                                ctx.fillStyle = viz.colors.blue + '44';
                                ctx.fillRect(ax, 85, digitSize, digitSize);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(ax, 85, digitSize, digitSize);
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('' + availableDigits[i], ax + digitSize / 2, 85 + digitSize / 2);
                            }

                            // Placed digits
                            viz.screenText('Your number:', viz.width / 2, 165, viz.colors.text, 12);
                            var totalSlots = availableDigits.length + placedDigits.length;
                            var startPlacedX = viz.width / 2 - (totalSlots * (digitSize + digitGap) - digitGap) / 2;

                            for (var p = 0; p < totalSlots; p++) {
                                var px = startPlacedX + p * (digitSize + digitGap);
                                if (p < placedDigits.length) {
                                    ctx.fillStyle = viz.colors.teal + '44';
                                    ctx.fillRect(px, 185, digitSize, digitSize);
                                    ctx.strokeStyle = viz.colors.teal;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(px, 185, digitSize, digitSize);
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText('' + placedDigits[p], px + digitSize / 2, 185 + digitSize / 2);
                                } else {
                                    ctx.strokeStyle = viz.colors.text + '44';
                                    ctx.lineWidth = 1;
                                    ctx.setLineDash([4, 4]);
                                    ctx.strokeRect(px, 185, digitSize, digitSize);
                                    ctx.setLineDash([]);
                                }
                            }

                            // Current number value
                            if (placedDigits.length > 0) {
                                var numVal = parseInt(placedDigits.join(''));
                                viz.screenText('= ' + numVal, viz.width / 2, 255, viz.colors.teal, 20);

                                if (placedDigits.length === totalSlots) {
                                    if (numVal % targetDiv === 0) {
                                        viz.screenText(numVal + ' \u00F7 ' + targetDiv + ' = ' + (numVal / targetDiv) + '  (divisible!)', viz.width / 2, 290, viz.colors.green, 15);
                                    } else {
                                        viz.screenText(numVal + ' \u00F7 ' + targetDiv + ' = ' + (numVal / targetDiv).toFixed(2) + '  (not divisible)', viz.width / 2, 290, viz.colors.red, 15);
                                        viz.screenText('Remainder: ' + (numVal % targetDiv), viz.width / 2, 312, viz.colors.orange, 13);
                                    }
                                }
                            }

                            if (message) {
                                viz.screenText(message, viz.width / 2, 345, viz.colors.yellow, 13);
                            }

                            // Divisibility hint
                            var hintText = '';
                            if (targetDiv === 3 || targetDiv === 9) {
                                var ds = 0;
                                for (var hi = 0; hi < availableDigits.length; hi++) ds += availableDigits[hi];
                                for (var hj = 0; hj < placedDigits.length; hj++) ds += placedDigits[hj];
                                hintText = 'Digit sum = ' + ds + ' (' + (ds % targetDiv === 0 ? 'divisible by ' + targetDiv : 'not divisible by ' + targetDiv) + ')';
                            } else if (targetDiv === 4) {
                                hintText = 'Hint: only the last two digits matter for div by 4';
                            } else if (targetDiv === 8) {
                                hintText = 'Hint: only the last three digits matter for div by 8';
                            } else if (targetDiv === 5) {
                                hintText = 'Hint: last digit must be 0 or 5';
                            }
                            if (hintText) {
                                viz.screenText(hintText, viz.width / 2, 365, viz.colors.purple, 11);
                            }
                        }

                        // Click to place/remove digits
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var digitSize = 44;
                            var digitGap = 10;
                            var totalSlots = availableDigits.length + placedDigits.length;

                            // Click on available digit to place it
                            var startAvailX = viz.width / 2 - (availableDigits.length * (digitSize + digitGap) - digitGap) / 2;
                            if (my >= 85 && my <= 85 + digitSize) {
                                for (var i = 0; i < availableDigits.length; i++) {
                                    var ax = startAvailX + i * (digitSize + digitGap);
                                    if (mx >= ax && mx <= ax + digitSize) {
                                        placedDigits.push(availableDigits[i]);
                                        availableDigits.splice(i, 1);
                                        message = '';
                                        draw();
                                        return;
                                    }
                                }
                            }

                            // Click on placed digit to return it
                            var startPlacedX = viz.width / 2 - (totalSlots * (digitSize + digitGap) - digitGap) / 2;
                            if (my >= 185 && my <= 185 + digitSize) {
                                for (var j = 0; j < placedDigits.length; j++) {
                                    var px = startPlacedX + j * (digitSize + digitGap);
                                    if (mx >= px && mx <= px + digitSize) {
                                        availableDigits.push(placedDigits[j]);
                                        placedDigits.splice(j, 1);
                                        message = '';
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        VizEngine.createSlider(controls, 'Divisor', 2, 11, targetDiv, 1, function(v) {
                            targetDiv = Math.round(v);
                            generatePuzzle();
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            generatePuzzle();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            while (placedDigits.length > 0) {
                                availableDigits.push(placedDigits.pop());
                            }
                            message = '';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The product \\(123 \\times 4? = 5?66\\) has two missing digits (represented by ?). Find both missing digits.',
                    hint: 'The product \\(123 \\times 40 = 4920\\) and \\(123 \\times 49 = 6027\\). Since the product is in the 5000s, the second factor must be in the mid-40s. Try values systematically.',
                    solution: '\\(123 \\times 45 = 5535\\) (no, last digits wrong). \\(123 \\times 46 = 5658\\) (no). \\(123 \\times 48 = 5904\\) (no). Actually, for the product to end in 66, we need \\(123 \\times d\\) to end in 66. Since \\(3 \\times 2 = 6\\), try \\(d\\) ending in 2: \\(123 \\times 42 = 5166\\). Yes! The product is 5166, so the missing digits are 2 and 1: \\(123 \\times 42 = 5166\\).'
                },
                {
                    question: 'Rearrange the digits 1, 2, 3, 4, 5, 6 to form a six-digit number that is simultaneously divisible by 4, 9, and 11.',
                    hint: 'The digit sum 1+2+3+4+5+6 = 21. For divisibility by 9, the digit sum must be divisible by 9, but 21 is not. Wait, re-read the problem. Is it possible? If not, prove it. If you may repeat digits, think about what digit sum would be needed.',
                    solution: 'The digit sum is \\(1+2+3+4+5+6 = 21\\), which is not divisible by 9 (\\(21 = 9 \\times 2 + 3\\)). Since every rearrangement of these digits has the same digit sum 21, no rearrangement is divisible by 9. The problem is impossible. This illustrates an important principle: the digit sum (and hence divisibility by 9) is an invariant of the digit set, not the arrangement.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Games, Puzzles, and Beyond',
            content: `
<h2>Games, Puzzles, and Beyond</h2>

<p>This chapter has shown that the divisibility theory developed throughout this course is not merely abstract: it underpins real strategies in games (Nim), explains why certain "magic" tricks always work (algebraic identities modulo 9, 10, 11), and provides practical error-detection methods (casting out nines).</p>

<div class="env-block remark">
    <div class="env-title">Connections</div>
    <div class="env-body">
        <p>The ideas here connect to several deeper topics:</p>
        <ul>
            <li><strong>Nim and Sprague-Grundy theory.</strong> Bouton's theorem is a special case of the Sprague-Grundy theorem, which assigns a "Grundy number" to every position in any impartial combinatorial game. The theory reduces any such game to an equivalent Nim position.</li>
            <li><strong>Casting out nines and check digits.</strong> The ISBN, UPC, credit card (Luhn algorithm), and other systems use modular arithmetic for error detection. These are industrial-strength descendants of the centuries-old practice of casting out nines.</li>
            <li><strong>Number puzzles and computational complexity.</strong> Some digit-rearrangement puzzles are instances of subset-sum or partition problems, which are NP-complete in general. The divisibility shortcuts we use (digit sums, last-digit rules) are the reason certain instances are easy despite the general hardness.</li>
        </ul>
    </div>
</div>

<p>The final two visualizations below let you practice with random puzzles. Use them to build speed and confidence with divisibility reasoning.</p>

<div class="viz-placeholder" data-viz="viz-number-puzzle-generator"></div>
`,
            visualizations: [
                {
                    id: 'viz-number-puzzle-generator',
                    title: 'Random Number Puzzle Generator',
                    description: 'Generate random divisibility puzzles, solve them, and check your answers. Covers missing digits, digit sums, and divisibility checks.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var puzzleType = 0;
                        var puzzle = null;
                        var userAnswer = '';
                        var showSolution = false;

                        var puzzleGenerators = [
                            // Type 0: What is the remainder?
                            function() {
                                var n = Math.floor(Math.random() * 9000) + 1000;
                                var d = [3, 7, 9, 11][Math.floor(Math.random() * 4)];
                                return {
                                    question: 'What is the remainder when ' + n + ' is divided by ' + d + '?',
                                    answer: '' + (n % d),
                                    hint: d === 3 || d === 9 ? 'Use the digit sum rule.' :
                                          d === 11 ? 'Use the alternating digit sum rule.' :
                                          'Divide directly or use modular arithmetic.',
                                    explanation: n + ' = ' + d + ' \u00D7 ' + Math.floor(n / d) + ' + ' + (n % d)
                                };
                            },
                            // Type 1: Missing digit for divisibility
                            function() {
                                var d = [3, 9][Math.floor(Math.random() * 2)];
                                var digits = [];
                                for (var i = 0; i < 4; i++) digits.push(Math.floor(Math.random() * 9) + 1);
                                var sum = 0;
                                for (var j = 0; j < digits.length; j++) sum += digits[j];
                                var missing = (d - (sum % d)) % d;
                                var pos = Math.floor(Math.random() * 5);
                                var allDigits = digits.slice();
                                allDigits.splice(pos, 0, missing);
                                var numStr = allDigits.join('');
                                var displayStr = '';
                                for (var k = 0; k < numStr.length; k++) {
                                    displayStr += (k === pos) ? '?' : numStr[k];
                                }
                                return {
                                    question: 'Replace ? in ' + displayStr + ' so the number is divisible by ' + d + '.',
                                    answer: '' + missing,
                                    hint: 'The digit sum must be divisible by ' + d + '. Known digits sum to ' + sum + '.',
                                    explanation: 'Digit sum of known digits = ' + sum + '. Need ' + sum + ' + ? \u2261 0 (mod ' + d + '). So ? = ' + missing + '.'
                                };
                            },
                            // Type 2: Is this divisible?
                            function() {
                                var n = Math.floor(Math.random() * 90000) + 10000;
                                var d = [4, 6, 8, 11][Math.floor(Math.random() * 4)];
                                var isDivisible = (n % d === 0);
                                return {
                                    question: 'Is ' + n + ' divisible by ' + d + '? (Type Y or N)',
                                    answer: isDivisible ? 'Y' : 'N',
                                    hint: d === 4 ? 'Check if the last two digits are divisible by 4.' :
                                          d === 6 ? 'Must be divisible by both 2 and 3.' :
                                          d === 8 ? 'Check if the last three digits are divisible by 8.' :
                                          'Alternating digit sum must be divisible by 11.',
                                    explanation: isDivisible ?
                                        'Yes: ' + n + ' / ' + d + ' = ' + (n / d) :
                                        'No: ' + n + ' / ' + d + ' = ' + (n / d).toFixed(4) + ' (remainder ' + (n % d) + ')'
                                };
                            },
                            // Type 3: Digital root
                            function() {
                                var n = Math.floor(Math.random() * 900000) + 100000;
                                var dr = n % 9;
                                if (dr === 0) dr = 9;
                                return {
                                    question: 'What is the digital root of ' + n + '?',
                                    answer: '' + dr,
                                    hint: 'Sum the digits. If the result has more than one digit, sum again.',
                                    explanation: (function() {
                                        var s = 0;
                                        var str = '' + n;
                                        for (var i = 0; i < str.length; i++) s += parseInt(str[i]);
                                        var desc = str.split('').join(' + ') + ' = ' + s;
                                        while (s >= 10) {
                                            var s2 = 0;
                                            var ss = '' + s;
                                            for (var j = 0; j < ss.length; j++) s2 += parseInt(ss[j]);
                                            desc += ', then ' + ss.split('').join(' + ') + ' = ' + s2;
                                            s = s2;
                                        }
                                        return desc;
                                    })()
                                };
                            }
                        ];

                        function generatePuzzle() {
                            puzzleType = Math.floor(Math.random() * puzzleGenerators.length);
                            puzzle = puzzleGenerators[puzzleType]();
                            userAnswer = '';
                            showSolution = false;
                        }

                        generatePuzzle();

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Number Puzzle Challenge', viz.width / 2, 25, viz.colors.white, 16);

                            // Question
                            viz.screenText(puzzle.question, viz.width / 2, 75, viz.colors.blue, 16);

                            // Hint
                            viz.screenText('Hint: ' + puzzle.hint, viz.width / 2, 120, viz.colors.text, 12);

                            // Answer input display
                            var answerDisplay = userAnswer.length > 0 ? userAnswer : '_';
                            viz.screenText('Your answer: ' + answerDisplay, viz.width / 2, 175, viz.colors.teal, 20);

                            // Digit/letter buttons
                            var btnY = 210;
                            var btnSize = 36;
                            var btnGap = 6;
                            var buttons = ['0','1','2','3','4','5','6','7','8','9','Y','N'];
                            var startBtnX = viz.width / 2 - (buttons.length * (btnSize + btnGap) - btnGap) / 2;

                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            for (var i = 0; i < buttons.length; i++) {
                                var bx = startBtnX + i * (btnSize + btnGap);
                                ctx.fillStyle = viz.colors.grid;
                                ctx.fillRect(bx, btnY, btnSize, btnSize);
                                ctx.strokeStyle = viz.colors.text + '66';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(bx, btnY, btnSize, btnSize);
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(buttons[i], bx + btnSize / 2, btnY + btnSize / 2);
                            }

                            // Result
                            if (showSolution) {
                                var correct = (userAnswer === puzzle.answer);
                                var resColor = correct ? viz.colors.green : viz.colors.red;
                                var resText = correct ? 'Correct!' : 'Answer: ' + puzzle.answer;
                                viz.screenText(resText, viz.width / 2, 280, resColor, 18);
                                viz.screenText(puzzle.explanation, viz.width / 2, 315, viz.colors.orange, 12);
                            }

                            viz.screenText('Click a digit/letter, then "Check" to verify.', viz.width / 2, 365, viz.colors.text, 11);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (showSolution) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var btnY = 210;
                            var btnSize = 36;
                            var btnGap = 6;
                            var buttons = ['0','1','2','3','4','5','6','7','8','9','Y','N'];
                            var startBtnX = viz.width / 2 - (buttons.length * (btnSize + btnGap) - btnGap) / 2;

                            if (my >= btnY && my <= btnY + btnSize) {
                                for (var i = 0; i < buttons.length; i++) {
                                    var bx = startBtnX + i * (btnSize + btnGap);
                                    if (mx >= bx && mx <= bx + btnSize) {
                                        userAnswer = buttons[i];
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Check', function() {
                            if (userAnswer.length > 0) {
                                showSolution = true;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Show Answer', function() {
                            userAnswer = puzzle.answer;
                            showSolution = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            generatePuzzle();
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the digital root of any perfect square is one of \\(\\{1, 4, 7, 9\\}\\). (That is, the only possible values of \\(n^2 \\bmod 9\\) for integer \\(n\\) are 0, 1, 4, 7.)',
                    hint: 'There are only 9 possible values of \\(n \\bmod 9\\). Square each and reduce modulo 9.',
                    solution: 'The squares modulo 9: \\(0^2=0, 1^2=1, 2^2=4, 3^2=0, 4^2=7, 5^2=7, 6^2=0, 7^2=4, 8^2=1\\). The possible residues are \\(\\{0, 1, 4, 7\\}\\). For nonzero squares, the digital root (which equals the residue mod 9, with 0 replaced by 9) is in \\(\\{1, 4, 7, 9\\}\\). So if a number has digital root 2, 3, 5, 6, or 8, it cannot be a perfect square.'
                },
                {
                    question: 'A six-digit number \\(N = \\overline{a_1 a_2 a_3 a_4 a_5 a_6}\\) is divisible by 7, 11, and 13. Show that \\(N\\) is divisible by 1001 and that \\(\\overline{a_1 a_2 a_3} + \\overline{a_4 a_5 a_6}\\) or \\(|\\overline{a_1 a_2 a_3} - \\overline{a_4 a_5 a_6}|\\) is divisible by 1001 (or is 0). Explain what this means for the digits.',
                    hint: 'Note that \\(7 \\times 11 \\times 13 = 1001\\) and \\(1001 \\times 999 = 999{,}999\\). Also, \\(N = \\overline{a_1a_2a_3} \\times 1000 + \\overline{a_4a_5a_6}\\).',
                    solution: '\\(7 \\times 11 \\times 13 = 1001\\). If \\(N\\) is divisible by all three, it is divisible by 1001. Write \\(N = A \\times 1000 + B\\) where \\(A = \\overline{a_1a_2a_3}\\) and \\(B = \\overline{a_4a_5a_6}\\). Since \\(1000 \\equiv -1 \\pmod{1001}\\), we get \\(N \\equiv -A + B \\pmod{1001}\\). So \\(1001 | N\\) implies \\(1001 | (B - A)\\). Since \\(0 \\leq A, B \\leq 999\\), we have \\(-999 \\leq B - A \\leq 999\\), so \\(B - A = 0\\), meaning \\(A = B\\). The six-digit number is of the form \\(\\overline{abcabc}\\), for example 123123 or 571571.'
                },
                {
                    question: 'In the "misere" variant of Nim (the player who takes the last stone <em>loses</em>), the strategy differs from normal Nim. For a game with heaps \\((1, 1, 1)\\), who wins under misere rules? What about \\((1, 2, 3)\\)?',
                    hint: 'In misere Nim, the strategy is the same as normal Nim except when all heaps have size \\(\\leq 1\\). In that case, you want to leave an odd number of heaps (not even, as in normal play).',
                    solution: 'For \\((1,1,1)\\): there are 3 heaps, all of size 1. The first player must take one stone, leaving \\((1,1,0)\\), i.e., 2 heaps of size 1. The second player takes one, leaving \\((1,0,0)\\). The first player must take the last stone and loses. So the second player wins under misere with \\((1,1,1)\\). For \\((1,2,3)\\): the nim-sum is \\(1 \\oplus 2 \\oplus 3 = 0\\). In misere Nim, when heaps are not all \\(\\leq 1\\), the same XOR strategy applies but with the endgame twist: aim to leave an odd number of heaps of size 1. Since the nim-sum is 0 and not all heaps are size \\(\\leq 1\\), this is actually a winning position for the first player under misere rules (the standard strategy inverts in the endgame).'
                }
            ]
        }
    ]
});
