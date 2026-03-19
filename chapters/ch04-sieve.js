window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'The Sieve of Eratosthenes',
    subtitle: 'An ancient algorithm for finding primes',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Do We Need a Sieve?</h2>

<div class="env-block intuition">
    <div class="env-title">The Search for Primes</div>
    <div class="env-body">
        <p>In the last chapter, we learned what prime numbers are and why they matter. But knowing the <em>definition</em> of a prime is very different from being able to <em>find</em> all the primes up to some number \\(N\\). If \\(N = 100\\), we could test each number one by one, but that is slow and tedious. What if \\(N = 1{,}000{,}000\\)?</p>
        <p>We need a <strong>systematic method</strong>, an algorithm, that finds all primes efficiently. The ancient Greek mathematician Eratosthenes of Cyrene (c. 276 -- 194 BC) invented exactly such a method over 2,200 years ago, and it remains one of the most elegant algorithms in all of mathematics.</p>
    </div>
</div>

<h3>Trial Division Is Slow</h3>

<p>The brute-force approach is <strong>trial division</strong>: for each number \\(n\\) from 2 to \\(N\\), check whether any smaller number (from 2 to \\(n-1\\)) divides it. If none does, \\(n\\) is prime.</p>

<p>This works, but it is painfully slow. To check whether a single number \\(n\\) is prime by trial division, you might need up to \\(n - 2\\) division tests. To find all primes up to \\(N\\), you repeat this for every number, leading to roughly \\(N^2 / 2\\) total operations. For \\(N = 1{,}000{,}000\\), that is about 500 billion operations!</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Eratosthenes was not only a mathematician; he was also the chief librarian of the Great Library of Alexandria and famously estimated the circumference of the Earth with remarkable accuracy. His "sieve" (Greek: <em>koskinon</em>) was described in his lost work <em>Introduction to Arithmetic</em>, and we know of it through later authors like Nicomachus of Gerasa.</p>
    </div>
</div>

<p>The sieve of Eratosthenes takes an entirely different approach. Instead of testing each number individually, it <strong>eliminates composites in bulk</strong>. The idea is beautifully simple: if you know that 2 is prime, then you immediately know that 4, 6, 8, 10, ... are all composite. Cross them all out at once! Then move to the next surviving number and repeat.</p>

