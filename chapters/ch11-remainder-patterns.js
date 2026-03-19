window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Patterns in Remainders',
    subtitle: 'Cycles, orbits, and Fermat\'s little theorem',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Remainders Repeat',
            content: `
<h2>Why Remainders Repeat</h2>

<div class="env-block intuition">
    <div class="env-title">A Simple Experiment</div>
    <div class="env-body">
        <p>Compute the first few powers of 2, and take the remainder when dividing by 7:</p>
        <ul>
            <li>\\(2^1 = 2 \\pmod{7}\\)</li>
            <li>\\(2^2 = 4 \\pmod{7}\\)</li>
            <li>\\(2^3 = 8 \\equiv 1 \\pmod{7}\\)</li>
            <li>\\(2^4 = 16 \\equiv 2 \\pmod{7}\\)</li>
            <li>\\(2^5 = 32 \\equiv 4 \\pmod{7}\\)</li>
            <li>\\(2^6 = 64 \\equiv 1 \\pmod{7}\\)</li>
        </ul>
        <p>The remainders repeat: \\(2, 4, 1, 2, 4, 1, \\ldots\\) with a cycle of length 3. Why does this happen? And can we predict when the cycle starts over?</p>
    </div>
</div>

<p>In Chapter 10 we learned how to add and multiply modulo \\(n\\). Now we explore what happens when we apply the same operation again and again. Repeated multiplication produces <strong>power sequences</strong>, and these sequences always cycle. Understanding these cycles is the gateway to one of the most beautiful results in number theory: <strong>Fermat's little theorem</strong>.</p>

<h3>The Pigeonhole Principle Forces Cycles</h3>

<p>When we compute \\(a^1 \\bmod n, \\; a^2 \\bmod n, \\; a^3 \\bmod n, \\ldots\\), every result is one of the values \\(0, 1, 2, \\ldots, n-1\\). There are only \\(n\\) possible remainders, so by the <em>pigeonhole principle</em>, within the first \\(n+1\\) powers, some remainder must appear twice.</p>

<div class="env-block theorem">
    <div class="env-title">Observation (Power Sequences Cycle)</div>
    <div class="env-body">
        <p>For any integers \\(a\\) and \\(n \\geq 2\\), the sequence \\(a^1 \\bmod n, \\; a^2 \\bmod n, \\; a^3 \\bmod n, \\ldots\\) is eventually periodic. If \\(\\gcd(a, n) = 1\\), the sequence is <strong>purely periodic</strong> (the cycle includes the first term).</p>
    </div>
</div>

<p>The length of the cycle is called the <strong>multiplicative order</strong> of \\(a\\) modulo \\(n\\), and we write it as \\(\\text{ord}_n(a)\\). In the example above, \\(\\text{ord}_7(2) = 3\\) because \\(2^3 \\equiv 1 \\pmod{7}\\) and 3 is the smallest such positive exponent.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Pierre de Fermat discovered the key pattern in 1640, writing to Frenicle de Bessy. Leonhard Euler later generalized it in 1763. The simple observation that remainders must cycle has profound consequences for cryptography, error-correcting codes, and primality testing.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Power Cycles
        // ================================================================
        {
            id: 'sec-power-cycles',
            title: 'Powers Mod n Cycle',
            content: `
<h2>Powers Mod \\(n\\) Cycle</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Mechanism</div>
    <div class="env-body">
        <p>Once you know \\(a^k \\bmod n\\), you get \\(a^{k+1} \\bmod n\\) by multiplying by \\(a\\) and taking the remainder. This means each term depends only on the previous term. If the sequence ever hits a value it has seen before, it must repeat from that point on.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Multiplicative Order)</div>
    <div class="env-body">
        <p>Let \\(\\gcd(a, n) = 1\\). The <strong>multiplicative order</strong> of \\(a\\) modulo \\(n\\), written \\(\\text{ord}_n(a)\\), is the smallest positive integer \\(d\\) such that</p>
        \\[a^d \\equiv 1 \\pmod{n}.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Powers of 2 mod 7</div>
    <div class="env-body">
        <p>\\(2^1 \\equiv 2,\\; 2^2 \\equiv 4,\\; 2^3 \\equiv 1 \\pmod{7}\\).</p>
        <p>So \\(\\text{ord}_7(2) = 3\\). The cycle is \\(2 \\to 4 \\to 1 \\to 2 \\to 4 \\to 1 \\to \\cdots\\)</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Powers of 3 mod 7</div>
    <div class="env-body">
        <p>\\(3^1 \\equiv 3,\\; 3^2 \\equiv 2,\\; 3^3 \\equiv 6,\\; 3^4 \\equiv 4,\\; 3^5 \\equiv 5,\\; 3^6 \\equiv 1 \\pmod{7}\\).</p>
        <p>So \\(\\text{ord}_7(3) = 6\\). The cycle visits every nonzero remainder! We say 3 is a <strong>primitive root</strong> mod 7.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Primitive Root)</div>
    <div class="env-body">
        <p>If \\(\\text{ord}_n(a) = \\phi(n)\\) (the maximum possible order), we call \\(a\\) a <strong>primitive root</strong> modulo \\(n\\). When \\(n = p\\) is prime, \\(\\phi(p) = p - 1\\), so a primitive root mod \\(p\\) generates all nonzero remainders.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-power-cycle"></div>

