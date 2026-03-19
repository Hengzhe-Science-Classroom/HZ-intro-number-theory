window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Perfect Numbers & Amicable Pairs',
    subtitle: 'Numbers that are the sum of their parts',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Numbers with Hidden Structure</h2>

<div class="env-block intuition">
    <div class="env-title">A Simple Question</div>
    <div class="env-body">
        <p>Pick a number, say 12. Its proper divisors (divisors other than 12 itself) are 1, 2, 3, 4, and 6. Add them up: \\(1 + 2 + 3 + 4 + 6 = 16\\). The sum overshoots 12.</p>
        <p>Now try 6. Its proper divisors are 1, 2, and 3. The sum \\(1 + 2 + 3 = 6\\) lands <em>exactly</em> back on the number itself. This is no coincidence; it is one of the oldest curiosities in mathematics.</p>
    </div>
</div>

<p>The ancient Greeks were fascinated by relationships between a number and its divisors. They classified numbers by how the sum of their proper divisors compares to the number:</p>

<ul>
    <li><strong>Perfect:</strong> the sum equals the number (like 6).</li>
    <li><strong>Abundant:</strong> the sum exceeds the number (like 12).</li>
    <li><strong>Deficient:</strong> the sum falls short (like 8, whose divisors 1 + 2 + 4 = 7 &lt; 8).</li>
</ul>

<p>This classification leads to deep questions. How many perfect numbers exist? Is there a pattern? Are there pairs of numbers where each is the sum of the other's proper divisors? These questions have driven number theory for over two thousand years.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Euclid (circa 300 BC) proved that if \\(2^p - 1\\) is prime, then \\(2^{p-1}(2^p - 1)\\) is perfect. Euler, two thousand years later, proved the converse for even perfect numbers. Whether odd perfect numbers exist remains one of the oldest open problems in mathematics.</p>
    </div>
</div>

<h3>The Divisor Sum Function</h3>

<div class="env-block definition">
    <div class="env-title">Definition (Sum of Divisors)</div>
    <div class="env-body">
        <p>For a positive integer \\(n\\), we define:</p>
        <ul>
            <li>\\(\\sigma(n) = \\) sum of <em>all</em> positive divisors of \\(n\\) (including \\(n\\) itself).</li>
            <li>\\(s(n) = \\sigma(n) - n = \\) sum of the <em>proper</em> divisors of \\(n\\).</li>
        </ul>
        <p>A number \\(n\\) is <strong>perfect</strong> when \\(s(n) = n\\), equivalently \\(\\sigma(n) = 2n\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Computing \\(\\sigma\\)</div>
    <div class="env-body">
        <p>\\(\\sigma(12) = 1 + 2 + 3 + 4 + 6 + 12 = 28\\), so \\(s(12) = 28 - 12 = 16 > 12\\). The number 12 is abundant.</p>
        <p>\\(\\sigma(6) = 1 + 2 + 3 + 6 = 12 = 2 \\times 6\\), so \\(s(6) = 6\\). The number 6 is perfect.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-perfect-checker"></div>
`,
            visualizations: [
                {
                    id: 'viz-perfect-checker',
                    title: 'Divisor Sum Checker',
                    description: 'Enter any positive integer to compute its proper divisors, their sum, and whether the number is perfect, abundant, or deficient.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentN = 28;

                        VizEngine.createSlider(controls, 'n', 1, 200, currentN, 1, function(v) {
                            currentN = Math.round(v);
                            draw();
                        });

                        function getProperDivisors(n) {
                            var divs = [];
                            if (n <= 1) return divs;
                            for (var i = 1; i <= Math.floor(n / 2); i++) {
                                if (n % i === 0) divs.push(i);
                            }
                            return divs;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = currentN;
                            var divs = getProperDivisors(n);
                            var sum = divs.reduce(function(a, b) { return a + b; }, 0);

                            var classification;
                            var classColor;
                            if (sum === n) { classification = 'Perfect'; classColor = viz.colors.green; }
                            else if (sum > n) { classification = 'Abundant'; classColor = viz.colors.orange; }
                            else { classification = 'Deficient'; classColor = viz.colors.blue; }

                            // Title
                            viz.screenText('Divisor Sum Checker', viz.width / 2, 25, viz.colors.white, 16);

                            // Number display
                            viz.screenText('n = ' + n, viz.width / 2, 60, viz.colors.white, 24);

                            // Classification
                            viz.screenText(classification, viz.width / 2, 90, classColor, 18);

                            // Divisors
                            var divStr = divs.length > 0 ? divs.join(', ') : '(none)';
                            if (divStr.length > 60) {
                                divStr = divs.slice(0, 12).join(', ') + ', ... (' + divs.length + ' divisors)';
                            }
                            viz.screenText('Proper divisors: ' + divStr, viz.width / 2, 130, viz.colors.text, 12);

                            // Sum equation
                            var eqStr;
                            if (divs.length <= 8) {
                                eqStr = divs.join(' + ') + ' = ' + sum;
                            } else {
                                eqStr = divs.slice(0, 6).join(' + ') + ' + ... = ' + sum;
                            }
                            viz.screenText('s(' + n + ') = ' + eqStr, viz.width / 2, 160, viz.colors.teal, 13);

                            // Visual comparison bar
                            var barY = 210;
                            var barH = 30;
                            var maxVal = Math.max(n, sum);
                            var barMaxW = 400;

                            // n bar
                            var nBarW = (n / maxVal) * barMaxW;
                            ctx.fillStyle = viz.colors.purple + '88';
                            ctx.fillRect(80, barY, nBarW, barH);
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(80, barY, nBarW, barH);
                            viz.screenText('n = ' + n, 80 + nBarW / 2, barY + barH / 2, viz.colors.white, 12);

                            // s(n) bar
                            var sBarW = (sum / maxVal) * barMaxW;
                            ctx.fillStyle = classColor + '88';
                            ctx.fillRect(80, barY + barH + 10, sBarW, barH);
                            ctx.strokeStyle = classColor;
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(80, barY + barH + 10, sBarW, barH);
                            viz.screenText('s(n) = ' + sum, 80 + sBarW / 2, barY + barH + 10 + barH / 2, viz.colors.white, 12);

                            // Sigma
                            viz.screenText('\u03C3(' + n + ') = ' + (sum + n), viz.width / 2, barY + 2 * barH + 35, viz.colors.text, 13);

                            // Ratio
                            var ratio = (sum + n) / n;
                            viz.screenText('\u03C3(n)/n = ' + ratio.toFixed(4) + (sum === n ? ' = 2 (perfect!)' : ''), viz.width / 2, barY + 2 * barH + 55, viz.colors.text, 12);

                            // Fun facts for perfect numbers
                            if (sum === n) {
                                viz.screenText(n + ' is a perfect number!', viz.width / 2, viz.height - 30, viz.colors.green, 14);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Perfect Numbers
        // ================================================================
        {
            id: 'sec-perfect',
            title: 'Perfect Numbers',
            content: `
<h2>Perfect Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Perfect Number)</div>
    <div class="env-body">
        <p>A positive integer \\(n\\) is <strong>perfect</strong> if it equals the sum of its proper divisors:</p>
        \\[s(n) = n, \\quad \\text{equivalently} \\quad \\sigma(n) = 2n.\\]
    </div>
