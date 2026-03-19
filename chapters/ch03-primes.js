window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: 'Prime Numbers',
    subtitle: 'The atoms of arithmetic',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Primes?',
            content: `
<h2>Why Primes?</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>Take any whole number greater than 1. Try to break it into smaller factors. Then break those factors down further. Keep going until you can't break anything any more. What do you always end up with?</p>
        <p>Try it with 60: \\(60 = 6 \\times 10 = 2 \\times 3 \\times 2 \\times 5\\). Try it with 84: \\(84 = 4 \\times 21 = 2 \\times 2 \\times 3 \\times 7\\). No matter how you break them apart, you always arrive at the same collection of "unbreakable" numbers. These are the <strong>primes</strong>.</p>
    </div>
</div>

<p>In chemistry, all matter is made of atoms. Atoms are the fundamental building blocks that cannot be broken down by chemical means. In arithmetic, prime numbers play exactly the same role: every whole number is built from primes, and primes themselves cannot be factored any further.</p>

<p>This idea, that every integer greater than 1 can be written as a product of primes in essentially one way, is called the <strong>Fundamental Theorem of Arithmetic</strong>. It is so important that we will devote an entire later chapter to it. For now, our goal is simpler: understand what primes are, find them, and begin to appreciate their surprising behavior.</p>

<h3>Primes Are Everywhere</h3>

<p>Prime numbers appear throughout mathematics and the real world:</p>
<ul>
    <li><strong>Cryptography:</strong> The security of online banking, messaging, and passwords relies on the difficulty of factoring large numbers into primes.</li>
    <li><strong>Nature:</strong> Cicadas emerge in cycles of 13 or 17 years (both prime), possibly to avoid synchronizing with predators.</li>
    <li><strong>Music:</strong> Rhythmic patterns based on primes create interesting, non-repeating beats.</li>
</ul>

<p>Despite being studied for over 2,000 years, primes still hold deep mysteries. Some of the biggest unsolved problems in all of mathematics are about prime numbers.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The ancient Greeks, especially Euclid (around 300 BCE), were the first to study primes systematically. Euclid's <em>Elements</em> contains a beautiful proof that there are infinitely many primes, which we will see later in this chapter. The study of primes has attracted the greatest mathematical minds ever since, from Euler to Gauss to Riemann to modern-day researchers.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-building-blocks',
                    title: 'Primes as Building Blocks',
                    description: 'Every composite number is a product of primes. Enter a number and watch it get decomposed into its prime factors, like breaking a molecule into atoms.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 60;
                        var animPhase = 0;
                        var animTimer = null;
                        var factors = [];

                        var inputGroup = document.createElement('div');
                        inputGroup.className = 'viz-slider-group';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number: ';
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.min = 2;
                        input.max = 9999;
                        input.value = targetNum;
                        input.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inputGroup.appendChild(label);
                        inputGroup.appendChild(input);
                        controls.appendChild(inputGroup);

                        VizEngine.createButton(controls, 'Decompose', function() {
                            targetNum = Math.max(2, Math.min(9999, parseInt(input.value) || 60));
                            input.value = targetNum;
                            startDecompose();
                        });

                        function primeFactors(n) {
                            var result = [];
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) {
                                    result.push(d);
                                    n = n / d;
                                }
                                d++;
                            }
                            if (n > 1) result.push(n);
                            return result;
                        }

                        function startDecompose() {
                            factors = primeFactors(targetNum);
                            animPhase = 0;
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animPhase++;
                                if (animPhase > factors.length + 2) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                                draw();
                            }, 500);
                            draw();
                        }

                        var primeColors = {};
                        var colorList = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.red, viz.colors.yellow];

                        function getColor(p) {
                            if (!primeColors[p]) {
                                var idx = Object.keys(primeColors).length % colorList.length;
                                primeColors[p] = colorList[idx];
                            }
                            return primeColors[p];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Prime Factorization', viz.width / 2, 25, viz.colors.white, 16);

                            if (factors.length === 0) {
                                viz.screenText('Enter a number and click Decompose', viz.width / 2, viz.height / 2, viz.colors.text, 14);
                                return;
                            }

                            // Show the original number as a large block
                            var boxW = 120, boxH = 60;
                            ctx.fillStyle = viz.colors.grid;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.fillRect(viz.width / 2 - boxW / 2, 50, boxW, boxH);
                            ctx.strokeRect(viz.width / 2 - boxW / 2, 50, boxW, boxH);
                            viz.screenText(targetNum.toString(), viz.width / 2, 80, viz.colors.white, 22);

                            // Arrow
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2, 115);
                            ctx.lineTo(viz.width / 2, 140);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2 - 6, 134);
                            ctx.lineTo(viz.width / 2, 142);
                            ctx.lineTo(viz.width / 2 + 6, 134);
                            ctx.fill();

                            // Show decomposition steps
                            var shown = Math.min(animPhase, factors.length);
                            var stepY = 160;

                            // Build intermediate expressions
                            if (shown > 0) {
                                var remaining = targetNum;
                                var revealed = [];
                                for (var s = 0; s < shown; s++) {
                                    revealed.push(factors[s]);
                                    remaining = remaining / factors[s];
                                }

                                // Show step expression
                                var expr = '';
                                for (var r = 0; r < revealed.length; r++) {
                                    expr += (r > 0 ? ' \u00D7 ' : '') + revealed[r];
                                }
                                if (remaining > 1) {
                                    expr += ' \u00D7 ' + remaining;
                                }
                                viz.screenText(targetNum + ' = ' + expr, viz.width / 2, stepY, viz.colors.white, 15);
                            }

                            // Show factor bubbles at the bottom
                            var bubbleY = 240;
                            var bubbleR = Math.min(30, (viz.width - 80) / (factors.length * 2.5));
                            var totalW = factors.length * (bubbleR * 2 + 10) - 10;
                            var startX = (viz.width - totalW) / 2 + bubbleR;

                            primeColors = {};
                            for (var i = 0; i < factors.length; i++) {
                                var bx = startX + i * (bubbleR * 2 + 10);
                                var col = getColor(factors[i]);
                                var revealed2 = i < shown;

                                if (revealed2) {
                                    // Glow
                                    ctx.fillStyle = col + '33';
                                    ctx.beginPath();
                                    ctx.arc(bx, bubbleY, bubbleR + 6, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Circle
                                    ctx.fillStyle = col;
                                    ctx.beginPath();
                                    ctx.arc(bx, bubbleY, bubbleR, 0, Math.PI * 2);
                                    ctx.fill();
                                    // Label
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold ' + Math.min(18, bubbleR) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(factors[i].toString(), bx, bubbleY);
                                } else {
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.arc(bx, bubbleY, bubbleR, 0, Math.PI * 2);
                                    ctx.stroke();
                                    viz.screenText('?', bx, bubbleY, viz.colors.text, 16);
                                }

                                // Multiplication signs between bubbles
                                if (i < factors.length - 1) {
                                    viz.screenText('\u00D7', bx + bubbleR + 5, bubbleY, viz.colors.text, 14);
                                }
                            }

                            // Summary at bottom
                            if (shown >= factors.length) {
                                // Count unique primes
                                var counts = {};
                                for (var k = 0; k < factors.length; k++) {
                                    counts[factors[k]] = (counts[factors[k]] || 0) + 1;
                                }
                                var summary = targetNum + ' = ';
                                var parts = [];
                                var keys = Object.keys(counts).map(Number).sort(function(a, b) { return a - b; });
                                for (var m = 0; m < keys.length; m++) {
                                    if (counts[keys[m]] === 1) {
                                        parts.push(keys[m].toString());
                                    } else {
                                        parts.push(keys[m] + '^' + counts[keys[m]]);
                                    }
                                }
                                summary += parts.join(' \u00D7 ');

                                var isPrime = factors.length === 1;
                                viz.screenText(summary, viz.width / 2, 310, viz.colors.teal, 16);
                                if (isPrime) {
                                    viz.screenText(targetNum + ' is itself prime!', viz.width / 2, 340, viz.colors.green, 14);
                                } else {
                                    viz.screenText(factors.length + ' prime factors (' + keys.length + ' distinct)', viz.width / 2, 340, viz.colors.text, 12);
                                }
                            }
                        }

                        startDecompose();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: What Is a Prime?
        // ================================================================
        {
            id: 'sec-definition',
            title: 'What Is a Prime?',
            content: `
