window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00',
    number: 0,
    title: 'The World of Whole Numbers',
    subtitle: 'Numbers are our oldest friends',
    sections: [
        // ================================================================
        // SECTION 1: Why Study Numbers?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Study Numbers?',
            content: `
<h2>Why Study Numbers?</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>Pick any whole number. If it is even, divide it by 2. If it is odd, multiply it by 3 and add 1. Repeat. For example, starting with 6: 6, 3, 10, 5, 16, 8, 4, 2, 1. Try it with 7. Does the sequence always reach 1?</p>
        <p>This is called the <strong>Collatz conjecture</strong>, and nobody knows the answer. Simple rules about whole numbers can lead to deep mysteries that even the best mathematicians have not solved.</p>
    </div>
</div>

<p>Numbers are everywhere. We count with them, measure with them, and build with them. The whole numbers 1, 2, 3, 4, ... are the most basic objects in all of mathematics, yet they hold surprises that have fascinated people for thousands of years.</p>

<p><strong>Number theory</strong> is the branch of mathematics that studies whole numbers and their properties. It asks questions like:</p>
<ul>
    <li>Which numbers are prime? How are they distributed?</li>
    <li>When can we solve equations using only whole numbers?</li>
    <li>What patterns hide inside sequences of numbers?</li>
</ul>

<p>Number theory is sometimes called "the queen of mathematics" (a phrase attributed to Carl Friedrich Gauss), because its questions are easy to state but often incredibly hard to answer. Many of the greatest unsolved problems in mathematics are about whole numbers.</p>

<h3>Numbers in the Real World</h3>

<p>Number theory is not just abstract beauty. It powers the technology we use every day:</p>
<ul>
    <li><strong>Cryptography:</strong> The security of online banking and messaging relies on properties of prime numbers.</li>
    <li><strong>Computer science:</strong> Hash functions, error-correcting codes, and random number generators all use number-theoretic ideas.</li>
    <li><strong>Music and art:</strong> Patterns in numbers appear in musical scales, rhythmic structures, and visual designs.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The ancient Babylonians (around 1800 BCE) already knew about Pythagorean triples like (3, 4, 5). The Greeks, especially Euclid (around 300 BCE), proved foundational results about primes and divisibility that we still use today. Number theory is one of the oldest and most enduring areas of human knowledge.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Natural Numbers
        // ================================================================
        {
            id: 'sec-natural',
            title: 'Natural Numbers',
            content: `
<h2>Natural Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Natural Numbers)</div>
    <div class="env-body">
        <p>The <strong>natural numbers</strong> are the counting numbers \\(1, 2, 3, 4, 5, \\ldots\\) They form an infinite sequence: no matter how large a number you name, there is always a larger one.</p>
    </div>
</div>

<p>What makes the natural numbers special? Three key properties:</p>

<ol>
    <li><strong>A starting point:</strong> The number 1 is the smallest natural number.</li>
    <li><strong>A successor:</strong> Every natural number \\(n\\) has a next number, \\(n + 1\\).</li>
    <li><strong>No gaps:</strong> You can reach any natural number by starting at 1 and repeatedly adding 1.</li>
</ol>

<p>These properties capture the idea of counting. When you count objects (one apple, two apples, three apples, ...), you are walking along the natural numbers one step at a time.</p>

<div class="env-block remark">
    <div class="env-title">What About Zero?</div>
    <div class="env-body">
        <p>Some books include 0 as a natural number, others do not. In number theory, we usually start at 1, but we will freely use 0 when it is convenient. The set of natural numbers is written \\(\\mathbb{N}\\), and when we include zero we sometimes write \\(\\mathbb{N}_0\\) or \\(\\mathbb{Z}_{\\geq 0}\\).</p>
    </div>
</div>

<h3>Closure Properties</h3>

<p>The natural numbers are <strong>closed</strong> under addition and multiplication: if you add or multiply two natural numbers, you always get another natural number.</p>
<ul>
    <li>\\(3 + 5 = 8\\) (a natural number)</li>
    <li>\\(4 \\times 7 = 28\\) (a natural number)</li>
</ul>

<p>But they are <em>not</em> closed under subtraction or division:</p>
<ul>
    <li>\\(3 - 5 = -2\\) (not a natural number)</li>
    <li>\\(7 \\div 3 = 2.333\\ldots\\) (not a natural number)</li>
</ul>

<p>This is one reason mathematicians invented larger number systems: integers (to handle subtraction), rationals (to handle division), and beyond.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 0.1 (Well-Ordering Principle)</div>
    <div class="env-body">
        <p>Every non-empty set of natural numbers has a smallest element.</p>
    </div>
</div>

<p>This may seem obvious, but it is surprisingly powerful. Many proofs in number theory work by contradiction: assume something is false, consider the set of counterexamples, take the smallest one, and derive a contradiction. We will see this technique repeatedly.</p>