</div>

<p>The first four perfect numbers have been known since antiquity:</p>

<ul>
    <li>\\(6 = 1 + 2 + 3\\)</li>
    <li>\\(28 = 1 + 2 + 4 + 7 + 14\\)</li>
    <li>\\(496 = 1 + 2 + 4 + 8 + 16 + 31 + 62 + 124 + 248\\)</li>
    <li>\\(8128 = 1 + 2 + 4 + 8 + 16 + 32 + 64 + 127 + 254 + 508 + 1016 + 2032 + 4064\\)</li>
</ul>

<p>Notice how rare they are: among the first 10,000 positive integers, only four are perfect.</p>

<h3>The Structure of Even Perfect Numbers</h3>

<p>Each of these four numbers has a specific form. Observe:</p>
<ul>
    <li>\\(6 = 2^1 \\times 3 = 2^1(2^2 - 1)\\)</li>
    <li>\\(28 = 2^2 \\times 7 = 2^2(2^3 - 1)\\)</li>
    <li>\\(496 = 2^4 \\times 31 = 2^4(2^5 - 1)\\)</li>
    <li>\\(8128 = 2^6 \\times 127 = 2^6(2^7 - 1)\\)</li>
</ul>

<p>The pattern: each is \\(2^{p-1}(2^p - 1)\\) where \\(2^p - 1\\) is prime.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.1 (Euclid-Euler Theorem)</div>
    <div class="env-body">
        <p><strong>Euclid (IX.36):</strong> If \\(2^p - 1\\) is prime, then \\(n = 2^{p-1}(2^p - 1)\\) is perfect.</p>
        <p><strong>Euler's converse:</strong> Every <em>even</em> perfect number has this form.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Euclid's direction)</div>
    <div class="env-body">
        <p>Let \\(q = 2^p - 1\\) be prime. Then \\(n = 2^{p-1} q\\).</p>
        <p>Since \\(\\gcd(2^{p-1}, q) = 1\\), the divisor sum function is multiplicative:</p>
        \\[\\sigma(n) = \\sigma(2^{p-1}) \\cdot \\sigma(q).\\]
        <p>We compute each factor:</p>
        <ul>
            <li>\\(\\sigma(2^{p-1}) = 1 + 2 + 4 + \\cdots + 2^{p-1} = 2^p - 1 = q\\).</li>
            <li>\\(\\sigma(q) = 1 + q\\) (since \\(q\\) is prime).</li>
        </ul>
        <p>Therefore \\(\\sigma(n) = q(1 + q) = q \\cdot 2^p = 2 \\cdot 2^{p-1} q = 2n\\), so \\(n\\) is perfect.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block remark">
    <div class="env-title">Open Problem</div>
    <div class="env-body">
        <p>No odd perfect number has ever been found. If one exists, it must be greater than \\(10^{1500}\\) and satisfy many restrictive conditions. Most number theorists believe none exist, but this remains unproven.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-perfect-gallery"></div>
