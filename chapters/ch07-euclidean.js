window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: 'The Euclidean Algorithm',
    subtitle: "The world's oldest algorithm",
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Do We Need a Better Method?</h2>

<div class="env-block intuition">
    <div class="env-title">The Problem</div>
    <div class="env-body">
        <p>In the last chapter, we learned what the greatest common divisor (GCD) is: the largest number that divides both \\(a\\) and \\(b\\). We could find it by listing all divisors of both numbers and picking the largest one they share. But what if someone hands you the numbers 317,811 and 514,229? Listing all divisors of a six-digit number is not fun. We need a method that is fast, systematic, and works for numbers of any size.</p>
    </div>
</div>

<p>The brute-force approach to finding \\(\\gcd(a, b)\\) is simple: list every divisor of \\(a\\), list every divisor of \\(b\\), and find the largest number that appears in both lists. For small numbers, this works fine. But the number of divisors grows, and for large numbers the listing method becomes painfully slow.</p>

<p>Consider finding \\(\\gcd(48, 18)\\). The listing approach requires us to find all divisors of 48 (that is 1, 2, 3, 4, 6, 8, 12, 16, 24, 48) and all divisors of 18 (that is 1, 2, 3, 6, 9, 18), then compare: the common divisors are 1, 2, 3, 6, and the greatest is 6. Ten divisors checked for 48, six for 18. Not terrible.</p>

<p>Now try \\(\\gcd(10946, 6765)\\). The number 10,946 has divisors 1, 2, 13, 26, 421, 842, 5473, 10946. The number 6,765 has divisors 1, 3, 5, 11, 15, 33, 41, 55, 123, 205, 451, 615, 1353, 2255, 6765. After all that work, we find \\(\\gcd(10946, 6765) = 1\\). They are coprime. All that effort for the answer "1."</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The algorithm we are about to learn appears in Book VII of Euclid's <em>Elements</em>, written around 300 BCE. This makes it one of the oldest algorithms still in daily use, over 2,300 years old. Euclid described it for lengths of line segments (he did not have our modern notation for numbers), but the logic is identical.</p>
    </div>
</div>

<p>The Euclidean algorithm solves this problem elegantly. Instead of listing divisors, it uses repeated division to whittle the problem down. For \\(\\gcd(10946, 6765)\\), the Euclidean algorithm takes just 24 steps of simple division, each one shrinking the numbers until the answer pops out. For \\(\\gcd(48, 18)\\), it takes only 3 steps.</p>

<div class="viz-placeholder" data-viz="viz-gcd-calculator"></div>
`,
            visualizations: [
                {
                    id: 'viz-gcd-calculator',
                    title: 'Fast GCD Calculator',
                    description: 'Enter any two positive integers and instantly see their GCD computed by the Euclidean algorithm. Compare how many steps the algorithm needs versus how many divisors you would have to check by brute force.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 252;
                        var bVal = 105;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        var lblA = document.createElement('span');
                        lblA.textContent = 'a = ';
                        lblA.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpA = document.createElement('input');
                        inpA.type = 'number'; inpA.value = aVal; inpA.min = 1; inpA.max = 999999999;
                        inpA.style.cssText = 'width:100px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        var lblB = document.createElement('span');
                        lblB.textContent = 'b = ';
                        lblB.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpB = document.createElement('input');
                        inpB.type = 'number'; inpB.value = bVal; inpB.min = 1; inpB.max = 999999999;
                        inpB.style.cssText = 'width:100px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        inputDiv.appendChild(lblA);
                        inputDiv.appendChild(inpA);
                        inputDiv.appendChild(lblB);
                        inputDiv.appendChild(inpB);
                        controls.appendChild(inputDiv);

                        function computeGCD(a, b) {
                            var steps = [];
                            a = Math.abs(Math.floor(a));
                            b = Math.abs(Math.floor(b));
                            if (a === 0 && b === 0) return { gcd: 0, steps: [] };
                            if (a === 0) return { gcd: b, steps: [] };
                            if (b === 0) return { gcd: a, steps: [] };
                            while (b !== 0) {
                                var q = Math.floor(a / b);
                                var r = a % b;
                                steps.push({ a: a, b: b, q: q, r: r });
                                a = b;
                                b = r;
                            }
                            return { gcd: a, steps: steps };
                        }

                        function countDivisors(n) {
                            if (n <= 0) return 0;
                            var count = 0;
                            for (var i = 1; i <= n; i++) {
                                if (n % i === 0) count++;
                            }
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var a = parseInt(inpA.value) || 1;
                            var b = parseInt(inpB.value) || 1;
                            if (a < 1) a = 1;
                            if (b < 1) b = 1;

                            var result = computeGCD(a, b);

                            // Title
                            viz.screenText('gcd(' + a + ', ' + b + ') = ' + result.gcd, viz.width / 2, 25, viz.colors.white, 16);

                            // Steps table
                            var startY = 55;
                            var lineH = 22;
                            var maxShow = Math.min(result.steps.length, 12);

                            // Header
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Step', 40, startY);
                            ctx.fillText('a', 130, startY);
                            ctx.fillText('b', 220, startY);
                            ctx.fillText('q', 310, startY);
                            ctx.fillText('r = a mod b', 430, startY);

                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(20, startY + 8);
                            ctx.lineTo(540, startY + 8);
                            ctx.stroke();

                            ctx.font = '12px -apple-system,sans-serif';
                            for (var i = 0; i < maxShow; i++) {
                                var s = result.steps[i];
                                var y = startY + (i + 1) * lineH + 4;
                                var isLast = (i === result.steps.length - 1);

                                ctx.fillStyle = isLast ? viz.colors.green : viz.colors.white;
                                ctx.fillText((i + 1).toString(), 40, y);
                                ctx.fillText(s.a.toLocaleString(), 130, y);
                                ctx.fillText(s.b.toLocaleString(), 220, y);
                                ctx.fillText(s.q.toLocaleString(), 310, y);

                                ctx.fillStyle = isLast ? viz.colors.green : (s.r === 0 ? viz.colors.green : viz.colors.orange);
                                ctx.fillText(s.r.toLocaleString(), 430, y);
                            }

                            if (result.steps.length > maxShow) {
                                var yExtra = startY + (maxShow + 1) * lineH + 4;
                                ctx.fillStyle = viz.colors.muted;
                                ctx.fillText('... (' + (result.steps.length - maxShow) + ' more steps)', viz.width / 2, yExtra);
                            }

                            // Summary at bottom
                            var summaryY = viz.height - 50;
                            viz.screenText('Euclidean algorithm: ' + result.steps.length + ' steps', viz.width / 2, summaryY, viz.colors.teal, 13);

                            // Only compute brute force comparison for manageable numbers
                            if (a <= 100000 && b <= 100000) {
                                var dA = countDivisors(a);
                                var dB = countDivisors(b);
                                viz.screenText('Brute force: check ' + dA + ' + ' + dB + ' = ' + (dA + dB) + ' divisors', viz.width / 2, summaryY + 20, viz.colors.orange, 12);
                            } else {
                                viz.screenText('(Numbers too large for brute-force comparison)', viz.width / 2, summaryY + 20, viz.colors.muted, 11);
                            }

                            viz.screenText('Result: gcd = ' + result.gcd, viz.width / 2, summaryY + 40, viz.colors.green, 14);
                        }

                        inpA.addEventListener('input', draw);
                        inpB.addEventListener('input', draw);
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: The Big Idea
        // ================================================================
        {
            id: 'sec-idea',
            title: 'The Big Idea',
            content: `