<div class="viz-placeholder" data-viz="viz-number-line"></div>
`,
            visualizations: [
                {
                    id: 'viz-number-line',
                    title: 'Interactive Number Line',
                    description: 'Click on the number line to mark numbers. See their positions, distances, and relationships. Use the slider to zoom in and out.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 280,
                            originX: 40, originY: 140, scale: 40
                        });

                        var marked = [];
                        var maxNum = 12;

                        VizEngine.createSlider(controls, 'Range', 5, 25, maxNum, 1, function(v) {
                            maxNum = Math.round(v);
                            viz.scale = Math.max(15, Math.min(40, (viz.width - 80) / maxNum));
                            marked = marked.filter(function(m) { return m <= maxNum; });
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            marked = [];
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var lineY = 140;
                            var startX = 40;

                            viz.screenText('The Natural Numbers', viz.width / 2, 20, viz.colors.white, 16);

                            // Draw number line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(startX, lineY);
                            ctx.lineTo(startX + maxNum * viz.scale + 20, lineY);
                            ctx.stroke();

                            // Arrow at end
                            var arrowX = startX + maxNum * viz.scale + 20;
                            ctx.fillStyle = viz.colors.axis;
                            ctx.beginPath();
                            ctx.moveTo(arrowX, lineY);
                            ctx.lineTo(arrowX - 10, lineY - 5);
                            ctx.lineTo(arrowX - 10, lineY + 5);
                            ctx.closePath();
                            ctx.fill();

                            // Tick marks and labels
                            for (var i = 0; i <= maxNum; i++) {
                                var x = startX + i * viz.scale;
                                var isMarked = marked.indexOf(i) >= 0;

                                // Tick
                                ctx.strokeStyle = isMarked ? viz.colors.blue : viz.colors.axis;
                                ctx.lineWidth = isMarked ? 3 : 1;
                                ctx.beginPath();
                                ctx.moveTo(x, lineY - 8);
                                ctx.lineTo(x, lineY + 8);
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = isMarked ? viz.colors.blue : viz.colors.text;
                                ctx.font = (isMarked ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(i.toString(), x, lineY + 14);

                                // Dot for marked
                                if (isMarked) {
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath();
                                    ctx.arc(x, lineY, 6, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Show distances between consecutive marked numbers
                            var sorted = marked.slice().sort(function(a, b) { return a - b; });
                            if (sorted.length >= 2) {
                                for (var j = 0; j < sorted.length - 1; j++) {
                                    var a = sorted[j];
                                    var b = sorted[j + 1];
                                    var ax = startX + a * viz.scale;
                                    var bx = startX + b * viz.scale;
                                    var arcY = lineY - 35 - j * 18;

                                    ctx.strokeStyle = viz.colors.teal + '88';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(ax, lineY - 10);
                                    ctx.quadraticCurveTo((ax + bx) / 2, arcY - 15, bx, lineY - 10);
                                    ctx.stroke();

                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText('d=' + (b - a), (ax + bx) / 2, arcY - 12);
                                }
                            }

                            // Info text
                            if (sorted.length > 0) {
                                viz.screenText('Marked: {' + sorted.join(', ') + '}', viz.width / 2, viz.height - 40, viz.colors.white, 12);
                                if (sorted.length >= 2) {
                                    var sum = 0;
                                    for (var k = 0; k < sorted.length; k++) sum += sorted[k];
                                    viz.screenText('Sum = ' + sum + '   Count = ' + sorted.length, viz.width / 2, viz.height - 20, viz.colors.teal, 11);
                                }
                            } else {
                                viz.screenText('Click on the number line to mark numbers', viz.width / 2, viz.height - 30, viz.colors.text, 12);
                            }
                        }

                        // Click handler
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var cx = e.clientX - rect.left;
                            var startX = 40;
                            var num = Math.round((cx - startX) / viz.scale);
                            if (num >= 0 && num <= maxNum) {
                                var idx = marked.indexOf(num);
                                if (idx >= 0) {
                                    marked.splice(idx, 1);
                                } else {
                                    marked.push(num);
                                }
                                draw();
                            }
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is the number 0 a natural number? What about -3? What about 2.5? Explain why or why not.',
                    hint: 'Recall the definition: natural numbers are the counting numbers 1, 2, 3, ...',
                    solution: 'By our convention, 0 is not a natural number (though some authors include it). The number -3 is not a natural number because natural numbers are positive. The number 2.5 is not a natural number because natural numbers are whole (no fractions or decimals). Only the positive integers 1, 2, 3, ... are natural numbers.'
                },
                {
                    question: 'Give an example showing that the natural numbers are not closed under subtraction. Then give an example showing they are not closed under division.',
                    hint: 'Find two natural numbers whose difference (or quotient) is not a natural number.',
                    solution: 'Subtraction: \\(2 - 5 = -3\\), which is not a natural number. Division: \\(5 \\div 2 = 2.5\\), which is not a natural number. In both cases, we started with natural numbers but the result left the natural numbers.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Even and Odd
        // ================================================================
        {
            id: 'sec-even-odd',
            title: 'Even and Odd',
            content: `
<h2>Even and Odd Numbers</h2>

<div class="env-block intuition">
    <div class="env-title">Pairing Up</div>
    <div class="env-body">
        <p>Imagine you have a pile of marbles and you try to split them into two equal groups. If you can do it perfectly, the number is <em>even</em>. If one marble is left over, the number is <em>odd</em>. This simple idea of "pairing up" leads to powerful results.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Even and Odd)</div>
    <div class="env-body">
        <p>An integer \\(n\\) is <strong>even</strong> if \\(n = 2k\\) for some integer \\(k\\). An integer \\(n\\) is <strong>odd</strong> if \\(n = 2k + 1\\) for some integer \\(k\\).</p>
        <p>Every integer is either even or odd, never both.</p>
    </div>
</div>

<p>The even numbers are \\(\\ldots, -4, -2, 0, 2, 4, 6, 8, \\ldots\\) and the odd numbers are \\(\\ldots, -3, -1, 1, 3, 5, 7, 9, \\ldots\\)</p>

<h3>Arithmetic Rules</h3>

<p>Even and odd numbers follow predictable rules when you add or multiply them:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 0.2 (Even-Odd Arithmetic)</div>
    <div class="env-body">
        <p><strong>Addition:</strong></p>
        <ul>
            <li>even + even = even</li>
            <li>odd + odd = even</li>
            <li>even + odd = odd</li>
        </ul>
        <p><strong>Multiplication:</strong></p>
        <ul>
            <li>even \\(\\times\\) even = even</li>
            <li>odd \\(\\times\\) odd = odd</li>
            <li>even \\(\\times\\) odd = even</li>
        </ul>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (odd + odd = even)</div>
    <div class="env-body">
        <p>Let \\(a = 2j + 1\\) and \\(b = 2k + 1\\) be odd numbers. Then</p>
        \\[a + b = (2j + 1) + (2k + 1) = 2j + 2k + 2 = 2(j + k + 1).\\]
        <p>Since \\(j + k + 1\\) is an integer, \\(a + b\\) is even.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>Notice a pattern in the multiplication rules: a product is odd <em>only when both factors are odd</em>. If either factor is even, the product is even. This observation turns out to be surprisingly useful throughout number theory.</p>

