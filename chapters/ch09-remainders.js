window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Remainders & Clock Math',
    subtitle: "What's left over when you divide",
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Remainders?',
            content: `
<h2>Why Remainders?</h2>

<div class="env-block intuition">
    <div class="env-title">Sharing Cookies</div>
    <div class="env-body">
        <p>You have 17 cookies and want to share them equally among 5 friends. Each friend gets 3 cookies, but there are 2 left over. That leftover, the <strong>remainder</strong>, is one of the most important ideas in all of number theory.</p>
        <p>We write: \\(17 = 5 \\times 3 + 2\\).</p>
    </div>
</div>

<p>Division of whole numbers almost never "comes out even." When you divide 17 by 5, you get 3 with 2 left over. When you divide 100 by 7, you get 14 with 2 left over. These remainders are not just scraps; they carry deep structure. Two numbers that leave the <em>same remainder</em> when divided by some number \\(n\\) behave identically in many mathematical situations.</p>

<p>Remainders answer questions that ordinary division cannot:</p>
<ul>
    <li><strong>What day of the week will it be 100 days from now?</strong> Days cycle with period 7, so we only need the remainder of 100 divided by 7.</li>
    <li><strong>Does this number end in 0 or 5?</strong> That is the same as asking: is its remainder upon division by 10 equal to 0 or 5?</li>
    <li><strong>Can we split 23 marbles into groups of 4 with none left over?</strong> Only if the remainder is 0.</li>
</ul>

<p>In this chapter we make the idea of "remainder" precise, learn to think of numbers on a clock face, and discover that numbers with the same remainder form families called <em>congruence classes</em>.</p>

<div class="env-block remark">
    <div class="env-title">A Preview</div>
    <div class="env-body">
        <p>Remainder arithmetic (also called <em>modular arithmetic</em>) was developed systematically by Carl Friedrich Gauss in his 1801 masterpiece <em>Disquisitiones Arithmeticae</em>, written when he was just 21 years old. It is the foundation of modern cryptography, computer science, and much of advanced number theory.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-division-remainder',
                    title: 'Division with Remainder',
                    description: 'Watch a divided by b: blocks are grouped, and the leftover blocks are the remainder. Drag the sliders to change a and b.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 17;
                        var b = 5;

                        VizEngine.createSlider(controls, 'a', 1, 40, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 1, 12, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var q = Math.floor(a / b);
                            var r = a - b * q;

                            viz.screenText('Division with Remainder', viz.width / 2, 22, viz.colors.white, 16);
                            viz.screenText(a + ' = ' + b + ' \u00D7 ' + q + ' + ' + r, viz.width / 2, 48, viz.colors.teal, 14);

                            // Draw blocks
                            var blockSize = Math.min(28, Math.max(12, (viz.width - 60) / Math.max(a, 1)));
                            var gap = 2;
                            var totalW = a * (blockSize + gap);
                            var startX = Math.max(20, (viz.width - totalW) / 2);
                            var baseY = 100;

                            // Grouped rows: each row has b blocks
                            var rowH = blockSize + gap + 4;
                            var currentBlock = 0;

                            for (var row = 0; row < q; row++) {
                                var ry = baseY + row * rowH;
                                // Group bracket
                                var x0 = startX;
                                var xEnd = startX + b * (blockSize + gap) - gap;

                                for (var col = 0; col < b; col++) {
                                    var bx = startX + col * (blockSize + gap);
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.fillRect(bx, ry, blockSize, blockSize);
                                    ctx.strokeStyle = viz.colors.bg;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(bx, ry, blockSize, blockSize);
                                    currentBlock++;
                                }

                                // Group label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('group ' + (row + 1), xEnd + 8, ry + blockSize / 2);
                            }

                            // Remainder blocks
                            if (r > 0) {
                                var remY = baseY + q * rowH;
                                for (var ri = 0; ri < r; ri++) {
                                    var rx = startX + ri * (blockSize + gap);
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillRect(rx, remY, blockSize, blockSize);
                                    ctx.strokeStyle = viz.colors.bg;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(rx, remY, blockSize, blockSize);
                                }

                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('remainder = ' + r, startX + r * (blockSize + gap) + 8, remY + blockSize / 2);
                            }

                            // Summary
                            var summaryY = Math.min(viz.height - 40, baseY + (q + 1) * rowH + 30);
                            viz.screenText('quotient q = ' + q, viz.width / 2 - 100, summaryY, viz.colors.blue, 13);
                            viz.screenText('remainder r = ' + r, viz.width / 2 + 100, summaryY, viz.colors.orange, 13);

                            // Legend
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(viz.width / 2 - 130, summaryY + 22, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Full groups of ' + b, viz.width / 2 - 114, summaryY + 32);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillRect(viz.width / 2 + 40, summaryY + 22, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Leftover', viz.width / 2 + 56, summaryY + 32);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the quotient and remainder when 47 is divided by 6. Write it in the form \\(a = bq + r\\).',
                    hint: 'What is the largest multiple of 6 that does not exceed 47?',
                    solution: '\\(47 = 6 \\times 7 + 5\\). The quotient is \\(q = 7\\) and the remainder is \\(r = 5\\).'
                },
                {
                    question: 'What is the remainder when 1000 is divided by 13?',
                    hint: 'Compute \\(13 \\times 76 = 988\\) and \\(13 \\times 77 = 1001\\). Which multiple is just below 1000?',
                    solution: '\\(1000 = 13 \\times 76 + 12\\). The remainder is 12.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Division Algorithm
        // ================================================================
        {
            id: 'sec-division-algorithm',
            title: 'Division with Remainder',
            content: `
