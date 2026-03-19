window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: 'Number Theory in Everyday Life',
    subtitle: 'Where numbers hide in your daily life',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'The Hidden Mathematics',
            content: `
<h2>The Hidden Mathematics</h2>

<div class="env-block intuition">
    <div class="env-title">Numbers Are Everywhere</div>
    <div class="env-body">
        <p>You wake up to a digital alarm clock that stores time in binary. You scan a barcode at the grocery store, and a check digit (computed with modular arithmetic) confirms the product is genuine. Your phone encrypts a message using prime factorization. You hum a melody whose harmony depends on integer ratios. Sunflowers spiral with Fibonacci numbers. Cicadas emerge on prime-year cycles.</p>
        <p>Number theory is not confined to textbooks. It is woven into the fabric of daily life, from commerce to music to the natural world.</p>
    </div>
</div>

<p>Throughout this course, we have built an edifice of ideas: divisibility, primes, modular arithmetic, Diophantine equations, quadratic residues, and more. In this final chapter, we pull back the curtain and see these ideas at work in the world around us.</p>

<p>We will explore six domains where number theory plays a starring role:</p>
<ol>
    <li><strong>Barcodes and error detection</strong>, where modular arithmetic catches scanning mistakes.</li>
    <li><strong>Calendars</strong>, where modular arithmetic determines the day of the week for any date in history.</li>
    <li><strong>Music and harmony</strong>, where integer ratios create consonance and dissonance.</li>
    <li><strong>Numbers in nature</strong>, where Fibonacci sequences, hexagons, and prime cycles appear in biology.</li>
    <li><strong>Computers</strong>, where binary and hexadecimal are the native languages of machines.</li>
    <li><strong>Unsolved problems</strong>, where the frontier of number theory still beckons.</li>
</ol>

<p>This chapter is a capstone: a celebration of the tools you have learned, and an invitation to keep exploring.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Barcodes & ISBN
        // ================================================================
        {
            id: 'sec-barcodes',
            title: 'Barcodes & ISBN',
            content: `
<h2>Barcodes & ISBN: Error Detection with Modular Arithmetic</h2>

<div class="env-block intuition">
    <div class="env-title">Why Check Digits?</div>
    <div class="env-body">
        <p>Every time a cashier scans a product, a laser reads a sequence of digits from the barcode. But what if the laser misreads a digit? What if a warehouse worker transposes two adjacent digits when typing a code? Check digits are an elegant application of modular arithmetic that catches these errors automatically.</p>
    </div>
</div>

<h3>UPC Barcodes</h3>

<p>A standard UPC-A barcode has 12 digits \\(d_1 d_2 \\ldots d_{12}\\). The last digit \\(d_{12}\\) is a <strong>check digit</strong> chosen so that:</p>

\\[
3(d_1 + d_3 + d_5 + d_7 + d_9 + d_{11}) + (d_2 + d_4 + d_6 + d_8 + d_{10} + d_{12}) \\equiv 0 \\pmod{10}.
\\]

<p>The weights alternate between 3 and 1. This scheme detects:</p>
<ul>
    <li><strong>Any single-digit error</strong>: changing one digit always changes the checksum (mod 10).</li>
    <li><strong>Most transposition errors</strong>: swapping two adjacent digits is detected unless their difference is 0 or 5.</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: Verifying a UPC</div>
    <div class="env-body">
        <p>Consider the UPC code 036000291452. Let us verify:</p>
        <p>Odd positions (1,3,5,7,9,11): 0, 6, 0, 2, 1, 5. Sum = 14.</p>
        <p>Even positions (2,4,6,8,10,12): 3, 0, 0, 9, 4, 2. Sum = 18.</p>
        <p>\\(3 \\times 14 + 18 = 42 + 18 = 60 \\equiv 0 \\pmod{10}\\). Valid!</p>
    </div>
</div>

<h3>ISBN-13</h3>

<p>Books use the ISBN-13 system, which works identically to UPC-A: the same alternating weights of 1 and 3 (with positions indexed slightly differently), and the same check modulo 10.</p>

<h3>ISBN-10</h3>

<p>The older ISBN-10 uses a more sophisticated scheme. For digits \\(d_1 d_2 \\ldots d_{10}\\):</p>

\\[
\\sum_{i=1}^{10} i \\cdot d_i \\equiv 0 \\pmod{11}.
\\]