<div class="env-block example">
    <div class="env-title">Example: Is the sum 1 + 2 + 3 + ... + 100 even or odd?</div>
    <div class="env-body">
        <p>We can pair numbers: (1 + 100) + (2 + 99) + ... + (50 + 51). Each pair sums to 101 (odd), and there are 50 pairs. So the total is 50 \\(\\times\\) 101 = 5050. Since 50 is even, even \\(\\times\\) odd = even. The sum is even.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-even-odd"></div>
`,
            visualizations: [
                {
                    id: 'viz-even-odd',
                    title: 'Even and Odd: Checkerboard Pattern',
                    description: 'Numbers colored by parity: blue for even, orange for odd. Watch the checkerboard pattern emerge. Click a cell to see the addition and multiplication rules in action.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var gridSize = 10;
                        var selectedA = null;
                        var selectedB = null;

                        VizEngine.createButton(controls, 'Clear Selection', function() {
                            selectedA = null;
                            selectedB = null;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cellSize = Math.min(38, (viz.width - 80) / gridSize);
                            var startX = (viz.width - gridSize * cellSize) / 2;
                            var startY = 50;

                            viz.screenText('Numbers 1 to ' + (gridSize * gridSize) + ': Even and Odd', viz.width / 2, 20, viz.colors.white, 15);

                            for (var row = 0; row < gridSize; row++) {
                                for (var col = 0; col < gridSize; col++) {
                                    var num = row * gridSize + col + 1;
                                    var x = startX + col * cellSize;
                                    var y = startY + row * cellSize;
                                    var isEven = num % 2 === 0;

                                    var isSelectedA = (selectedA === num);
                                    var isSelectedB = (selectedB === num);

                                    // Background
                                    if (isSelectedA) {
                                        ctx.fillStyle = viz.colors.green;
                                    } else if (isSelectedB) {
                                        ctx.fillStyle = viz.colors.purple;
                                    } else {
                                        ctx.fillStyle = isEven ? viz.colors.blue + '55' : viz.colors.orange + '55';
                                    }
                                    ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

                                    // Border
                                    ctx.strokeStyle = isEven ? viz.colors.blue + '88' : viz.colors.orange + '88';
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);

                                    // Number
                                    ctx.fillStyle = (isSelectedA || isSelectedB) ? viz.colors.white : (isEven ? viz.colors.blue : viz.colors.orange);
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(num.toString(), x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Legend
                            var legY = startY + gridSize * cellSize + 15;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(startX, legY, 14, 14);
                            ctx.fillText('Even', startX + 20, legY + 11);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(startX + 80, legY, 14, 14);
                            ctx.fillText('Odd', startX + 100, legY + 11);

                            // Show arithmetic if two numbers selected
                            if (selectedA !== null && selectedB !== null) {
                                var a = selectedA, b = selectedB;
                                var aType = a % 2 === 0 ? 'even' : 'odd';
                                var bType = b % 2 === 0 ? 'even' : 'odd';
                                var sumVal = a + b;
                                var prodVal = a * b;
                                var sumType = sumVal % 2 === 0 ? 'even' : 'odd';
                                var prodType = prodVal % 2 === 0 ? 'even' : 'odd';

                                var infoY = legY + 30;
                                viz.screenText(
                                    a + ' (' + aType + ') + ' + b + ' (' + bType + ') = ' + sumVal + ' (' + sumType + ')',
                                    viz.width / 2, infoY, viz.colors.teal, 13
                                );
                                viz.screenText(
                                    a + ' (' + aType + ') \u00D7 ' + b + ' (' + bType + ') = ' + prodVal + ' (' + prodType + ')',
                                    viz.width / 2, infoY + 20, viz.colors.teal, 13
                                );
                            } else if (selectedA !== null) {
                                viz.screenText('Click another number to see arithmetic rules', viz.width / 2, legY + 35, viz.colors.text, 11);
                            } else {
                                viz.screenText('Click two numbers to see even/odd arithmetic', viz.width / 2, legY + 35, viz.colors.text, 11);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var cx = e.clientX - rect.left;
                            var cy = e.clientY - rect.top;
                            var cellSize = Math.min(38, (viz.width - 80) / gridSize);
                            var startX = (viz.width - gridSize * cellSize) / 2;
                            var startY = 50;

                            var col = Math.floor((cx - startX) / cellSize);
                            var row = Math.floor((cy - startY) / cellSize);
                            if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
                                var num = row * gridSize + col + 1;
                                if (selectedA === null) {
                                    selectedA = num;
                                } else if (selectedB === null) {
                                    selectedB = num;
                                } else {
                                    selectedA = num;
                                    selectedB = null;
                                }
                                draw();
                            }
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that odd \\(\\times\\) odd = odd using the definition of odd numbers.',
                    hint: 'Write the two odd numbers as \\(2j + 1\\) and \\(2k + 1\\), multiply them out, and show the result has the form \\(2m + 1\\).',
                    solution: 'Let \\(a = 2j + 1\\) and \\(b = 2k + 1\\). Then \\(ab = (2j+1)(2k+1) = 4jk + 2j + 2k + 1 = 2(2jk + j + k) + 1\\). Since \\(2jk + j + k\\) is an integer, \\(ab\\) has the form \\(2m + 1\\), so it is odd.'
                },
                {
                    question: 'Can the sum of three odd numbers ever be even? Why or why not?',
                    hint: 'Think about it step by step: first add two odd numbers, then add the third.',
                    solution: 'No. The sum of two odd numbers is even (odd + odd = even). Then even + odd = odd. So the sum of three odd numbers is always odd. More generally, the sum of an odd count of odd numbers is always odd.'
                },
                {
                    question: 'The product \\(1 \\times 2 \\times 3 \\times \\cdots \\times n\\) is called \\(n!\\) (n factorial). For which values of \\(n \\geq 1\\) is \\(n!\\) odd?',
                    hint: 'A product is even if any factor is even. What is the smallest even number?',
                    solution: 'Only \\(n = 1\\) gives an odd factorial (\\(1! = 1\\)). For \\(n \\geq 2\\), the product includes the factor 2, making it even. Since even \\(\\times\\) anything = even, once a factor of 2 appears, the entire product is even.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Number Line
        // ================================================================
        {
            id: 'sec-number-line',
            title: 'The Number Line',
            content: `
