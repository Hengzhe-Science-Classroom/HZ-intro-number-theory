window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Pythagorean Triples',
    subtitle: 'When right triangles have whole number sides',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>The Marriage of Geometry and Number Theory</h2>

<div class="env-block intuition">
    <div class="env-title">A Surprising Connection</div>
    <div class="env-body">
        <p>Imagine you are laying tiles on a floor. You place a 3-by-3 square, a 4-by-4 square, and a 5-by-5 square side by side. The 3-by-3 square has 9 tiles. The 4-by-4 square has 16 tiles. The 5-by-5 square has 25 tiles. And \\(9 + 16 = 25\\)! This is not a coincidence: it reflects a deep connection between geometry and whole numbers.</p>
    </div>
</div>

<p>The Pythagorean theorem is one of the most famous results in all of mathematics:</p>

\\[a^2 + b^2 = c^2\\]

<p>where \\(a\\) and \\(b\\) are the legs of a right triangle and \\(c\\) is the hypotenuse. You have certainly seen this in geometry class. But here is a question that belongs to <strong>number theory</strong>: when can all three sides be <em>whole numbers</em>?</p>

<p>Not every right triangle has integer sides. A right triangle with legs 1 and 1 has hypotenuse \\(\\sqrt{2}\\), which is irrational. But 3, 4, 5 works: \\(3^2 + 4^2 = 9 + 16 = 25 = 5^2\\). Finding all such integer solutions is a beautiful problem that connects algebra, geometry, and number theory.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The Babylonians knew about integer-sided right triangles at least 1,000 years before Pythagoras. The clay tablet Plimpton 322 (circa 1800 BCE) lists 15 Pythagorean triples, including large ones like (4601, 4800, 6649). The ancient Egyptians used the 3-4-5 triangle as a practical tool for constructing right angles in building projects.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pythagorean-visual"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 1: viz-pythagorean-visual — right triangle with squares
                // ============================================================
                {
                    id: 'viz-pythagorean-visual',
                    title: 'Right Triangle with Squares on Each Side',
                    description: 'A right triangle with squares drawn on each side. The areas of the two smaller squares sum to the area of the largest square. Drag the slider to try different triples.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 60, originY: 360, scale: 28
                        });

                        var triples = [
                            [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]
                        ];
                        var tripleIdx = 0;

                        VizEngine.createSlider(controls, 'Triple', 0, triples.length - 1, 0, 1, function(v) {
                            tripleIdx = Math.round(v);
                            draw();
                        });

                        function draw() {
                            var t = triples[tripleIdx];
                            var a = t[0], b = t[1], c = t[2];

                            // Adjust scale so everything fits
                            var maxDim = Math.max(a + b, c + b, a + c);
                            viz.scale = Math.min(28, (viz.width - 120) / maxDim, (viz.height - 80) / maxDim);
                            viz.originX = 60;
                            viz.originY = viz.height - 40;

                            viz.clear();
                            var ctx = viz.ctx;

                            // Triangle vertices: right angle at origin, a along x, b along y
                            var Ax = 0, Ay = 0;
                            var Bx = a, By = 0;
                            var Cx = 0, Cy = b;

                            // Draw square on side a (bottom, along x-axis, going down)
                            viz.drawPolygon(
                                [[Ax, Ay], [Bx, By], [Bx, -a], [Ax, -a]],
                                viz.colors.blue + '33', viz.colors.blue, 2
                            );

                            // Draw square on side b (left, along y-axis, going left)
                            viz.drawPolygon(
                                [[Ax, Ay], [Cx, Cy], [-b, Cy], [-b, Ay]],
                                viz.colors.teal + '33', viz.colors.teal, 2
                            );

                            // Draw square on hypotenuse c
                            // Hypotenuse from B to C. Unit vector perpendicular to BC
                            var dx = Cx - Bx, dy = Cy - By;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var px = -dy / len, py = dx / len; // perpendicular outward

                            viz.drawPolygon(
                                [[Bx, By], [Cx, Cy],
                                 [Cx + px * c, Cy + py * c],
                                 [Bx + px * c, By + py * c]],
                                viz.colors.orange + '33', viz.colors.orange, 2
                            );

                            // Draw the triangle itself
                            viz.drawPolygon(
                                [[Ax, Ay], [Bx, By], [Cx, Cy]],
                                null, viz.colors.white, 3
                            );

                            // Right angle marker
                            var markSize = 0.6;
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 1.5;
                            var ms = markSize;
                            var p1 = viz.toScreen(ms, 0);
                            var p2 = viz.toScreen(ms, ms);
                            var p3 = viz.toScreen(0, ms);
                            ctx.beginPath();
                            ctx.moveTo(p1[0], p1[1]);
                            ctx.lineTo(p2[0], p2[1]);
                            ctx.lineTo(p3[0], p3[1]);
                            ctx.stroke();

                            // Labels on sides
                            viz.drawText('a = ' + a, a / 2, -0.8, viz.colors.blue, 13);
                            viz.drawText('b = ' + b, -1.5, b / 2, viz.colors.teal, 13, 'center', 'middle');
                            viz.drawText('c = ' + c,
                                (Bx + Cx) / 2 + 0.5, (By + Cy) / 2 + 0.5,
                                viz.colors.orange, 13
                            );

                            // Area labels inside squares
                            viz.drawText(a + '\u00B2 = ' + (a * a), a / 2, -a / 2, viz.colors.blue, 12);
                            viz.drawText(b + '\u00B2 = ' + (b * b), -b / 2, b / 2, viz.colors.teal, 12);
                            var sqCx = (Bx + Cx) / 2 + px * c / 2;
                            var sqCy = (By + Cy) / 2 + py * c / 2;
                            viz.drawText(c + '\u00B2 = ' + (c * c), sqCx, sqCy, viz.colors.orange, 12);

                            // Equation at top
                            viz.screenText(
                                a + '\u00B2 + ' + b + '\u00B2 = ' + (a * a) + ' + ' + (b * b) +
                                ' = ' + (a * a + b * b) + ' = ' + c + '\u00B2',
                                viz.width / 2, 20, viz.colors.white, 15
                            );

                            // Triple label
                            viz.screenText(
                                'Triple: (' + a + ', ' + b + ', ' + c + ')',
                                viz.width / 2, viz.height - 10, viz.colors.teal, 12
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
        // SECTION 2: What Is a Pythagorean Triple?
        // ================================================================
        {
            id: 'sec-definition',
            title: 'What Is a Pythagorean Triple?',
            content: `
<h2>What Is a Pythagorean Triple?</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Pythagorean Triple)</div>
    <div class="env-body">
        <p>A <strong>Pythagorean triple</strong> is an ordered triple \\((a, b, c)\\) of positive integers satisfying</p>
        \\[a^2 + b^2 = c^2.\\]
        <p>We always take \\(a \\leq b < c\\).</p>
    </div>
</div>

<p>The condition \\(a^2 + b^2 = c^2\\) is equivalent to saying that a right triangle with integer leg lengths \\(a\\) and \\(b\\) has an integer hypotenuse \\(c\\). Note the strict inequality \\(b < c\\): since \\(a \\geq 1\\), we have \\(c^2 = a^2 + b^2 > b^2\\), so \\(c > b\\).</p>

<div class="env-block example">
    <div class="env-title">Example: Is (6, 8, 10) a Pythagorean triple?</div>
    <div class="env-body">
        <p>Check: \\(6^2 + 8^2 = 36 + 64 = 100 = 10^2\\). Yes!</p>
        <p>Notice that \\((6, 8, 10) = 2 \\cdot (3, 4, 5)\\). Scaling a Pythagorean triple by any positive integer gives another Pythagorean triple. If \\(a^2 + b^2 = c^2\\), then \\((ka)^2 + (kb)^2 = k^2(a^2 + b^2) = k^2 c^2 = (kc)^2\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.1 (Scaling Property)</div>
    <div class="env-body">
        <p>If \\((a, b, c)\\) is a Pythagorean triple and \\(k\\) is any positive integer, then \\((ka, kb, kc)\\) is also a Pythagorean triple.</p>
    </div>
</div>

<p>This means there are infinitely many Pythagorean triples: just take \\((3, 4, 5)\\) and multiply by \\(k = 1, 2, 3, \\ldots\\). But this feels like "cheating." The really interesting question is: which triples are <em>genuinely different</em>, not just scaled copies of each other?</p>

<div class="env-block remark">
    <div class="env-title">Non-examples</div>
    <div class="env-body">
        <p>\\((1, 2, 3)\\): \\(1 + 4 = 5 \\neq 9\\). Not a triple.</p>
        <p>\\((2, 3, 4)\\): \\(4 + 9 = 13 \\neq 16\\). Not a triple.</p>
        <p>\\((1, 1, \\sqrt{2})\\): satisfies the equation, but \\(\\sqrt{2}\\) is not an integer. Not a Pythagorean triple.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pythagorean-verifier"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 2: viz-pythagorean-verifier — input a,b, check if triple
                // ============================================================
                {
                    id: 'viz-pythagorean-verifier',
                    title: 'Pythagorean Triple Verifier',
                    description: 'Enter values of a and b to check whether a\u00B2 + b\u00B2 is a perfect square. If so, you have found a Pythagorean triple!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var aVal = 3, bVal = 4;

                        VizEngine.createSlider(controls, 'a', 1, 100, aVal, 1, function(v) {
                            aVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 1, 100, bVal, 1, function(v) {
                            bVal = Math.round(v);
                            draw();
                        });

                        function isqrt(n) {
                            var s = Math.round(Math.sqrt(n));
                            if (s * s === n) return s;
                            // Check neighbors for floating point safety
                            if ((s - 1) * (s - 1) === n) return s - 1;
                            if ((s + 1) * (s + 1) === n) return s + 1;
                            return -1;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var a2 = aVal * aVal;
                            var b2 = bVal * bVal;
                            var sum = a2 + b2;
                            var c = isqrt(sum);
                            var isTriple = c > 0;

                            // Title
                            viz.screenText('Pythagorean Triple Verifier', viz.width / 2, 25, viz.colors.white, 16);

                            // Show computation
                            var y = 70;
                            viz.screenText('a = ' + aVal, viz.width / 2, y, viz.colors.blue, 18);
                            y += 30;
                            viz.screenText('b = ' + bVal, viz.width / 2, y, viz.colors.teal, 18);
                            y += 40;
                            viz.screenText(
                                'a\u00B2 + b\u00B2 = ' + aVal + '\u00B2 + ' + bVal + '\u00B2 = ' + a2 + ' + ' + b2 + ' = ' + sum,
                                viz.width / 2, y, viz.colors.white, 16
                            );
                            y += 40;

                            if (isTriple) {
                                viz.screenText(
                                    '\u221A' + sum + ' = ' + c + '  (perfect square!)',
                                    viz.width / 2, y, viz.colors.green, 18
                                );
                                y += 35;
                                viz.screenText(
                                    '(' + aVal + ', ' + bVal + ', ' + c + ') is a Pythagorean triple!',
                                    viz.width / 2, y, viz.colors.green, 16
                                );

                                // Check if primitive
                                y += 30;
                                function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
                                var g = gcd(gcd(aVal, bVal), c);
                                if (g === 1) {
                                    viz.screenText('This is a primitive triple (gcd = 1)', viz.width / 2, y, viz.colors.purple, 13);
                                } else {
                                    viz.screenText(
                                        'Not primitive: ' + g + ' \u00D7 (' + (aVal/g) + ', ' + (bVal/g) + ', ' + (c/g) + ')',
                                        viz.width / 2, y, viz.colors.orange, 13
                                    );
                                }
                            } else {
                                var sqrtApprox = Math.sqrt(sum).toFixed(4);
                                viz.screenText(
                                    '\u221A' + sum + ' \u2248 ' + sqrtApprox + '  (not a perfect square)',
                                    viz.width / 2, y, viz.colors.red, 18
                                );
                                y += 35;
                                viz.screenText(
                                    '(' + aVal + ', ' + bVal + ') does not form a Pythagorean triple.',
                                    viz.width / 2, y, viz.colors.red, 14
                                );
                            }

                            // Visual: small right triangle if it is a triple
                            if (isTriple) {
                                var triScale = Math.min(80 / c, 10);
                                var triX = viz.width / 2 - aVal * triScale / 2;
                                var triY = viz.height - 30;

                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(triX, triY);
                                ctx.lineTo(triX + aVal * triScale, triY);
                                ctx.lineTo(triX, triY - bVal * triScale);
                                ctx.closePath();
                                ctx.stroke();

                                // Right angle marker
                                var ms = Math.min(8, triScale * 0.5);
                                ctx.beginPath();
                                ctx.moveTo(triX + ms, triY);
                                ctx.lineTo(triX + ms, triY - ms);
                                ctx.lineTo(triX, triY - ms);
                                ctx.stroke();
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that each of the following is a Pythagorean triple: (a) (5, 12, 13), (b) (8, 15, 17), (c) (20, 21, 29).',
                    hint: 'For each triple \\((a, b, c)\\), compute \\(a^2 + b^2\\) and check if it equals \\(c^2\\).',
                    solution: '(a) \\(25 + 144 = 169 = 13^2\\). (b) \\(64 + 225 = 289 = 17^2\\). (c) \\(400 + 441 = 841 = 29^2\\). All three are Pythagorean triples.'
                },
                {
                    question: 'If \\((a, b, c)\\) is a Pythagorean triple, show that \\((a, b, c)\\) cannot have all three entries odd.',
                    hint: 'Consider the equation modulo 2. What is \\(\\text{odd}^2 + \\text{odd}^2\\) modulo 2?',
                    solution: 'An odd number squared is odd (since \\((2k+1)^2 = 4k^2+4k+1\\)). If \\(a\\) and \\(b\\) are both odd, then \\(a^2 + b^2\\) is even, so \\(c^2\\) is even, so \\(c\\) is even. Thus all three cannot be odd.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Famous Triples
        // ================================================================
        {
            id: 'sec-examples',
            title: 'Famous Triples',
            content: `
<h2>Famous Triples</h2>

<p>Some Pythagorean triples appear so frequently in mathematics and applications that they are worth memorizing. Here are the most important ones:</p>

<div class="env-block example">
    <div class="env-title">The Classic Triples</div>
    <div class="env-body">
        <table style="width:100%; text-align:center; border-collapse:collapse;">
            <tr style="border-bottom:2px solid #30363d;">
                <th style="padding:6px;">Triple</th>
                <th style="padding:6px;">\\(a^2\\)</th>
                <th style="padding:6px;">\\(b^2\\)</th>
                <th style="padding:6px;">\\(a^2 + b^2\\)</th>
                <th style="padding:6px;">\\(c^2\\)</th>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td style="padding:6px;">(3, 4, 5)</td>
                <td>9</td><td>16</td><td>25</td><td>25</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td style="padding:6px;">(5, 12, 13)</td>
                <td>25</td><td>144</td><td>169</td><td>169</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td style="padding:6px;">(8, 15, 17)</td>
                <td>64</td><td>225</td><td>289</td><td>289</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td style="padding:6px;">(7, 24, 25)</td>
                <td>49</td><td>576</td><td>625</td><td>625</td>
            </tr>
            <tr>
                <td style="padding:6px;">(20, 21, 29)</td>
                <td>400</td><td>441</td><td>841</td><td>841</td>
            </tr>
        </table>
    </div>
</div>

<p>Each of these is a <em>primitive</em> triple (we will define this precisely soon). Scaling any of them produces infinitely many more: \\((6, 8, 10)\\), \\((9, 12, 15)\\), \\((10, 24, 26)\\), and so on.</p>

<div class="env-block remark">
    <div class="env-title">Patterns to Notice</div>
    <div class="env-body">
        <ul>
            <li>In \\((3, 4, 5)\\), the two larger values differ by 1: \\(c - b = 1\\).</li>
            <li>In \\((5, 12, 13)\\) and \\((7, 24, 25)\\), we again have \\(c - b = 1\\).</li>
            <li>In \\((8, 15, 17)\\) and \\((20, 21, 29)\\), we have \\(c - b = 2\\).</li>
            <li>One of \\(a\\) or \\(b\\) is always even. (We proved this in the previous section!)</li>
        </ul>
        <p>These patterns are not coincidences. They emerge from the generating formula we will discover next.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-triple-table"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 3: viz-triple-table — all primitive triples up to c=100
                // ============================================================
                {
                    id: 'viz-triple-table',
                    title: 'All Primitive Pythagorean Triples (c \u2264 100)',
                    description: 'A complete table of all primitive Pythagorean triples with hypotenuse up to 100. Notice how they cluster and how the generating parameters m, n relate to each triple.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 460,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxC = 50;
                        VizEngine.createSlider(controls, 'Max c', 20, 100, maxC, 5, function(v) {
                            maxC = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function getPrimitiveTriples(maxHyp) {
                            var result = [];
                            for (var m = 2; m * m < maxHyp * 2; m++) {
                                for (var n = 1; n < m; n++) {
                                    if ((m - n) % 2 === 0) continue; // m-n must be odd
                                    if (gcd(m, n) !== 1) continue;   // gcd(m,n) = 1
                                    var a = m * m - n * n;
                                    var b = 2 * m * n;
                                    var c = m * m + n * n;
                                    if (c > maxHyp) continue;
                                    if (a > b) { var tmp = a; a = b; b = tmp; }
                                    result.push({ a: a, b: b, c: c, m: m, n: n });
                                }
                            }
                            result.sort(function(x, y) { return x.c - y.c || x.a - y.a; });
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var triples = getPrimitiveTriples(maxC);

                            viz.screenText(
                                'Primitive Pythagorean Triples with c \u2264 ' + maxC,
                                viz.width / 2, 18, viz.colors.white, 14
                            );
                            viz.screenText(
                                'Found ' + triples.length + ' primitive triples',
                                viz.width / 2, 36, viz.colors.teal, 12
                            );

                            // Table header
                            var startY = 58;
                            var rowH = 18;
                            var cols = [60, 130, 200, 270, 350, 440];
                            var headers = ['a', 'b', 'c', 'a\u00B2+b\u00B2', 'm, n', 'c\u2212b'];

                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.orange;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillText(headers[h], cols[h], startY);
                            }

                            // Separator line
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(20, startY + 10);
                            ctx.lineTo(viz.width - 20, startY + 10);
                            ctx.stroke();

                            // Data rows
                            var dataY = startY + 12 + rowH / 2;
                            var maxRows = Math.floor((viz.height - dataY - 10) / rowH);
                            var displayCount = Math.min(triples.length, maxRows);

                            ctx.font = '11px -apple-system,sans-serif';
                            for (var i = 0; i < displayCount; i++) {
                                var tr = triples[i];
                                var y = dataY + i * rowH;
                                var rowColor = i % 2 === 0 ? viz.colors.white : viz.colors.text;

                                ctx.fillStyle = rowColor;
                                ctx.fillText(tr.a.toString(), cols[0], y);
                                ctx.fillText(tr.b.toString(), cols[1], y);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(tr.c.toString(), cols[2], y);
                                ctx.fillStyle = rowColor;
                                ctx.fillText((tr.a * tr.a + tr.b * tr.b).toString(), cols[3], y);
                                ctx.fillStyle = viz.colors.purple;
                                ctx.fillText('(' + tr.m + ', ' + tr.n + ')', cols[4], y);
                                ctx.fillStyle = rowColor;
                                ctx.fillText((tr.c - tr.b).toString(), cols[5], y);
                            }

                            if (triples.length > maxRows) {
                                viz.screenText(
                                    '... and ' + (triples.length - maxRows) + ' more (increase window or decrease max c)',
                                    viz.width / 2, viz.height - 10, viz.colors.text, 10
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
                    question: 'The triple \\((9, 40, 41)\\) is a Pythagorean triple. Verify this, and determine whether it is primitive.',
                    hint: 'Check \\(9^2 + 40^2 = 41^2\\). For primitivity, compute \\(\\gcd(9, 40, 41)\\).',
                    solution: '\\(81 + 1600 = 1681 = 41^2\\). Since \\(\\gcd(9, 40) = 1\\) (9 is odd and not a factor of 40), the triple is primitive.'
                },
                {
                    question: 'Find all Pythagorean triples that are multiples of \\((3, 4, 5)\\) with \\(c \\leq 30\\).',
                    hint: 'Multiply \\((3, 4, 5)\\) by \\(k = 1, 2, 3, \\ldots\\) and stop when \\(5k > 30\\).',
                    solution: '\\(k=1\\): \\((3,4,5)\\). \\(k=2\\): \\((6,8,10)\\). \\(k=3\\): \\((9,12,15)\\). \\(k=4\\): \\((12,16,20)\\). \\(k=5\\): \\((15,20,25)\\). \\(k=6\\): \\((18,24,30)\\). That gives 6 triples total.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Generating Triples
        // ================================================================
        {
            id: 'sec-generating',
            title: 'Generating Triples',
            content: `
<h2>Generating Triples</h2>

<p>Is there a systematic way to produce <em>all</em> Pythagorean triples? The answer is yes, and the formula goes back at least to Euclid (circa 300 BCE).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.2 (Euclid's Formula)</div>
    <div class="env-body">
        <p>Let \\(m\\) and \\(n\\) be positive integers with \\(m > n\\). Then</p>
        \\[a = m^2 - n^2, \\quad b = 2mn, \\quad c = m^2 + n^2\\]
        <p>form a Pythagorean triple.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>We verify directly:</p>
        \\[
        a^2 + b^2 = (m^2 - n^2)^2 + (2mn)^2
        = m^4 - 2m^2 n^2 + n^4 + 4m^2 n^2
        = m^4 + 2m^2 n^2 + n^4
        = (m^2 + n^2)^2 = c^2.
        \\]
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Examples of the Formula</div>
    <div class="env-body">
        <table style="width:100%; text-align:center; border-collapse:collapse;">
            <tr style="border-bottom:2px solid #30363d;">
                <th style="padding:6px;">\\(m\\)</th>
                <th style="padding:6px;">\\(n\\)</th>
                <th style="padding:6px;">\\(m^2-n^2\\)</th>
                <th style="padding:6px;">\\(2mn\\)</th>
                <th style="padding:6px;">\\(m^2+n^2\\)</th>
                <th style="padding:6px;">Triple</th>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td>2</td><td>1</td><td>3</td><td>4</td><td>5</td><td>(3, 4, 5)</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td>3</td><td>2</td><td>5</td><td>12</td><td>13</td><td>(5, 12, 13)</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td>4</td><td>1</td><td>15</td><td>8</td><td>17</td><td>(8, 15, 17)</td>
            </tr>
            <tr style="border-bottom:1px solid #1a1a40;">
                <td>4</td><td>3</td><td>7</td><td>24</td><td>25</td><td>(7, 24, 25)</td>
            </tr>
            <tr>
                <td>5</td><td>2</td><td>21</td><td>20</td><td>29</td><td>(20, 21, 29)</td>
            </tr>
        </table>
    </div>
</div>

<p>The formula recovers every famous triple we listed! But does it produce <em>all</em> Pythagorean triples? Almost: it produces all <em>primitive</em> triples (under the right conditions on \\(m\\) and \\(n\\)), and all other triples are multiples of primitive ones.</p>

<div class="env-block intuition">
    <div class="env-title">Where Does the Formula Come From?</div>
    <div class="env-body">
        <p>Start with \\(a^2 + b^2 = c^2\\). Rearrange: \\(a^2 = c^2 - b^2 = (c - b)(c + b)\\). If we set \\(c - b = n^2\\) and \\(c + b = m^2\\) (or more carefully, work with rational points on the unit circle), the formula drops out. The algebraic identity \\((m^2 - n^2)^2 + (2mn)^2 = (m^2 + n^2)^2\\) encodes the geometry of the circle \\(x^2 + y^2 = 1\\) in the language of integers.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-triple-generator"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 4: viz-triple-generator — input m,n, generate triple
                // ============================================================
                {
                    id: 'viz-triple-generator',
                    title: 'Triple Generator: Euclid\'s Formula',
                    description: 'Choose values of m and n to generate a Pythagorean triple using Euclid\'s formula. Watch the computation unfold step by step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var mVal = 2, nVal = 1;
                        var animPhase = 5; // 0-4 = animated steps, 5 = all shown

                        VizEngine.createSlider(controls, 'm', 2, 12, mVal, 1, function(v) {
                            mVal = Math.round(v);
                            if (nVal >= mVal) nVal = mVal - 1;
                            animPhase = 5;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'n', 1, 11, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            if (nVal >= mVal) nVal = mVal - 1;
                            animPhase = 5;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate Steps', function() {
                            animPhase = 0;
                            var interval = setInterval(function() {
                                animPhase++;
                                draw();
                                if (animPhase >= 5) clearInterval(interval);
                            }, 700);
                            draw();
                        });

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var a = mVal * mVal - nVal * nVal;
                            var b = 2 * mVal * nVal;
                            var c = mVal * mVal + nVal * nVal;

                            // Title
                            viz.screenText("Euclid's Formula: Triple Generator", viz.width / 2, 22, viz.colors.white, 15);

                            // Parameters
                            var y = 60;
                            viz.screenText('m = ' + mVal, viz.width / 4, y, viz.colors.blue, 20);
                            viz.screenText('n = ' + nVal, 3 * viz.width / 4, y, viz.colors.teal, 20);

                            // Step-by-step computation
                            y = 100;
                            var steps = [
                                { label: 'm\u00B2 = ' + mVal + '\u00B2 = ' + (mVal * mVal), color: viz.colors.text },
                                { label: 'n\u00B2 = ' + nVal + '\u00B2 = ' + (nVal * nVal), color: viz.colors.text },
                                { label: 'a = m\u00B2 \u2212 n\u00B2 = ' + (mVal * mVal) + ' \u2212 ' + (nVal * nVal) + ' = ' + a, color: viz.colors.blue },
                                { label: 'b = 2mn = 2\u00B7' + mVal + '\u00B7' + nVal + ' = ' + b, color: viz.colors.teal },
                                { label: 'c = m\u00B2 + n\u00B2 = ' + (mVal * mVal) + ' + ' + (nVal * nVal) + ' = ' + c, color: viz.colors.orange }
                            ];

                            for (var i = 0; i < steps.length; i++) {
                                if (i <= animPhase) {
                                    viz.screenText(steps[i].label, viz.width / 2, y + i * 28, steps[i].color, 14);
                                }
                            }

                            // Result box
                            if (animPhase >= 4) {
                                y = 260;
                                // Sort a, b so a <= b
                                var aS = Math.min(a, b), bS = Math.max(a, b);

                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(viz.width / 2 - 150, y - 18, 300, 40);
                                viz.screenText(
                                    'Triple: (' + aS + ', ' + bS + ', ' + c + ')',
                                    viz.width / 2, y + 2, viz.colors.green, 18
                                );

                                // Verification
                                y += 50;
                                viz.screenText(
                                    'Check: ' + aS + '\u00B2 + ' + bS + '\u00B2 = ' + (aS*aS) + ' + ' + (bS*bS) + ' = ' + (aS*aS + bS*bS),
                                    viz.width / 2, y, viz.colors.white, 13
                                );
                                y += 22;
                                viz.screenText(
                                    c + '\u00B2 = ' + (c * c) + (aS*aS + bS*bS === c*c ? '  \u2713' : '  \u2717'),
                                    viz.width / 2, y, aS*aS + bS*bS === c*c ? viz.colors.green : viz.colors.red, 13
                                );

                                // Primitive check
                                y += 30;
                                var g = gcd(gcd(aS, bS), c);
                                var isPrimitive = g === 1;
                                var mMinusNOdd = (mVal - nVal) % 2 === 1;
                                var coprime = gcd(mVal, nVal) === 1;
                                viz.screenText(
                                    'gcd(m,n) = ' + gcd(mVal, nVal) +
                                    ',  m\u2212n = ' + (mVal - nVal) + ' (' + (mMinusNOdd ? 'odd' : 'even') + ')',
                                    viz.width / 2, y, viz.colors.text, 12
                                );
                                y += 20;
                                if (isPrimitive) {
                                    viz.screenText('Primitive triple!', viz.width / 2, y, viz.colors.purple, 13);
                                } else {
                                    viz.screenText(
                                        'Not primitive: divisible by ' + g,
                                        viz.width / 2, y, viz.colors.orange, 13
                                    );
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
                    question: 'Use Euclid\'s formula with \\(m = 5, n = 4\\) to generate a Pythagorean triple. Is it primitive?',
                    hint: 'Compute \\(a = m^2 - n^2\\), \\(b = 2mn\\), \\(c = m^2 + n^2\\). For primitivity, check \\(\\gcd(m,n)\\) and the parity of \\(m - n\\).',
                    solution: '\\(a = 25 - 16 = 9\\), \\(b = 40\\), \\(c = 41\\). Triple: \\((9, 40, 41)\\). Since \\(\\gcd(5, 4) = 1\\) and \\(m - n = 1\\) is odd, this is a primitive triple. Check: \\(81 + 1600 = 1681 = 41^2\\). \\(\\checkmark\\)'
                },
                {
                    question: 'For which values of \\(m\\) and \\(n\\) does Euclid\'s formula produce the triple \\((20, 21, 29)\\)?',
                    hint: 'We need \\(m^2 + n^2 = 29\\) and \\(m > n > 0\\). Try small values.',
                    solution: 'We need \\(m^2 + n^2 = 29\\). Trying: \\(m = 5, n = 2\\) gives \\(25 + 4 = 29\\). Check: \\(a = 25 - 4 = 21\\), \\(b = 20\\), \\(c = 29\\). After reordering, \\((20, 21, 29)\\). \\(\\checkmark\\)'
                },
            ]
        },

        // ================================================================
        // SECTION 5: Primitive Triples
        // ================================================================
        {
            id: 'sec-primitive',
            title: 'Primitive Triples',
            content: `
<h2>Primitive Triples</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Primitive Pythagorean Triple)</div>
    <div class="env-body">
        <p>A Pythagorean triple \\((a, b, c)\\) is called <strong>primitive</strong> if \\(\\gcd(a, b, c) = 1\\), that is, the three numbers share no common factor greater than 1.</p>
    </div>
</div>

<p>Every Pythagorean triple is either primitive or a multiple of a primitive one. If \\(\\gcd(a, b, c) = d > 1\\), then \\((a/d, b/d, c/d)\\) is a primitive triple, and \\((a, b, c) = d \\cdot (a/d, b/d, c/d)\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 14.3 (Classification of Primitive Triples)</div>
    <div class="env-body">
        <p>Every primitive Pythagorean triple \\((a, b, c)\\) with \\(a\\) odd and \\(b\\) even can be written as</p>
        \\[a = m^2 - n^2, \\quad b = 2mn, \\quad c = m^2 + n^2\\]
        <p>where \\(m > n > 0\\), \\(\\gcd(m, n) = 1\\), and \\(m - n\\) is odd.</p>
        <p>Conversely, every such choice of \\(m\\) and \\(n\\) produces a primitive triple.</p>
    </div>
</div>

<p>The three conditions on \\(m\\) and \\(n\\) are all necessary:</p>
<ul>
    <li>\\(m > n > 0\\) ensures \\(a, b, c > 0\\).</li>
    <li>\\(\\gcd(m, n) = 1\\) ensures the triple is primitive (not a scaled copy).</li>
    <li>\\(m - n\\) odd ensures \\(a\\) is odd and \\(b\\) is even (if \\(m - n\\) were even, both \\(m\\) and \\(n\\) would have the same parity, making \\(a\\), \\(b\\), and \\(c\\) all even).</li>
</ul>

<div class="env-block example">
    <div class="env-title">Why gcd(m,n) = 1 matters</div>
    <div class="env-body">
        <p>Take \\(m = 4, n = 2\\). Then \\(\\gcd(4, 2) = 2\\). The formula gives \\(a = 12, b = 16, c = 20\\), which is \\(4 \\times (3, 4, 5)\\). Not primitive!</p>
        <p>Now take \\(m = 3, n = 2\\). Then \\(\\gcd(3, 2) = 1\\) and \\(m - n = 1\\) (odd). We get \\(a = 5, b = 12, c = 13\\). This is primitive. \\(\\checkmark\\)</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Counting Primitive Triples</div>
    <div class="env-body">
        <p>There are exactly 16 primitive Pythagorean triples with \\(c \\leq 100\\). The number of primitive triples with \\(c \\leq N\\) grows roughly like \\(N / \\pi\\), a fact connected to the distribution of lattice points near the unit circle. This is another instance of \\(\\pi\\) appearing in a purely number-theoretic context!</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pythagorean-tree"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 5: viz-pythagorean-tree — Berggren tree
                // ============================================================
                {
                    id: 'viz-pythagorean-tree',
                    title: 'The Berggren Tree of Primitive Triples',
                    description: 'Every primitive Pythagorean triple can be reached from (3,4,5) by applying three matrix transformations. This tree shows the first few generations.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 460,
                            originX: 0, originY: 0, scale: 1
                        });

                        var depth = 3;
                        VizEngine.createSlider(controls, 'Depth', 1, 4, depth, 1, function(v) {
                            depth = Math.round(v);
                            draw();
                        });

                        // Berggren matrices (column-major multiplication on [a,b,c])
                        var A = [[1,-2,2],[2,-1,2],[2,-2,3]];
                        var B = [[1,2,2],[2,1,2],[2,2,3]];
                        var C = [[-1,2,2],[-2,1,2],[-2,2,3]];

                        function matVec3(M, v) {
                            return [
                                M[0][0]*v[0] + M[0][1]*v[1] + M[0][2]*v[2],
                                M[1][0]*v[0] + M[1][1]*v[1] + M[1][2]*v[2],
                                M[2][0]*v[0] + M[2][1]*v[1] + M[2][2]*v[2]
                            ];
                        }

                        function buildTree(triple, d) {
                            var node = { triple: triple, children: [] };
                            if (d <= 0) return node;
                            var childA = matVec3(A, triple);
                            var childB = matVec3(B, triple);
                            var childC = matVec3(C, triple);
                            // Ensure a <= b
                            [childA, childB, childC].forEach(function(ch) {
                                if (ch[0] > ch[1]) { var tmp = ch[0]; ch[0] = ch[1]; ch[1] = tmp; }
                            });
                            node.children.push(buildTree(childA, d - 1));
                            node.children.push(buildTree(childB, d - 1));
                            node.children.push(buildTree(childC, d - 1));
                            return node;
                        }

                        function countNodes(node) {
                            var c = 1;
                            for (var i = 0; i < node.children.length; i++) c += countNodes(node.children[i]);
                            return c;
                        }

                        function layoutTree(node, x, y, spread, levelH, positions) {
                            positions.push({ x: x, y: y, triple: node.triple, children: [] });
                            var parentIdx = positions.length - 1;
                            if (node.children.length > 0) {
                                var childSpread = spread / 3;
                                var offsets = [-spread, 0, spread];
                                for (var i = 0; i < node.children.length; i++) {
                                    var childIdx = positions.length;
                                    positions[parentIdx].children.push(childIdx);
                                    layoutTree(node.children[i], x + offsets[i], y + levelH, childSpread, levelH, positions);
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var root = buildTree([3, 4, 5], depth);
                            var total = countNodes(root);

                            viz.screenText('Berggren Tree of Primitive Triples', viz.width / 2, 18, viz.colors.white, 14);
                            viz.screenText(total + ' triples at depth ' + depth, viz.width / 2, 36, viz.colors.teal, 11);

                            var positions = [];
                            var topY = 65;
                            var levelH = (viz.height - topY - 30) / (depth + 1);
                            var spread = viz.width * 0.35;
                            layoutTree(root, viz.width / 2, topY, spread, levelH, positions);

                            // Draw edges first
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1.5;
                            for (var i = 0; i < positions.length; i++) {
                                var p = positions[i];
                                for (var j = 0; j < p.children.length; j++) {
                                    var ch = positions[p.children[j]];
                                    ctx.beginPath();
                                    ctx.moveTo(p.x, p.y + 10);
                                    ctx.lineTo(ch.x, ch.y - 10);
                                    ctx.stroke();
                                }
                            }

                            // Draw nodes
                            for (var k = 0; k < positions.length; k++) {
                                var pos = positions[k];
                                var triStr = '(' + pos.triple[0] + ',' + pos.triple[1] + ',' + pos.triple[2] + ')';
                                var fontSize = depth <= 2 ? 11 : (depth <= 3 ? 9 : 7);

                                // Background pill
                                ctx.fillStyle = k === 0 ? viz.colors.blue + '44' : viz.colors.purple + '22';
                                var pillW = triStr.length * (fontSize * 0.55) + 8;
                                var pillH = fontSize + 8;
                                ctx.beginPath();
                                ctx.roundRect(pos.x - pillW / 2, pos.y - pillH / 2, pillW, pillH, 4);
                                ctx.fill();

                                ctx.font = fontSize + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = k === 0 ? viz.colors.blue : viz.colors.white;
                                ctx.fillText(triStr, pos.x, pos.y);
                            }

                            // Legend
                            viz.screenText(
                                'Root: (3,4,5). Each node spawns 3 children via matrix multiplication.',
                                viz.width / 2, viz.height - 10, viz.colors.text, 10
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that in any primitive Pythagorean triple \\((a, b, c)\\), exactly one of \\(a, b\\) is divisible by 3.',
                    hint: 'Consider \\(a^2 + b^2 \\equiv 0 \\pmod{9}\\). What are the possible values of \\(x^2 \\pmod{3}\\)?',
                    solution: 'Squares modulo 3 are 0 or 1. If neither \\(a\\) nor \\(b\\) is divisible by 3, then \\(a^2 + b^2 \\equiv 1 + 1 = 2 \\pmod{3}\\), so \\(c^2 \\equiv 2 \\pmod{3}\\). But 2 is not a quadratic residue mod 3, contradiction. So at least one of \\(a, b\\) is divisible by 3. If both were, then \\(9 \\mid c^2\\) so \\(3 \\mid c\\), contradicting \\(\\gcd(a,b,c)=1\\). Hence exactly one.'
                },
                {
                    question: 'Show that in any primitive Pythagorean triple, \\(c\\) is always odd.',
                    hint: 'In a primitive triple, \\(a\\) and \\(b\\) have different parity (one odd, one even). What parity does \\(a^2 + b^2\\) have?',
                    solution: 'In a primitive triple, exactly one of \\(a,b\\) is even and the other is odd (if both even, gcd \\(\\geq 2\\); both odd is impossible as shown in Section 2). So \\(a^2 + b^2 = \\text{odd} + \\text{even} = \\text{odd}\\), hence \\(c^2\\) is odd, so \\(c\\) is odd.'
                },
            ]
        },

        // ================================================================
        // SECTION 6: Fermat's Last Theorem Preview
        // ================================================================
        {
            id: 'sec-bridge',
            title: "Fermat's Last Theorem Preview",
            content: `
<h2>Fermat's Last Theorem: A Preview</h2>

<p>We have seen that the equation \\(a^2 + b^2 = c^2\\) has infinitely many solutions in positive integers. A natural question arises: what about higher powers?</p>

<div class="env-block definition">
    <div class="env-title">Fermat's Last Theorem</div>
    <div class="env-body">
        <p>The equation</p>
        \\[a^n + b^n = c^n\\]
        <p>has <strong>no solutions</strong> in positive integers \\(a, b, c\\) when \\(n \\geq 3\\).</p>
    </div>
</div>

<p>Pierre de Fermat wrote this conjecture around 1637 in the margin of his copy of Diophantus's <em>Arithmetica</em>, adding the famous remark: "I have discovered a truly marvelous proof of this, which this margin is too narrow to contain." Whether Fermat actually had a correct proof is doubtful; the result resisted all attempts for over 350 years.</p>

<div class="env-block remark">
    <div class="env-title">A Timeline of Attempts</div>
    <div class="env-body">
        <ul>
            <li><strong>1637:</strong> Fermat states the conjecture.</li>
            <li><strong>1753:</strong> Euler proves the case \\(n = 3\\) (no integer solutions for cubes).</li>
            <li><strong>1825:</strong> Dirichlet and Legendre prove \\(n = 5\\).</li>
            <li><strong>1839:</strong> Lam&eacute; proves \\(n = 7\\).</li>
            <li><strong>1847:</strong> Kummer's work on ideal numbers handles many more cases but not all.</li>
            <li><strong>1995:</strong> Andrew Wiles, building on work of Frey, Serre, Ribet, and others, proves the full theorem by establishing the modularity of semistable elliptic curves. The proof is 129 pages long and uses mathematics far beyond what Fermat could have known.</li>
        </ul>
    </div>
</div>

<p>The contrast is striking: for \\(n = 2\\) there are infinitely many solutions (Pythagorean triples), parametrized by a beautiful formula. For \\(n \\geq 3\\), there are none at all. The jump from "infinitely many" to "zero" at \\(n = 3\\) is one of the most dramatic phenomena in all of mathematics.</p>

<div class="env-block intuition">
    <div class="env-title">Why Is n = 2 Special?</div>
    <div class="env-body">
        <p>For \\(n = 2\\), the equation \\(x^2 + y^2 = z^2\\) defines a cone in three-dimensional space, and any line through the origin that passes through one rational point passes through infinitely many. This is why we can parametrize all solutions. For \\(n \\geq 3\\), the Fermat curve \\(x^n + y^n = 1\\) has genus \\(\\geq 1\\), and a deep theorem of Faltings (1983) says that any curve of genus \\(\\geq 2\\) has only finitely many rational points. The case \\(n \\geq 3\\) of Fermat's Last Theorem strengthens "finitely many" to "zero."</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fermat-preview"></div>
`,
            visualizations: [
                // ============================================================
                // VIZ 6: viz-fermat-preview — Fermat's Last Theorem timeline
                // ============================================================
                {
                    id: 'viz-fermat-preview',
                    title: "Fermat's Last Theorem: Historical Timeline",
                    description: 'A visual history of attempts to prove Fermat\'s Last Theorem, from 1637 to Wiles\'s proof in 1995. For n=2, infinitely many solutions exist; for n>2, none.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nPow = 2;
                        VizEngine.createSlider(controls, 'n (exponent)', 2, 6, nPow, 1, function(v) {
                            nPow = Math.round(v);
                            draw();
                        });

                        var events = [
                            { year: 1637, text: 'Fermat states conjecture', color: 'orange' },
                            { year: 1753, text: 'Euler proves n=3', color: 'blue' },
                            { year: 1825, text: 'Dirichlet/Legendre: n=5', color: 'blue' },
                            { year: 1839, text: 'Lam\u00E9 proves n=7', color: 'blue' },
                            { year: 1847, text: 'Kummer: ideal numbers', color: 'purple' },
                            { year: 1983, text: 'Faltings: finite rational pts', color: 'teal' },
                            { year: 1995, text: 'Wiles proves FLT!', color: 'green' }
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText("Fermat's Last Theorem", viz.width / 2, 20, viz.colors.white, 16);

                            // Equation display
                            var eqText = 'a' + (nPow > 1 ? superscript(nPow) : '') +
                                ' + b' + (nPow > 1 ? superscript(nPow) : '') +
                                ' = c' + (nPow > 1 ? superscript(nPow) : '');
                            viz.screenText(eqText, viz.width / 2, 48, viz.colors.orange, 20);

                            // Status
                            if (nPow === 2) {
                                viz.screenText(
                                    'Infinitely many solutions! (Pythagorean triples)',
                                    viz.width / 2, 74, viz.colors.green, 14
                                );

                                // Show some triples
                                var triples = ['(3,4,5)', '(5,12,13)', '(8,15,17)', '(7,24,25)', '...'];
                                viz.screenText(triples.join('   '), viz.width / 2, 98, viz.colors.teal, 12);
                            } else {
                                viz.screenText(
                                    'NO solutions in positive integers (Fermat\'s Last Theorem)',
                                    viz.width / 2, 74, viz.colors.red, 14
                                );

                                // Show attempted triples that fail
                                var near = [];
                                for (var aa = 1; aa <= 10; aa++) {
                                    for (var bb = aa; bb <= 10; bb++) {
                                        var s = Math.pow(aa, nPow) + Math.pow(bb, nPow);
                                        var cc = Math.round(Math.pow(s, 1/nPow));
                                        if (Math.abs(Math.pow(cc, nPow) - s) <= 2 && Math.pow(cc, nPow) !== s) {
                                            near.push('(' + aa + ',' + bb + '): ' + aa + sup(nPow) + '+' + bb + sup(nPow) + '=' + s + ' \u2260 ' + cc + sup(nPow) + '=' + Math.pow(cc, nPow));
                                        }
                                    }
                                }
                                for (var ni = 0; ni < Math.min(near.length, 2); ni++) {
                                    viz.screenText(near[ni], viz.width / 2, 98 + ni * 18, viz.colors.text, 10);
                                }
                            }

                            // Timeline
                            var tlY = 155;
                            var tlBottom = viz.height - 20;
                            var minYear = 1630, maxYear = 2000;
                            var tlLeft = 80, tlRight = viz.width - 40;

                            // Timeline axis
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(tlLeft, tlY + 10);
                            ctx.lineTo(tlRight, tlY + 10);
                            ctx.stroke();

                            // Year ticks
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = viz.colors.text;
                            for (var yr = 1650; yr <= 2000; yr += 50) {
                                var xPos = tlLeft + (yr - minYear) / (maxYear - minYear) * (tlRight - tlLeft);
                                ctx.beginPath();
                                ctx.moveTo(xPos, tlY + 6);
                                ctx.lineTo(xPos, tlY + 14);
                                ctx.stroke();
                                ctx.fillText(yr.toString(), xPos, tlY + 16);
                            }

                            // Events
                            for (var e = 0; e < events.length; e++) {
                                var ev = events[e];
                                var ex = tlLeft + (ev.year - minYear) / (maxYear - minYear) * (tlRight - tlLeft);
                                var ey = tlY + 40 + (e % 2) * 90 + e * 8;
                                var col = viz.colors[ev.color] || viz.colors.white;

                                // Vertical line from timeline to event
                                ctx.strokeStyle = col + '66';
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(ex, tlY + 10);
                                ctx.lineTo(ex, ey - 8);
                                ctx.stroke();

                                // Dot on timeline
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(ex, tlY + 10, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Event text
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillStyle = col;
                                ctx.fillText(ev.year.toString(), ex, ey - 6);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                // Wrap text
                                var words = ev.text.split(' ');
                                var line = '';
                                var lineY = ey + 8;
                                for (var w = 0; w < words.length; w++) {
                                    var testLine = line + (line ? ' ' : '') + words[w];
                                    if (ctx.measureText(testLine).width > 80 && line) {
                                        ctx.fillText(line, ex, lineY);
                                        line = words[w];
                                        lineY += 12;
                                    } else {
                                        line = testLine;
                                    }
                                }
                                if (line) ctx.fillText(line, ex, lineY);
                            }
                        }

                        function superscript(n) {
                            var sups = {0:'\u2070',1:'\u00B9',2:'\u00B2',3:'\u00B3',4:'\u2074',5:'\u2075',6:'\u2076',7:'\u2077',8:'\u2078',9:'\u2079'};
                            return String(n).split('').map(function(d) { return sups[d] || d; }).join('');
                        }
                        var sup = superscript;

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show by direct computation that \\(1^3 + 2^3 = 9\\), but \\(9\\) is not a perfect cube. Then check \\(2^3 + 3^3\\).',
                    hint: 'Compute each sum and check whether the result is \\(k^3\\) for some integer \\(k\\).',
                    solution: '\\(1^3 + 2^3 = 1 + 8 = 9\\). The cube root of 9 is approximately 2.08, not an integer. \\(2^3 + 3^3 = 8 + 27 = 35\\). The cube root of 35 is approximately 3.27, not an integer. Neither gives a solution to \\(a^3 + b^3 = c^3\\).'
                },
                {
                    question: 'Prove that if \\(n = 4\\), Fermat\'s Last Theorem follows from a slightly different statement: the equation \\(a^4 + b^4 = c^2\\) has no positive integer solutions.',
                    hint: 'If \\(a^4 + b^4 = c^4\\), set \\(c^4 = (c^2)^2\\).',
                    solution: 'If \\(a^4 + b^4 = c^4\\), then \\(a^4 + b^4 = (c^2)^2\\), so \\((a, b, c^2)\\) is a solution of \\(x^4 + y^4 = z^2\\). If the latter has no solutions, neither does \\(a^4 + b^4 = c^4\\). Fermat himself proved that \\(x^4 + y^4 = z^2\\) has no positive integer solutions using his method of infinite descent.'
                }
            ]
        }
    ]
});