`,
            visualizations: [
                {
                    id: 'viz-perfect-gallery',
                    title: 'Gallery of Perfect Numbers',
                    description: 'The first four perfect numbers with their complete divisor decompositions. Each number equals the sum of its proper divisors.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var perfects = [
                            { n: 6, p: 2, divs: [1, 2, 3] },
                            { n: 28, p: 3, divs: [1, 2, 4, 7, 14] },
                            { n: 496, p: 5, divs: [1, 2, 4, 8, 16, 31, 62, 124, 248] },
                            { n: 8128, p: 7, divs: [1, 2, 4, 8, 16, 32, 64, 127, 254, 508, 1016, 2032, 4064] }
                        ];

                        var selectedIdx = 0;
                        VizEngine.createSlider(controls, 'Perfect #', 1, 4, 1, 1, function(v) {
                            selectedIdx = Math.round(v) - 1;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pf = perfects[selectedIdx];

                            viz.screenText('Perfect Number: ' + pf.n, viz.width / 2, 30, viz.colors.green, 20);
                            viz.screenText('2^{' + (pf.p - 1) + '} \u00D7 (2^' + pf.p + ' \u2212 1) = ' +
                                Math.pow(2, pf.p - 1) + ' \u00D7 ' + (Math.pow(2, pf.p) - 1),
                                viz.width / 2, 55, viz.colors.teal, 13);

                            // Show divisors as blocks
                            var divs = pf.divs;
                            var maxDiv = divs[divs.length - 1];
                            var totalArea = divs.reduce(function(a, b) { return a + b; }, 0);

                            // Draw divisor bars proportional to their value
                            var barAreaW = 480;
                            var barY = 90;
                            var barH = 28;
                            var gap = 2;

                            // Compute bar widths proportional to divisor values
                            var totalBarW = barAreaW - (divs.length - 1) * gap;
                            var xPos = (viz.width - barAreaW) / 2;

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.green,
                                viz.colors.orange, viz.colors.purple, viz.colors.pink,
                                viz.colors.yellow, viz.colors.red, viz.colors.blue,
                                viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple];

                            for (var i = 0; i < divs.length; i++) {
                                var w = Math.max(8, (divs[i] / totalArea) * totalBarW);
                                var col = colors[i % colors.length];
                                ctx.fillStyle = col + 'aa';
                                ctx.fillRect(xPos, barY, w, barH);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(xPos, barY, w, barH);

                                if (w > 18) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = (w > 30 ? '11' : '9') + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(divs[i].toString(), xPos + w / 2, barY + barH / 2);
                                }
                                xPos += w + gap;
                            }

                            // Sum equation
                            var eqParts = divs.join(' + ');
                            if (eqParts.length > 70) {
                                eqParts = divs.slice(0, 6).join(' + ') + ' + ... + ' + divs[divs.length - 1];
                            }
                            viz.screenText(eqParts + ' = ' + pf.n, viz.width / 2, barY + barH + 25, viz.colors.white, 12);

                            // Divisor count
                            viz.screenText('Number of proper divisors: ' + divs.length, viz.width / 2, barY + barH + 50, viz.colors.text, 12);
                            viz.screenText('\u03C3(' + pf.n + ') = ' + (2 * pf.n), viz.width / 2, barY + barH + 70, viz.colors.teal, 12);

                            // Visual representation: divisors as a "building" stacking up
                            var buildY = 220;
                            var buildH = 160;
                            var blockW = 60;
                            var blockStartX = (viz.width - blockW) / 2;

                            // Stack blocks from bottom, height proportional to divisor value
                            var totalStackH = buildH;
                            var stackY = buildY + buildH;

                            for (var j = 0; j < divs.length; j++) {
                                var bh = Math.max(4, (divs[j] / totalArea) * totalStackH);
                                stackY -= bh;
                                var col2 = colors[j % colors.length];
                                ctx.fillStyle = col2 + '99';
                                ctx.fillRect(blockStartX, stackY, blockW, bh);
                                ctx.strokeStyle = col2;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(blockStartX, stackY, blockW, bh);
                                if (bh > 10) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(divs[j].toString(), blockStartX + blockW + 8, stackY + bh / 2);
                                }
                            }

                            // Label the stack
                            viz.screenText('Divisors stacked', blockStartX + blockW / 2, buildY + buildH + 16, viz.colors.text, 10);
                            viz.screenText('= ' + pf.n, blockStartX + blockW / 2, buildY + buildH + 30, viz.colors.green, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that 496 is perfect by listing all its proper divisors and computing their sum.',
                    hint: 'Since \\(496 = 2^4 \\times 31\\), its divisors are all products of powers of 2 (from \\(2^0\\) to \\(2^4\\)) with powers of 31 (from \\(31^0\\) to \\(31^1\\)).',
                    solution: 'Divisors of 496: 1, 2, 4, 8, 16, 31, 62, 124, 248, 496. Proper divisors: 1 + 2 + 4 + 8 + 16 + 31 + 62 + 124 + 248 = 496. Since \\(s(496) = 496\\), it is perfect. Alternatively, \\(\\sigma(496) = (1+2+4+8+16)(1+31) = 31 \\times 32 = 992 = 2 \\times 496\\).'
                },
                {
                    question: 'In the Euclid-Euler theorem, why must \\(p\\) itself be prime for \\(2^p - 1\\) to have any chance of being prime?',
                    hint: 'If \\(p = ab\\) with \\(a, b > 1\\), can you factor \\(2^p - 1\\)?',
                    solution: 'If \\(p = ab\\), then \\(2^p - 1 = (2^a)^b - 1\\), and \\(x^b - 1\\) factors as \\((x-1)(x^{b-1} + x^{b-2} + \\cdots + 1)\\) with \\(x = 2^a\\). So \\(2^a - 1\\) divides \\(2^{ab} - 1\\), and since \\(a > 1\\), we have \\(2^a - 1 > 1\\), making \\(2^p - 1\\) composite. Therefore \\(p\\) must be prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Abundant & Deficient Numbers
        // ================================================================
        {
            id: 'sec-abundant-deficient',
            title: 'Abundant & Deficient',
            content: `
<h2>Abundant and Deficient Numbers</h2>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>A positive integer \\(n > 1\\) is:</p>
        <ul>
            <li><strong>Abundant</strong> if \\(\\sigma(n) > 2n\\) (equivalently \\(s(n) > n\\)).</li>
            <li><strong>Deficient</strong> if \\(\\sigma(n) < 2n\\) (equivalently \\(s(n) < n\\)).</li>
            <li><strong>Perfect</strong> if \\(\\sigma(n) = 2n\\).</li>
        </ul>
        <p>The <strong>abundance</strong> of \\(n\\) is \\(a(n) = s(n) - n = \\sigma(n) - 2n\\). It is positive for abundant numbers, negative for deficient, and zero for perfect.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(n = 12\\): \\(s(12) = 1+2+3+4+6 = 16 > 12\\). Abundant, with abundance 4.</li>
            <li>\\(n = 8\\): \\(s(8) = 1+2+4 = 7 < 8\\). Deficient, with abundance \\(-1\\).</li>
            <li>\\(n = 18\\): \\(s(18) = 1+2+3+6+9 = 21 > 18\\). Abundant, with abundance 3.</li>
        </ul>
    </div>
</div>

<h3>Patterns and Observations</h3>