<h2>The Number Line</h2>

<p>The <strong>number line</strong> is a simple but powerful way to visualize numbers. Every natural number corresponds to a point on the line, equally spaced, marching off to the right forever.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Ordering)</div>
    <div class="env-body">
        <p>For natural numbers \\(a\\) and \\(b\\), we say \\(a < b\\) (read "\\(a\\) is less than \\(b\\)") if \\(b - a\\) is a positive natural number. Equivalently, \\(a\\) sits to the left of \\(b\\) on the number line.</p>
    </div>
</div>

<h3>Between Two Numbers</h3>

<p>How many natural numbers lie strictly between \\(a\\) and \\(b\\) (where \\(a < b\\))? They are \\(a+1, a+2, \\ldots, b-1\\), which gives \\(b - a - 1\\) numbers. For example, between 3 and 8 there are \\(8 - 3 - 1 = 4\\) numbers: 4, 5, 6, 7.</p>

<h3>Distance</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Distance)</div>
    <div class="env-body">
        <p>The <strong>distance</strong> between two numbers \\(a\\) and \\(b\\) on the number line is \\(|a - b|\\), the absolute value of their difference. Distance is always non-negative.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>The distance between 3 and 11 is \\(|3 - 11| = 8\\). The distance between 11 and 3 is also \\(|11 - 3| = 8\\). Distance does not depend on direction.</p>
    </div>
</div>

<h3>Counting in a Range</h3>

<p>A useful formula: the number of integers from \\(a\\) to \\(b\\) (inclusive) is \\(b - a + 1\\). For example, from 5 to 12 there are \\(12 - 5 + 1 = 8\\) integers: 5, 6, 7, 8, 9, 10, 11, 12.</p>