<h2>The Big Idea</h2>

<div class="env-block intuition">
    <div class="env-title">One Key Observation</div>
    <div class="env-body">
        <p>Here is the heart of the Euclidean algorithm, the single idea that makes everything work:</p>
        <p style="text-align:center; font-size:1.15em; margin:12px 0;"><strong>If \\(a = bq + r\\), then \\(\\gcd(a, b) = \\gcd(b, r)\\).</strong></p>
        <p>In words: the GCD of two numbers does not change when you replace the larger number by its remainder after dividing by the smaller one. This means we can keep replacing, making the numbers smaller and smaller, until the remainder is zero. At that point, the last nonzero remainder is the GCD.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.1 (The GCD Reduction)</div>
    <div class="env-body">
        <p>For any integers \\(a\\) and \\(b\\) with \\(b > 0\\), let \\(r = a \\bmod b\\) (the remainder when \\(a\\) is divided by \\(b\\)). Then</p>
        \\[\\gcd(a, b) = \\gcd(b, r).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Write \\(a = bq + r\\) where \\(0 \\leq r < b\\). We show that every common divisor of \\(a\\) and \\(b\\) is also a common divisor of \\(b\\) and \\(r\\), and vice versa.</p>
        <p><strong>Forward:</strong> If \\(d \\mid a\\) and \\(d \\mid b\\), then \\(d \\mid (a - bq) = r\\). So \\(d\\) divides both \\(b\\) and \\(r\\).</p>
        <p><strong>Backward:</strong> If \\(d \\mid b\\) and \\(d \\mid r\\), then \\(d \\mid (bq + r) = a\\). So \\(d\\) divides both \\(a\\) and \\(b\\).</p>
        <p>Since the set of common divisors is identical, the <em>greatest</em> common divisor is the same.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<h3>Why Does It Terminate?</h3>

<p>Each time we apply the reduction, the second number in the pair gets replaced by a remainder, and the remainder is strictly smaller than the divisor: \\(0 \\leq r < b\\). So the sequence of second numbers is strictly decreasing:</p>

\\[b > r_1 > r_2 > r_3 > \\cdots \\geq 0.\\]

<p>A strictly decreasing sequence of non-negative integers must eventually reach 0. When it does, the algorithm stops.</p>

<div class="env-block definition">
    <div class="env-title">Definition (The Euclidean Algorithm)</div>
    <div class="env-body">
        <p>To compute \\(\\gcd(a, b)\\) with \\(a \\geq b > 0\\):</p>
        <ol>
            <li>Divide \\(a\\) by \\(b\\): write \\(a = bq + r\\) with \\(0 \\leq r < b\\).</li>
            <li>If \\(r = 0\\), then \\(\\gcd(a, b) = b\\). Stop.</li>
            <li>Otherwise, replace \\((a, b)\\) with \\((b, r)\\) and go to step 1.</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\gcd(270, 192)\\)</div>
    <div class="env-body">
        <p>\\(270 = 192 \\times 1 + 78\\), so \\(\\gcd(270, 192) = \\gcd(192, 78)\\).</p>
        <p>\\(192 = 78 \\times 2 + 36\\), so \\(\\gcd(192, 78) = \\gcd(78, 36)\\).</p>
        <p>\\(78 = 36 \\times 2 + 6\\), so \\(\\gcd(78, 36) = \\gcd(36, 6)\\).</p>
        <p>\\(36 = 6 \\times 6 + 0\\), so \\(\\gcd(36, 6) = 6\\).</p>
        <p>Therefore \\(\\gcd(270, 192) = 6\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euclidean-animated"></div>
`,
            visualizations: [
                {
                    id: 'viz-euclidean-animated',
                    title: 'The Euclidean Algorithm: Step by Step',
                    description: 'Watch the Euclidean algorithm work on any pair of numbers. Each step replaces (a, b) with (b, a mod b), shown with the full division. Press Play to animate, or Step to advance one step at a time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 270;
                        var bVal = 192;
                        var steps = [];
                        var currentStep = 0;
                        var animating = false;
                        var animTimer = null;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        var lblA = document.createElement('span');
                        lblA.textContent = 'a = ';
                        lblA.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpA = document.createElement('input');
                        inpA.type = 'number'; inpA.value = aVal; inpA.min = 1; inpA.max = 999999;
                        inpA.style.cssText = 'width:90px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        var lblB = document.createElement('span');
                        lblB.textContent = 'b = ';
                        lblB.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpB = document.createElement('input');
                        inpB.type = 'number'; inpB.value = bVal; inpB.min = 1; inpB.max = 999999;
                        inpB.style.cssText = 'width:90px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        inputDiv.appendChild(lblA);
                        inputDiv.appendChild(inpA);
                        inputDiv.appendChild(lblB);
                        inputDiv.appendChild(inpB);
                        controls.appendChild(inputDiv);

                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;margin-top:4px;';
                        controls.appendChild(btnDiv);

                        function compute() {
                            var a = Math.abs(Math.floor(parseInt(inpA.value) || 1));
                            var b = Math.abs(Math.floor(parseInt(inpB.value) || 1));
                            if (a < b) { var t = a; a = b; b = t; }
                            steps = [];
                            var aa = a, bb = b;
                            while (bb !== 0) {
                                var q = Math.floor(aa / bb);
                                var r = aa % bb;
                                steps.push({ a: aa, b: bb, q: q, r: r });
                                aa = bb;
                                bb = r;
                            }
                            steps.push({ a: aa, b: 0, q: 0, r: 0, final: true, gcd: aa });
                            currentStep = 0;
                        }

                        var playBtn = VizEngine.createButton(btnDiv, 'Play', function() {
                            if (animating) {
                                animating = false;
                                clearInterval(animTimer);
                                playBtn.textContent = 'Play';
                                return;
                            }
                            if (currentStep >= steps.length - 1) {
                                currentStep = 0;
                            }
                            animating = true;
                            playBtn.textContent = 'Pause';
                            animTimer = setInterval(function() {
                                if (currentStep >= steps.length - 1) {
                                    animating = false;
                                    clearInterval(animTimer);
                                    playBtn.textContent = 'Play';
                                    draw();
                                    return;
                                }
                                currentStep++;
                                draw();
                            }, 900);
                        });

                        VizEngine.createButton(btnDiv, 'Step', function() {
                            if (animating) return;
                            if (currentStep < steps.length - 1) currentStep++;
                            else currentStep = 0;
                            draw();
                        });

                        VizEngine.createButton(btnDiv, 'Reset', function() {
                            animating = false;
                            clearInterval(animTimer);
                            playBtn.textContent = 'Play';
                            compute();
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (steps.length === 0) {
                                viz.screenText('Press Reset to start', viz.width / 2, viz.height / 2, viz.colors.muted, 14);
                                return;
                            }

                            var a0 = steps[0].a;
                            var b0 = steps[0].b;
                            viz.screenText('Euclidean Algorithm: gcd(' + a0 + ', ' + b0 + ')', viz.width / 2, 20, viz.colors.white, 15);

                            var startY = 50;
                            var lineH = 28;
                            var maxShow = Math.min(steps.length, 12);

                            // Show all steps up to current
                            var showUpTo = Math.min(currentStep, maxShow - 1);

                            for (var i = 0; i <= showUpTo && i < steps.length; i++) {
                                var s = steps[i];
                                var y = startY + i * lineH;
                                var isCurrent = (i === currentStep);

                                if (s.final) {
                                    // Final result
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('gcd = ' + s.gcd, 40, y + 4);

                                    // Draw a box around result
                                    ctx.strokeStyle = viz.colors.green + '66';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.roundRect(30, y - 10, 120, 28, 6);
                                    ctx.stroke();
                                } else {
                                    // Highlight current step
                                    if (isCurrent) {
                                        ctx.fillStyle = viz.colors.blue + '18';
                                        ctx.fillRect(20, y - 10, viz.width - 40, lineH);
                                    }

                                    // Step number
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillStyle = isCurrent ? viz.colors.blue : viz.colors.muted;
                                    ctx.fillText((i + 1) + '.', 35, y + 4);

                                    // Division equation: a = b x q + r
                                    ctx.font = isCurrent ? 'bold 13px -apple-system,sans-serif' : '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';

                                    var x = 45;
                                    ctx.fillStyle = isCurrent ? viz.colors.white : viz.colors.text;
                                    ctx.fillText(s.a.toLocaleString(), x, y + 4);

                                    x += ctx.measureText(s.a.toLocaleString()).width + 6;
                                    ctx.fillStyle = viz.colors.muted;
                                    ctx.fillText('=', x, y + 4);

                                    x += 16;
                                    ctx.fillStyle = isCurrent ? viz.colors.teal : viz.colors.text;
                                    ctx.fillText(s.b.toLocaleString(), x, y + 4);

                                    x += ctx.measureText(s.b.toLocaleString()).width + 4;
                                    ctx.fillStyle = viz.colors.muted;
                                    ctx.fillText('\u00D7', x, y + 4);

                                    x += 14;
                                    ctx.fillStyle = viz.colors.purple;
                                    ctx.fillText(s.q.toLocaleString(), x, y + 4);

                                    x += ctx.measureText(s.q.toLocaleString()).width + 6;
                                    ctx.fillStyle = viz.colors.muted;
                                    ctx.fillText('+', x, y + 4);

                                    x += 14;
                                    ctx.fillStyle = s.r === 0 ? viz.colors.green : viz.colors.orange;
                                    ctx.font = isCurrent ? 'bold 13px -apple-system,sans-serif' : '13px -apple-system,sans-serif';
                                    ctx.fillText(s.r.toLocaleString(), x, y + 4);

                                    // Arrow showing the replacement
                                    if (s.r > 0) {
                                        var arrowX = viz.width - 160;
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.fillStyle = viz.colors.muted;
                                        ctx.textAlign = 'left';
                                        ctx.fillText('\u2192 gcd(' + s.b + ', ' + s.r + ')', arrowX, y + 4);
                                    } else {
                                        var arrowX2 = viz.width - 160;
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.textAlign = 'left';
                                        ctx.fillText('\u2192 remainder 0, done!', arrowX2, y + 4);
                                    }
                                }
                            }

                            // Progress bar at bottom
                            var barY = viz.height - 40;
                            var barW = viz.width - 80;
                            var barH = 8;
                            var barX = 40;

                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(barX, barY, barW, barH);

                            var progress = steps.length > 1 ? currentStep / (steps.length - 1) : 1;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(barX, barY, barW * progress, barH);

                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Step ' + (currentStep + 1) + ' of ' + steps.length, viz.width / 2, barY + 22);
                        }

                        inpA.addEventListener('change', function() { compute(); draw(); });
                        inpB.addEventListener('change', function() { compute(); draw(); });
                        compute();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the key property \\(\\gcd(a, b) = \\gcd(b, a \\bmod b)\\) to explain why \\(\\gcd(100, 0) = 100\\).',
                    hint: 'What does it mean for a number to divide 0? Every integer divides 0.',
                    solution: 'Every integer divides 0 (since \\(0 = d \\times 0\\) for any \\(d\\)). So the common divisors of 100 and 0 are exactly the divisors of 100, and the greatest among them is 100 itself. Alternatively, \\(\\gcd(100, 0) = 100\\) because the algorithm stops when the second number is 0, returning the first.'
                },
                {
                    question: 'Prove that \\(\\gcd(a, b) = \\gcd(a - b, b)\\) for \\(a > b > 0\\). How is this related to the Euclidean algorithm?',
                    hint: 'The proof is almost the same as for the mod version. Note that \\(a \\bmod b\\) is what you get after subtracting \\(b\\) from \\(a\\) repeatedly.',
                    solution: 'If \\(d \\mid a\\) and \\(d \\mid b\\), then \\(d \\mid (a - b)\\). Conversely, if \\(d \\mid (a - b)\\) and \\(d \\mid b\\), then \\(d \\mid ((a - b) + b) = a\\). So the common divisors are the same, hence the GCD is the same. The mod operation \\(a \\bmod b\\) is equivalent to subtracting \\(b\\) from \\(a\\) repeatedly until the result is less than \\(b\\). So the Euclidean algorithm is just the subtraction version done more efficiently, by subtracting \\(b\\) many times at once (i.e., using division instead of repeated subtraction).'
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

<p>Let us work through several examples of the Euclidean algorithm, starting simple and building up to larger numbers.</p>

<div class="env-block example">
    <div class="env-title">Example 1: \\(\\gcd(48, 18)\\)</div>
    <div class="env-body">
        <p>\\(48 = 18 \\times 2 + 12\\), so \\(\\gcd(48, 18) = \\gcd(18, 12)\\).</p>
        <p>\\(18 = 12 \\times 1 + 6\\), so \\(\\gcd(18, 12) = \\gcd(12, 6)\\).</p>
        <p>\\(12 = 6 \\times 2 + 0\\), so \\(\\gcd(12, 6) = 6\\).</p>
        <p><strong>Answer: \\(\\gcd(48, 18) = 6\\).</strong> Three steps.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 2: \\(\\gcd(1071, 462)\\)</div>
    <div class="env-body">
        <p>\\(1071 = 462 \\times 2 + 147\\)</p>
        <p>\\(462 = 147 \\times 3 + 21\\)</p>
        <p>\\(147 = 21 \\times 7 + 0\\)</p>
        <p><strong>Answer: \\(\\gcd(1071, 462) = 21\\).</strong> Three steps again!</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 3: \\(\\gcd(17711, 10946)\\)</div>
    <div class="env-body">
        <p>These are consecutive Fibonacci numbers. Watch how slowly the remainders decrease:</p>
        <p>\\(17711 = 10946 \\times 1 + 6765\\)</p>
        <p>\\(10946 = 6765 \\times 1 + 4181\\)</p>
        <p>\\(6765 = 4181 \\times 1 + 2584\\)</p>
        <p>\\(4181 = 2584 \\times 1 + 1597\\)</p>
        <p>\\(2584 = 1597 \\times 1 + 987\\)</p>
        <p>\\(1597 = 987 \\times 1 + 610\\)</p>
        <p>\\(987 = 610 \\times 1 + 377\\)</p>
        <p>\\(\\ldots\\) (continues for many more steps)</p>
        <p><strong>Answer: \\(\\gcd(17711, 10946) = 1\\).</strong> They are coprime, but it took 20 steps!</p>
        <p>Every quotient is 1, which means the remainder decreases as slowly as possible. We will see in Section 5 why Fibonacci numbers are the worst case.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example 4: \\(\\gcd(123456, 7890)\\)</div>
    <div class="env-body">
        <p>\\(123456 = 7890 \\times 15 + 5106\\)</p>
        <p>\\(7890 = 5106 \\times 1 + 2784\\)</p>
        <p>\\(5106 = 2784 \\times 1 + 2322\\)</p>
        <p>\\(2784 = 2322 \\times 1 + 462\\)</p>
        <p>\\(2322 = 462 \\times 5 + 12\\)</p>
        <p>\\(462 = 12 \\times 38 + 6\\)</p>
        <p>\\(12 = 6 \\times 2 + 0\\)</p>
        <p><strong>Answer: \\(\\gcd(123456, 7890) = 6\\).</strong> Seven steps for a six-digit number!</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Pattern to Notice</div>
    <div class="env-body">
        <p>Large quotients are your friend: they make the remainder drop fast. In Example 4, the first quotient of 15 immediately cut the problem from six-digit numbers down to four digits. Large quotients mean rapid progress.</p>
        <p>Small quotients (especially 1) are the enemy. When every quotient is 1, as with Fibonacci numbers, the algorithm takes the maximum number of steps.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euclidean-practice"></div>
`,
            visualizations: [
                {
                    id: 'viz-euclidean-practice',
                    title: 'Practice the Euclidean Algorithm',
                    description: 'Given two numbers, try to predict each step of the algorithm yourself. Enter your guess for the quotient and remainder, then check your answer before moving to the next step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var problems = [
                            [84, 36], [252, 105], [1001, 77], [3456, 789], [10946, 6765]
                        ];
                        var probIdx = 0;
                        var allSteps = [];
                        var userStep = 0;
                        var feedback = '';
                        var feedbackColor = '';

                        function computeSteps(a, b) {
                            if (a < b) { var t = a; a = b; b = t; }
                            var result = [];
                            while (b !== 0) {
                                var q = Math.floor(a / b);
                                var r = a % b;
                                result.push({ a: a, b: b, q: q, r: r });
                                a = b;
                                b = r;
                            }
                            return result;
                        }

                        function loadProblem() {
                            var p = problems[probIdx];
                            allSteps = computeSteps(p[0], p[1]);
                            userStep = 0;
                            feedback = '';
                            inpQ.value = '';
                            inpR.value = '';
                            draw();
                        }

                        // Controls
                        var row1 = document.createElement('div');
                        row1.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        VizEngine.createButton(row1, 'New Problem', function() {
                            probIdx = (probIdx + 1) % problems.length;
                            loadProblem();
                        });

                        var lblQ = document.createElement('span');
                        lblQ.textContent = 'Your q = ';
                        lblQ.style.cssText = 'color:#c9d1d9;font-size:0.85rem;margin-left:12px;';
                        var inpQ = document.createElement('input');
                        inpQ.type = 'number'; inpQ.style.cssText = 'width:60px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        var lblR = document.createElement('span');
                        lblR.textContent = 'r = ';
                        lblR.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpR = document.createElement('input');
                        inpR.type = 'number'; inpR.style.cssText = 'width:60px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        row1.appendChild(lblQ); row1.appendChild(inpQ);
                        row1.appendChild(lblR); row1.appendChild(inpR);

                        VizEngine.createButton(row1, 'Check', function() {
                            if (userStep >= allSteps.length) return;
                            var s = allSteps[userStep];
                            var uq = parseInt(inpQ.value);
                            var ur = parseInt(inpR.value);
                            if (uq === s.q && ur === s.r) {
                                feedback = 'Correct!';
                                feedbackColor = viz.colors.green;
                                userStep++;
                                inpQ.value = '';
                                inpR.value = '';
                            } else {
                                feedback = 'Not quite. ' + s.a + ' = ' + s.b + ' \u00D7 ' + s.q + ' + ' + s.r;
                                feedbackColor = viz.colors.red;
                            }
                            draw();
                        });

                        controls.appendChild(row1);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (allSteps.length === 0) return;

                            var a0 = allSteps[0].a;
                            var b0 = allSteps[0].b;
                            viz.screenText('Find gcd(' + a0 + ', ' + b0 + ')', viz.width / 2, 22, viz.colors.white, 16);

                            // Show completed steps
                            var startY = 55;
                            var lineH = 26;

                            for (var i = 0; i < userStep && i < allSteps.length; i++) {
                                var s = allSteps[i];
                                var y = startY + i * lineH;

                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText((i + 1) + '. ' + s.a + ' = ' + s.b + ' \u00D7 ' + s.q + ' + ' + s.r, 40, y);

                                ctx.fillStyle = viz.colors.muted;
                                ctx.textAlign = 'right';
                                ctx.fillText('gcd(' + s.b + ', ' + s.r + ')', viz.width - 40, y);
                            }

                            // Current step prompt
                            if (userStep < allSteps.length) {
                                var s = allSteps[userStep];
                                var y = startY + userStep * lineH;

                                ctx.fillStyle = viz.colors.blue + '18';
                                ctx.fillRect(20, y - 10, viz.width - 40, lineH);

                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText((userStep + 1) + '. ' + s.a + ' = ' + s.b + ' \u00D7 q + r     (find q and r)', 40, y);
                            } else {
                                // Done
                                var y = startY + userStep * lineH + 10;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = viz.colors.green;
                                var lastGCD = allSteps[allSteps.length - 1].b === 0 ? allSteps[allSteps.length - 1].a : allSteps[allSteps.length - 1].b;
                                if (allSteps.length > 0) {
                                    lastGCD = allSteps[allSteps.length - 1].b;
                                    if (lastGCD === 0) lastGCD = allSteps[allSteps.length - 1].a;
                                    // Actually, the gcd is the last nonzero b
                                    for (var j = allSteps.length - 1; j >= 0; j--) {
                                        if (allSteps[j].r === 0) { lastGCD = allSteps[j].b; break; }
                                    }
                                }
                                ctx.fillText('Done! gcd(' + a0 + ', ' + b0 + ') = ' + lastGCD, viz.width / 2, y);
                            }

                            // Feedback
                            if (feedback) {
                                viz.screenText(feedback, viz.width / 2, viz.height - 30, feedbackColor, 14);
                            }

                            // Problem number
                            viz.screenText('Problem ' + (probIdx + 1) + ' of ' + problems.length, viz.width / 2, viz.height - 10, viz.colors.muted, 10);
                        }

                        loadProblem();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Euclidean algorithm to find \\(\\gcd(546, 210)\\).',
                    hint: 'Start by dividing 546 by 210. What is the quotient and remainder?',
                    solution: '\\(546 = 210 \\times 2 + 126\\). Then \\(210 = 126 \\times 1 + 84\\). Then \\(126 = 84 \\times 1 + 42\\). Then \\(84 = 42 \\times 2 + 0\\). So \\(\\gcd(546, 210) = 42\\).'
                },
                {
                    question: 'Find \\(\\gcd(1001, 385)\\).',
                    hint: '\\(1001 \\div 385 = 2\\) with some remainder. Keep going from there.',
                    solution: '\\(1001 = 385 \\times 2 + 231\\). Then \\(385 = 231 \\times 1 + 154\\). Then \\(231 = 154 \\times 1 + 77\\). Then \\(154 = 77 \\times 2 + 0\\). So \\(\\gcd(1001, 385) = 77\\).'
                },
                {
                    question: 'Show that \\(\\gcd(4181, 2584) = 1\\) using the Euclidean algorithm. How many steps does it take? (These are consecutive Fibonacci numbers.)',
                    hint: 'Every quotient will be 1. Keep going until the remainder is 0.',
                    solution: 'Since these are consecutive Fibonacci numbers, every step has quotient 1: \\(4181 = 2584 \\times 1 + 1597\\), \\(2584 = 1597 \\times 1 + 987\\), \\(1597 = 987 \\times 1 + 610\\), \\(987 = 610 \\times 1 + 377\\), \\(610 = 377 \\times 1 + 233\\), \\(377 = 233 \\times 1 + 144\\), \\(233 = 144 \\times 1 + 89\\), \\(144 = 89 \\times 1 + 55\\), \\(89 = 55 \\times 1 + 34\\), \\(55 = 34 \\times 1 + 21\\), \\(34 = 21 \\times 1 + 13\\), \\(21 = 13 \\times 1 + 8\\), \\(13 = 8 \\times 1 + 5\\), \\(8 = 5 \\times 1 + 3\\), \\(5 = 3 \\times 1 + 2\\), \\(3 = 2 \\times 1 + 1\\), \\(2 = 1 \\times 2 + 0\\). So \\(\\gcd = 1\\) after 17 steps.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: The Visual Proof
        // ================================================================
        {
            id: 'sec-visual',
            title: 'The Visual Proof',
            content: `
<h2>The Visual Proof</h2>

<div class="env-block intuition">
    <div class="env-title">Rectangles and Squares</div>
    <div class="env-body">
        <p>There is a beautiful geometric way to see why the Euclidean algorithm works. Imagine a rectangle with width \\(a\\) and height \\(b\\). The GCD \\(\\gcd(a, b)\\) is the side length of the largest square that can tile this rectangle perfectly (with no leftover space).</p>
        <p>The Euclidean algorithm corresponds to repeatedly cutting off the largest possible squares from the rectangle. Each cut leaves a smaller rectangle, and the process continues until you are left with a perfect square. That square's side length is the GCD.</p>
    </div>
</div>

<p>Here is the connection made precise. Start with an \\(a \\times b\\) rectangle (assume \\(a \\geq b\\)).</p>

<ol>
    <li>We can fit \\(q = \\lfloor a/b \\rfloor\\) squares of side \\(b\\) along the length \\(a\\), with a leftover strip of width \\(r = a - bq = a \\bmod b\\).</li>
    <li>The leftover strip is a \\(b \\times r\\) rectangle. This is exactly the subproblem \\(\\gcd(b, r)\\)!</li>
    <li>We now cut squares of side \\(r\\) from the \\(b \\times r\\) rectangle, and so on.</li>
    <li>When the remainder is 0, the last square tiles the remaining rectangle perfectly. Its side length is the GCD.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: 48 \\(\\times\\) 18 Rectangle</div>
    <div class="env-body">
        <p>Start with a \\(48 \\times 18\\) rectangle.</p>
        <p><strong>Step 1:</strong> Cut off \\(2\\) squares of side \\(18\\). Leftover: \\(12 \\times 18\\) rectangle.</p>
        <p><strong>Step 2:</strong> Cut off \\(1\\) square of side \\(12\\). Leftover: \\(12 \\times 6\\) rectangle.</p>
        <p><strong>Step 3:</strong> Cut off \\(2\\) squares of side \\(6\\). Leftover: nothing! The \\(6 \\times 6\\) squares tile perfectly.</p>
        <p>The GCD is 6, the side of the final squares.</p>
    </div>
</div>

<p>This geometric view also explains <em>why</em> \\(\\gcd(a, b) = \\gcd(b, r)\\). Any square that tiles the \\(a \\times b\\) rectangle must also tile the \\(b \\times r\\) leftover strip (since it tiles the \\(b \\times b\\) squares we cut off, and it tiles the whole rectangle, so it must tile what remains). The argument works in reverse too: any square tiling the leftover also tiles the whole rectangle.</p>

<div class="viz-placeholder" data-viz="viz-rectangle-euclidean"></div>
`,
            visualizations: [
                {
                    id: 'viz-rectangle-euclidean',
                    title: 'Rectangle Cutting = Euclidean Algorithm',
                    description: 'Watch the Euclidean algorithm as a process of cutting squares from a rectangle. Each color corresponds to one step of the algorithm. The side length of the final squares is the GCD. Press Play to animate.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 48;
                        var bVal = 18;
                        var animStep = -1;
                        var animating = false;
                        var animTimer = null;
                        var cuts = [];

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        var lblA = document.createElement('span');
                        lblA.textContent = 'Width = ';
                        lblA.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpA = document.createElement('input');
                        inpA.type = 'number'; inpA.value = aVal; inpA.min = 1; inpA.max = 500;
                        inpA.style.cssText = 'width:70px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        var lblB = document.createElement('span');
                        lblB.textContent = 'Height = ';
                        lblB.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        var inpB = document.createElement('input');
                        inpB.type = 'number'; inpB.value = bVal; inpB.min = 1; inpB.max = 500;
                        inpB.style.cssText = 'width:70px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        inputDiv.appendChild(lblA); inputDiv.appendChild(inpA);
                        inputDiv.appendChild(lblB); inputDiv.appendChild(inpB);
                        controls.appendChild(inputDiv);

                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;margin-top:4px;';
                        controls.appendChild(btnDiv);

                        var stepColors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950', '#f85149', '#d29922', '#f778ba'];

                        function computeCuts() {
                            var a = Math.abs(Math.floor(parseInt(inpA.value) || 1));
                            var b = Math.abs(Math.floor(parseInt(inpB.value) || 1));
                            if (a < 1) a = 1;
                            if (b < 1) b = 1;
                            cuts = [];
                            var x0 = 0, y0 = 0;
                            var w = a, h = b;
                            var stepIdx = 0;
                            var horizontal = (w >= h);

                            while (w > 0 && h > 0) {
                                if (w >= h) {
                                    var q = Math.floor(w / h);
                                    for (var i = 0; i < q; i++) {
                                        cuts.push({ x: x0 + i * h, y: y0, size: h, step: stepIdx });
                                    }
                                    x0 += q * h;
                                    w -= q * h;
                                } else {
                                    var q = Math.floor(h / w);
                                    for (var i = 0; i < q; i++) {
                                        cuts.push({ x: x0, y: y0 + i * w, size: w, step: stepIdx });
                                    }
                                    y0 += q * w;
                                    h -= q * w;
                                }
                                stepIdx++;
                                if (stepIdx > 50) break;
                            }
                        }

                        var playBtn = VizEngine.createButton(btnDiv, 'Play', function() {
                            if (animating) {
                                animating = false;
                                clearInterval(animTimer);
                                playBtn.textContent = 'Play';
                                return;
                            }
                            computeCuts();
                            animStep = -1;
                            animating = true;
                            playBtn.textContent = 'Pause';
                            animTimer = setInterval(function() {
                                animStep++;
                                if (animStep >= cuts.length) {
                                    animating = false;
                                    clearInterval(animTimer);
                                    playBtn.textContent = 'Play';
                                }
                                draw();
                            }, 400);
                        });

                        VizEngine.createButton(btnDiv, 'Show All', function() {
                            animating = false;
                            clearInterval(animTimer);
                            playBtn.textContent = 'Play';
                            computeCuts();
                            animStep = cuts.length;
                            draw();
                        });

                        VizEngine.createButton(btnDiv, 'Reset', function() {
                            animating = false;
                            clearInterval(animTimer);
                            playBtn.textContent = 'Play';
                            computeCuts();
                            animStep = -1;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var a = Math.abs(Math.floor(parseInt(inpA.value) || 1));
                            var b = Math.abs(Math.floor(parseInt(inpB.value) || 1));

                            // Compute scale to fit
                            var margin = 60;
                            var drawW = viz.width - 2 * margin;
                            var drawH = viz.height - 2 * margin - 30;
                            var sc = Math.min(drawW / a, drawH / b);
                            var offX = (viz.width - a * sc) / 2;
                            var offY = 35 + (drawH - b * sc) / 2;

                            // Title
                            var g = 1;
                            if (cuts.length > 0) {
                                g = cuts[cuts.length - 1].size;
                            }
                            viz.screenText(a + ' \u00D7 ' + b + ' rectangle, gcd = ' + g, viz.width / 2, 18, viz.colors.white, 14);

                            // Draw outer rectangle
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(offX, offY, a * sc, b * sc);

                            // Draw cuts up to animStep
                            var showN = animStep >= 0 ? Math.min(animStep + 1, cuts.length) : 0;
                            for (var i = 0; i < showN; i++) {
                                var c = cuts[i];
                                var col = stepColors[c.step % stepColors.length];
                                ctx.fillStyle = col + '44';
                                ctx.fillRect(offX + c.x * sc, offY + c.y * sc, c.size * sc, c.size * sc);
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(offX + c.x * sc, offY + c.y * sc, c.size * sc, c.size * sc);

                                // Label if squares are big enough
                                if (c.size * sc > 30) {
                                    ctx.font = Math.min(12, c.size * sc / 4) + 'px -apple-system,sans-serif';
                                    ctx.fillStyle = col;
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(c.size, offX + c.x * sc + c.size * sc / 2, offY + c.y * sc + c.size * sc / 2);
                                }
                            }

                            // Legend: steps
                            if (cuts.length > 0) {
                                var maxStep = cuts[cuts.length - 1].step;
                                var legY = viz.height - 20;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                for (var s = 0; s <= maxStep && s < 8; s++) {
                                    var lx = 20 + s * 70;
                                    ctx.fillStyle = stepColors[s % stepColors.length];
                                    ctx.fillRect(lx, legY - 5, 10, 10);
                                    ctx.fillText('Step ' + (s + 1), lx + 14, legY + 2);
                                }
                            }
                        }

                        inpA.addEventListener('change', function() { computeCuts(); animStep = -1; draw(); });
                        inpB.addEventListener('change', function() { computeCuts(); animStep = -1; draw(); });
                        computeCuts();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw the rectangle-cutting process for a \\(30 \\times 12\\) rectangle. How many squares are cut at each step, and what is the GCD?',
                    hint: 'First, how many 12-by-12 squares fit in a 30-by-12 rectangle? What is left over?',
                    solution: 'Step 1: Two \\(12 \\times 12\\) squares. Leftover: \\(6 \\times 12\\) rectangle. Step 2: Two \\(6 \\times 6\\) squares. Leftover: nothing. So \\(\\gcd(30, 12) = 6\\).'
                },
                {
                    question: 'If the final squares in the rectangle cutting have side length 1, what does that tell you about the original dimensions?',
                    hint: 'The GCD is the side length of the final squares.',
                    solution: 'If the final squares have side length 1, then \\(\\gcd(a, b) = 1\\), meaning the numbers \\(a\\) and \\(b\\) are coprime. No square larger than \\(1 \\times 1\\) can tile the rectangle.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Why It's Fast
        // ================================================================
        {
            id: 'sec-speed',
            title: "Why It's Fast",
            content: `
<h2>Why It's Fast</h2>

<div class="env-block intuition">
    <div class="env-title">Speed Matters</div>
    <div class="env-body">
        <p>We have seen that the Euclidean algorithm works. But <em>how fast</em> is it? If we give it two numbers with, say, 100 digits each, will it finish before the sun burns out? The answer is a resounding yes: the algorithm is remarkably fast, and we can prove it.</p>
    </div>
</div>

<h3>The Listing Method: Slow</h3>

<p>The brute-force method (listing all divisors) requires checking up to \\(\\min(a, b)\\) potential divisors. For \\(\\gcd(1000000, 999999)\\), that means testing nearly a million numbers. The answer turns out to be 1 (they are coprime), and you would not know that until you had checked every candidate.</p>

<h3>The Euclidean Algorithm: Fast</h3>

<p>In 1844, Gabriel Lame proved a remarkable result about the number of steps the Euclidean algorithm needs.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 7.2 (Lame's Theorem)</div>
    <div class="env-body">
        <p>The number of division steps in the Euclidean algorithm for \\(\\gcd(a, b)\\) with \\(a > b \\geq 1\\) is at most \\(5\\) times the number of digits of \\(b\\).</p>
        <p>More precisely, if the algorithm takes \\(n\\) steps, then \\(b \\geq F_{n+1}\\), where \\(F_k\\) denotes the \\(k\\)-th Fibonacci number.</p>
    </div>
</div>

<p>This means that for two numbers each having at most \\(d\\) digits, the algorithm takes at most \\(5d\\) steps. A 100-digit number? At most 500 steps of simple division. Compare that with checking up to \\(10^{100}\\) divisors by brute force!</p>

<h3>Why Fibonacci Numbers Are the Worst Case</h3>

<p>Consecutive Fibonacci numbers produce the maximum number of steps because every quotient is 1. When the quotient is 1, the remainder decreases as slowly as possible: \\(r = a - b\\), which is the previous Fibonacci number. No pair of numbers of a given size takes more steps than consecutive Fibonacci numbers.</p>

<div class="env-block example">
    <div class="env-title">Example: Worst Case vs. Best Case</div>
    <div class="env-body">
        <p><strong>Worst case:</strong> \\(\\gcd(89, 55)\\) (Fibonacci numbers). Every quotient is 1, giving 9 steps.</p>
        <p><strong>Best case:</strong> \\(\\gcd(90, 45)\\). Since \\(45 \\mid 90\\), this takes 1 step: \\(90 = 45 \\times 2 + 0\\).</p>
        <p>Both problems involve two-digit numbers, but the step counts differ by a factor of 9!</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">In Modern Computing</div>
    <div class="env-body">
        <p>The Euclidean algorithm is used billions of times every day, in everything from simplifying fractions to internet encryption (RSA). Its efficiency is not just a theoretical curiosity; it is a practical necessity. Modern variants (like the binary GCD algorithm) are even faster on computers, but the core idea goes back to Euclid.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-euclidean-race"></div>
<div class="viz-placeholder" data-viz="viz-fibonacci-worst-case"></div>
`,
            visualizations: [
                {
                    id: 'viz-euclidean-race',
                    title: 'Euclidean vs. Listing: Operation Count',
                    description: 'Compare the number of operations needed by the Euclidean algorithm versus the brute-force listing method. For large numbers, the difference is dramatic.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var testPairs = [
                            [48, 18, '48, 18'],
                            [252, 105, '252, 105'],
                            [1071, 462, '1071, 462'],
                            [10946, 6765, '10946, 6765'],
                            [46368, 28657, '46368, 28657'],
                            [123456, 7890, '123456, 7890'],
                            [999999, 999998, '999999, 999998']
                        ];

                        function euclideanSteps(a, b) {
                            var count = 0;
                            while (b !== 0) {
                                var r = a % b;
                                a = b; b = r;
                                count++;
                            }
                            return count;
                        }

                        function listingOps(a, b) {
                            return Math.min(a, b);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Euclidean Algorithm vs. Listing All Divisors', viz.width / 2, 20, viz.colors.white, 14);

                            var startY = 50;
                            var rowH = 42;
                            var labelW = 140;
                            var barArea = viz.width - labelW - 60;

                            // Header
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Numbers', 20, startY);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText('Euclidean', labelW + 10, startY);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Listing', labelW + 90, startY);

                            // Find max for bar scaling (use log scale)
                            var maxLog = 0;
                            for (var i = 0; i < testPairs.length; i++) {
                                var ops = listingOps(testPairs[i][0], testPairs[i][1]);
                                maxLog = Math.max(maxLog, Math.log10(Math.max(ops, 1)));
                            }
                            if (maxLog < 1) maxLog = 1;

                            for (var i = 0; i < testPairs.length; i++) {
                                var p = testPairs[i];
                                var y = startY + (i + 1) * rowH;

                                var eucSteps = euclideanSteps(p[0], p[1]);
                                var listOps = listingOps(p[0], p[1]);

                                // Label
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(p[2], 20, y);

                                // Euclidean bar
                                var eucBarW = Math.max(3, (Math.log10(Math.max(eucSteps, 1)) / maxLog) * (barArea / 2 - 10));
                                ctx.fillStyle = viz.colors.blue + 'cc';
                                ctx.fillRect(labelW + 10, y - 8, eucBarW, 12);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(eucSteps + ' steps', labelW + 12 + eucBarW + 4, y);

                                // Listing bar
                                var listBarW = Math.max(3, (Math.log10(Math.max(listOps, 1)) / maxLog) * (barArea / 2 - 10));
                                ctx.fillStyle = viz.colors.orange + 'cc';
                                ctx.fillRect(labelW + 10, y + 6, listBarW, 12);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(listOps.toLocaleString() + ' checks', labelW + 12 + listBarW + 4, y + 14);
                            }

                            viz.screenText('(log scale)', viz.width - 50, viz.height - 15, viz.colors.muted, 9);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-fibonacci-worst-case',
                    title: 'Fibonacci Numbers: The Worst Case',
                    description: 'Consecutive Fibonacci numbers maximize the number of steps in the Euclidean algorithm. Watch how every quotient is 1 and the remainders follow the Fibonacci sequence backwards.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        // Generate Fibonacci numbers
                        var fibs = [1, 1];
                        for (var i = 2; i < 30; i++) {
                            fibs.push(fibs[i - 1] + fibs[i - 2]);
                        }

                        var fibIdx = 10;
                        var animStep = -1;
                        var animating = false;
                        var animTimer = null;

                        VizEngine.createSlider(controls, 'Fibonacci index', 4, 20, fibIdx, 1, function(v) {
                            fibIdx = Math.round(v);
                            animStep = -1;
                            draw();
                        });

                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;margin-top:2px;';
                        controls.appendChild(btnDiv);

                        var playBtn = VizEngine.createButton(btnDiv, 'Animate', function() {
                            if (animating) {
                                animating = false;
                                clearInterval(animTimer);
                                playBtn.textContent = 'Animate';
                                return;
                            }
                            animStep = -1;
                            animating = true;
                            playBtn.textContent = 'Stop';
                            animTimer = setInterval(function() {
                                animStep++;
                                if (animStep >= fibIdx - 1) {
                                    animating = false;
                                    clearInterval(animTimer);
                                    playBtn.textContent = 'Animate';
                                }
                                draw();
                            }, 600);
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var a = fibs[fibIdx];
                            var b = fibs[fibIdx - 1];

                            viz.screenText('gcd(F_' + (fibIdx + 1) + ', F_' + fibIdx + ') = gcd(' + a + ', ' + b + ')', viz.width / 2, 20, viz.colors.white, 14);

                            // Show the Euclidean algorithm steps
                            var startY = 50;
                            var lineH = 22;

                            var showSteps = animStep >= 0 ? animStep + 1 : fibIdx - 1;
                            var maxShow = Math.min(showSteps, 14);

                            var aa = a, bb = b;
                            for (var i = 0; i < maxShow && bb > 0; i++) {
                                var q = Math.floor(aa / bb);
                                var r = aa % bb;
                                var y = startY + i * lineH;
                                var isCurrent = (animStep >= 0 && i === animStep);

                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.blue + '18';
                                    ctx.fillRect(15, y - 8, viz.width - 30, lineH);
                                }

                                ctx.font = (isCurrent ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';

                                // Step text
                                ctx.fillStyle = isCurrent ? viz.colors.white : viz.colors.text;
                                ctx.fillText((i + 1) + '.  ' + aa + ' = ' + bb + ' \u00D7 ' + q + ' + ' + r, 25, y + 4);

                                // Note that q is always 1 (except possibly the last step)
                                ctx.textAlign = 'right';
                                ctx.fillStyle = q === 1 ? viz.colors.orange : viz.colors.teal;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('q = ' + q, viz.width - 25, y + 4);

                                aa = bb;
                                bb = r;
                            }

                            // Final note
                            if (bb === 0 || (animStep >= 0 && animStep >= fibIdx - 2)) {
                                var fy = startY + maxShow * lineH + 10;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('gcd = 1  (coprime!)  |  ' + (fibIdx - 1) + ' steps', viz.width / 2, fy);
                            }

                            // Bottom info
                            var infoY = viz.height - 40;
                            viz.screenText('Every quotient is 1 (except the last), so the remainder', viz.width / 2, infoY, viz.colors.muted, 11);
                            viz.screenText('decreases as slowly as possible: F_n, F_{n-1}, F_{n-2}, ...', viz.width / 2, infoY + 16, viz.colors.muted, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many steps does the Euclidean algorithm take for \\(\\gcd(1000000, 1)\\)? What about \\(\\gcd(1000000, 999999)\\)?',
                    hint: 'For the first, what is \\(1000000 \\bmod 1\\)? For the second, what is \\(1000000 \\bmod 999999\\)?',
                    solution: 'For \\(\\gcd(1000000, 1)\\): \\(1000000 = 1 \\times 1000000 + 0\\), so the answer is 1 in just 1 step. For \\(\\gcd(1000000, 999999)\\): \\(1000000 = 999999 \\times 1 + 1\\), then \\(999999 = 1 \\times 999999 + 0\\), so the answer is 1 in 2 steps. Both are extremely fast, while brute force would check up to a million divisors!'
                },
                {
                    question: 'According to Lame\\'s theorem, what is the maximum number of steps the Euclidean algorithm can take for two numbers each having at most 4 digits (i.e., less than 10,000)?',
                    hint: 'Lame\\'s theorem says at most 5 times the number of digits of the smaller number.',
                    solution: 'At most \\(5 \\times 4 = 20\\) steps. In fact, the worst case for numbers under 10,000 is \\(\\gcd(6765, 4181) = 1\\) (consecutive Fibonacci numbers), which takes 17 steps, safely within the bound of 20.'
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
<h2>Looking Ahead</h2>

<div class="env-block intuition">
    <div class="env-title">What We've Learned</div>
    <div class="env-body">
        <p>The Euclidean algorithm gives us a fast, elegant method to compute the greatest common divisor of any two numbers. The key insight is simple but powerful: \\(\\gcd(a, b) = \\gcd(b, a \\bmod b)\\). By applying this reduction repeatedly, we shrink the problem until the answer appears.</p>
    </div>
</div>

<h3>Summary</h3>

<ul>
    <li>The <strong>GCD reduction property</strong> tells us that \\(\\gcd(a, b) = \\gcd(b, a \\bmod b)\\).</li>
    <li>The <strong>Euclidean algorithm</strong> applies this reduction repeatedly until the remainder is 0.</li>
    <li>Geometrically, the algorithm corresponds to <strong>cutting squares from a rectangle</strong>.</li>
    <li>The algorithm is <strong>fast</strong>: at most \\(5d\\) steps for \\(d\\)-digit numbers (Lame's theorem).</li>
    <li><strong>Fibonacci numbers</strong> are the worst case, because every quotient is 1.</li>
</ul>

<h3>Connection to the Least Common Multiple</h3>

<p>The GCD and the least common multiple (LCM) are closely related. In the next chapter, we will learn about the LCM and discover the beautiful identity:</p>

\\[\\gcd(a, b) \\times \\operatorname{lcm}(a, b) = a \\times b.\\]

<p>This means that once you can compute GCDs efficiently (which you now can!), you get LCMs for free.</p>

<h3>The Extended Euclidean Algorithm (Preview)</h3>

<p>There is an extended version of the Euclidean algorithm that does even more. Not only does it find \\(\\gcd(a, b)\\), but it also finds integers \\(x\\) and \\(y\\) such that</p>

\\[ax + by = \\gcd(a, b).\\]

<p>This is called <strong>Bezout's identity</strong>, and it is fundamental to modern cryptography (the RSA algorithm depends on it). We will meet it in a later chapter.</p>

<div class="env-block example">
    <div class="env-title">Preview: Bezout's Identity for 270 and 192</div>
    <div class="env-body">
        <p>We found that \\(\\gcd(270, 192) = 6\\). The extended algorithm can find \\(x\\) and \\(y\\) such that \\(270x + 192y = 6\\). Working backward through the steps:</p>
        <p>\\(6 = 78 - 36 \\times 2 = 78 - (192 - 78 \\times 2) \\times 2 = 78 \\times 5 - 192 \\times 2\\)</p>
        <p>\\(= (270 - 192) \\times 5 - 192 \\times 2 = 270 \\times 5 - 192 \\times 7\\)</p>
        <p>So \\(x = 5\\) and \\(y = -7\\) work: \\(270 \\times 5 + 192 \\times (-7) = 1350 - 1344 = 6\\). \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">2,300 Years and Counting</div>
    <div class="env-body">
        <p>The Euclidean algorithm is a testament to the enduring power of a good idea. Discovered in ancient Greece, formalized by Euclid around 300 BCE, analyzed by Lame in 1844, and used in computer science every day. Few algorithms can claim such a long and distinguished career. Every time your browser establishes a secure connection (HTTPS), the Euclidean algorithm is at work behind the scenes.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use the Euclidean algorithm to find \\(\\gcd(377, 233)\\). Verify that these are consecutive Fibonacci numbers and note how many steps the algorithm takes.',
                    hint: 'These are \\(F_{14} = 377\\) and \\(F_{13} = 233\\). Every quotient should be 1.',
                    solution: '\\(377 = 233 \\times 1 + 144\\), \\(233 = 144 \\times 1 + 89\\), \\(144 = 89 \\times 1 + 55\\), \\(89 = 55 \\times 1 + 34\\), \\(55 = 34 \\times 1 + 21\\), \\(34 = 21 \\times 1 + 13\\), \\(21 = 13 \\times 1 + 8\\), \\(13 = 8 \\times 1 + 5\\), \\(8 = 5 \\times 1 + 3\\), \\(5 = 3 \\times 1 + 2\\), \\(3 = 2 \\times 1 + 1\\), \\(2 = 1 \\times 2 + 0\\). So \\(\\gcd = 1\\) in 12 steps. Every quotient is 1 (except the last, which is 2), confirming the worst-case behavior.'
                },
                {
                    question: 'Find integers \\(x\\) and \\(y\\) such that \\(48x + 18y = 6\\). (Use the steps of the Euclidean algorithm for \\(\\gcd(48, 18) = 6\\) and work backward.)',
                    hint: 'From the Euclidean algorithm: \\(6 = 48 - 18 \\times 2\\) (from step: \\(48 = 18 \\times 2 + 12\\), then \\(18 = 12 \\times 1 + 6\\), so \\(6 = 18 - 12\\), and \\(12 = 48 - 18 \\times 2\\)).',
                    solution: 'From the algorithm: \\(6 = 18 - 12 \\times 1\\) and \\(12 = 48 - 18 \\times 2\\). Substituting: \\(6 = 18 - (48 - 18 \\times 2) = 18 \\times 3 - 48\\). So \\(x = -1\\) and \\(y = 3\\): \\(48(-1) + 18(3) = -48 + 54 = 6\\). \\(\\checkmark\\)'
                },
                {
                    question: 'If \\(\\gcd(a, b) = d\\), explain why \\(\\gcd(a/d, b/d) = 1\\).',
                    hint: 'If \\(a/d\\) and \\(b/d\\) shared a common factor \\(c > 1\\), what would that say about \\(a\\) and \\(b\\)?',
                    solution: 'Suppose \\(\\gcd(a/d, b/d) = c > 1\\). Then \\(c \\mid (a/d)\\) and \\(c \\mid (b/d)\\), which means \\(cd \\mid a\\) and \\(cd \\mid b\\). But \\(cd > d\\), contradicting \\(d = \\gcd(a, b)\\) being the greatest common divisor. Therefore \\(\\gcd(a/d, b/d) = 1\\).'
                }
            ]
        }
    ]
});