<h2>What Is a Prime?</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Prime and Composite Numbers)</div>
    <div class="env-body">
        <p>An integer \\(p > 1\\) is called <strong>prime</strong> if its only positive divisors are 1 and \\(p\\) itself. That is, \\(p\\) has exactly two positive divisors.</p>
        <p>An integer \\(n > 1\\) that is not prime is called <strong>composite</strong>. A composite number has at least one divisor other than 1 and itself.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why 1 Is Not Prime</div>
    <div class="env-body">
        <p>The number 1 has only <em>one</em> positive divisor (itself). Since a prime must have <em>exactly two</em> positive divisors (1 and itself), the number 1 does not qualify. This is not just a technicality: if we allowed 1 to be prime, then the Fundamental Theorem of Arithmetic would fail. We could write \\(6 = 2 \\times 3 = 1 \\times 2 \\times 3 = 1 \\times 1 \\times 2 \\times 3\\), and the factorization would no longer be unique.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Classifying Small Numbers</div>
    <div class="env-body">
        <ul>
            <li>\\(2\\) is prime: divisors are 1 and 2 only. (It is the only even prime!)</li>
            <li>\\(4\\) is composite: \\(4 = 2 \\times 2\\), so 2 is a divisor besides 1 and 4.</li>
            <li>\\(7\\) is prime: no number between 1 and 7 divides it evenly.</li>
            <li>\\(9\\) is composite: \\(9 = 3 \\times 3\\).</li>
            <li>\\(1\\) is <strong>neither prime nor composite</strong>. It is a unit.</li>
        </ul>
    </div>
</div>