<div class="viz-placeholder" data-viz="viz-orbit-diagram"></div>
`,
            visualizations: [
                {
                    id: 'viz-power-cycle',
                    title: 'Powers Mod n: Watch the Cycle',
                    description: 'Compute \\(a^k \\bmod n\\) for successive values of \\(k\\). The bar chart shows the remainder at each step. Adjust \\(a\\) and \\(n\\) with the sliders to discover different cycle lengths.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 2;
                        var nVal = 7;

                        VizEngine.createSlider(controls, 'a', 2, 15, aVal, 1, function(v) {
                            aVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'n', 3, 19, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        function modPow(base, exp, mod) {
                            var result = 1;
                            base = base % mod;
                            for (var i = 0; i < exp; i++) {
                                result = (result * base) % mod;
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var maxK = Math.min(24, nVal + 6);
                            var remainders = [];
                            var cycleLen = 0;

                            for (var k = 1; k <= maxK; k++) {
                                remainders.push(modPow(aVal, k, nVal));
                            }

                            // Find cycle length
                            for (var d = 1; d <= maxK; d++) {
                                if (modPow(aVal, d, nVal) === (aVal % nVal !== 0 ? 1 : 0)) {
                                    if (aVal % nVal !== 0) { cycleLen = d; break; }
                                }
                            }
                            if (cycleLen === 0 && aVal % nVal === 0) cycleLen = 1;

                            // Title
                            var gcd = function(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; };
                            var coprime = gcd(aVal, nVal) === 1;
                            viz.screenText(aVal + '^k mod ' + nVal, viz.width / 2, 20, viz.colors.white, 16);
                            if (coprime && cycleLen > 0) {
                                viz.screenText('Cycle length (order) = ' + cycleLen, viz.width / 2, 42, viz.colors.teal, 13);
                            } else if (!coprime) {
                                viz.screenText('gcd(' + aVal + ', ' + nVal + ') > 1 (not coprime)', viz.width / 2, 42, viz.colors.orange, 12);
                            }

                            // Bar chart
                            var chartL = 50;
                            var chartR = viz.width - 20;
                            var chartW = chartR - chartL;
                            var barW = Math.min(20, chartW / maxK - 2);
                            var chartBot = viz.height - 55;
                            var chartTop = 65;
                            var chartH = chartBot - chartTop;

                            // Y axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartTop);
                            ctx.lineTo(chartL, chartBot);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartBot);
                            ctx.lineTo(chartR, chartBot);
                            ctx.stroke();

                            var maxR = nVal - 1;
                            if (maxR < 1) maxR = 1;

                            // Y labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var y = 0; y <= maxR; y += Math.max(1, Math.floor(maxR / 5))) {
                                var yy = chartBot - (y / maxR) * chartH;
                                ctx.fillText(y.toString(), chartL - 6, yy);
                            }

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange,
                                          viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            for (var i = 0; i < remainders.length; i++) {
                                var cx = chartL + (i + 0.5) * (chartW / maxK);
                                var barH = (remainders[i] / maxR) * chartH;
                                var col = colors[remainders[i] % colors.length];

                                // Highlight cycle
                                if (coprime && cycleLen > 0 && remainders[i] === 1) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.fillRect(cx - barW / 2 - 2, chartTop, barW + 4, chartH);
                                }

                                ctx.fillStyle = col + 'cc';
                                ctx.fillRect(cx - barW / 2, chartBot - barH, barW, barH);

                                // Value on top
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(remainders[i].toString(), cx, chartBot - barH - 2);

                                // k label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText((i + 1).toString(), cx, chartBot + 3);
                            }

                            viz.screenText('k (exponent)', viz.width / 2, viz.height - 10, viz.colors.text, 11);

                            // Show cycle pattern as text
                            if (coprime && cycleLen > 0) {
                                var pattern = '';
                                for (var j = 0; j < cycleLen; j++) {
                                    if (j > 0) pattern += ' \u2192 ';
                                    pattern += remainders[j];
                                }
                                pattern += ' \u2192 (repeat)';
                                viz.screenText(pattern, viz.width / 2, viz.height - 28, viz.colors.teal, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-orbit-diagram',
                    title: 'Orbit of a Under Multiplication Mod n',
                    description: 'The orbit of \\(a\\) under repeated multiplication mod \\(n\\) forms a directed cycle in the group of units. Each node is a remainder; arrows show multiplication by \\(a\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 2;
                        var nVal = 7;

                        VizEngine.createSlider(controls, 'a', 2, 15, aVal, 1, function(v) {
                            aVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'n', 3, 19, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var gcd = function(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; };
                            var coprime = gcd(aVal, nVal) === 1;

                            // Compute orbit
                            var orbit = [];
                            var current = aVal % nVal;
                            var seen = {};
                            while (!seen[current] && orbit.length < nVal + 2) {
                                seen[current] = true;
                                orbit.push(current);
                                current = (current * aVal) % nVal;
                            }

                            var orbitLen = orbit.length;

                            viz.screenText('Orbit of ' + aVal + ' mod ' + nVal + '  (length ' + orbitLen + ')', viz.width / 2, 22, viz.colors.white, 14);

                            if (!coprime) {
                                viz.screenText('gcd(' + aVal + ',' + nVal + ') > 1', viz.width / 2, 42, viz.colors.orange, 11);
                            }

                            // Draw nodes in a circle
                            var centerX = viz.width / 2;
                            var centerY = viz.height / 2 + 10;
                            var radius = Math.min(120, viz.height / 2 - 60);
                            var nodeR = Math.min(20, 80 / Math.sqrt(orbitLen));

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange,
                                          viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            var nodePositions = [];
                            for (var i = 0; i < orbitLen; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i) / orbitLen;
                                var nx = centerX + radius * Math.cos(angle);
                                var ny = centerY + radius * Math.sin(angle);
                                nodePositions.push({ x: nx, y: ny });
                            }

                            // Draw arrows
                            for (var j = 0; j < orbitLen; j++) {
                                var from = nodePositions[j];
                                var to = nodePositions[(j + 1) % orbitLen];
                                var dx = to.x - from.x;
                                var dy = to.y - from.y;
                                var dist = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / dist;
                                var uy = dy / dist;

                                var startX = from.x + ux * (nodeR + 2);
                                var startY = from.y + uy * (nodeR + 2);
                                var endX = to.x - ux * (nodeR + 6);
                                var endY = to.y - uy * (nodeR + 6);

                                ctx.strokeStyle = viz.colors.teal + '88';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(startX, startY);
                                ctx.lineTo(endX, endY);
                                ctx.stroke();

                                // Arrowhead
                                var aAngle = Math.atan2(endY - startY, endX - startX);
                                ctx.fillStyle = viz.colors.teal + '88';
                                ctx.beginPath();
                                ctx.moveTo(endX, endY);
                                ctx.lineTo(endX - 10 * Math.cos(aAngle - Math.PI / 6), endY - 10 * Math.sin(aAngle - Math.PI / 6));
                                ctx.lineTo(endX - 10 * Math.cos(aAngle + Math.PI / 6), endY - 10 * Math.sin(aAngle + Math.PI / 6));
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Draw nodes
                            for (var k = 0; k < orbitLen; k++) {
                                var pos = nodePositions[k];
                                var col = colors[k % colors.length];

                                // Highlight 1
                                if (orbit[k] === 1) {
                                    ctx.strokeStyle = viz.colors.yellow;
                                    ctx.lineWidth = 3;
                                    ctx.beginPath();
                                    ctx.arc(pos.x, pos.y, nodeR + 4, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(pos.x, pos.y, nodeR, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold ' + Math.min(14, 30 / Math.sqrt(orbitLen)) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(orbit[k].toString(), pos.x, pos.y);

                                // Exponent label outside
                                var outerAngle = -Math.PI / 2 + (2 * Math.PI * k) / orbitLen;
                                var labelX = centerX + (radius + nodeR + 14) * Math.cos(outerAngle);
                                var labelY = centerY + (radius + nodeR + 14) * Math.sin(outerAngle);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(aVal + '^' + (k + 1), labelX, labelY);
                            }

                            // Multiply label
                            viz.screenText('\u00D7' + aVal + ' at each step', viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the powers of 5 modulo 13 until the cycle repeats. What is \\(\\text{ord}_{13}(5)\\)?',
                    hint: 'Compute \\(5^1, 5^2, 5^3, \\ldots \\pmod{13}\\) until you get 1.',
                    solution: '\\(5^1 \\equiv 5,\\; 5^2 \\equiv 12,\\; 5^3 \\equiv 8,\\; 5^4 \\equiv 1 \\pmod{13}\\). So \\(\\text{ord}_{13}(5) = 4\\). The cycle is \\(5, 12, 8, 1\\).'
                },
                {
                    question: 'Find all primitive roots modulo 7 (i.e., all \\(a\\) with \\(1 \\leq a \\leq 6\\) such that \\(\\text{ord}_7(a) = 6\\)).',
                    hint: 'Compute \\(\\text{ord}_7(a)\\) for each \\(a \\in \\{1,2,3,4,5,6\\}\\). A primitive root must have order \\(\\phi(7) = 6\\).',
                    solution: '\\(\\text{ord}_7(1) = 1,\\; \\text{ord}_7(2) = 3,\\; \\text{ord}_7(3) = 6,\\; \\text{ord}_7(4) = 3,\\; \\text{ord}_7(5) = 6,\\; \\text{ord}_7(6) = 2\\). The primitive roots mod 7 are \\(3\\) and \\(5\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Fermat's Little Theorem
        // ================================================================
        {
            id: 'sec-fermat',
            title: "Fermat's Little Theorem",
            content: `