<h2>Division with Remainder</h2>

<div class="env-block intuition">
    <div class="env-title">Why "Algorithm"?</div>
    <div class="env-body">
        <p>The word "algorithm" comes from the name of the Persian mathematician al-Khwarizmi (c. 780 -- 850). The "Division Algorithm" is not really an algorithm in the modern sense (a step-by-step procedure); it is a <strong>theorem</strong> that guarantees existence and uniqueness of the quotient and remainder. The name is traditional.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.1 (The Division Algorithm)</div>
    <div class="env-body">
        <p>Let \\(a\\) be any integer and \\(b\\) a positive integer. Then there exist <strong>unique</strong> integers \\(q\\) (the quotient) and \\(r\\) (the remainder) such that</p>
        \\[a = bq + r, \\qquad 0 \\leq r < b.\\]
    </div>
</div>

<p>The key constraint is \\(0 \\leq r < b\\): the remainder is always non-negative and strictly less than the divisor. This is what makes the decomposition unique.</p>

<div class="env-block proof">
    <div class="env-title">Proof (Existence)</div>
    <div class="env-body">
        <p>Consider the set \\(S = \\{a - bk : k \\in \\mathbb{Z}, \\, a - bk \\geq 0\\}\\). This set is non-empty (if \\(a \\geq 0\\), take \\(k = 0\\); if \\(a < 0\\), take \\(k\\) sufficiently negative). By the Well-Ordering Principle, \\(S\\) has a smallest element \\(r = a - bq\\) for some integer \\(q\\).</p>
        <p>We have \\(r \\geq 0\\) by construction. If \\(r \\geq b\\), then \\(r - b = a - b(q+1) \\geq 0\\) is in \\(S\\) and is smaller than \\(r\\), contradicting minimality. So \\(0 \\leq r < b\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (Uniqueness)</div>
    <div class="env-body">
        <p>Suppose \\(a = bq_1 + r_1 = bq_2 + r_2\\) with \\(0 \\leq r_1, r_2 < b\\). Then \\(b(q_1 - q_2) = r_2 - r_1\\). The right side satisfies \\(|r_2 - r_1| < b\\), but the left side is a multiple of \\(b\\). The only multiple of \\(b\\) with absolute value less than \\(b\\) is 0. So \\(r_1 = r_2\\) and \\(q_1 = q_2\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Negative Dividends</div>
    <div class="env-body">
        <p>Divide \\(-17\\) by 5. We need \\(-17 = 5q + r\\) with \\(0 \\leq r < 5\\).</p>
        <p>\\(-17 = 5 \\times (-4) + 3\\). So \\(q = -4\\) and \\(r = 3\\).</p>
        <p>Note: many programming languages would give a remainder of \\(-2\\) for this division, but in number theory we require \\(r \\geq 0\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Notation</div>
    <div class="env-body">
        <p>We write \\(a \\bmod b\\) (read "\\(a\\) mod \\(b\\)") for the remainder when \\(a\\) is divided by \\(b\\). So \\(17 \\bmod 5 = 2\\) and \\(-17 \\bmod 5 = 3\\).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Find \\(q\\) and \\(r\\) when \\(a = -23\\) and \\(b = 7\\). Remember that \\(r\\) must satisfy \\(0 \\leq r < 7\\).',
                    hint: 'Find the largest multiple of 7 that is less than or equal to \\(-23\\). That is \\(7 \\times (-4) = -28\\).',
                    solution: '\\(-23 = 7 \\times (-4) + 5\\). So \\(q = -4\\) and \\(r = 5\\). Check: \\(0 \\leq 5 < 7\\). \\(\\checkmark\\)'
                },
                {
                    question: 'Prove: for any integer \\(a\\), exactly one of the numbers \\(a, a+1, a+2, \\ldots, a+b-1\\) is divisible by \\(b\\).',
                    hint: 'Write \\(a = bq + r\\) with \\(0 \\leq r < b\\). Which of the numbers \\(a, a+1, \\ldots, a+b-1\\) has remainder 0?',
                    solution: 'Write \\(a = bq + r\\). Then \\(a + (b - r) = b(q + 1)\\), which is divisible by \\(b\\). Since \\(0 \\leq r < b\\), we have \\(0 < b - r \\leq b\\), so \\(a + (b-r)\\) is among \\(a+1, \\ldots, a+b\\) (or \\(a\\) itself if \\(r = 0\\)). It lies in \\(\\{a, a+1, \\ldots, a+b-1\\}\\). Uniqueness: if two of them, say \\(a+i\\) and \\(a+j\\) with \\(0 \\leq i < j < b\\), were both divisible by \\(b\\), then \\(b \\mid (j - i)\\), but \\(0 < j - i < b\\), which is impossible.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Clock Arithmetic
        // ================================================================
        {
            id: 'sec-clock',
            title: 'Clock Arithmetic',
            content: `
<h2>Clock Arithmetic</h2>

<div class="env-block intuition">
    <div class="env-title">The 12-Hour Clock</div>
    <div class="env-body">
        <p>On a clock, after 12 comes 12 again (or we reset to 0 if we think of midnight). If it is 10 o'clock and you add 5 hours, you get 3 o'clock, not 15 o'clock. The clock "wraps around" at 12.</p>
        <p>This wrapping is exactly remainder arithmetic: \\(10 + 5 = 15\\), and \\(15 \\bmod 12 = 3\\).</p>
    </div>
</div>

<p>A clock with \\(n\\) hours uses the numbers \\(0, 1, 2, \\ldots, n-1\\). When we reach \\(n\\), we wrap back to 0. This is modular arithmetic in its most concrete form.</p>

<h3>Adding on the Clock</h3>

<p>On a mod-\\(n\\) clock:</p>
<ul>
    <li>Start at position \\(a\\).</li>
    <li>Move forward \\(b\\) positions.</li>
    <li>You end up at position \\((a + b) \\bmod n\\).</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: 12-Hour Clock</div>
    <div class="env-body">
        <p>It is 9:00 PM. What time will it be in 8 hours?</p>
        <p>\\(9 + 8 = 17\\), and \\(17 \\bmod 12 = 5\\). It will be 5:00 AM.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: 24-Hour Clock</div>
    <div class="env-body">
        <p>On a 24-hour clock, it is 22:00. What time is it 10 hours later?</p>
        <p>\\(22 + 10 = 32\\), and \\(32 \\bmod 24 = 8\\). It will be 08:00.</p>
    </div>
</div>

<p>The clock metaphor works for any modulus \\(n\\), not just 12 or 24. A week is a mod-7 clock (0 = Sunday, 1 = Monday, ..., 6 = Saturday). The keys on a piano repeat with period 12 (the 12 semitones of the chromatic scale). Angles wrap around at 360 degrees.</p>

<div class="env-block remark">
    <div class="env-title">Why Start at 0?</div>
    <div class="env-body">
        <p>Mathematicians prefer \\(\\{0, 1, 2, \\ldots, n-1\\}\\) rather than \\(\\{1, 2, \\ldots, n\\}\\) because the remainder upon division by \\(n\\) always falls in \\(\\{0, 1, \\ldots, n-1\\}\\). Real clocks use 12 instead of 0, but that is a notational quirk, not a mathematical one.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-clock-face"></div>
`,
            visualizations: [
                {
                    id: 'viz-clock-face',
                    title: 'Clock Arithmetic',
                    description: 'Add hours on a mod-n clock. Watch the hand wrap around. Change the modulus to see different clocks.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var modN = 12;
                        var startHour = 9;
                        var addHours = 5;
                        var animProgress = 1;
                        var animating = false;

                        VizEngine.createSlider(controls, 'mod n', 2, 24, modN, 1, function(v) {
                            modN = Math.round(v);
                            if (startHour >= modN) startHour = 0;
                            animProgress = 1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'start', 0, 23, startHour, 1, function(v) {
                            startHour = Math.round(v) % modN;
                            animProgress = 1;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'add', 0, 30, addHours, 1, function(v) {
                            addHours = Math.round(v);
                            animProgress = 1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animProgress = 0;
                            var steps = Math.max(30, addHours * 15);
                            var step = 0;
                            function tick() {
                                step++;
                                animProgress = Math.min(1, step / steps);
                                draw();
                                if (animProgress < 1) {
                                    requestAnimationFrame(tick);
                                } else {
                                    animating = false;
                                }
                            }
                            requestAnimationFrame(tick);
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = viz.width / 2;
                            var cy = 200;
                            var radius = 130;

                            viz.screenText('Mod ' + modN + ' Clock', cx, 22, viz.colors.white, 16);

                            // Draw clock circle
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                            ctx.stroke();

                            // Draw numbers and tick marks
                            for (var i = 0; i < modN; i++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * i) / modN;
                                var tickX1 = cx + Math.cos(angle) * (radius - 8);
                                var tickY1 = cy + Math.sin(angle) * (radius - 8);
                                var tickX2 = cx + Math.cos(angle) * (radius + 2);
                                var tickY2 = cy + Math.sin(angle) * (radius + 2);

                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(tickX1, tickY1);
                                ctx.lineTo(tickX2, tickY2);
                                ctx.stroke();

                                var labelR = radius + 16;
                                var lx = cx + Math.cos(angle) * labelR;
                                var ly = cy + Math.sin(angle) * labelR;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (modN <= 12 ? '14' : '10') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), lx, ly);
                            }

                            // Center dot
                            ctx.fillStyle = viz.colors.text;
                            ctx.beginPath();
                            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                            ctx.fill();

                            // Start position marker
                            var startAngle = -Math.PI / 2 + (2 * Math.PI * startHour) / modN;
                            var smx = cx + Math.cos(startAngle) * (radius - 25);
                            var smy = cy + Math.sin(startAngle) * (radius - 25);
                            ctx.fillStyle = viz.colors.blue + '44';
                            ctx.beginPath();
                            ctx.arc(smx, smy, 10, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.arc(smx, smy, 6, 0, Math.PI * 2);
                            ctx.fill();

                            // Animated hand: sweeps from start to result
                            var endPos = (startHour + addHours) % modN;
                            var currentAdd = addHours * animProgress;
                            var currentPos = startHour + currentAdd;
                            var currentAngle = -Math.PI / 2 + (2 * Math.PI * currentPos) / modN;

                            // Draw sweep arc
                            if (addHours > 0 && animProgress > 0) {
                                ctx.strokeStyle = viz.colors.teal + '44';
                                ctx.lineWidth = 8;
                                ctx.beginPath();
                                ctx.arc(cx, cy, radius - 25, startAngle, currentAngle, false);
                                ctx.stroke();
                            }

                            // Hand
                            var handLen = radius - 30;
                            var hx = cx + Math.cos(currentAngle) * handLen;
                            var hy = cy + Math.sin(currentAngle) * handLen;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(cx, cy);
                            ctx.lineTo(hx, hy);
                            ctx.stroke();

                            // Tip
                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath();
                            ctx.arc(hx, hy, 5, 0, Math.PI * 2);
                            ctx.fill();

                            // Result text
                            var result = (startHour + addHours) % modN;
                            viz.screenText(
                                startHour + ' + ' + addHours + ' = ' + (startHour + addHours) +
                                '  \u2261  ' + result + ' (mod ' + modN + ')',
                                cx, viz.height - 30, viz.colors.teal, 14
                            );

                            // Labels
                            viz.screenText('Start: ' + startHour, cx - 150, viz.height - 60, viz.colors.blue, 12);
                            viz.screenText('Result: ' + result, cx + 150, viz.height - 60, viz.colors.orange, 12);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'On a 12-hour clock, it is 7:00. What time will it be in 20 hours?',
                    hint: 'Compute \\(7 + 20 = 27\\) and find \\(27 \\bmod 12\\).',
                    solution: '\\(27 \\bmod 12 = 3\\). It will be 3:00.'
                },
                {
                    question: 'On a mod-7 clock (representing days of the week, 0 = Sunday), today is Wednesday (day 3). What day will it be in 45 days?',
                    hint: 'Compute \\((3 + 45) \\bmod 7\\).',
                    solution: '\\(3 + 45 = 48\\). \\(48 \\bmod 7 = 48 - 7 \\times 6 = 48 - 42 = 6\\). Day 6 is Saturday.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Congruence
        // ================================================================
        {
            id: 'sec-congruence',
            title: 'Same Remainder = Congruent',
            content: `
<h2>Same Remainder = Congruent</h2>

<div class="env-block intuition">
    <div class="env-title">Two Numbers, Same Remainder</div>
    <div class="env-body">
        <p>The numbers 17 and 32 both leave remainder 2 when divided by 5. In a sense, they are "equivalent from the perspective of dividing by 5." Gauss introduced a compact notation for this idea.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Congruence)</div>
    <div class="env-body">
        <p>Let \\(n\\) be a positive integer. We say that \\(a\\) is <strong>congruent</strong> to \\(b\\) modulo \\(n\\), written</p>
        \\[a \\equiv b \\pmod{n},\\]
        <p>if \\(a\\) and \\(b\\) leave the same remainder when divided by \\(n\\). Equivalently, \\(n \\mid (a - b)\\).</p>
    </div>
</div>

<p>The symbol \\(\\equiv\\) with "(mod \\(n\\))" is different from the operator "\\(a \\bmod n\\)." The first is a <em>relation</em> between two numbers (like \\(=\\) or \\(<\\)); the second is a <em>function</em> that returns the remainder.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.2 (Equivalent Conditions for Congruence)</div>
    <div class="env-body">
        <p>The following are equivalent:</p>
        <ol>
            <li>\\(a \\equiv b \\pmod{n}\\)</li>
            <li>\\(n \\mid (a - b)\\)</li>
            <li>\\(a = b + kn\\) for some integer \\(k\\)</li>
            <li>\\(a \\bmod n = b \\bmod n\\)</li>
        </ol>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(23 \\equiv 8 \\pmod{5}\\) because \\(23 - 8 = 15 = 5 \\times 3\\).</li>
            <li>\\(100 \\equiv 2 \\pmod{7}\\) because \\(100 = 7 \\times 14 + 2\\) and \\(2 = 7 \\times 0 + 2\\).</li>
            <li>\\(-3 \\equiv 4 \\pmod{7}\\) because \\(-3 - 4 = -7 = 7 \\times (-1)\\).</li>
            <li>\\(17 \\not\\equiv 8 \\pmod{5}\\) because \\(17 - 8 = 9\\) is not divisible by 5.</li>
        </ul>
    </div>
</div>

<h3>Congruence is an Equivalence Relation</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 9.3</div>
    <div class="env-body">
        <p>For any positive integer \\(n\\), congruence modulo \\(n\\) is an equivalence relation. That is, for all integers \\(a, b, c\\):</p>
        <ol>
            <li><strong>Reflexive:</strong> \\(a \\equiv a \\pmod{n}\\).</li>
            <li><strong>Symmetric:</strong> If \\(a \\equiv b\\), then \\(b \\equiv a \\pmod{n}\\).</li>
            <li><strong>Transitive:</strong> If \\(a \\equiv b\\) and \\(b \\equiv c\\), then \\(a \\equiv c \\pmod{n}\\).</li>
        </ol>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <ol>
            <li>\\(a - a = 0 = n \\times 0\\), so \\(n \\mid (a - a)\\).</li>
            <li>If \\(n \\mid (a - b)\\), then \\(a - b = nk\\), so \\(b - a = n(-k)\\), hence \\(n \\mid (b - a)\\).</li>
            <li>If \\(n \\mid (a - b)\\) and \\(n \\mid (b - c)\\), write \\(a - b = nk_1\\) and \\(b - c = nk_2\\). Then \\(a - c = n(k_1 + k_2)\\), so \\(n \\mid (a - c)\\).</li>
        </ol>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-mod-coloring"></div>
<div class="viz-placeholder" data-viz="viz-congruence-classes"></div>
`,
            visualizations: [
                {
                    id: 'viz-mod-coloring',
                    title: 'Number Line Colored by Remainder',
                    description: 'Numbers on the number line are colored by their remainder mod n. Change n with the slider to see different coloring patterns.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 320,
                            originX: 0, originY: 0, scale: 1
                        });

                        var modN = 5;
                        var palette = [
                            '#58a6ff', '#3fb9a0', '#f0883e', '#3fb950', '#bc8cff',
                            '#f85149', '#d29922', '#f778ba', '#79c0ff', '#56d364',
                            '#e3b341', '#ff7b72'
                        ];

                        VizEngine.createSlider(controls, 'n', 2, 12, modN, 1, function(v) {
                            modN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Numbers Colored by Remainder mod ' + modN, viz.width / 2, 22, viz.colors.white, 15);

                            var maxNum = 40;
                            var cols = 20;
                            var rows = Math.ceil(maxNum / cols);
                            var cellW = Math.min(26, (viz.width - 40) / cols);
                            var cellH = cellW;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 50;

                            for (var num = 0; num < maxNum; num++) {
                                var row = Math.floor(num / cols);
                                var col = num % cols;
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;
                                var rem = num % modN;
                                var color = palette[rem % palette.length];

                                ctx.fillStyle = color + '66';
                                ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (cellW > 20 ? '11' : '9') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(num.toString(), x + cellW / 2, y + cellH / 2);
                            }

                            // Number line visualization below
                            var lineY = startY + rows * cellH + 30;
                            var lineStartX = 30;
                            var lineEndX = viz.width - 30;
                            var lineLen = lineEndX - lineStartX;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(lineStartX, lineY);
                            ctx.lineTo(lineEndX, lineY);
                            ctx.stroke();

                            var numOnLine = Math.min(30, maxNum);
                            var spacing = lineLen / numOnLine;

                            for (var i = 0; i <= numOnLine; i++) {
                                var lx = lineStartX + i * spacing;
                                var rem2 = i % modN;
                                var c = palette[rem2 % palette.length];

                                ctx.fillStyle = c;
                                ctx.beginPath();
                                ctx.arc(lx, lineY, 5, 0, Math.PI * 2);
                                ctx.fill();

                                if (spacing > 14) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(i.toString(), lx, lineY + 8);
                                }
                            }

                            // Legend
                            var legY = lineY + 35;
                            var legX = (viz.width - modN * 50) / 2;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            for (var r = 0; r < modN; r++) {
                                var lxx = legX + r * 50;
                                ctx.fillStyle = palette[r % palette.length];
                                ctx.fillRect(lxx, legY, 10, 10);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('r=' + r, lxx + 14, legY + 9);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-congruence-classes',
                    title: 'Congruence Classes',
                    description: 'Numbers grouped into bins by their remainder mod n. Each bin is a congruence class. Notice how the classes partition all integers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var modN = 4;
                        var palette = [
                            '#58a6ff', '#3fb9a0', '#f0883e', '#3fb950', '#bc8cff',
                            '#f85149', '#d29922', '#f778ba', '#79c0ff', '#56d364',
                            '#e3b341', '#ff7b72'
                        ];

                        VizEngine.createSlider(controls, 'n', 2, 8, modN, 1, function(v) {
                            modN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Congruence Classes mod ' + modN, viz.width / 2, 22, viz.colors.white, 16);

                            // Create bins
                            var bins = [];
                            for (var r = 0; r < modN; r++) bins.push([]);
                            var maxNum = modN * 6;
                            for (var num = 0; num < maxNum; num++) {
                                bins[num % modN].push(num);
                            }

                            var binWidth = Math.min(120, (viz.width - 40) / modN);
                            var startX = (viz.width - modN * binWidth) / 2;
                            var topY = 55;

                            for (var r = 0; r < modN; r++) {
                                var bx = startX + r * binWidth;
                                var color = palette[r % palette.length];

                                // Bin label
                                ctx.fillStyle = color;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('[' + r + ']', bx + binWidth / 2, topY);

                                // Bin border
                                var binH = bins[r].length * 22 + 10;
                                ctx.strokeStyle = color + '66';
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(bx + 4, topY + 20, binWidth - 8, binH);

                                // Items
                                for (var j = 0; j < bins[r].length; j++) {
                                    var iy = topY + 28 + j * 22;
                                    ctx.fillStyle = color + '33';
                                    ctx.fillRect(bx + 8, iy, binWidth - 16, 18);
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(bins[r][j].toString(), bx + binWidth / 2, iy + 9);
                                }

                                // Pattern
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var patternY = topY + 28 + bins[r].length * 22 + 6;
                                ctx.fillText('\u22EE', bx + binWidth / 2, patternY);
                            }

                            // Explanation
                            viz.screenText(
                                'Every integer belongs to exactly one class',
                                viz.width / 2, viz.height - 20, viz.colors.muted, 12
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Determine whether \\(123 \\equiv 83 \\pmod{8}\\).',
                    hint: 'Compute \\(123 - 83\\) and check if 8 divides the result.',
                    solution: '\\(123 - 83 = 40 = 8 \\times 5\\). Since \\(8 \\mid 40\\), yes, \\(123 \\equiv 83 \\pmod{8}\\).'
                },
                {
                    question: 'List all integers from \\(-10\\) to 20 that are congruent to 3 mod 7.',
                    hint: 'These are numbers of the form \\(3 + 7k\\) for integer \\(k\\).',
                    solution: 'We need \\(3 + 7k\\) in \\([-10, 20]\\). For \\(k = -1\\): \\(-4\\). For \\(k = 0\\): 3. For \\(k = 1\\): 10. For \\(k = 2\\): 17. The answer is \\(\\{-4, 3, 10, 17\\}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Days of the Week
        // ================================================================
        {
            id: 'sec-days',
            title: 'Days of the Week',
            content: `
<h2>Days of the Week</h2>

<div class="env-block intuition">
    <div class="env-title">The 7-Day Cycle</div>
    <div class="env-body">
        <p>Days of the week repeat every 7 days. If today is Wednesday and you want to know what day it will be 100 days from now, you do not need to count day by day. You just need the remainder of 100 divided by 7.</p>
    </div>
</div>

<p>Let us assign numbers to the days of the week:</p>
<table style="margin: 12px auto; border-collapse: collapse;">
    <tr>
        <th style="padding: 4px 14px; border-bottom: 1px solid #30363d;">Day</th>
        <th style="padding: 4px 14px; border-bottom: 1px solid #30363d;">Number</th>
    </tr>
    <tr><td style="padding: 4px 14px;">Sunday</td><td style="padding: 4px 14px; text-align:center;">0</td></tr>
    <tr><td style="padding: 4px 14px;">Monday</td><td style="padding: 4px 14px; text-align:center;">1</td></tr>
    <tr><td style="padding: 4px 14px;">Tuesday</td><td style="padding: 4px 14px; text-align:center;">2</td></tr>
    <tr><td style="padding: 4px 14px;">Wednesday</td><td style="padding: 4px 14px; text-align:center;">3</td></tr>
    <tr><td style="padding: 4px 14px;">Thursday</td><td style="padding: 4px 14px; text-align:center;">4</td></tr>
    <tr><td style="padding: 4px 14px;">Friday</td><td style="padding: 4px 14px; text-align:center;">5</td></tr>
    <tr><td style="padding: 4px 14px;">Saturday</td><td style="padding: 4px 14px; text-align:center;">6</td></tr>
</table>

<div class="env-block example">
    <div class="env-title">Example: 100 Days from Wednesday</div>
    <div class="env-body">
        <p>Today is Wednesday (day 3). What day is it 100 days from now?</p>
        <p>\\((3 + 100) \\bmod 7 = 103 \\bmod 7\\).</p>
        <p>\\(103 = 7 \\times 14 + 5\\), so the remainder is 5. Day 5 is <strong>Friday</strong>.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: 365 Days from Monday</div>
    <div class="env-body">
        <p>Today is Monday. What day is it one year (365 days) from now?</p>
        <p>\\((1 + 365) \\bmod 7 = 366 \\bmod 7 = 2\\). Day 2 is <strong>Tuesday</strong>.</p>
        <p>This is why, in a non-leap year, the same date falls one day of the week later the next year.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Which Day Was 200 Days Ago?</div>
    <div class="env-body">
        <p>Today is Friday (day 5). What day was it 200 days ago?</p>
        <p>\\((5 - 200) \\bmod 7 = -195 \\bmod 7\\).</p>
        <p>\\(-195 = 7 \\times (-28) + 1\\), so the remainder is 1. Day 1 is <strong>Monday</strong>.</p>
        <p>(We needed \\(q = -28\\) because \\(7 \\times (-28) = -196 \\leq -195\\) and \\(7 \\times (-27) = -189 > -195\\).)</p>
    </div>
</div>

<p>The day-of-week calculation is a natural application of modular arithmetic. The same idea works for months (mod 12), hours (mod 24), minutes (mod 60), and many other cyclic systems.</p>

<div class="viz-placeholder" data-viz="viz-day-calculator"></div>
`,
            visualizations: [
                {
                    id: 'viz-day-calculator',
                    title: 'Day of the Week Calculator',
                    description: 'Pick today\'s day, then enter how many days forward (or backward). The tool computes the resulting day using mod 7 arithmetic.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 350,
                            originX: 0, originY: 0, scale: 1
                        });

                        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var dayColors = ['#f85149', '#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff', '#3fb950', '#d29922'];
                        var startDay = 3;
                        var daysAhead = 100;

                        VizEngine.createSlider(controls, 'Today', 0, 6, startDay, 1, function(v) {
                            startDay = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Days ahead', -365, 365, daysAhead, 1, function(v) {
                            daysAhead = Math.round(v);
                            draw();
                        });

                        function posMod(a, n) {
                            return ((a % n) + n) % n;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var result = posMod(startDay + daysAhead, 7);

                            viz.screenText('Day of the Week Calculator', viz.width / 2, 22, viz.colors.white, 16);

                            // Show the week as a circle
                            var cx = viz.width / 2;
                            var cy = 160;
                            var radius = 90;

                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                            ctx.stroke();

                            for (var d = 0; d < 7; d++) {
                                var angle = -Math.PI / 2 + (2 * Math.PI * d) / 7;
                                var dx = cx + Math.cos(angle) * radius;
                                var dy = cy + Math.sin(angle) * radius;

                                var isStart = (d === startDay);
                                var isResult = (d === result);
                                var r = isStart || isResult ? 16 : 10;

                                if (isStart && isResult) {
                                    ctx.fillStyle = '#ffffff33';
                                    ctx.beginPath();
                                    ctx.arc(dx, dy, 22, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = isStart ? viz.colors.blue : (isResult ? viz.colors.teal : dayColors[d] + '66');
                                ctx.beginPath();
                                ctx.arc(dx, dy, r, 0, Math.PI * 2);
                                ctx.fill();

                                var labelR = radius + 28;
                                var lx = cx + Math.cos(angle) * labelR;
                                var ly = cy + Math.sin(angle) * labelR;
                                ctx.fillStyle = isStart ? viz.colors.blue : (isResult ? viz.colors.teal : viz.colors.text);
                                ctx.font = (isStart || isResult ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(dayNames[d], lx, ly);
                            }

                            // Arrow from start to result
                            if (startDay !== result) {
                                var angle1 = -Math.PI / 2 + (2 * Math.PI * startDay) / 7;
                                var angle2 = -Math.PI / 2 + (2 * Math.PI * result) / 7;

                                ctx.strokeStyle = viz.colors.teal + '88';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                if (daysAhead >= 0) {
                                    ctx.arc(cx, cy, radius - 20, angle1, angle2, false);
                                } else {
                                    ctx.arc(cx, cy, radius - 20, angle1, angle2, true);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Computation
                            var total = startDay + daysAhead;
                            viz.screenText(
                                dayNames[startDay] + ' + ' + daysAhead + ' days',
                                viz.width / 2, viz.height - 75, viz.colors.blue, 13
                            );
                            viz.screenText(
                                '(' + startDay + ' + ' + daysAhead + ') mod 7 = ' + total + ' mod 7 = ' + result,
                                viz.width / 2, viz.height - 52, viz.colors.teal, 13
                            );
                            viz.screenText(
                                'Answer: ' + dayNames[result],
                                viz.width / 2, viz.height - 25, viz.colors.white, 15
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Today is Saturday. What day of the week will it be in 1000 days?',
                    hint: 'Saturday is day 6. Compute \\((6 + 1000) \\bmod 7\\).',
                    solution: '\\(6 + 1000 = 1006\\). \\(1006 = 7 \\times 143 + 5\\). So \\(1006 \\bmod 7 = 5\\), which is Friday.'
                },
                {
                    question: 'January 1, 2025 is a Wednesday. What day of the week is July 4, 2025?',
                    hint: 'Count the days from January 1 to July 4: 31 (Jan) + 28 (Feb) + 31 (Mar) + 30 (Apr) + 31 (May) + 30 (Jun) + 3 (Jul) = 184 days. Then find \\((3 + 184) \\bmod 7\\).',
                    solution: 'From Jan 1 to Jul 4 is 184 days. \\((3 + 184) \\bmod 7 = 187 \\bmod 7 = 5\\) (since \\(187 = 7 \\times 26 + 5\\)). Day 5 is Friday. July 4, 2025 is a Friday.'
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

<p>In this chapter we have established the foundations of modular arithmetic:</p>
<ul>
    <li>The <strong>Division Algorithm</strong> guarantees a unique quotient and remainder.</li>
    <li><strong>Clock arithmetic</strong> gives us the intuition: numbers wrap around at the modulus.</li>
    <li><strong>Congruence</strong> (\\(a \\equiv b \\pmod{n}\\)) captures the idea that two numbers are "the same" from the remainder's perspective.</li>
    <li><strong>Congruence classes</strong> partition the integers into \\(n\\) families.</li>
</ul>

<p>But we have only scratched the surface. Can we <em>add</em> and <em>multiply</em> congruences? If \\(a \\equiv b\\) and \\(c \\equiv d\\), is \\(a + c \\equiv b + d\\)? Is \\(ac \\equiv bd\\)? The answer to both is <strong>yes</strong>, and this makes modular arithmetic into a powerful computational system. We will explore these operations in the next chapter.</p>

<div class="env-block intuition">
    <div class="env-title">A Taste of What's Coming</div>
    <div class="env-body">
        <p>Here is a surprising fact: the remainders of the powers \\(2^1, 2^2, 2^3, \\ldots\\) when divided by 7 follow a repeating cycle: \\(2, 4, 1, 2, 4, 1, \\ldots\\). The cycle length is 3. Why does it repeat? Why is the cycle length 3 and not 6? These questions lead to deep results about the structure of remainders.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-remainder-patterns"></div>
`,
            visualizations: [
                {
                    id: 'viz-remainder-patterns',
                    title: 'Remainder Patterns of Powers',
                    description: 'Watch the remainders of b^n mod m as n grows. The pattern always eventually cycles. Change the base b and the modulus m.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var base = 2;
                        var modN = 7;
                        var maxPow = 24;
                        var animStep = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'base b', 2, 10, base, 1, function(v) {
                            base = Math.round(v);
                            animStep = maxPow;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'mod m', 2, 15, modN, 1, function(v) {
                            modN = Math.round(v);
                            animStep = maxPow;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 0;
                            function tick() {
                                animStep++;
                                draw();
                                if (animStep < maxPow) {
                                    setTimeout(tick, 150);
                                } else {
                                    animating = false;
                                }
                            }
                            tick();
                        });

                        var palette = [
                            '#58a6ff', '#3fb9a0', '#f0883e', '#3fb950', '#bc8cff',
                            '#f85149', '#d29922', '#f778ba', '#79c0ff', '#56d364',
                            '#e3b341', '#ff7b72', '#aaa', '#ddd', '#6699cc'
                        ];

                        function powerMod(b, e, m) {
                            var result = 1;
                            b = b % m;
                            for (var i = 0; i < e; i++) {
                                result = (result * b) % m;
                            }
                            return result;
                        }

                        function findCycle(b, m) {
                            var seen = {};
                            var values = [];
                            for (var i = 1; i <= 50; i++) {
                                var v = powerMod(b, i, m);
                                if (seen[v] !== undefined) {
                                    return { start: seen[v], length: i - seen[v] };
                                }
                                seen[v] = i;
                                values.push(v);
                            }
                            return null;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var showN = Math.min(animStep, maxPow);

                            viz.screenText(base + '^n mod ' + modN, viz.width / 2, 22, viz.colors.white, 16);

                            // Compute remainders
                            var remainders = [];
                            for (var i = 1; i <= maxPow; i++) {
                                remainders.push(powerMod(base, i, modN));
                            }

                            // Bar chart
                            var chartLeft = 50;
                            var chartRight = viz.width - 30;
                            var chartTop = 55;
                            var chartBottom = 260;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;
                            var barW = Math.min(20, chartW / maxPow - 2);

                            // Y-axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, chartTop);
                            ctx.lineTo(chartLeft, chartBottom);
                            ctx.lineTo(chartRight, chartBottom);
                            ctx.stroke();

                            // Y labels
                            for (var y = 0; y < modN; y++) {
                                var yy = chartBottom - (y / (modN - 1)) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(y.toString(), chartLeft - 6, yy);

                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath();
                                ctx.moveTo(chartLeft, yy);
                                ctx.lineTo(chartRight, yy);
                                ctx.stroke();
                            }

                            // Bars
                            var spacing = chartW / maxPow;
                            for (var i = 0; i < showN; i++) {
                                var rem = remainders[i];
                                var bx = chartLeft + i * spacing + (spacing - barW) / 2;
                                var barH = (rem / (modN - 1)) * chartH;
                                var by = chartBottom - barH;
                                var color = palette[rem % palette.length];

                                ctx.fillStyle = color;
                                ctx.fillRect(bx, by, barW, barH);

                                // Value label on top
                                if (spacing > 15) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'bottom';
                                    ctx.fillText(rem.toString(), bx + barW / 2, by - 2);
                                }

                                // X label
                                if (spacing > 12 || i % 2 === 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText((i + 1).toString(), bx + barW / 2, chartBottom + 3);
                                }
                            }

                            // X-axis label
                            viz.screenText('n', chartRight + 12, chartBottom, viz.colors.text, 12);

                            // Cycle detection info
                            var cycle = findCycle(base, modN);
                            var infoY = 290;
                            if (cycle) {
                                var cycleVals = [];
                                for (var j = cycle.start; j < cycle.start + cycle.length; j++) {
                                    cycleVals.push(powerMod(base, j, modN));
                                }
                                viz.screenText(
                                    'Cycle detected! Length = ' + cycle.length +
                                    ', starting at n = ' + cycle.start,
                                    viz.width / 2, infoY, viz.colors.teal, 13
                                );
                                viz.screenText(
                                    'Pattern: ' + cycleVals.join(', ') + ', ' + cycleVals.join(', ') + ', ...',
                                    viz.width / 2, infoY + 22, viz.colors.orange, 12
                                );
                            }

                            // Sequence display
                            var seqStr = base + '^n mod ' + modN + ': ';
                            var seqNums = [];
                            for (var k = 0; k < Math.min(showN, 15); k++) {
                                seqNums.push(remainders[k]);
                            }
                            if (showN > 15) seqStr += seqNums.join(', ') + ', ...';
                            else seqStr += seqNums.join(', ');
                            viz.screenText(seqStr, viz.width / 2, viz.height - 20, viz.colors.muted, 11);
                        }
                        animStep = maxPow;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the first 8 values of \\(3^n \\bmod 5\\) for \\(n = 1, 2, \\ldots, 8\\). What is the cycle length?',
                    hint: 'Compute: \\(3^1 = 3\\), \\(3^2 = 9 \\equiv 4\\), \\(3^3 = 27 \\equiv 2\\), \\(3^4 = 81 \\equiv 1\\), and then it repeats.',
                    solution: 'The values are \\(3, 4, 2, 1, 3, 4, 2, 1\\). The cycle is \\((3, 4, 2, 1)\\) with length 4.'
                },
                {
                    question: 'What is the last digit of \\(7^{100}\\)? (The last digit is the remainder mod 10.)',
                    hint: 'Compute powers of 7 mod 10: \\(7^1 = 7\\), \\(7^2 = 49 \\equiv 9\\), \\(7^3 \\equiv 3\\), \\(7^4 \\equiv 1\\). The cycle has length 4. Since \\(100 = 4 \\times 25\\), we have \\(7^{100} \\equiv 7^0 \\equiv 1 \\pmod{10}\\).',
                    solution: 'Powers of 7 mod 10 cycle as \\(7, 9, 3, 1, 7, 9, 3, 1, \\ldots\\) with period 4. Since \\(100 \\equiv 0 \\pmod{4}\\), \\(7^{100} \\equiv 7^4 \\equiv 1 \\pmod{10}\\). The last digit is 1.'
                }
            ]
        }
    ]
});