<div class="env-block theorem">
    <div class="env-title">Proposition 12.2</div>
    <div class="env-body">
        <ol>
            <li>Every prime \\(p\\) is deficient, since \\(s(p) = 1\\).</li>
            <li>Every power of 2, \\(n = 2^k\\), is deficient: \\(s(2^k) = 2^k - 1\\).</li>
            <li>Every proper multiple of a perfect number is abundant.</li>
            <li>The smallest abundant number is 12.</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Part 3)</div>
    <div class="env-body">
        <p>Let \\(m\\) be perfect and \\(n = km\\) with \\(k \\geq 2\\). Every divisor \\(d\\) of \\(m\\) gives a divisor \\(kd\\) of \\(n\\), plus \\(d\\) itself divides \\(n\\). So \\(\\sigma(n)\\) includes at least \\(\\sigma(m) + k \\cdot \\sigma(m) - \\text{(overlaps)}\\). More directly: since \\(m \\mid n\\), the divisors of \\(m\\) are among the divisors of \\(n\\), so \\(\\sigma(n) \\geq \\sigma(m) + n = 2m + n > 2n\\) for \\(k \\geq 2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>Among the first 100 positive integers, about 76 are deficient, 21 are abundant, and 2 are perfect (6 and 28). Deficient numbers dominate.</p>

<div class="viz-placeholder" data-viz="viz-abundant-deficient-grid"></div>
`,
            visualizations: [
                {
                    id: 'viz-abundant-deficient-grid',
                    title: 'Abundant / Deficient / Perfect Grid',
                    description: 'Each cell represents a number from 1 to N, colored by its classification: green for perfect, orange for abundant, blue for deficient.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxN = 100;
                        VizEngine.createSlider(controls, 'N', 20, 200, maxN, 10, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function sumProperDivisors(n) {
                            if (n <= 1) return 0;
                            var s = 1;
                            for (var i = 2; i * i <= n; i++) {
                                if (n % i === 0) {
                                    s += i;
                                    if (i !== n / i) s += n / i;
                                }
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Classification of 1 to ' + maxN, viz.width / 2, 20, viz.colors.white, 14);

                            var cols = Math.ceil(Math.sqrt(maxN * 1.4));
                            var rows = Math.ceil(maxN / cols);
                            var cellW = Math.min(28, (viz.width - 60) / cols);
                            var cellH = Math.min(28, (viz.height - 100) / rows);
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 45;

                            var counts = { perfect: 0, abundant: 0, deficient: 0 };

                            for (var n = 1; n <= maxN; n++) {
                                var row = Math.floor((n - 1) / cols);
                                var col = (n - 1) % cols;
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;

                                var s = sumProperDivisors(n);
                                var color;
                                if (n === 1) { color = viz.colors.text + '44'; counts.deficient++; }
                                else if (s === n) { color = viz.colors.green; counts.perfect++; }
                                else if (s > n) { color = viz.colors.orange; counts.abundant++; }
                                else { color = viz.colors.blue + '99'; counts.deficient++; }

                                ctx.fillStyle = color;
                                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

                                if (cellW >= 16) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = (cellW >= 22 ? '9' : '7') + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(n.toString(), x + cellW / 2, y + cellH / 2);
                                }
                            }

                            // Legend and counts
                            var legY = startY + rows * cellH + 15;

                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(100, legY, 12, 12);
                            viz.screenText('Perfect: ' + counts.perfect, 140, legY + 6, viz.colors.text, 11, 'left');

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(230, legY, 12, 12);
                            viz.screenText('Abundant: ' + counts.abundant, 270, legY + 6, viz.colors.text, 11, 'left');

                            ctx.fillStyle = viz.colors.blue + '99';
                            ctx.fillRect(370, legY, 12, 12);
                            viz.screenText('Deficient: ' + counts.deficient, 410, legY + 6, viz.colors.text, 11, 'left');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that every even number of the form \\(2^a \\cdot p\\) where \\(p\\) is an odd prime is deficient when \\(p > 2^{a+1} - 1\\), and abundant when \\(p < 2^{a+1} - 1\\).',
                    hint: 'Compute \\(\\sigma(2^a \\cdot p) = (2^{a+1}-1)(1+p)\\) and compare with \\(2 \\cdot 2^a \\cdot p\\).',
                    solution: '\\(\\sigma(2^a p) = \\sigma(2^a)\\sigma(p) = (2^{a+1}-1)(1+p)\\). The number is perfect when \\((2^{a+1}-1)(1+p) = 2^{a+1}p\\), i.e., \\(p = 2^{a+1}-1\\). It is abundant when \\((2^{a+1}-1)(1+p) > 2^{a+1}p\\), which simplifies to \\(2^{a+1}-1 > (2^{a+1}-1-1)p/(1+p)\\), ultimately \\(p < 2^{a+1}-1\\). Deficient when \\(p > 2^{a+1}-1\\).'
                },
                {
                    question: 'Find the smallest odd abundant number.',
                    hint: 'It is less than 1000. Try multiples of small odd numbers like 3, 5, 7, 9, 15, 21, 45...',
                    solution: 'The smallest odd abundant number is 945. Its proper divisors are 1, 3, 5, 7, 9, 15, 21, 27, 35, 45, 63, 105, 135, 189, 315. Their sum is \\(1+3+5+7+9+15+21+27+35+45+63+105+135+189+315 = 975 > 945\\). Note \\(945 = 3^3 \\times 5 \\times 7\\); having many small prime factors makes abundance more likely.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Mersenne Primes
        // ================================================================
        {
            id: 'sec-mersenne',
            title: 'Mersenne Primes',
            content: `
<h2>Mersenne Primes</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Mersenne Number)</div>
    <div class="env-body">
        <p>A <strong>Mersenne number</strong> is an integer of the form \\(M_p = 2^p - 1\\) where \\(p\\) is a positive integer. If \\(M_p\\) is also prime, it is called a <strong>Mersenne prime</strong>.</p>
    </div>
</div>

<p>We saw that for \\(2^p - 1\\) to be prime, \\(p\\) must itself be prime. But the converse fails: \\(p\\) being prime does not guarantee \\(2^p - 1\\) is prime.</p>

<div class="env-block example">
    <div class="env-title">Example: Not Every Prime Exponent Works</div>
    <div class="env-body">
        <ul>
            <li>\\(p = 2\\): \\(2^2 - 1 = 3\\). Prime. \\(\\checkmark\\)</li>
            <li>\\(p = 3\\): \\(2^3 - 1 = 7\\). Prime. \\(\\checkmark\\)</li>
            <li>\\(p = 5\\): \\(2^5 - 1 = 31\\). Prime. \\(\\checkmark\\)</li>
            <li>\\(p = 7\\): \\(2^7 - 1 = 127\\). Prime. \\(\\checkmark\\)</li>
            <li>\\(p = 11\\): \\(2^{11} - 1 = 2047 = 23 \\times 89\\). Not prime. \\(\\times\\)</li>
            <li>\\(p = 13\\): \\(2^{13} - 1 = 8191\\). Prime. \\(\\checkmark\\)</li>
        </ul>
    </div>