<div class="viz-placeholder" data-viz="viz-sieve-race"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-race',
                    title: 'Sieve vs Trial Division: Operation Count',
                    description: 'Compare how many operations each method needs to find all primes up to N. The sieve is dramatically faster.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        VizEngine.createSlider(controls, 'N', 20, 500, N, 10, function(v) {
                            N = Math.round(v / 10) * 10;
                            draw();
                        });

                        function countSieveOps(n) {
                            var ops = 0;
                            var sieve = new Uint8Array(n + 1);
                            for (var i = 2; i * i <= n; i++) {
                                if (!sieve[i]) {
                                    for (var j = i * i; j <= n; j += i) {
                                        if (!sieve[j]) ops++;
                                        sieve[j] = 1;
                                    }
                                }
                            }
                            return ops;
                        }

                        function countTrialOps(n) {
                            var ops = 0;
                            for (var i = 2; i <= n; i++) {
                                for (var d = 2; d * d <= i; d++) {
                                    ops++;
                                    if (i % d === 0) break;
                                }
                            }
                            return ops;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Operations to Find All Primes up to N', viz.width / 2, 20, viz.colors.white, 15);

                            var points = [];
                            var step = Math.max(5, Math.floor(N / 20));
                            for (var n = 10; n <= N; n += step) {
                                points.push({ n: n, sieve: countSieveOps(n), trial: countTrialOps(n) });
                            }
                            if (points[points.length - 1].n !== N) {
                                points.push({ n: N, sieve: countSieveOps(N), trial: countTrialOps(N) });
                            }

                            var maxOps = 0;
                            for (var i = 0; i < points.length; i++) {
                                maxOps = Math.max(maxOps, points[i].trial, points[i].sieve);
                            }
                            if (maxOps < 1) maxOps = 1;

                            var chartL = 70, chartR = viz.width - 30;
                            var chartT = 50, chartB = viz.height - 70;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartL, chartT); ctx.stroke();

                            // X-axis labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var k = 0; k < points.length; k += Math.max(1, Math.floor(points.length / 6))) {
                                var px = chartL + (points[k].n - 10) / (N - 10) * chartW;
                                ctx.fillText(points[k].n, px, chartB + 4);
                            }
                            viz.screenText('N', chartR + 10, chartB, viz.colors.muted, 11);

                            // Y-axis labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            for (var y = 0; y <= 4; y++) {
                                var val = Math.round(maxOps * y / 4);
                                var py = chartB - (y / 4) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(val.toLocaleString(), chartL - 6, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(chartL, py); ctx.lineTo(chartR, py); ctx.stroke();
                            }

                            // Trial division line
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var j = 0; j < points.length; j++) {
                                var x1 = chartL + (points[j].n - 10) / (N - 10) * chartW;
                                var y1 = chartB - (points[j].trial / maxOps) * chartH;
                                j === 0 ? ctx.moveTo(x1, y1) : ctx.lineTo(x1, y1);
                            }
                            ctx.stroke();

                            // Sieve line
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var j2 = 0; j2 < points.length; j2++) {
                                var x2 = chartL + (points[j2].n - 10) / (N - 10) * chartW;
                                var y2 = chartB - (points[j2].sieve / maxOps) * chartH;
                                j2 === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
                            }
                            ctx.stroke();

                            // Legend
                            var legY = viz.height - 30;
                            ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(viz.width / 2 - 140, legY - 5, 14, 3);
                            ctx.fillText('Trial Division', viz.width / 2 - 120, legY);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(viz.width / 2 + 20, legY - 5, 14, 3);
                            ctx.fillText('Sieve', viz.width / 2 + 40, legY);

                            // Final counts
                            var lastPt = points[points.length - 1];
                            var ratio = lastPt.trial > 0 ? (lastPt.trial / Math.max(lastPt.sieve, 1)).toFixed(1) : '?';
                            viz.screenText(
                                'N=' + N + ':  Trial=' + lastPt.trial.toLocaleString() + '  Sieve=' + lastPt.sieve.toLocaleString() + '  (ratio: ' + ratio + 'x)',
                                viz.width / 2, viz.height - 10, viz.colors.white, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Sieve Idea
        // ================================================================
        {
            id: 'sec-idea',
            title: 'The Sieve Idea',
            content: `
<h2>The Sieve Idea</h2>

<div class="env-block intuition">
    <div class="env-title">Crossing Out Composites</div>
    <div class="env-body">
        <p>Imagine writing all the numbers from 2 to \\(N\\) on a board. The sieve works by <em>elimination</em>: we systematically cross out every number that is composite, and whatever survives is prime.</p>
        <p>The key insight is that we do not need to test each number individually. Instead, we use the primes we have already found to eliminate their multiples in bulk.</p>
    </div>
</div>

<h3>The Algorithm in Words</h3>

<p>Here is the sieve of Eratosthenes in plain language:</p>

<ol>
    <li>Write down all integers from 2 to \\(N\\).</li>
    <li>Start with the smallest uncrossed number (which is 2). It is prime.</li>
    <li>Cross out all <strong>multiples</strong> of this prime (but not the prime itself): \\(2p, 3p, 4p, \\ldots\\)</li>
    <li>Move to the next uncrossed number. It is the next prime.</li>
    <li>Repeat steps 3 and 4 until you have processed all primes up to \\(\\sqrt{N}\\).</li>
    <li>Every uncrossed number remaining is prime.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: Sieve up to 30</div>
    <div class="env-body">
        <p>Write: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30.</p>
        <ul>
            <li><strong>p = 2:</strong> Cross out 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.</li>
            <li><strong>p = 3:</strong> Cross out 9, 15, 21, 27 (6, 12, 18, 24, 30 already crossed).</li>
            <li><strong>p = 5:</strong> Cross out 25 (10, 15, 20, 25, 30 already crossed, except 25).</li>
            <li>Since \\(5 < \\sqrt{30} \\approx 5.48\\), and the next uncrossed number is 7 with \\(7 > \\sqrt{30}\\), we stop.</li>
        </ul>
        <p>Surviving numbers: <strong>2, 3, 5, 7, 11, 13, 17, 19, 23, 29</strong>. These are all 10 primes up to 30.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Sieve of Eratosthenes)</div>
    <div class="env-body">
        <p>The <strong>sieve of Eratosthenes</strong> is an algorithm that finds all prime numbers up to a given limit \\(N\\) by iteratively marking the multiples of each prime, starting from 2. After all multiples of primes up to \\(\\lfloor\\sqrt{N}\\rfloor\\) have been marked, the remaining unmarked numbers are the primes up to \\(N\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-crossing-out"></div>
`,
            visualizations: [
                {
                    id: 'viz-crossing-out',
                    title: 'Crossing Out Multiples of a Single Prime',
                    description: 'Pick a prime p and watch its multiples get crossed out one by one. This is a single step of the sieve.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var p = 2;
                        var N = 60;
                        var animStep = 0;
                        var animTimer = null;

                        VizEngine.createSlider(controls, 'Prime p', 2, 11, p, 1, function(v) {
                            var primes = [2, 3, 5, 7, 11];
                            var val = Math.round(v);
                            p = primes.reduce(function(best, pr) { return Math.abs(pr - val) < Math.abs(best - val) ? pr : best; }, 2);
                            animStep = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            animStep = 0;
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animStep++;
                                var maxMult = Math.floor(N / p);
                                if (animStep > maxMult - 1) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                                draw();
                            }, 300);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animStep = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Crossing out multiples of ' + p, viz.width / 2, 18, viz.colors.white, 15);

                            var cols = 10;
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(48, (viz.width - 40) / cols);
                            var cellH = Math.min(38, (viz.height - 80) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 40;

                            var crossed = {};
                            var maxMult = Math.floor(N / p);
                            for (var m = 2; m <= Math.min(animStep + 1, maxMult); m++) {
                                crossed[p * m] = true;
                            }

                            for (var n = 1; n <= N; n++) {
                                var col = (n - 1) % cols;
                                var row = Math.floor((n - 1) / cols);
                                var cx = startX + col * cellW + cellW / 2;
                                var cy = startY + row * cellH + cellH / 2;

                                var isCrossed = crossed[n];
                                var isPrime = (n === p);
                                var isMultiple = (n > p && n % p === 0);
                                var isCurrentlyBeingCrossed = (n === p * (animStep + 1) && animStep > 0);

                                if (isCurrentlyBeingCrossed) {
                                    ctx.fillStyle = viz.colors.red + '44';
                                    ctx.fillRect(cx - cellW / 2 + 2, cy - cellH / 2 + 2, cellW - 4, cellH - 4);
                                }

                                if (isPrime) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath();
                                    ctx.arc(cx, cy, Math.min(cellW, cellH) / 2 - 4, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                } else if (isCrossed) {
                                    ctx.fillStyle = viz.colors.red + '88';
                                } else if (isMultiple && animStep === 0) {
                                    ctx.fillStyle = viz.colors.orange + 'aa';
                                } else {
                                    ctx.fillStyle = viz.colors.text;
                                }

                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n, cx, cy);

                                if (isCrossed) {
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 10, cy - 10);
                                    ctx.lineTo(cx + 10, cy + 10);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(cx + 10, cy - 10);
                                    ctx.lineTo(cx - 10, cy + 10);
                                    ctx.stroke();
                                }
                            }

                            // Count
                            var crossedCount = Object.keys(crossed).length;
                            viz.screenText(
                                'Crossed out: ' + crossedCount + ' multiples of ' + p + '  (from ' + (2 * p) + ' to ' + (Math.min(animStep + 1, maxMult) * p) + ')',
                                viz.width / 2, viz.height - 15, viz.colors.muted, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'When sieving with \\(p = 2\\), how many numbers get crossed out between 2 and 100 (not counting 2 itself)?',
                    hint: 'The multiples of 2 from 4 to 100 are 4, 6, 8, ..., 100. This is an arithmetic sequence.',
                    solution: 'The even numbers from 4 to 100 form the sequence \\(4, 6, 8, \\ldots, 100\\). The count is \\(\\frac{100 - 4}{2} + 1 = 49\\). So 49 numbers are crossed out.'
                },
                {
                    question: 'When sieving with \\(p = 3\\) (after already crossing out multiples of 2), how many <em>new</em> numbers get crossed out between 1 and 100?',
                    hint: 'Multiples of 3 that are also multiples of 2 (i.e., multiples of 6) were already crossed out. Count multiples of 3 that are odd.',
                    solution: 'Multiples of 3 up to 100: \\(\\lfloor 100/3 \\rfloor = 33\\) (not counting 3 itself: 32). Even multiples of 3 (multiples of 6): \\(\\lfloor 100/6 \\rfloor = 16\\). New crossings: \\(32 - 16 = 16\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Step by Step
        // ================================================================
        {
            id: 'sec-step-by-step',
            title: 'Step by Step',
            content: `
<h2>Step by Step</h2>

<p>Let us walk through the sieve of Eratosthenes carefully, paying attention to every detail.</p>

<h3>Phase 1: Start at 2</h3>

<p>The number 2 is the first (and only even) prime. We circle it, then cross out every multiple of 2: \\(4, 6, 8, 10, 12, \\ldots\\) This single step eliminates <em>half</em> of all numbers! The power of the sieve is already apparent.</p>

<h3>Phase 2: Move to 3</h3>

<p>The next uncrossed number after 2 is 3, so 3 is prime. Cross out its multiples: \\(6, 9, 12, 15, 18, \\ldots\\) Many of these (like 6, 12, 18) are already crossed out from the previous step. The only new crossings are the <strong>odd multiples of 3</strong>: \\(9, 15, 21, 27, \\ldots\\)</p>

<h3>Phase 3: Move to 5</h3>

<p>Why skip 4? Because 4 was already crossed out (it is \\(2 \\times 2\\)). The next uncrossed number is 5, so 5 is prime. Cross out \\(25, 35, 55, \\ldots\\) (the multiples of 5 not already eliminated).</p>

<h3>Phase 4: Move to 7, 11, ...</h3>

<p>Continue the same pattern. Each time, the next uncrossed number is the next prime, and we cross out its remaining multiples.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.1 (Correctness of the Sieve)</div>
    <div class="env-body">
        <p>After the sieve of Eratosthenes has processed all primes \\(p \\leq \\sqrt{N}\\), every uncrossed number in the range \\([2, N]\\) is prime.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Suppose \\(n \\leq N\\) is composite. Then \\(n = ab\\) for some \\(2 \\leq a \\leq b\\). Since \\(a \\leq \\sqrt{n} \\leq \\sqrt{N}\\), the smallest prime factor \\(p\\) of \\(n\\) satisfies \\(p \\leq a \\leq \\sqrt{N}\\). So \\(n\\) is a multiple of \\(p\\) and was crossed out when we processed \\(p\\). Therefore every surviving number is prime.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Optimization: Start at \\(p^2\\)</div>
    <div class="env-body">
        <p>When crossing out multiples of a prime \\(p\\), we can start at \\(p^2\\) rather than \\(2p\\). Why? Because every multiple \\(kp\\) with \\(k < p\\) has a prime factor smaller than \\(p\\), so it was already crossed out in an earlier step. For example, when processing \\(p = 5\\), we skip \\(10 = 2 \\times 5\\) and \\(15 = 3 \\times 5\\) (already eliminated) and start at \\(25 = 5^2\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-sieve-animated"></div>
`,
            visualizations: [
                {
                    id: 'viz-sieve-animated',
                    title: 'The Sieve of Eratosthenes: Animated',
                    description: 'The showpiece visualization. Watch the sieve process a 10x10 grid step by step. Each prime gets its own color. Use Play for automatic animation, Step for one crossing at a time, or Reset to start over.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 460,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var primeColors = {};
                        var colorList = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green,
                                         viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                        // State
                        var crossed = {};     // number -> prime that crossed it
                        var primesDone = [];  // primes fully processed
                        var currentPrime = 0; // 0 means not started
                        var currentMult = 0;  // current multiple being crossed
                        var allPrimes = [];   // all primes up to N
                        var animTimer = null;
                        var finished = false;

                        // Precompute primes
                        var sieve = new Uint8Array(N + 1);
                        for (var i = 2; i <= N; i++) {
                            if (!sieve[i]) {
                                allPrimes.push(i);
                                for (var j = i * i; j <= N; j += i) sieve[j] = 1;
                            }
                        }
                        // Assign colors
                        for (var ci = 0; ci < allPrimes.length; ci++) {
                            primeColors[allPrimes[ci]] = colorList[ci % colorList.length];
                        }

                        // Primes we actually sieve with (up to sqrt(N))
                        var sievePrimes = allPrimes.filter(function(p) { return p * p <= N; });
                        var sievePrimeIdx = -1;

                        function reset() {
                            crossed = {};
                            primesDone = [];
                            currentPrime = 0;
                            currentMult = 0;
                            sievePrimeIdx = -1;
                            finished = false;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            draw();
                        }

                        function nextStep() {
                            if (finished) return false;

                            if (currentPrime === 0 || currentMult * currentPrime > N) {
                                // Move to next sieve prime
                                if (currentPrime > 0) primesDone.push(currentPrime);
                                sievePrimeIdx++;
                                if (sievePrimeIdx >= sievePrimes.length) {
                                    finished = true;
                                    draw();
                                    return false;
                                }
                                currentPrime = sievePrimes[sievePrimeIdx];
                                currentMult = currentPrime; // start at p*p = p*currentMult
                            }

                            var target = currentPrime * currentMult;
                            if (target <= N) {
                                if (!crossed[target]) {
                                    crossed[target] = currentPrime;
                                }
                                currentMult++;
                            }

                            if (currentMult * currentPrime > N) {
                                // check if more primes to process
                                if (sievePrimeIdx >= sievePrimes.length - 1) {
                                    primesDone.push(currentPrime);
                                    finished = true;
                                }
                            }

                            draw();
                            return !finished;
                        }

                        VizEngine.createButton(controls, 'Play', function() {
                            if (animTimer) return;
                            if (finished) reset();
                            animTimer = setInterval(function() {
                                if (!nextStep()) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                            }, 80);
                        });

                        VizEngine.createButton(controls, 'Step', function() {
                            if (finished) return;
                            nextStep();
                        });

                        VizEngine.createButton(controls, 'Reset', reset);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var title = 'Sieve of Eratosthenes (1 to ' + N + ')';
                            if (finished) title += '  --  Complete!';
                            else if (currentPrime > 0) title += '  --  sieving p = ' + currentPrime;
                            viz.screenText(title, viz.width / 2, 16, viz.colors.white, 14);

                            var cols = 10;
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(50, (viz.width - 40) / cols);
                            var cellH = Math.min(38, (viz.height - 100) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 36;

                            for (var n = 1; n <= N; n++) {
                                var col = (n - 1) % cols;
                                var row = Math.floor((n - 1) / cols);
                                var cx = startX + col * cellW + cellW / 2;
                                var cy = startY + row * cellH + cellH / 2;

                                var crossedBy = crossed[n];
                                var isPrime = (n >= 2 && !crossedBy && !sieve[n]);
                                var isDone = primesDone.indexOf(n) >= 0;
                                var isCurrent = (n === currentPrime && !finished);
                                var isOne = (n === 1);

                                // Background
                                if (isCurrent) {
                                    ctx.fillStyle = (primeColors[n] || viz.colors.blue) + '44';
                                    ctx.fillRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);
                                } else if (isDone) {
                                    ctx.fillStyle = (primeColors[n] || viz.colors.blue) + '22';
                                    ctx.fillRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);
                                }

                                // Number
                                if (isOne) {
                                    ctx.fillStyle = viz.colors.text + '44';
                                } else if (crossedBy) {
                                    ctx.fillStyle = (primeColors[crossedBy] || viz.colors.red) + '66';
                                } else if (isCurrent || isDone) {
                                    ctx.fillStyle = primeColors[n] || viz.colors.teal;
                                } else if (isPrime && (finished || currentPrime > Math.sqrt(n))) {
                                    ctx.fillStyle = viz.colors.green;
                                } else {
                                    ctx.fillStyle = viz.colors.white;
                                }

                                ctx.font = (isCurrent ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(n, cx, cy);

                                // Strikethrough for crossed
                                if (crossedBy) {
                                    ctx.strokeStyle = (primeColors[crossedBy] || viz.colors.red) + '55';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 10, cy);
                                    ctx.lineTo(cx + 10, cy);
                                    ctx.stroke();
                                }
                            }

                            // Legend at bottom
                            var legY = startY + rows * cellH + 10;
                            var primesFound = [];
                            for (var pf = 0; pf < allPrimes.length; pf++) {
                                if (!crossed[allPrimes[pf]]) primesFound.push(allPrimes[pf]);
                            }

                            if (finished) {
                                viz.screenText('Primes found: ' + primesFound.length, viz.width / 2, legY, viz.colors.green, 12);
                                // Show primes
                                var primesStr = primesFound.join(', ');
                                if (primesStr.length > 80) primesStr = primesStr.substring(0, 77) + '...';
                                viz.screenText(primesStr, viz.width / 2, legY + 18, viz.colors.teal, 10);
                            } else if (currentPrime > 0) {
                                var crossedCount = Object.keys(crossed).length;
                                viz.screenText('Composites eliminated: ' + crossedCount + '   |   Current prime: ' + currentPrime, viz.width / 2, legY, viz.colors.muted, 11);
                            } else {
                                viz.screenText('Press Play or Step to begin the sieve', viz.width / 2, legY, viz.colors.muted, 11);
                            }

                            // Color legend
                            var colorLegY = legY + 34;
                            var doneList = primesDone.slice();
                            if (currentPrime > 0 && doneList.indexOf(currentPrime) < 0) doneList.push(currentPrime);
                            var legX = viz.width / 2 - Math.min(doneList.length * 35, 200);
                            for (var dl = 0; dl < Math.min(doneList.length, 12); dl++) {
                                var dp = doneList[dl];
                                ctx.fillStyle = primeColors[dp] || viz.colors.blue;
                                ctx.beginPath(); ctx.arc(legX + dl * 40, colorLegY, 6, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center';
                                ctx.fillText(dp, legX + dl * 40, colorLegY + 16);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Perform the sieve of Eratosthenes by hand to find all primes up to 50. List the primes.',
                    hint: 'You only need to sieve with primes up to \\(\\lfloor\\sqrt{50}\\rfloor = 7\\), so process p = 2, 3, 5, 7.',
                    solution: 'Cross out multiples of 2: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50. Cross out multiples of 3 (new): 9, 15, 21, 27, 33, 39, 45. Cross out multiples of 5 (new): 25, 35. Cross out multiples of 7 (new): 49. Primes: \\(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47\\). That is 15 primes.'
                },
                {
                    question: 'When sieving up to 100, at which prime do we stop crossing out multiples? Why?',
                    hint: 'What is \\(\\lfloor\\sqrt{100}\\rfloor\\)?',
                    solution: '\\(\\sqrt{100} = 10\\), so we sieve with primes \\(p \\leq 10\\): namely 2, 3, 5, 7. The next prime is 11, but \\(11^2 = 121 > 100\\), so no multiples of 11 in the range remain to cross out.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Why Stop at sqrt(N)?
        // ================================================================
        {
            id: 'sec-why-sqrt',
            title: 'Why Stop at \\(\\sqrt{N}\\)?',
            content: `
<h2>Why Stop at \\(\\sqrt{N}\\)?</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Insight</div>
    <div class="env-body">
        <p>This is one of the most beautiful observations in elementary number theory. It saves the sieve enormous amounts of work, and the reason is purely mathematical.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.2 (Small Factor Theorem)</div>
    <div class="env-body">
        <p>If \\(n > 1\\) is composite, then \\(n\\) has a prime factor \\(p\\) with \\(p \\leq \\sqrt{n}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(n\\) is composite, we can write \\(n = ab\\) where \\(2 \\leq a \\leq b\\). If both \\(a > \\sqrt{n}\\) and \\(b > \\sqrt{n}\\), then \\(ab > \\sqrt{n} \\cdot \\sqrt{n} = n\\), a contradiction. Therefore \\(a \\leq \\sqrt{n}\\).</p>
        <p>Since \\(a \\geq 2\\), the number \\(a\\) has a prime factor \\(p \\leq a \\leq \\sqrt{n}\\). This prime \\(p\\) also divides \\(n\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Consider \\(n = 91\\). Is it prime? We only need to check primes up to \\(\\lfloor\\sqrt{91}\\rfloor = 9\\). The primes to test are 2, 3, 5, 7.</p>
        <ul>
            <li>\\(91 / 2 = 45.5\\) (no)</li>
            <li>\\(91 / 3 = 30.33...\\) (no)</li>
            <li>\\(91 / 5 = 18.2\\) (no)</li>
            <li>\\(91 / 7 = 13\\) (yes!)</li>
        </ul>
        <p>So \\(91 = 7 \\times 13\\) is composite. Notice both factors (7 and 13) satisfy \\(7 \\leq 9 \\leq 13\\), confirming the theorem: at least one factor is \\(\\leq \\sqrt{91}\\).</p>
    </div>
</div>

<h3>Consequence for the Sieve</h3>

<p>This theorem means that once we have sieved with all primes up to \\(\\sqrt{N}\\), every composite number \\(\\leq N\\) has already been crossed out. Any surviving number must be prime. This reduces the work dramatically: to sieve up to 1,000,000, we only need to process primes up to 1,000 (there are only 168 such primes).</p>

<div class="viz-placeholder" data-viz="viz-sqrt-explanation"></div>
`,
            visualizations: [
                {
                    id: 'viz-sqrt-explanation',
                    title: 'Why \\(\\sqrt{N}\\) Is Enough',
                    description: 'For any composite number n, at least one factor must lie at or below the square root. This visualization shows the factor pairs of a number and where the square root falls.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 60;
                        VizEngine.createSlider(controls, 'n', 4, 120, n, 1, function(v) {
                            n = Math.round(v);
                            draw();
                        });

                        function getFactorPairs(num) {
                            var pairs = [];
                            for (var d = 2; d * d <= num; d++) {
                                if (num % d === 0) pairs.push([d, num / d]);
                            }
                            return pairs;
                        }

                        function isPrime(num) {
                            if (num < 2) return false;
                            for (var d = 2; d * d <= num; d++) {
                                if (num % d === 0) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var sqrtN = Math.sqrt(n);
                            var prime = isPrime(n);

                            viz.screenText('Factor pairs of n = ' + n, viz.width / 2, 22, viz.colors.white, 15);

                            if (prime) {
                                viz.screenText(n + ' is PRIME (no factor pairs exist)', viz.width / 2, viz.height / 2 - 20, viz.colors.green, 16);
                                viz.screenText('No divisor from 2 to ' + Math.floor(sqrtN) + ' divides ' + n, viz.width / 2, viz.height / 2 + 10, viz.colors.muted, 12);
                                viz.screenText('\u221A' + n + ' \u2248 ' + sqrtN.toFixed(2), viz.width / 2, viz.height / 2 + 35, viz.colors.teal, 12);
                                return;
                            }

                            var pairs = getFactorPairs(n);

                            // Draw a number line from 1 to n
                            var lineY = viz.height / 2;
                            var lineL = 60, lineR = viz.width - 60;
                            var lineW = lineR - lineL;

                            // Number line
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lineL, lineY); ctx.lineTo(lineR, lineY); ctx.stroke();

                            // Ticks
                            var tickInterval = n <= 30 ? 1 : (n <= 60 ? 5 : 10);
                            ctx.fillStyle = viz.colors.text; ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            for (var t = 0; t <= n; t += tickInterval) {
                                var tx = lineL + (t / n) * lineW;
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(tx, lineY - 4); ctx.lineTo(tx, lineY + 4); ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(t, tx, lineY + 8);
                            }

                            // sqrt(n) marker
                            var sqrtX = lineL + (sqrtN / n) * lineW;
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath(); ctx.moveTo(sqrtX, lineY - 80); ctx.lineTo(sqrtX, lineY + 30); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.teal; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('\u221A' + n + ' \u2248 ' + sqrtN.toFixed(1), sqrtX, lineY + 40);

                            // Labels
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u2264 \u221AN', sqrtX - 40, lineY + 56);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('> \u221AN', sqrtX + 40, lineY + 56);

                            // Draw factor pairs as arcs
                            var arcColors = [viz.colors.blue, viz.colors.purple, viz.colors.orange, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink, viz.colors.teal];
                            for (var pi = 0; pi < pairs.length; pi++) {
                                var a = pairs[pi][0], b = pairs[pi][1];
                                var ax = lineL + (a / n) * lineW;
                                var bx = lineL + (b / n) * lineW;
                                var midX = (ax + bx) / 2;
                                var radius = (bx - ax) / 2;
                                var arcY = lineY - 10 - pi * 14;

                                var color = arcColors[pi % arcColors.length];
                                ctx.strokeStyle = color + 'aa'; ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(midX, lineY, radius, Math.PI, 0);
                                ctx.stroke();

                                // Factor labels
                                ctx.fillStyle = color;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(a, ax, lineY - radius - 6);
                                ctx.fillText(b, bx, lineY - radius - 6);

                                // Dots
                                ctx.beginPath(); ctx.arc(ax, lineY, 4, 0, Math.PI * 2); ctx.fill();
                                ctx.beginPath(); ctx.arc(bx, lineY, 4, 0, Math.PI * 2); ctx.fill();
                            }

                            // Summary
                            viz.screenText(
                                n + ' = ' + pairs.map(function(p) { return p[0] + ' \u00D7 ' + p[1]; }).join(' = '),
                                viz.width / 2, viz.height - 30, viz.colors.white, 12
                            );
                            viz.screenText(
                                'At least one factor in each pair is \u2264 \u221A' + n + ' \u2248 ' + sqrtN.toFixed(1),
                                viz.width / 2, viz.height - 12, viz.colors.teal, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'To determine whether 223 is prime by trial division, what is the largest prime you need to test?',
                    hint: 'Compute \\(\\lfloor\\sqrt{223}\\rfloor\\) and find the largest prime not exceeding it.',
                    solution: '\\(\\sqrt{223} \\approx 14.93\\), so \\(\\lfloor\\sqrt{223}\\rfloor = 14\\). The primes up to 14 are 2, 3, 5, 7, 11, 13. We test each: none divides 223, so 223 is prime.'
                },
                {
                    question: 'Show that if \\(n < p^2\\) for a prime \\(p\\), and no prime less than \\(p\\) divides \\(n\\), then \\(n\\) is prime.',
                    hint: 'Use the Small Factor Theorem. If \\(n\\) were composite, it would have a prime factor \\(q \\leq \\sqrt{n} < p\\).',
                    solution: 'If \\(n\\) were composite, by Theorem 4.2 it has a prime factor \\(q \\leq \\sqrt{n} < \\sqrt{p^2} = p\\). But no prime less than \\(p\\) divides \\(n\\), a contradiction. So \\(n\\) must be prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: How Many Primes?
        // ================================================================
        {
            id: 'sec-how-many',
            title: 'How Many Primes?',
            content: `
<h2>How Many Primes?</h2>

<div class="env-block intuition">
    <div class="env-title">Primes Thin Out</div>
    <div class="env-body">
        <p>As you run the sieve for larger and larger \\(N\\), you notice something: primes become rarer as numbers get bigger. Among the first 10 numbers, there are 4 primes (40%). Among the first 100, there are 25 primes (25%). Among the first 1,000, there are 168 primes (16.8%). The percentage keeps dropping. But do the primes ever run out?</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Prime Counting Function)</div>
    <div class="env-body">
        <p>The <strong>prime counting function</strong> \\(\\pi(N)\\) denotes the number of primes less than or equal to \\(N\\). For example, \\(\\pi(10) = 4\\), \\(\\pi(100) = 25\\), \\(\\pi(1000) = 168\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 4.3 (Euclid, c. 300 BC)</div>
    <div class="env-body">
        <p>There are infinitely many prime numbers. That is, \\(\\pi(N) \\to \\infty\\) as \\(N \\to \\infty\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Euclid's Argument)</div>
    <div class="env-body">
        <p>Suppose for contradiction that there are only finitely many primes: \\(p_1, p_2, \\ldots, p_k\\). Consider the number</p>
        \\[Q = p_1 \\cdot p_2 \\cdots p_k + 1.\\]
        <p>For each \\(i\\), dividing \\(Q\\) by \\(p_i\\) leaves remainder 1, so no \\(p_i\\) divides \\(Q\\). But \\(Q > 1\\), so \\(Q\\) has some prime factor \\(p\\). This prime \\(p\\) is not among \\(p_1, \\ldots, p_k\\), contradicting our assumption that those were all the primes.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>The Prime Number Theorem</h3>

<p>Although primes never run out, they do thin out. The <strong>Prime Number Theorem</strong> (proved independently by Hadamard and de la Vallee Poussin in 1896) gives the precise rate:</p>

\\[\\pi(N) \\approx \\frac{N}{\\ln N}\\]

<p>This means roughly 1 in every \\(\\ln N\\) numbers near \\(N\\) is prime. For \\(N = 1{,}000{,}000\\), this predicts about \\(1{,}000{,}000 / \\ln(1{,}000{,}000) \\approx 72{,}382\\), while the true value is \\(\\pi(1{,}000{,}000) = 78{,}498\\). Not bad for such a simple formula!</p>

<div class="env-block remark">
    <div class="env-title">A Table of \\(\\pi(N)\\)</div>
    <div class="env-body">
        <table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:0.9em;">
            <tr style="border-bottom:2px solid var(--border-default);">
                <th style="padding:6px; text-align:center;">\\(N\\)</th>
                <th style="padding:6px; text-align:center;">\\(\\pi(N)\\)</th>
                <th style="padding:6px; text-align:center;">\\(\\pi(N)/N\\)</th>
                <th style="padding:6px; text-align:center;">\\(N/\\ln N\\)</th>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px; text-align:center;">10</td>
                <td style="padding:6px; text-align:center;">4</td>
                <td style="padding:6px; text-align:center;">40.0%</td>
                <td style="padding:6px; text-align:center;">4.3</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px; text-align:center;">100</td>
                <td style="padding:6px; text-align:center;">25</td>
                <td style="padding:6px; text-align:center;">25.0%</td>
                <td style="padding:6px; text-align:center;">21.7</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px; text-align:center;">1,000</td>
                <td style="padding:6px; text-align:center;">168</td>
                <td style="padding:6px; text-align:center;">16.8%</td>
                <td style="padding:6px; text-align:center;">144.8</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px; text-align:center;">10,000</td>
                <td style="padding:6px; text-align:center;">1,229</td>
                <td style="padding:6px; text-align:center;">12.3%</td>
                <td style="padding:6px; text-align:center;">1,085.7</td>
            </tr>
            <tr>
                <td style="padding:6px; text-align:center;">100,000</td>
                <td style="padding:6px; text-align:center;">9,592</td>
                <td style="padding:6px; text-align:center;">9.6%</td>
                <td style="padding:6px; text-align:center;">8,685.9</td>
            </tr>
        </table>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-prime-count"></div>
<div class="viz-placeholder" data-viz="viz-sieve-speed"></div>
`,
            visualizations: [
                {
                    id: 'viz-prime-count',
                    title: 'The Prime Counting Function \\(\\pi(N)\\)',
                    description: 'See how many primes there are up to N. The staircase function \\(\\pi(N)\\) jumps by 1 at each prime. The smooth curve \\(N/\\ln N\\) is the approximation given by the Prime Number Theorem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxN = 200;
                        VizEngine.createSlider(controls, 'N', 20, 1000, maxN, 10, function(v) {
                            maxN = Math.round(v / 10) * 10;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u03C0(N): The Prime Counting Function', viz.width / 2, 18, viz.colors.white, 14);

                            var primes = VizEngine.sievePrimes(maxN);
                            var piMax = primes.length;

                            var chartL = 60, chartR = viz.width - 30;
                            var chartT = 40, chartB = viz.height - 50;
                            var chartW = chartR - chartL, chartH = chartB - chartT;

                            // Axes
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartR, chartB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(chartL, chartB); ctx.lineTo(chartL, chartT); ctx.stroke();

                            // X labels
                            ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            var xStep = maxN <= 100 ? 10 : (maxN <= 500 ? 50 : 100);
                            for (var x = 0; x <= maxN; x += xStep) {
                                var px = chartL + (x / maxN) * chartW;
                                ctx.fillText(x, px, chartB + 4);
                            }

                            // Y labels
                            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
                            var yStep = piMax <= 20 ? 2 : (piMax <= 50 ? 5 : (piMax <= 200 ? 20 : 50));
                            for (var y = 0; y <= piMax; y += yStep) {
                                var py = chartB - (y / piMax) * chartH;
                                ctx.fillText(y, chartL - 6, py);
                                ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 0.5;
                                ctx.beginPath(); ctx.moveTo(chartL, py); ctx.lineTo(chartR, py); ctx.stroke();
                            }

                            // pi(N) staircase
                            ctx.strokeStyle = viz.colors.teal; ctx.lineWidth = 2;
                            ctx.beginPath();
                            var count = 0;
                            var prevPx = chartL;
                            var prevPy = chartB;
                            ctx.moveTo(chartL, chartB);
                            for (var pi2 = 0; pi2 < primes.length; pi2++) {
                                var p = primes[pi2];
                                var px2 = chartL + (p / maxN) * chartW;
                                var py2 = chartB - (count / piMax) * chartH;
                                ctx.lineTo(px2, py2);
                                count++;
                                var py3 = chartB - (count / piMax) * chartH;
                                ctx.lineTo(px2, py3);
                            }
                            ctx.lineTo(chartR, chartB - (count / piMax) * chartH);
                            ctx.stroke();

                            // N/ln(N) curve
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 1.5;
                            ctx.setLineDash([5, 3]);
                            ctx.beginPath();
                            var started = false;
                            for (var xx = 2; xx <= maxN; xx++) {
                                var approx = xx / Math.log(xx);
                                var apx = chartL + (xx / maxN) * chartW;
                                var apy = chartB - (approx / piMax) * chartH;
                                if (!started) { ctx.moveTo(apx, apy); started = true; }
                                else ctx.lineTo(apx, apy);
                            }
                            ctx.stroke();
                            ctx.setLineDash([]);

                            // Legend
                            var legY = viz.height - 18;
                            ctx.font = '11px -apple-system,sans-serif'; ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(viz.width / 2 - 130, legY - 5, 14, 3);
                            ctx.fillText('\u03C0(N)', viz.width / 2 - 112, legY);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.setLineDash([4, 2]);
                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(viz.width / 2, legY - 5); ctx.lineTo(viz.width / 2 + 14, legY - 5); ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillText('N / ln(N)', viz.width / 2 + 20, legY);

                            viz.screenText('\u03C0(' + maxN + ') = ' + primes.length, viz.width - 70, chartT + 10, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-sieve-speed',
                    title: 'How Fast Can You Sieve?',
                    description: 'Adjust N and see how many primes the sieve finds. The count and density of primes are shown in real time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        VizEngine.createSlider(controls, 'N', 10, 2000, N, 10, function(v) {
                            N = Math.round(v / 10) * 10;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primes = VizEngine.sievePrimes(N);
                            var piN = primes.length;
                            var density = (piN / N * 100).toFixed(1);
                            var approx = N > 1 ? (N / Math.log(N)).toFixed(0) : '0';

                            viz.screenText('Sieve Results for N = ' + N, viz.width / 2, 22, viz.colors.white, 16);

                            // Big numbers
                            var midY = viz.height / 2 - 20;
                            viz.screenText(piN.toString(), viz.width / 4, midY, viz.colors.teal, 48);
                            viz.screenText('primes found', viz.width / 4, midY + 35, viz.colors.muted, 12);

                            viz.screenText(density + '%', viz.width * 3 / 4, midY, viz.colors.orange, 48);
                            viz.screenText('prime density', viz.width * 3 / 4, midY + 35, viz.colors.muted, 12);

                            // Bar showing prime fraction
                            var barY = viz.height - 80;
                            var barL = 60, barR = viz.width - 60;
                            var barW = barR - barL;
                            var barH = 24;

                            // Total bar
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(barL, barY, barW, barH);

                            // Prime portion
                            var primeFrac = piN / N;
                            ctx.fillStyle = viz.colors.teal + 'aa';
                            ctx.fillRect(barL, barY, barW * primeFrac, barH);

                            ctx.fillStyle = viz.colors.white; ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                            ctx.fillText(piN + ' primes', barL + 6, barY + barH / 2);
                            ctx.textAlign = 'right';
                            ctx.fillText((N - piN) + ' composites', barR - 6, barY + barH / 2);

                            // PNT approximation
                            viz.screenText(
                                'Prime Number Theorem: \u03C0(' + N + ') \u2248 N/ln(N) = ' + approx + '  (actual: ' + piN + ')',
                                viz.width / 2, viz.height - 30, viz.colors.muted, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Without using a calculator, estimate \\(\\pi(10{,}000)\\) using the Prime Number Theorem. The actual value is 1,229. How close is the estimate?',
                    hint: '\\(\\ln(10{,}000) = \\ln(10^4) = 4 \\ln 10 \\approx 4 \\times 2.303 = 9.21\\).',
                    solution: '\\(\\pi(10{,}000) \\approx \\frac{10{,}000}{\\ln(10{,}000)} = \\frac{10{,}000}{9.21} \\approx 1{,}086\\). The actual value is 1,229, so the PNT underestimates by about 11.6%. The approximation improves for larger \\(N\\).'
                },
                {
                    question: 'If there are infinitely many primes, does the sum \\(\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{5} + \\frac{1}{7} + \\frac{1}{11} + \\cdots\\) (reciprocals of all primes) converge or diverge?',
                    hint: 'This was proved by Euler in 1737. Think about what the Prime Number Theorem tells you: roughly 1 in \\(\\ln N\\) numbers near \\(N\\) is prime.',
                    solution: 'It diverges! Euler proved this in 1737. Heuristically, the "probability" that a number \\(n\\) is prime is about \\(1/\\ln n\\), so the sum of reciprocals of primes behaves like \\(\\sum 1/(n \\ln n)\\), which diverges (integral test). A precise proof uses the Euler product formula for the Riemann zeta function.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From Finding Primes to Using Them</h2>

<p>In this chapter, we built a powerful tool: the sieve of Eratosthenes, an efficient algorithm for finding all primes up to any given number. Along the way, we proved two fundamental theorems:</p>

<ol>
    <li>The <strong>Small Factor Theorem</strong>: every composite number \\(n\\) has a prime factor \\(\\leq \\sqrt{n}\\). This is why the sieve only needs to process primes up to \\(\\sqrt{N}\\).</li>
    <li><strong>Euclid's Theorem</strong>: there are infinitely many primes. The primes never run out, even though they become rarer as numbers grow.</li>
</ol>

<p>We also encountered the prime counting function \\(\\pi(N)\\) and the Prime Number Theorem, which tells us that primes thin out at a rate of about \\(1/\\ln N\\).</p>

<div class="env-block intuition">
    <div class="env-title">What Comes Next?</div>
    <div class="env-body">
        <p>Now that we can <em>find</em> primes efficiently, the next question is: how do we <em>use</em> them? In Chapter 5, we will explore <strong>prime factorization</strong>, the process of breaking any integer into a product of primes. The Fundamental Theorem of Arithmetic guarantees that this factorization is essentially unique, making it one of the most important results in all of number theory.</p>
        <p>The sieve we built in this chapter will be a key computational tool going forward.</p>
    </div>
</div>

<h3>Key Ideas from This Chapter</h3>

<div class="env-block definition">
    <div class="env-title">Summary of Key Results</div>
    <div class="env-body">
        <ul>
            <li>The <strong>sieve of Eratosthenes</strong> finds all primes up to \\(N\\) by iteratively crossing out multiples of each prime, starting from 2.</li>
            <li>We only need to sieve with primes up to \\(\\lfloor\\sqrt{N}\\rfloor\\), since every composite \\(\\leq N\\) has a factor in that range.</li>
            <li>The sieve is much faster than trial division: roughly \\(O(N \\log \\log N)\\) operations vs. \\(O(N\\sqrt{N})\\) for trial division.</li>
            <li>The number of primes up to \\(N\\) is approximately \\(N / \\ln N\\) (the Prime Number Theorem).</li>
            <li>There are infinitely many primes (Euclid).</li>
        </ul>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The number \\(2^{31} - 1 = 2{,}147{,}483{,}647\\) is a famous prime (a Mersenne prime). To verify it is prime by trial division, up to what value would you need to check? How many primes are there up to that value (use the PNT to estimate)?',
                    hint: 'Compute \\(\\lfloor\\sqrt{2^{31} - 1}\\rfloor\\) and apply \\(\\pi(N) \\approx N/\\ln N\\).',
                    solution: '\\(\\sqrt{2^{31} - 1} \\approx 2^{15.5} \\approx 46{,}341\\). We need to check primes up to 46,341. By the PNT, \\(\\pi(46{,}341) \\approx 46{,}341 / \\ln(46{,}341) \\approx 46{,}341 / 10.74 \\approx 4{,}315\\). The actual value is \\(\\pi(46{,}341) = 4{,}792\\). So about 4,800 trial divisions suffice.'
                },
                {
                    question: 'Prove that for every \\(n \\geq 2\\), there exists a prime \\(p\\) with \\(n < p \\leq n! + 1\\). (This gives another proof that there are infinitely many primes.)',
                    hint: 'Consider \\(n! + 1\\). Show it is not divisible by any prime \\(\\leq n\\), so its smallest prime factor must be greater than \\(n\\).',
                    solution: 'For any prime \\(p \\leq n\\), we have \\(p \\mid n!\\), so \\(n! + 1 \\equiv 1 \\pmod{p}\\), meaning \\(p \\nmid (n! + 1)\\). Since \\(n! + 1 > 1\\), it has some prime factor \\(q\\). This \\(q\\) does not divide \\(n!\\), so \\(q > n\\). Also \\(q \\leq n! + 1\\). Hence \\(n < q \\leq n! + 1\\).'
                }
            ]
        }
    ]
});
