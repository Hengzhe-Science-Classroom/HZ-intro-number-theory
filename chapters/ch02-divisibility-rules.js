window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Divisibility Rules',
    subtitle: 'Quick tricks to test divisibility',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Divisibility Rules?',
            content: `
<h2>Why Divisibility Rules?</h2>

<div class="env-block intuition">
    <div class="env-title">A Quick Challenge</div>
    <div class="env-body">
        <p>Is the number 4,917 divisible by 3? You could grab a calculator and compute \\(4917 \\div 3 = 1639\\). But there is a faster way: add the digits \\(4 + 9 + 1 + 7 = 21\\), and since 21 is divisible by 3, so is 4,917. No long division needed.</p>
    </div>
</div>

<p>In Chapter 1 we learned what it means for one number to divide another: \\(a \\mid b\\) means \\(b = a \\cdot q\\) for some integer \\(q\\). But checking divisibility by direct division can be slow, especially for large numbers. <strong>Divisibility rules</strong> are shortcuts that let you test whether a number is divisible by 2, 3, 4, 5, and other small divisors just by looking at its digits.</p>

<h3>Where Do These Rules Come From?</h3>

<p>Every whole number can be written in <em>decimal expansion</em>:</p>
\\[
n = d_k \\cdot 10^k + d_{k-1} \\cdot 10^{k-1} + \\cdots + d_1 \\cdot 10 + d_0
\\]
<p>where \\(d_0, d_1, \\ldots, d_k\\) are the digits (0 through 9). For example, \\(4917 = 4 \\cdot 10^3 + 9 \\cdot 10^2 + 1 \\cdot 10 + 7\\).</p>

<p>Divisibility rules exploit the fact that powers of 10 have simple remainders when divided by small numbers. For instance, every power of 10 is divisible by 2 and 5. And since \\(10 \\equiv 1 \\pmod{3}\\), we have \\(10^k \\equiv 1 \\pmod{3}\\) for all \\(k\\), which is why the digit-sum test works for 3.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>Divisibility rules have been known for centuries. The digit-sum rule for 9 was known to Arab mathematicians by the 10th century and was called "casting out nines." It was widely used to check arithmetic before calculators existed.</p>
    </div>
</div>

<h3>What We Will Cover</h3>

<p>In this chapter, we develop tests for divisibility by 2, 3, 4, 5, 7, 8, 9, 10, and 11. Each rule reduces a potentially large computation to a quick mental check. We prove why they work, and by the end you will be able to glance at a number and instantly decide which small primes divide it.</p>
`,
            visualizations: [
                {
                    id: 'viz-divisibility-tester',
                    title: 'Universal Divisibility Tester',
                    description: 'Enter any whole number and instantly test all divisibility rules from 2 to 11. Green checkmarks indicate the number is divisible; red crosses indicate it is not.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = '2520';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#f0f6fc;font-size:0.9rem;width:160px;';
                        var randBtn = document.createElement('button');
                        randBtn.textContent = 'Random';
                        randBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        inputDiv.appendChild(randBtn);
                        controls.appendChild(inputDiv);

                        var currentNum = 2520;
                        var animPhase = 0;
                        var animStart = 0;
                        var animating = false;

                        function digitSum(n) {
                            var s = 0;
                            var str = Math.abs(n).toString();
                            for (var i = 0; i < str.length; i++) s += parseInt(str[i]);
                            return s;
                        }

                        function altDigitSum(n) {
                            var str = Math.abs(n).toString();
                            var s = 0;
                            for (var i = 0; i < str.length; i++) {
                                s += (i % 2 === 0 ? 1 : -1) * parseInt(str[str.length - 1 - i]);
                            }
                            return s;
                        }

                        function lastDigits(n, count) {
                            var str = Math.abs(n).toString();
                            if (str.length <= count) return Math.abs(n);
                            return parseInt(str.slice(-count));
                        }

                        function getRuleInfo(n, d) {
                            var num = Math.abs(n);
                            var divides = num % d === 0;
                            var explanation = '';
                            switch (d) {
                                case 2:
                                    var ld = num % 10;
                                    explanation = 'Last digit ' + ld + (ld % 2 === 0 ? ' is even' : ' is odd');
                                    break;
                                case 3:
                                    var ds3 = digitSum(num);
                                    explanation = 'Digit sum = ' + ds3 + (ds3 % 3 === 0 ? ' (div by 3)' : ' (not div by 3)');
                                    break;
                                case 4:
                                    var l2 = lastDigits(num, 2);
                                    explanation = 'Last 2 digits: ' + l2 + (l2 % 4 === 0 ? ' (div by 4)' : ' (not div by 4)');
                                    break;
                                case 5:
                                    var ld5 = num % 10;
                                    explanation = 'Last digit ' + ld5 + (ld5 === 0 || ld5 === 5 ? ' is 0 or 5' : ' is not 0 or 5');
                                    break;
                                case 6:
                                    explanation = (num % 2 === 0 ? 'Even' : 'Odd') + ' and digit sum ' + digitSum(num) + (digitSum(num) % 3 === 0 ? ' div by 3' : ' not div by 3');
                                    break;
                                case 7:
                                    explanation = num + ' / 7 = ' + (num / 7).toFixed(2);
                                    break;
                                case 8:
                                    var l3 = lastDigits(num, 3);
                                    explanation = 'Last 3 digits: ' + l3 + (l3 % 8 === 0 ? ' (div by 8)' : ' (not div by 8)');
                                    break;
                                case 9:
                                    var ds9 = digitSum(num);
                                    explanation = 'Digit sum = ' + ds9 + (ds9 % 9 === 0 ? ' (div by 9)' : ' (not div by 9)');
                                    break;
                                case 10:
                                    var ld10 = num % 10;
                                    explanation = 'Last digit ' + ld10 + (ld10 === 0 ? ' is 0' : ' is not 0');
                                    break;
                                case 11:
                                    var as = altDigitSum(num);
                                    explanation = 'Alt sum = ' + as + (as % 11 === 0 ? ' (div by 11)' : ' (not div by 11)');
                                    break;
                            }
                            return { divides: divides, explanation: explanation };
                        }

                        function draw(timestamp) {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Divisibility Test: ' + currentNum, viz.width / 2, 28, viz.colors.white, 16);

                            var divisors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                            var cols = 2;
                            var rows = 5;
                            var cellW = 250;
                            var cellH = 56;
                            var startX = (viz.width - cols * cellW) / 2;
                            var startY = 55;

                            var shown = animating ? Math.min(divisors.length, animPhase + 1) : divisors.length;

                            for (var i = 0; i < shown; i++) {
                                var d = divisors[i];
                                var info = getRuleInfo(currentNum, d);
                                var col = i % cols;
                                var row = Math.floor(i / cols);
                                var x = startX + col * cellW + 10;
                                var y = startY + row * cellH;

                                // Background
                                var alpha = (animating && i === animPhase) ? '44' : '22';
                                ctx.fillStyle = info.divides ? viz.colors.green + alpha : viz.colors.red + alpha;
                                ctx.beginPath();
                                ctx.roundRect(x, y, cellW - 20, cellH - 8, 6);
                                ctx.fill();
                                ctx.strokeStyle = info.divides ? viz.colors.green + '66' : viz.colors.red + '44';
                                ctx.lineWidth = 1;
                                ctx.stroke();

                                // Checkmark or cross
                                var iconX = x + 22;
                                var iconY = y + cellH / 2 - 4;
                                ctx.font = 'bold 18px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = info.divides ? viz.colors.green : viz.colors.red;
                                ctx.fillText(info.divides ? '\u2713' : '\u2717', iconX, iconY);

                                // Divisor label
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('\u00F7 ' + d, x + 40, y + 16);

                                // Explanation
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(info.explanation, x + 40, y + 34);
                            }

                            // Summary at bottom
                            var divisorsList = [];
                            for (var j = 0; j < divisors.length; j++) {
                                if (currentNum % divisors[j] === 0) divisorsList.push(divisors[j]);
                            }
                            var summary = divisorsList.length > 0 ? 'Divisible by: ' + divisorsList.join(', ') : 'Not divisible by any of 2-11';
                            viz.screenText(summary, viz.width / 2, viz.height - 18, viz.colors.teal, 12);

                            if (animating) {
                                if (timestamp - animStart > 300) {
                                    animPhase++;
                                    animStart = timestamp;
                                    if (animPhase >= divisors.length) {
                                        animating = false;
                                    }
                                }
                                requestAnimationFrame(draw);
                            }
                        }

                        function startAnim() {
                            animPhase = 0;
                            animating = true;
                            animStart = performance.now();
                            requestAnimationFrame(draw);
                        }

                        function update() {
                            var val = parseInt(inp.value.replace(/[^0-9]/g, ''));
                            if (!isFinite(val) || val < 1) val = 1;
                            currentNum = val;
                            startAnim();
                        }

                        inp.addEventListener('input', function() {
                            var val = parseInt(inp.value.replace(/[^0-9]/g, ''));
                            if (isFinite(val) && val >= 1) {
                                currentNum = val;
                                animating = false;
                                draw(0);
                            }
                        });

                        randBtn.addEventListener('click', function() {
                            var r = Math.floor(Math.random() * 99000) + 1000;
                            inp.value = r.toString();
                            currentNum = r;
                            startAnim();
                        });

                        draw(0);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Without a calculator, determine which of 2, 3, 5, 9, and 11 divide the number 13,860.',
                    hint: 'Check last digit for 2 and 5. Add digits for 3 and 9. Compute the alternating sum for 11.',
                    solution: 'Last digit is 0, so \\(2 \\mid 13860\\) and \\(5 \\mid 13860\\) and \\(10 \\mid 13860\\). Digit sum: \\(1+3+8+6+0 = 18\\), and \\(18 = 2 \\times 9\\), so \\(3 \\mid 13860\\) and \\(9 \\mid 13860\\). Alternating sum (from right): \\(0 - 6 + 8 - 3 + 1 = 0\\), and \\(11 \\mid 0\\), so \\(11 \\mid 13860\\). All five divide 13,860.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Divisibility by 2
        // ================================================================
        {
            id: 'sec-by2',
            title: 'Divisibility by 2',
            content: `
<h2>Divisibility by 2</h2>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 2</div>
    <div class="env-body">
        <p>A whole number is divisible by 2 if and only if its <strong>last digit is even</strong> (0, 2, 4, 6, or 8).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Why It Works</div>
    <div class="env-body">
        <p>Write the number as \\(n = 10q + d_0\\), where \\(d_0\\) is the last digit. Since \\(10q = 2 \\cdot 5q\\) is always divisible by 2, we have</p>
        \\[2 \\mid n \\iff 2 \\mid d_0.\\]
        <p>The last digit \\(d_0\\) is between 0 and 9, so \\(2 \\mid d_0\\) precisely when \\(d_0 \\in \\{0, 2, 4, 6, 8\\}\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Even and Odd)</div>
    <div class="env-body">
        <p>A number \\(n\\) is <strong>even</strong> if \\(2 \\mid n\\), equivalently if \\(n = 2k\\) for some integer \\(k\\). It is <strong>odd</strong> if \\(2 \\nmid n\\), equivalently \\(n = 2k + 1\\) for some integer \\(k\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(3{,}748\\): last digit 8 (even), so \\(2 \\mid 3748\\). Indeed \\(3748 = 2 \\times 1874\\).</li>
            <li>\\(9{,}031\\): last digit 1 (odd), so \\(2 \\nmid 9031\\).</li>
            <li>\\(1{,}000{,}000\\): last digit 0 (even), so \\(2 \\mid 1000000\\).</li>
        </ul>
    </div>
</div>

<p>This is the simplest divisibility rule: just look at one digit. The rules for 5 and 10 are equally simple and rely on the same idea.</p>

<div class="viz-placeholder" data-viz="viz-last-digit"></div>
`,
            visualizations: [
                {
                    id: 'viz-last-digit',
                    title: 'Last-Digit Rules for 2, 5, and 10',
                    description: 'Enter a number to see its last digit highlighted. The visualization shows which "last digit" tests the number passes for divisibility by 2, 5, and 10.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentNum = 4370;
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
                        var lbl = document.createElement('span');
                        lbl.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        lbl.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = '4370';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#f0f6fc;font-size:0.9rem;width:140px;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var str = currentNum.toString();
                            var lastDigit = parseInt(str[str.length - 1]);

                            // Draw digits of the number, highlighting the last one
                            var digitSize = 36;
                            var totalW = str.length * (digitSize + 8);
                            var startX = (viz.width - totalW) / 2;
                            var digitY = 60;

                            viz.screenText('The Number', viz.width / 2, 25, viz.colors.text, 12);

                            for (var i = 0; i < str.length; i++) {
                                var x = startX + i * (digitSize + 8) + digitSize / 2;
                                var isLast = (i === str.length - 1);

                                if (isLast) {
                                    ctx.fillStyle = viz.colors.teal + '33';
                                    ctx.beginPath();
                                    ctx.roundRect(x - digitSize / 2 - 4, digitY - digitSize / 2 - 4, digitSize + 8, digitSize + 8, 6);
                                    ctx.fill();
                                    ctx.strokeStyle = viz.colors.teal;
                                    ctx.lineWidth = 2;
                                    ctx.stroke();
                                }

                                ctx.font = (isLast ? 'bold ' : '') + digitSize + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = isLast ? viz.colors.teal : viz.colors.white;
                                ctx.fillText(str[i], x, digitY);
                            }

                            viz.screenText('Last digit: ' + lastDigit, viz.width / 2, digitY + 40, viz.colors.teal, 14);

                            // Three rule boxes
                            var rules = [
                                { div: 2, test: lastDigit % 2 === 0, label: 'Divisible by 2?', reason: 'Last digit ' + lastDigit + (lastDigit % 2 === 0 ? ' is even' : ' is odd') },
                                { div: 5, test: lastDigit === 0 || lastDigit === 5, label: 'Divisible by 5?', reason: 'Last digit ' + lastDigit + (lastDigit === 0 || lastDigit === 5 ? ' is 0 or 5' : ' is not 0 or 5') },
                                { div: 10, test: lastDigit === 0, label: 'Divisible by 10?', reason: 'Last digit ' + lastDigit + (lastDigit === 0 ? ' is 0' : ' is not 0') }
                            ];

                            var boxW = 160;
                            var boxH = 100;
                            var boxY = 140;
                            var gap = 20;
                            var boxStartX = (viz.width - 3 * boxW - 2 * gap) / 2;

                            for (var j = 0; j < rules.length; j++) {
                                var r = rules[j];
                                var bx = boxStartX + j * (boxW + gap);

                                ctx.fillStyle = r.test ? viz.colors.green + '22' : viz.colors.red + '22';
                                ctx.beginPath();
                                ctx.roundRect(bx, boxY, boxW, boxH, 6);
                                ctx.fill();
                                ctx.strokeStyle = r.test ? viz.colors.green + '66' : viz.colors.red + '44';
                                ctx.lineWidth = 1;
                                ctx.stroke();

                                // Icon
                                ctx.font = 'bold 24px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = r.test ? viz.colors.green : viz.colors.red;
                                ctx.fillText(r.test ? '\u2713' : '\u2717', bx + boxW / 2, boxY + 28);

                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(r.label, bx + boxW / 2, boxY + 56);

                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(r.reason, bx + boxW / 2, boxY + 78);
                            }

                            // The even digits row
                            var rowY = boxY + boxH + 30;
                            viz.screenText('Even digits:', viz.width / 2 - 100, rowY, viz.colors.text, 11, 'right');
                            var evens = [0, 2, 4, 6, 8];
                            for (var e = 0; e < evens.length; e++) {
                                var ex = viz.width / 2 - 80 + e * 40;
                                var isMatch = evens[e] === lastDigit;
                                ctx.font = (isMatch ? 'bold ' : '') + '16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = isMatch ? viz.colors.teal : viz.colors.text;
                                ctx.fillText(evens[e].toString(), ex, rowY);
                                if (isMatch) {
                                    ctx.strokeStyle = viz.colors.teal;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.arc(ex, rowY, 14, 0, Math.PI * 2);
                                    ctx.stroke();
                                }
                            }
                        }

                        inp.addEventListener('input', function() {
                            var val = parseInt(inp.value.replace(/[^0-9]/g, ''));
                            if (isFinite(val) && val >= 0) {
                                currentNum = val;
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
                    question: 'Is the number \\(123{,}456{,}789\\) divisible by 2? What about \\(123{,}456{,}780\\)?',
                    hint: 'Only look at the last digit.',
                    solution: '\\(123{,}456{,}789\\): last digit 9 (odd), so not divisible by 2. \\(123{,}456{,}780\\): last digit 0 (even), so divisible by 2.'
                },
                {
                    question: 'Prove that the sum of two even numbers is even, and the sum of an even and an odd number is odd.',
                    hint: 'Write even numbers as \\(2a\\) and \\(2b\\), and odd numbers as \\(2c+1\\).',
                    solution: 'Even + even: \\(2a + 2b = 2(a+b)\\), which is even. Even + odd: \\(2a + (2b+1) = 2(a+b) + 1\\), which is odd.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Divisibility by 3 and 9
        // ================================================================
        {
            id: 'sec-by3',
            title: 'Divisibility by 3 and 9',
            content: `
<h2>Divisibility by 3 and 9</h2>

<p>The rules for 3 and 9 are closely related and both use the <strong>digit sum</strong>.</p>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 3</div>
    <div class="env-body">
        <p>A whole number is divisible by 3 if and only if the <strong>sum of its digits</strong> is divisible by 3.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 9</div>
    <div class="env-body">
        <p>A whole number is divisible by 9 if and only if the <strong>sum of its digits</strong> is divisible by 9.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (for both 3 and 9)</div>
    <div class="env-body">
        <p>Write \\(n = d_k \\cdot 10^k + d_{k-1} \\cdot 10^{k-1} + \\cdots + d_1 \\cdot 10 + d_0\\). Since \\(10 \\equiv 1 \\pmod{9}\\), we have \\(10^j \\equiv 1^j = 1 \\pmod{9}\\) for all \\(j \\geq 0\\). Therefore</p>
        \\[n \\equiv d_k \\cdot 1 + d_{k-1} \\cdot 1 + \\cdots + d_0 \\cdot 1 = d_k + d_{k-1} + \\cdots + d_0 \\pmod{9}.\\]
        <p>So \\(9 \\mid n \\iff 9 \\mid (d_k + \\cdots + d_0)\\). Since \\(3 \\mid 9\\), the same argument gives \\(n \\equiv d_k + \\cdots + d_0 \\pmod{3}\\), so \\(3 \\mid n \\iff 3 \\mid (d_k + \\cdots + d_0)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(8{,}271\\): digit sum \\(8 + 2 + 7 + 1 = 18\\). Since \\(3 \\mid 18\\) and \\(9 \\mid 18\\), both \\(3 \\mid 8271\\) and \\(9 \\mid 8271\\). Indeed \\(8271 = 9 \\times 919\\).</li>
            <li>\\(5{,}432\\): digit sum \\(5 + 4 + 3 + 2 = 14\\). Since \\(3 \\nmid 14\\), we have \\(3 \\nmid 5432\\). (And since \\(9 \\nmid 14\\), also \\(9 \\nmid 5432\\).)</li>
            <li>\\(7{,}236\\): digit sum \\(7 + 2 + 3 + 6 = 18\\). So \\(3 \\mid 7236\\) and \\(9 \\mid 7236\\).</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Iterated Digit Sums</div>
    <div class="env-body">
        <p>You can apply the digit sum repeatedly. For instance, \\(987{,}654{,}321\\) has digit sum \\(9+8+7+6+5+4+3+2+1 = 45\\), then \\(4+5 = 9\\). Since \\(9 \\mid 9\\), the original number is divisible by 9. This process always terminates at the <em>digital root</em>, a single digit 1 through 9 (where 9 represents divisibility by 9).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-digit-sum"></div>
`,
            visualizations: [
                {
                    id: 'viz-digit-sum',
                    title: 'Digit Sum Calculator',
                    description: 'Watch the digit sum computed step by step. The animation breaks the number into its digits, adds them up, and checks divisibility by 3 and 9. Try iterated digit sums for large numbers.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentNum = 8271;
                        var animStep = -1;
                        var animTimer = null;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
                        var lbl = document.createElement('span');
                        lbl.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        lbl.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = '8271';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#f0f6fc;font-size:0.9rem;width:140px;';
                        var animBtn = document.createElement('button');
                        animBtn.textContent = 'Animate';
                        animBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        inputDiv.appendChild(animBtn);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var str = currentNum.toString();
                            var digits = [];
                            for (var i = 0; i < str.length; i++) digits.push(parseInt(str[i]));

                            var totalSum = 0;
                            for (var j = 0; j < digits.length; j++) totalSum += digits[j];

                            // Title
                            viz.screenText('Digit Sum of ' + currentNum, viz.width / 2, 25, viz.colors.white, 16);

                            // Show digits
                            var digitSize = Math.min(36, 400 / digits.length);
                            var gap = Math.min(12, 80 / digits.length);
                            var totalW = digits.length * (digitSize + gap);
                            var startX = (viz.width - totalW) / 2;
                            var digitY = 75;

                            var partialSum = 0;
                            var showUpTo = animStep >= 0 ? Math.min(animStep, digits.length - 1) : digits.length - 1;

                            for (var k = 0; k < digits.length; k++) {
                                var x = startX + k * (digitSize + gap) + digitSize / 2;
                                var highlighted = (animStep >= 0 && k === animStep && k < digits.length);

                                if (highlighted) {
                                    ctx.fillStyle = viz.colors.orange + '44';
                                    ctx.beginPath();
                                    ctx.arc(x, digitY, digitSize / 2 + 6, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.font = (highlighted ? 'bold ' : '') + digitSize + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = k <= showUpTo ? viz.colors.orange : viz.colors.text + '66';
                                ctx.fillText(digits[k].toString(), x, digitY);

                                if (k <= showUpTo) partialSum += digits[k];

                                // Plus sign between digits
                                if (k < digits.length - 1) {
                                    ctx.font = '16px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('+', x + digitSize / 2 + gap / 2, digitY);
                                }
                            }

                            // Arrow and partial/total sum
                            var sumY = 140;
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2, digitY + digitSize / 2 + 10);
                            ctx.lineTo(viz.width / 2, sumY - 10);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2 - 6, sumY - 16);
                            ctx.lineTo(viz.width / 2, sumY - 8);
                            ctx.lineTo(viz.width / 2 + 6, sumY - 16);
                            ctx.fill();

                            var displaySum = (animStep < 0 || animStep >= digits.length) ? totalSum : partialSum;
                            viz.screenText('= ' + displaySum, viz.width / 2, sumY + 5, viz.colors.teal, 24);

                            // Divisibility checks
                            var checkY = sumY + 50;
                            var finalSum = totalSum;

                            // Check 3
                            var div3 = finalSum % 3 === 0;
                            ctx.fillStyle = div3 ? viz.colors.green + '22' : viz.colors.red + '22';
                            ctx.beginPath();
                            ctx.roundRect(viz.width / 2 - 200, checkY, 180, 50, 6);
                            ctx.fill();
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = div3 ? viz.colors.green : viz.colors.red;
                            ctx.fillText((div3 ? '\u2713 ' : '\u2717 ') + 'Div by 3?', viz.width / 2 - 110, checkY + 18);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(finalSum + ' \u00F7 3 = ' + (finalSum / 3).toFixed(finalSum % 3 === 0 ? 0 : 2), viz.width / 2 - 110, checkY + 38);

                            // Check 9
                            var div9 = finalSum % 9 === 0;
                            ctx.fillStyle = div9 ? viz.colors.green + '22' : viz.colors.red + '22';
                            ctx.beginPath();
                            ctx.roundRect(viz.width / 2 + 20, checkY, 180, 50, 6);
                            ctx.fill();
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = div9 ? viz.colors.green : viz.colors.red;
                            ctx.fillText((div9 ? '\u2713 ' : '\u2717 ') + 'Div by 9?', viz.width / 2 + 110, checkY + 18);
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(finalSum + ' \u00F7 9 = ' + (finalSum / 9).toFixed(finalSum % 9 === 0 ? 0 : 2), viz.width / 2 + 110, checkY + 38);

                            // Iterated digit sum (digital root)
                            var iterY = checkY + 75;
                            var val = currentNum;
                            var chain = [val];
                            while (val >= 10) {
                                var s = 0;
                                var sv = val.toString();
                                for (var m = 0; m < sv.length; m++) s += parseInt(sv[m]);
                                val = s;
                                chain.push(val);
                            }
                            if (chain.length > 1) {
                                var chainStr = chain.join(' \u2192 ');
                                viz.screenText('Digital root: ' + chainStr, viz.width / 2, iterY, viz.colors.purple, 12);
                            }
                        }

                        inp.addEventListener('input', function() {
                            var val = parseInt(inp.value.replace(/[^0-9]/g, ''));
                            if (isFinite(val) && val >= 0) {
                                currentNum = val;
                                animStep = -1;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                draw();
                            }
                        });

                        animBtn.addEventListener('click', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            animStep = 0;
                            var len = currentNum.toString().length;
                            draw();
                            animTimer = setInterval(function() {
                                animStep++;
                                draw();
                                if (animStep >= len) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                            }, 500);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the digital root of 987,654,321. Is this number divisible by 3? By 9?',
                    hint: 'Compute the digit sum: \\(9+8+7+6+5+4+3+2+1\\). Then sum again if needed.',
                    solution: 'Digit sum: \\(9+8+7+6+5+4+3+2+1 = 45\\). Then \\(4+5=9\\). The digital root is 9. Since \\(9 \\mid 9\\), the number is divisible by both 3 and 9.'
                },
                {
                    question: 'A six-digit number has digits \\(a, b, c, d, e, f\\) and is divisible by 9. If five of the digits are 1, 3, 5, 7, 9, what is the sixth digit?',
                    hint: 'The digit sum must be divisible by 9. We know five digits sum to \\(1+3+5+7+9=25\\).',
                    solution: 'The five known digits sum to \\(1+3+5+7+9 = 25\\). The total digit sum must be divisible by 9, so the sixth digit \\(x\\) satisfies \\(9 \\mid (25+x)\\). Since \\(0 \\leq x \\leq 9\\), we need \\(25+x \\in \\{27, 36\\}\\), giving \\(x = 2\\) or \\(x = 11\\). Since a digit is at most 9, \\(x = 2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Divisibility by 5 and 10
        // ================================================================
        {
            id: 'sec-by5',
            title: 'Divisibility by 5 and 10',
            content: `
<h2>Divisibility by 5 and 10</h2>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 5</div>
    <div class="env-body">
        <p>A whole number is divisible by 5 if and only if its <strong>last digit is 0 or 5</strong>.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 10</div>
    <div class="env-body">
        <p>A whole number is divisible by 10 if and only if its <strong>last digit is 0</strong>.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Why They Work</div>
    <div class="env-body">
        <p>Write \\(n = 10q + d_0\\). Since \\(5 \\mid 10q\\), we have \\(5 \\mid n \\iff 5 \\mid d_0\\). Among digits 0 through 9, exactly \\(d_0 \\in \\{0, 5\\}\\) are divisible by 5.</p>
        <p>For 10: \\(10 \\mid n \\iff 10 \\mid d_0\\), and the only digit divisible by 10 is \\(d_0 = 0\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(7{,}245\\): last digit 5, so \\(5 \\mid 7245\\). But \\(10 \\nmid 7245\\) since the last digit is not 0.</li>
            <li>\\(3{,}890\\): last digit 0, so both \\(5 \\mid 3890\\) and \\(10 \\mid 3890\\).</li>
            <li>\\(1{,}003\\): last digit 3, so neither \\(5 \\mid 1003\\) nor \\(10 \\mid 1003\\).</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">A Pattern</div>
    <div class="env-body">
        <p>The rules for 2, 5, and 10 all depend only on the last digit. This is because \\(2, 5,\\) and \\(10\\) are all factors of 10 (the base of our number system). In base 8 (octal), the analogous "easy" divisibility tests would be for 2, 4, and 8.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'How many three-digit numbers are divisible by 5?',
                    hint: 'Three-digit numbers range from 100 to 999. Among these, which end in 0 or 5?',
                    solution: 'The three-digit multiples of 5 range from \\(100 = 5 \\times 20\\) to \\(995 = 5 \\times 199\\). Count: \\(199 - 20 + 1 = 180\\) three-digit multiples of 5.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Divisibility by 4 and 8
        // ================================================================
        {
            id: 'sec-by4-8',
            title: 'Divisibility by 4 and 8',
            content: `
<h2>Divisibility by 4 and 8</h2>

<p>For 2 we looked at the last digit. For 4 we need the last <em>two</em> digits, and for 8 the last <em>three</em>.</p>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 4</div>
    <div class="env-body">
        <p>A whole number is divisible by 4 if and only if the number formed by its <strong>last two digits</strong> is divisible by 4.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Why It Works</div>
    <div class="env-body">
        <p>Write \\(n = 100q + r\\), where \\(r\\) is the two-digit number formed by the last two digits (with \\(0 \\leq r \\leq 99\\)). Since \\(100 = 4 \\times 25\\), we have \\(4 \\mid 100q\\), so \\(4 \\mid n \\iff 4 \\mid r\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 8</div>
    <div class="env-body">
        <p>A whole number is divisible by 8 if and only if the number formed by its <strong>last three digits</strong> is divisible by 8.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Why It Works</div>
    <div class="env-body">
        <p>Write \\(n = 1000q + r\\), where \\(r\\) is the three-digit number formed by the last three digits. Since \\(1000 = 8 \\times 125\\), we have \\(8 \\mid 1000q\\), so \\(8 \\mid n \\iff 8 \\mid r\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(31{,}416\\): last two digits form 16. Since \\(16 = 4 \\times 4\\), we have \\(4 \\mid 31416\\). Last three digits: 416. \\(416 \\div 8 = 52\\), so \\(8 \\mid 31416\\) too.</li>
            <li>\\(7{,}254\\): last two digits form 54. \\(54 \\div 4 = 13.5\\), so \\(4 \\nmid 7254\\).</li>
            <li>\\(123{,}000\\): last three digits 000. \\(8 \\mid 0\\), so \\(8 \\mid 123000\\).</li>
        </ul>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Pattern: Powers of 2</div>
    <div class="env-body">
        <p>For divisibility by \\(2^k\\), check the last \\(k\\) digits. This is because \\(10^k\\) is divisible by \\(2^k\\) (since \\(10^k = 2^k \\cdot 5^k\\)), so the higher digits do not affect the remainder mod \\(2^k\\).</p>
        <ul>
            <li>\\(2 = 2^1\\): last 1 digit</li>
            <li>\\(4 = 2^2\\): last 2 digits</li>
            <li>\\(8 = 2^3\\): last 3 digits</li>
            <li>\\(16 = 2^4\\): last 4 digits (but this becomes less "quick" as a mental test)</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-divisibility-table"></div>
`,
            visualizations: [
                {
                    id: 'viz-divisibility-table',
                    title: 'Divisibility Table (1 to N)',
                    description: 'A grid of numbers from 1 to N, colored by which divisibility rules each number satisfies. Toggle different divisors on and off to see the patterns emerge. Numbers satisfying the selected rule are highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 100;
                        var selectedDiv = 3;

                        VizEngine.createSlider(controls, 'N', 30, 200, N, 10, function(v) {
                            N = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Divisor', 2, 11, selectedDiv, 1, function(v) {
                            selectedDiv = Math.round(v);
                            draw();
                        });

                        var divColors = {
                            2: '#58a6ff', 3: '#3fb950', 4: '#f0883e', 5: '#bc8cff',
                            6: '#f778ba', 7: '#d29922', 8: '#3fb9a0', 9: '#f85149',
                            10: '#58a6ff', 11: '#bc8cff'
                        };

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Numbers 1 to ' + N + '  |  Highlighting multiples of ' + selectedDiv, viz.width / 2, 18, viz.colors.white, 13);

                            var cols = Math.ceil(Math.sqrt(N * 1.4));
                            var rows = Math.ceil(N / cols);
                            var cellW = Math.min(40, (viz.width - 40) / cols);
                            var cellH = Math.min(28, (viz.height - 60) / rows);
                            var gridW = cols * cellW;
                            var gridH = rows * cellH;
                            var startX = (viz.width - gridW) / 2;
                            var startY = 38;

                            var color = divColors[selectedDiv] || viz.colors.teal;

                            for (var i = 1; i <= N; i++) {
                                var col = (i - 1) % cols;
                                var row = Math.floor((i - 1) / cols);
                                var x = startX + col * cellW;
                                var y = startY + row * cellH;
                                var isDivisible = i % selectedDiv === 0;

                                if (isDivisible) {
                                    ctx.fillStyle = color + '44';
                                    ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
                                }

                                ctx.font = (isDivisible ? 'bold ' : '') + (cellW < 30 ? '8' : '10') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = isDivisible ? color : viz.colors.text + '66';
                                ctx.fillText(i.toString(), x + cellW / 2, y + cellH / 2);
                            }

                            // Count
                            var count = Math.floor(N / selectedDiv);
                            viz.screenText(count + ' multiples of ' + selectedDiv + ' in [1, ' + N + ']', viz.width / 2, viz.height - 12, viz.colors.teal, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is \\(314{,}159{,}265\\) divisible by 4? By 8?',
                    hint: 'For 4, check the last two digits (65). For 8, check the last three digits (265).',
                    solution: 'Last two digits: 65. \\(65 \\div 4 = 16.25\\), so \\(4 \\nmid 314159265\\). Since 4 does not divide it, 8 cannot either (as \\(8 = 2 \\times 4\\)). We can verify: last three digits 265, \\(265 \\div 8 = 33.125\\), so \\(8 \\nmid 314159265\\).'
                },
                {
                    question: 'The number \\(73{,}\\!x\\!48\\) is divisible by 4 (where \\(x\\) is a missing digit). Find all possible values of \\(x\\).',
                    hint: 'For divisibility by 4, only the last two digits matter. But wait: what are the last two digits?',
                    solution: 'The last two digits are 48, regardless of \\(x\\). Since \\(48 = 4 \\times 12\\), the number is divisible by 4 for <em>every</em> digit \\(x \\in \\{0,1,\\ldots,9\\}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Divisibility by 7 and 11
        // ================================================================
        {
            id: 'sec-by7-11',
            title: 'Divisibility by 7 and 11',
            content: `
<h2>Divisibility by 7 and 11</h2>

<h3>Divisibility by 11: The Alternating Sum</h3>

<div class="env-block theorem">
    <div class="env-title">Rule: Divisibility by 11</div>
    <div class="env-body">
        <p>A number is divisible by 11 if and only if its <strong>alternating digit sum</strong> is divisible by 11. Starting from the rightmost digit, alternate adding and subtracting:</p>
        \\[d_0 - d_1 + d_2 - d_3 + \\cdots\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Since \\(10 \\equiv -1 \\pmod{11}\\), we have \\(10^k \\equiv (-1)^k \\pmod{11}\\). Therefore</p>
        \\[n = \\sum_{j} d_j \\cdot 10^j \\equiv \\sum_{j} d_j \\cdot (-1)^j = d_0 - d_1 + d_2 - d_3 + \\cdots \\pmod{11}.\\]
        <p>So \\(11 \\mid n \\iff 11 \\mid (d_0 - d_1 + d_2 - \\cdots)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <ul>
            <li>\\(918{,}082\\): alternating sum (from right) \\(2 - 8 + 0 - 8 + 1 - 9 = -22\\). Since \\(11 \\mid -22\\), we have \\(11 \\mid 918082\\).</li>
            <li>\\(12{,}345\\): alternating sum \\(5 - 4 + 3 - 2 + 1 = 3\\). Since \\(11 \\nmid 3\\), we have \\(11 \\nmid 12345\\).</li>
            <li>\\(121\\): alternating sum \\(1 - 2 + 1 = 0\\). Since \\(11 \\mid 0\\), we have \\(11 \\mid 121\\) (indeed \\(121 = 11^2\\)).</li>
        </ul>
    </div>
</div>

<h3>Divisibility by 7</h3>

<p>There is no simple digit-based rule for 7 comparable to the ones above. Several tricks exist, but none is as elegant:</p>

<div class="env-block remark">
    <div class="env-title">A Method for 7</div>
    <div class="env-body">
        <p>One approach: take the last digit, double it, and subtract from the remaining number. Repeat until the result is small enough to check directly.</p>
        <p>Example: Is \\(371\\) divisible by 7?</p>
        <ul>
            <li>Last digit 1; double it: 2. Remaining: 37. Compute \\(37 - 2 = 35\\).</li>
            <li>\\(35 = 5 \\times 7\\), so yes, \\(7 \\mid 371\\).</li>
        </ul>
        <p>Why? Because \\(n = 10q + d\\) and \\(q - 2d \\equiv 0 \\pmod 7 \\iff 10q + d \\equiv 0 \\pmod 7\\) (since \\(10(q-2d) + 21d = 10q + d\\) and \\(7 \\mid 21d\\)).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Testing 1,764 for divisibility by 7</div>
    <div class="env-body">
        <ul>
            <li>\\(1764\\): last digit 4, double it: 8. \\(176 - 8 = 168\\).</li>
            <li>\\(168\\): last digit 8, double it: 16. \\(16 - 16 = 0\\).</li>
            <li>\\(7 \\mid 0\\), so \\(7 \\mid 1764\\). Indeed \\(1764 = 7 \\times 252\\).</li>
        </ul>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-alternating-sum"></div>
`,
            visualizations: [
                {
                    id: 'viz-alternating-sum',
                    title: 'Alternating Digit Sum for 11',
                    description: 'Watch the alternating sum computed step by step. Digits are alternately added (green) and subtracted (red) starting from the units place. The result tells you if the number is divisible by 11.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentNum = 918082;
                        var animStep = -1;
                        var animTimer = null;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
                        var lbl = document.createElement('span');
                        lbl.style.cssText = 'color:#8b949e;font-size:0.85rem;';
                        lbl.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = '918082';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#f0f6fc;font-size:0.9rem;width:140px;';
                        var animBtn = document.createElement('button');
                        animBtn.textContent = 'Animate';
                        animBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        inputDiv.appendChild(animBtn);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var str = currentNum.toString();
                            var digits = [];
                            for (var i = 0; i < str.length; i++) digits.push(parseInt(str[i]));
                            // Reverse for alternating sum from right
                            var revDigits = digits.slice().reverse();

                            viz.screenText('Alternating Digit Sum of ' + currentNum, viz.width / 2, 25, viz.colors.white, 15);

                            // Draw digits with +/- signs
                            var digitSize = Math.min(32, 380 / digits.length);
                            var gap = Math.min(16, 100 / digits.length);
                            var totalW = digits.length * (digitSize + gap + 14);
                            var startX = (viz.width - totalW) / 2 + 10;
                            var digitY = 80;

                            var showUpTo = animStep >= 0 ? Math.min(animStep, digits.length - 1) : digits.length - 1;
                            var partialSum = 0;

                            for (var k = 0; k < digits.length; k++) {
                                // Position in the display (left to right = digits[0] to digits[len-1])
                                // But alternating sum is from right: position from right = len-1-k
                                var posFromRight = digits.length - 1 - k;
                                var isAdd = posFromRight % 2 === 0;
                                var sign = isAdd ? '+' : '-';
                                var x = startX + k * (digitSize + gap + 14);
                                var highlighted = (animStep >= 0 && posFromRight === animStep);
                                var active = posFromRight <= showUpTo;

                                // Sign
                                if (k > 0) {
                                    ctx.font = '14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = active ? (isAdd ? viz.colors.green : viz.colors.red) : viz.colors.text + '44';
                                    ctx.fillText(sign, x - gap / 2 - 7, digitY);
                                }

                                if (highlighted) {
                                    ctx.fillStyle = (isAdd ? viz.colors.green : viz.colors.red) + '33';
                                    ctx.beginPath();
                                    ctx.arc(x + digitSize / 2, digitY, digitSize / 2 + 6, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.font = (highlighted ? 'bold ' : '') + digitSize + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = active ? (isAdd ? viz.colors.green : viz.colors.red) : viz.colors.text + '44';
                                ctx.fillText(digits[k].toString(), x + digitSize / 2, digitY);

                                // Small position label
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text + '88';
                                ctx.fillText(isAdd ? '+' : '\u2212', x + digitSize / 2, digitY + digitSize / 2 + 12);
                            }

                            // Compute full alternating sum
                            var altSum = 0;
                            for (var j = 0; j < revDigits.length; j++) {
                                altSum += (j % 2 === 0 ? 1 : -1) * revDigits[j];
                            }

                            // Compute partial sum
                            if (animStep >= 0) {
                                partialSum = 0;
                                for (var m = 0; m <= Math.min(animStep, revDigits.length - 1); m++) {
                                    partialSum += (m % 2 === 0 ? 1 : -1) * revDigits[m];
                                }
                            }

                            var displaySum = (animStep < 0 || animStep >= digits.length) ? altSum : partialSum;

                            // Arrow
                            var sumY = 160;
                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2, digitY + digitSize / 2 + 22);
                            ctx.lineTo(viz.width / 2, sumY - 10);
                            ctx.stroke();

                            viz.screenText('Alternating sum = ' + displaySum, viz.width / 2, sumY + 5, viz.colors.purple, 20);

                            // Divisibility check
                            var checkY = sumY + 45;
                            var div11 = altSum % 11 === 0;
                            ctx.fillStyle = div11 ? viz.colors.green + '22' : viz.colors.red + '22';
                            ctx.beginPath();
                            ctx.roundRect(viz.width / 2 - 120, checkY, 240, 50, 6);
                            ctx.fill();

                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = div11 ? viz.colors.green : viz.colors.red;
                            ctx.fillText((div11 ? '\u2713 ' : '\u2717 ') + 'Divisible by 11?', viz.width / 2, checkY + 20);
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText(altSum + ' \u00F7 11 = ' + (altSum / 11).toFixed(altSum % 11 === 0 ? 0 : 2), viz.width / 2, checkY + 40);

                            // Explanation
                            viz.screenText('Since 10 \u2261 -1 (mod 11), powers of 10 alternate: +1, -1, +1, -1, ...', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }

                        inp.addEventListener('input', function() {
                            var val = parseInt(inp.value.replace(/[^0-9]/g, ''));
                            if (isFinite(val) && val >= 0) {
                                currentNum = val;
                                animStep = -1;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                draw();
                            }
                        });

                        animBtn.addEventListener('click', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            var len = currentNum.toString().length;
                            animStep = 0;
                            draw();
                            animTimer = setInterval(function() {
                                animStep++;
                                draw();
                                if (animStep >= len) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                            }, 600);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is \\(2{,}728\\) divisible by 11?',
                    hint: 'Compute the alternating sum from the right: \\(8 - 2 + 7 - 2\\).',
                    solution: 'Alternating sum: \\(8 - 2 + 7 - 2 = 11\\). Since \\(11 \\mid 11\\), yes, \\(11 \\mid 2728\\). Indeed \\(2728 = 11 \\times 248\\).'
                },
                {
                    question: 'Use the "double and subtract" method to test whether 2,401 is divisible by 7.',
                    hint: 'Take the last digit (1), double it (2), subtract from 240 to get 238. Repeat.',
                    solution: '\\(2401\\): last digit 1, double: 2. \\(240 - 2 = 238\\). Next: last digit 8, double: 16. \\(23 - 16 = 7\\). Since \\(7 \\mid 7\\), yes, \\(7 \\mid 2401\\). Indeed \\(2401 = 7^4\\).'
                },
                {
                    question: 'Find the smallest positive integer that is divisible by both 7 and 11.',
                    hint: 'Since 7 and 11 are both prime, what is their LCM?',
                    solution: 'Since \\(\\gcd(7,11) = 1\\), we have \\(\\text{lcm}(7,11) = 7 \\times 11 = 77\\). The smallest positive integer divisible by both is 77.'
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
<h2>Looking Ahead: From Divisibility to Primes</h2>

<p>We now have a toolkit for quickly testing divisibility by any number from 2 to 11:</p>

<table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:0.9em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:8px; text-align:center;">Divisor</th>
        <th style="padding:8px; text-align:left;">Rule</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">2</td>
        <td style="padding:8px;">Last digit is even</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">3</td>
        <td style="padding:8px;">Digit sum divisible by 3</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">4</td>
        <td style="padding:8px;">Last two digits form a number divisible by 4</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">5</td>
        <td style="padding:8px;">Last digit is 0 or 5</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">6</td>
        <td style="padding:8px;">Divisible by both 2 and 3</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">7</td>
        <td style="padding:8px;">Double-and-subtract method</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">8</td>
        <td style="padding:8px;">Last three digits form a number divisible by 8</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">9</td>
        <td style="padding:8px;">Digit sum divisible by 9</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:8px; text-align:center;">10</td>
        <td style="padding:8px;">Last digit is 0</td>
    </tr>
    <tr>
        <td style="padding:8px; text-align:center;">11</td>
        <td style="padding:8px;">Alternating digit sum divisible by 11</td>
    </tr>
</table>

<div class="env-block intuition">
    <div class="env-title">The Big Picture</div>
    <div class="env-body">
        <p>Notice something about this list: many of the divisibility tests reduce to checking just 2 and 3 (for instance, 6 = 2 \\(\\times\\) 3 requires both tests). The numbers 2, 3, 5, 7, and 11 in our list are special: they are <strong>prime numbers</strong>, the building blocks of all whole numbers. In the next chapter, we explore primes and their remarkable properties.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Composite Rules from Prime Rules</div>
    <div class="env-body">
        <p>To test divisibility by a composite number, factor it into coprime parts and test each:</p>
        <ul>
            <li>\\(6 = 2 \\times 3\\): test both 2 and 3.</li>
            <li>\\(12 = 4 \\times 3\\): test 4 (last two digits) and 3 (digit sum).</li>
            <li>\\(15 = 3 \\times 5\\): test both 3 and 5.</li>
        </ul>
        <p>This works because when \\(\\gcd(a, b) = 1\\), we have \\(ab \\mid n \\iff a \\mid n\\) and \\(b \\mid n\\).</p>
    </div>
</div>

<p>Test your speed with the challenge below, then move on to Chapter 3: Prime Numbers.</p>

<div class="viz-placeholder" data-viz="viz-speed-challenge"></div>
`,
            visualizations: [
                {
                    id: 'viz-speed-challenge',
                    title: 'Speed Challenge: Divisibility Quiz',
                    description: 'Test your divisibility skills against the clock! You will be asked whether a random number is divisible by a given divisor. Answer as many as you can in 60 seconds.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var state = 'ready'; // ready, playing, done
                        var score = 0;
                        var total = 0;
                        var streak = 0;
                        var bestStreak = 0;
                        var timeLeft = 60;
                        var currentN = 0;
                        var currentD = 0;
                        var feedback = '';
                        var feedbackColor = '';
                        var feedbackTimer = null;
                        var gameTimer = null;

                        var startBtn = VizEngine.createButton(controls, 'Start!', function() {
                            if (state === 'playing') return;
                            state = 'playing';
                            score = 0;
                            total = 0;
                            streak = 0;
                            bestStreak = 0;
                            timeLeft = 60;
                            feedback = '';
                            generateQuestion();
                            draw();
                            if (gameTimer) clearInterval(gameTimer);
                            gameTimer = setInterval(function() {
                                timeLeft--;
                                if (timeLeft <= 0) {
                                    state = 'done';
                                    clearInterval(gameTimer);
                                    gameTimer = null;
                                }
                                draw();
                            }, 1000);
                        });

                        var yesBtn = VizEngine.createButton(controls, 'Yes (divisible)', function() {
                            if (state !== 'playing') return;
                            answer(true);
                        });

                        var noBtn = VizEngine.createButton(controls, 'No (not divisible)', function() {
                            if (state !== 'playing') return;
                            answer(false);
                        });

                        function generateQuestion() {
                            var divisors = [2, 3, 4, 5, 6, 7, 8, 9, 11];
                            currentD = divisors[Math.floor(Math.random() * divisors.length)];
                            // Generate number: sometimes divisible, sometimes not
                            if (Math.random() < 0.5) {
                                // Make a divisible number
                                var mult = Math.floor(Math.random() * 999) + 10;
                                currentN = mult * currentD;
                            } else {
                                // Random number (might or might not be divisible)
                                currentN = Math.floor(Math.random() * 9900) + 100;
                            }
                        }

                        function answer(saidYes) {
                            var correct = (currentN % currentD === 0);
                            var isCorrect = (saidYes === correct);
                            total++;
                            if (isCorrect) {
                                score++;
                                streak++;
                                if (streak > bestStreak) bestStreak = streak;
                                feedback = 'Correct!';
                                feedbackColor = viz.colors.green;
                            } else {
                                streak = 0;
                                feedback = 'Wrong! ' + currentN + (correct ? ' IS' : ' is NOT') + ' divisible by ' + currentD;
                                feedbackColor = viz.colors.red;
                            }
                            if (feedbackTimer) clearTimeout(feedbackTimer);
                            feedbackTimer = setTimeout(function() { feedback = ''; draw(); }, 1500);
                            generateQuestion();
                            draw();
                        }

                        // Keyboard support
                        document.addEventListener('keydown', function(e) {
                            if (state !== 'playing') return;
                            if (e.target.tagName === 'INPUT') return;
                            if (e.key === 'y' || e.key === 'Y') answer(true);
                            if (e.key === 'n' || e.key === 'N') answer(false);
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            if (state === 'ready') {
                                viz.screenText('Divisibility Speed Challenge', viz.width / 2, 80, viz.colors.white, 20);
                                viz.screenText('Answer "Yes" or "No" as fast as you can.', viz.width / 2, 120, viz.colors.text, 13);
                                viz.screenText('Press Start to begin! (60 seconds)', viz.width / 2, 160, viz.colors.teal, 13);
                                viz.screenText('Keyboard: Y = Yes, N = No', viz.width / 2, 200, viz.colors.text, 11);
                                return;
                            }

                            if (state === 'done') {
                                viz.screenText('Time\'s Up!', viz.width / 2, 60, viz.colors.orange, 24);
                                viz.screenText('Score: ' + score + ' / ' + total, viz.width / 2, 110, viz.colors.white, 20);
                                var pct = total > 0 ? Math.round(score / total * 100) : 0;
                                viz.screenText('Accuracy: ' + pct + '%', viz.width / 2, 150, viz.colors.teal, 16);
                                viz.screenText('Best streak: ' + bestStreak, viz.width / 2, 185, viz.colors.purple, 14);

                                var rating = pct >= 95 ? 'Number Theory Master!' :
                                             pct >= 80 ? 'Great work!' :
                                             pct >= 60 ? 'Good effort, keep practicing!' : 'Review the rules and try again!';
                                viz.screenText(rating, viz.width / 2, 230, viz.colors.orange, 14);
                                viz.screenText('Press Start to play again', viz.width / 2, 280, viz.colors.text, 12);
                                return;
                            }

                            // Playing state
                            // Timer bar
                            var barW = 400;
                            var barH = 12;
                            var barX = (viz.width - barW) / 2;
                            var barY = 15;
                            ctx.fillStyle = viz.colors.grid;
                            ctx.fillRect(barX, barY, barW, barH);
                            var pctTime = timeLeft / 60;
                            var barColor = pctTime > 0.3 ? viz.colors.teal : viz.colors.red;
                            ctx.fillStyle = barColor;
                            ctx.fillRect(barX, barY, barW * pctTime, barH);
                            viz.screenText(timeLeft + 's', barX + barW + 20, barY + barH / 2, viz.colors.white, 12);

                            // Score
                            viz.screenText('Score: ' + score + '/' + total, 80, 55, viz.colors.white, 13, 'center');
                            viz.screenText('Streak: ' + streak, viz.width - 80, 55, viz.colors.purple, 13, 'center');

                            // Question
                            viz.screenText('Is', viz.width / 2, 100, viz.colors.text, 16);
                            viz.screenText(currentN.toLocaleString(), viz.width / 2, 145, viz.colors.white, 40);
                            viz.screenText('divisible by ' + currentD + '?', viz.width / 2, 190, viz.colors.teal, 18);

                            // Feedback
                            if (feedback) {
                                viz.screenText(feedback, viz.width / 2, 240, feedbackColor, 16);
                            }

                            // Hint
                            viz.screenText('Press Y (yes) or N (no)', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Test whether 7,007 is divisible by 7, 11, and 13.',
                    hint: 'Note that \\(7007 = 7 \\times 1001\\). What is the prime factorization of 1001?',
                    solution: '\\(7007 = 7 \\times 1001 = 7 \\times 7 \\times 143 = 7 \\times 7 \\times 11 \\times 13\\). So \\(7 \\mid 7007\\), \\(11 \\mid 7007\\), and \\(13 \\mid 7007\\). Alternatively, use the rules: digit sum \\(7+0+0+7=14\\), not divisible by 3. Alternating sum \\(7-0+0-7=0\\), divisible by 11. For 7: \\(700 - 2(7) = 686\\), \\(68 - 12 = 56 = 7 \\times 8\\).'
                },
                {
                    question: 'A number \\(N\\) is formed by writing the digits 1 through 9 in order: \\(N = 123456789\\). Which of 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 divide \\(N\\)?',
                    hint: 'Compute: last digit, digit sum, last two digits, last three digits, alternating sum.',
                    solution: 'Last digit 9 (odd), so \\(2 \\nmid N\\), \\(5 \\nmid N\\), \\(10 \\nmid N\\). Digit sum \\(1+2+\\cdots+9 = 45\\), so \\(3 \\mid N\\) and \\(9 \\mid N\\). Since \\(2 \\nmid N\\), also \\(4 \\nmid N\\), \\(6 \\nmid N\\), \\(8 \\nmid N\\). Alternating sum: \\(9-8+7-6+5-4+3-2+1 = 5\\), so \\(11 \\nmid N\\). For 7: \\(12345678 - 2(9) = 12345660\\), continuing... \\(123456789 / 7 \\approx 17636684.1\\), so \\(7 \\nmid N\\). Only 3 and 9 divide \\(N\\).'
                }
            ]
        }
    ]
});