<div class="env-block remark">
    <div class="env-title">Fence Post Counting</div>
    <div class="env-body">
        <p>This \\(b - a + 1\\) formula is an example of "fence post counting." If you build a straight fence 10 meters long with a post every meter, you need 11 posts, not 10. The extra "+1" trips up even experienced mathematicians. Always check your counting with a small example.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'How many natural numbers are there from 1 to 100 (inclusive)? From 37 to 82 (inclusive)?',
                    hint: 'Use the formula: count = last - first + 1.',
                    solution: 'From 1 to 100: \\(100 - 1 + 1 = 100\\) numbers. From 37 to 82: \\(82 - 37 + 1 = 46\\) numbers.'
                },
                {
                    question: 'How many even numbers are there between 1 and 100 (inclusive)? How many odd numbers?',
                    hint: 'List the even numbers: 2, 4, 6, ..., 100. How many terms are in this list?',
                    solution: 'The even numbers from 1 to 100 are 2, 4, 6, ..., 100. This is the same as \\(2 \\times 1, 2 \\times 2, \\ldots, 2 \\times 50\\), so there are 50 even numbers. The odd numbers are 1, 3, 5, ..., 99, which is also 50 numbers. In general, among any \\(2n\\) consecutive integers starting from 1, exactly half are even and half are odd.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Number Patterns
        // ================================================================
        {
            id: 'sec-patterns',
            title: 'Number Patterns',
            content: `
<h2>Number Patterns</h2>

<div class="env-block intuition">
    <div class="env-title">Numbers You Can See</div>
    <div class="env-body">
        <p>Ancient mathematicians loved to arrange pebbles into geometric shapes. The number of pebbles needed to form a triangle, a square, or a pentagon gives rise to special sequences of numbers. These "figurate numbers" reveal deep connections between geometry and arithmetic.</p>
    </div>
</div>

<h3>Triangular Numbers</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Triangular Numbers)</div>
    <div class="env-body">
        <p>The \\(n\\)-th <strong>triangular number</strong> \\(T_n\\) is the sum of the first \\(n\\) natural numbers:</p>
        \\[T_n = 1 + 2 + 3 + \\cdots + n = \\frac{n(n+1)}{2}.\\]
        <p>The first few triangular numbers are: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof of the Formula (Gauss's Trick)</div>
    <div class="env-body">
        <p>Write the sum twice, once forwards and once backwards:</p>
        \\[S = 1 + 2 + 3 + \\cdots + n\\]
        \\[S = n + (n-1) + (n-2) + \\cdots + 1\\]
        <p>Adding column by column: \\(2S = (n+1) + (n+1) + \\cdots + (n+1) = n(n+1)\\), so \\(S = n(n+1)/2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Young Gauss</div>
    <div class="env-body">
        <p>Legend has it that the mathematician Carl Friedrich Gauss discovered this trick as a schoolchild, when his teacher asked the class to add up 1 + 2 + ... + 100 to keep them busy. Gauss answered almost immediately: 5050.</p>
    </div>
</div>

<h3>Square Numbers</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Square Numbers)</div>
    <div class="env-body">
        <p>The \\(n\\)-th <strong>square number</strong> is \\(n^2\\). The first few are: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...</p>
    </div>
</div>

<p>Here is a beautiful connection: each square number is the sum of consecutive odd numbers!</p>
\\[1 = 1, \\quad 4 = 1 + 3, \\quad 9 = 1 + 3 + 5, \\quad 16 = 1 + 3 + 5 + 7, \\quad \\ldots\\]

<div class="env-block theorem">
    <div class="env-title">Theorem 0.3 (Odd Number Sum)</div>
    <div class="env-body">
        <p>The sum of the first \\(n\\) odd numbers equals \\(n^2\\):</p>
        \\[1 + 3 + 5 + \\cdots + (2n - 1) = n^2.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>The \\(k\\)-th odd number is \\(2k - 1\\). Sum them:</p>
        \\[\\sum_{k=1}^{n} (2k - 1) = 2 \\cdot \\frac{n(n+1)}{2} - n = n^2 + n - n = n^2.\\]
    </div>
    <div class="qed">&marker;</div>
</div>

<p>There is also a geometric way to see this: to go from an \\(n \\times n\\) square to an \\((n+1) \\times (n+1)\\) square, you add an L-shaped border of \\(2n + 1\\) dots (the next odd number).</p>

<h3>Pentagonal and Beyond</h3>

<p>The \\(n\\)-th <strong>pentagonal number</strong> is \\(P_n = n(3n - 1)/2\\). The first few are: 1, 5, 12, 22, 35, 51, ...</p>

<p>In general, the \\(n\\)-th \\(s\\)-gonal number (for an \\(s\\)-sided polygon) is:</p>
\\[\\frac{n[(s-2)n - (s-4)]}{2}.\\]

<p>Setting \\(s = 3\\) gives the triangular numbers, \\(s = 4\\) gives the squares, \\(s = 5\\) gives the pentagonal numbers, and so on.</p>

<div class="viz-placeholder" data-viz="viz-triangular-numbers"></div>

<div class="viz-placeholder" data-viz="viz-square-numbers"></div>

<div class="viz-placeholder" data-viz="viz-number-spiral"></div>

<div class="viz-placeholder" data-viz="viz-pattern-finder"></div>
`,
            visualizations: [
                {
                    id: 'viz-triangular-numbers',
                    title: 'Building Triangular Numbers',
                    description: 'Watch triangular numbers grow row by row. Each new row adds n more dots to form T(n). The formula n(n+1)/2 counts all the dots.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 1;
                        var maxN = 8;
                        var animating = false;

                        VizEngine.createSlider(controls, 'n', 1, 10, n, 1, function(v) {
                            n = Math.round(v);
                            maxN = n;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate Build', function() {
                            if (animating) return;
                            animating = true;
                            n = 0;
                            function step() {
                                n++;
                                if (n > maxN) { animating = false; return; }
                                draw();
                                setTimeout(step, 500);
                            }
                            step();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var Tn = n * (n + 1) / 2;

                            viz.screenText('Triangular Number T(' + n + ') = ' + Tn, viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('T(n) = n(n+1)/2 = ' + n + '\u00D7' + (n+1) + '/2 = ' + Tn, viz.width / 2, 42, viz.colors.teal, 12);

                            // Draw dots in triangle formation
                            var dotR = Math.max(4, Math.min(14, 160 / n));
                            var spacing = dotR * 2.8;
                            var triHeight = n * spacing;
                            var startY = 70;

                            var rowColors = [
                                viz.colors.blue, viz.colors.teal, viz.colors.orange,
                                viz.colors.green, viz.colors.purple, viz.colors.pink,
                                viz.colors.yellow, viz.colors.red, viz.colors.blue, viz.colors.teal
                            ];

                            for (var row = 1; row <= n; row++) {
                                var rowWidth = row * spacing;
                                var rowStartX = viz.width / 2 - rowWidth / 2 + spacing / 2;
                                var rowY = startY + (row - 1) * spacing;
                                var color = rowColors[(row - 1) % rowColors.length];

                                for (var col = 0; col < row; col++) {
                                    var dx = rowStartX + col * spacing;
                                    ctx.fillStyle = color;
                                    ctx.beginPath();
                                    ctx.arc(dx, rowY, dotR, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                // Row label
                                ctx.fillStyle = color;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('+' + row, viz.width / 2 + rowWidth / 2 + dotR + 8, rowY);
                            }

                            // Show sequence at bottom
                            var seqY = startY + n * spacing + 30;
                            var seqStr = '';
                            for (var i = 1; i <= Math.min(n, 10); i++) {
                                if (i > 1) seqStr += ', ';
                                seqStr += (i * (i + 1) / 2);
                            }
                            viz.screenText('T(1), T(2), ... = ' + seqStr, viz.width / 2, seqY, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-square-numbers',
                    title: 'Building Square Numbers',
                    description: 'See how square numbers grow by adding L-shaped borders. Each L-shape contains the next odd number of dots, showing that n^2 = 1 + 3 + 5 + ... + (2n-1).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 4;
                        var highlight = 0;

                        VizEngine.createSlider(controls, 'n', 1, 8, n, 1, function(v) {
                            n = Math.round(v);
                            highlight = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Show L-shapes', function() {
                            highlight = (highlight % n) + 1;
                            draw();
                        });

                        var layerColors = [
                            '#58a6ff', '#3fb9a0', '#f0883e', '#3fb950',
                            '#bc8cff', '#f778ba', '#d29922', '#f85149'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Square Number ' + n + '\u00B2 = ' + (n * n), viz.width / 2, 20, viz.colors.white, 15);

                            // Build odd-number sum string
                            var sumStr = '';
                            for (var i = 1; i <= n; i++) {
                                if (i > 1) sumStr += ' + ';
                                sumStr += (2 * i - 1);
                            }
                            sumStr += ' = ' + (n * n);
                            viz.screenText(sumStr, viz.width / 2, 42, viz.colors.teal, 12);

                            // Draw n x n grid of dots
                            var dotR = Math.max(5, Math.min(16, 200 / n));
                            var spacing = dotR * 2.8;
                            var gridSize = n * spacing;
                            var startX = viz.width / 2 - gridSize / 2 + spacing / 2;
                            var startY = 70;

                            for (var row = 0; row < n; row++) {
                                for (var col = 0; col < n; col++) {
                                    // Determine which "layer" this dot belongs to
                                    var layer = Math.max(row, col) + 1;
                                    var color = layerColors[(layer - 1) % layerColors.length];

                                    var isHighlighted = (highlight > 0 && layer === highlight);
                                    var isDimmed = (highlight > 0 && layer !== highlight);

                                    var dx = startX + col * spacing;
                                    var dy = startY + row * spacing;

                                    if (isDimmed) {
                                        ctx.fillStyle = color + '33';
                                    } else {
                                        ctx.fillStyle = color;
                                    }
                                    ctx.beginPath();
                                    ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
                                    ctx.fill();

                                    if (isHighlighted) {
                                        ctx.strokeStyle = viz.colors.white;
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.arc(dx, dy, dotR + 2, 0, Math.PI * 2);
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Show layer info
                            var infoY = startY + n * spacing + 20;
                            if (highlight > 0) {
                                var lCount = 2 * highlight - 1;
                                viz.screenText(
                                    'Layer ' + highlight + ': L-shape adds ' + lCount + ' dots (the ' + highlight + ordSuffix(highlight) + ' odd number)',
                                    viz.width / 2, infoY, layerColors[(highlight - 1) % layerColors.length], 13
                                );
                            } else {
                                viz.screenText('Click "Show L-shapes" to highlight each layer', viz.width / 2, infoY, viz.colors.text, 12);
                            }

                            // Show legend
                            var legY = infoY + 30;
                            for (var k = 1; k <= n; k++) {
                                var lx = viz.width / 2 - (n * 50) / 2 + (k - 1) * 50;
                                ctx.fillStyle = layerColors[(k - 1) % layerColors.length];
                                ctx.fillRect(lx, legY, 10, 10);
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('+' + (2 * k - 1), lx + 14, legY + 5);
                            }
                        }

                        function ordSuffix(n) {
                            if (n === 1) return 'st';
                            if (n === 2) return 'nd';
                            if (n === 3) return 'rd';
                            return 'th';
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-number-spiral',
                    title: 'Number Spiral (Ulam Spiral)',
                    description: 'Numbers arranged in a spiral, with primes highlighted. Stanislaw Ulam discovered that primes often line up along diagonal lines in this arrangement. Can you spot the patterns?',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var spiralSize = 15;
                        var showPrimesOnly = false;

                        VizEngine.createSlider(controls, 'Size', 7, 31, spiralSize, 2, function(v) {
                            spiralSize = Math.round(v);
                            if (spiralSize % 2 === 0) spiralSize++;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Toggle Primes Only', function() {
                            showPrimesOnly = !showPrimesOnly;
                            draw();
                        });

                        // Sieve primes
                        var maxNum = 1000;
                        var isPrime = new Uint8Array(maxNum + 1);
                        isPrime[2] = 1;
                        for (var i = 3; i <= maxNum; i += 2) isPrime[i] = 1;
                        for (var i = 3; i * i <= maxNum; i += 2) {
                            if (isPrime[i]) {
                                for (var j = i * i; j <= maxNum; j += 2 * i) isPrime[j] = 0;
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var total = spiralSize * spiralSize;

                            viz.screenText('Ulam Spiral (' + spiralSize + '\u00D7' + spiralSize + ')', viz.width / 2, 18, viz.colors.white, 14);

                            // Generate spiral coordinates
                            var positions = [];
                            var cx = Math.floor(spiralSize / 2);
                            var cy = Math.floor(spiralSize / 2);
                            var x = cx, y = cy;
                            var dx = 1, dy = 0;
                            var steps = 1, stepCount = 0, turnCount = 0;

                            positions.push([x, y]);
                            for (var i = 1; i < total; i++) {
                                x += dx;
                                y += dy;
                                positions.push([x, y]);
                                stepCount++;
                                if (stepCount === steps) {
                                    stepCount = 0;
                                    // Turn left: (dx,dy) -> (-dy,dx)
                                    var tmp = dx;
                                    dx = -dy;
                                    dy = tmp;
                                    turnCount++;
                                    if (turnCount === 2) {
                                        turnCount = 0;
                                        steps++;
                                    }
                                }
                            }

                            // Draw
                            var cellSize = Math.min(
                                (viz.width - 40) / spiralSize,
                                (viz.height - 60) / spiralSize
                            );
                            var gridStartX = (viz.width - spiralSize * cellSize) / 2;
                            var gridStartY = 40;
                            var dotR = Math.max(2, Math.min(cellSize / 2 - 1, 12));

                            var primeCount = 0;
                            for (var i = 0; i < total; i++) {
                                var num = i + 1;
                                var gx = gridStartX + positions[i][0] * cellSize + cellSize / 2;
                                var gy = gridStartY + positions[i][1] * cellSize + cellSize / 2;
                                var prime = num >= 2 && num <= maxNum && isPrime[num];
                                if (prime) primeCount++;

                                if (showPrimesOnly && !prime) continue;

                                if (prime) {
                                    ctx.fillStyle = viz.colors.yellow;
                                } else {
                                    ctx.fillStyle = viz.colors.blue + '22';
                                }
                                ctx.beginPath();
                                ctx.arc(gx, gy, prime ? dotR : dotR * 0.6, 0, Math.PI * 2);
                                ctx.fill();

                                // Show numbers for small spirals
                                if (spiralSize <= 15 && cellSize > 18) {
                                    ctx.fillStyle = prime ? viz.colors.yellow : viz.colors.text + '66';
                                    ctx.font = (prime ? 'bold ' : '') + Math.min(10, cellSize * 0.4) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(num.toString(), gx, gy + dotR + 8);
                                }
                            }

                            // Info
                            var infoY = gridStartY + spiralSize * cellSize + 15;
                            viz.screenText(
                                'Primes highlighted: ' + primeCount + ' out of ' + total + ' numbers',
                                viz.width / 2, infoY, viz.colors.yellow, 12
                            );
                            viz.screenText(
                                'Look for diagonal lines of primes!',
                                viz.width / 2, infoY + 18, viz.colors.text, 11
                            );
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-pattern-finder',
                    title: 'Pattern Finder',
                    description: 'Enter a sequence of numbers separated by commas. The tool will try to guess the pattern and predict the next number. Can you stump it?',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 300,
                            originX: 0, originY: 0, scale: 1
                        });

                        var sequence = [2, 4, 6, 8];
                        var prediction = null;
                        var patternDesc = '';

                        // Input field
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var input = document.createElement('input');
                        input.type = 'text';
                        input.value = '2, 4, 6, 8';
                        input.placeholder = 'Enter numbers: 1, 3, 5, 7';
                        input.style.cssText = 'flex:1;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inputDiv.appendChild(input);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Analyze', function() {
                            var parts = input.value.split(',').map(function(s) { return parseFloat(s.trim()); });
                            parts = parts.filter(function(x) { return !isNaN(x); });
                            if (parts.length >= 3) {
                                sequence = parts;
                                analyzePattern();
                                draw();
                            }
                        });

                        // Presets
                        var presets = [
                            { label: 'Triangular', seq: [1, 3, 6, 10, 15, 21] },
                            { label: 'Squares', seq: [1, 4, 9, 16, 25] },
                            { label: 'Fibonacci', seq: [1, 1, 2, 3, 5, 8, 13] },
                            { label: 'Primes', seq: [2, 3, 5, 7, 11, 13] },
                            { label: 'Powers of 2', seq: [1, 2, 4, 8, 16, 32] }
                        ];
                        var presetDiv = document.createElement('div');
                        presetDiv.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;';
                        presets.forEach(function(p) {
                            VizEngine.createButton(presetDiv, p.label, function() {
                                sequence = p.seq.slice();
                                input.value = sequence.join(', ');
                                analyzePattern();
                                draw();
                            });
                        });
                        controls.appendChild(presetDiv);

                        function analyzePattern() {
                            prediction = null;
                            patternDesc = '';
                            var s = sequence;
                            var n = s.length;
                            if (n < 3) return;

                            // Check constant difference (arithmetic)
                            var diffs = [];
                            for (var i = 1; i < n; i++) diffs.push(s[i] - s[i - 1]);
                            var allSameDiff = diffs.every(function(d) { return Math.abs(d - diffs[0]) < 1e-9; });
                            if (allSameDiff) {
                                prediction = s[n - 1] + diffs[0];
                                patternDesc = 'Arithmetic sequence with common difference ' + diffs[0];
                                return;
                            }

                            // Check constant ratio (geometric)
                            if (s[0] !== 0) {
                                var ratios = [];
                                var validRatio = true;
                                for (var i = 1; i < n; i++) {
                                    if (s[i - 1] === 0) { validRatio = false; break; }
                                    ratios.push(s[i] / s[i - 1]);
                                }
                                if (validRatio && ratios.length > 0) {
                                    var allSameRatio = ratios.every(function(r) { return Math.abs(r - ratios[0]) < 1e-9; });
                                    if (allSameRatio) {
                                        prediction = s[n - 1] * ratios[0];
                                        patternDesc = 'Geometric sequence with common ratio ' + ratios[0];
                                        return;
                                    }
                                }
                            }

                            // Check second differences (quadratic)
                            if (n >= 4) {
                                var diff2 = [];
                                for (var i = 1; i < diffs.length; i++) diff2.push(diffs[i] - diffs[i - 1]);
                                var allSameDiff2 = diff2.every(function(d) { return Math.abs(d - diff2[0]) < 1e-9; });
                                if (allSameDiff2) {
                                    var nextDiff = diffs[diffs.length - 1] + diff2[0];
                                    prediction = s[n - 1] + nextDiff;
                                    patternDesc = 'Quadratic pattern (2nd differences constant = ' + diff2[0] + ')';
                                    return;
                                }
                            }

                            // Check Fibonacci-like (each term = sum of two previous)
                            var isFib = true;
                            for (var i = 2; i < n; i++) {
                                if (Math.abs(s[i] - (s[i-1] + s[i-2])) > 1e-9) { isFib = false; break; }
                            }
                            if (isFib) {
                                prediction = s[n-1] + s[n-2];
                                patternDesc = 'Fibonacci-like: each term = sum of two previous';
                                return;
                            }

                            // Fallback: use last difference
                            prediction = s[n-1] + diffs[diffs.length - 1];
                            patternDesc = 'Using last difference (pattern unclear)';
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Pattern Finder', viz.width / 2, 20, viz.colors.white, 15);

                            // Draw sequence as points on a chart
                            var n = sequence.length;
                            var maxVal = Math.max.apply(null, sequence);
                            var minVal = Math.min.apply(null, sequence);
                            if (prediction !== null) {
                                maxVal = Math.max(maxVal, prediction);
                                minVal = Math.min(minVal, prediction);
                            }
                            var range = maxVal - minVal || 1;
                            var chartLeft = 60;
                            var chartRight = viz.width - 40;
                            var chartTop = 50;
                            var chartBottom = 200;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 4; i++) {
                                var gy = chartTop + i * chartH / 4;
                                ctx.beginPath(); ctx.moveTo(chartLeft, gy); ctx.lineTo(chartRight, gy); ctx.stroke();
                                var val = maxVal - i * range / 4;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(Math.round(val * 10) / 10, chartLeft - 8, gy);
                            }

                            // Draw sequence points
                            var totalPts = prediction !== null ? n + 1 : n;
                            for (var i = 0; i < n; i++) {
                                var px = chartLeft + (i / (totalPts - 1)) * chartW;
                                var py = chartBottom - ((sequence[i] - minVal) / range) * chartH;

                                // Line to previous
                                if (i > 0) {
                                    var prevX = chartLeft + ((i - 1) / (totalPts - 1)) * chartW;
                                    var prevY = chartBottom - ((sequence[i - 1] - minVal) / range) * chartH;
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.moveTo(prevX, prevY); ctx.lineTo(px, py); ctx.stroke();
                                }

                                // Point
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

                                // Label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(sequence[i].toString(), px, py - 8);
                            }

                            // Draw prediction
                            if (prediction !== null) {
                                var predX = chartLeft + (n / (totalPts - 1)) * chartW;
                                var predY = chartBottom - ((prediction - minVal) / range) * chartH;
                                var lastX = chartLeft + ((n - 1) / (totalPts - 1)) * chartW;
                                var lastY = chartBottom - ((sequence[n - 1] - minVal) / range) * chartH;

                                ctx.strokeStyle = viz.colors.teal + '88';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 5]);
                                ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(predX, predY); ctx.stroke();
                                ctx.setLineDash([]);

                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath(); ctx.arc(predX, predY, 6, 0, Math.PI * 2); ctx.fill();
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(predX, predY, 8, 0, Math.PI * 2); ctx.stroke();

                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(Math.round(prediction * 100) / 100 + '?', predX, predY - 10);
                            }

                            // Pattern description
                            if (patternDesc) {
                                viz.screenText(patternDesc, viz.width / 2, 230, viz.colors.teal, 13);
                            }
                            if (prediction !== null) {
                                viz.screenText('Predicted next term: ' + (Math.round(prediction * 100) / 100), viz.width / 2, 252, viz.colors.white, 13);
                            }

                            // Differences display
                            if (sequence.length >= 2) {
                                var dStr = 'Differences: ';
                                for (var i = 1; i < sequence.length; i++) {
                                    if (i > 1) dStr += ', ';
                                    dStr += (sequence[i] - sequence[i - 1]);
                                }
                                viz.screenText(dStr, viz.width / 2, 275, viz.colors.text, 11);
                            }
                        }

                        analyzePattern();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the 20th triangular number? What is \\(T_{100}\\)?',
                    hint: 'Use the formula \\(T_n = n(n+1)/2\\).',
                    solution: '\\(T_{20} = 20 \\times 21 / 2 = 210\\). \\(T_{100} = 100 \\times 101 / 2 = 5050\\). (This is the sum Gauss supposedly computed as a child.)'
                },
                {
                    question: 'Show that every square number is the sum of two consecutive triangular numbers. That is, prove \\(n^2 = T_{n-1} + T_n\\).',
                    hint: 'Write out the formulas for \\(T_{n-1}\\) and \\(T_n\\) and add them.',
                    solution: '\\(T_{n-1} + T_n = \\frac{(n-1)n}{2} + \\frac{n(n+1)}{2} = \\frac{n(n-1) + n(n+1)}{2} = \\frac{n(n-1+n+1)}{2} = \\frac{n \\cdot 2n}{2} = n^2\\).'
                },
                {
                    question: 'The sequence 1, 1, 2, 3, 5, 8, 13, 21, ... is called the Fibonacci sequence. Each term (after the first two) is the sum of the two preceding terms. What are the next three terms?',
                    hint: 'Add the last two terms to get the next one, then repeat.',
                    solution: 'The next three terms are: \\(21 + 13 = 34\\), \\(34 + 21 = 55\\), \\(55 + 34 = 89\\). So the sequence continues: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Chapter 1
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'What Comes Next',
            content: `
<h2>What Comes Next</h2>

<p>We have met the natural numbers, explored even and odd, walked the number line, and discovered patterns hiding in sequences. These are the building blocks, but the real adventure is just beginning.</p>

<p>The most fundamental question about whole numbers is this: <strong>what are the building blocks of multiplication?</strong> Just as every molecule is made of atoms, every whole number greater than 1 can be broken down into prime factors. Understanding primes is the key to understanding all of number theory.</p>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>In <strong>Chapter 1</strong>, we study <em>divisibility</em>: when does one number divide evenly into another? We will learn about factors, multiples, the division algorithm, and the greatest common divisor. These ideas lead directly to the study of prime numbers in Chapter 2.</p>
    </div>
</div>

<h3>Summary: What We Have Learned</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.92em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:left;">Concept</th>
        <th style="padding:8px; text-align:left;">Key Idea</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Natural numbers</td>
        <td style="padding:8px;">The counting numbers \\(1, 2, 3, \\ldots\\), closed under \\(+\\) and \\(\\times\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Even and odd</td>
        <td style="padding:8px;">\\(n = 2k\\) vs \\(n = 2k+1\\); predictable arithmetic rules</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Well-ordering</td>
        <td style="padding:8px;">Every non-empty set of natural numbers has a smallest element</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Triangular numbers</td>
        <td style="padding:8px;">\\(T_n = n(n+1)/2\\), sums of \\(1 + 2 + \\cdots + n\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px;">Square numbers</td>
        <td style="padding:8px;">\\(n^2 = 1 + 3 + 5 + \\cdots + (2n-1)\\)</td>
    </tr>
    <tr>
        <td style="padding:8px;">Figurate numbers</td>
        <td style="padding:8px;">Geometric shapes reveal arithmetic patterns</td>
    </tr>
</table>
`,
            visualizations: [],
            exercises: []
        }
    ]
});