</div>

<h3>The Connection to Perfect Numbers</h3>

<p>Every known Mersenne prime gives a perfect number via Euclid's formula, and every even perfect number corresponds to a Mersenne prime. The search for perfect numbers is therefore identical to the search for Mersenne primes.</p>

<div class="env-block remark">
    <div class="env-title">The Great Internet Mersenne Prime Search (GIMPS)</div>
    <div class="env-body">
        <p>As of 2024, 51 Mersenne primes are known. The largest, \\(2^{82,589,933} - 1\\), has over 24 million digits. GIMPS is a distributed computing project where volunteers search for new Mersenne primes using the Lucas-Lehmer test.</p>
    </div>
</div>

<h3>Testing for Mersenne Primes</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.3 (Lucas-Lehmer Test, Statement Only)</div>
    <div class="env-body">
        <p>For an odd prime \\(p\\), define the sequence \\(s_0 = 4\\), \\(s_{k+1} = s_k^2 - 2 \\pmod{2^p - 1}\\). Then \\(2^p - 1\\) is prime if and only if \\(s_{p-2} \\equiv 0 \\pmod{2^p - 1}\\).</p>
    </div>
</div>

<p>This test is remarkably efficient: it requires only \\(p - 2\\) squarings modulo \\(2^p - 1\\), making it feasible to test even very large candidates.</p>

<div class="viz-placeholder" data-viz="viz-mersenne-primes"></div>
`,
            visualizations: [
                {
                    id: 'viz-mersenne-primes',
                    title: 'Mersenne Numbers: Which Are Prime?',
                    description: 'For each prime exponent p, compute \\(2^p - 1\\) and check if it is prime. Green bars are Mersenne primes; red bars are composite.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primeExps = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
                        var mersennePrimePs = [2, 3, 5, 7, 13, 17, 19, 31];

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Mersenne Numbers 2^p \u2212 1', viz.width / 2, 25, viz.colors.white, 16);

                            var n = primeExps.length;
                            var barW = Math.min(36, (viz.width - 80) / n - 4);
                            var totalW = n * (barW + 4);
                            var startX = (viz.width - totalW) / 2;
                            var chartBottom = 330;
                            var chartTop = 60;
                            var chartH = chartBottom - chartTop;

                            // Log scale: max is 2^31 - 1
                            var maxLog = Math.log10(Math.pow(2, 31) - 1);

                            for (var i = 0; i < n; i++) {
                                var p = primeExps[i];
                                var val = Math.pow(2, p) - 1;
                                var isMersennePrime = mersennePrimePs.indexOf(p) !== -1;
                                var logVal = Math.log10(Math.max(val, 1));
                                var barH = (logVal / maxLog) * chartH;

                                var x = startX + i * (barW + 4);
                                var color = isMersennePrime ? viz.colors.green : viz.colors.red;

                                ctx.fillStyle = color + 'aa';
                                ctx.fillRect(x, chartBottom - barH, barW, barH);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x, chartBottom - barH, barW, barH);

                                // p label below
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('p=' + p, x + barW / 2, chartBottom + 4);

                                // Value above bar
                                var valStr = val > 99999 ? '~2^' + p : val.toString();
                                ctx.fillStyle = color;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(valStr, x + barW / 2, chartBottom - barH - 3);

                                // Check/cross
                                ctx.fillStyle = isMersennePrime ? viz.colors.green : viz.colors.red;
                                ctx.font = '14px -apple-system,sans-serif';
                                ctx.fillText(isMersennePrime ? '\u2713' : '\u2717', x + barW / 2, chartBottom - barH - 16);
                            }

                            // Axis label
                            viz.screenText('(log scale)', 30, chartTop + chartH / 2, viz.colors.text, 10);

                            // Legend
                            var legY = chartBottom + 30;
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(150, legY, 12, 12);
                            viz.screenText('Mersenne prime', 195, legY + 6, viz.colors.text, 11, 'left');

                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(310, legY, 12, 12);
                            viz.screenText('Composite', 355, legY + 6, viz.colors.text, 11, 'left');

                            // Note about p=11
                            viz.screenText('Note: p=11 gives 2047 = 23 \u00D7 89 (composite)', viz.width / 2, legY + 30, viz.colors.text, 11);
                            viz.screenText('p=23 gives 8388607 = 47 \u00D7 178481 (composite)', viz.width / 2, legY + 48, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(2^{11} - 1 = 2047\\) is not prime by finding its factorization.',
                    hint: 'Try dividing by small primes. You only need to check primes up to \\(\\sqrt{2047} \\approx 45\\).',
                    solution: '\\(2047 / 23 = 89\\). Since 89 is prime, \\(2047 = 23 \\times 89\\). (One can verify: \\(23 \\times 89 = 23 \\times 90 - 23 = 2070 - 23 = 2047\\). \\(\\checkmark\\))'
                },
                {
                    question: 'If \\(2^{13} - 1 = 8191\\) is prime, what is the corresponding perfect number?',
                    hint: 'Use Euclid\'s formula: \\(2^{p-1}(2^p - 1)\\).',
                    solution: 'The perfect number is \\(2^{12} \\times 8191 = 4096 \\times 8191 = 33{,}550{,}336\\). This is the 5th perfect number.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Amicable Pairs
        // ================================================================
        {
            id: 'sec-amicable',
            title: 'Amicable Pairs',
            content: `
<h2>Amicable Pairs</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Amicable Pair)</div>
    <div class="env-body">
        <p>Two distinct positive integers \\(m\\) and \\(n\\) form an <strong>amicable pair</strong> if each is the sum of the other's proper divisors:</p>
        \\[s(m) = n \\quad \\text{and} \\quad s(n) = m.\\]
        <p>Equivalently, \\(\\sigma(m) = \\sigma(n) = m + n\\).</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">The Idea</div>
    <div class="env-body">
        <p>A perfect number is "friends with itself": \\(s(n) = n\\). An amicable pair is two numbers that are "friends with each other": the divisors of the first sum to the second, and vice versa. The concept generalizes perfection to a two-cycle.</p>
    </div>