<p>Since we work modulo 11 (a prime!), this system can detect <strong>all</strong> single-digit errors and <strong>all</strong> transpositions of two digits. The check digit \\(d_{10}\\) can be 0 through 9, or the letter X (representing 10).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.1 (ISBN-10 Error Detection)</div>
    <div class="env-body">
        <p>The ISBN-10 check detects every single-digit substitution error and every transposition of two adjacent digits.</p>
        <p><em>Proof sketch.</em> A single-digit error at position \\(i\\) changes the checksum by \\(i \\cdot (d_i' - d_i) \\pmod{11}\\). Since 11 is prime and \\(1 \\le i \\le 10\\), neither \\(i\\) nor \\(d_i' - d_i\\) (which is nonzero) is divisible by 11. So the error is always detected. For transpositions of positions \\(i\\) and \\(j\\), the checksum changes by \\((i - j)(d_i - d_j) \\pmod{11}\\). Again, since \\(i \\neq j\\) and \\(d_i \\neq d_j\\), neither factor is zero mod 11. \\(\\square\\)</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-barcode-checker"></div>
`,
            visualizations: [
                {
                    id: 'viz-barcode-checker',
                    title: 'Barcode Check Digit Verifier',
                    description: 'Enter a UPC-12, ISBN-13, or ISBN-10 code to verify its check digit. The visualization shows the weighted sum computation step by step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.placeholder = 'Enter UPC-12, ISBN-13, or ISBN-10';
                        inp.value = '036000291452';
                        inp.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;width:260px;font-family:monospace;';
                        inputDiv.appendChild(inp);

                        var selectMode = document.createElement('select');
                        selectMode.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;';
                        selectMode.innerHTML = '<option value="upc">UPC-12</option><option value="isbn13">ISBN-13</option><option value="isbn10">ISBN-10</option>';
                        inputDiv.appendChild(selectMode);
                        controls.appendChild(inputDiv);

                        var btnCheck = VizEngine.createButton(controls, 'Verify', function() { draw(); });

                        inp.addEventListener('keyup', function(e) { if (e.key === 'Enter') draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var code = inp.value.replace(/[^0-9Xx]/g, '');
                            var mode = selectMode.value;

                            viz.screenText('Check Digit Verification', viz.width / 2, 20, viz.colors.white, 16);

                            if (mode === 'isbn10') {
                                drawISBN10(ctx, code);
                            } else {
                                drawUPC(ctx, code, mode);
                            }
                        }

                        function drawUPC(ctx, code, mode) {
                            var n = (mode === 'upc') ? 12 : 13;
                            var label = (mode === 'upc') ? 'UPC-12' : 'ISBN-13';

                            if (code.length !== n) {
                                viz.screenText('Please enter exactly ' + n + ' digits for ' + label, viz.width / 2, viz.height / 2, viz.colors.red, 14);
                                return;
                            }

                            var digits = [];
                            for (var i = 0; i < n; i++) digits.push(parseInt(code[i]));

                            var cellW = Math.min(40, (viz.width - 60) / n);
                            var startX = (viz.width - n * cellW) / 2;
                            var y0 = 55;

                            // Draw digit boxes
                            for (var i = 0; i < n; i++) {
                                var x = startX + i * cellW;
                                var isOdd = (i % 2 === 0);
                                var weight = isOdd ? 1 : 3;

                                // Box
                                ctx.fillStyle = (i === n - 1) ? viz.colors.purple + '33' : (isOdd ? viz.colors.blue + '22' : viz.colors.teal + '22');
                                ctx.fillRect(x + 1, y0, cellW - 2, 36);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x + 1, y0, cellW - 2, 36);

                                // Digit
                                ctx.fillStyle = (i === n - 1) ? viz.colors.purple : viz.colors.white;
                                ctx.font = 'bold 16px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(digits[i].toString(), x + cellW / 2, y0 + 18);

                                // Position label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText('d' + (i + 1), x + cellW / 2, y0 - 8);

                                // Weight
                                var w = (i % 2 === 0) ? 1 : 3;
                                ctx.fillStyle = isOdd ? viz.colors.blue : viz.colors.teal;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('\u00D7' + w, x + cellW / 2, y0 + 50);

                                // Product
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px monospace';
                                ctx.fillText((digits[i] * w).toString(), x + cellW / 2, y0 + 66);
                            }

                            // Compute checksum
                            var sum = 0;
                            for (var i = 0; i < n; i++) {
                                var w = (i % 2 === 0) ? 1 : 3;
                                sum += digits[i] * w;
                            }

                            var valid = (sum % 10 === 0);

                            // Labels
                            viz.screenText('Weights:', startX - 5, y0 + 50, viz.colors.text, 11, 'right');
                            viz.screenText('Products:', startX - 5, y0 + 66, viz.colors.text, 11, 'right');

                            // Sum line
                            var sumY = y0 + 100;
                            viz.screenText('Sum of products = ' + sum, viz.width / 2, sumY, viz.colors.white, 14);
                            viz.screenText(sum + ' mod 10 = ' + (sum % 10), viz.width / 2, sumY + 24, viz.colors.white, 14);

                            if (valid) {
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(viz.width / 2 - 80, sumY + 44, 160, 32);
                                viz.screenText('VALID', viz.width / 2, sumY + 60, viz.colors.green, 18);
                            } else {
                                ctx.fillStyle = viz.colors.red + '22';
                                ctx.fillRect(viz.width / 2 - 80, sumY + 44, 160, 32);
                                viz.screenText('INVALID', viz.width / 2, sumY + 60, viz.colors.red, 18);

                                // Compute correct check digit
                                var partialSum = 0;
                                for (var i = 0; i < n - 1; i++) {
                                    var w = (i % 2 === 0) ? 1 : 3;
                                    partialSum += digits[i] * w;
                                }
                                var correct = (10 - (partialSum % 10)) % 10;
                                viz.screenText('Expected check digit: ' + correct, viz.width / 2, sumY + 90, viz.colors.orange, 13);
                            }

                            // Draw barcode-like stripes at bottom
                            var barcodeY = sumY + 120;
                            var barcodeH = viz.height - barcodeY - 20;
                            if (barcodeH > 20) {
                                for (var i = 0; i < n; i++) {
                                    var x = startX + i * cellW;
                                    for (var b = 0; b < 4; b++) {
                                        var bit = (digits[i] >> (3 - b)) & 1;
                                        if (bit) {
                                            ctx.fillStyle = valid ? viz.colors.green + '88' : viz.colors.red + '66';
                                            ctx.fillRect(x + b * (cellW / 4) + 1, barcodeY, cellW / 4 - 1, barcodeH);
                                        }
                                    }
                                }
                            }
                        }

                        function drawISBN10(ctx, code) {
                            if (code.length !== 10) {
                                viz.screenText('Please enter exactly 10 characters for ISBN-10', viz.width / 2, viz.height / 2, viz.colors.red, 14);
                                return;
                            }

                            var digits = [];
                            for (var i = 0; i < 10; i++) {
                                if (i === 9 && (code[i] === 'X' || code[i] === 'x')) {
                                    digits.push(10);
                                } else {
                                    digits.push(parseInt(code[i]));
                                }
                            }

                            var cellW = Math.min(48, (viz.width - 60) / 10);
                            var startX = (viz.width - 10 * cellW) / 2;
                            var y0 = 55;

                            for (var i = 0; i < 10; i++) {
                                var x = startX + i * cellW;
                                var weight = i + 1;

                                ctx.fillStyle = (i === 9) ? viz.colors.purple + '33' : viz.colors.blue + '22';
                                ctx.fillRect(x + 1, y0, cellW - 2, 36);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x + 1, y0, cellW - 2, 36);

                                ctx.fillStyle = (i === 9) ? viz.colors.purple : viz.colors.white;
                                ctx.font = 'bold 16px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                var displayDigit = (digits[i] === 10) ? 'X' : digits[i].toString();
                                ctx.fillText(displayDigit, x + cellW / 2, y0 + 18);

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText('d' + (i + 1), x + cellW / 2, y0 - 8);

                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('\u00D7' + weight, x + cellW / 2, y0 + 50);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px monospace';
                                ctx.fillText((digits[i] * weight).toString(), x + cellW / 2, y0 + 66);
                            }

                            var sum = 0;
                            for (var i = 0; i < 10; i++) sum += (i + 1) * digits[i];

                            var valid = (sum % 11 === 0);

                            viz.screenText('Weights:', startX - 5, y0 + 50, viz.colors.text, 11, 'right');
                            viz.screenText('Products:', startX - 5, y0 + 66, viz.colors.text, 11, 'right');

                            var sumY = y0 + 100;
                            viz.screenText('Sum = ' + sum, viz.width / 2, sumY, viz.colors.white, 14);
                            viz.screenText(sum + ' mod 11 = ' + (sum % 11), viz.width / 2, sumY + 24, viz.colors.white, 14);

                            if (valid) {
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(viz.width / 2 - 80, sumY + 44, 160, 32);
                                viz.screenText('VALID', viz.width / 2, sumY + 60, viz.colors.green, 18);
                            } else {
                                ctx.fillStyle = viz.colors.red + '22';
                                ctx.fillRect(viz.width / 2 - 80, sumY + 44, 160, 32);
                                viz.screenText('INVALID', viz.width / 2, sumY + 60, viz.colors.red, 18);
                            }

                            viz.screenText('ISBN-10 uses mod 11 (a prime), detecting ALL single errors and transpositions',
                                viz.width / 2, sumY + 95, viz.colors.teal, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does the UPC system fail to detect a transposition of two adjacent digits whose difference is 5 (e.g., swapping a 2 and a 7)? Why does ISBN-10 avoid this problem?',
                    hint: 'If adjacent digits \\(d_i\\) and \\(d_{i+1}\\) are swapped, how does the checksum change? The weights differ by 2 (from 1 to 3 or 3 to 1).',
                    solution: 'Adjacent positions have weights that differ by 2 (one is 1, the next is 3). Swapping digits \\(a\\) and \\(b\\) changes the checksum by \\(2(a - b) \\pmod{10}\\). If \\(|a - b| = 5\\), then \\(2 \\times 5 = 10 \\equiv 0 \\pmod{10}\\), so the error is undetected. For example, swapping 2 and 7 changes the checksum by \\(\\pm 10 \\equiv 0\\). ISBN-10 uses mod 11 (a prime), with weights 1,2,...,10, so the change from transposing positions \\(i,j\\) is \\((i-j)(a-b) \\bmod 11\\). Since 11 is prime and \\(1 \\le |i-j| \\le 9\\), \\(1 \\le |a-b| \\le 9\\), neither factor is zero mod 11, so all transpositions are detected.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Calendars
        // ================================================================
        {
            id: 'sec-calendars',
            title: 'Calendars',
            content: `
<h2>Calendars: Modular Arithmetic and the Days of the Week</h2>

<div class="env-block intuition">
    <div class="env-title">What Day Was It?</div>
    <div class="env-body">
        <p>On what day of the week were you born? On what day will January 1, 2100 fall? These questions are answered by modular arithmetic. Since the week has 7 days, we work modulo 7. Since a common year has 365 = 52 \u00D7 7 + 1 days, each year shifts the day of the week by 1 (plus an extra shift for leap years).</p>
    </div>
</div>

<h3>Leap Year Rules</h3>

<p>The Gregorian calendar (adopted in 1582) defines leap years as follows:</p>
<ul>
    <li>A year is a leap year if it is divisible by 4,</li>
    <li><em>except</em> years divisible by 100 are <strong>not</strong> leap years,</li>
    <li><em>except</em> years divisible by 400 <strong>are</strong> leap years.</li>
</ul>

<p>In the language of modular arithmetic: year \\(y\\) is a leap year if and only if</p>
\\[
(y \\equiv 0 \\pmod{4} \\text{ and } y \\not\\equiv 0 \\pmod{100}) \\quad \\text{or} \\quad y \\equiv 0 \\pmod{400}.
\\]

<p>So 2000 was a leap year (divisible by 400), but 1900 was not (divisible by 100 but not 400), and 2024 was (divisible by 4 but not 100).</p>

<h3>Zeller's Congruence</h3>

<p>One of the most elegant applications of modular arithmetic is <strong>Zeller's congruence</strong>, a formula that computes the day of the week for any date. For the Gregorian calendar:</p>

\\[
h = \\left( q + \\left\\lfloor \\frac{13(m+1)}{5} \\right\\rfloor + K + \\left\\lfloor \\frac{K}{4} \\right\\rfloor + \\left\\lfloor \\frac{J}{4} \\right\\rfloor - 2J \\right) \\bmod 7
\\]

<p>where \\(q\\) is the day of the month, \\(m\\) is the month (with January and February counted as months 13 and 14 of the <em>previous</em> year), \\(K = y \\bmod 100\\) (year of the century), and \\(J = \\lfloor y / 100 \\rfloor\\) (century). The result \\(h\\) gives: 0 = Saturday, 1 = Sunday, ..., 6 = Friday.</p>

<div class="env-block example">
    <div class="env-title">Example: July 4, 1776</div>
    <div class="env-body">
        <p>For July 4, 1776: \\(q = 4\\), month = July = 7, year = 1776, so \\(m = 7\\), \\(K = 76\\), \\(J = 17\\).</p>
        <p>\\(h = (4 + \\lfloor 13 \\times 8/5 \\rfloor + 76 + \\lfloor 76/4 \\rfloor + \\lfloor 17/4 \\rfloor - 2 \\times 17) \\bmod 7\\)</p>
        <p>\\(= (4 + 20 + 76 + 19 + 4 - 34) \\bmod 7 = 89 \\bmod 7 = 5\\).</p>
        <p>Since 5 = Thursday, the Declaration of Independence was adopted on a <strong>Thursday</strong>.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-day-of-week"></div>
`,
            visualizations: [
                {
                    id: 'viz-day-of-week',
                    title: 'Day of the Week Calculator',
                    description: 'Enter any date (Gregorian calendar) and watch Zeller\'s congruence compute the day of the week step by step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';

                        var monthInp = document.createElement('input');
                        monthInp.type = 'number'; monthInp.min = 1; monthInp.max = 12; monthInp.value = 7;
                        monthInp.style.cssText = 'width:50px;padding:4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        var dayInp = document.createElement('input');
                        dayInp.type = 'number'; dayInp.min = 1; dayInp.max = 31; dayInp.value = 4;
                        dayInp.style.cssText = 'width:50px;padding:4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        var yearInp = document.createElement('input');
                        yearInp.type = 'number'; yearInp.min = 1582; yearInp.max = 9999; yearInp.value = 1776;
                        yearInp.style.cssText = 'width:70px;padding:4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        var lbl1 = document.createElement('span'); lbl1.textContent = 'Month:'; lbl1.style.color = '#8b949e'; lbl1.style.fontSize = '0.8rem';
                        var lbl2 = document.createElement('span'); lbl2.textContent = 'Day:'; lbl2.style.color = '#8b949e'; lbl2.style.fontSize = '0.8rem';
                        var lbl3 = document.createElement('span'); lbl3.textContent = 'Year:'; lbl3.style.color = '#8b949e'; lbl3.style.fontSize = '0.8rem';

                        inputDiv.appendChild(lbl1); inputDiv.appendChild(monthInp);
                        inputDiv.appendChild(lbl2); inputDiv.appendChild(dayInp);
                        inputDiv.appendChild(lbl3); inputDiv.appendChild(yearInp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Compute', function() { draw(); });

                        var dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                        var dayColors = [viz.colors.purple, viz.colors.red, viz.colors.orange, viz.colors.yellow, viz.colors.green, viz.colors.teal, viz.colors.blue];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var month = parseInt(monthInp.value);
                            var day = parseInt(dayInp.value);
                            var year = parseInt(yearInp.value);

                            viz.screenText("Zeller's Congruence", viz.width / 2, 20, viz.colors.white, 16);

                            // Adjust month: Jan=13, Feb=14 of previous year
                            var m = month;
                            var y = year;
                            if (m <= 2) { m += 12; y -= 1; }
                            var q = day;
                            var K = y % 100;
                            var J = Math.floor(y / 100);

                            // Compute terms
                            var t1 = q;
                            var t2 = Math.floor(13 * (m + 1) / 5);
                            var t3 = K;
                            var t4 = Math.floor(K / 4);
                            var t5 = Math.floor(J / 4);
                            var t6 = -2 * J;
                            var total = t1 + t2 + t3 + t4 + t5 + t6;
                            var h = ((total % 7) + 7) % 7;

                            // Show the computation step by step
                            var startY = 50;
                            var lineH = 28;
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';

                            var monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
                            viz.screenText('Date: ' + monthNames[month] + ' ' + day + ', ' + year,
                                viz.width / 2, startY, viz.colors.white, 14, 'center');

                            startY += lineH + 5;
                            var lx = 40;

                            var steps = [
                                ['q (day)', q, viz.colors.blue],
                                ['m (month, adjusted)', m, viz.colors.teal],
                                ['K (year mod 100)', K, viz.colors.orange],
                                ['J (century)', J, viz.colors.purple]
                            ];

                            for (var i = 0; i < steps.length; i++) {
                                ctx.fillStyle = steps[i][2];
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText(steps[i][0] + ' = ' + steps[i][1], lx + (i % 2) * 260, startY + Math.floor(i / 2) * lineH);
                            }

                            startY += lineH * 2 + 10;

                            // Show each term
                            var terms = [
                                ['q', t1 + ''],
                                ['\u230A13(m+1)/5\u230B', t2 + ''],
                                ['K', t3 + ''],
                                ['\u230AK/4\u230B', t4 + ''],
                                ['\u230AJ/4\u230B', t5 + ''],
                                ['-2J', t6 + '']
                            ];

                            viz.screenText('h = q + \u230A13(m+1)/5\u230B + K + \u230AK/4\u230B + \u230AJ/4\u230B - 2J   (mod 7)',
                                viz.width / 2, startY, viz.colors.white, 12, 'center');

                            startY += lineH;
                            var termStr = 'h = ' + t1 + ' + ' + t2 + ' + ' + t3 + ' + ' + t4 + ' + ' + t5 + ' + (' + t6 + ')';
                            viz.screenText(termStr, viz.width / 2, startY, viz.colors.teal, 13, 'center');

                            startY += lineH;
                            viz.screenText('h = ' + total + ' mod 7 = ' + h, viz.width / 2, startY, viz.colors.orange, 14, 'center');

                            // Result
                            startY += lineH + 10;
                            var resultColor = dayColors[h];
                            ctx.fillStyle = resultColor + '22';
                            ctx.fillRect(viz.width / 2 - 120, startY - 5, 240, 40);
                            viz.screenText(dayNames[h], viz.width / 2, startY + 15, resultColor, 22, 'center');

                            // Draw a week wheel
                            startY += 60;
                            var cx = viz.width / 2;
                            var cy = startY + 50;
                            var radius = 45;

                            for (var i = 0; i < 7; i++) {
                                var angle = -Math.PI / 2 + (i / 7) * 2 * Math.PI;
                                var px = cx + radius * Math.cos(angle);
                                var py = cy + radius * Math.sin(angle);
                                var isToday = (i === h);

                                if (isToday) {
                                    ctx.fillStyle = dayColors[i] + '44';
                                    ctx.beginPath();
                                    ctx.arc(px, py, 18, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                ctx.fillStyle = isToday ? dayColors[i] : viz.colors.text;
                                ctx.beginPath();
                                ctx.arc(px, py, isToday ? 6 : 4, 0, Math.PI * 2);
                                ctx.fill();

                                var lx2 = cx + (radius + 24) * Math.cos(angle);
                                var ly2 = cy + (radius + 24) * Math.sin(angle);
                                ctx.font = (isToday ? 'bold ' : '') + '10px -apple-system,sans-serif';
                                ctx.fillStyle = isToday ? dayColors[i] : viz.colors.text;
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(dayNames[i].substring(0, 3), lx2, ly2);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Zeller\'s congruence to determine the day of the week for December 25, 2000. Show all steps.',
                    hint: 'December is month 12, so no adjustment is needed. Compute \\(q = 25\\), \\(m = 12\\), \\(K = 0\\), \\(J = 20\\).',
                    solution: 'Here \\(q = 25\\), \\(m = 12\\), \\(y = 2000\\), so \\(K = 0\\), \\(J = 20\\). Then \\(h = (25 + \\lfloor 13 \\times 13/5 \\rfloor + 0 + 0 + 5 - 40) \\bmod 7 = (25 + 33 + 0 + 0 + 5 - 40) \\bmod 7 = 23 \\bmod 7 = 2\\). Since 2 = Monday, Christmas 2000 fell on a <strong>Monday</strong>.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Music & Harmony
        // ================================================================
        {
            id: 'sec-music',
            title: 'Music & Harmony',
            content: `
<h2>Music & Harmony: The Mathematics of Sound</h2>

<div class="env-block intuition">
    <div class="env-title">Why Do Some Notes Sound Good Together?</div>
    <div class="env-body">
        <p>When two notes are played together, their sound waves interfere. If the ratio of their frequencies is a simple fraction like 2:1, 3:2, or 4:3, the combined wave has a regular, pleasing pattern. Ratios with large numerators and denominators produce more complex, "rough" patterns. This is the physical basis of harmony, and it is fundamentally about number theory.</p>
    </div>
</div>

<h3>The Pythagorean Discovery</h3>

<p>According to legend, Pythagoras noticed that hammers of certain weight ratios produced harmonious sounds. Whether or not the legend is true, the mathematical insight is real: <strong>musical intervals correspond to rational number ratios</strong>.</p>

<p>The fundamental intervals, from most consonant to least:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
    <th style="text-align:left;padding:4px 8px;">Interval</th>
    <th style="text-align:center;padding:4px 8px;">Ratio</th>
    <th style="text-align:center;padding:4px 8px;">Cents</th>
    <th style="text-align:left;padding:4px 8px;">Character</th>
</tr>
<tr><td style="padding:4px 8px;">Unison</td><td style="text-align:center;">1:1</td><td style="text-align:center;">0</td><td style="padding:4px 8px;">Identity</td></tr>
<tr><td style="padding:4px 8px;">Octave</td><td style="text-align:center;">2:1</td><td style="text-align:center;">1200</td><td style="padding:4px 8px;">Perfect consonance</td></tr>
<tr><td style="padding:4px 8px;">Perfect Fifth</td><td style="text-align:center;">3:2</td><td style="text-align:center;">702</td><td style="padding:4px 8px;">Strong consonance</td></tr>
<tr><td style="padding:4px 8px;">Perfect Fourth</td><td style="text-align:center;">4:3</td><td style="text-align:center;">498</td><td style="padding:4px 8px;">Consonance</td></tr>
<tr><td style="padding:4px 8px;">Major Third</td><td style="text-align:center;">5:4</td><td style="text-align:center;">386</td><td style="padding:4px 8px;">Sweet consonance</td></tr>
<tr><td style="padding:4px 8px;">Minor Third</td><td style="text-align:center;">6:5</td><td style="text-align:center;">316</td><td style="padding:4px 8px;">Soft consonance</td></tr>
</table>

<h3>Why Twelve Notes?</h3>

<p>The octave is divided into 12 semitones. This is not arbitrary: it arises from number theory. Stacking perfect fifths (multiplying by 3/2 repeatedly) and reducing modulo the octave (dividing by 2 as needed), we get:</p>

\\[
\\left(\\frac{3}{2}\\right)^{12} = \\frac{531441}{4096} \\approx 129.746.
\\]

<p>Meanwhile, 7 octaves give \\(2^7 = 128\\). The near-miss \\(531441/524288 \\approx 1.01364\\) is the <strong>Pythagorean comma</strong>, a small but audible discrepancy. The fact that \\((3/2)^{12} \\approx 2^7\\) is the number-theoretic reason we use 12 notes per octave: 12 fifths almost exactly span 7 octaves.</p>

<div class="env-block remark">
    <div class="env-title">Connection to Continued Fractions</div>
    <div class="env-body">
        <p>The ratio \\(\\log_2(3/2) = \\log_2 3 - 1 \\approx 0.58496\\). Its continued fraction expansion begins \\([0; 1, 1, 2, 2, 3, 1, 5, \\ldots]\\), and the convergents give the best rational approximations: 1/2, 1/1, 3/5, <strong>7/12</strong>, 24/41, .... The denominator 12 appears as a convergent, confirming that 12 is the smallest number of equal divisions where the fifth is well-approximated.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-musical-ratios"></div>
`,
            visualizations: [
                {
                    id: 'viz-musical-ratios',
                    title: 'Musical Ratios and Harmony',
                    description: 'Hear and see the wave patterns of musical intervals. Simpler ratios produce more regular, consonant waveforms.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var intervals = [
                            { name: 'Unison (1:1)', p: 1, q: 1 },
                            { name: 'Octave (2:1)', p: 2, q: 1 },
                            { name: 'Perfect Fifth (3:2)', p: 3, q: 2 },
                            { name: 'Perfect Fourth (4:3)', p: 4, q: 3 },
                            { name: 'Major Third (5:4)', p: 5, q: 4 },
                            { name: 'Minor Third (6:5)', p: 6, q: 5 },
                            { name: 'Tritone (7:5)', p: 7, q: 5 }
                        ];

                        var currentInterval = 2; // Perfect fifth

                        var selectDiv = document.createElement('div');
                        selectDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        for (var i = 0; i < intervals.length; i++) {
                            (function(idx) {
                                var btn = VizEngine.createButton(selectDiv, intervals[idx].name, function() {
                                    currentInterval = idx;
                                    draw();
                                    playInterval(intervals[idx].p, intervals[idx].q);
                                });
                                if (idx === currentInterval) btn.style.borderColor = '#58a6ff';
                            })(i);
                        }
                        controls.appendChild(selectDiv);

                        var audioCtx = null;
                        function playInterval(p, q) {
                            try {
                                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                                var baseFreq = 264; // Middle C approx
                                var dur = 1.5;

                                // Note 1
                                var osc1 = audioCtx.createOscillator();
                                var gain1 = audioCtx.createGain();
                                osc1.frequency.value = baseFreq;
                                osc1.type = 'sine';
                                gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
                                gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
                                osc1.connect(gain1);
                                gain1.connect(audioCtx.destination);
                                osc1.start();
                                osc1.stop(audioCtx.currentTime + dur);

                                // Note 2
                                var osc2 = audioCtx.createOscillator();
                                var gain2 = audioCtx.createGain();
                                osc2.frequency.value = baseFreq * p / q;
                                osc2.type = 'sine';
                                gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
                                gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
                                osc2.connect(gain2);
                                gain2.connect(audioCtx.destination);
                                osc2.start();
                                osc2.stop(audioCtx.currentTime + dur);
                            } catch (e) {
                                // Audio may not be available
                            }
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var intv = intervals[currentInterval];

                            viz.screenText('Waveform: ' + intv.name, viz.width / 2, 18, viz.colors.white, 15);

                            var baseFreq = 2; // cycles in view
                            var f1 = baseFreq;
                            var f2 = baseFreq * intv.p / intv.q;

                            // Draw three waveforms: note 1, note 2, combined
                            var waveH = 70;
                            var waveY = [70, 170, 290];
                            var labels = ['Note 1 (base)', 'Note 2 (\u00D7' + intv.p + '/' + intv.q + ')', 'Combined'];
                            var waveColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange];

                            var margin = 50;
                            var waveW = viz.width - 2 * margin;
                            // Show enough cycles that the pattern repeats
                            var period = intv.q; // LCM of periods in terms of base
                            var tMax = period / baseFreq;

                            for (var w = 0; w < 3; w++) {
                                var cy = waveY[w];

                                // Label
                                ctx.fillStyle = waveColors[w];
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(labels[w], margin, cy - waveH / 2 - 8);

                                // Axis line
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(margin, cy);
                                ctx.lineTo(margin + waveW, cy);
                                ctx.stroke();

                                // Draw wave
                                ctx.strokeStyle = waveColors[w];
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i <= waveW; i++) {
                                    var t = (i / waveW) * tMax;
                                    var val;
                                    if (w === 0) val = Math.sin(2 * Math.PI * f1 * t);
                                    else if (w === 1) val = Math.sin(2 * Math.PI * f2 * t);
                                    else val = 0.5 * (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t));

                                    var px = margin + i;
                                    var py = cy - val * (waveH / 2 - 5);
                                    if (i === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();
                            }

                            // Info
                            var ratio = intv.p + ':' + intv.q;
                            var cents = Math.round(1200 * Math.log2(intv.p / intv.q));
                            viz.screenText('Ratio ' + ratio + '     ' + cents + ' cents',
                                viz.width / 2, viz.height - 20, viz.colors.text, 12, 'center');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The Pythagorean comma is the ratio \\((3/2)^{12} / 2^7\\). Compute its exact value as a fraction and its approximate value as a decimal. Why does this ratio matter for musical tuning?',
                    hint: 'Compute \\(3^{12} / 2^{12}\\) and divide by \\(2^7 = 128\\). Simplify.',
                    solution: 'We have \\((3/2)^{12} = 3^{12}/2^{12} = 531441/4096\\). Dividing by \\(2^7 = 128\\): \\(531441/524288 \\approx 1.01364\\). This means 12 perfect fifths overshoot 7 octaves by about 1.4%, a small but audible discrepancy called the Pythagorean comma. It means you cannot tune all intervals to be perfectly just; some compromise is needed, which is why equal temperament (dividing the octave into 12 equal semitones with ratio \\(2^{1/12}\\)) is used in modern music.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Numbers in Nature
        // ================================================================
        {
            id: 'sec-nature',
            title: 'Numbers in Nature',
            content: `
<h2>Numbers in Nature</h2>

<div class="env-block intuition">
    <div class="env-title">Nature's Favorite Numbers</div>
    <div class="env-body">
        <p>Why do sunflowers have 34 or 55 spirals, not 36 or 50? Why are honeycombs hexagonal? Why do periodic cicadas emerge every 13 or 17 years, both prime numbers? These are not coincidences. Natural selection, physics, and geometry often converge on solutions that have deep number-theoretic explanations.</p>
    </div>
</div>

<h3>Fibonacci Spirals in Plants</h3>

<p>The Fibonacci sequence \\(1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, \\ldots\\) appears throughout the plant kingdom. The number of spirals in a sunflower head, the arrangement of leaves around a stem, and the scales of a pinecone all tend to be consecutive Fibonacci numbers.</p>

<p>The reason is packing efficiency. New growth elements (seeds, leaves, florets) are placed at angles related to the <strong>golden ratio</strong> \\(\\phi = (1 + \\sqrt{5})/2\\). Specifically, each new element is rotated by the <strong>golden angle</strong> \\(360^\\circ / \\phi^2 \\approx 137.5^\\circ\\) from the previous one. This angle is optimal because \\(\\phi\\) is the "most irrational" number: its continued fraction \\([1; 1, 1, 1, \\ldots]\\) converges as slowly as possible, meaning no rational approximation \\(p/q\\) is especially close. This prevents seeds from lining up in rows, ensuring maximum packing.</p>

<h3>Prime Cicadas</h3>

<p>Periodical cicadas of the genus <em>Magicicada</em> have life cycles of exactly 13 or 17 years. These are both prime numbers, and the leading hypothesis for why involves number theory.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 17.2 (Predator Avoidance by Primes)</div>
    <div class="env-body">
        <p>If a prey species has a life cycle of length \\(n\\) years and a predator has a cycle of length \\(m\\) years, they synchronize (emerge in the same year) every \\(\\text{lcm}(n, m)\\) years. If \\(n\\) is prime, then \\(\\text{lcm}(n, m) = nm\\) for every \\(m < n\\) (since \\(\\gcd(n, m) = 1\\)). This maximizes the interval between synchronization events, reducing predation pressure.</p>
    </div>
</div>

<p>For example, if cicadas had a 12-year cycle, a predator with a 2, 3, 4, or 6-year cycle would synchronize frequently. But with a 13-year cycle, the only synchronization with a predator of period \\(m < 13\\) occurs every \\(13m\\) years.</p>

<h3>Hexagonal Honeycombs</h3>

<p>Bees build honeycombs with hexagonal cells. This is the solution to a geometric optimization problem: among all ways to tile the plane with cells of equal area, the hexagonal tiling has the smallest total perimeter. This was conjectured by the Roman scholar Varro in 36 BC and proved by Thomas Hales in 1999.</p>

<p>The key insight is that the interior angles of a regular hexagon are \\(120^\\circ\\), and \\(360^\\circ / 120^\\circ = 3\\), so exactly three hexagons meet at each vertex. Among the three regular polygons that tile the plane (triangles, squares, hexagons), the hexagon encloses the most area per unit perimeter.</p>

<div class="viz-placeholder" data-viz="viz-cicada-primes"></div>
<div class="viz-placeholder" data-viz="viz-honeycomb"></div>
`,
            visualizations: [
                {
                    id: 'viz-cicada-primes',
                    title: 'Prime Cicada Cycles',
                    description: 'See why prime life cycles minimize predator synchronization. Compare prime vs composite cycle lengths and observe how often predators and prey emerge in the same year.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var cicadaPeriod = 13;
                        var predatorPeriod = 4;

                        VizEngine.createSlider(controls, 'Cicada cycle', 2, 20, cicadaPeriod, 1, function(v) {
                            cicadaPeriod = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Predator cycle', 2, 10, predatorPeriod, 1, function(v) {
                            predatorPeriod = Math.round(v);
                            draw();
                        });

                        function isPrime(n) {
                            if (n < 2) return false;
                            for (var i = 2; i * i <= n; i++) { if (n % i === 0) return false; }
                            return true;
                        }

                        function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
                        function lcm(a, b) { return a / gcd(a, b) * b; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var primeStr = isPrime(cicadaPeriod) ? ' (PRIME)' : ' (composite)';
                            var primeColor = isPrime(cicadaPeriod) ? viz.colors.green : viz.colors.red;
                            viz.screenText('Cicada Period: ' + cicadaPeriod + ' years' + primeStr,
                                viz.width / 2, 18, primeColor, 14);
                            viz.screenText('Predator Period: ' + predatorPeriod + ' years',
                                viz.width / 2, 36, viz.colors.orange, 12);

                            var syncPeriod = lcm(cicadaPeriod, predatorPeriod);
                            viz.screenText('Synchronize every lcm(' + cicadaPeriod + ', ' + predatorPeriod + ') = ' + syncPeriod + ' years',
                                viz.width / 2, 54, viz.colors.white, 12);

                            // Timeline
                            var maxYears = Math.min(syncPeriod + 5, 80);
                            var marginL = 40;
                            var marginR = 20;
                            var timeW = viz.width - marginL - marginR;
                            var yearW = timeW / maxYears;

                            var y1 = 90; // Cicada row
                            var y2 = 140; // Predator row
                            var y3 = 190; // Sync row
                            var rowH = 30;

                            // Labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('Cicada', marginL - 4, y1 + rowH / 2);
                            ctx.fillText('Predator', marginL - 4, y2 + rowH / 2);
                            ctx.fillText('Sync', marginL - 4, y3 + rowH / 2);

                            // Year markers
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '8px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var yr = 0; yr <= maxYears; yr += Math.max(1, Math.floor(maxYears / 20))) {
                                var xp = marginL + yr * yearW;
                                ctx.fillText(yr.toString(), xp, y3 + rowH + 14);
                            }

                            // Draw timeline bars
                            for (var yr = 0; yr < maxYears; yr++) {
                                var xp = marginL + yr * yearW;
                                var w = Math.max(yearW - 1, 2);

                                var isCicada = (yr % cicadaPeriod === 0);
                                var isPredator = (yr % predatorPeriod === 0);

                                // Cicada bar
                                ctx.fillStyle = isCicada ? viz.colors.teal : viz.colors.grid;
                                ctx.fillRect(xp, y1, w, rowH);

                                // Predator bar
                                ctx.fillStyle = isPredator ? viz.colors.orange : viz.colors.grid;
                                ctx.fillRect(xp, y2, w, rowH);

                                // Sync bar
                                if (isCicada && isPredator && yr > 0) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.fillRect(xp, y3, w, rowH);
                                } else {
                                    ctx.fillStyle = viz.colors.grid;
                                    ctx.fillRect(xp, y3, w, rowH);
                                }
                            }

                            // Comparison table: prime vs composite cycles
                            var tableY = y3 + rowH + 40;
                            viz.screenText('Synchronizations with predator cycles 2-10:', viz.width / 2, tableY, viz.colors.white, 12);

                            var cycles = [12, 13, 14, 15, 16, 17, 18];
                            var colW = 70;
                            var startX = (viz.width - cycles.length * colW) / 2;
                            tableY += 20;

                            // Headers
                            for (var i = 0; i < cycles.length; i++) {
                                var c = cycles[i];
                                var col = isPrime(c) ? viz.colors.green : viz.colors.text;
                                ctx.fillStyle = col;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(c + (isPrime(c) ? '*' : ''), startX + i * colW + colW / 2, tableY);
                            }

                            tableY += 16;

                            // Count syncs in 100 years
                            for (var i = 0; i < cycles.length; i++) {
                                var c = cycles[i];
                                var totalSyncs = 0;
                                for (var pred = 2; pred <= 10; pred++) {
                                    var syncP = lcm(c, pred);
                                    totalSyncs += Math.floor(100 / syncP);
                                }
                                var col = isPrime(c) ? viz.colors.green : viz.colors.orange;
                                ctx.fillStyle = col;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(totalSyncs + ' syncs', startX + i * colW + colW / 2, tableY);
                            }

                            tableY += 14;
                            viz.screenText('(in 100 years, across predator periods 2-10)', viz.width / 2, tableY, viz.colors.text, 9);
                            tableY += 14;
                            viz.screenText('* = prime. Primes have fewer synchronizations!', viz.width / 2, tableY, viz.colors.green, 10);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-honeycomb',
                    title: 'Hexagonal Honeycombs',
                    description: 'Compare area-to-perimeter ratios for tilings by triangles, squares, and hexagons. Drag to explore the hexagonal advantage.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var tileType = 2; // 0=triangle, 1=square, 2=hexagon
                        var btnLabels = ['Triangles', 'Squares', 'Hexagons'];
                        var btns = [];
                        for (var i = 0; i < 3; i++) {
                            (function(idx) {
                                var btn = VizEngine.createButton(controls, btnLabels[idx], function() {
                                    tileType = idx;
                                    draw();
                                });
                                btns.push(btn);
                            })(i);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var titles = ['Triangular Tiling', 'Square Tiling', 'Hexagonal Tiling'];
                            viz.screenText(titles[tileType], viz.width / 2, 18, viz.colors.white, 16);

                            var colors = [viz.colors.orange, viz.colors.blue, viz.colors.teal];
                            var col = colors[tileType];

                            if (tileType === 0) {
                                // Triangles
                                var s = 40;
                                var h = s * Math.sqrt(3) / 2;
                                var startX = 80;
                                var startY = 50;
                                var rows = 6;
                                var cols = 10;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        var x = startX + c * s / 2;
                                        var y = startY + r * h;
                                        var up = ((r + c) % 2 === 0);
                                        ctx.beginPath();
                                        if (up) {
                                            ctx.moveTo(x, y + h);
                                            ctx.lineTo(x + s / 2, y);
                                            ctx.lineTo(x + s, y + h);
                                        } else {
                                            ctx.moveTo(x, y);
                                            ctx.lineTo(x + s / 2, y + h);
                                            ctx.lineTo(x + s, y);
                                        }
                                        ctx.closePath();
                                        ctx.fillStyle = col + '22';
                                        ctx.fill();
                                        ctx.strokeStyle = col;
                                        ctx.lineWidth = 1;
                                        ctx.stroke();
                                    }
                                }
                            } else if (tileType === 1) {
                                // Squares
                                var s = 40;
                                var startX = 80;
                                var startY = 50;
                                var rows = 7;
                                var cols = 10;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        ctx.fillStyle = col + '22';
                                        ctx.fillRect(startX + c * s, startY + r * s, s, s);
                                        ctx.strokeStyle = col;
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(startX + c * s, startY + r * s, s, s);
                                    }
                                }
                            } else {
                                // Hexagons
                                var s = 24;
                                var w = s * Math.sqrt(3);
                                var startX = 80;
                                var startY = 60;
                                var rows = 7;
                                var cols = 8;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        var cx = startX + c * w + (r % 2) * w / 2;
                                        var cy = startY + r * 1.5 * s;
                                        ctx.beginPath();
                                        for (var k = 0; k < 6; k++) {
                                            var angle = Math.PI / 6 + k * Math.PI / 3;
                                            var px = cx + s * Math.cos(angle);
                                            var py = cy + s * Math.sin(angle);
                                            if (k === 0) ctx.moveTo(px, py);
                                            else ctx.lineTo(px, py);
                                        }
                                        ctx.closePath();
                                        ctx.fillStyle = col + '22';
                                        ctx.fill();
                                        ctx.strokeStyle = col;
                                        ctx.lineWidth = 1;
                                        ctx.stroke();
                                    }
                                }
                            }

                            // Comparison info
                            var infoY = viz.height - 60;
                            // For unit area cells:
                            // Triangle (equilateral, area 1): side = sqrt(4/sqrt(3)) ~ 1.5197, perimeter = 3*side ~ 4.559
                            // Square (area 1): side = 1, perimeter = 4
                            // Hexagon (area 1): side = sqrt(2/(3*sqrt(3))) ~ 0.6204, perimeter = 6*side ~ 3.722
                            var shapes = [
                                { name: 'Triangle', perim: 4.559, sides: 3 },
                                { name: 'Square', perim: 4.000, sides: 4 },
                                { name: 'Hexagon', perim: 3.722, sides: 6 }
                            ];

                            viz.screenText('Perimeter for unit-area cell:', viz.width / 2, infoY, viz.colors.text, 11);
                            infoY += 18;

                            var barW = 120;
                            var maxPerim = 5;
                            for (var i = 0; i < 3; i++) {
                                var bx = viz.width / 2 - barW / 2;
                                var by = infoY + i * 18;
                                var bw = (shapes[i].perim / maxPerim) * barW;
                                var c2 = colors[i];

                                ctx.fillStyle = (i === tileType) ? c2 : c2 + '66';
                                ctx.fillRect(bx, by, bw, 12);
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(shapes[i].name, bx - 6, by + 9);
                                ctx.textAlign = 'left';
                                ctx.fillText(shapes[i].perim.toFixed(3), bx + bw + 4, by + 9);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A cicada has a 12-year life cycle. List all predator cycle lengths from 2 to 11 that would synchronize with the cicada within 36 years. Compare with a 13-year cicada.',
                    hint: 'Synchronization happens every lcm(12, m) years. If lcm(12, m) \\(\\le 36\\), there is at least one synchronization in 36 years.',
                    solution: 'For a 12-year cicada: lcm(12,2)=12, lcm(12,3)=12, lcm(12,4)=12, lcm(12,6)=12 (all sync within 12 years!); lcm(12,8)=24, lcm(12,9)=36, lcm(12,10)=60, lcm(12,5)=60. So predators with cycles 2,3,4,6,8,9 all synchronize within 36 years. For a 13-year cicada: lcm(13,m)=13m for all m from 2-11 (since 13 is prime). The smallest is lcm(13,2)=26, and only m=2 gives sync within 36 years. The prime cycle dramatically reduces predator overlap.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Numbers & Computers
        // ================================================================
        {
            id: 'sec-computers',
            title: 'Numbers & Computers',
            content: `
<h2>Numbers & Computers: Binary, Hexadecimal, and How Machines Count</h2>

<div class="env-block intuition">
    <div class="env-title">Why Binary?</div>
    <div class="env-body">
        <p>We use base 10 because we have 10 fingers. Computers use base 2 because their fundamental circuits have two states: on (1) and off (0). Every number, every letter, every pixel of every image you have ever seen on a screen is, at its core, a sequence of zeros and ones.</p>
    </div>
</div>

<h3>Binary (Base 2)</h3>

<p>In base 10, the number 347 means \\(3 \\times 10^2 + 4 \\times 10^1 + 7 \\times 10^0\\). In base 2, the number \\(10101_2\\) means:</p>

\\[
1 \\times 2^4 + 0 \\times 2^3 + 1 \\times 2^2 + 0 \\times 2^1 + 1 \\times 2^0 = 16 + 4 + 1 = 21.
\\]

<p>To convert from decimal to binary, repeatedly divide by 2 and record the remainders (reading them bottom to top):</p>

<div class="env-block example">
    <div class="env-title">Example: Converting 42 to Binary</div>
    <div class="env-body">
        <p>\\(42 \\div 2 = 21\\) remainder \\(0\\)</p>
        <p>\\(21 \\div 2 = 10\\) remainder \\(1\\)</p>
        <p>\\(10 \\div 2 = 5\\) remainder \\(0\\)</p>
        <p>\\(5 \\div 2 = 2\\) remainder \\(1\\)</p>
        <p>\\(2 \\div 2 = 1\\) remainder \\(0\\)</p>
        <p>\\(1 \\div 2 = 0\\) remainder \\(1\\)</p>
        <p>Reading remainders from bottom to top: \\(42 = 101010_2\\).</p>
    </div>
</div>

<h3>Hexadecimal (Base 16)</h3>

<p>Binary is verbose: even moderate numbers require many digits. Hexadecimal (base 16) provides a compact notation. Each hex digit corresponds to exactly 4 binary digits (bits), since \\(16 = 2^4\\). The hex digits are 0-9 and A-F (where A=10, B=11, ..., F=15).</p>

<p>For example, \\(42 = 101010_2 = 2\\text{A}_{16}\\) (since \\(0010 \\to 2\\) and \\(1010 \\to \\text{A}\\)).</p>

<p>Colors on web pages are specified in hexadecimal: the color <span style="color:#58a6ff">#58A6FF</span> means red = 0x58 = 88, green = 0xA6 = 166, blue = 0xFF = 255.</p>

<h3>How Computers Store Numbers</h3>

<p>Modern computers store integers using a fixed number of bits. An 8-bit (1-byte) unsigned integer can represent \\(0\\) to \\(2^8 - 1 = 255\\). A 32-bit integer reaches \\(2^{32} - 1 = 4{,}294{,}967{,}295\\). Negative numbers are typically stored using <strong>two's complement</strong>: the most significant bit acts as a sign bit, and negation is performed by flipping all bits and adding 1.</p>

<div class="env-block remark">
    <div class="env-title">Connection to Number Theory</div>
    <div class="env-body">
        <p>Two's complement is modular arithmetic in disguise. In an \\(n\\)-bit system, the representation of \\(-k\\) is \\(2^n - k\\), which is exactly \\(-k \\bmod 2^n\\). Addition and subtraction in two's complement are just addition modulo \\(2^n\\), making the hardware simple and elegant.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-binary-converter"></div>
`,
            visualizations: [
                {
                    id: 'viz-binary-converter',
                    title: 'Binary / Hex Converter',
                    description: 'Convert between decimal, binary, and hexadecimal. See the division-by-2 algorithm animated step by step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';

                        var lbl = document.createElement('span');
                        lbl.textContent = 'Decimal:';
                        lbl.style.cssText = 'color:#8b949e;font-size:0.8rem;';

                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.value = '42';
                        inp.min = 0;
                        inp.max = 255;
                        inp.style.cssText = 'width:70px;padding:4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';

                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        inp.addEventListener('input', function() { draw(); });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var num = Math.max(0, Math.min(255, parseInt(inp.value) || 0));

                            viz.screenText('Decimal \u2194 Binary \u2194 Hexadecimal', viz.width / 2, 18, viz.colors.white, 15);

                            // Binary representation
                            var binary = num.toString(2);
                            while (binary.length < 8) binary = '0' + binary;

                            // Hex representation
                            var hex = num.toString(16).toUpperCase();
                            while (hex.length < 2) hex = '0' + hex;

                            // Display all three
                            var y0 = 50;
                            viz.screenText('Decimal: ' + num, viz.width / 2, y0, viz.colors.blue, 18);
                            viz.screenText('Binary: ' + binary, viz.width / 2, y0 + 28, viz.colors.teal, 18);
                            viz.screenText('Hex: ' + hex, viz.width / 2, y0 + 56, viz.colors.orange, 18);

                            // Draw 8-bit visualization
                            var bitY = y0 + 95;
                            var bitW = 50;
                            var startX = (viz.width - 8 * bitW) / 2;

                            viz.screenText('8-bit representation:', viz.width / 2, bitY - 18, viz.colors.text, 11);

                            for (var i = 0; i < 8; i++) {
                                var bit = binary[i];
                                var x = startX + i * bitW;
                                var power = 7 - i;
                                var val = parseInt(bit);

                                // Bit box
                                ctx.fillStyle = val ? viz.colors.teal + '44' : viz.colors.grid;
                                ctx.fillRect(x + 2, bitY, bitW - 4, 36);
                                ctx.strokeStyle = val ? viz.colors.teal : viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x + 2, bitY, bitW - 4, 36);

                                // Bit value
                                ctx.fillStyle = val ? viz.colors.white : viz.colors.text;
                                ctx.font = 'bold 18px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(bit, x + bitW / 2, bitY + 18);

                                // Power label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText('2\u2077'.replace('\u2077', ['\u2077','\u2076','\u2075','\u2074','\u00B3','\u00B2','\u00B9','\u2070'][i]),
                                    x + bitW / 2, bitY - 6);

                                // Value contribution
                                if (val) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(Math.pow(2, power).toString(), x + bitW / 2, bitY + 48);
                                }
                            }

                            // Division algorithm
                            var divY = bitY + 70;
                            viz.screenText('Division-by-2 algorithm:', viz.width / 2, divY, viz.colors.text, 11);
                            divY += 18;

                            var steps = [];
                            var n = num;
                            if (n === 0) {
                                steps.push({ q: 0, r: 0 });
                            } else {
                                while (n > 0) {
                                    steps.push({ q: Math.floor(n / 2), r: n % 2, n: n });
                                    n = Math.floor(n / 2);
                                }
                            }

                            var stepH = 16;
                            var maxSteps = Math.min(steps.length, 8);
                            var colW = 60;
                            var sx = (viz.width - maxSteps * colW) / 2;

                            for (var i = 0; i < maxSteps; i++) {
                                var s = steps[i];
                                var x = sx + i * colW;

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText((s.n || 0) + '\u00F72', x + colW / 2, divY);
                                ctx.fillText('=' + s.q + ' r' + s.r, x + colW / 2, divY + stepH);

                                // Highlight remainder
                                ctx.fillStyle = s.r ? viz.colors.teal : viz.colors.text;
                                ctx.font = 'bold 14px monospace';
                                ctx.fillText(s.r.toString(), x + colW / 2, divY + stepH * 2 + 4);
                            }

                            if (steps.length > 0) {
                                viz.screenText('\u2191 read remainders right to left \u2191',
                                    viz.width / 2, divY + stepH * 3 + 8, viz.colors.teal, 10);
                            }

                            // Hex nibble visualization
                            var hexY = divY + stepH * 3 + 35;
                            viz.screenText('Hex nibbles (4 bits each):', viz.width / 2, hexY, viz.colors.text, 11);
                            hexY += 18;

                            var highNibble = binary.substring(0, 4);
                            var lowNibble = binary.substring(4, 8);
                            var nibW = 110;
                            var nibX = viz.width / 2 - nibW - 10;

                            for (var ni = 0; ni < 2; ni++) {
                                var nib = ni === 0 ? highNibble : lowNibble;
                                var hexChar = ni === 0 ? hex[0] : hex[1];
                                var nx = nibX + ni * (nibW + 20);

                                ctx.fillStyle = viz.colors.orange + '22';
                                ctx.fillRect(nx, hexY, nibW, 28);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(nx, hexY, nibW, 28);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '14px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(nib + ' = ' + hexChar, nx + nibW / 2, hexY + 14);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Convert the decimal number 100 to binary and hexadecimal. Verify by converting back.',
                    hint: 'Divide 100 by 2 repeatedly. For hex, group the binary digits into nibbles of 4.',
                    solution: '\\(100 \\div 2 = 50\\) r0, \\(50 \\div 2 = 25\\) r0, \\(25 \\div 2 = 12\\) r1, \\(12 \\div 2 = 6\\) r0, \\(6 \\div 2 = 3\\) r0, \\(3 \\div 2 = 1\\) r1, \\(1 \\div 2 = 0\\) r1. Reading bottom-up: \\(100 = 1100100_2\\). Grouping into nibbles: \\(0110\\,0100 = 64_{16}\\). Check: \\(6 \\times 16 + 4 = 96 + 4 = 100\\). \\(\\checkmark\\)'
                },
                {
                    question: 'In an 8-bit two\'s complement system, what decimal number does the binary string 11111010 represent?',
                    hint: 'The leading 1 means it is negative. To find the magnitude, flip all bits and add 1.',
                    solution: 'The leading bit is 1, so the number is negative. Flipping all bits: 00000101. Adding 1: 00000110 = 6. So the original represents \\(-6\\). Alternatively: \\(11111010_2 = 250\\) as unsigned, and \\(250 - 256 = -6\\) (since two\'s complement of \\(-k\\) is \\(2^8 - k\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 7: The Never-Ending Story
        // ================================================================
        {
            id: 'sec-coda',
            title: 'The Never-Ending Story',
            content: `
<h2>The Never-Ending Story: Unsolved Problems and Beyond</h2>

<div class="env-block intuition">
    <div class="env-title">The Frontier</div>
    <div class="env-body">
        <p>Number theory is one of the oldest branches of mathematics, yet some of its simplest-sounding questions remain unanswered after centuries of effort. These open problems are a testament to the depth of the subject: the integers are inexhaustible.</p>
    </div>
</div>

<h3>Goldbach's Conjecture (1742)</h3>

<p><em>Every even integer greater than 2 is the sum of two primes.</em></p>

<p>Examples: \\(4 = 2+2\\), \\(6 = 3+3\\), \\(8 = 3+5\\), \\(10 = 3+7 = 5+5\\), \\(100 = 3+97 = 11+89 = \\cdots\\). This has been verified computationally for all even numbers up to \\(4 \\times 10^{18}\\), but no one has proved it in general. The best partial result is due to Harald Helfgott (2013), who proved the "weak" Goldbach conjecture: every odd integer greater than 5 is the sum of three primes.</p>

<h3>The Twin Prime Conjecture</h3>

<p><em>There are infinitely many pairs of primes that differ by 2.</em></p>

<p>Examples: (3,5), (5,7), (11,13), (17,19), (29,31), (41,43), .... The largest known twin prime pair (as of 2024) has over 388,000 digits. Yitang Zhang's breakthrough in 2013 proved that there are infinitely many pairs of primes differing by at most 70 million; subsequent work by James Maynard and the Polymath project reduced this bound to 246. But proving the bound is exactly 2 remains open.</p>

<h3>Perfect Numbers</h3>

<p>A <strong>perfect number</strong> equals the sum of its proper divisors. The first few are:</p>
\\[
6 = 1+2+3, \\quad 28 = 1+2+4+7+14, \\quad 496, \\quad 8128, \\ldots
\\]

<p>Euler proved that every <em>even</em> perfect number has the form \\(2^{p-1}(2^p - 1)\\) where \\(2^p - 1\\) is a Mersenne prime. But two questions remain open:</p>
<ul>
    <li>Are there infinitely many even perfect numbers? (Equivalently: are there infinitely many Mersenne primes?)</li>
    <li>Does an <em>odd</em> perfect number exist? None has ever been found, and if one exists, it must exceed \\(10^{1500}\\).</li>
</ul>

<h3>The Collatz Conjecture (3n+1 Problem)</h3>

<p>Start with any positive integer \\(n\\). If \\(n\\) is even, divide by 2. If odd, compute \\(3n+1\\). Repeat. The conjecture states that this process always eventually reaches 1.</p>

<div class="env-block example">
    <div class="env-title">Example: Starting from 27</div>
    <div class="env-body">
        <p>27 \u2192 82 \u2192 41 \u2192 124 \u2192 62 \u2192 31 \u2192 94 \u2192 47 \u2192 142 \u2192 71 \u2192 214 \u2192 107 \u2192 322 \u2192 161 \u2192 484 \u2192 242 \u2192 121 \u2192 ... \u2192 eventually reaches 1 after 111 steps, with a maximum value of 9232.</p>
    </div>
</div>

<p>Paul Erdos said of the Collatz conjecture: "Mathematics may not be ready for such problems." It has been verified for all \\(n\\) up to approximately \\(2.95 \\times 10^{20}\\), but a proof seems far off.</p>

<h3>The Journey Continues</h3>

<p>The problems we have explored in this course, from the Euclidean algorithm to quadratic reciprocity, from the Chinese Remainder Theorem to primitive roots, form the foundation of a vast and living subject. Number theory connects to:</p>
<ul>
    <li><strong>Cryptography</strong>: RSA encryption rests on the difficulty of factoring large numbers.</li>
    <li><strong>Coding theory</strong>: Error-correcting codes use finite fields and polynomial arithmetic.</li>
    <li><strong>Algebraic geometry</strong>: Elliptic curves over finite fields underlie modern cryptography and the proof of Fermat's Last Theorem.</li>
    <li><strong>Analytic number theory</strong>: The Riemann Hypothesis, perhaps the most important unsolved problem in mathematics, connects prime distribution to the zeros of a complex function.</li>
    <li><strong>Quantum computing</strong>: Shor's algorithm can factor integers in polynomial time on a quantum computer, threatening RSA and motivating post-quantum cryptography.</li>
</ul>

<p>As you close this book, remember: every integer you encounter, from a barcode to a musical interval to a cicada's life cycle, carries the fingerprint of deep mathematical structure. The beauty of number theory is that it starts with the simplest objects imaginable, the counting numbers 1, 2, 3, ..., and from them builds an infinite cathedral of ideas.</p>

<div class="viz-placeholder" data-viz="viz-unsolved-problems"></div>
`,
            visualizations: [
                {
                    id: 'viz-unsolved-problems',
                    title: 'Gallery of Unsolved Problems',
                    description: 'Explore four famous unsolved problems interactively: Goldbach decompositions, twin primes, perfect numbers, and Collatz sequences.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var mode = 0;
                        var modeLabels = ['Goldbach', 'Twin Primes', 'Perfect Numbers', 'Collatz'];
                        var btns = [];
                        for (var i = 0; i < 4; i++) {
                            (function(idx) {
                                var btn = VizEngine.createButton(controls, modeLabels[idx], function() {
                                    mode = idx;
                                    draw();
                                });
                                btns.push(btn);
                            })(i);
                        }

                        var paramDiv = document.createElement('div');
                        paramDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:4px;';
                        var paramLbl = document.createElement('span');
                        paramLbl.style.cssText = 'color:#8b949e;font-size:0.8rem;';
                        paramLbl.textContent = 'n:';
                        var paramInp = document.createElement('input');
                        paramInp.type = 'number';
                        paramInp.value = '100';
                        paramInp.min = 2;
                        paramInp.max = 10000;
                        paramInp.style.cssText = 'width:80px;padding:4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        paramDiv.appendChild(paramLbl);
                        paramDiv.appendChild(paramInp);
                        controls.appendChild(paramDiv);
                        paramInp.addEventListener('input', function() { draw(); });

                        // Sieve
                        var primeSet = new Set();
                        var primeList = VizEngine.sievePrimes(10000);
                        for (var i = 0; i < primeList.length; i++) primeSet.add(primeList[i]);

                        function isPrime(n) { return primeSet.has(n); }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var n = Math.max(2, Math.min(10000, parseInt(paramInp.value) || 100));

                            if (mode === 0) drawGoldbach(ctx, n);
                            else if (mode === 1) drawTwinPrimes(ctx, n);
                            else if (mode === 2) drawPerfect(ctx, n);
                            else drawCollatz(ctx, n);
                        }

                        function drawGoldbach(ctx, n) {
                            viz.screenText("Goldbach's Conjecture", viz.width / 2, 18, viz.colors.white, 15);

                            if (n % 2 !== 0) n = n + 1;
                            if (n < 4) n = 4;

                            // Find all Goldbach decompositions
                            var decomps = [];
                            for (var p = 2; p <= n / 2; p++) {
                                if (isPrime(p) && isPrime(n - p)) {
                                    decomps.push([p, n - p]);
                                }
                            }

                            viz.screenText(n + ' = sum of two primes', viz.width / 2, 40, viz.colors.teal, 13);
                            viz.screenText(decomps.length + ' decomposition' + (decomps.length !== 1 ? 's' : ''),
                                viz.width / 2, 58, viz.colors.orange, 12);

                            // Display decompositions
                            var startY = 80;
                            var cols = Math.min(4, decomps.length);
                            var rows = Math.ceil(decomps.length / cols);
                            var cellW = 130;
                            var cellH = 22;
                            var sx = (viz.width - cols * cellW) / 2;
                            var maxShow = Math.min(decomps.length, 40);

                            for (var i = 0; i < maxShow; i++) {
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                var px = sx + col * cellW;
                                var py = startY + row * cellH;

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(decomps[i][0] + ' + ' + decomps[i][1], px + cellW / 2, py);
                            }

                            if (decomps.length > maxShow) {
                                viz.screenText('... and ' + (decomps.length - maxShow) + ' more',
                                    viz.width / 2, startY + Math.ceil(maxShow / cols) * cellH + 10, viz.colors.text, 11);
                            }

                            // Bar chart: number of decompositions for even numbers up to n
                            var chartY = viz.height - 120;
                            var chartH = 80;
                            var maxN = Math.min(n, 200);
                            var barW = (viz.width - 80) / (maxN / 2);
                            var maxCount = 0;
                            var counts = [];
                            for (var e = 4; e <= maxN; e += 2) {
                                var cnt = 0;
                                for (var p = 2; p <= e / 2; p++) {
                                    if (isPrime(p) && isPrime(e - p)) cnt++;
                                }
                                counts.push(cnt);
                                if (cnt > maxCount) maxCount = cnt;
                            }

                            viz.screenText('Decomposition count for even numbers 4 to ' + maxN, viz.width / 2, chartY - 12, viz.colors.text, 10);

                            for (var i = 0; i < counts.length; i++) {
                                var bx = 40 + i * barW;
                                var bh = (counts[i] / maxCount) * chartH;
                                ctx.fillStyle = viz.colors.teal + '88';
                                ctx.fillRect(bx, chartY + chartH - bh, Math.max(barW - 1, 1), bh);
                            }
                        }

                        function drawTwinPrimes(ctx, n) {
                            viz.screenText('Twin Primes up to ' + n, viz.width / 2, 18, viz.colors.white, 15);

                            var twins = [];
                            for (var i = 0; i < primeList.length - 1; i++) {
                                if (primeList[i + 1] - primeList[i] === 2 && primeList[i] <= n) {
                                    twins.push([primeList[i], primeList[i + 1]]);
                                }
                                if (primeList[i] > n) break;
                            }

                            viz.screenText(twins.length + ' twin prime pairs found', viz.width / 2, 40, viz.colors.teal, 13);

                            // List some
                            var startY = 65;
                            var maxShow = Math.min(twins.length, 30);
                            var cols = Math.min(5, maxShow);
                            var cellW = 100;
                            var cellH = 20;
                            var sx = (viz.width - cols * cellW) / 2;

                            for (var i = 0; i < maxShow; i++) {
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText('(' + twins[i][0] + ', ' + twins[i][1] + ')',
                                    sx + col * cellW + cellW / 2, startY + row * cellH);
                            }

                            // Gap distribution
                            var gapY = viz.height - 150;
                            viz.screenText('Prime gaps up to ' + Math.min(n, 500), viz.width / 2, gapY - 8, viz.colors.text, 10);

                            var chartH = 100;
                            var chartW = viz.width - 80;
                            var primesInRange = primeList.filter(function(p) { return p <= Math.min(n, 500); });

                            for (var i = 0; i < primesInRange.length - 1; i++) {
                                var p = primesInRange[i];
                                var gap = primesInRange[i + 1] - p;
                                var x = 40 + (p / Math.min(n, 500)) * chartW;
                                var barH = gap * 6;
                                var col = (gap === 2) ? viz.colors.green : viz.colors.blue + '66';
                                ctx.fillStyle = col;
                                ctx.fillRect(x, gapY + chartH - barH, 3, barH);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(40, gapY + chartH + 10, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Gap = 2 (twin primes)', 54, gapY + chartH + 19);
                        }

                        function drawPerfect(ctx, n) {
                            viz.screenText('Perfect Numbers', viz.width / 2, 18, viz.colors.white, 15);

                            // Find perfect numbers up to n (or show known ones)
                            var perfects = [];
                            var known = [6, 28, 496, 8128];
                            for (var i = 0; i < known.length; i++) {
                                if (known[i] <= Math.max(n, 8128)) perfects.push(known[i]);
                            }

                            var y = 50;
                            for (var i = 0; i < perfects.length; i++) {
                                var pn = perfects[i];
                                // Find divisors
                                var divs = [];
                                for (var d = 1; d < pn; d++) {
                                    if (pn % d === 0) divs.push(d);
                                }

                                var divStr = divs.join(' + ');
                                var sum = divs.reduce(function(a, b) { return a + b; }, 0);

                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 14px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(pn + ' = ' + divStr, viz.width / 2, y);
                                y += 22;
                            }

                            // Euler's formula
                            y += 10;
                            viz.screenText("Euler's formula: 2^(p-1) \u00D7 (2^p - 1) when 2^p - 1 is prime", viz.width / 2, y, viz.colors.white, 12);
                            y += 24;

                            // Table of Mersenne primes
                            var mersennes = [
                                { p: 2, mp: 3, pn: 6 },
                                { p: 3, mp: 7, pn: 28 },
                                { p: 5, mp: 31, pn: 496 },
                                { p: 7, mp: 127, pn: 8128 },
                                { p: 13, mp: 8191, pn: 33550336 }
                            ];

                            var colW = 100;
                            var sx = (viz.width - 4 * colW) / 2;

                            // Headers
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('p', sx + colW / 2, y);
                            ctx.fillText('2^p - 1', sx + colW + colW / 2, y);
                            ctx.fillText('Prime?', sx + 2 * colW + colW / 2, y);
                            ctx.fillText('Perfect #', sx + 3 * colW + colW / 2, y);
                            y += 16;

                            for (var i = 0; i < mersennes.length; i++) {
                                var m = mersennes[i];
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '11px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(m.p.toString(), sx + colW / 2, y);
                                ctx.fillText(m.mp.toString(), sx + colW + colW / 2, y);
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('Yes', sx + 2 * colW + colW / 2, y);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText(m.pn.toLocaleString(), sx + 3 * colW + colW / 2, y);
                                y += 16;
                            }

                            y += 15;
                            viz.screenText('Open questions:', viz.width / 2, y, viz.colors.purple, 12);
                            y += 18;
                            viz.screenText('Are there infinitely many even perfect numbers?', viz.width / 2, y, viz.colors.text, 11);
                            y += 16;
                            viz.screenText('Does an odd perfect number exist?', viz.width / 2, y, viz.colors.text, 11);
                        }

                        function drawCollatz(ctx, n) {
                            viz.screenText('Collatz Conjecture (3n+1)', viz.width / 2, 18, viz.colors.white, 15);
                            viz.screenText('Starting from n = ' + n, viz.width / 2, 38, viz.colors.teal, 13);

                            // Compute sequence
                            var seq = [n];
                            var val = n;
                            var maxIter = 1000;
                            while (val !== 1 && seq.length < maxIter) {
                                if (val % 2 === 0) val = val / 2;
                                else val = 3 * val + 1;
                                seq.push(val);
                            }

                            viz.screenText('Steps to reach 1: ' + (seq.length - 1), viz.width / 2, 56, viz.colors.orange, 12);
                            var maxVal = Math.max.apply(null, seq);
                            viz.screenText('Maximum value: ' + maxVal, viz.width / 2, 72, viz.colors.text, 11);

                            // Plot the sequence
                            var chartY = 90;
                            var chartH = viz.height - chartY - 40;
                            var chartW = viz.width - 80;
                            var marginL = 60;

                            // Use log scale if max is large
                            var useLog = (maxVal > 100);
                            var scaleY;
                            if (useLog) {
                                scaleY = function(v) { return chartY + chartH - (Math.log(v + 1) / Math.log(maxVal + 1)) * chartH; };
                            } else {
                                scaleY = function(v) { return chartY + chartH - (v / maxVal) * chartH; };
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(marginL, chartY);
                            ctx.lineTo(marginL, chartY + chartH);
                            ctx.lineTo(marginL + chartW, chartY + chartH);
                            ctx.stroke();

                            // Plot
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < seq.length; i++) {
                                var px = marginL + (i / (seq.length - 1)) * chartW;
                                var py = scaleY(seq[i]);
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Highlight odd steps (3n+1) in different color
                            for (var i = 0; i < seq.length; i++) {
                                if (seq[i] % 2 === 1 && seq[i] > 1) {
                                    var px = marginL + (i / (seq.length - 1)) * chartW;
                                    var py = scaleY(seq[i]);
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Labels
                            viz.screenText(useLog ? 'log scale' : 'linear scale', marginL - 5, chartY + 10, viz.colors.text, 9, 'right');
                            viz.screenText('step', marginL + chartW / 2, chartY + chartH + 16, viz.colors.text, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the Collatz sequence starting from \\(n = 7\\). How many steps does it take to reach 1? What is the maximum value reached?',
                    hint: 'Apply the rule: if even, divide by 2; if odd, multiply by 3 and add 1.',
                    solution: '7 \u2192 22 \u2192 11 \u2192 34 \u2192 17 \u2192 52 \u2192 26 \u2192 13 \u2192 40 \u2192 20 \u2192 10 \u2192 5 \u2192 16 \u2192 8 \u2192 4 \u2192 2 \u2192 1. It takes 16 steps, and the maximum value reached is 52.'
                },
                {
                    question: '(Essay) Choose one application of number theory from this chapter (barcodes, calendars, music, nature, or computers). Write a short essay (one to two paragraphs) explaining how the underlying number theory works and why it matters in practice. Include at least one specific example with a computation.',
                    hint: 'Pick the topic that interests you most. Be concrete: show the actual arithmetic, not just the idea.',
                    solution: '(Answers will vary. A strong response should: (1) correctly identify the number-theoretic principle at work, (2) give a specific numerical example with explicit computation, and (3) explain why the mathematical structure matters for the practical application. For instance, an essay on barcodes should discuss modular arithmetic, show a check digit verification, and explain how the choice of weights and modulus determines which errors are caught.)'
                }
            ]
        }
    ]
});
