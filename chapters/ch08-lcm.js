window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'Least Common Multiple',
    subtitle: 'The smallest number both divide into',
    sections: [
        // ================================================================
        // SECTION 1: Why LCM?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why LCM?',
            content: `
<h2>Why LCM?</h2>

<div class="env-block intuition">
    <div class="env-title">A Scheduling Puzzle</div>
    <div class="env-body">
        <p>Alice visits the library every 4 days. Bob visits every 6 days. They both went today. When is the <em>next</em> day they will both be at the library on the same day?</p>
        <p>Alice's visits: day 4, 8, 12, 16, 20, 24, ...</p>
        <p>Bob's visits: day 6, 12, 18, 24, 30, ...</p>
        <p>The first day they both visit is day <strong>12</strong>. This is the <strong>least common multiple</strong> of 4 and 6.</p>
    </div>
</div>

<p>Common multiples arise naturally whenever two (or more) repeating events need to <em>synchronize</em>. The least common multiple (LCM) is the earliest point of synchronization, the smallest positive number that both numbers divide into evenly.</p>

<h3>Where LCM Appears</h3>

<ul>
    <li><strong>Scheduling:</strong> Two buses leave the station at different intervals. When do they depart at the same time again?</li>
    <li><strong>Fractions:</strong> To add \\(\\frac{1}{4} + \\frac{5}{6}\\), you need a common denominator. The <em>least</em> common denominator is \\(\\text{lcm}(4, 6) = 12\\).</li>
    <li><strong>Gear teeth:</strong> Two meshing gears with different numbers of teeth return to their starting position after \\(\\text{lcm}\\) rotations.</li>
    <li><strong>Music:</strong> Two rhythmic patterns of different lengths repeat together every LCM beats.</li>
</ul>

<p>In each case, we are asking: what is the smallest number that is a multiple of <em>both</em> given numbers?</p>

<div class="env-block remark">
    <div class="env-title">Connection to GCD</div>
    <div class="env-body">
        <p>The LCM is deeply connected to the GCD (greatest common divisor) we studied in Chapters 6 and 7. As we will see, the two are related by a beautiful formula: \\(\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b\\). This connection makes computing the LCM efficient.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-scheduling"></div>
`,
            visualizations: [
                {
                    id: 'viz-scheduling',
                    title: 'Scheduling: When Do Events Coincide?',
                    description: 'Two events repeat at different intervals. Drag the sliders to set the periods. The timeline shows when each event occurs, and highlights the coincidence points. The first coincidence is the LCM.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 300,
                            originX: 0, originY: 0, scale: 1
                        });

                        var periodA = 4;
                        var periodB = 6;

                        VizEngine.createSlider(controls, 'Period A', 2, 12, periodA, 1, function(v) {
                            periodA = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Period B', 2, 12, periodB, 1, function(v) {
                            periodB = Math.round(v);
                            draw();
                        });

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function lcm(a, b) { return a / gcd(a, b) * b; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var L = lcm(periodA, periodB);
                            var maxDay = Math.min(L * 2, 72);

                            viz.screenText('Event A: every ' + periodA + ' days', 120, 22, viz.colors.blue, 13);
                            viz.screenText('Event B: every ' + periodB + ' days', 400, 22, viz.colors.teal, 13);

                            var leftPad = 40;
                            var rightPad = 20;
                            var usableW = viz.width - leftPad - rightPad;
                            var dayW = usableW / maxDay;

                            // Timeline A
                            var yA = 80;
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(leftPad, yA);
                            ctx.lineTo(leftPad + maxDay * dayW, yA);
                            ctx.stroke();

                            for (var d = periodA; d <= maxDay; d += periodA) {
                                var x = leftPad + d * dayW;
                                var isCommon = (d % periodB === 0);
                                ctx.fillStyle = isCommon ? viz.colors.green : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(x, yA, isCommon ? 7 : 5, 0, Math.PI * 2);
                                ctx.fill();
                                if (dayW > 6) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(d, x, yA + 10);
                                }
                            }

                            // Timeline B
                            var yB = 150;
                            ctx.strokeStyle = viz.colors.teal + '44';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(leftPad, yB);
                            ctx.lineTo(leftPad + maxDay * dayW, yB);
                            ctx.stroke();

                            for (var d2 = periodB; d2 <= maxDay; d2 += periodB) {
                                var x2 = leftPad + d2 * dayW;
                                var isCommon2 = (d2 % periodA === 0);
                                ctx.fillStyle = isCommon2 ? viz.colors.green : viz.colors.teal;
                                ctx.beginPath();
                                ctx.arc(x2, yB, isCommon2 ? 7 : 5, 0, Math.PI * 2);
                                ctx.fill();
                                if (dayW > 6) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(d2, x2, yB + 10);
                                }
                            }

                            // Draw vertical lines at common multiples
                            for (var cm = L; cm <= maxDay; cm += L) {
                                var xCm = leftPad + cm * dayW;
                                ctx.strokeStyle = viz.colors.green + '66';
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(xCm, yA - 15);
                                ctx.lineTo(xCm, yB + 15);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Labels
                            viz.screenText('A', leftPad - 20, yA, viz.colors.blue, 14);
                            viz.screenText('B', leftPad - 20, yB, viz.colors.teal, 14);

                            // Result
                            viz.screenText('lcm(' + periodA + ', ' + periodB + ') = ' + L, viz.width / 2, 210, viz.colors.green, 16);
                            viz.screenText('First coincidence at day ' + L, viz.width / 2, 235, viz.colors.white, 12);
                            viz.screenText('gcd(' + periodA + ', ' + periodB + ') = ' + gcd(periodA, periodB), viz.width / 2, 260, viz.colors.orange, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Two traffic lights turn green at the same time. One cycles every 45 seconds, the other every 60 seconds. After how many seconds will they both turn green at the same time again?',
                    hint: 'You need the LCM of 45 and 60. Try listing multiples, or factor both numbers first.',
                    solution: '\\(45 = 3^2 \\times 5\\) and \\(60 = 2^2 \\times 3 \\times 5\\). Taking the maximum power of each prime: \\(\\text{lcm}(45, 60) = 2^2 \\times 3^2 \\times 5 = 180\\) seconds, i.e., every 3 minutes.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Definition
        // ================================================================
        {
            id: 'sec-definition',
            title: 'Definition of LCM',
            content: `
<h2>Definition of LCM</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Common Multiple)</div>
    <div class="env-body">
        <p>A <strong>common multiple</strong> of two positive integers \\(a\\) and \\(b\\) is a positive integer \\(m\\) such that \\(a \\mid m\\) and \\(b \\mid m\\).</p>
    </div>
</div>

<p>For example, the common multiples of 4 and 6 are: 12, 24, 36, 48, ... These are exactly the multiples of 12. Notice that the set of common multiples is never empty: \\(a \\times b\\) is always a common multiple (though usually not the smallest one).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Least Common Multiple)</div>
    <div class="env-body">
        <p>The <strong>least common multiple</strong> of two positive integers \\(a\\) and \\(b\\), written \\(\\text{lcm}(a, b)\\) or \\([a, b]\\), is the <em>smallest</em> positive common multiple of \\(a\\) and \\(b\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Multiples of 6: 6, 12, 18, 24, 30, 36, ...</p>
        <p>Multiples of 8: 8, 16, 24, 32, 40, 48, ...</p>
        <p>Common multiples: 24, 48, 72, ...</p>
        <p>Therefore \\(\\text{lcm}(6, 8) = 24\\).</p>
    </div>
</div>

<h3>Key Properties</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.1 (Common Multiples Are Multiples of the LCM)</div>
    <div class="env-body">
        <p>If \\(m\\) is a common multiple of \\(a\\) and \\(b\\), then \\(\\text{lcm}(a, b) \\mid m\\).</p>
        <p>In other words, every common multiple of \\(a\\) and \\(b\\) is a multiple of their LCM.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(L = \\text{lcm}(a, b)\\). Divide \\(m\\) by \\(L\\): write \\(m = qL + r\\) with \\(0 \\leq r < L\\).</p>
        <p>Since \\(a \\mid m\\) and \\(a \\mid L\\), we get \\(a \\mid r\\). Similarly \\(b \\mid r\\). So \\(r\\) is a common multiple of \\(a\\) and \\(b\\) (or \\(r = 0\\)).</p>
        <p>But \\(0 \\leq r < L\\), and \\(L\\) is the <em>least</em> positive common multiple. So \\(r = 0\\), meaning \\(L \\mid m\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>This theorem tells us something beautiful: the set of common multiples of \\(a\\) and \\(b\\) is exactly \\(\\{L, 2L, 3L, \\ldots\\}\\) where \\(L = \\text{lcm}(a, b)\\). The common multiples form a simple pattern once you know the LCM.</p>

<div class="env-block remark">
    <div class="env-title">Comparison with GCD</div>
    <div class="env-body">
        <p>Recall that \\(\\gcd(a, b)\\) is the <em>largest</em> number dividing both \\(a\\) and \\(b\\). In contrast, \\(\\text{lcm}(a, b)\\) is the <em>smallest</em> number that both \\(a\\) and \\(b\\) divide into. GCD looks "downward" at common divisors; LCM looks "upward" at common multiples.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-common-multiples"></div>
`,
            visualizations: [
                {
                    id: 'viz-common-multiples',
                    title: 'Common Multiples on Number Lines',
                    description: 'Two number lines show multiples of a and b. Common multiples are highlighted in green, and the LCM (the first common multiple) gets a special marker.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 320,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 4;
                        var b = 6;

                        VizEngine.createSlider(controls, 'a', 2, 15, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 15, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
                        function lcmVal(x, y) { return x / gcd(x, y) * y; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var L = lcmVal(a, b);
                            var maxN = Math.min(L * 2 + 2, 80);

                            var leftPad = 50;
                            var rightPad = 20;
                            var usableW = viz.width - leftPad - rightPad;
                            var unitW = usableW / maxN;

                            viz.screenText('Multiples of ' + a, leftPad + usableW / 2, 22, viz.colors.blue, 13);

                            // Number line for a
                            var yA = 65;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftPad, yA);
                            ctx.lineTo(leftPad + maxN * unitW, yA);
                            ctx.stroke();

                            // Tick marks and multiples of a
                            for (var i = 1; i * a <= maxN; i++) {
                                var val = i * a;
                                var x = leftPad + val * unitW;
                                var isCommon = (val % b === 0);
                                var isLCM = (val === L);

                                ctx.fillStyle = isLCM ? viz.colors.green : (isCommon ? viz.colors.green + 'aa' : viz.colors.blue);
                                ctx.beginPath();
                                ctx.arc(x, yA, isLCM ? 8 : (isCommon ? 6 : 4), 0, Math.PI * 2);
                                ctx.fill();

                                if (isLCM) {
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.arc(x, yA, 12, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                if (unitW > 3 || isCommon) {
                                    ctx.fillStyle = isCommon ? viz.colors.green : viz.colors.text;
                                    ctx.font = (isLCM ? 'bold ' : '') + '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(val, x, yA + 14);
                                }
                            }

                            viz.screenText('Multiples of ' + b, leftPad + usableW / 2, 110, viz.colors.teal, 13);

                            // Number line for b
                            var yB = 150;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftPad, yB);
                            ctx.lineTo(leftPad + maxN * unitW, yB);
                            ctx.stroke();

                            for (var j = 1; j * b <= maxN; j++) {
                                var val2 = j * b;
                                var x2 = leftPad + val2 * unitW;
                                var isCommon2 = (val2 % a === 0);
                                var isLCM2 = (val2 === L);

                                ctx.fillStyle = isLCM2 ? viz.colors.green : (isCommon2 ? viz.colors.green + 'aa' : viz.colors.teal);
                                ctx.beginPath();
                                ctx.arc(x2, yB, isLCM2 ? 8 : (isCommon2 ? 6 : 4), 0, Math.PI * 2);
                                ctx.fill();

                                if (isLCM2) {
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.arc(x2, yB, 12, 0, Math.PI * 2);
                                    ctx.stroke();
                                }

                                if (unitW > 3 || isCommon2) {
                                    ctx.fillStyle = isCommon2 ? viz.colors.green : viz.colors.text;
                                    ctx.font = (isLCM2 ? 'bold ' : '') + '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(val2, x2, yB + 14);
                                }
                            }

                            // Draw connecting lines for common multiples
                            for (var cm = L; cm <= maxN; cm += L) {
                                var xCm = leftPad + cm * unitW;
                                ctx.strokeStyle = viz.colors.green + '55';
                                ctx.lineWidth = 1.5;
                                ctx.setLineDash([3, 3]);
                                ctx.beginPath();
                                ctx.moveTo(xCm, yA + 14);
                                ctx.lineTo(xCm, yB - 14);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Result
                            viz.screenText('lcm(' + a + ', ' + b + ') = ' + L, viz.width / 2, 210, viz.colors.green, 16);

                            // List common multiples
                            var cms = [];
                            for (var k = L; k <= maxN; k += L) cms.push(k);
                            viz.screenText('Common multiples: ' + cms.join(', ') + ', ...', viz.width / 2, 235, viz.colors.text, 11);
                            viz.screenText('All common multiples are multiples of the LCM', viz.width / 2, 255, viz.colors.text + 'aa', 10);

                            // Legend
                            var legY = 280;
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath(); ctx.arc(viz.width / 2 - 100, legY, 5, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('= common multiple', viz.width / 2 - 50, legY, viz.colors.text, 10, 'left');

                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(viz.width / 2 + 60, legY, 8, 0, Math.PI * 2); ctx.stroke();
                            viz.screenText('= LCM', viz.width / 2 + 100, legY, viz.colors.text, 10, 'left');
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(\\text{lcm}(12, 18)\\) by listing multiples of each number.',
                    hint: 'List multiples of 12: 12, 24, 36, 48, ... and multiples of 18: 18, 36, 54, ... Look for the first common one.',
                    solution: 'Multiples of 12: 12, 24, <strong>36</strong>, 48, 60, <strong>72</strong>, ... Multiples of 18: 18, <strong>36</strong>, 54, <strong>72</strong>, ... The smallest common multiple is \\(\\text{lcm}(12, 18) = 36\\).'
                },
                {
                    question: 'True or false: \\(\\text{lcm}(a, b) \\leq a \\times b\\) for all positive integers \\(a, b\\). When does equality hold?',
                    hint: 'Think about when \\(a\\) and \\(b\\) share no common factors.',
                    solution: 'True. Since \\(a \\times b\\) is always a common multiple, the <em>least</em> common multiple cannot exceed it. Equality holds exactly when \\(\\gcd(a, b) = 1\\), i.e., when \\(a\\) and \\(b\\) are coprime. For example, \\(\\text{lcm}(3, 5) = 15 = 3 \\times 5\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Finding LCM by Listing Multiples
        // ================================================================
        {
            id: 'sec-listing',
            title: 'Finding LCM by Listing Multiples',
            content: `
<h2>Finding LCM by Listing Multiples</h2>

<p>The most direct way to find the LCM is exactly what the definition says: list multiples of each number until you find the first one in common.</p>

<div class="env-block example">
    <div class="env-title">Example: lcm(8, 12)</div>
    <div class="env-body">
        <p>Multiples of 8: 8, 16, <strong>24</strong>, 32, 40, <strong>48</strong>, ...</p>
        <p>Multiples of 12: 12, <strong>24</strong>, 36, <strong>48</strong>, ...</p>
        <p>The first number appearing in both lists is 24, so \\(\\text{lcm}(8, 12) = 24\\).</p>
    </div>
</div>

<h3>A Systematic Approach</h3>

<p>Rather than writing out two separate lists, you can be more efficient:</p>

<ol>
    <li>Start with the <em>larger</em> number's multiples (there are fewer to check before hitting the LCM).</li>
    <li>For each multiple, check if the smaller number divides it.</li>
    <li>The first one that passes the divisibility test is the LCM.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: lcm(9, 15)</div>
    <div class="env-body">
        <p>Check multiples of 15 (the larger number):</p>
        <ul>
            <li>15: does \\(9 \\mid 15\\)? No (\\(15 / 9 = 1\\) remainder \\(6\\)).</li>
            <li>30: does \\(9 \\mid 30\\)? No (\\(30 / 9 = 3\\) remainder \\(3\\)).</li>
            <li>45: does \\(9 \\mid 45\\)? Yes (\\(45 / 9 = 5\\)).</li>
        </ul>
        <p>So \\(\\text{lcm}(9, 15) = 45\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Limitations of Listing</div>
    <div class="env-body">
        <p>This method works well for small numbers, but becomes impractical for large ones. For instance, \\(\\text{lcm}(247, 391)\\) would require checking many multiples of 391. We will see faster methods in the next two sections.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-lcm-calculator"></div>
`,
            visualizations: [
                {
                    id: 'viz-lcm-calculator',
                    title: 'LCM Calculator: Step by Step',
                    description: 'Enter two numbers and watch the calculator find the LCM by checking multiples. It uses the GCD shortcut for instant computation, and also shows the listing method so you can see both approaches.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 8;
                        var b = 12;

                        VizEngine.createSlider(controls, 'a', 2, 30, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 30, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(a, b);
                            var L = a / g * b;

                            viz.screenText('Finding lcm(' + a + ', ' + b + ')', viz.width / 2, 22, viz.colors.white, 15);

                            // Method 1: listing multiples of the larger
                            var bigger = Math.max(a, b);
                            var smaller = Math.min(a, b);
                            var steps = [];
                            for (var k = 1; k * bigger <= L; k++) {
                                var mult = k * bigger;
                                var divides = (mult % smaller === 0);
                                steps.push({ mult: mult, divides: divides });
                            }

                            // Show listing method
                            viz.screenText('Method: Check multiples of ' + bigger, viz.width / 2, 50, viz.colors.teal, 12);

                            var startY = 72;
                            var rowH = 20;
                            var maxShow = Math.min(steps.length, 12);
                            for (var i = 0; i < maxShow; i++) {
                                var s = steps[i];
                                var y = startY + i * rowH;
                                var label = (i + 1) + ' \u00D7 ' + bigger + ' = ' + s.mult;
                                var check = s.divides ? ('\u2713 ' + smaller + ' divides ' + s.mult) : ('\u2717 ' + smaller + ' does not divide ' + s.mult);
                                var col = s.divides ? viz.colors.green : viz.colors.text;

                                ctx.fillStyle = col;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, 40, y);

                                ctx.fillStyle = s.divides ? viz.colors.green : viz.colors.red + '88';
                                ctx.textAlign = 'left';
                                ctx.fillText(check, 220, y);

                                if (s.divides) {
                                    // Highlight the found LCM
                                    ctx.strokeStyle = viz.colors.green + '44';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(35, y - 9, viz.width - 70, 18);
                                }
                            }

                            // GCD shortcut
                            var bottomY = startY + maxShow * rowH + 25;
                            viz.screenText('GCD Shortcut', viz.width / 2, bottomY, viz.colors.orange, 13);
                            viz.screenText('gcd(' + a + ', ' + b + ') = ' + g, viz.width / 2, bottomY + 22, viz.colors.orange, 12);
                            viz.screenText('lcm = ' + a + ' \u00D7 ' + b + ' / ' + g + ' = ' + (a * b) + ' / ' + g + ' = ' + L, viz.width / 2, bottomY + 44, viz.colors.white, 12);

                            // Final answer
                            viz.screenText('lcm(' + a + ', ' + b + ') = ' + L, viz.width / 2, bottomY + 75, viz.colors.green, 18);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(\\text{lcm}(14, 21)\\) by listing multiples.',
                    hint: 'List multiples of 21 (the larger): 21, 42, 63, ... and check which is the first one divisible by 14.',
                    solution: 'Multiples of 21: 21 (not divisible by 14), <strong>42</strong> (\\(42/14 = 3\\), yes!). So \\(\\text{lcm}(14, 21) = 42\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: LCM from Prime Factorization
        // ================================================================
        {
            id: 'sec-prime-method',
            title: 'LCM from Prime Factorization',
            content: `
<h2>LCM from Prime Factorization</h2>

<p>Prime factorization gives us an elegant and systematic way to compute the LCM. The key idea is simple: <strong>take the maximum power of each prime</strong>.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.2 (LCM via Prime Factorization)</div>
    <div class="env-body">
        <p>If \\(a = p_1^{\\alpha_1} p_2^{\\alpha_2} \\cdots p_k^{\\alpha_k}\\) and \\(b = p_1^{\\beta_1} p_2^{\\beta_2} \\cdots p_k^{\\beta_k}\\) (using all primes that appear in either factorization, with exponent 0 where a prime does not appear), then</p>
        \\[\\text{lcm}(a, b) = p_1^{\\max(\\alpha_1, \\beta_1)} \\cdot p_2^{\\max(\\alpha_2, \\beta_2)} \\cdots p_k^{\\max(\\alpha_k, \\beta_k)}.\\]
    </div>
</div>

<p>Why maximum? For a number \\(m\\) to be divisible by \\(a\\), \\(m\\) must contain <em>at least</em> \\(\\alpha_i\\) copies of prime \\(p_i\\). Similarly for \\(b\\), \\(m\\) needs at least \\(\\beta_i\\) copies. The minimum requirement is \\(\\max(\\alpha_i, \\beta_i)\\) copies of each prime.</p>

<div class="env-block example">
    <div class="env-title">Example: lcm(72, 120)</div>
    <div class="env-body">
        <p>Factor both numbers:</p>
        <ul>
            <li>\\(72 = 2^3 \\times 3^2\\)</li>
            <li>\\(120 = 2^3 \\times 3 \\times 5\\)</li>
        </ul>
        <p>Take the maximum exponent for each prime:</p>
        <ul>
            <li>\\(2\\): \\(\\max(3, 3) = 3\\)</li>
            <li>\\(3\\): \\(\\max(2, 1) = 2\\)</li>
            <li>\\(5\\): \\(\\max(0, 1) = 1\\)</li>
        </ul>
        <p>\\(\\text{lcm}(72, 120) = 2^3 \\times 3^2 \\times 5 = 8 \\times 9 \\times 5 = 360\\).</p>
    </div>
</div>

<h3>Comparison with GCD</h3>

<p>Recall that \\(\\gcd(a, b)\\) takes the <strong>minimum</strong> exponent of each prime. The LCM takes the <strong>maximum</strong>. This duality is the heart of their relationship:</p>

<table style="margin:1em auto;border-collapse:collapse;">
    <tr style="border-bottom:1px solid #30363d;">
        <th style="padding:6px 16px;color:#8b949e;">Prime</th>
        <th style="padding:6px 16px;color:#58a6ff;">Exponent in \\(a\\)</th>
        <th style="padding:6px 16px;color:#3fb9a0;">Exponent in \\(b\\)</th>
        <th style="padding:6px 16px;color:#f0883e;">GCD (min)</th>
        <th style="padding:6px 16px;color:#3fb950;">LCM (max)</th>
    </tr>
    <tr><td style="padding:4px 16px;text-align:center;">\\(p_i\\)</td><td style="padding:4px 16px;text-align:center;">\\(\\alpha_i\\)</td><td style="padding:4px 16px;text-align:center;">\\(\\beta_i\\)</td><td style="padding:4px 16px;text-align:center;">\\(\\min(\\alpha_i, \\beta_i)\\)</td><td style="padding:4px 16px;text-align:center;">\\(\\max(\\alpha_i, \\beta_i)\\)</td></tr>
</table>

<div class="viz-placeholder" data-viz="viz-lcm-venn"></div>
`,
            visualizations: [
                {
                    id: 'viz-lcm-venn',
                    title: 'Prime Factorization Venn Diagram: GCD vs LCM',
                    description: 'See how prime factors are distributed between two numbers. The GCD collects the shared (minimum) factors; the LCM collects everything (maximum). Change a and b to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 72;
                        var b = 120;

                        VizEngine.createSlider(controls, 'a', 2, 180, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 180, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function factorize(n) {
                            var factors = {};
                            for (var p = 2; p * p <= n; p++) {
                                while (n % p === 0) {
                                    factors[p] = (factors[p] || 0) + 1;
                                    n /= p;
                                }
                            }
                            if (n > 1) factors[n] = (factors[n] || 0) + 1;
                            return factors;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var fa = factorize(a);
                            var fb = factorize(b);

                            // Collect all primes
                            var allPrimes = {};
                            for (var p in fa) allPrimes[p] = true;
                            for (var p2 in fb) allPrimes[p2] = true;
                            var primes = Object.keys(allPrimes).map(Number).sort(function(x, y) { return x - y; });

                            viz.screenText(a + ' vs ' + b, viz.width / 2, 22, viz.colors.white, 16);

                            // Draw Venn circles
                            var cx1 = viz.width / 2 - 80;
                            var cx2 = viz.width / 2 + 80;
                            var cy = 160;
                            var r = 110;

                            // Circle fills
                            ctx.globalAlpha = 0.12;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(cx1, cy, r, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cx2, cy, r, 0, Math.PI * 2); ctx.fill();
                            ctx.globalAlpha = 1;

                            // Circle outlines
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.arc(cx1, cy, r, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(cx2, cy, r, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            viz.screenText(a.toString(), cx1 - 60, cy - r + 20, viz.colors.blue, 14);
                            viz.screenText(b.toString(), cx2 + 60, cy - r + 20, viz.colors.teal, 14);

                            // Partition primes into left-only, shared, right-only
                            var leftOnly = [];
                            var shared = [];
                            var rightOnly = [];

                            for (var i = 0; i < primes.length; i++) {
                                var pr = primes[i];
                                var ea = fa[pr] || 0;
                                var eb = fb[pr] || 0;

                                if (ea > 0 && eb > 0) {
                                    var minE = Math.min(ea, eb);
                                    // shared part
                                    shared.push(pr + '^' + minE);
                                    // excess in a
                                    if (ea > minE) leftOnly.push(pr + '^' + (ea - minE));
                                    // excess in b
                                    if (eb > minE) rightOnly.push(pr + '^' + (eb - minE));
                                } else if (ea > 0) {
                                    leftOnly.push(pr + '^' + ea);
                                } else {
                                    rightOnly.push(pr + '^' + eb);
                                }
                            }

                            // Draw factors in regions
                            var fontSize = 13;

                            // Left only
                            var lx = cx1 - 55;
                            for (var li = 0; li < leftOnly.length; li++) {
                                viz.screenText(leftOnly[li], lx, cy - 20 + li * 22, viz.colors.blue, fontSize);
                            }
                            if (leftOnly.length === 0) {
                                viz.screenText('(none)', lx, cy, viz.colors.text + '66', 10);
                            }

                            // Shared (intersection)
                            var sx = viz.width / 2;
                            for (var si = 0; si < shared.length; si++) {
                                viz.screenText(shared[si], sx, cy - 20 + si * 22, viz.colors.green, fontSize);
                            }
                            if (shared.length === 0) {
                                viz.screenText('(none)', sx, cy, viz.colors.text + '66', 10);
                            }

                            // Right only
                            var rx = cx2 + 55;
                            for (var ri = 0; ri < rightOnly.length; ri++) {
                                viz.screenText(rightOnly[ri], rx, cy - 20 + ri * 22, viz.colors.teal, fontSize);
                            }
                            if (rightOnly.length === 0) {
                                viz.screenText('(none)', rx, cy, viz.colors.text + '66', 10);
                            }

                            // Compute GCD and LCM
                            var gcdVal = 1;
                            var lcmVal = 1;
                            for (var gi = 0; gi < primes.length; gi++) {
                                var gp = primes[gi];
                                var gea = fa[gp] || 0;
                                var geb = fb[gp] || 0;
                                gcdVal *= Math.pow(gp, Math.min(gea, geb));
                                lcmVal *= Math.pow(gp, Math.max(gea, geb));
                            }

                            // Results
                            var resY = cy + r + 20;
                            viz.screenText('GCD = intersection = ' + gcdVal, viz.width / 2, resY, viz.colors.orange, 13);
                            viz.screenText('LCM = union = ' + lcmVal, viz.width / 2, resY + 22, viz.colors.green, 13);
                            viz.screenText('GCD \u00D7 LCM = ' + (gcdVal * lcmVal) + '    a \u00D7 b = ' + (a * b), viz.width / 2, resY + 48, viz.colors.purple, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use prime factorization to find \\(\\text{lcm}(84, 90)\\).',
                    hint: 'Factor: \\(84 = 2^2 \\times 3 \\times 7\\), \\(90 = 2 \\times 3^2 \\times 5\\). Take the maximum exponent for each prime.',
                    solution: '\\(84 = 2^2 \\times 3 \\times 7\\), \\(90 = 2 \\times 3^2 \\times 5\\). Maximum exponents: \\(2^2, 3^2, 5^1, 7^1\\). So \\(\\text{lcm}(84, 90) = 4 \\times 9 \\times 5 \\times 7 = 1260\\).'
                },
                {
                    question: 'Find \\(\\text{lcm}(2^3 \\times 5, \\; 2 \\times 5^2 \\times 7)\\) without multiplying out.',
                    hint: 'The factorizations are already given. Just take the max of each exponent.',
                    solution: 'Max exponents: \\(2^{\\max(3,1)} = 2^3\\), \\(5^{\\max(1,2)} = 5^2\\), \\(7^{\\max(0,1)} = 7^1\\). So \\(\\text{lcm} = 2^3 \\times 5^2 \\times 7 = 8 \\times 25 \\times 7 = 1400\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: The GCD-LCM Connection
        // ================================================================
        {
            id: 'sec-gcd-lcm',
            title: 'The GCD-LCM Connection',
            content: `
<h2>The GCD-LCM Connection</h2>

<p>The most important relationship between GCD and LCM is a single, elegant formula.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 8.3 (GCD-LCM Product Formula)</div>
    <div class="env-body">
        <p>For any positive integers \\(a\\) and \\(b\\):</p>
        \\[\\gcd(a, b) \\times \\text{lcm}(a, b) = a \\times b.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Write \\(a = p_1^{\\alpha_1} \\cdots p_k^{\\alpha_k}\\) and \\(b = p_1^{\\beta_1} \\cdots p_k^{\\beta_k}\\). Then:</p>
        \\[\\gcd(a,b) \\times \\text{lcm}(a,b) = \\prod_i p_i^{\\min(\\alpha_i, \\beta_i)} \\times \\prod_i p_i^{\\max(\\alpha_i, \\beta_i)} = \\prod_i p_i^{\\min(\\alpha_i, \\beta_i) + \\max(\\alpha_i, \\beta_i)}.\\]
        <p>The key identity is: \\(\\min(\\alpha, \\beta) + \\max(\\alpha, \\beta) = \\alpha + \\beta\\) for any two numbers \\(\\alpha, \\beta\\).</p>
        <p>Therefore \\(\\gcd(a,b) \\times \\text{lcm}(a,b) = \\prod_i p_i^{\\alpha_i + \\beta_i} = \\left(\\prod_i p_i^{\\alpha_i}\\right) \\times \\left(\\prod_i p_i^{\\beta_i}\\right) = a \\times b\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Why This Matters</h3>

<p>This formula gives us the fastest way to compute the LCM:</p>

\\[\\text{lcm}(a, b) = \\frac{a \\times b}{\\gcd(a, b)}.\\]

<p>Since the GCD can be computed efficiently using the Euclidean algorithm (Chapter 7), this formula avoids the need for prime factorization entirely. In practice, this is almost always the preferred method for computing LCM.</p>

<div class="env-block example">
    <div class="env-title">Example: lcm(48, 180)</div>
    <div class="env-body">
        <p>Use the Euclidean algorithm for the GCD:</p>
        <ul>
            <li>\\(180 = 3 \\times 48 + 36\\)</li>
            <li>\\(48 = 1 \\times 36 + 12\\)</li>
            <li>\\(36 = 3 \\times 12 + 0\\)</li>
        </ul>
        <p>So \\(\\gcd(48, 180) = 12\\). Then:</p>
        \\[\\text{lcm}(48, 180) = \\frac{48 \\times 180}{12} = \\frac{8640}{12} = 720.\\]
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Avoiding Overflow</div>
    <div class="env-body">
        <p>When computing by hand or in a program, it is safer to divide <em>first</em>, then multiply:</p>
        \\[\\text{lcm}(a, b) = \\frac{a}{\\gcd(a, b)} \\times b.\\]
        <p>This avoids computing \\(a \\times b\\), which could overflow for large numbers.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-gcd-lcm-product"></div>
`,
            visualizations: [
                {
                    id: 'viz-gcd-lcm-product',
                    title: 'The GCD-LCM Product Identity',
                    description: 'Verify interactively that gcd(a,b) * lcm(a,b) = a * b. The two rectangles have the same area, illustrating why the identity holds. Change a and b to test.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 12;
                        var b = 18;

                        VizEngine.createSlider(controls, 'a', 2, 50, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 50, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(a, b);
                            var L = a / g * b;
                            var product = a * b;

                            viz.screenText('gcd(' + a + ', ' + b + ') \u00D7 lcm(' + a + ', ' + b + ') = a \u00D7 b', viz.width / 2, 22, viz.colors.white, 14);

                            // Draw two rectangles of equal area
                            var maxDim = Math.max(a, b, g, L);
                            var boxArea = 240 * 120; // target pixel area
                            var scale1 = Math.sqrt(boxArea / (a * b));
                            var scale2 = Math.sqrt(boxArea / (g * L));
                            var sc = Math.min(scale1, scale2, 240 / maxDim);

                            // Rectangle 1: a x b
                            var r1x = 70;
                            var r1y = 80;
                            var r1w = a * sc;
                            var r1h = b * sc;

                            ctx.fillStyle = viz.colors.blue + '33';
                            ctx.fillRect(r1x, r1y, r1w, r1h);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(r1x, r1y, r1w, r1h);

                            // Dimension labels
                            viz.screenText('a = ' + a, r1x + r1w / 2, r1y - 12, viz.colors.blue, 12);
                            ctx.save();
                            ctx.translate(r1x - 12, r1y + r1h / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('b = ' + b, 0, 0);
                            ctx.restore();

                            viz.screenText('Area = ' + product, r1x + r1w / 2, r1y + r1h + 18, viz.colors.white, 12);

                            // Rectangle 2: gcd x lcm
                            var r2x = 320;
                            var r2y = 80;
                            var r2w = g * sc;
                            var r2h = L * sc;

                            // Clamp height to fit
                            if (r2h > 240) {
                                var clampSc = 240 / L;
                                r2w = g * clampSc;
                                r2h = L * clampSc;
                            }

                            ctx.fillStyle = viz.colors.orange + '33';
                            ctx.fillRect(r2x, r2y, r2w, r2h);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(r2x, r2y, r2w, r2h);

                            viz.screenText('gcd = ' + g, r2x + r2w / 2, r2y - 12, viz.colors.orange, 12);
                            ctx.save();
                            ctx.translate(r2x - 12, r2y + r2h / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('lcm = ' + L, 0, 0);
                            ctx.restore();

                            viz.screenText('Area = ' + (g * L), r2x + r2w / 2, r2y + r2h + 18, viz.colors.white, 12);

                            // Equals sign
                            viz.screenText('=', (r1x + r1w + r2x) / 2, r1y + Math.max(r1h, r2h) / 2, viz.colors.white, 24);

                            // Verification
                            var verY = Math.max(r1y + r1h, r2y + r2h) + 45;
                            viz.screenText(g + ' \u00D7 ' + L + ' = ' + (g * L), viz.width / 2, verY, viz.colors.purple, 14);
                            viz.screenText(a + ' \u00D7 ' + b + ' = ' + product, viz.width / 2, verY + 22, viz.colors.purple, 14);
                            var match = (g * L === product);
                            viz.screenText(match ? '\u2713 Equal!' : '\u2717 Error', viz.width / 2, verY + 46, match ? viz.colors.green : viz.colors.red, 13);

                            // Shortcut formula
                            viz.screenText('lcm(' + a + ', ' + b + ') = ' + a + ' / ' + g + ' \u00D7 ' + b + ' = ' + L, viz.width / 2, verY + 72, viz.colors.teal, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the GCD-LCM formula to find \\(\\text{lcm}(36, 48)\\).',
                    hint: 'First find \\(\\gcd(36, 48)\\) using the Euclidean algorithm, then apply \\(\\text{lcm} = a \\times b / \\gcd\\).',
                    solution: '\\(48 = 1 \\times 36 + 12\\), \\(36 = 3 \\times 12 + 0\\). So \\(\\gcd(36, 48) = 12\\). Then \\(\\text{lcm}(36, 48) = 36 \\times 48 / 12 = 36/12 \\times 48 = 3 \\times 48 = 144\\).'
                },
                {
                    question: 'If \\(\\gcd(a, b) = 7\\) and \\(a \\times b = 2940\\), what is \\(\\text{lcm}(a, b)\\)?',
                    hint: 'Use \\(\\gcd \\times \\text{lcm} = a \\times b\\) directly.',
                    solution: '\\(\\text{lcm}(a, b) = \\frac{a \\times b}{\\gcd(a, b)} = \\frac{2940}{7} = 420\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead: From LCM to Modular Arithmetic</h2>

<div class="env-block intuition">
    <div class="env-title">Adding Fractions with LCD</div>
    <div class="env-body">
        <p>One of the most immediate applications of LCM is in adding fractions. To add \\(\\frac{5}{12} + \\frac{7}{18}\\), we need a common denominator. The <em>least</em> common denominator (LCD) is \\(\\text{lcm}(12, 18) = 36\\):</p>
        \\[\\frac{5}{12} + \\frac{7}{18} = \\frac{5 \\times 3}{36} + \\frac{7 \\times 2}{36} = \\frac{15 + 14}{36} = \\frac{29}{36}.\\]
        <p>Using the LCD instead of \\(12 \\times 18 = 216\\) keeps the numbers small and the result already in lowest terms (or close to it).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fraction-addition"></div>

<h3>Summary of Part C</h3>

<p>Chapters 6, 7, and 8 have built a complete toolkit for working with divisibility relationships between pairs of numbers:</p>

<ul>
    <li><strong>Chapter 6 (GCD):</strong> The greatest common divisor, finding the "shared structure" of two numbers.</li>
    <li><strong>Chapter 7 (Euclidean Algorithm):</strong> An efficient method for computing GCD, with deep theoretical implications.</li>
    <li><strong>Chapter 8 (LCM):</strong> The least common multiple, and its connection to GCD via \\(\\gcd \\times \\text{lcm} = a \\times b\\).</li>
</ul>

<h3>What Comes Next</h3>

<p>In Part D, we turn to <strong>modular arithmetic</strong>, the "clock math" of remainders. Instead of asking "does \\(a\\) divide \\(b\\)?", we ask "what is the remainder when \\(b\\) is divided by \\(a\\)?" This shift of perspective opens up a entirely new world of patterns, from calendar calculations to cryptography. The GCD and LCM will continue to play central roles.</p>

<div class="env-block remark">
    <div class="env-title">Preview: Remainders and LCM</div>
    <div class="env-body">
        <p>Here is a taste of what is coming. Consider: what numbers leave remainder 1 when divided by both 4 and 6? These are numbers of the form \\(4k + 1\\) and also \\(6j + 1\\). The first few are: 1, 13, 25, 37, ... They occur every \\(\\text{lcm}(4, 6) = 12\\) numbers. This connection between LCM and simultaneous remainders is the Chinese Remainder Theorem, one of the most beautiful results in number theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-fraction-addition',
                    title: 'Adding Fractions with LCD',
                    description: 'See how LCM helps add fractions efficiently. The LCD = lcm(denominator 1, denominator 2) gives the smallest common denominator. Change the fractions to explore.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var d1 = 4;
                        var d2 = 6;
                        var n1 = 1;
                        var n2 = 5;

                        VizEngine.createSlider(controls, 'denom 1', 2, 15, d1, 1, function(v) {
                            d1 = Math.round(v);
                            if (n1 >= d1) n1 = d1 - 1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'numer 1', 1, 14, n1, 1, function(v) {
                            n1 = Math.min(Math.round(v), d1 - 1);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'denom 2', 2, 15, d2, 1, function(v) {
                            d2 = Math.round(v);
                            if (n2 >= d2) n2 = d2 - 1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'numer 2', 1, 14, n2, 1, function(v) {
                            n2 = Math.min(Math.round(v), d2 - 1);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
                        function lcmVal(x, y) { return x / gcd(x, y) * y; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var lcd = lcmVal(d1, d2);
                            var mult1 = lcd / d1;
                            var mult2 = lcd / d2;
                            var newN1 = n1 * mult1;
                            var newN2 = n2 * mult2;
                            var sumN = newN1 + newN2;
                            var sumG = gcd(sumN, lcd);
                            var finalN = sumN / sumG;
                            var finalD = lcd / sumG;

                            viz.screenText('Adding Fractions with LCD', viz.width / 2, 22, viz.colors.white, 15);

                            // Show the equation
                            var eqY = 55;
                            var eqStr = n1 + '/' + d1 + ' + ' + n2 + '/' + d2;
                            viz.screenText(eqStr, viz.width / 2, eqY, viz.colors.white, 18);

                            // LCD
                            viz.screenText('LCD = lcm(' + d1 + ', ' + d2 + ') = ' + lcd, viz.width / 2, eqY + 30, viz.colors.green, 13);

                            // Conversion
                            var convY = eqY + 60;
                            viz.screenText('= ' + newN1 + '/' + lcd + ' + ' + newN2 + '/' + lcd, viz.width / 2, convY, viz.colors.teal, 16);
                            viz.screenText('(\u00D7' + mult1 + ')', viz.width / 2 - 100, convY + 20, viz.colors.text, 10);
                            viz.screenText('(\u00D7' + mult2 + ')', viz.width / 2 + 100, convY + 20, viz.colors.text, 10);

                            // Sum
                            viz.screenText('= ' + sumN + '/' + lcd, viz.width / 2, convY + 45, viz.colors.orange, 16);
                            if (sumG > 1) {
                                viz.screenText('= ' + finalN + '/' + finalD + '  (simplified)', viz.width / 2, convY + 70, viz.colors.purple, 14);
                            }

                            // Visual bar for fraction 1
                            var barY = convY + 105;
                            var barW = 400;
                            var barH = 22;
                            var barX = (viz.width - barW) / 2;

                            // Fraction 1 bar
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(barX, barY, barW, barH);
                            ctx.fillStyle = viz.colors.blue + '55';
                            ctx.fillRect(barX, barY, barW * n1 / d1, barH);
                            viz.screenText(n1 + '/' + d1, barX - 30, barY + barH / 2, viz.colors.blue, 11);

                            // Fraction 2 bar
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.strokeRect(barX, barY + barH + 6, barW, barH);
                            ctx.fillStyle = viz.colors.teal + '55';
                            ctx.fillRect(barX, barY + barH + 6, barW * n2 / d2, barH);
                            viz.screenText(n2 + '/' + d2, barX - 30, barY + barH + 6 + barH / 2, viz.colors.teal, 11);

                            // Sum bar
                            var sumFrac = n1 / d1 + n2 / d2;
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(barX, barY + 2 * (barH + 6), barW, barH);
                            ctx.fillStyle = viz.colors.orange + '55';
                            var fillW = Math.min(barW, barW * sumFrac);
                            ctx.fillRect(barX, barY + 2 * (barH + 6), fillW, barH);
                            viz.screenText('Sum', barX - 30, barY + 2 * (barH + 6) + barH / 2, viz.colors.orange, 11);

                            // Tick marks at LCD divisions
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 0.5;
                            for (var t = 1; t < lcd; t++) {
                                var tx = barX + barW * t / lcd;
                                for (var row = 0; row < 3; row++) {
                                    var ty = barY + row * (barH + 6);
                                    ctx.beginPath();
                                    ctx.moveTo(tx, ty);
                                    ctx.lineTo(tx, ty + barH);
                                    ctx.stroke();
                                }
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Add the fractions \\(\\frac{3}{8} + \\frac{5}{12}\\) using the LCD.',
                    hint: 'Find \\(\\text{lcm}(8, 12)\\) first, then convert both fractions.',
                    solution: '\\(\\text{lcm}(8, 12) = 24\\). So \\(\\frac{3}{8} = \\frac{9}{24}\\) and \\(\\frac{5}{12} = \\frac{10}{24}\\). Sum: \\(\\frac{9 + 10}{24} = \\frac{19}{24}\\).'
                },
                {
                    question: 'Find \\(\\text{lcm}(6, 10, 15)\\). (Hint: use the fact that \\(\\text{lcm}(a, b, c) = \\text{lcm}(\\text{lcm}(a, b), c)\\).)',
                    hint: 'First compute \\(\\text{lcm}(6, 10)\\), then compute the LCM of that result with 15.',
                    solution: '\\(\\text{lcm}(6, 10)\\): \\(\\gcd(6,10) = 2\\), so \\(\\text{lcm} = 60/2 = 30\\). Then \\(\\text{lcm}(30, 15)\\): \\(\\gcd(30,15) = 15\\), so \\(\\text{lcm} = 450/15 = 30\\). Therefore \\(\\text{lcm}(6, 10, 15) = 30\\).'
                }
            ]
        }
    ]
});