<h2>Fermat's Little Theorem</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Pattern</div>
    <div class="env-body">
        <p>In Section 2, we saw that the cycle length \\(\\text{ord}_7(2) = 3\\) and \\(\\text{ord}_7(3) = 6\\). Both 3 and 6 divide \\(7 - 1 = 6\\). Is this a coincidence?</p>
        <p>Try more examples: \\(\\text{ord}_5(2) = 4\\) divides \\(5 - 1 = 4\\). \\(\\text{ord}_{11}(2) = 10\\) divides \\(11 - 1 = 10\\). The pattern holds: the cycle length always divides \\(p - 1\\).</p>
    </div>
</div>

<p>This observation leads to one of the most celebrated results in elementary number theory.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.1 (Fermat's Little Theorem)</div>
    <div class="env-body">
        <p>If \\(p\\) is a prime number and \\(a\\) is any integer not divisible by \\(p\\), then</p>
        \\[a^{p-1} \\equiv 1 \\pmod{p}.\\]
        <p>Equivalently, for any integer \\(a\\) at all (including multiples of \\(p\\)):</p>
        \\[a^p \\equiv a \\pmod{p}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Accessible Version)</div>
    <div class="env-body">
        <p>Consider the \\(p - 1\\) products \\(1 \\cdot a, \\; 2 \\cdot a, \\; 3 \\cdot a, \\; \\ldots, \\; (p-1) \\cdot a\\) taken modulo \\(p\\).</p>
        <p><strong>Claim:</strong> These are just the numbers \\(1, 2, 3, \\ldots, p-1\\) in some order.</p>
        <p><em>Why?</em> First, none of them is \\(0 \\pmod{p}\\) (since neither \\(a\\) nor \\(k\\) is divisible by \\(p\\)). Second, they are all distinct: if \\(ia \\equiv ja \\pmod{p}\\), then \\(p \\mid (i-j)a\\), and since \\(p \\nmid a\\), we get \\(p \\mid (i-j)\\), which forces \\(i = j\\) for \\(1 \\leq i, j \\leq p-1\\).</p>
        <p>So the products \\(1 \\cdot a,\\, 2 \\cdot a,\\, \\ldots,\\, (p-1) \\cdot a\\) are a rearrangement of \\(1, 2, \\ldots, p-1\\) modulo \\(p\\). Multiplying them all together:</p>
        \\[(1 \\cdot a)(2 \\cdot a) \\cdots ((p-1) \\cdot a) \\equiv 1 \\cdot 2 \\cdots (p-1) \\pmod{p}.\\]
        <p>The left side is \\((p-1)! \\cdot a^{p-1}\\). The right side is \\((p-1)!\\). Since \\(\\gcd((p-1)!, p) = 1\\), we can cancel \\((p-1)!\\) from both sides:</p>
        \\[a^{p-1} \\equiv 1 \\pmod{p}. \\qquad \\square\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Quick Computation</div>
    <div class="env-body">
        <p>What is \\(2^{100} \\bmod 13\\)?</p>
        <p>By Fermat's little theorem, \\(2^{12} \\equiv 1 \\pmod{13}\\). Now \\(100 = 12 \\times 8 + 4\\), so</p>
        \\[2^{100} = (2^{12})^8 \\cdot 2^4 \\equiv 1^8 \\cdot 16 \\equiv 3 \\pmod{13}.\\]
    </div>
</div>

<div class="env-block warning">
    <div class="env-title">Caution</div>
    <div class="env-body">
        <p>Fermat's little theorem requires \\(p\\) to be <strong>prime</strong>. It fails for composite moduli: \\(2^8 = 256 \\equiv 4 \\pmod{9}\\), not 1, even though \\(\\gcd(2, 9) = 1\\). (The correct generalization for composite moduli uses Euler's theorem with \\(\\phi(n)\\).)</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fermat-verify"></div>
`,
            visualizations: [
                {
                    id: 'viz-fermat-verify',
                    title: "Verifying Fermat's Little Theorem",
                    description: 'For a chosen prime \\(p\\), compute \\(a^{p-1} \\bmod p\\) for every \\(a\\) from 1 to \\(p-1\\). Fermat\'s little theorem predicts they should all equal 1. The green bars confirm it!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primes = [3, 5, 7, 11, 13, 17, 19, 23];
                        var pIdx = 2; // start with 7

                        VizEngine.createSlider(controls, 'p (prime)', 0, primes.length - 1, pIdx, 1, function(v) {
                            pIdx = Math.round(v);
                            draw();
                        });

                        function modPow(base, exp, mod) {
                            var result = 1;
                            base = base % mod;
                            while (exp > 0) {
                                if (exp % 2 === 1) result = (result * base) % mod;
                                exp = Math.floor(exp / 2);
                                base = (base * base) % mod;
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = primes[pIdx];
                            var exp = p - 1;

                            viz.screenText("Fermat's Little Theorem: a^{p-1} mod p", viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText('p = ' + p + ',  exponent = p-1 = ' + exp, viz.width / 2, 40, viz.colors.teal, 13);

                            var values = [];
                            for (var a = 1; a < p; a++) {
                                values.push({ a: a, result: modPow(a, exp, p) });
                            }

                            var chartL = 50;
                            var chartR = viz.width - 20;
                            var chartW = chartR - chartL;
                            var chartBot = viz.height - 50;
                            var chartTop = 65;
                            var chartH = chartBot - chartTop;
                            var barW = Math.min(30, chartW / values.length - 3);

                            // Reference line at y=1
                            var yOne = chartBot - (1 / (p - 1)) * chartH;
                            ctx.strokeStyle = viz.colors.yellow + '66';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartL, yOne);
                            ctx.lineTo(chartR, yOne);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('1', chartL - 6, yOne);

                            for (var i = 0; i < values.length; i++) {
                                var v = values[i];
                                var cx = chartL + (i + 0.5) * (chartW / values.length);
                                var barH = (v.result / (p - 1)) * chartH;

                                ctx.fillStyle = v.result === 1 ? viz.colors.green + 'cc' : viz.colors.red + 'cc';
                                ctx.fillRect(cx - barW / 2, chartBot - barH, barW, barH);

                                // Value label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(v.result.toString(), cx, chartBot - barH - 2);

                                // a label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText('a=' + v.a, cx, chartBot + 4);
                            }

                            // Check if all equal 1
                            var allOne = values.every(function(v) { return v.result === 1; });
                            viz.screenText(
                                allOne ? 'All equal 1 \u2714 Fermat confirmed!' : 'Some are not 1 (not prime?)',
                                viz.width / 2, viz.height - 12,
                                allOne ? viz.colors.green : viz.colors.red, 13
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Fermat\'s little theorem to find \\(3^{200} \\bmod 17\\).',
                    hint: '\\(3^{16} \\equiv 1 \\pmod{17}\\) by Fermat. Write \\(200 = 16q + r\\).',
                    solution: '\\(200 = 16 \\times 12 + 8\\). So \\(3^{200} = (3^{16})^{12} \\cdot 3^8 \\equiv 1^{12} \\cdot 3^8 \\pmod{17}\\). Now \\(3^2 = 9\\), \\(3^4 = 81 \\equiv 13 \\pmod{17}\\), \\(3^8 \\equiv 13^2 = 169 \\equiv 16 \\equiv -1 \\pmod{17}\\). So \\(3^{200} \\equiv 16 \\pmod{17}\\).'
                },
                {
                    question: 'Is 561 prime? Note that \\(2^{560} \\equiv 1 \\pmod{561}\\). Does this prove primality?',
                    hint: 'Fermat\'s little theorem says: if \\(p\\) is prime, then \\(a^{p-1} \\equiv 1\\). But the converse is not necessarily true.',
                    solution: '\\(561 = 3 \\times 11 \\times 17\\), so 561 is composite. The fact that \\(2^{560} \\equiv 1 \\pmod{561}\\) does <em>not</em> prove primality. Numbers that pass the Fermat test but are composite are called <strong>Carmichael numbers</strong> (or pseudoprimes). 561 is the smallest Carmichael number.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Check Digits
        // ================================================================
        {
            id: 'sec-check-digits',
            title: 'Check Digits',
            content: `
<h2>Check Digits</h2>

<div class="env-block intuition">
    <div class="env-title">Why Barcodes Have an Extra Digit</div>
    <div class="env-body">
        <p>Look at the back of any book: the ISBN has 13 digits, but only 12 carry information. The 13th is a <strong>check digit</strong>, computed from the others using modular arithmetic. If you mistype a single digit when ordering a book online, the check digit will not match, and the system catches the error. Remainder patterns protect real-world data.</p>
    </div>
</div>

<h3>ISBN-13 Check Digit</h3>

<p>An ISBN-13 code \\(d_1 d_2 d_3 \\ldots d_{13}\\) satisfies:</p>
\\[d_1 + 3d_2 + d_3 + 3d_4 + \\cdots + d_{11} + 3d_{12} + d_{13} \\equiv 0 \\pmod{10}.\\]

<p>The weights alternate between 1 and 3. The check digit \\(d_{13}\\) is chosen so the weighted sum is divisible by 10.</p>

<div class="env-block example">
    <div class="env-title">Example: Verifying an ISBN</div>
    <div class="env-body">
        <p>ISBN: 978-0-306-40615-7. Remove hyphens: 9780306406157.</p>
        <p>Weighted sum: \\(9 + 3(7) + 8 + 3(0) + 3 + 3(0) + 6 + 3(4) + 0 + 3(6) + 1 + 3(5) + 7\\)</p>
        <p>\\(= 9 + 21 + 8 + 0 + 3 + 0 + 6 + 12 + 0 + 18 + 1 + 15 + 7 = 100\\).</p>
        <p>Since \\(100 \\equiv 0 \\pmod{10}\\), the ISBN is valid.</p>
    </div>
</div>

<h3>Credit Card Numbers: The Luhn Algorithm</h3>

<p>Most credit card numbers use the <strong>Luhn algorithm</strong> (also called "mod 10"):</p>
<ol>
    <li>Starting from the rightmost digit (the check digit), double every second digit going left.</li>
    <li>If doubling produces a number greater than 9, subtract 9.</li>
    <li>Sum all the digits (doubled and undoubled).</li>
    <li>The number is valid if the total is divisible by 10.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: Luhn Check</div>
    <div class="env-body">
        <p>Number: 4539 1488 0343 6467</p>
        <p>Doubling alternate digits from right: 8, 12\u21923, 6, 6, 0, 16\u21927, 8, 8, 1, 18\u21929, 4, 10\u21921, 5</p>
        <p>The total should be divisible by 10 for a valid card.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">What Errors Can Check Digits Catch?</div>
    <div class="env-body">
        <p>The ISBN-13 system catches <strong>all single-digit errors</strong> and <strong>most transposition errors</strong> (swapping two adjacent digits). The Luhn algorithm catches all single-digit errors and most transpositions. These are the most common types of human data entry mistakes.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-isbn-checker"></div>

<div class="viz-placeholder" data-viz="viz-credit-card"></div>
`,
            visualizations: [
                {
                    id: 'viz-isbn-checker',
                    title: 'ISBN-13 Check Digit Calculator',
                    description: 'Enter the first 12 digits of an ISBN-13, and the calculator computes the check digit using the alternating 1-3 weight scheme mod 10.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var digits = [9, 7, 8, 0, 3, 0, 6, 4, 0, 6, 1, 5];

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:4px;align-items:center;flex-wrap:wrap;';
                        var label = document.createElement('span');
                        label.textContent = 'ISBN (first 12): ';
                        label.style.cssText = 'color:#c9d1d9;font-size:12px;';
                        inputDiv.appendChild(label);

                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = digits.join('');
                        inp.maxLength = 12;
                        inp.style.cssText = 'width:160px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:14px;font-family:monospace;';
                        inp.addEventListener('input', function() {
                            var val = inp.value.replace(/\D/g, '').slice(0, 12);
                            digits = [];
                            for (var i = 0; i < val.length; i++) digits.push(parseInt(val[i]));
                            draw();
                        });
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('ISBN-13 Check Digit', viz.width / 2, 20, viz.colors.white, 15);

                            if (digits.length < 12) {
                                viz.screenText('Enter 12 digits above', viz.width / 2, viz.height / 2, viz.colors.text, 14);
                                return;
                            }

                            var weights = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
                            var sum = 0;
                            var products = [];

                            for (var i = 0; i < 12; i++) {
                                var p = digits[i] * weights[i];
                                products.push(p);
                                sum += p;
                            }

                            var checkDigit = (10 - (sum % 10)) % 10;

                            // Draw digit boxes
                            var boxW = 36;
                            var startX = (viz.width - 13 * boxW) / 2;
                            var boxY = 55;

                            for (var j = 0; j < 13; j++) {
                                var bx = startX + j * boxW;

                                // Box
                                var isCheck = j === 12;
                                ctx.fillStyle = isCheck ? viz.colors.teal + '33' : viz.colors.blue + '22';
                                ctx.strokeStyle = isCheck ? viz.colors.teal : viz.colors.blue + '66';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(bx + 2, boxY, boxW - 4, 36, 4);
                                ctx.fill();
                                ctx.stroke();

                                // Digit
                                ctx.fillStyle = isCheck ? viz.colors.teal : viz.colors.white;
                                ctx.font = 'bold 16px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(isCheck ? checkDigit.toString() : digits[j].toString(), bx + boxW / 2, boxY + 18);

                                // Weight
                                if (j < 12) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText('\u00D7' + weights[j], bx + boxW / 2, boxY + 50);
                                }

                                // Product
                                if (j < 12) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillText('=' + products[j], bx + boxW / 2, boxY + 66);
                                }

                                // Position label
                                ctx.fillStyle = viz.colors.text + '88';
                                ctx.font = '8px -apple-system,sans-serif';
                                ctx.fillText('d' + (j + 1), bx + boxW / 2, boxY - 8);
                            }

                            // Sum line
                            var sumY = boxY + 100;
                            viz.screenText('Weighted sum = ' + sum, viz.width / 2, sumY, viz.colors.white, 13);
                            viz.screenText(sum + ' mod 10 = ' + (sum % 10), viz.width / 2, sumY + 22, viz.colors.orange, 12);
                            viz.screenText('Check digit = (10 - ' + (sum % 10) + ') mod 10 = ' + checkDigit, viz.width / 2, sumY + 44, viz.colors.teal, 13);

                            // Full ISBN
                            var fullISBN = '';
                            for (var k = 0; k < 12; k++) fullISBN += digits[k];
                            fullISBN += checkDigit;
                            viz.screenText('Full ISBN-13: ' + fullISBN, viz.width / 2, sumY + 80, viz.colors.white, 14);

                            // Verification
                            var totalSum = sum + checkDigit;
                            viz.screenText(
                                'Verification: (' + sum + ' + ' + checkDigit + ') mod 10 = ' + (totalSum % 10) + (totalSum % 10 === 0 ? ' \u2714' : ' \u2718'),
                                viz.width / 2, sumY + 102,
                                totalSum % 10 === 0 ? viz.colors.green : viz.colors.red, 12
                            );
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-credit-card',
                    title: 'Luhn Algorithm: Credit Card Check',
                    description: 'See the Luhn algorithm in action step by step. Enter a number to check, and watch each digit get processed: doubling, summing, and final validation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var cardDigits = [4, 5, 3, 9, 1, 4, 8, 8, 0, 3, 4, 3, 6, 4, 6, 7];

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:4px;align-items:center;flex-wrap:wrap;';
                        var label = document.createElement('span');
                        label.textContent = 'Card number: ';
                        label.style.cssText = 'color:#c9d1d9;font-size:12px;';
                        inputDiv.appendChild(label);

                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = '4539148803436467';
                        inp.maxLength = 19;
                        inp.style.cssText = 'width:200px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:14px;font-family:monospace;';
                        inp.addEventListener('input', function() {
                            var val = inp.value.replace(/\D/g, '');
                            cardDigits = [];
                            for (var i = 0; i < val.length; i++) cardDigits.push(parseInt(val[i]));
                            draw();
                        });
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Luhn Algorithm', viz.width / 2, 18, viz.colors.white, 15);

                            if (cardDigits.length < 2) {
                                viz.screenText('Enter at least 2 digits', viz.width / 2, viz.height / 2, viz.colors.text, 14);
                                return;
                            }

                            var n = cardDigits.length;
                            var processed = [];
                            var sum = 0;

                            for (var i = 0; i < n; i++) {
                                var d = cardDigits[i];
                                var pos = n - 1 - i; // position from right (0-based)
                                var shouldDouble = pos % 2 === 1;
                                var val = d;
                                if (shouldDouble) {
                                    val = d * 2;
                                    if (val > 9) val -= 9;
                                }
                                processed.push({ original: d, doubled: shouldDouble, result: val });
                                sum += val;
                            }

                            var valid = sum % 10 === 0;

                            // Draw digit boxes
                            var maxPerRow = 16;
                            var rows = Math.ceil(n / maxPerRow);
                            var boxW = Math.min(32, (viz.width - 20) / Math.min(n, maxPerRow));

                            for (var row = 0; row < rows; row++) {
                                var start = row * maxPerRow;
                                var end = Math.min(start + maxPerRow, n);
                                var count = end - start;
                                var startX = (viz.width - count * boxW) / 2;
                                var baseY = 48 + row * 130;

                                for (var j = start; j < end; j++) {
                                    var p = processed[j];
                                    var bx = startX + (j - start) * boxW;

                                    // Original digit
                                    ctx.fillStyle = p.doubled ? viz.colors.orange + '22' : viz.colors.blue + '22';
                                    ctx.strokeStyle = p.doubled ? viz.colors.orange + '66' : viz.colors.blue + '66';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.roundRect(bx + 1, baseY, boxW - 2, 28, 3);
                                    ctx.fill();
                                    ctx.stroke();

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 13px monospace';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(p.original.toString(), bx + boxW / 2, baseY + 14);

                                    // Operation
                                    ctx.fillStyle = p.doubled ? viz.colors.orange : viz.colors.text + '66';
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.fillText(p.doubled ? '\u00D72' : '', bx + boxW / 2, baseY + 40);

                                    // Result
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '12px monospace';
                                    ctx.fillText(p.result.toString(), bx + boxW / 2, baseY + 56);

                                    if (p.doubled && p.original * 2 > 9) {
                                        ctx.fillStyle = viz.colors.text + '88';
                                        ctx.font = '8px -apple-system,sans-serif';
                                        ctx.fillText((p.original * 2) + '-9', bx + boxW / 2, baseY + 70);
                                    }
                                }
                            }

                            // Sum and result
                            var bottomY = 48 + rows * 130 + 10;
                            viz.screenText('Sum = ' + sum, viz.width / 2, bottomY, viz.colors.white, 14);
                            viz.screenText(
                                sum + ' mod 10 = ' + (sum % 10) + (valid ? '  \u2714 Valid' : '  \u2718 Invalid'),
                                viz.width / 2, bottomY + 24,
                                valid ? viz.colors.green : viz.colors.red, 14
                            );

                            // Legend
                            viz.screenText('Orange = doubled digits', viz.width / 2, bottomY + 50, viz.colors.orange, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the ISBN-13 check digit for the prefix 978-1-234-5678. (That is, for digits 9781234567800, what should the last digit be?)',
                    hint: 'Apply weights 1, 3, 1, 3, ... to the first 12 digits, sum them mod 10, then compute (10 - sum mod 10) mod 10.',
                    solution: 'Digits: 9,7,8,1,2,3,4,5,6,7,8,0. Weights: 1,3,1,3,1,3,1,3,1,3,1,3. Products: 9,21,8,3,2,9,4,15,6,21,8,0. Sum = 106. 106 mod 10 = 6. Check digit = (10 - 6) mod 10 = 4. Full ISBN: 9781234567804.'
                },
                {
                    question: 'The ISBN-13 system uses weights 1 and 3 alternating. Why not weights 1 and 2? (Hint: think about which transposition errors mod 10 can be detected.)',
                    hint: 'A transposition error swaps digits \\(d_i\\) and \\(d_{i+1}\\). The change in the weighted sum depends on \\((w_i - w_{i+1})(d_i - d_{i+1}) \\pmod{10}\\). For this to catch all transpositions, the weight difference must be coprime to 10.',
                    solution: 'With weights 1 and 3, the difference is \\(|1 - 3| = 2\\). With weights 1 and 2, the difference is 1, which would catch all transpositions but would miss some other error types. The weight 3 was chosen because \\(\\gcd(3, 10) = 1\\), so multiplication by 3 is a bijection mod 10, meaning every single-digit substitution is detected. Weight 2 would fail since \\(\\gcd(2, 10) = 2 \\neq 1\\), so some single-digit errors in even-weighted positions could go undetected.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Chinese Remainder Puzzle
        // ================================================================
        {
            id: 'sec-chinese',
            title: 'Chinese Remainder Puzzle',
            content: `
<h2>Chinese Remainder Puzzle</h2>

<div class="env-block intuition">
    <div class="env-title">An Ancient Riddle</div>
    <div class="env-body">
        <p>A general wants to count his soldiers. If they line up in rows of 3, there are 2 left over. In rows of 5, there are 3 left over. In rows of 7, there is 1 left over. How many soldiers are there?</p>
        <p>This puzzle appears in the 3rd-century Chinese text <em>Sunzi Suanjing</em> (Master Sun's Mathematical Manual). We need a number that simultaneously satisfies three remainder conditions.</p>
    </div>
</div>

<p>We are looking for a number \\(x\\) such that:</p>
\\[x \\equiv 2 \\pmod{3}, \\quad x \\equiv 3 \\pmod{5}, \\quad x \\equiv 1 \\pmod{7}.\\]

<h3>Solving by Systematic Search</h3>

<p>Start with the first condition: \\(x \\equiv 2 \\pmod{3}\\) means \\(x\\) could be \\(2, 5, 8, 11, 14, 17, 20, 23, \\ldots\\)</p>
<p>Of these, which satisfy \\(x \\equiv 3 \\pmod{5}\\)? Check: \\(8, 23, 38, 53, \\ldots\\) (every 15th number).</p>
<p>Of these, which satisfy \\(x \\equiv 1 \\pmod{7}\\)? Check: \\(8\\) gives \\(8 \\bmod 7 = 1\\). Yes!</p>

<p>So \\(x = 8\\) works, and the general solution is \\(x \\equiv 8 \\pmod{105}\\) (since \\(\\text{lcm}(3, 5, 7) = 105\\)).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 11.2 (Chinese Remainder Theorem, Simple Version)</div>
    <div class="env-body">
        <p>If \\(m_1, m_2, \\ldots, m_k\\) are pairwise coprime (every pair has \\(\\gcd = 1\\)), and \\(a_1, a_2, \\ldots, a_k\\) are any integers, then the system</p>
        \\[x \\equiv a_1 \\pmod{m_1}, \\quad x \\equiv a_2 \\pmod{m_2}, \\quad \\ldots, \\quad x \\equiv a_k \\pmod{m_k}\\]
        <p>has exactly one solution modulo \\(M = m_1 \\cdot m_2 \\cdots m_k\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Clock Puzzle</div>
    <div class="env-body">
        <p>What is the smallest positive integer that leaves remainder 1 when divided by 4 and remainder 2 when divided by 3?</p>
        <p>Numbers \\(\\equiv 1 \\pmod{4}\\): \\(1, 5, 9, 13, \\ldots\\)</p>
        <p>Of these, \\(5 \\bmod 3 = 2\\). So \\(x = 5\\), and the general solution is \\(x \\equiv 5 \\pmod{12}\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why "Chinese"?</div>
    <div class="env-body">
        <p>The theorem is named after the <em>Sunzi Suanjing</em>, written around 300 CE. The general mathematical formulation was stated by Qin Jiushao in 1247 CE, centuries before it appeared in European mathematics. It is one of the earliest results in abstract algebra.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-chinese-remainder-puzzle"></div>
`,
            visualizations: [
                {
                    id: 'viz-chinese-remainder-puzzle',
                    title: 'Chinese Remainder Puzzle Solver',
                    description: 'Set the remainders mod 3, 5, and 7. The visualization highlights all numbers satisfying each condition and finds where they intersect. The solution is unique modulo 105.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var r3 = 2;
                        var r5 = 3;
                        var r7 = 1;

                        VizEngine.createSlider(controls, 'rem mod 3', 0, 2, r3, 1, function(v) {
                            r3 = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'rem mod 5', 0, 4, r5, 1, function(v) {
                            r5 = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'rem mod 7', 0, 6, r7, 1, function(v) {
                            r7 = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Find x: x \u2261 ' + r3 + ' (mod 3), x \u2261 ' + r5 + ' (mod 5), x \u2261 ' + r7 + ' (mod 7)', viz.width / 2, 20, viz.colors.white, 13);

                            // Find the solution
                            var solution = -1;
                            for (var x = 0; x < 105; x++) {
                                if (x % 3 === r3 && x % 5 === r5 && x % 7 === r7) {
                                    solution = x;
                                    break;
                                }
                            }

                            // Draw number grid 0-104
                            var cols = 15;
                            var rows = 7;
                            var cellW = Math.min(34, (viz.width - 40) / cols);
                            var cellH = Math.min(36, (viz.height - 120) / rows);
                            var gridW = cols * cellW;
                            var gridStartX = (viz.width - gridW) / 2;
                            var gridStartY = 50;

                            for (var num = 0; num < 105; num++) {
                                var r = Math.floor(num / cols);
                                var c = num % cols;
                                var cx = gridStartX + c * cellW + cellW / 2;
                                var cy = gridStartY + r * cellH + cellH / 2;

                                var match3 = num % 3 === r3;
                                var match5 = num % 5 === r5;
                                var match7 = num % 7 === r7;
                                var matchCount = (match3 ? 1 : 0) + (match5 ? 1 : 0) + (match7 ? 1 : 0);

                                // Background color based on matches
                                if (matchCount === 3) {
                                    ctx.fillStyle = viz.colors.green + 'aa';
                                    ctx.beginPath();
                                    ctx.roundRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2, 4);
                                    ctx.fill();
                                } else if (matchCount === 2) {
                                    ctx.fillStyle = viz.colors.yellow + '33';
                                    ctx.fillRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);
                                } else if (matchCount === 1) {
                                    // Small dot indicators
                                    var dotY = cy + cellH / 2 - 5;
                                    if (match3) {
                                        ctx.fillStyle = viz.colors.blue + '66';
                                        ctx.beginPath(); ctx.arc(cx - 5, dotY, 2, 0, Math.PI * 2); ctx.fill();
                                    }
                                    if (match5) {
                                        ctx.fillStyle = viz.colors.orange + '66';
                                        ctx.beginPath(); ctx.arc(cx, dotY, 2, 0, Math.PI * 2); ctx.fill();
                                    }
                                    if (match7) {
                                        ctx.fillStyle = viz.colors.purple + '66';
                                        ctx.beginPath(); ctx.arc(cx + 5, dotY, 2, 0, Math.PI * 2); ctx.fill();
                                    }
                                }

                                // Number text
                                ctx.fillStyle = matchCount === 3 ? viz.colors.white :
                                                matchCount === 2 ? viz.colors.yellow :
                                                viz.colors.text + '88';
                                ctx.font = (matchCount === 3 ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(num.toString(), cx, cy);
                            }

                            // Legend and solution
                            var legY = gridStartY + rows * cellH + 15;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';

                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('\u2261 ' + r3 + ' (mod 3)', viz.width / 2 - 140, legY);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('\u2261 ' + r5 + ' (mod 5)', viz.width / 2, legY);
                            ctx.fillStyle = viz.colors.purple;
                            ctx.fillText('\u2261 ' + r7 + ' (mod 7)', viz.width / 2 + 140, legY);

                            if (solution >= 0) {
                                viz.screenText(
                                    'Solution: x \u2261 ' + solution + ' (mod 105)',
                                    viz.width / 2, legY + 30, viz.colors.green, 15
                                );
                                viz.screenText(
                                    'x = ' + solution + ', ' + (solution + 105) + ', ' + (solution + 210) + ', ...',
                                    viz.width / 2, legY + 50, viz.colors.text, 11
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the smallest positive integer \\(x\\) such that \\(x \\equiv 1 \\pmod{3}\\), \\(x \\equiv 2 \\pmod{5}\\), and \\(x \\equiv 3 \\pmod{7}\\).',
                    hint: 'List numbers \\(\\equiv 1 \\pmod{3}\\): 1, 4, 7, 10, 13, ... Then check which also satisfy the second condition, then the third.',
                    solution: 'Numbers \\(\\equiv 1 \\pmod{3}\\): 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, ... Among these, \\(\\equiv 2 \\pmod{5}\\): 7, 22, 37, 52, ... Among these, \\(\\equiv 3 \\pmod{7}\\): 52 gives \\(52 \\bmod 7 = 3\\). So \\(x = 52\\).'
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
<h2>Looking Ahead</h2>

<div class="env-block intuition">
    <div class="env-title">What We Learned</div>
    <div class="env-body">
        <p>In this chapter we discovered that modular arithmetic creates <strong>cyclic patterns</strong>:</p>
        <ul>
            <li>Powers of \\(a\\) mod \\(n\\) always cycle. The cycle length (multiplicative order) divides \\(\\phi(n)\\).</li>
            <li><strong>Fermat's little theorem</strong>: if \\(p\\) is prime and \\(\\gcd(a, p) = 1\\), then \\(a^{p-1} \\equiv 1 \\pmod{p}\\). This is the foundation of modern primality testing and public-key cryptography.</li>
            <li><strong>Check digits</strong> (ISBN, credit cards) use modular arithmetic to catch human errors in data entry.</li>
            <li>The <strong>Chinese Remainder Theorem</strong> lets us solve systems of simultaneous remainder conditions, provided the moduli are pairwise coprime.</li>
        </ul>
    </div>
</div>

<h3>Connections Forward</h3>

<p>The patterns we discovered here open doors to exciting topics:</p>

<ul>
    <li><strong>Perfect numbers</strong> (Chapter 12): The formula \\(2^{p-1}(2^p - 1)\\) for even perfect numbers relies on properties of powers mod primes. Mersenne primes, which make perfect numbers, are tested using modular exponentiation.</li>
    <li><strong>Fibonacci numbers</strong> (Chapter 13): The Pisano period, the length of the cycle of Fibonacci numbers mod \\(n\\), is a direct analog of the multiplicative order. Fibonacci numbers mod \\(n\\) always cycle, and the cycle length has surprising connections to number theory.</li>
    <li><strong>Cryptography</strong> (Chapter 16): RSA encryption relies directly on Fermat's little theorem (and its generalization, Euler's theorem). The security of your online banking depends on the difficulty of reversing modular exponentiation.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">The Power of Simple Patterns</div>
    <div class="env-body">
        <p>The fact that \\(a^{p-1} \\equiv 1 \\pmod{p}\\) is an identity that a student can verify in minutes, yet it took humanity 2,000+ years from Euclid to Fermat to discover it. And this simple pattern is the mathematical backbone of internet security. Sometimes the most important results in mathematics are not the hardest to prove, but the hardest to notice.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The order of 2 mod 31 is 5. Use this to compute \\(2^{100} \\bmod 31\\).',
                    hint: 'Since \\(\\text{ord}_{31}(2) = 5\\), we have \\(2^5 \\equiv 1 \\pmod{31}\\). Write \\(100 = 5q + r\\).',
                    solution: '\\(100 = 5 \\times 20 + 0\\). So \\(2^{100} = (2^5)^{20} \\equiv 1^{20} = 1 \\pmod{31}\\).'
                }
            ]
        }
    ]
});