</div>

<h3>The Classic Example: 220 and 284</h3>

<p>The pair (220, 284) was known to the Pythagoreans around 500 BC.</p>

<div class="env-block example">
    <div class="env-title">Verifying (220, 284)</div>
    <div class="env-body">
        <p><strong>Divisors of 220:</strong> 1, 2, 4, 5, 10, 11, 20, 22, 44, 55, 110.</p>
        <p>Sum: \\(1 + 2 + 4 + 5 + 10 + 11 + 20 + 22 + 44 + 55 + 110 = 284\\). \\(\\checkmark\\)</p>
        <p><strong>Divisors of 284:</strong> 1, 2, 4, 71, 142.</p>
        <p>Sum: \\(1 + 2 + 4 + 71 + 142 = 220\\). \\(\\checkmark\\)</p>
    </div>
</div>

<h3>Finding Amicable Pairs</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 12.4 (Thabit ibn Qurra's Rule, 9th century)</div>
    <div class="env-body">
        <p>For \\(n \\geq 2\\), let</p>
        \\[a = 3 \\cdot 2^{n-1} - 1, \\quad b = 3 \\cdot 2^n - 1, \\quad c = 9 \\cdot 2^{2n-1} - 1.\\]
        <p>If \\(a\\), \\(b\\), and \\(c\\) are all prime, then \\(2^n ab\\) and \\(2^n c\\) form an amicable pair.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(n = 2\\)</div>
    <div class="env-body">
        <p>\\(a = 3 \\cdot 2 - 1 = 5\\), \\(b = 3 \\cdot 4 - 1 = 11\\), \\(c = 9 \\cdot 2 - 1 = 71\\). All prime.</p>
        <p>Pair: \\(2^2 \\cdot 5 \\cdot 11 = 220\\) and \\(2^2 \\cdot 71 = 284\\). This recovers the classic pair.</p>
    </div>
</div>

<p>As of 2024, over 1.2 billion amicable pairs are known, but their distribution remains mysterious. It is unknown whether infinitely many exist.</p>

<div class="env-block remark">
    <div class="env-title">Sociable Numbers</div>
    <div class="env-body">
        <p>The idea extends further. A <strong>sociable chain</strong> of length \\(k\\) is a cycle \\(n_1, n_2, \\ldots, n_k\\) where \\(s(n_i) = n_{i+1}\\) and \\(s(n_k) = n_1\\). Perfect numbers are chains of length 1; amicable pairs are chains of length 2.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-amicable-pair"></div>
`,
            visualizations: [
                {
                    id: 'viz-amicable-pair',
                    title: 'Amicable Pair: 220 and 284',
                    description: 'See how the proper divisors of 220 sum to 284, and the proper divisors of 284 sum to 220. The two numbers are linked by their divisor sums.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var pairs = [
                            { a: 220, b: 284, divsA: [1,2,4,5,10,11,20,22,44,55,110], divsB: [1,2,4,71,142] },
                            { a: 1184, b: 1210, divsA: [1,2,4,8,16,32,37,74,148,296,592], divsB: [1,2,5,10,11,22,55,110,121,242,605] },
                            { a: 2620, b: 2924, divsA: [1,2,4,5,10,20,131,262,524,655,1310], divsB: [1,2,4,17,34,43,68,86,172,731,1462] }
                        ];
                        var pairIdx = 0;

                        VizEngine.createSlider(controls, 'Pair #', 1, 3, 1, 1, function(v) {
                            pairIdx = Math.round(v) - 1;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pair = pairs[pairIdx];

                            viz.screenText('Amicable Pair', viz.width / 2, 25, viz.colors.white, 16);

                            // Two circles representing the numbers
                            var cxA = 160, cxB = 400, cy = 140, cr = 50;

                            // Circle A
                            ctx.beginPath();
                            ctx.arc(cxA, cy, cr, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            viz.screenText(pair.a.toString(), cxA, cy, viz.colors.blue, 22);

                            // Circle B
                            ctx.beginPath();
                            ctx.arc(cxB, cy, cr, 0, Math.PI * 2);
                            ctx.fillStyle = viz.colors.teal + '33';
                            ctx.fill();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            viz.screenText(pair.b.toString(), cxB, cy, viz.colors.teal, 22);

                            // Arrows between circles
                            // Top arrow: s(A) -> B
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(cxA + cr + 5, cy - 15);
                            ctx.quadraticCurveTo((cxA + cxB) / 2, cy - 55, cxB - cr - 5, cy - 15);
                            ctx.stroke();
                            // Arrowhead
                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath();
                            ctx.moveTo(cxB - cr - 5, cy - 15);
                            ctx.lineTo(cxB - cr - 15, cy - 25);
                            ctx.lineTo(cxB - cr - 15, cy - 8);
                            ctx.closePath();
                            ctx.fill();
                            viz.screenText('s(' + pair.a + ') = ' + pair.b, (cxA + cxB) / 2, cy - 55, viz.colors.orange, 11);

                            // Bottom arrow: s(B) -> A
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(cxB - cr - 5, cy + 15);
                            ctx.quadraticCurveTo((cxA + cxB) / 2, cy + 55, cxA + cr + 5, cy + 15);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.purple;
                            ctx.beginPath();
                            ctx.moveTo(cxA + cr + 5, cy + 15);
                            ctx.lineTo(cxA + cr + 15, cy + 25);
                            ctx.lineTo(cxA + cr + 15, cy + 8);
                            ctx.closePath();
                            ctx.fill();
                            viz.screenText('s(' + pair.b + ') = ' + pair.a, (cxA + cxB) / 2, cy + 55, viz.colors.purple, 11);

                            // Divisors of A
                            var divY = 210;
                            viz.screenText('Proper divisors of ' + pair.a + ':', viz.width / 2, divY, viz.colors.blue, 12);
                            var divStrA = pair.divsA.join(' + ') + ' = ' + pair.b;
                            if (divStrA.length > 65) {
                                divStrA = pair.divsA.slice(0, 7).join(' + ') + ' + ... = ' + pair.b;
                            }
                            viz.screenText(divStrA, viz.width / 2, divY + 20, viz.colors.text, 11);

                            // Divisors of B
                            divY += 50;
                            viz.screenText('Proper divisors of ' + pair.b + ':', viz.width / 2, divY, viz.colors.teal, 12);
                            var divStrB = pair.divsB.join(' + ') + ' = ' + pair.a;
                            if (divStrB.length > 65) {
                                divStrB = pair.divsB.slice(0, 7).join(' + ') + ' + ... = ' + pair.a;
                            }
                            viz.screenText(divStrB, viz.width / 2, divY + 20, viz.colors.text, 11);

                            // Divisor bars for visual comparison
                            var barY = 330;
                            var barW = 400;
                            var barH = 16;
                            var barStartX = 80;

                            // Bar for A's divisors summing to B
                            var totalA = pair.divsA.reduce(function(a, b) { return a + b; }, 0);
                            var xPos = barStartX;
                            var barColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.pink, viz.colors.yellow, viz.colors.red];
                            for (var i = 0; i < pair.divsA.length; i++) {
                                var w = Math.max(2, (pair.divsA[i] / totalA) * barW);
                                ctx.fillStyle = (barColors[i % barColors.length]) + 'aa';
                                ctx.fillRect(xPos, barY, w, barH);
                                xPos += w;
                            }
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(barStartX, barY, barW, barH);
                            viz.screenText('= ' + pair.b, barStartX + barW + 10, barY + barH / 2, viz.colors.blue, 11, 'left');

                            // Bar for B's divisors summing to A
                            xPos = barStartX;
                            for (var j = 0; j < pair.divsB.length; j++) {
                                var w2 = Math.max(2, (pair.divsB[j] / pair.a) * barW);
                                ctx.fillStyle = (barColors[j % barColors.length]) + 'aa';
                                ctx.fillRect(xPos, barY + barH + 6, w2, barH);
                                xPos += w2;
                            }
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(barStartX, barY + barH + 6, barW, barH);
                            viz.screenText('= ' + pair.a, barStartX + barW + 10, barY + barH + 6 + barH / 2, viz.colors.teal, 11, 'left');

                            // Shared sigma
                            viz.screenText('\u03C3(' + pair.a + ') = \u03C3(' + pair.b + ') = ' + (pair.a + pair.b), viz.width / 2, barY + 2 * barH + 25, viz.colors.green, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that (1184, 1210) is an amicable pair by computing \\(s(1184)\\) and \\(s(1210)\\).',
                    hint: 'Factor each number first. \\(1184 = 2^5 \\times 37\\) and \\(1210 = 2 \\times 5 \\times 11^2\\).',
                    solution: '\\(\\sigma(1184) = \\sigma(2^5)\\sigma(37) = 63 \\times 38 = 2394\\). So \\(s(1184) = 2394 - 1184 = 1210\\). \\(\\sigma(1210) = \\sigma(2)\\sigma(5)\\sigma(11^2) = 3 \\times 6 \\times 133 = 2394\\). So \\(s(1210) = 2394 - 1210 = 1184\\). Both check out.'
                },
                {
                    question: 'Apply Thabit ibn Qurra\'s rule with \\(n = 4\\). Are \\(a\\), \\(b\\), and \\(c\\) all prime? If so, what amicable pair results?',
                    hint: 'Compute \\(a = 3 \\cdot 2^3 - 1\\), \\(b = 3 \\cdot 2^4 - 1\\), \\(c = 9 \\cdot 2^7 - 1\\).',
                    solution: '\\(a = 3 \\cdot 8 - 1 = 23\\) (prime), \\(b = 3 \\cdot 16 - 1 = 47\\) (prime), \\(c = 9 \\cdot 128 - 1 = 1151\\). Is 1151 prime? Checking: it is not divisible by 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 (and \\(34^2 = 1156 > 1151\\)). Yes, 1151 is prime. The pair is \\(2^4 \\cdot 23 \\cdot 47 = 17296\\) and \\(2^4 \\cdot 1151 = 18416\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<p>In this chapter we explored how the relationship between a number and its divisors reveals deep structure. Perfect numbers, though exceedingly rare, connect to Mersenne primes through Euclid's elegant formula. Abundant and deficient numbers fill the landscape between, giving us a three-way classification of all positive integers.</p>

<h3>Key Ideas</h3>

<ul>
    <li>The divisor sum function \\(\\sigma(n)\\) encodes arithmetic information about \\(n\\). Its multiplicativity (when \\(\\gcd(a,b) = 1\\), \\(\\sigma(ab) = \\sigma(a)\\sigma(b)\\)) makes computation tractable.</li>
    <li>Perfect numbers satisfy \\(\\sigma(n) = 2n\\). All known perfect numbers are even and arise from Mersenne primes via \\(2^{p-1}(2^p - 1)\\).</li>
    <li>Amicable pairs generalize perfection to two-cycles of the function \\(s(n)\\). The concept extends to sociable chains of any length.</li>
</ul>

<h3>Connections</h3>

<div class="env-block remark">
    <div class="env-title">What Comes Next</div>
    <div class="env-body">
        <p>The divisor function connects to many branches of number theory:</p>
        <ul>
            <li><strong>Modular arithmetic</strong> (Chapters 9-11): The multiplicativity of \\(\\sigma\\) relies on the Chinese Remainder Theorem.</li>
            <li><strong>Fibonacci numbers</strong> (Chapter 13): Fibonacci numbers appear in divisibility patterns and have their own "perfect" analogues.</li>
            <li><strong>Cryptography</strong> (Chapter 16): Mersenne primes are used in pseudorandom number generation and appear in the design of certain cryptographic systems.</li>
        </ul>
    </div>
</div>

<h3>Open Questions</h3>

<p>We leave you with some of the oldest unsolved problems in mathematics:</p>
<ol>
    <li>Are there infinitely many Mersenne primes (and hence infinitely many even perfect numbers)?</li>
    <li>Does an odd perfect number exist?</li>
    <li>Are there infinitely many amicable pairs?</li>
    <li>Is there a sociable chain of length 3? (None is known.)</li>
</ol>

<p>These questions, some over two millennia old, remind us that elementary number theory still holds deep mysteries.</p>

<div class="viz-placeholder" data-viz="viz-sigma-function"></div>
`,
            visualizations: [
                {
                    id: 'viz-sigma-function',
                    title: 'The Sigma Function: \u03C3(n) for n = 1 to 50',
                    description: 'Bar chart of \\(\\sigma(n)\\) for small values. Perfect numbers (where \\(\\sigma(n) = 2n\\)) are highlighted in green. The red line shows \\(y = 2n\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxN = 50;
                        VizEngine.createSlider(controls, 'N', 10, 100, maxN, 5, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function sigma(n) {
                            var s = 0;
                            for (var i = 1; i * i <= n; i++) {
                                if (n % i === 0) {
                                    s += i;
                                    if (i !== n / i) s += n / i;
                                }
                            }
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('\u03C3(n) for n = 1 to ' + maxN, viz.width / 2, 20, viz.colors.white, 14);

                            var chartLeft = 50;
                            var chartRight = viz.width - 20;
                            var chartTop = 50;
                            var chartBottom = 350;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            // Compute all sigma values and find max
                            var sigmas = [];
                            var maxSig = 0;
                            for (var n = 1; n <= maxN; n++) {
                                var s = sigma(n);
                                sigmas.push(s);
                                if (s > maxSig) maxSig = s;
                            }
                            // Also consider 2*maxN for the reference line
                            maxSig = Math.max(maxSig, 2 * maxN);

                            var barW = Math.max(2, chartW / maxN - 1);

                            // Draw 2n reference line
                            for (var n2 = 1; n2 <= maxN; n2++) {
                                var x2 = chartLeft + (n2 - 0.5) * chartW / maxN;
                                var y2 = chartBottom - (2 * n2 / maxSig) * chartH;
                                ctx.fillStyle = viz.colors.red + '66';
                                ctx.beginPath();
                                ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Draw bars
                            for (var i = 0; i < maxN; i++) {
                                var n3 = i + 1;
                                var s3 = sigmas[i];
                                var x3 = chartLeft + i * chartW / maxN;
                                var barH = (s3 / maxSig) * chartH;

                                var isPerfect = (s3 === 2 * n3);
                                var isAbundant = (s3 > 2 * n3);

                                var color;
                                if (isPerfect) color = viz.colors.green;
                                else if (isAbundant) color = viz.colors.orange + '99';
                                else color = viz.colors.blue + '77';

                                ctx.fillStyle = color;
                                ctx.fillRect(x3 + 0.5, chartBottom - barH, barW, barH);

                                // Label perfect numbers
                                if (isPerfect) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(n3.toString(), x3 + barW / 2, chartBottom - barH - 3);
                                }
                            }

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var step = maxN <= 30 ? 5 : (maxN <= 60 ? 10 : 20);
                            for (var t = step; t <= maxN; t += step) {
                                var tx = chartLeft + (t - 0.5) * chartW / maxN;
                                ctx.fillText(t.toString(), tx, chartBottom + 4);
                            }
                            viz.screenText('n', chartLeft + chartW / 2, chartBottom + 20, viz.colors.text, 11);

                            // Legend
                            var legY = chartBottom + 35;
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(100, legY, 10, 10);
                            viz.screenText('Perfect', 135, legY + 5, viz.colors.text, 10, 'left');

                            ctx.fillStyle = viz.colors.orange + '99';
                            ctx.fillRect(200, legY, 10, 10);
                            viz.screenText('Abundant', 235, legY + 5, viz.colors.text, 10, 'left');

                            ctx.fillStyle = viz.colors.blue + '77';
                            ctx.fillRect(310, legY, 10, 10);
                            viz.screenText('Deficient', 345, legY + 5, viz.colors.text, 10, 'left');

                            ctx.fillStyle = viz.colors.red + '66';
                            ctx.beginPath(); ctx.arc(420, legY + 5, 3, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('2n line', 445, legY + 5, viz.colors.text, 10, 'left');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(\\sigma\\) is multiplicative: if \\(\\gcd(a, b) = 1\\), then \\(\\sigma(ab) = \\sigma(a) \\sigma(b)\\).',
                    hint: 'Show that every divisor of \\(ab\\) can be written uniquely as \\(d_1 d_2\\) where \\(d_1 \\mid a\\) and \\(d_2 \\mid b\\). This is a consequence of unique factorization.',
                    solution: 'When \\(\\gcd(a,b) = 1\\), every divisor \\(d\\) of \\(ab\\) can be written uniquely as \\(d = d_1 d_2\\) with \\(d_1 \\mid a\\) and \\(d_2 \\mid b\\) (by CRT / unique factorization). So \\(\\sigma(ab) = \\sum_{d \\mid ab} d = \\sum_{d_1 \\mid a} \\sum_{d_2 \\mid b} d_1 d_2 = \\left(\\sum_{d_1 \\mid a} d_1\\right)\\left(\\sum_{d_2 \\mid b} d_2\\right) = \\sigma(a)\\sigma(b)\\).'
                },
                {
                    question: 'Compute \\(\\sigma(360)\\) using the multiplicativity of \\(\\sigma\\) and the prime factorization \\(360 = 2^3 \\times 3^2 \\times 5\\).',
                    hint: 'Use the formula \\(\\sigma(p^k) = 1 + p + p^2 + \\cdots + p^k = \\frac{p^{k+1} - 1}{p - 1}\\).',
                    solution: '\\(\\sigma(2^3) = 1 + 2 + 4 + 8 = 15\\). \\(\\sigma(3^2) = 1 + 3 + 9 = 13\\). \\(\\sigma(5) = 1 + 5 = 6\\). By multiplicativity: \\(\\sigma(360) = 15 \\times 13 \\times 6 = 1170\\). Since \\(1170 > 720 = 2 \\times 360\\), the number 360 is abundant.'
                }
            ]
        }
    ]
});