<p>Notice something important: <strong>2 is the only even prime</strong>. Every other even number is divisible by 2, so it has at least three divisors (1, 2, and itself) and is therefore composite. All other primes are odd.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.1</div>
    <div class="env-body">
        <p>If \\(n > 1\\) is an integer, then \\(n\\) has at least one prime divisor.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\(n\\) is prime, then \\(n\\) divides itself, and we are done. If \\(n\\) is composite, then \\(n = ab\\) where \\(1 < a < n\\). Consider the smallest divisor of \\(n\\) greater than 1; call it \\(d\\). We claim \\(d\\) is prime. If \\(d\\) were composite, then \\(d = ef\\) with \\(1 < e < d\\), and \\(e\\) would divide \\(n\\) (since \\(e | d\\) and \\(d | n\\)), contradicting the minimality of \\(d\\). Therefore \\(d\\) is prime.</p>
    </div>
    <div class="qed">&marker;</div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-checker',
                    title: 'Prime Checker',
                    description: 'Enter a number and watch animated trial division: we test each possible divisor one by one, checking if anything divides evenly. If nothing does, the number is prime!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var testNum = 29;
                        var animStep = 0;
                        var animTimer = null;
                        var divisors = [];
                        var result = '';
                        var currentDivisor = 0;
                        var maxDivisor = 0;

                        var inputGroup = document.createElement('div');
                        inputGroup.className = 'viz-slider-group';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Test: ';
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.min = 2;
                        input.max = 9999;
                        input.value = testNum;
                        input.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inputGroup.appendChild(label);
                        inputGroup.appendChild(input);
                        controls.appendChild(inputGroup);

                        VizEngine.createButton(controls, 'Check', function() {
                            testNum = Math.max(2, Math.min(9999, parseInt(input.value) || 29));
                            input.value = testNum;
                            startCheck();
                        });

                        function startCheck() {
                            if (animTimer) clearInterval(animTimer);
                            animStep = 0;
                            divisors = [];
                            result = '';
                            currentDivisor = 1;
                            maxDivisor = Math.floor(Math.sqrt(testNum));

                            animTimer = setInterval(function() {
                                currentDivisor++;
                                if (currentDivisor > maxDivisor) {
                                    if (divisors.length === 0) {
                                        result = 'prime';
                                    } else {
                                        result = 'composite';
                                    }
                                    clearInterval(animTimer);
                                    animTimer = null;
                                    draw();
                                    return;
                                }
                                if (testNum % currentDivisor === 0) {
                                    divisors.push(currentDivisor);
                                    result = 'composite';
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                                draw();
                            }, Math.max(60, 300 - maxDivisor * 3));
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Is ' + testNum + ' prime?', viz.width / 2, 30, viz.colors.white, 18);
                            viz.screenText('We test divisors from 2 up to \u230A\u221A' + testNum + '\u230B = ' + maxDivisor, viz.width / 2, 55, viz.colors.text, 12);

                            // Draw the number being tested
                            var numBoxW = 100, numBoxH = 50;
                            ctx.fillStyle = viz.colors.grid;
                            ctx.strokeStyle = result === 'prime' ? viz.colors.green : result === 'composite' ? viz.colors.red : viz.colors.axis;
                            ctx.lineWidth = 3;
                            ctx.fillRect(viz.width / 2 - numBoxW / 2, 75, numBoxW, numBoxH);
                            ctx.strokeRect(viz.width / 2 - numBoxW / 2, 75, numBoxW, numBoxH);
                            viz.screenText(testNum.toString(), viz.width / 2, 100, viz.colors.white, 24);

                            // Show trial division progress as a grid of divisor cells
                            var cellSize = 36;
                            var cols = Math.min(maxDivisor - 1, Math.floor((viz.width - 60) / cellSize));
                            if (cols < 1) cols = 1;
                            var rows = Math.ceil((maxDivisor - 1) / cols);
                            var gridW = cols * cellSize;
                            var gridStartX = (viz.width - gridW) / 2;
                            var gridStartY = 150;

                            for (var d = 2; d <= maxDivisor; d++) {
                                var idx = d - 2;
                                var col = idx % cols;
                                var row = Math.floor(idx / cols);
                                var cx = gridStartX + col * cellSize + cellSize / 2;
                                var cy = gridStartY + row * cellSize + cellSize / 2;

                                if (cy > viz.height - 60) break;

                                var isDivisor = testNum % d === 0;
                                var tested = d <= currentDivisor;
                                var isCurrent = d === currentDivisor && !result;

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.yellow + '44';
                                    ctx.fillRect(cx - cellSize / 2 + 1, cy - cellSize / 2 + 1, cellSize - 2, cellSize - 2);
                                }

                                if (tested && isDivisor) {
                                    ctx.fillStyle = viz.colors.red + '44';
                                    ctx.fillRect(cx - cellSize / 2 + 1, cy - cellSize / 2 + 1, cellSize - 2, cellSize - 2);
                                }

                                ctx.strokeStyle = tested ? (isDivisor ? viz.colors.red : viz.colors.green + '88') : viz.colors.axis + '44';
                                ctx.lineWidth = tested ? 1.5 : 0.5;
                                ctx.strokeRect(cx - cellSize / 2 + 1, cy - cellSize / 2 + 1, cellSize - 2, cellSize - 2);

                                var textCol = !tested ? viz.colors.text + '44' : (isDivisor ? viz.colors.red : viz.colors.green);
                                ctx.fillStyle = textCol;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(d.toString(), cx, cy - 4);

                                if (tested) {
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText(isDivisor ? '\u2714 divides' : '\u2718', cx, cy + 10);
                                }
                            }

                            // Result banner
                            if (result) {
                                var bannerY = viz.height - 45;
                                if (result === 'prime') {
                                    ctx.fillStyle = viz.colors.green + '33';
                                    ctx.fillRect(0, bannerY - 18, viz.width, 36);
                                    viz.screenText(testNum + ' is PRIME!', viz.width / 2, bannerY, viz.colors.green, 18);
                                } else {
                                    ctx.fillStyle = viz.colors.red + '33';
                                    ctx.fillRect(0, bannerY - 18, viz.width, 36);
                                    viz.screenText(testNum + ' is COMPOSITE: ' + testNum + ' = ' + divisors[0] + ' \u00D7 ' + (testNum / divisors[0]), viz.width / 2, bannerY, viz.colors.red, 16);
                                }
                            }
                        }

                        startCheck();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'List all the positive divisors of 12. Is 12 prime or composite? How many divisors does it have?',
                    hint: 'Check each number from 1 to 12 to see if it divides 12 evenly.',
                    solution: 'The positive divisors of 12 are: 1, 2, 3, 4, 6, 12. Since 12 has divisors other than 1 and 12, it is composite. It has 6 positive divisors.'
                },
                {
                    question: 'Explain why 1 is not considered a prime number. What would go wrong if we called 1 prime?',
                    hint: 'Think about the definition: a prime has exactly two positive divisors. Also think about prime factorization.',
                    solution: 'The number 1 has only one positive divisor (itself), not two. A prime must have exactly two positive divisors: 1 and itself. Moreover, if 1 were prime, then prime factorizations would not be unique: \\(6 = 2 \\times 3 = 1 \\times 2 \\times 3 = 1^{100} \\times 2 \\times 3\\), etc.'
                },
                {
                    question: 'Prove that 2 is the only even prime number.',
                    hint: 'What does it mean for a number to be even? If an even number is greater than 2, can you always find a divisor?',
                    solution: 'An even number \\(n\\) is divisible by 2. If \\(n > 2\\) and \\(n\\) is even, then \\(n\\) has at least three positive divisors: 1, 2, and \\(n\\). So \\(n\\) cannot be prime. The only even number with exactly two divisors is \\(n = 2\\) (divisors: 1 and 2).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The First Primes
        // ================================================================
        {
            id: 'sec-first-primes',
            title: 'The First Primes',
            content: `
<h2>The First Primes</h2>

<p>Let us list the prime numbers in order, starting from the smallest:</p>

\\[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, \\ldots\\]

<p>The first thing to notice: there is no simple pattern. The primes do not follow a neat formula. They seem to appear somewhat unpredictably among the integers, and this unpredictability is one of their most fascinating features.</p>

<h3>Observations About the First Primes</h3>

<div class="env-block remark">
    <div class="env-title">Patterns and Non-Patterns</div>
    <div class="env-body">
        <p>Looking at the first few primes, we can make some observations:</p>
        <ul>
            <li><strong>2 is the only even prime.</strong> All other primes are odd.</li>
            <li><strong>Except for 2 and 3, every prime has the form \\(6k \\pm 1\\).</strong> This is because any integer is of the form \\(6k, 6k+1, 6k+2, 6k+3, 6k+4,\\) or \\(6k+5\\). Of these, \\(6k, 6k+2, 6k+4\\) are even, and \\(6k+3\\) is divisible by 3. So only \\(6k+1\\) and \\(6k+5 = 6(k+1)-1\\) can be prime.</li>
            <li><strong>Not every number of the form \\(6k \\pm 1\\) is prime.</strong> For instance, \\(25 = 6 \\times 4 + 1\\) is composite.</li>
            <li><strong>The gaps between consecutive primes vary wildly.</strong> Sometimes primes are close together (like 11, 13), sometimes far apart.</li>
        </ul>
    </div>
</div>

<p>One of the great discoveries in number theory is that while individual primes are hard to predict, their <em>average</em> behavior follows beautiful laws. The Prime Number Theorem (proved in 1896) says that the number of primes up to \\(N\\) is approximately \\(N / \\ln N\\). We will explore this visually below.</p>

<div class="env-block example">
    <div class="env-title">Example: Primes Up to 100</div>
    <div class="env-body">
        <p>There are exactly 25 primes less than or equal to 100:</p>
        <p>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.</p>
        <p>The Prime Number Theorem predicts roughly \\(100/\\ln 100 \\approx 100/4.6 \\approx 21.7\\). The actual count (25) is close but not exact. The approximation gets better for larger \\(N\\).</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-spiral',
                    title: 'Ulam Prime Spiral',
                    description: 'Arrange the integers in a spiral pattern and highlight the primes. Surprisingly, primes tend to cluster along certain diagonal lines! This is the famous Ulam spiral, discovered by Stanislaw Ulam in 1963 while doodling during a boring meeting.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxN = 2000;
                        var showNumbers = false;

                        VizEngine.createSlider(controls, 'Count', 100, 5000, maxN, 100, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Toggle Numbers', function() {
                            showNumbers = !showNumbers;
                            draw();
                        });

                        // Generate primes via sieve
                        function sieve(max) {
                            var s = new Uint8Array(max + 1);
                            for (var i = 2; i * i <= max; i++) {
                                if (!s[i]) for (var j = i * i; j <= max; j += i) s[j] = 1;
                            }
                            return s;
                        }

                        // Spiral coordinate: number n -> (x, y) offset from center
                        function spiralCoord(n) {
                            if (n === 1) return [0, 0];
                            var k = Math.ceil((Math.sqrt(n) - 1) / 2);
                            var t = 2 * k + 1;
                            var m = t * t;
                            if (n >= m - t + 1) return [k - (m - n), -k];
                            m -= t - 1;
                            if (n >= m - t + 1) return [-k, -k + (m - n)];
                            m -= t - 1;
                            if (n >= m - t + 1) return [-k + (m - n), k];
                            m -= t - 1;
                            return [k, k - (m - n)];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Ulam Prime Spiral', viz.width / 2, 18, viz.colors.white, 15);

                            var isComposite = sieve(maxN);
                            var centerX = viz.width / 2;
                            var centerY = viz.height / 2 + 10;

                            // Calculate cell size to fit
                            var maxK = Math.ceil((Math.sqrt(maxN) - 1) / 2) + 1;
                            var cellSize = Math.min(Math.floor((viz.width - 40) / (2 * maxK + 1)), Math.floor((viz.height - 60) / (2 * maxK + 1)));
                            cellSize = Math.max(1, cellSize);

                            for (var n = 1; n <= maxN; n++) {
                                var coord = spiralCoord(n);
                                var px = centerX + coord[0] * cellSize;
                                var py = centerY + coord[1] * cellSize;

                                if (n === 1) {
                                    ctx.fillStyle = viz.colors.yellow;
                                } else if (!isComposite[n]) {
                                    ctx.fillStyle = viz.colors.blue;
                                } else {
                                    if (cellSize >= 4) {
                                        ctx.fillStyle = viz.colors.grid;
                                    } else {
                                        continue;
                                    }
                                }

                                if (cellSize >= 4) {
                                    ctx.fillRect(px - cellSize / 2 + 0.5, py - cellSize / 2 + 0.5, cellSize - 1, cellSize - 1);
                                } else {
                                    ctx.fillRect(px, py, Math.max(1, cellSize), Math.max(1, cellSize));
                                }

                                if (showNumbers && cellSize >= 14 && n <= 200) {
                                    ctx.fillStyle = (!isComposite[n] || n === 1) ? '#0c0c20' : viz.colors.text;
                                    ctx.font = Math.max(7, cellSize - 6) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(n.toString(), px, py);
                                }
                            }

                            // Legend
                            var legY = viz.height - 18;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width / 2 - 80, legY - 5, 10, 10);
                            viz.screenText('Prime', viz.width / 2 - 50, legY, viz.colors.text, 11, 'left');
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(viz.width / 2 + 10, legY - 5, 10, 10);
                            viz.screenText('Composite', viz.width / 2 + 40, legY, viz.colors.text, 11, 'left');
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-prime-density',
                    title: 'Prime Counting Function',
                    description: 'How many primes are there up to N? The prime counting function \u03C0(N) counts them. Watch it grow, and compare it to the approximation N/ln(N) from the Prime Number Theorem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var maxN = 200;

                        VizEngine.createSlider(controls, 'N max', 50, 1000, maxN, 50, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u03C0(N): Number of primes \u2264 N', viz.width / 2, 18, viz.colors.white, 15);

                            var primes = VizEngine.sievePrimes(maxN);
                            var piValues = [];
                            var count = 0;
                            var pIdx = 0;
                            for (var n = 1; n <= maxN; n++) {
                                if (pIdx < primes.length && primes[pIdx] === n) {
                                    count++;
                                    pIdx++;
                                }
                                piValues.push([n, count]);
                            }

                            var maxPi = count;
                            var plotLeft = 70;
                            var plotRight = viz.width - 30;
                            var plotTop = 40;
                            var plotBot = 330;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBot - plotTop;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotRight, plotBot);
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var xTicks = Math.min(10, Math.floor(maxN / 50));
                            for (var xt = 0; xt <= xTicks; xt++) {
                                var xVal = Math.round(maxN * xt / xTicks);
                                var xPos = plotLeft + (xVal / maxN) * plotW;
                                ctx.fillText(xVal.toString(), xPos, plotBot + 4);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(xPos, plotBot);
                                ctx.lineTo(xPos, plotTop);
                                ctx.stroke();
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            var yTicks = 5;
                            for (var yt = 0; yt <= yTicks; yt++) {
                                var yVal = Math.round(maxPi * yt / yTicks);
                                var yPos = plotBot - (yVal / maxPi) * plotH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(yVal.toString(), plotLeft - 6, yPos);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(plotLeft, yPos);
                                ctx.lineTo(plotRight, yPos);
                                ctx.stroke();
                            }

                            // Draw pi(N) as step function
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < piValues.length; i++) {
                                var px = plotLeft + (piValues[i][0] / maxN) * plotW;
                                var py = plotBot - (piValues[i][1] / maxPi) * plotH;
                                if (i === 0) ctx.moveTo(px, py);
                                else {
                                    var prevPx = plotLeft + (piValues[i - 1][0] / maxN) * plotW;
                                    var prevPy = plotBot - (piValues[i - 1][1] / maxPi) * plotH;
                                    ctx.lineTo(px, prevPy);
                                    ctx.lineTo(px, py);
                                }
                            }
                            ctx.stroke();

                            // Draw N/ln(N) approximation
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            var started = false;
                            for (var x = 2; x <= maxN; x++) {
                                var approx = x / Math.log(x);
                                var apx = plotLeft + (x / maxN) * plotW;
                                var apy = plotBot - (approx / maxPi) * plotH;
                                if (!started) { ctx.moveTo(apx, apy); started = true; }
                                else ctx.lineTo(apx, apy);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = plotBot + 24;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(plotLeft + 40, legY - 5, 20, 3);
                            viz.screenText('\u03C0(N) actual', plotLeft + 100, legY - 2, viz.colors.blue, 11, 'left');

                            ctx.strokeStyle = viz.colors.orange;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(plotLeft + 180, legY - 2);
                            ctx.lineTo(plotLeft + 200, legY - 2);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            viz.screenText('N/ln(N)', plotLeft + 240, legY - 2, viz.colors.orange, 11, 'left');

                            // Current value
                            viz.screenText('\u03C0(' + maxN + ') = ' + maxPi, viz.width / 2, plotTop - 8, viz.colors.teal, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that every prime greater than 3 is of the form \\(6k+1\\) or \\(6k+5\\) by checking all primes up to 50.',
                    hint: 'Write each prime as \\(6k + r\\) where \\(0 \\le r < 6\\). Which remainders \\(r\\) appear?',
                    solution: '5 = 6(0)+5, 7 = 6(1)+1, 11 = 6(1)+5, 13 = 6(2)+1, 17 = 6(2)+5, 19 = 6(3)+1, 23 = 6(3)+5, 29 = 6(4)+5, 31 = 6(5)+1, 37 = 6(6)+1, 41 = 6(6)+5, 43 = 6(7)+1, 47 = 6(7)+5. All have remainder 1 or 5 when divided by 6, confirming the pattern.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Testing Primality
        // ================================================================
        {
            id: 'sec-testing',
            title: 'Testing Primality',
            content: `
<h2>Testing Primality</h2>

<p>Given a number \\(n\\), how do we determine whether it is prime? The naive approach is to try dividing \\(n\\) by every integer from 2 to \\(n-1\\). But we can do much better.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.2 (The Square Root Test)</div>
    <div class="env-body">
        <p>If \\(n > 1\\) is composite, then \\(n\\) has a prime factor \\(p \\leq \\sqrt{n}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>If \\(n\\) is composite, write \\(n = ab\\) where \\(1 < a \\leq b < n\\). Then \\(a^2 \\leq ab = n\\), so \\(a \\leq \\sqrt{n}\\). By Theorem 3.1, \\(a\\) has a prime factor \\(p \\leq a \\leq \\sqrt{n}\\), and this \\(p\\) also divides \\(n\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why the Square Root?</div>
    <div class="env-body">
        <p>If \\(n = a \\times b\\), then \\(a\\) and \\(b\\) cannot <em>both</em> be larger than \\(\\sqrt{n}\\), because then \\(a \\times b > \\sqrt{n} \\times \\sqrt{n} = n\\). So at least one factor must be \\(\\leq \\sqrt{n}\\). This is a huge savings: to test whether 1,000,000 is prime, we only need to check divisors up to 1,000, not up to 999,999.</p>
    </div>
</div>

<h3>Trial Division Algorithm</h3>

<p>To test if \\(n\\) is prime using trial division:</p>
<ol>
    <li>If \\(n < 2\\), it is not prime.</li>
    <li>If \\(n = 2\\), it is prime.</li>
    <li>If \\(n\\) is even (and \\(n > 2\\)), it is composite.</li>
    <li>Try dividing \\(n\\) by each odd number \\(d = 3, 5, 7, \\ldots\\) up to \\(\\lfloor\\sqrt{n}\\rfloor\\).</li>
    <li>If any \\(d\\) divides \\(n\\), then \\(n\\) is composite. Otherwise, \\(n\\) is prime.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: Is 97 Prime?</div>
    <div class="env-body">
        <p>We have \\(\\sqrt{97} \\approx 9.85\\), so we test \\(d = 2, 3, 5, 7\\) (the primes up to 9).</p>
        <ul>
            <li>\\(97 / 2 = 48.5\\) (not divisible)</li>
            <li>\\(97 / 3 = 32.33...\\) (not divisible)</li>
            <li>\\(97 / 5 = 19.4\\) (not divisible)</li>
            <li>\\(97 / 7 = 13.86...\\) (not divisible)</li>
        </ul>
        <p>No prime up to 9 divides 97, so 97 is prime.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Is 91 Prime?</div>
    <div class="env-body">
        <p>Many people guess 91 is prime, but \\(\\sqrt{91} \\approx 9.54\\), and testing \\(d = 7\\): \\(91 = 7 \\times 13\\). So 91 is composite. This example shows why we need a systematic method rather than just guessing!</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use trial division to determine whether 143 is prime. Show your work.',
                    hint: 'Compute \\(\\lfloor\\sqrt{143}\\rfloor\\) first, then test primes up to that value.',
                    solution: '\\(\\sqrt{143} \\approx 11.96\\), so we test primes up to 11: \\(143/2\\) (not even), \\(143/3 = 47.67\\) (no), \\(143/5 = 28.6\\) (no), \\(143/7 = 20.43\\) (no), \\(143/11 = 13\\). Since \\(11 \\times 13 = 143\\), the number 143 is composite.'
                },
                {
                    question: 'What is the largest prime you need to test when checking if 400 is prime? What about 10,000?',
                    hint: 'Apply the square root test: you need primes up to \\(\\lfloor\\sqrt{n}\\rfloor\\).',
                    solution: 'For \\(n = 400\\): \\(\\sqrt{400} = 20\\), so test primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19. For \\(n = 10{,}000\\): \\(\\sqrt{10000} = 100\\), so test primes up to 100. There are 25 such primes. (Of course, 400 and 10,000 are both obviously even, so the check ends immediately at 2.)'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Infinitely Many Primes
        // ================================================================
        {
            id: 'sec-infinitely-many',
            title: 'Infinitely Many Primes',
            content: `
<h2>Infinitely Many Primes</h2>

<p>Is the list of primes finite or infinite? Do primes eventually "run out," or do they keep appearing forever among the integers? This is one of the oldest and most beautiful questions in mathematics, and it was answered over 2,000 years ago.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 3.3 (Euclid, ~300 BCE)</div>
    <div class="env-body">
        <p>There are infinitely many prime numbers.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose, for contradiction, that there are only finitely many primes. List them all: \\(p_1, p_2, \\ldots, p_k\\).</p>
        <p>Now consider the number</p>
        \\[N = p_1 \\cdot p_2 \\cdots p_k + 1.\\]
        <p>This number \\(N\\) is greater than 1, so by Theorem 3.1, it has at least one prime divisor \\(p\\).</p>
        <p>Can \\(p\\) be one of \\(p_1, p_2, \\ldots, p_k\\)? If \\(p = p_i\\) for some \\(i\\), then \\(p_i\\) divides \\(N = p_1 \\cdot p_2 \\cdots p_k + 1\\). Since \\(p_i\\) also divides \\(p_1 \\cdot p_2 \\cdots p_k\\), it must divide their difference:</p>
        \\[p_i \\mid (N - p_1 \\cdot p_2 \\cdots p_k) = 1.\\]
        <p>But no prime divides 1, a contradiction. Therefore \\(p\\) is a prime not in our list, contradicting our assumption that we had listed all primes.</p>
        <p>Hence there are infinitely many primes.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block intuition">
    <div class="env-title">What Euclid's Proof Really Says</div>
    <div class="env-body">
        <p>A common misunderstanding: Euclid's proof does <strong>not</strong> say that \\(p_1 \\cdot p_2 \\cdots p_k + 1\\) is always prime. It says that this number has a prime factor not in the original list. Sometimes \\(N\\) itself is prime (like \\(2 \\times 3 + 1 = 7\\)), but sometimes it is not (like \\(2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30031 = 59 \\times 509\\)).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Euclid's Construction in Action</div>
    <div class="env-body">
        <p>Start with primes \\(\\{2\\}\\). Form \\(N = 2 + 1 = 3\\). That's prime! Add it: \\(\\{2, 3\\}\\).</p>
        <p>Form \\(N = 2 \\times 3 + 1 = 7\\). Prime! Add it: \\(\\{2, 3, 7\\}\\).</p>
        <p>Form \\(N = 2 \\times 3 \\times 7 + 1 = 43\\). Prime! Add it: \\(\\{2, 3, 7, 43\\}\\).</p>
        <p>Form \\(N = 2 \\times 3 \\times 7 \\times 43 + 1 = 1807 = 13 \\times 139\\). Not prime! But 13 and 139 are new primes not in our list. The construction always produces new primes, one way or another.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-prime-gaps',
                    title: 'Gaps Between Consecutive Primes',
                    description: 'The gaps between consecutive primes vary. Some primes are close together; others are far apart. This bar chart shows the size of each gap. Notice how the gaps tend to grow (on average) but never settle into a pattern.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxCount = 100;

                        VizEngine.createSlider(controls, 'Primes', 20, 300, maxCount, 10, function(v) {
                            maxCount = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Gaps Between Consecutive Primes', viz.width / 2, 18, viz.colors.white, 15);

                            // Get primes
                            var limit = maxCount * 20;
                            var primes = VizEngine.sievePrimes(limit);
                            if (primes.length > maxCount) primes = primes.slice(0, maxCount);

                            // Compute gaps
                            var gaps = [];
                            var maxGap = 0;
                            for (var i = 1; i < primes.length; i++) {
                                var g = primes[i] - primes[i - 1];
                                gaps.push({ from: primes[i - 1], to: primes[i], gap: g });
                                if (g > maxGap) maxGap = g;
                            }

                            var plotLeft = 50;
                            var plotRight = viz.width - 20;
                            var plotBot = 330;
                            var plotTop = 45;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBot - plotTop;
                            var barW = Math.max(1, Math.min(8, plotW / gaps.length - 1));

                            // Y axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotRight, plotBot);
                            ctx.moveTo(plotLeft, plotBot);
                            ctx.lineTo(plotLeft, plotTop);
                            ctx.stroke();

                            // Y labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var yt = 0; yt <= maxGap; yt += Math.max(1, Math.ceil(maxGap / 6))) {
                                var yy = plotBot - (yt / maxGap) * plotH;
                                ctx.fillText(yt.toString(), plotLeft - 5, yy);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(plotLeft, yy);
                                ctx.lineTo(plotRight, yy);
                                ctx.stroke();
                            }

                            // Draw bars
                            for (var j = 0; j < gaps.length; j++) {
                                var bx = plotLeft + (j / gaps.length) * plotW;
                                var bh = (gaps[j].gap / maxGap) * plotH;

                                // Color by gap size
                                var t = gaps[j].gap / maxGap;
                                if (gaps[j].gap <= 2) {
                                    ctx.fillStyle = viz.colors.teal;
                                } else if (t < 0.5) {
                                    ctx.fillStyle = viz.colors.blue;
                                } else {
                                    ctx.fillStyle = viz.colors.orange;
                                }

                                ctx.fillRect(bx, plotBot - bh, barW, bh);
                            }

                            // Stats
                            var avgGap = 0;
                            for (var k = 0; k < gaps.length; k++) avgGap += gaps[k].gap;
                            avgGap = (avgGap / gaps.length).toFixed(1);

                            viz.screenText(
                                'Showing ' + gaps.length + ' gaps | Max gap: ' + maxGap + ' | Avg gap: ' + avgGap,
                                viz.width / 2, plotBot + 20, viz.colors.text, 11
                            );

                            // Legend
                            var legY = plotBot + 38;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(plotLeft + 40, legY - 5, 10, 10);
                            viz.screenText('Gap \u2264 2 (twin primes)', plotLeft + 55, legY, viz.colors.text, 10, 'left');
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(plotLeft + 210, legY - 5, 10, 10);
                            viz.screenText('Large gaps', plotLeft + 225, legY, viz.colors.text, 10, 'left');

                            viz.screenText('Y-axis: gap size (p\u2099\u208A\u2081 \u2212 p\u2099)', plotLeft - 10, plotTop - 8, viz.colors.text, 10, 'left');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Carry out Euclid\'s construction starting with the primes \\(\\{2, 3, 5\\}\\). Compute \\(N = 2 \\times 3 \\times 5 + 1\\). Is \\(N\\) prime? What new prime(s) does it reveal?',
                    hint: 'Compute \\(N = 31\\). Check if 31 is prime by trial division.',
                    solution: '\\(N = 2 \\times 3 \\times 5 + 1 = 31\\). Since \\(\\sqrt{31} < 6\\) and neither 2, 3, nor 5 divides 31, it is prime. So 31 is a new prime not in the original list \\(\\{2,3,5\\}\\).'
                },
                {
                    question: 'Show that \\(2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30031\\) is NOT prime. Find its prime factorization. Does this contradict Euclid\'s proof?',
                    hint: 'Try dividing 30031 by primes not in the list \\(\\{2,3,5,7,11,13\\}\\). Start with 17, 19, 23, ...',
                    solution: '\\(30031 = 59 \\times 509\\). Both 59 and 509 are prime, and neither is in \\(\\{2,3,5,7,11,13\\}\\). This does not contradict Euclid: the proof says \\(N\\) has a prime factor NOT in the list, which is true (59 and 509 are new primes). It does not claim \\(N\\) itself must be prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Twin Primes & Goldbach
        // ================================================================
        {
            id: 'sec-twin-primes',
            title: 'Twin Primes & Goldbach',
            content: `
<h2>Twin Primes and Goldbach's Conjecture</h2>

<p>Euclid proved there are infinitely many primes. But many natural questions about primes remain unanswered, even after thousands of years of effort. Here are two of the most famous open problems.</p>

<h3>Twin Primes</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Twin Primes)</div>
    <div class="env-body">
        <p>A pair of primes \\((p, p+2)\\) is called a <strong>twin prime pair</strong>. Examples: \\((3,5), (5,7), (11,13), (17,19), (29,31), (41,43), \\ldots\\)</p>
    </div>
</div>

<p>Twin primes are pairs of primes that are as close together as possible (except for the pair (2,3), no two primes can differ by 1, since one would be even).</p>

<div class="env-block conjecture">
    <div class="env-title">Twin Prime Conjecture</div>
    <div class="env-body">
        <p>There are infinitely many twin prime pairs.</p>
    </div>
</div>

<p>Despite enormous progress, nobody has proved or disproved this conjecture. In 2013, Yitang Zhang proved a weaker result: there are infinitely many pairs of primes differing by at most 70,000,000. This bound has since been reduced to 246 by James Maynard and the Polymath project, but getting it down to 2 (which would prove the Twin Prime Conjecture) remains out of reach.</p>

<h3>Goldbach's Conjecture</h3>

<div class="env-block conjecture">
    <div class="env-title">Goldbach's Conjecture (1742)</div>
    <div class="env-body">
        <p>Every even integer greater than 2 can be expressed as the sum of two primes.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(4 = 2 + 2\\)</li>
            <li>\\(6 = 3 + 3\\)</li>
            <li>\\(8 = 3 + 5\\)</li>
            <li>\\(10 = 3 + 7 = 5 + 5\\)</li>
            <li>\\(20 = 3 + 17 = 7 + 13\\)</li>
            <li>\\(100 = 3 + 97 = 11 + 89 = 17 + 83 = 29 + 71 = 41 + 59 = 47 + 53\\)</li>
        </ul>
    </div>
</div>

<p>Goldbach's Conjecture has been verified by computer for all even numbers up to \\(4 \\times 10^{18}\\), but no proof exists. It is one of the oldest unsolved problems in mathematics. Notice that larger even numbers tend to have <em>more</em> Goldbach representations, not fewer, which is part of why mathematicians believe the conjecture is true.</p>

<div class="env-block remark">
    <div class="env-title">Partial Progress</div>
    <div class="env-body">
        <p>In 2013, Harald Helfgott proved the "weak" Goldbach conjecture: every odd integer greater than 5 can be written as the sum of three primes. The "strong" conjecture (every even integer > 2 as a sum of two primes) remains open.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-twin-primes-finder',
                    title: 'Twin Prime Finder',
                    description: 'Find all twin prime pairs up to a given limit. Watch how twin primes become rarer but never seem to stop appearing.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var limit = 200;

                        VizEngine.createSlider(controls, 'Up to', 50, 2000, limit, 50, function(v) {
                            limit = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Twin Prime Pairs up to ' + limit, viz.width / 2, 18, viz.colors.white, 15);

                            var primes = VizEngine.sievePrimes(limit);
                            var twins = [];
                            for (var i = 0; i < primes.length - 1; i++) {
                                if (primes[i + 1] - primes[i] === 2) {
                                    twins.push([primes[i], primes[i + 1]]);
                                }
                            }

                            // Display twin pairs
                            var startY = 50;
                            var cols = Math.max(1, Math.floor((viz.width - 40) / 130));
                            var rowH = 22;
                            var colW = (viz.width - 40) / cols;
                            var maxRows = Math.floor((viz.height - 90) / rowH);
                            var maxShow = maxRows * cols;

                            for (var j = 0; j < Math.min(twins.length, maxShow); j++) {
                                var col = j % cols;
                                var row = Math.floor(j / cols);
                                var tx = 30 + col * colW;
                                var ty = startY + row * rowH;

                                var pair = twins[j];
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('(' + pair[0] + ', ' + pair[1] + ')', tx, ty);
                            }

                            if (twins.length > maxShow) {
                                viz.screenText('... and ' + (twins.length - maxShow) + ' more pairs', viz.width / 2, startY + maxRows * rowH + 5, viz.colors.text, 11);
                            }

                            // Summary bar at bottom
                            var sumY = viz.height - 30;
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(0, sumY - 15, viz.width, 30);
                            viz.screenText(
                                'Found ' + twins.length + ' twin prime pairs among ' + primes.length + ' primes up to ' + limit,
                                viz.width / 2, sumY, viz.colors.white, 13
                            );
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-goldbach-explorer',
                    title: 'Goldbach Explorer',
                    description: 'Pick any even number and see all ways to write it as a sum of two primes. Larger even numbers usually have more representations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var evenNum = 30;

                        VizEngine.createSlider(controls, 'Even number', 4, 500, evenNum, 2, function(v) {
                            evenNum = Math.round(v);
                            if (evenNum % 2 !== 0) evenNum++;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Goldbach: ' + evenNum + ' as sum of two primes', viz.width / 2, 22, viz.colors.white, 15);

                            var primes = VizEngine.sievePrimes(evenNum);
                            var primeSet = {};
                            for (var i = 0; i < primes.length; i++) primeSet[primes[i]] = true;

                            // Find all representations
                            var reps = [];
                            for (var p = 2; p <= evenNum / 2; p++) {
                                if (primeSet[p] && primeSet[evenNum - p]) {
                                    reps.push([p, evenNum - p]);
                                }
                            }

                            if (reps.length === 0) {
                                viz.screenText('No representation found!', viz.width / 2, viz.height / 2, viz.colors.red, 16);
                                return;
                            }

                            // Visual: show each pair as two colored arcs on a number line
                            var plotTop = 55;
                            var rowH = Math.min(40, (viz.height - 100) / reps.length);
                            var maxShow = Math.floor((viz.height - 100) / rowH);
                            var lineLeft = 100;
                            var lineRight = viz.width - 40;
                            var lineW = lineRight - lineLeft;

                            for (var r = 0; r < Math.min(reps.length, maxShow); r++) {
                                var ry = plotTop + r * rowH + rowH / 2;
                                var p1 = reps[r][0];
                                var p2 = reps[r][1];

                                // Number line
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(lineLeft, ry);
                                ctx.lineTo(lineRight, ry);
                                ctx.stroke();

                                // Mark 0 and evenNum
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('0', lineLeft, ry + 3);
                                ctx.fillText(evenNum.toString(), lineRight, ry + 3);

                                // Mark p1
                                var p1x = lineLeft + (p1 / evenNum) * lineW;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(p1x, ry, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Draw arc for p1 (from 0 to p1)
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                var arcR1 = (p1x - lineLeft) / 2;
                                ctx.beginPath();
                                ctx.arc(lineLeft + arcR1, ry, arcR1, Math.PI, 0);
                                ctx.stroke();

                                // Draw arc for p2 (from p1 to evenNum)
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                var arcR2 = (lineRight - p1x) / 2;
                                ctx.beginPath();
                                ctx.arc(p1x + arcR2, ry, arcR2, Math.PI, 0);
                                ctx.stroke();

                                // Labels
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(p1.toString(), lineLeft - 30, ry);

                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'right';
                                ctx.fillText('+', lineLeft - 18, ry);

                                ctx.fillStyle = viz.colors.orange;
                                ctx.textAlign = 'right';
                                ctx.fillText(p2.toString(), lineLeft - 5, ry);
                            }

                            if (reps.length > maxShow) {
                                viz.screenText('... and ' + (reps.length - maxShow) + ' more', viz.width / 2, plotTop + maxShow * rowH + 10, viz.colors.text, 11);
                            }

                            // Summary
                            viz.screenText(
                                reps.length + ' Goldbach representation' + (reps.length > 1 ? 's' : ''),
                                viz.width / 2, viz.height - 20, viz.colors.teal, 14
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find all twin prime pairs between 1 and 100.',
                    hint: 'Go through the list of primes up to 100 and check which consecutive primes differ by exactly 2.',
                    solution: 'The twin prime pairs up to 100 are: (3,5), (5,7), (11,13), (17,19), (29,31), (41,43), (59,61), (71,73). That is 8 pairs.'
                },
                {
                    question: 'Write 50 as a sum of two primes in all possible ways.',
                    hint: 'For each prime \\(p \\leq 25\\), check whether \\(50 - p\\) is also prime.',
                    solution: '\\(50 = 3 + 47 = 7 + 43 = 13 + 37 = 19 + 31\\). There are 4 Goldbach representations.'
                },
                {
                    question: 'Is there a twin prime pair \\((p, p+2)\\) where both \\(p\\) and \\(p+2\\) are greater than 3 and \\(p\\) is even? Why or why not?',
                    hint: 'What do we know about even numbers greater than 2 and primality?',
                    solution: 'No. If \\(p > 3\\) and \\(p\\) is even, then \\(p\\) is divisible by 2 and has at least three divisors, so \\(p\\) is not prime. Therefore \\((p, p+2)\\) cannot be a twin prime pair. All twin prime pairs (after (2,3)) consist of odd numbers.'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: Finding Primes Efficiently</h2>

<p>In this chapter, we defined primes, saw that every number is built from them, and proved there are infinitely many. We learned trial division as a way to test whether a single number is prime.</p>

<p>But what if we want to find <em>all</em> primes up to a given limit? Testing each number individually by trial division is slow. In the next chapter, we will discover the <strong>Sieve of Eratosthenes</strong>, an ancient and elegant algorithm that finds all primes up to \\(N\\) in one sweep. The sieve is so efficient that it was invented around 200 BCE and is still used today.</p>

<h3>Key Takeaways</h3>

<div class="env-block remark">
    <div class="env-title">Chapter Summary</div>
    <div class="env-body">
        <ul>
            <li>A prime \\(p > 1\\) has exactly two positive divisors: 1 and \\(p\\).</li>
            <li>1 is not prime (it has only one divisor).</li>
            <li>Every integer \\(n > 1\\) has at least one prime factor.</li>
            <li>To test primality, check divisors up to \\(\\sqrt{n}\\) (Theorem 3.2).</li>
            <li>There are infinitely many primes (Euclid's proof, Theorem 3.3).</li>
            <li>Primes become rarer among large numbers, but never stop appearing.</li>
            <li>Twin Prime Conjecture and Goldbach's Conjecture remain unsolved.</li>
        </ul>
    </div>
</div>

<h3>Connections</h3>

<p>The ideas from this chapter connect to many places:</p>
<ul>
    <li><strong>Chapter 4 (Sieve of Eratosthenes):</strong> An efficient method to find all primes up to \\(N\\).</li>
    <li><strong>Chapter 5 (Prime Factorization):</strong> The Fundamental Theorem of Arithmetic, building on the idea that primes are the atoms of arithmetic.</li>
    <li><strong>Chapter 6 (GCD):</strong> The greatest common divisor is deeply connected to prime factorizations.</li>
    <li><strong>Chapter 16 (Codes & Ciphers):</strong> Modern cryptography relies on the difficulty of finding the prime factors of large numbers.</li>
</ul>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Without using a calculator, determine which of the following are prime: 51, 67, 87, 97, 101, 111.',
                    hint: 'For each number, compute \\(\\lfloor\\sqrt{n}\\rfloor\\) and test divisibility by primes up to that value.',
                    solution: '\\(51 = 3 \\times 17\\) (composite). \\(67\\): test 2,3,5,7 (\\(\\sqrt{67}<9\\)); none divide it, so 67 is prime. \\(87 = 3 \\times 29\\) (composite). \\(97\\): test 2,3,5,7 (\\(\\sqrt{97}<10\\)); none divide it, so 97 is prime. \\(101\\): test 2,3,5,7 (\\(\\sqrt{101}<11\\)); none divide it, so 101 is prime. \\(111 = 3 \\times 37\\) (composite).'
                },
                {
                    question: 'Prove that if \\(p\\) is a prime greater than 3, then \\(p^2 - 1\\) is divisible by 24.',
                    hint: 'Factor \\(p^2 - 1 = (p-1)(p+1)\\). Since \\(p\\) is odd and not divisible by 3, what can you say about \\(p-1\\), \\(p\\), and \\(p+1\\)?',
                    solution: 'Since \\(p > 3\\) is prime, \\(p\\) is odd, so \\(p-1\\) and \\(p+1\\) are consecutive even numbers. One of them is divisible by 4, so \\((p-1)(p+1)\\) is divisible by \\(2 \\times 4 = 8\\). Also, among three consecutive integers \\(p-1, p, p+1\\), exactly one is divisible by 3. Since \\(p\\) is prime and \\(p > 3\\), \\(p\\) is not divisible by 3, so one of \\(p-1\\) or \\(p+1\\) is. Thus \\((p-1)(p+1)\\) is divisible by both 8 and 3, hence by \\(\\text{lcm}(8,3) = 24\\).'
                }
            ]
        }
    ]
});
