window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'Fibonacci Numbers',
    subtitle: 'The sequence that appears everywhere in nature',
    sections: [
        // ================================================================
        // SECTION 1: Fibonacci's Rabbits
        // ================================================================
        {
            id: 'sec-motivation',
            title: "Fibonacci's Rabbits",
            content: `
<h2>Fibonacci's Rabbits</h2>

<div class="env-block intuition">
    <div class="env-title">A Medieval Puzzle</div>
    <div class="env-body">
        <p>In 1202, the Italian mathematician Leonardo of Pisa (known as Fibonacci) posed a question in his book <em>Liber Abaci</em>:</p>
        <p><strong>A man puts a pair of rabbits in a place surrounded by a wall. How many pairs of rabbits will there be after one year?</strong></p>
        <p>The rules are simple: each pair of rabbits produces a new pair every month, but a pair only starts breeding after its first month of life. No rabbits die.</p>
    </div>
</div>

<p>Let us trace through the months carefully:</p>

<ul>
    <li><strong>Month 1:</strong> 1 pair (the original, still young)</li>
    <li><strong>Month 2:</strong> 1 pair (the original is now mature, but hasn't bred yet)</li>
    <li><strong>Month 3:</strong> 2 pairs (the original breeds, producing 1 new pair)</li>
    <li><strong>Month 4:</strong> 3 pairs (only the original breeds again; the first offspring is still young)</li>
    <li><strong>Month 5:</strong> 5 pairs (both the original and its first offspring breed)</li>
    <li><strong>Month 6:</strong> 8 pairs (three mature pairs breed)</li>
</ul>

<p>The pattern of pair counts is: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...</p>

<p>Each number is the sum of the two before it. This is the <strong>Fibonacci sequence</strong>, one of the most famous sequences in all of mathematics.</p>

<div class="env-block remark">
    <div class="env-title">Why the Rule Works</div>
    <div class="env-body">
        <p>In any given month, the total number of pairs equals the pairs alive last month (none die) plus the new pairs born this month. The new pairs born equal the number of mature pairs, which is the number of pairs alive two months ago (since each pair takes one month to mature). So the count in month \\(n\\) equals the count in month \\(n-1\\) plus the count in month \\(n-2\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rabbit-problem"></div>
`,
            visualizations: [
                {
                    id: 'viz-rabbit-problem',
                    title: "Fibonacci's Original Rabbit Problem",
                    description: "Watch the rabbit population grow month by month. Young pairs (gold) mature into breeding pairs (blue) that produce new young pairs each month.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var month = 1;
                        var maxMonth = 12;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Month', 1, maxMonth, month, 1, function(v) {
                            month = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            month = 1;
                            function step() {
                                draw();
                                if (month < maxMonth) {
                                    month++;
                                    setTimeout(step, 600);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        function fib(n) {
                            if (n <= 2) return 1;
                            var a = 1, b = 1;
                            for (var i = 3; i <= n; i++) {
                                var c = a + b;
                                a = b;
                                b = c;
                            }
                            return b;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText("Fibonacci's Rabbit Problem", viz.width / 2, 20, viz.colors.white, 15);

                            var young = month <= 1 ? 1 : fib(month - 2 + 1) - (month >= 3 ? fib(month - 2) : 0);
                            var total = fib(month);
                            var mature = month <= 1 ? 0 : fib(month - 1);
                            young = total - mature;

                            // Draw timeline bar
                            var barY = 55;
                            var barLeft = 60;
                            var barRight = viz.width - 30;
                            var barW = barRight - barLeft;
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(barLeft, barY);
                            ctx.lineTo(barRight, barY);
                            ctx.stroke();

                            for (var m = 1; m <= maxMonth; m++) {
                                var mx = barLeft + (m - 1) / (maxMonth - 1) * barW;
                                var isCurrent = (m === month);
                                ctx.fillStyle = isCurrent ? viz.colors.blue : viz.colors.text;
                                ctx.font = (isCurrent ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText(m.toString(), mx, barY + 5);
                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.beginPath();
                                    ctx.arc(mx, barY, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                } else {
                                    ctx.fillStyle = viz.colors.grid;
                                    ctx.beginPath();
                                    ctx.arc(mx, barY, 3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Draw rabbits as circles
                            var area = viz.width * (viz.height - 120);
                            var maxR = 18;
                            var r = Math.min(maxR, Math.max(6, Math.sqrt(area / (total * 12))));
                            var cols = Math.floor((viz.width - 40) / (r * 2.5));
                            var startY = 95;
                            var startX = 30;

                            // Draw mature pairs first, then young
                            var idx = 0;
                            for (var p = 0; p < total; p++) {
                                var col = p % cols;
                                var row = Math.floor(p / cols);
                                var px = startX + col * (r * 2.5) + r;
                                var py = startY + row * (r * 2.5) + r;
                                var isMature = p < mature;

                                ctx.fillStyle = isMature ? viz.colors.blue + 'cc' : viz.colors.yellow + 'cc';
                                ctx.beginPath();
                                ctx.arc(px, py, r - 1, 0, Math.PI * 2);
                                ctx.fill();

                                // Rabbit ears (two small arcs)
                                ctx.fillStyle = isMature ? viz.colors.blue : viz.colors.yellow;
                                ctx.beginPath();
                                ctx.ellipse(px - r * 0.35, py - r * 0.8, r * 0.2, r * 0.45, -0.2, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.beginPath();
                                ctx.ellipse(px + r * 0.35, py - r * 0.8, r * 0.2, r * 0.45, 0.2, 0, Math.PI * 2);
                                ctx.fill();

                                // Eyes
                                ctx.fillStyle = viz.colors.bg;
                                ctx.beginPath();
                                ctx.arc(px - r * 0.25, py - r * 0.1, r * 0.1, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.beginPath();
                                ctx.arc(px + r * 0.25, py - r * 0.1, r * 0.1, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Legend and counts
                            var legendY = viz.height - 40;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.arc(viz.width / 2 - 120, legendY, 7, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('Mature: ' + mature, viz.width / 2 - 95, legendY, viz.colors.blue, 12, 'left');

                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath();
                            ctx.arc(viz.width / 2 + 20, legendY, 7, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('Young: ' + young, viz.width / 2 + 45, legendY, viz.colors.yellow, 12, 'left');

                            viz.screenText('Month ' + month + ':  F(' + month + ') = ' + total + ' pairs',
                                viz.width / 2, legendY - 22, viz.colors.white, 14);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Following Fibonacci's rabbit rules, how many pairs are there after 10 months? List the count for each month.",
                    hint: 'Start with 1, 1, then each new count is the sum of the previous two.',
                    solution: 'Month 1: 1, Month 2: 1, Month 3: 2, Month 4: 3, Month 5: 5, Month 6: 8, Month 7: 13, Month 8: 21, Month 9: 34, Month 10: 55. So there are 55 pairs after 10 months.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The Fibonacci Sequence
        // ================================================================
        {
            id: 'sec-sequence',
            title: 'The Fibonacci Sequence',
            content: `
<h2>The Fibonacci Sequence</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Fibonacci Numbers)</div>
    <div class="env-body">
        <p>The <strong>Fibonacci sequence</strong> \\(F_1, F_2, F_3, \\ldots\\) is defined by:</p>
        \\[F_1 = 1, \\quad F_2 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\text{ for } n \\geq 3.\\]
        <p>The first several terms are: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, ...</p>
    </div>
</div>

<p>This is a <strong>recurrence relation</strong>: each term is determined by the two terms before it. Once you know any two consecutive Fibonacci numbers, you can compute all the ones that follow.</p>

<div class="env-block remark">
    <div class="env-title">Convention</div>
    <div class="env-body">
        <p>Some authors start with \\(F_0 = 0, F_1 = 1\\). This is equivalent; it just shifts the indexing by one. In this chapter we use \\(F_1 = 1, F_2 = 1\\).</p>
    </div>
</div>

<p>The Fibonacci numbers grow surprisingly fast. The sequence roughly doubles every 4 or 5 terms:</p>

<ul>
    <li>\\(F_{10} = 55\\)</li>
    <li>\\(F_{20} = 6{,}765\\)</li>
    <li>\\(F_{30} = 832{,}040\\)</li>
    <li>\\(F_{40} = 102{,}334{,}155\\)</li>
</ul>

<p>The exact rate of growth is governed by the <strong>golden ratio</strong>, which we will explore in the next section.</p>

<div class="env-block example">
    <div class="env-title">Example: Building the Sequence</div>
    <div class="env-body">
        <p>To find \\(F_8\\), we build up step by step:</p>
        \\[1, 1, 2, 3, 5, 8, 13, 21\\]
        <p>So \\(F_8 = 21\\). Each number is obtained by adding the two before it: \\(13 + 8 = 21\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fibonacci-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-fibonacci-builder',
                    title: 'Build the Fibonacci Sequence',
                    description: 'Watch the sequence grow step by step. Each new term is the sum of the previous two, shown with animated arcs connecting the addends.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nTerms = 10;
                        var animStep = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Terms', 3, 20, nTerms, 1, function(v) {
                            nTerms = Math.round(v);
                            animStep = nTerms;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 2;
                            function step() {
                                draw();
                                if (animStep < nTerms) {
                                    animStep++;
                                    setTimeout(step, 400);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        function fibSeq(n) {
                            var seq = [1, 1];
                            for (var i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
                            return seq;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var seq = fibSeq(nTerms);
                            var shown = Math.min(animStep, nTerms);

                            viz.screenText('Building the Fibonacci Sequence', viz.width / 2, 20, viz.colors.white, 15);

                            // Layout: boxes in rows
                            var boxW = Math.min(65, (viz.width - 40) / Math.min(shown, 8));
                            var boxH = 40;
                            var gap = 6;
                            var cols = Math.min(shown, Math.floor((viz.width - 40) / (boxW + gap)));
                            var rows = Math.ceil(shown / cols);
                            var startX = (viz.width - cols * (boxW + gap) + gap) / 2;
                            var startY = 60;

                            for (var i = 0; i < shown; i++) {
                                var col = i % cols;
                                var row = Math.floor(i / cols);
                                var bx = startX + col * (boxW + gap);
                                var by = startY + row * (boxH + 30);

                                var isNew = (i === shown - 1 && shown > 2);
                                var color = isNew ? viz.colors.teal : viz.colors.blue;

                                // Box
                                ctx.strokeStyle = color;
                                ctx.lineWidth = isNew ? 2.5 : 1.5;
                                ctx.strokeRect(bx, by, boxW, boxH);
                                if (isNew) {
                                    ctx.fillStyle = color + '22';
                                    ctx.fillRect(bx, by, boxW, boxH);
                                }

                                // Index
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText('F' + (i + 1), bx + boxW / 2, by - 2);

                                // Value
                                ctx.fillStyle = color;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(seq[i].toString(), bx + boxW / 2, by + boxH / 2);

                                // Draw addition arc for current new term
                                if (isNew && i >= 2) {
                                    var prevCol1 = (i - 1) % cols;
                                    var prevRow1 = Math.floor((i - 1) / cols);
                                    var prevCol2 = (i - 2) % cols;
                                    var prevRow2 = Math.floor((i - 2) / cols);
                                    var px1 = startX + prevCol1 * (boxW + gap) + boxW / 2;
                                    var py1 = startY + prevRow1 * (boxH + 30) + boxH;
                                    var px2 = startX + prevCol2 * (boxW + gap) + boxW / 2;
                                    var py2 = startY + prevRow2 * (boxH + 30) + boxH;
                                    var tx = bx + boxW / 2;
                                    var ty = by;

                                    // Arc from prev two to current
                                    ctx.strokeStyle = viz.colors.orange + 'aa';
                                    ctx.lineWidth = 1.5;
                                    ctx.setLineDash([4, 3]);
                                    ctx.beginPath();
                                    ctx.moveTo(px2, py2 + 2);
                                    ctx.quadraticCurveTo((px2 + tx) / 2, Math.max(py2, ty) + 20, tx - 5, ty + 2);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(px1, py1 + 2);
                                    ctx.quadraticCurveTo((px1 + tx) / 2, Math.max(py1, ty) + 15, tx + 5, ty + 2);
                                    ctx.stroke();
                                    ctx.setLineDash([]);

                                    // Sum label
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    var sumLabel = seq[i - 2] + ' + ' + seq[i - 1] + ' = ' + seq[i];
                                    ctx.fillText(sumLabel, tx, by + boxH + 4);
                                }
                            }

                            // Summary at bottom
                            viz.screenText('Showing ' + shown + ' of ' + nTerms + ' terms',
                                viz.width / 2, viz.height - 20, viz.colors.text, 12);
                        }
                        animStep = nTerms;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(F_{15}\\). Show your work by building up from \\(F_1\\).',
                    hint: 'Write out all Fibonacci numbers from \\(F_1\\) to \\(F_{15}\\), each time adding the previous two.',
                    solution: '\\(1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610\\). So \\(F_{15} = 610\\).'
                },
                {
                    question: 'If \\(F_n = 89\\) and \\(F_{n+1} = 144\\), what is \\(n\\)? What is \\(F_{n+2}\\)?',
                    hint: 'Look up which index gives 89 in the sequence, then add the two known values.',
                    solution: 'Since \\(F_{11} = 89\\), we have \\(n = 11\\). Then \\(F_{13} = F_{12} + F_{11} = 144 + 89 = 233\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Golden Ratio
        // ================================================================
        {
            id: 'sec-golden',
            title: 'The Golden Ratio',
            content: `
<h2>The Golden Ratio</h2>

<p>Something remarkable happens when we look at the <em>ratios</em> of consecutive Fibonacci numbers:</p>

\\[
\\frac{F_2}{F_1} = \\frac{1}{1} = 1, \\quad
\\frac{F_3}{F_2} = \\frac{2}{1} = 2, \\quad
\\frac{F_4}{F_3} = \\frac{3}{2} = 1.5, \\quad
\\frac{F_5}{F_4} = \\frac{5}{3} \\approx 1.667, \\quad \\ldots
\\]

<p>These ratios bounce around but settle down, converging to a special number:</p>

\\[
\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.6180339887\\ldots
\\]

<p>This is the <strong>golden ratio</strong>, often denoted by the Greek letter phi (\\(\\varphi\\)).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.1</div>
    <div class="env-body">
        <p>The ratio of consecutive Fibonacci numbers converges to the golden ratio:</p>
        \\[\\lim_{n \\to \\infty} \\frac{F_{n+1}}{F_n} = \\varphi = \\frac{1 + \\sqrt{5}}{2}.\\]
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why \\(\\varphi\\)?</div>
    <div class="env-body">
        <p>If the ratio \\(F_{n+1}/F_n\\) approaches some limit \\(L\\), then from the recurrence \\(F_{n+1} = F_n + F_{n-1}\\) we get:</p>
        \\[L = 1 + \\frac{1}{L}\\]
        <p>Multiplying through: \\(L^2 = L + 1\\), or \\(L^2 - L - 1 = 0\\). The positive root is \\(L = \\frac{1 + \\sqrt{5}}{2} = \\varphi\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Golden Ratio)</div>
    <div class="env-body">
        <p>The <strong>golden ratio</strong> is the positive root of \\(x^2 - x - 1 = 0\\):</p>
        \\[\\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618034.\\]
        <p>Its conjugate is \\(\\hat{\\varphi} = \\frac{1 - \\sqrt{5}}{2} \\approx -0.618034\\). Note that \\(\\varphi \\cdot \\hat{\\varphi} = -1\\) and \\(\\varphi + \\hat{\\varphi} = 1\\).</p>
    </div>
</div>

<p>The golden ratio has the remarkable property that \\(\\varphi^2 = \\varphi + 1\\). This means you can always replace \\(\\varphi^2\\) with \\(\\varphi + 1\\), which makes computing powers of \\(\\varphi\\) surprisingly simple.</p>

<div class="viz-placeholder" data-viz="viz-golden-ratio-convergence"></div>
`,
            visualizations: [
                {
                    id: 'viz-golden-ratio-convergence',
                    title: 'Convergence to the Golden Ratio',
                    description: 'Watch the ratio \\(F_{n+1}/F_n\\) converge to \\(\\varphi \\approx 1.618\\). The ratios alternate above and below, spiraling in toward the golden ratio.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 60, originY: 340, scale: 1
                        });

                        var nMax = 15;
                        var animStep = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Terms', 3, 25, nMax, 1, function(v) {
                            nMax = Math.round(v);
                            animStep = nMax;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 2;
                            function step() {
                                draw();
                                if (animStep < nMax) {
                                    animStep++;
                                    setTimeout(step, 350);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        function fibSeq(n) {
                            var seq = [1, 1];
                            for (var i = 2; i < n + 1; i++) seq.push(seq[i - 1] + seq[i - 2]);
                            return seq;
                        }

                        var PHI = (1 + Math.sqrt(5)) / 2;

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var seq = fibSeq(nMax + 1);
                            var shown = Math.min(animStep, nMax);

                            // Chart area
                            var chartLeft = 70;
                            var chartRight = viz.width - 30;
                            var chartTop = 50;
                            var chartBottom = 330;
                            var chartW = chartRight - chartLeft;
                            var chartH = chartBottom - chartTop;

                            viz.screenText('F(n+1) / F(n) converges to \u03C6', viz.width / 2, 20, viz.colors.white, 15);

                            // Y axis range: 0.8 to 2.2
                            var yMin = 0.8;
                            var yMax = 2.2;
                            var yRange = yMax - yMin;

                            function toY(val) { return chartBottom - (val - yMin) / yRange * chartH; }
                            function toX(i) { return chartLeft + (i - 1) / Math.max(shown - 1, 1) * chartW; }

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var y = 1.0; y <= 2.0; y += 0.2) {
                                var sy = toY(y);
                                ctx.beginPath();
                                ctx.moveTo(chartLeft, sy);
                                ctx.lineTo(chartRight, sy);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(y.toFixed(1), chartLeft - 6, sy);
                            }

                            // Golden ratio line
                            var phiY = toY(PHI);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.setLineDash([6, 4]);
                            ctx.beginPath();
                            ctx.moveTo(chartLeft, phiY);
                            ctx.lineTo(chartRight, phiY);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('\u03C6 \u2248 1.618', chartRight - 70, phiY - 4);

                            // Plot ratios
                            var ratios = [];
                            for (var i = 1; i <= shown; i++) {
                                ratios.push(seq[i] / seq[i - 1]);
                            }

                            // Line
                            if (ratios.length > 1) {
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var j = 0; j < ratios.length; j++) {
                                    var px = toX(j + 1);
                                    var py = toY(ratios[j]);
                                    if (j === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Points
                            for (var k = 0; k < ratios.length; k++) {
                                var ppx = toX(k + 1);
                                var ppy = toY(ratios[k]);
                                var isLast = (k === ratios.length - 1);
                                ctx.fillStyle = isLast ? viz.colors.teal : viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(ppx, ppy, isLast ? 5 : 3.5, 0, Math.PI * 2);
                                ctx.fill();

                                // X label
                                if (shown <= 15 || k % 2 === 0) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText((k + 1).toString(), ppx, chartBottom + 4);
                                }
                            }

                            // X axis label
                            viz.screenText('n', viz.width / 2, chartBottom + 22, viz.colors.text, 12);

                            // Current value
                            if (ratios.length > 0) {
                                var lastRatio = ratios[ratios.length - 1];
                                viz.screenText(
                                    'F(' + (shown + 1) + ')/F(' + shown + ') = ' +
                                    seq[shown] + '/' + seq[shown - 1] + ' = ' + lastRatio.toFixed(6),
                                    viz.width / 2, viz.height - 15, viz.colors.teal, 12
                                );
                            }
                        }
                        animStep = nMax;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(F_{n+1}/F_n\\) for \\(n = 1, 2, \\ldots, 8\\). How close is \\(F_9/F_8\\) to \\(\\varphi\\)?',
                    hint: 'The Fibonacci sequence starts 1, 1, 2, 3, 5, 8, 13, 21, 34. Divide each pair of consecutive terms.',
                    solution: 'The ratios are: 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619. Then \\(F_9/F_8 = 34/21 \\approx 1.6190\\), which differs from \\(\\varphi \\approx 1.6180\\) by less than 0.001.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Fibonacci in Nature
        // ================================================================
        {
            id: 'sec-nature',
            title: 'Fibonacci in Nature',
            content: `
<h2>Fibonacci in Nature</h2>

<p>Fibonacci numbers appear throughout the natural world with striking regularity. This is not coincidence; it is a consequence of growth processes that follow simple additive rules.</p>

<h3>Spiral Phyllotaxis</h3>

<p>Look closely at a sunflower head, a pinecone, or a pineapple. The seeds, scales, or segments are arranged in spirals. If you count the number of spirals going clockwise and counterclockwise, you almost always get two <em>consecutive</em> Fibonacci numbers:</p>

<ul>
    <li><strong>Sunflowers:</strong> typically 34 and 55 spirals (or 55 and 89)</li>
    <li><strong>Pinecones:</strong> typically 8 and 13 spirals</li>
    <li><strong>Pineapples:</strong> typically 8 and 13 spirals</li>
    <li><strong>Daisies:</strong> often 13 and 21 petals in spiral patterns</li>
</ul>

<h3>Why Fibonacci?</h3>

<p>The reason is <strong>optimal packing</strong>. When new growth elements (seeds, leaves, petals) emerge from a central point, each successive element is placed at a fixed angle from the previous one. The angle that produces the most efficient packing, with no gaps, is related to the golden ratio:</p>

\\[
\\theta = \\frac{360^\\circ}{\\varphi^2} = \\frac{360^\\circ}{\\varphi + 1} \\approx 137.5^\\circ
\\]

<p>This is called the <strong>golden angle</strong>. When seeds are placed at this angle, the resulting spiral counts are Fibonacci numbers.</p>

<div class="env-block remark">
    <div class="env-title">The Golden Spiral</div>
    <div class="env-body">
        <p>A <strong>golden spiral</strong> is built by drawing quarter circles in squares whose side lengths are Fibonacci numbers. Starting with two 1-by-1 squares, then a 2-by-2, then 3-by-3, 5-by-5, 8-by-8, and so on, the resulting spiral closely approximates the logarithmic spirals found in nautilus shells, hurricanes, and galaxies.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-golden-spiral"></div>
<div class="viz-placeholder" data-viz="viz-sunflower"></div>
`,
            visualizations: [
                {
                    id: 'viz-golden-spiral',
                    title: 'The Golden Spiral',
                    description: 'Fibonacci squares tile together to form a rectangle whose proportions approach the golden ratio. A smooth spiral through the quarter-circle arcs creates the golden spiral.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nSquares = 8;
                        var animStep = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'Squares', 3, 12, nSquares, 1, function(v) {
                            nSquares = Math.round(v);
                            animStep = nSquares;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) return;
                            animating = true;
                            animStep = 1;
                            function step() {
                                draw();
                                if (animStep < nSquares) {
                                    animStep++;
                                    setTimeout(step, 500);
                                } else {
                                    animating = false;
                                }
                            }
                            step();
                        });

                        var squareColors = ['#58a6ff44', '#3fb9a044', '#f0883e44', '#bc8cff44', '#3fb95044', '#f7768e44', '#d2992244', '#f778ba44'];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var shown = Math.min(animStep, nSquares);

                            viz.screenText('The Golden Spiral', viz.width / 2, 18, viz.colors.white, 15);

                            // Compute Fibonacci squares
                            var fibs = [1, 1];
                            for (var i = 2; i < nSquares; i++) fibs.push(fibs[i - 1] + fibs[i - 2]);

                            // Place squares: direction cycles through right, up, left, down
                            var squares = []; // {x, y, size, dir}
                            var cx = 0, cy = 0;
                            // Directions: 0=right, 1=up, 2=left, 3=down
                            for (var s = 0; s < nSquares; s++) {
                                var size = fibs[s];
                                var dir = s % 4;
                                if (s === 0) {
                                    squares.push({ x: 0, y: 0, size: size, dir: dir });
                                } else if (s === 1) {
                                    squares.push({ x: fibs[0], y: 0, size: size, dir: dir });
                                } else {
                                    var prev = squares[s - 1];
                                    var nx, ny;
                                    if (dir === 0) { // place to the right
                                        // Find rightmost x of all squares and bottom
                                        var maxR = -Infinity, minBot = Infinity;
                                        for (var q = 0; q < s; q++) {
                                            maxR = Math.max(maxR, squares[q].x + squares[q].size);
                                        }
                                        ny = prev.y + prev.size - size;
                                        nx = maxR;
                                    } else if (dir === 1) { // place above
                                        var minT = Infinity;
                                        for (var q = 0; q < s; q++) {
                                            minT = Math.min(minT, squares[q].y);
                                        }
                                        nx = prev.x;
                                        ny = minT - size;
                                    } else if (dir === 2) { // place to the left
                                        var minL = Infinity;
                                        for (var q = 0; q < s; q++) {
                                            minL = Math.min(minL, squares[q].x);
                                        }
                                        nx = minL - size;
                                        ny = prev.y;
                                    } else { // place below
                                        var maxB = -Infinity;
                                        for (var q = 0; q < s; q++) {
                                            maxB = Math.max(maxB, squares[q].y + squares[q].size);
                                        }
                                        nx = prev.x + prev.size - size;
                                        ny = maxB;
                                    }
                                    squares.push({ x: nx, y: ny, size: size, dir: dir });
                                }
                            }

                            // Find bounding box and scale
                            var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                            for (var b = 0; b < shown; b++) {
                                var sq = squares[b];
                                minX = Math.min(minX, sq.x);
                                minY = Math.min(minY, sq.y);
                                maxX = Math.max(maxX, sq.x + sq.size);
                                maxY = Math.max(maxY, sq.y + sq.size);
                            }
                            var tw = maxX - minX, th = maxY - minY;
                            var margin = 40;
                            var drawW = viz.width - 2 * margin;
                            var drawH = viz.height - 70 - margin;
                            var sc = Math.min(drawW / (tw || 1), drawH / (th || 1));
                            var offX = margin + (drawW - tw * sc) / 2 - minX * sc;
                            var offY = 45 + (drawH - th * sc) / 2 - minY * sc;

                            // Draw squares
                            for (var d = 0; d < shown; d++) {
                                var sq = squares[d];
                                var sx = offX + sq.x * sc;
                                var sy = offY + sq.y * sc;
                                var ss = sq.size * sc;

                                ctx.fillStyle = squareColors[d % squareColors.length];
                                ctx.fillRect(sx, sy, ss, ss);
                                ctx.strokeStyle = viz.colors.blue + '88';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(sx, sy, ss, ss);

                                // Label
                                if (ss > 15) {
                                    ctx.fillStyle = viz.colors.white + 'aa';
                                    ctx.font = Math.max(9, Math.min(14, ss / 3)) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(fibs[d].toString(), sx + ss / 2, sy + ss / 2);
                                }

                                // Quarter circle arc (spiral)
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var arcDir = d % 4;
                                if (arcDir === 0) {
                                    ctx.arc(sx + ss, sy + ss, ss, Math.PI, Math.PI * 1.5);
                                } else if (arcDir === 1) {
                                    ctx.arc(sx, sy + ss, ss, Math.PI * 1.5, Math.PI * 2);
                                } else if (arcDir === 2) {
                                    ctx.arc(sx, sy, ss, 0, Math.PI * 0.5);
                                } else {
                                    ctx.arc(sx + ss, sy, ss, Math.PI * 0.5, Math.PI);
                                }
                                ctx.stroke();
                            }

                            viz.screenText('Squares: ' + shown + '   Fibonacci sizes: ' + fibs.slice(0, shown).join(', '),
                                viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        animStep = nSquares;
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-sunflower',
                    title: 'Sunflower Seed Pattern',
                    description: 'Seeds placed at the golden angle create Fibonacci spiral patterns naturally. Adjust the number of seeds and watch the spirals emerge. Count the clockwise and counterclockwise spirals to find Fibonacci numbers!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nSeeds = 200;
                        var showSpirals = false;

                        VizEngine.createSlider(controls, 'Seeds', 20, 500, nSeeds, 10, function(v) {
                            nSeeds = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Toggle Spirals', function() {
                            showSpirals = !showSpirals;
                            draw();
                        });

                        var GOLDEN_ANGLE = Math.PI * 2 * (1 - 1 / ((1 + Math.sqrt(5)) / 2));

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Sunflower Seed Arrangement', viz.width / 2, 18, viz.colors.white, 15);

                            var cenX = viz.width / 2;
                            var cenY = viz.height / 2 + 10;
                            var maxR = Math.min(viz.width, viz.height) / 2 - 40;
                            var scaleFactor = maxR / Math.sqrt(nSeeds);

                            for (var i = 0; i < nSeeds; i++) {
                                var angle = i * GOLDEN_ANGLE;
                                var r = scaleFactor * Math.sqrt(i);
                                var px = cenX + r * Math.cos(angle);
                                var py = cenY + r * Math.sin(angle);
                                var seedR = Math.max(2, Math.min(5, scaleFactor * 0.45));

                                if (showSpirals) {
                                    var hue = (i % 34) / 34;
                                    var rgb = VizEngine.hslToRgb(hue, 0.7, 0.5);
                                    ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                } else {
                                    var t = i / nSeeds;
                                    ctx.fillStyle = t < 0.5 ? viz.colors.yellow : viz.colors.orange;
                                }

                                ctx.beginPath();
                                ctx.arc(px, py, seedR, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText(nSeeds + ' seeds at golden angle \u2248 137.5\u00B0',
                                viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The golden angle is approximately \\(137.5^\\circ\\). Show that \\(360^\\circ / \\varphi^2 \\approx 137.5^\\circ\\).',
                    hint: 'Use \\(\\varphi^2 = \\varphi + 1 \\approx 2.618\\).',
                    solution: '\\(360 / \\varphi^2 = 360 / (\\varphi + 1) = 360 / 2.618 \\approx 137.5^\\circ\\). This is the angle that produces the most efficient packing of seeds in a sunflower.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Fun Identities
        // ================================================================
        {
            id: 'sec-identities',
            title: 'Fun Identities',
            content: `
<h2>Fun Fibonacci Identities</h2>

<p>The Fibonacci numbers satisfy many beautiful identities. Here are some of the most elegant:</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.2 (Sum of First \\(n\\) Fibonacci Numbers)</div>
    <div class="env-body">
        \\[F_1 + F_2 + F_3 + \\cdots + F_n = F_{n+2} - 1.\\]
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why This Works</div>
    <div class="env-body">
        <p>Since \\(F_k = F_{k+2} - F_{k+1}\\), the sum telescopes:</p>
        \\[\\sum_{k=1}^{n} F_k = \\sum_{k=1}^{n}(F_{k+2} - F_{k+1}) = F_{n+2} - F_2 = F_{n+2} - 1.\\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.3 (GCD of Fibonacci Numbers)</div>
    <div class="env-body">
        \\[\\gcd(F_m, F_n) = F_{\\gcd(m, n)}.\\]
        <p>In particular, \\(\\gcd(F_m, F_{m+1}) = F_{\\gcd(m, m+1)} = F_1 = 1\\). Consecutive Fibonacci numbers are always coprime!</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Let us verify: \\(\\gcd(F_6, F_9) = \\gcd(8, 34)\\). Since \\(\\gcd(6, 9) = 3\\) and \\(F_3 = 2\\), we should get \\(\\gcd(8, 34) = 2\\). Indeed, \\(8 = 2 \\times 4\\) and \\(34 = 2 \\times 17\\), so \\(\\gcd(8, 34) = 2 = F_3\\). It works!</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.4 (Cassini's Identity)</div>
    <div class="env-body">
        \\[F_{n-1} \\cdot F_{n+1} - F_n^2 = (-1)^n.\\]
        <p>The product of the neighbors minus the square of the middle always gives \\(\\pm 1\\)!</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Cassini for \\(n = 5\\)</div>
    <div class="env-body">
        <p>\\(F_4 \\cdot F_6 - F_5^2 = 3 \\times 8 - 5^2 = 24 - 25 = -1 = (-1)^5\\). Correct!</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fibonacci-identities"></div>
`,
            visualizations: [
                {
                    id: 'viz-fibonacci-identities',
                    title: 'Verify Fibonacci Identities',
                    description: 'Pick a Fibonacci index and verify three identities interactively: the sum formula, the GCD property, and Cassini\'s identity.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 6;
                        var mVal = 4;

                        VizEngine.createSlider(controls, 'n', 2, 15, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'm (for GCD)', 2, 15, mVal, 1, function(v) {
                            mVal = Math.round(v);
                            draw();
                        });

                        function fibSeq(max) {
                            var s = [0, 1, 1];
                            for (var i = 3; i <= max; i++) s.push(s[i - 1] + s[i - 2]);
                            return s;
                        }

                        function gcd(a, b) {
                            a = Math.abs(a); b = Math.abs(b);
                            while (b) { var t = b; b = a % b; a = t; }
                            return a;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var maxIdx = Math.max(nVal, mVal) + 3;
                            var f = fibSeq(maxIdx);

                            viz.screenText('Fibonacci Identities Explorer', viz.width / 2, 20, viz.colors.white, 15);

                            var y = 55;
                            var lx = 30;

                            // Identity 1: Sum
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'top';
                            ctx.fillText('1. Sum of first n Fibonacci numbers:', lx, y);
                            y += 22;

                            var sumTerms = [];
                            var sumVal = 0;
                            for (var i = 1; i <= nVal; i++) {
                                sumTerms.push(f[i]);
                                sumVal += f[i];
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            var sumStr = sumTerms.join(' + ') + ' = ' + sumVal;
                            ctx.fillText('   ' + sumStr, lx, y);
                            y += 18;
                            var expected = f[nVal + 2] - 1;
                            ctx.fillStyle = sumVal === expected ? viz.colors.green : viz.colors.red;
                            ctx.fillText('   F(' + (nVal + 2) + ') - 1 = ' + f[nVal + 2] + ' - 1 = ' + expected +
                                (sumVal === expected ? '  \u2713' : '  \u2717'), lx, y);

                            // Identity 2: GCD
                            y += 35;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText('2. gcd(F(m), F(n)) = F(gcd(m, n)):', lx, y);
                            y += 22;
                            var g = gcd(mVal, nVal);
                            var gcdFib = gcd(f[mVal], f[nVal]);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('   gcd(F(' + mVal + '), F(' + nVal + ')) = gcd(' + f[mVal] + ', ' + f[nVal] + ') = ' + gcdFib, lx, y);
                            y += 18;
                            ctx.fillStyle = gcdFib === f[g] ? viz.colors.green : viz.colors.red;
                            ctx.fillText('   F(gcd(' + mVal + ', ' + nVal + ')) = F(' + g + ') = ' + f[g] +
                                (gcdFib === f[g] ? '  \u2713' : '  \u2717'), lx, y);

                            // Identity 3: Cassini
                            y += 35;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.fillText("3. Cassini's Identity:", lx, y);
                            y += 22;
                            var cassini = f[nVal - 1] * f[nVal + 1] - f[nVal] * f[nVal];
                            var expectedCassini = (nVal % 2 === 0) ? 1 : -1;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('   F(' + (nVal - 1) + ')\u00B7F(' + (nVal + 1) + ') - F(' + nVal + ')\u00B2 = ' +
                                f[nVal - 1] + '\u00B7' + f[nVal + 1] + ' - ' + f[nVal] + '\u00B2', lx, y);
                            y += 18;
                            ctx.fillText('   = ' + (f[nVal - 1] * f[nVal + 1]) + ' - ' + (f[nVal] * f[nVal]) + ' = ' + cassini, lx, y);
                            y += 18;
                            ctx.fillStyle = cassini === expectedCassini ? viz.colors.green : viz.colors.red;
                            ctx.fillText('   (-1)^' + nVal + ' = ' + expectedCassini +
                                (cassini === expectedCassini ? '  \u2713' : '  \u2717'), lx, y);

                            // Fibonacci reference
                            y += 35;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            var refStr = 'F: ';
                            for (var j = 1; j <= Math.min(maxIdx, 16); j++) {
                                refStr += f[j];
                                if (j < Math.min(maxIdx, 16)) refStr += ', ';
                            }
                            if (maxIdx > 16) refStr += ', ...';
                            ctx.fillText(refStr, lx, y);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Verify the sum identity for \\(n = 7\\): show that \\(F_1 + F_2 + \\cdots + F_7 = F_9 - 1\\).",
                    hint: 'Compute the left side by adding 1 + 1 + 2 + 3 + 5 + 8 + 13, and compare with \\(F_9 - 1 = 34 - 1 = 33\\).',
                    solution: '\\(1 + 1 + 2 + 3 + 5 + 8 + 13 = 33\\). And \\(F_9 - 1 = 34 - 1 = 33\\). They match.'
                },
                {
                    question: 'Use the GCD identity to find \\(\\gcd(F_{12}, F_{18})\\) without computing \\(F_{12}\\) or \\(F_{18}\\) individually.',
                    hint: 'First find \\(\\gcd(12, 18)\\), then look up that Fibonacci number.',
                    solution: '\\(\\gcd(12, 18) = 6\\), so \\(\\gcd(F_{12}, F_{18}) = F_6 = 8\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Fibonacci in Pascal's Triangle
        // ================================================================
        {
            id: 'sec-pascal',
            title: "Fibonacci in Pascal's Triangle",
            content: `
<h2>Fibonacci in Pascal's Triangle</h2>

<p>There is a surprising connection between Fibonacci numbers and Pascal's triangle. If you add the entries along the <strong>shallow diagonals</strong> of Pascal's triangle, you get the Fibonacci numbers!</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 13.5 (Diagonal Sum Identity)</div>
    <div class="env-body">
        <p>For \\(n \\geq 1\\):</p>
        \\[F_n = \\sum_{k=0}^{\\lfloor (n-1)/2 \\rfloor} \\binom{n-1-k}{k}.\\]
        <p>Equivalently, the sum of entries along the \\(n\\)-th shallow diagonal of Pascal's triangle equals \\(F_n\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>The shallow diagonals of Pascal's triangle:</p>
        <ul>
            <li>Diagonal 1: \\(\\binom{0}{0} = 1 = F_1\\)</li>
            <li>Diagonal 2: \\(\\binom{1}{0} = 1 = F_2\\)</li>
            <li>Diagonal 3: \\(\\binom{2}{0} + \\binom{1}{1} = 1 + 1 = 2 = F_3\\)</li>
            <li>Diagonal 4: \\(\\binom{3}{0} + \\binom{2}{1} = 1 + 2 = 3 = F_4\\)</li>
            <li>Diagonal 5: \\(\\binom{4}{0} + \\binom{3}{1} + \\binom{2}{2} = 1 + 3 + 1 = 5 = F_5\\)</li>
        </ul>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Why This Connection Exists</div>
    <div class="env-body">
        <p>A tiling problem ties them together. The number of ways to tile a \\(1 \\times n\\) strip with squares (\\(1 \\times 1\\)) and dominoes (\\(1 \\times 2\\)) equals \\(F_{n+1}\\). If we count by the number of dominoes used (say \\(k\\) dominoes), we must place \\(k\\) dominoes and \\(n - 2k\\) squares in a row, giving \\(\\binom{n-k}{k}\\) arrangements. Summing over \\(k\\) gives the diagonal sum formula.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-pascal-fibonacci"></div>
`,
            visualizations: [
                {
                    id: 'viz-pascal-fibonacci',
                    title: "Pascal's Triangle with Fibonacci Diagonals",
                    description: "Pascal's triangle with the shallow diagonals highlighted. Each diagonal sum equals a Fibonacci number.",
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nRows = 10;
                        var highlightDiag = 5;

                        VizEngine.createSlider(controls, 'Rows', 5, 14, nRows, 1, function(v) {
                            nRows = Math.round(v);
                            if (highlightDiag > nRows) highlightDiag = nRows;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Highlight Diagonal', 1, 10, highlightDiag, 1, function(v) {
                            highlightDiag = Math.round(v);
                            draw();
                        });

                        function choose(n, k) {
                            if (k < 0 || k > n) return 0;
                            if (k === 0 || k === n) return 1;
                            var r = 1;
                            for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1);
                            return Math.round(r);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText("Pascal's Triangle & Fibonacci Diagonals", viz.width / 2, 18, viz.colors.white, 14);

                            var cellW = Math.min(42, (viz.width - 40) / (nRows + 1));
                            var cellH = Math.min(32, (viz.height - 100) / nRows);
                            var topY = 45;

                            // Determine which cells are on the highlighted diagonal
                            // Diagonal d (1-indexed): cells (row, col) where row + col = d - 1
                            // Actually shallow diagonals go from top-right to bottom-left
                            // Diagonal n: sum of C(n-1-k, k) for k = 0..floor((n-1)/2)
                            // In Pascal, these are entries at (n-1, 0), (n-2, 1), (n-3, 2), ...
                            // i.e. (row, col) where row = n-1-k, col = k, so row + col = n-1
                            // Wait, shallow diagonal: row - col = constant? No.
                            // The shallow diagonal d sums entries where row = d-1-2k+k = d-1-k? No.
                            // Entry (row, col) with row + col = highlightDiag - 1
                            // But that's the anti-diagonal, not shallow.
                            // Shallow diagonal: entries (r, c) where r - c is constant?
                            // Actually: the shallow diagonals go NE to SW.
                            // Diagonal d (1-indexed): entries (d-1, 0), (d-2, 1), (d-3, 2), ...
                            // So entry (r, c) is on diagonal r + c + 1.
                            // But that's just the anti-diagonal. Let me reconsider.
                            // The standard "shallow diagonal" sums in Pascal's triangle:
                            // Diagonal 1: (0,0)         sum=1=F1
                            // Diagonal 2: (1,0)         sum=1=F2
                            // Diagonal 3: (2,0),(1,1)   sum=1+1=2=F3
                            // Diagonal 4: (3,0),(2,1)   sum=1+2=3=F4
                            // Diagonal 5: (4,0),(3,1),(2,2) sum=1+3+1=5=F5
                            // Pattern: diagonal d consists of (d-1,0), (d-2,1), (d-3,2), ...
                            // So (r,c) is on diagonal r+c+1? No: (d-1, 0): r+c=d-1. (d-2,1): r+c=d-1. Same!
                            // Wait, these ARE anti-diagonals where r+c = d-1. But that can't be right for Pascal.
                            // Actually no. (2,0) has r+c=2. (1,1) has r+c=2. So diagonal 3 = anti-diagonal r+c=2. That works.
                            // (3,0): r+c=3. (2,1): r+c=3. Diagonal 4 = anti-diagonal r+c=3.
                            // But wait, diagonal 3 sums C(2,0)+C(1,1)=1+1=2=F3.
                            // Anti-diagonal r+c=2: C(2,0)+C(1,1)+C(0,2). But C(0,2)=0. So effectively same.
                            // Hmm, but anti-diagonal r+c=2 would be row 2 col 0, row 1 col 1, row 0 col 2.
                            // C(0,2)=0, so it still sums to 2. OK so anti-diagonals do NOT give Fibonacci!
                            // Anti-diagonal r+c=4: C(4,0)+C(3,1)+C(2,2)+C(1,3)+C(0,4) = 1+3+1+0+0=5=F5. Hmm that's F5.
                            // Anti-diagonal r+c=3: C(3,0)+C(2,1)+C(1,2)+C(0,3) = 1+2+0+0=3=F4.
                            // Wait, C(1,2)=0 and C(0,3)=0. So sum=3. But we need it=F4=3. OK.
                            // So the anti-diagonals DO give Fibonacci? Let me check r+c=5:
                            // C(5,0)+C(4,1)+C(3,2)+C(2,3)+C(1,4)+C(0,5) = 1+4+3+0+0+0 = 8 = F6.
                            // But wait: the shallow diagonals that give Fibonacci are NOT anti-diagonals.
                            // The "shallow" diagonals are tilted differently. Let me reconsider.
                            //
                            // Standard result: sum along diagonals slanting at 45 degrees from the left side:
                            // Diagonal n: entries C(n-1-k, k) for k=0,1,...,floor((n-1)/2)
                            // Diagonal 1: C(0,0) = 1
                            // Diagonal 2: C(1,0) = 1
                            // Diagonal 3: C(2,0) + C(1,1) = 1+1 = 2
                            // Diagonal 4: C(3,0) + C(2,1) = 1+2 = 3
                            // Diagonal 5: C(4,0) + C(3,1) + C(2,2) = 1+3+1 = 5
                            //
                            // These entries in (row, col) form:
                            // D1: (0,0)
                            // D2: (1,0)
                            // D3: (2,0), (1,1)
                            // D4: (3,0), (2,1)
                            // D5: (4,0), (3,1), (2,2)
                            //
                            // The pattern: entry (r,c) belongs to diagonal r+c+1?
                            // (0,0)->1, (1,0)->2, (2,0)->3, (1,1)->3, (3,0)->4, (2,1)->4, (4,0)->5, (3,1)->5, (2,2)->5
                            // Wait: (0,0) is diagonal 1, r+c=0, d=r+c+1=1. Check.
                            // (1,0): d=2, r+c=1, d=r+c+1=2. Check.
                            // (2,0): d=3, r+c=2, d=r+c+1=3. Check.
                            // (1,1): d=3, r+c=2, d=r+c+1=3. Check!
                            // So diagonal d = r + c + 1. These ARE the anti-diagonals!

                            var diagEntries = {};
                            var diagSum = 0;
                            var d = highlightDiag;
                            for (var kk = 0; kk <= Math.floor((d - 1) / 2); kk++) {
                                var rr = d - 1 - kk;
                                var cc = kk;
                                if (rr < nRows) {
                                    diagEntries[rr + ',' + cc] = true;
                                    diagSum += choose(rr, cc);
                                }
                            }

                            // Draw Pascal's triangle
                            for (var row = 0; row < nRows; row++) {
                                var startX = viz.width / 2 - row * cellW / 2;
                                for (var col = 0; col <= row; col++) {
                                    var cx = startX + col * cellW;
                                    var cy = topY + row * cellH;
                                    var val = choose(row, col);
                                    var isOnDiag = diagEntries[row + ',' + col];

                                    if (isOnDiag) {
                                        ctx.fillStyle = viz.colors.teal + '44';
                                        ctx.fillRect(cx - cellW / 2 + 2, cy - cellH / 2 + 2, cellW - 4, cellH - 4);
                                        ctx.strokeStyle = viz.colors.teal;
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(cx - cellW / 2 + 2, cy - cellH / 2 + 2, cellW - 4, cellH - 4);
                                    }

                                    ctx.fillStyle = isOnDiag ? viz.colors.teal : viz.colors.text;
                                    ctx.font = (isOnDiag ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(val.toString(), cx, cy);
                                }
                            }

                            // Fibonacci result
                            var fibN = 1, fibPrev = 0;
                            for (var fi = 1; fi < d; fi++) { var tmp = fibN; fibN = fibN + fibPrev; fibPrev = tmp; }

                            viz.screenText(
                                'Diagonal ' + d + ' sum = ' + diagSum + ' = F(' + d + ')',
                                viz.width / 2, viz.height - 35, viz.colors.teal, 14
                            );

                            // Show first few Fibonacci for reference
                            var fibRef = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];
                            var refStr = 'F: ' + fibRef.slice(0, Math.min(nRows, 12)).join(', ') + (nRows > 12 ? ', ...' : '');
                            viz.screenText(refStr, viz.width / 2, viz.height - 14, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "Verify the diagonal sum formula for \\(F_7\\) using Pascal's triangle entries.",
                    hint: '\\(F_7 = 13\\). The diagonal sums \\(\\binom{6}{0} + \\binom{5}{1} + \\binom{4}{2} + \\binom{3}{3}\\).',
                    solution: '\\(\\binom{6}{0} + \\binom{5}{1} + \\binom{4}{2} + \\binom{3}{3} = 1 + 5 + 6 + 1 = 13 = F_7\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: Bridge to the Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Ahead',
            content: `
<h2>Looking Ahead</h2>

<p>The Fibonacci numbers are just one of many special sequences in number theory. We have seen how a simple recurrence, "each term is the sum of the previous two," gives rise to deep connections with the golden ratio, nature, Pascal's triangle, and the GCD.</p>

<h3>What We Learned</h3>
<ul>
    <li>The <strong>Fibonacci sequence</strong> arises from the rabbit breeding problem: \\(F_n = F_{n-1} + F_{n-2}\\).</li>
    <li>The ratio \\(F_{n+1}/F_n\\) converges to the <strong>golden ratio</strong> \\(\\varphi = (1 + \\sqrt{5})/2\\).</li>
    <li>Fibonacci numbers appear in nature through the <strong>golden angle</strong> and optimal packing.</li>
    <li>Elegant identities connect Fibonacci numbers to sums, GCDs, and Cassini's alternating pattern.</li>
    <li>The diagonal sums of Pascal's triangle yield the Fibonacci sequence.</li>
</ul>

<h3>What Comes Next</h3>

<p>In the next chapter, we explore <strong>Pythagorean triples</strong>: sets of three whole numbers \\(a, b, c\\) with \\(a^2 + b^2 = c^2\\). Surprisingly, Fibonacci numbers can generate Pythagorean triples! Taking four consecutive Fibonacci numbers \\(F_n, F_{n+1}, F_{n+2}, F_{n+3}\\), the triple</p>
\\[
(F_n \\cdot F_{n+3},\\; 2F_{n+1} \\cdot F_{n+2},\\; F_{n+1}^2 + F_{n+2}^2)
\\]
<p>is always a Pythagorean triple. Number theory is full of these unexpected bridges between different topics.</p>

<div class="env-block remark">
    <div class="env-title">Going Further</div>
    <div class="env-body">
        <p>For those who want to explore more: the <strong>Lucas numbers</strong> (2, 1, 3, 4, 7, 11, 18, ...) follow the same recurrence but with different starting values. Many Fibonacci identities have Lucas analogs. The relationship between Fibonacci and Lucas numbers is itself a beautiful story.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Using \\(F_1 = 1, F_2 = 1, F_3 = 2, F_4 = 3\\), verify that \\((F_1 \\cdot F_4, \\; 2F_2 \\cdot F_3, \\; F_2^2 + F_3^2)\\) is a Pythagorean triple.',
                    hint: 'Compute each component and check if \\(a^2 + b^2 = c^2\\).',
                    solution: '\\(a = 1 \\times 3 = 3\\), \\(b = 2 \\times 1 \\times 2 = 4\\), \\(c = 1^2 + 2^2 = 5\\). Check: \\(3^2 + 4^2 = 9 + 16 = 25 = 5^2\\). Yes, \\((3, 4, 5)\\) is a Pythagorean triple!'
                },
                {
                    question: 'The Lucas numbers are defined by \\(L_1 = 2, L_2 = 1, L_n = L_{n-1} + L_{n-2}\\). Compute \\(L_1\\) through \\(L_{10}\\).',
                    hint: 'Same recurrence as Fibonacci, just different starting values.',
                    solution: '\\(2, 1, 3, 4, 7, 11, 18, 29, 47, 76\\).'
                }
            ]
        }
    ]
});
