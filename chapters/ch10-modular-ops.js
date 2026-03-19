window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: 'Modular Addition & Multiplication',
    subtitle: 'Arithmetic that wraps around',
    sections: [
        // ================================================================
        // SECTION 1: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Motivation',
            content: `
<h2>Why Modular Operations?</h2>

<div class="env-block intuition">
    <div class="env-title">Clock Arithmetic</div>
    <div class="env-body">
        <p>It is 10 o'clock. What time will it be 5 hours later? Not 15 o'clock (on a 12-hour clock), but <strong>3 o'clock</strong>. You just did modular addition: \\(10 + 5 \\equiv 3 \\pmod{12}\\).</p>
        <p>What about 3 hours from now, repeated 4 times? That is \\(3 \\times 4 = 12 \\equiv 0 \\pmod{12}\\), bringing you right back to 12 (which we write as 0 on the clock).</p>
    </div>
</div>

<p>In the previous chapter, we learned about remainders and the congruence relation \\(a \\equiv b \\pmod{n}\\). Now we put that relation to work. We can <strong>add</strong>, <strong>multiply</strong>, and even <strong>raise to powers</strong> inside the modular world, and the results stay consistent.</p>

<p>This is not just a curiosity. Modular arithmetic is the foundation of:</p>
<ul>
    <li><strong>Cryptography</strong>: RSA, Diffie-Hellman, and elliptic curve methods all live in modular arithmetic.</li>
    <li><strong>Computer science</strong>: hash functions, checksums, and random number generators use mod operations.</li>
    <li><strong>Calendar calculations</strong>: what day of the week is January 1, 2100? That is mod 7 arithmetic.</li>
    <li><strong>Competition math</strong>: "find the last two digits of \\(7^{2025}\\)" means compute \\(7^{2025} \\pmod{100}\\).</li>
</ul>

<h3>The Key Property</h3>

<p>The reason modular arithmetic works so smoothly is that congruence is <strong>compatible</strong> with addition and multiplication. If \\(a \\equiv a' \\pmod{n}\\) and \\(b \\equiv b' \\pmod{n}\\), then:</p>

\\[
a + b \\equiv a' + b' \\pmod{n}, \\qquad a \\cdot b \\equiv a' \\cdot b' \\pmod{n}.
\\]

<p>This means we can replace any number by its remainder before adding or multiplying, and we will get the same final remainder. This is enormously powerful: instead of computing \\(7^{100}\\) (a 85-digit number) and then taking the remainder, we can take remainders at every step and keep the numbers small.</p>

<div class="env-block remark">
    <div class="env-title">What Does NOT Work</div>
    <div class="env-body">
        <p>Division is trickier. \\(6 \\equiv 0 \\pmod{6}\\), but dividing both sides by 2 gives \\(3 \\equiv 0 \\pmod{6}\\), which is false. We will address modular division (inverses) in a later chapter. For now, we focus on addition, multiplication, and exponentiation.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Adding Mod n
        // ================================================================
        {
            id: 'sec-addition',
            title: 'Adding Mod n',
            content: `
<h2>Adding Mod \\(n\\)</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Modular Addition)</div>
    <div class="env-body">
        <p>For integers \\(a\\) and \\(b\\) and a positive integer \\(n\\), the <strong>modular sum</strong> is</p>
        \\[
        a +_n b \\;=\\; (a + b) \\bmod n.
        \\]
        <p>Equivalently, we can first reduce \\(a\\) and \\(b\\) modulo \\(n\\), add the remainders, and reduce again:</p>
        \\[
        a +_n b \\;=\\; ((a \\bmod n) + (b \\bmod n)) \\bmod n.
        \\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.1 (Addition Preserves Congruence)</div>
    <div class="env-body">
        <p>If \\(a \\equiv a' \\pmod{n}\\) and \\(b \\equiv b' \\pmod{n}\\), then \\(a + b \\equiv a' + b' \\pmod{n}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>By hypothesis, \\(n \\mid (a - a')\\) and \\(n \\mid (b - b')\\). Therefore \\(n \\mid ((a - a') + (b - b')) = (a + b) - (a' + b')\\), which means \\(a + b \\equiv a' + b' \\pmod{n}\\). \\(\\square\\)</p>
    </div>
</div>

<p>On a clock face, adding \\(a + b \\pmod{n}\\) means: start at position \\(a\\), move \\(b\\) steps clockwise, and see where you land. If you go past \\(n - 1\\), you wrap around to 0 and keep going.</p>

<div class="env-block example">
    <div class="env-title">Example: Adding Mod 7</div>
    <div class="env-body">
        <p>Compute \\(5 + 4 \\pmod{7}\\).</p>
        <p>Method 1: \\(5 + 4 = 9\\), and \\(9 \\bmod 7 = 2\\).</p>
        <p>Method 2: \\(5 \\bmod 7 = 5\\), \\(4 \\bmod 7 = 4\\), \\((5 + 4) \\bmod 7 = 9 \\bmod 7 = 2\\). Same answer.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Large Numbers</div>
    <div class="env-body">
        <p>Compute \\(123 + 456 \\pmod{10}\\).</p>
        <p>We only need the last digits: \\(3 + 6 = 9\\). So \\(123 + 456 \\equiv 9 \\pmod{10}\\). Indeed, \\(123 + 456 = 579\\), and the last digit is 9. \\(\\checkmark\\)</p>
    </div>
</div>

<h3>Properties of Modular Addition</h3>

<p>Working modulo \\(n\\), addition has these familiar properties (inherited from ordinary addition):</p>
<ul>
    <li><strong>Closure</strong>: if \\(0 \\le a, b < n\\), then \\(0 \\le (a + b) \\bmod n < n\\).</li>
    <li><strong>Commutativity</strong>: \\(a + b \\equiv b + a \\pmod{n}\\).</li>
    <li><strong>Associativity</strong>: \\((a + b) + c \\equiv a + (b + c) \\pmod{n}\\).</li>
    <li><strong>Identity</strong>: \\(a + 0 \\equiv a \\pmod{n}\\).</li>
    <li><strong>Inverse</strong>: for any \\(a\\), there exists \\(b = n - a\\) such that \\(a + b \\equiv 0 \\pmod{n}\\).</li>
</ul>

<p>In algebraic language, the integers modulo \\(n\\) form a <em>group</em> under addition. We write this group as \\((\\mathbb{Z}/n\\mathbb{Z}, +)\\) or simply \\(\\mathbb{Z}_n\\).</p>

<div class="viz-placeholder" data-viz="viz-mod-addition"></div>
`,
            visualizations: [
                {
                    id: 'viz-mod-addition',
                    title: 'Modular Addition on the Clock',
                    description: 'Choose two numbers \\(a\\) and \\(b\\) and a modulus \\(n\\). Watch the clock hand move from \\(a\\), step \\(b\\) positions clockwise, and land on \\((a+b) \\bmod n\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 220, scale: 1
                        });

                        var n = 12, a = 5, b = 4;
                        var animT = 0, animating = false;

                        VizEngine.createSlider(controls, 'n (mod)', 2, 20, n, 1, function(v) {
                            n = Math.round(v);
                            if (a >= n) a = n - 1;
                            if (b >= n) b = n - 1;
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createSlider(controls, 'a', 0, 19, a, 1, function(v) {
                            a = Math.min(Math.round(v), n - 1);
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createSlider(controls, 'b', 0, 19, b, 1, function(v) {
                            b = Math.min(Math.round(v), n - 1);
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            animT = 0; animating = true;
                        });

                        var cx = 280, cy = 210, R = 140;

                        function angleFor(k, mod) {
                            return -Math.PI / 2 + (2 * Math.PI * k) / mod;
                        }

                        function drawClock(t) {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('Addition mod ' + n, 280, 20, viz.colors.white, 16);

                            // Draw clock circle
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(cx, cy, R, 0, Math.PI * 2);
                            ctx.stroke();

                            // Draw tick marks and labels
                            for (var i = 0; i < n; i++) {
                                var ang = angleFor(i, n);
                                var x1 = cx + Math.cos(ang) * (R - 8);
                                var y1 = cy + Math.sin(ang) * (R - 8);
                                var x2 = cx + Math.cos(ang) * (R + 2);
                                var y2 = cy + Math.sin(ang) * (R + 2);
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

                                var lx = cx + Math.cos(ang) * (R + 18);
                                var ly = cy + Math.sin(ang) * (R + 18);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), lx, ly);
                            }

                            // Highlight position a
                            var angA = angleFor(a, n);
                            var ax = cx + Math.cos(angA) * R;
                            var ay = cy + Math.sin(angA) * R;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(ax, ay, 8, 0, Math.PI * 2); ctx.fill();

                            // Highlight result position
                            var result = (a + b) % n;
                            var angR = angleFor(result, n);
                            var rx = cx + Math.cos(angR) * R;
                            var ry = cy + Math.sin(angR) * R;

                            // Draw arc from a to result (the b steps)
                            if (b > 0) {
                                var stepsShown = Math.min(b, Math.floor(t * b));
                                if (t >= 1) stepsShown = b;

                                // Draw arc
                                var startAng = angleFor(a, n);
                                var endAng = angleFor((a + stepsShown) % n, n);
                                // We need to draw stepsShown / n of the circle
                                var arcSweep = (2 * Math.PI * stepsShown) / n;

                                ctx.strokeStyle = viz.colors.orange + 'aa';
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(cx, cy, R - 20, startAng, startAng + arcSweep);
                                ctx.stroke();

                                // Arrow head at current position
                                var curAng = startAng + arcSweep;
                                var arrowX = cx + Math.cos(curAng) * (R - 20);
                                var arrowY = cy + Math.sin(curAng) * (R - 20);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(arrowX, arrowY, 6, 0, Math.PI * 2);
                                ctx.fill();

                                // Step markers
                                for (var s = 1; s <= stepsShown; s++) {
                                    var sAng = angleFor((a + s) % n, n);
                                    var sx = cx + Math.cos(sAng) * (R - 20);
                                    var sy = cy + Math.sin(sAng) * (R - 20);
                                    ctx.fillStyle = viz.colors.orange + '66';
                                    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
                                }
                            }

                            // Result highlight
                            if (t >= 1) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(rx, ry, 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = '#000';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(result.toString(), rx, ry);
                            }

                            // Legend
                            var ly2 = 400;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(120, ly2, 6, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('a = ' + a, 150, ly2, viz.colors.blue, 13, 'left');

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(220, ly2, 6, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('+' + b + ' steps', 250, ly2, viz.colors.orange, 13, 'left');

                            if (t >= 1) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(360, ly2, 6, 0, Math.PI * 2); ctx.fill();
                                viz.screenText('= ' + result, 390, ly2, viz.colors.green, 13, 'left');
                            }

                            // Equation
                            viz.screenText(a + ' + ' + b + ' = ' + (a + b) + ' \\u2261 ' + result + ' (mod ' + n + ')', 280, 380, viz.colors.white, 14);
                        }

                        function draw() { drawClock(1); }

                        viz.animate(function(time) {
                            if (animating) {
                                animT += 0.02;
                                if (animT >= 1) { animT = 1; animating = false; }
                                drawClock(animT);
                            } else {
                                drawClock(animT >= 1 || !animating ? 1 : 0);
                            }
                        });

                        drawClock(1);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(8 + 7 \\pmod{12}\\). What time is it 7 hours after 8 o\'clock?',
                    hint: '\\(8 + 7 = 15\\). Now reduce modulo 12.',
                    solution: '\\(8 + 7 = 15\\), and \\(15 \\bmod 12 = 3\\). So \\(8 + 7 \\equiv 3 \\pmod{12}\\). It is 3 o\'clock.'
                },
                {
                    question: 'Compute \\(17 + 28 \\pmod{10}\\) by first reducing each number mod 10.',
                    hint: '\\(17 \\bmod 10 = 7\\) and \\(28 \\bmod 10 = 8\\). Now add and reduce.',
                    solution: '\\(17 \\bmod 10 = 7\\), \\(28 \\bmod 10 = 8\\). \\(7 + 8 = 15\\), \\(15 \\bmod 10 = 5\\). So \\(17 + 28 \\equiv 5 \\pmod{10}\\). Check: \\(17 + 28 = 45\\), last digit 5. \\(\\checkmark\\)'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Multiplying Mod n
        // ================================================================
        {
            id: 'sec-multiplication',
            title: 'Multiplying Mod n',
            content: `
<h2>Multiplying Mod \\(n\\)</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Modular Multiplication)</div>
    <div class="env-body">
        <p>For integers \\(a\\) and \\(b\\) and a positive integer \\(n\\), the <strong>modular product</strong> is</p>
        \\[
        a \\cdot_n b \\;=\\; (a \\cdot b) \\bmod n.
        \\]
        <p>As with addition, we can reduce first:</p>
        \\[
        a \\cdot_n b \\;=\\; ((a \\bmod n) \\cdot (b \\bmod n)) \\bmod n.
        \\]
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.2 (Multiplication Preserves Congruence)</div>
    <div class="env-body">
        <p>If \\(a \\equiv a' \\pmod{n}\\) and \\(b \\equiv b' \\pmod{n}\\), then \\(a \\cdot b \\equiv a' \\cdot b' \\pmod{n}\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Write \\(a = a' + sn\\) and \\(b = b' + tn\\) for some integers \\(s, t\\). Then</p>
        \\[
        ab = (a' + sn)(b' + tn) = a'b' + a'tn + snb' + stn^2 = a'b' + n(a't + sb' + stn).
        \\]
        <p>So \\(n \\mid (ab - a'b')\\), meaning \\(ab \\equiv a'b' \\pmod{n}\\). \\(\\square\\)</p>
    </div>
</div>

<p>On the clock, multiplication \\(a \\cdot b \\pmod{n}\\) means: start at 0, take \\(b\\) jumps of size \\(a\\) each (wrapping around), and see where you land.</p>

<div class="env-block example">
    <div class="env-title">Example: Multiplying Mod 7</div>
    <div class="env-body">
        <p>Compute \\(5 \\times 4 \\pmod{7}\\).</p>
        <p>\\(5 \\times 4 = 20\\), and \\(20 \\bmod 7 = 6\\) (since \\(20 = 2 \\times 7 + 6\\)).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Reduce First, Then Multiply</div>
    <div class="env-body">
        <p>Compute \\(123 \\times 456 \\pmod{10}\\).</p>
        <p>Only the last digits matter: \\(3 \\times 6 = 18\\), and \\(18 \\bmod 10 = 8\\). So \\(123 \\times 456 \\equiv 8 \\pmod{10}\\).</p>
        <p>Check: \\(123 \\times 456 = 56{,}088\\), last digit 8. \\(\\checkmark\\)</p>
    </div>
</div>

<h3>Repeated Squaring</h3>

<p>A powerful consequence of Theorem 10.2 is that we can raise to powers modularly. If \\(a \\equiv r \\pmod{n}\\), then \\(a^2 \\equiv r^2 \\pmod{n}\\), then \\(a^4 \\equiv (r^2)^2 \\pmod{n}\\), and so on. This is called <strong>repeated squaring</strong> (or binary exponentiation), and it lets us compute \\(a^k \\bmod n\\) in about \\(\\log_2 k\\) multiplications instead of \\(k\\).</p>

<div class="env-block example">
    <div class="env-title">Example: \\(3^{10} \\bmod 7\\) by Repeated Squaring</div>
    <div class="env-body">
        <p>\\(3^1 \\equiv 3 \\pmod{7}\\)</p>
        <p>\\(3^2 \\equiv 9 \\equiv 2 \\pmod{7}\\)</p>
        <p>\\(3^4 \\equiv 2^2 = 4 \\pmod{7}\\)</p>
        <p>\\(3^8 \\equiv 4^2 = 16 \\equiv 2 \\pmod{7}\\)</p>
        <p>Now \\(3^{10} = 3^8 \\cdot 3^2 \\equiv 2 \\cdot 2 = 4 \\pmod{7}\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-mod-multiplication"></div>
`,
            visualizations: [
                {
                    id: 'viz-mod-multiplication',
                    title: 'Modular Multiplication on the Clock',
                    description: 'Multiply \\(a \\times b \\pmod{n}\\): start at 0 and take \\(b\\) jumps of size \\(a\\). Watch the steps wrap around the clock.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 280, originY: 220, scale: 1
                        });

                        var n = 12, a = 5, b = 3;
                        var animT = 0, animating = false;

                        VizEngine.createSlider(controls, 'n (mod)', 2, 20, n, 1, function(v) {
                            n = Math.round(v);
                            if (a >= n) a = n - 1;
                            if (b > 20) b = 20;
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createSlider(controls, 'a', 0, 19, a, 1, function(v) {
                            a = Math.min(Math.round(v), n - 1);
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createSlider(controls, 'b', 0, 20, b, 1, function(v) {
                            b = Math.round(v);
                            animT = 0; animating = false; draw();
                        });
                        VizEngine.createButton(controls, 'Animate', function() {
                            animT = 0; animating = true;
                        });

                        var cx = 280, cy = 210, R = 140;

                        function angleFor(k, mod) {
                            return -Math.PI / 2 + (2 * Math.PI * k) / mod;
                        }

                        function drawMul(t) {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Multiplication mod ' + n, 280, 20, viz.colors.white, 16);

                            // Clock
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(cx, cy, R, 0, Math.PI * 2);
                            ctx.stroke();

                            for (var i = 0; i < n; i++) {
                                var ang = angleFor(i, n);
                                var x1 = cx + Math.cos(ang) * (R - 8);
                                var y1 = cy + Math.sin(ang) * (R - 8);
                                var x2 = cx + Math.cos(ang) * (R + 2);
                                var y2 = cy + Math.sin(ang) * (R + 2);
                                ctx.strokeStyle = viz.colors.text;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

                                var lx = cx + Math.cos(ang) * (R + 18);
                                var ly = cy + Math.sin(ang) * (R + 18);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(i.toString(), lx, ly);
                            }

                            // Show jumps
                            var jumpsDone = Math.min(b, Math.floor(t * b));
                            if (t >= 1) jumpsDone = b;
                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.yellow, viz.colors.red];

                            var prevPos = 0;
                            for (var j = 0; j < jumpsDone; j++) {
                                var curPos = (prevPos + a) % n;
                                var angStart = angleFor(prevPos, n);
                                var angEnd = angleFor(curPos, n);
                                var col = colors[j % colors.length];

                                // Draw arc for this jump
                                var jumpArcSweep = (2 * Math.PI * a) / n;
                                ctx.strokeStyle = col + '88';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(cx, cy, R - 15 - (j % 3) * 5, angStart, angStart + jumpArcSweep);
                                ctx.stroke();

                                // Small dot at landing
                                var lx2 = cx + Math.cos(angEnd) * R;
                                var ly2 = cy + Math.sin(angEnd) * R;
                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(lx2, ly2, 4, 0, Math.PI * 2); ctx.fill();

                                prevPos = curPos;
                            }

                            // Start marker at 0
                            var ang0 = angleFor(0, n);
                            var sx = cx + Math.cos(ang0) * R;
                            var sy = cy + Math.sin(ang0) * R;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();

                            // Result marker
                            var result = (a * b) % n;
                            if (t >= 1) {
                                var angRes = angleFor(result, n);
                                var resX = cx + Math.cos(angRes) * R;
                                var resY = cy + Math.sin(angRes) * R;
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(resX, resY, 10, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = '#000';
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(result.toString(), resX, resY);
                            }

                            // Info
                            viz.screenText(a + ' \\u00D7 ' + b + ' = ' + (a * b) + ' \\u2261 ' + result + ' (mod ' + n + ')', 280, 380, viz.colors.white, 14);
                            viz.screenText(b + ' jumps of size ' + a + ' from 0', 280, 400, viz.colors.text, 12);
                        }

                        function draw() { drawMul(1); }

                        viz.animate(function(time) {
                            if (animating) {
                                animT += 0.015;
                                if (animT >= 1) { animT = 1; animating = false; }
                                drawMul(animT);
                            } else {
                                drawMul(1);
                            }
                        });

                        drawMul(1);
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(9 \\times 8 \\pmod{11}\\).',
                    hint: '\\(9 \\times 8 = 72\\). Divide by 11: \\(72 = 6 \\times 11 + r\\).',
                    solution: '\\(72 = 6 \\times 11 + 6\\), so \\(9 \\times 8 \\equiv 6 \\pmod{11}\\).'
                },
                {
                    question: 'Compute \\(2^{10} \\pmod{7}\\) using repeated squaring.',
                    hint: '\\(2^1 = 2\\), \\(2^2 = 4\\), \\(2^4 \\equiv 4^2 = 16 \\equiv ?\\), \\(2^8 \\equiv ?\\). Then \\(2^{10} = 2^8 \\cdot 2^2\\).',
                    solution: '\\(2^2 = 4\\), \\(2^4 \\equiv 16 \\equiv 2 \\pmod{7}\\), \\(2^8 \\equiv 2^2 = 4 \\pmod{7}\\). So \\(2^{10} = 2^8 \\cdot 2^2 \\equiv 4 \\times 4 = 16 \\equiv 2 \\pmod{7}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Addition & Multiplication Tables Mod n
        // ================================================================
        {
            id: 'sec-tables',
            title: 'Addition & Multiplication Tables Mod n',
            content: `
<h2>Addition and Multiplication Tables Mod \\(n\\)</h2>

<p>Just as we learned addition and multiplication tables in elementary school, we can build such tables for modular arithmetic. These tables reveal beautiful patterns and important structural features.</p>

<h3>Addition Table Mod \\(n\\)</h3>

<p>The addition table mod \\(n\\) is an \\(n \\times n\\) grid where the entry in row \\(a\\) and column \\(b\\) is \\((a + b) \\bmod n\\). Here is the table for \\(n = 5\\):</p>

<div style="overflow-x:auto;">
<table style="margin:1em auto;border-collapse:collapse;font-size:0.9em;">
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;color:#58a6ff;">+</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">0</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">1</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">2</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">3</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">4</th></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">0</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">1</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">4</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">1</th><td style="border:1px solid #333;padding:4px 10px;">1</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">0</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">2</th><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">1</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">3</th><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">1</td><td style="border:1px solid #333;padding:4px 10px;">2</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">4</th><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">1</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">3</td></tr>
</table>
</div>

<p>Notice the pattern: each row is a <em>cyclic shift</em> of the previous row. This is because adding 1 more to every entry shifts everything by one position. In fact, this table is a <strong>Latin square</strong>: every number from 0 to \\(n-1\\) appears exactly once in each row and each column.</p>

<h3>Multiplication Table Mod \\(n\\)</h3>

<p>The multiplication table mod \\(n\\) holds deeper secrets. Here is the table for \\(n = 6\\):</p>

<div style="overflow-x:auto;">
<table style="margin:1em auto;border-collapse:collapse;font-size:0.9em;">
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;color:#f0883e;">\\(\\times\\)</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">0</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">1</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">2</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">3</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">4</th><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">5</th></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">0</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">0</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">1</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">1</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">5</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">2</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;color:#f85149;"><strong>4</strong></td><td style="border:1px solid #333;padding:4px 10px;color:#f85149;"><strong>0</strong></td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">4</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">3</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;color:#f85149;"><strong>0</strong></td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;color:#f85149;"><strong>0</strong></td><td style="border:1px solid #333;padding:4px 10px;">3</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">4</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;color:#f85149;"><strong>0</strong></td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">2</td></tr>
<tr><th style="border:1px solid #333;padding:4px 10px;background:#1a1a40;">5</th><td style="border:1px solid #333;padding:4px 10px;">0</td><td style="border:1px solid #333;padding:4px 10px;">5</td><td style="border:1px solid #333;padding:4px 10px;">4</td><td style="border:1px solid #333;padding:4px 10px;">3</td><td style="border:1px solid #333;padding:4px 10px;">2</td><td style="border:1px solid #333;padding:4px 10px;">1</td></tr>
</table>
</div>

<p>The entries in <span style="color:#f85149;font-weight:bold;">red</span> are the <strong>zero divisors</strong>: pairs \\((a, b)\\) where \\(a \\ne 0\\), \\(b \\ne 0\\), but \\(ab \\equiv 0 \\pmod{6}\\). For example, \\(2 \\times 3 = 6 \\equiv 0 \\pmod{6}\\). Zero divisors exist precisely when \\(n\\) is <strong>not prime</strong>.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.3 (No Zero Divisors \\(\\Leftrightarrow\\) \\(n\\) is Prime)</div>
    <div class="env-body">
        <p>The modular integers \\(\\{0, 1, \\ldots, n-1\\}\\) have no zero divisors if and only if \\(n\\) is prime. That is, \\(ab \\equiv 0 \\pmod{n}\\) with \\(a \\not\\equiv 0\\) and \\(b \\not\\equiv 0\\) can happen only when \\(n\\) is composite.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Why This Matters</div>
    <div class="env-body">
        <p>When \\(n\\) is prime, the multiplication table (excluding row 0 and column 0) is also a Latin square: every nonzero value appears exactly once in each row and column. This means every nonzero element has a multiplicative inverse, which makes \\(\\mathbb{Z}_p\\) a <strong>field</strong>. When \\(n\\) is composite, some rows have repeated values and missing values, because of zero divisors.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-mod-tables"></div>
`,
            visualizations: [
                {
                    id: 'viz-mod-tables',
                    title: 'Interactive Modular Tables',
                    description: 'View the addition and multiplication tables mod \\(n\\). Each cell is colored by its value. Use the slider to change \\(n\\) and toggle between addition and multiplication. Notice how the multiplication table changes when \\(n\\) is prime vs. composite.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 500,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 7;
                        var mode = 'mul'; // 'add' or 'mul'

                        VizEngine.createSlider(controls, 'n', 2, 14, n, 1, function(v) {
                            n = Math.round(v); draw();
                        });
                        VizEngine.createButton(controls, 'Addition', function() { mode = 'add'; draw(); });
                        VizEngine.createButton(controls, 'Multiplication', function() { mode = 'mul'; draw(); });

                        function isPrime(k) {
                            if (k < 2) return false;
                            for (var i = 2; i * i <= k; i++) if (k % i === 0) return false;
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var prime = isPrime(n);
                            var label = mode === 'add' ? 'Addition' : 'Multiplication';
                            viz.screenText(label + ' Table mod ' + n + (prime ? ' (prime)' : ' (composite)'), 280, 18, viz.colors.white, 15);

                            var cellSize = Math.min(38, Math.floor((viz.width - 80) / (n + 1)));
                            var tableW = (n + 1) * cellSize;
                            var startX = (viz.width - tableW) / 2;
                            var startY = 40;

                            // Color palette based on value
                            var hueStep = 360 / n;

                            for (var r = -1; r < n; r++) {
                                for (var c = -1; c < n; c++) {
                                    var px = startX + (c + 1) * cellSize;
                                    var py = startY + (r + 1) * cellSize;

                                    if (r === -1 && c === -1) {
                                        // Op symbol
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = 'bold 13px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(mode === 'add' ? '+' : '\u00D7', px + cellSize / 2, py + cellSize / 2);
                                    } else if (r === -1) {
                                        // Header row
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = viz.colors.teal;
                                        ctx.font = 'bold 12px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(c.toString(), px + cellSize / 2, py + cellSize / 2);
                                    } else if (c === -1) {
                                        // Header col
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = viz.colors.teal;
                                        ctx.font = 'bold 12px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(r.toString(), px + cellSize / 2, py + cellSize / 2);
                                    } else {
                                        var val;
                                        if (mode === 'add') val = (r + c) % n;
                                        else val = (r * c) % n;

                                        var hue = (val * hueStep) % 360;
                                        var isZeroDivisor = (mode === 'mul' && val === 0 && r !== 0 && c !== 0);

                                        if (isZeroDivisor) {
                                            ctx.fillStyle = '#4a1515';
                                        } else {
                                            var rgb = VizEngine.hslToRgb(hue / 360, 0.6, 0.25);
                                            ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                        }
                                        ctx.fillRect(px, py, cellSize, cellSize);

                                        ctx.strokeStyle = '#333';
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(px, py, cellSize, cellSize);

                                        ctx.fillStyle = isZeroDivisor ? viz.colors.red : viz.colors.white;
                                        ctx.font = (isZeroDivisor ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(val.toString(), px + cellSize / 2, py + cellSize / 2);
                                    }
                                }
                            }

                            // Legend
                            var legendY = startY + (n + 1) * cellSize + 15;
                            if (mode === 'mul') {
                                ctx.fillStyle = '#4a1515';
                                ctx.fillRect(160, legendY, 14, 14);
                                ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1;
                                ctx.strokeRect(160, legendY, 14, 14);
                                viz.screenText('Zero divisors (ab \\u2261 0 but a,b \\u2260 0)', 350, legendY + 7, viz.colors.red, 12);
                            }

                            if (mode === 'add') {
                                viz.screenText('Each row is a cyclic shift (Latin square)', 280, legendY + 7, viz.colors.teal, 12);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the multiplication table mod 5 (a prime). Verify that every nonzero element appears exactly once in each row (excluding the row for 0).',
                    hint: 'Compute \\(a \\times b \\bmod 5\\) for \\(a, b \\in \\{0,1,2,3,4\\}\\). Check rows 1 through 4.',
                    solution: 'Row 1: 0,1,2,3,4. Row 2: 0,2,4,1,3. Row 3: 0,3,1,4,2. Row 4: 0,4,3,2,1. Each nonzero row is a permutation of \\(\\{0,1,2,3,4\\}\\), and ignoring the 0, each of \\(\\{1,2,3,4\\}\\) appears exactly once. No zero divisors exist since 5 is prime.'
                },
                {
                    question: 'In the multiplication table mod 6, which pairs \\((a, b)\\) with \\(a, b \\ne 0\\) give \\(ab \\equiv 0 \\pmod{6}\\)?',
                    hint: 'Look for products that are multiples of 6. Consider \\(2 \\times 3\\), \\(3 \\times 4\\), etc.',
                    solution: 'The zero divisor pairs are: \\((2,3), (3,2), (3,4), (4,3)\\). We have \\(2 \\times 3 = 6 \\equiv 0\\) and \\(3 \\times 4 = 12 \\equiv 0 \\pmod{6}\\). These exist because 6 is composite (\\(6 = 2 \\times 3\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Last Digit Tricks
        // ================================================================
        {
            id: 'sec-last-digit',
            title: 'Last Digit Tricks',
            content: `
<h2>Last Digit Tricks</h2>

<p>The last digit of a number is just its remainder when divided by 10. So finding the last digit of a huge number is the same as computing that number mod 10. Similarly, the last <em>two</em> digits are the remainder mod 100.</p>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>What is the last digit of \\(7^{100}\\)? We do not need to compute \\(7^{100}\\) (a 85-digit number). Instead, we track just the last digit at each step, using the fact that the last digit of a product depends only on the last digits of the factors.</p>
    </div>
</div>

<h3>Last Digits Cycle</h3>

<p>Consider the powers of 7 mod 10:</p>
\\[
7^1 \\equiv 7, \\quad 7^2 \\equiv 9, \\quad 7^3 \\equiv 3, \\quad 7^4 \\equiv 1, \\quad 7^5 \\equiv 7, \\quad \\ldots
\\]

<p>The last digits cycle with period 4: \\(7, 9, 3, 1, 7, 9, 3, 1, \\ldots\\) Since \\(100 = 4 \\times 25\\), we have \\(7^{100} \\equiv (7^4)^{25} \\equiv 1^{25} \\equiv 1 \\pmod{10}\\). The last digit of \\(7^{100}\\) is <strong>1</strong>.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 10.4 (Last-Digit Cycles)</div>
    <div class="env-body">
        <p>For any integer \\(a\\), the sequence of last digits \\(a^1 \\bmod 10, a^2 \\bmod 10, a^3 \\bmod 10, \\ldots\\) is eventually periodic. The cycle length divides 4 (a consequence of the fact that the group \\((\\mathbb{Z}/10\\mathbb{Z})^\\times\\) has order 4).</p>
    </div>
</div>

<p>Here are the last-digit cycles for each base digit:</p>
<ul>
    <li><strong>0</strong>: always 0 (cycle length 1)</li>
    <li><strong>1</strong>: always 1 (cycle length 1)</li>
    <li><strong>2</strong>: 2, 4, 8, 6, 2, 4, 8, 6, ... (cycle length 4)</li>
    <li><strong>3</strong>: 3, 9, 7, 1, 3, 9, 7, 1, ... (cycle length 4)</li>
    <li><strong>4</strong>: 4, 6, 4, 6, ... (cycle length 2)</li>
    <li><strong>5</strong>: always 5 (cycle length 1)</li>
    <li><strong>6</strong>: always 6 (cycle length 1)</li>
    <li><strong>7</strong>: 7, 9, 3, 1, 7, 9, 3, 1, ... (cycle length 4)</li>
    <li><strong>8</strong>: 8, 4, 2, 6, 8, 4, 2, 6, ... (cycle length 4)</li>
    <li><strong>9</strong>: 9, 1, 9, 1, ... (cycle length 2)</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: Last Digit of \\(3^{2025}\\)</div>
    <div class="env-body">
        <p>The cycle of last digits for powers of 3 is: 3, 9, 7, 1 (period 4).</p>
        <p>\\(2025 \\bmod 4 = 1\\) (since \\(2025 = 506 \\times 4 + 1\\)).</p>
        <p>So \\(3^{2025}\\) has the same last digit as \\(3^1 = 3\\). The answer is <strong>3</strong>.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Last Two Digits of \\(99^{99}\\)</div>
    <div class="env-body">
        <p>We need \\(99^{99} \\bmod 100\\). Note \\(99 \\equiv -1 \\pmod{100}\\), so \\(99^{99} \\equiv (-1)^{99} = -1 \\equiv 99 \\pmod{100}\\). The last two digits are <strong>99</strong>.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-last-digit"></div>
`,
            visualizations: [
                {
                    id: 'viz-last-digit',
                    title: 'Last Digit Power Cycles',
                    description: 'Choose a base \\(a\\) and watch its powers mod 10 cycle. The visualization shows the repeating pattern and computes \\(a^k \\bmod 10\\) for any exponent \\(k\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var base = 7, expo = 100;

                        VizEngine.createSlider(controls, 'base a', 0, 9, base, 1, function(v) {
                            base = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'exponent k', 1, 200, expo, 1, function(v) {
                            expo = Math.round(v); draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Last Digit of ' + base + '^k', 280, 20, viz.colors.white, 16);

                            // Compute cycle
                            var cycle = [];
                            var val = base % 10;
                            var seen = {};
                            for (var i = 1; i <= 20; i++) {
                                cycle.push(val);
                                if (seen[val] !== undefined) break;
                                seen[val] = i - 1;
                                val = (val * base) % 10;
                            }
                            // Find actual cycle
                            var startIdx = seen[val] || 0;
                            var preCycle = cycle.slice(0, startIdx);
                            var mainCycle = cycle.slice(startIdx, cycle.length - 1);
                            if (mainCycle.length === 0) mainCycle = [cycle[0]];
                            var cycleLen = mainCycle.length;

                            // Display the cycle
                            viz.screenText('Cycle: ' + mainCycle.join(', ') + '  (period ' + cycleLen + ')', 280, 50, viz.colors.teal, 14);

                            // Draw circular cycle
                            var ccx = 200, ccy = 200, cR = 80;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(ccx, ccy, cR, 0, Math.PI * 2);
                            ctx.stroke();

                            var cycleColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink, viz.colors.yellow, viz.colors.red];

                            for (var j = 0; j < cycleLen; j++) {
                                var ang = -Math.PI / 2 + (2 * Math.PI * j) / cycleLen;
                                var px = ccx + Math.cos(ang) * cR;
                                var py = ccy + Math.sin(ang) * cR;
                                var col = cycleColors[j % cycleColors.length];

                                ctx.fillStyle = col;
                                ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.fill();

                                ctx.fillStyle = '#000';
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(mainCycle[j].toString(), px, py);

                                // Arrow to next
                                var nextJ = (j + 1) % cycleLen;
                                var nextAng = -Math.PI / 2 + (2 * Math.PI * nextJ) / cycleLen;
                                var arrowStartX = ccx + Math.cos(ang) * (cR + 22);
                                var arrowStartY = ccy + Math.sin(ang) * (cR + 22);
                                var arrowEndX = ccx + Math.cos(nextAng) * (cR + 22);
                                var arrowEndY = ccy + Math.sin(nextAng) * (cR + 22);
                                if (cycleLen > 1) {
                                    var midAng = ang + (2 * Math.PI) / cycleLen * 0.5;
                                    var arcR = cR + 22;
                                    ctx.strokeStyle = viz.colors.text + '66';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.arc(ccx, ccy, arcR, ang + 0.2, nextAng - 0.2);
                                    ctx.stroke();
                                }

                                // Exponent label
                                var lx = ccx + Math.cos(ang) * (cR - 30);
                                var ly = ccy + Math.sin(ang) * (cR - 30);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(base + '^' + (j + 1), lx, ly);
                            }

                            // Right side: compute a^k mod 10
                            var rX = 400;
                            viz.screenText('Computing ' + base + '^' + expo + ' mod 10', rX, 110, viz.colors.white, 14);

                            // Determine result
                            var result;
                            if (base % 10 === 0) {
                                result = 0;
                            } else if (cycleLen === 1) {
                                result = mainCycle[0];
                            } else {
                                var r = ((expo - 1) % cycleLen);
                                result = mainCycle[r];
                            }

                            viz.screenText('k = ' + expo, rX, 145, viz.colors.text, 12);
                            if (cycleLen > 1) {
                                var posInCycle = ((expo - 1) % cycleLen);
                                viz.screenText('(k-1) mod ' + cycleLen + ' = ' + posInCycle, rX, 165, viz.colors.text, 12);
                                viz.screenText('Cycle position: ' + (posInCycle + 1), rX, 185, viz.colors.orange, 12);
                            }

                            viz.screenText('Last digit: ' + result, rX, 220, viz.colors.green, 20);

                            // Show first 16 powers
                            viz.screenText('First powers:', rX, 260, viz.colors.text, 11);
                            var v2 = 1;
                            for (var p = 1; p <= 16; p++) {
                                v2 = (v2 * base) % 10;
                                var row = Math.floor((p - 1) / 4);
                                var col2 = (p - 1) % 4;
                                var highlight = (cycleLen > 0 && ((p - 1) % cycleLen === ((expo - 1) % cycleLen)));
                                var tx = rX - 60 + col2 * 42;
                                var ty = 280 + row * 22;

                                if (highlight) {
                                    ctx.fillStyle = viz.colors.green + '33';
                                    ctx.fillRect(tx - 18, ty - 9, 38, 18);
                                }
                                ctx.fillStyle = highlight ? viz.colors.green : viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(base + '^' + p + '=' + v2, tx, ty);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the last digit of \\(2^{2025}\\)?',
                    hint: 'The cycle of last digits for powers of 2 is: 2, 4, 8, 6 (period 4). Find \\(2025 \\bmod 4\\).',
                    solution: '\\(2025 \\bmod 4 = 1\\). The cycle is 2, 4, 8, 6. Position 1 in the cycle gives \\(2\\). So the last digit of \\(2^{2025}\\) is \\(\\mathbf{2}\\).'
                },
                {
                    question: 'What is the last digit of \\(13^{13}\\)?',
                    hint: 'The last digit of 13 is 3. The cycle for 3 is: 3, 9, 7, 1 (period 4). Find \\(13 \\bmod 4\\).',
                    solution: '\\(13 \\bmod 10 = 3\\). The cycle for 3 is: 3, 9, 7, 1. \\(13 \\bmod 4 = 1\\). Position 1 is 3. The last digit of \\(13^{13}\\) is \\(\\mathbf{3}\\).'
                },
                {
                    question: 'What are the last two digits of \\(7^{20}\\)?',
                    hint: 'Compute \\(7^{20} \\bmod 100\\). Use repeated squaring: \\(7^2 = 49\\), \\(7^4 = 49^2 = 2401 \\equiv 1 \\pmod{100}\\). So \\(7^{20} = (7^4)^5 \\equiv ?\\).',
                    solution: '\\(7^2 = 49\\). \\(7^4 = 49^2 = 2401 \\equiv 1 \\pmod{100}\\). \\(7^{20} = (7^4)^5 \\equiv 1^5 = 1 \\pmod{100}\\). The last two digits are \\(\\mathbf{01}\\).'
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
<h2>Looking Ahead: Patterns in Remainders</h2>

<p>In this chapter, we learned that addition and multiplication "play nicely" with the mod operation. We built modular arithmetic tables, discovered zero divisors, and used last-digit cycles to tame enormous powers.</p>

<h3>What We Have Established</h3>
<ul>
    <li>Congruence is preserved by addition and multiplication (Theorems 10.1 and 10.2).</li>
    <li>We can reduce at any step, keeping numbers small.</li>
    <li>Modular addition tables are always Latin squares; modular multiplication tables are Latin squares (excluding row/column 0) if and only if \\(n\\) is prime.</li>
    <li>Zero divisors exist precisely when \\(n\\) is composite.</li>
    <li>Last digits of powers cycle with periods dividing 4.</li>
</ul>

<h3>What Comes Next</h3>

<p>Chapter 11 will explore deeper patterns in remainders:</p>
<ul>
    <li><strong>Fermat's Little Theorem</strong>: if \\(p\\) is prime and \\(\\gcd(a, p) = 1\\), then \\(a^{p-1} \\equiv 1 \\pmod{p}\\). This explains <em>why</em> last-digit cycles have periods dividing 4 (since \\(\\phi(10) = 4\\)).</li>
    <li><strong>Euler's Theorem</strong>: the generalization to composite moduli using Euler's totient function \\(\\phi(n)\\).</li>
    <li><strong>Order of an element</strong>: the smallest positive \\(k\\) such that \\(a^k \\equiv 1 \\pmod{n}\\), which determines the exact cycle length.</li>
</ul>

<div class="env-block intuition">
    <div class="env-title">A Taste of What is Coming</div>
    <div class="env-body">
        <p>We saw that \\(7^4 \\equiv 1 \\pmod{10}\\). Is this a coincidence? Fermat's Little Theorem says no: for any \\(a\\) not divisible by 5 or 2, we have \\(a^4 \\equiv 1 \\pmod{10}\\) (because \\(\\phi(10) = 4\\)). The structure of modular arithmetic is not arbitrary; it is governed by deep number-theoretic laws.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-mod-calculator"></div>
<div class="viz-placeholder" data-viz="viz-zero-divisors"></div>
`,
            visualizations: [
                {
                    id: 'viz-mod-calculator',
                    title: 'Modular Calculator',
                    description: 'A full modular calculator. Enter \\(a\\), \\(b\\), and \\(n\\), then compute \\(a + b\\), \\(a \\times b\\), or \\(a^b\\) mod \\(n\\). Uses efficient repeated squaring for exponentiation.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 7, b = 100, n = 10;
                        var op = 'pow'; // 'add', 'mul', 'pow'

                        VizEngine.createSlider(controls, 'a', 0, 999, a, 1, function(v) {
                            a = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'b', 0, 999, b, 1, function(v) {
                            b = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'n (mod)', 2, 100, n, 1, function(v) {
                            n = Math.round(v); draw();
                        });
                        VizEngine.createButton(controls, 'a + b', function() { op = 'add'; draw(); });
                        VizEngine.createButton(controls, 'a * b', function() { op = 'mul'; draw(); });
                        VizEngine.createButton(controls, 'a ^ b', function() { op = 'pow'; draw(); });

                        function modpow(base, exp, mod) {
                            if (mod === 1) return 0;
                            var result = 1;
                            base = base % mod;
                            var steps = [];
                            var e = exp;
                            while (e > 0) {
                                if (e % 2 === 1) {
                                    result = (result * base) % mod;
                                    steps.push({bit: 1, base: base, result: result});
                                }
                                e = Math.floor(e / 2);
                                base = (base * base) % mod;
                            }
                            return {result: result, steps: steps};
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var opSymbol = op === 'add' ? '+' : op === 'mul' ? '\u00D7' : '^';
                            viz.screenText('Modular Calculator', 280, 25, viz.colors.white, 18);

                            // Show operation
                            var eqStr = a + ' ' + opSymbol + ' ' + b + ' mod ' + n;
                            viz.screenText(eqStr, 280, 70, viz.colors.teal, 16);

                            var result;
                            if (op === 'add') {
                                result = (a + b) % n;
                                viz.screenText('= ' + (a + b) + ' mod ' + n, 280, 110, viz.colors.text, 14);
                            } else if (op === 'mul') {
                                result = (a * b) % n;
                                viz.screenText('= ' + (a * b) + ' mod ' + n, 280, 110, viz.colors.text, 14);
                            } else {
                                var mp = modpow(a, b, n);
                                result = mp.result;

                                // Show binary exponentiation steps
                                viz.screenText('Repeated squaring:', 280, 110, viz.colors.text, 12);

                                var binaryB = b.toString(2);
                                viz.screenText('b = ' + b + ' = ' + binaryB + ' (binary)', 280, 135, viz.colors.text, 12);

                                // Show squaring chain
                                var base2 = a % n;
                                var yy = 160;
                                var stepNum = 0;
                                var exp2 = b;
                                var accum = 1;
                                var sqVal = a % n;
                                var maxSteps = Math.min(Math.ceil(Math.log2(b + 1)) + 1, 12);

                                var e2 = b;
                                var s2 = a % n;
                                var r2 = 1;
                                for (var si = 0; si < maxSteps && e2 > 0; si++) {
                                    var bitVal = e2 % 2;
                                    if (bitVal === 1) {
                                        r2 = (r2 * s2) % n;
                                        var stepText = 'bit=' + bitVal + ': result = result \\u00D7 ' + s2 + ' \\u2261 ' + r2 + ' (mod ' + n + ')';
                                    } else {
                                        var stepText = 'bit=' + bitVal + ': skip';
                                    }
                                    var col = si < 6 ? 180 : 400;
                                    var row = si < 6 ? si : si - 6;
                                    viz.screenText(stepText, col, yy + row * 18, bitVal ? viz.colors.orange : viz.colors.text + '88', 10, 'left');
                                    e2 = Math.floor(e2 / 2);
                                    s2 = (s2 * s2) % n;
                                }
                            }

                            // Display result
                            viz.screenText('\\u2261 ' + result + ' (mod ' + n + ')', 280, 290, viz.colors.green, 24);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-zero-divisors',
                    title: 'Zero Divisors Explorer',
                    description: 'The multiplication table mod \\(n\\) with zero divisors highlighted in red. Compare prime moduli (no red cells, excluding row/column 0) with composite moduli. An element \\(a\\) is a zero divisor if there exists \\(b \\ne 0\\) with \\(ab \\equiv 0\\).',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 480,
                            originX: 0, originY: 0, scale: 1
                        });

                        var n = 12;

                        VizEngine.createSlider(controls, 'n', 2, 16, n, 1, function(v) {
                            n = Math.round(v); draw();
                        });

                        function isPrime(k) {
                            if (k < 2) return false;
                            for (var i = 2; i * i <= k; i++) if (k % i === 0) return false;
                            return true;
                        }

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var prime = isPrime(n);
                            viz.screenText('Zero Divisors mod ' + n + (prime ? ' (prime, none!)' : ' (composite)'), 280, 18, viz.colors.white, 15);

                            // Identify zero divisors
                            var zd = {};
                            for (var aa = 1; aa < n; aa++) {
                                if (gcd(aa, n) > 1) zd[aa] = true;
                            }

                            var zdList = Object.keys(zd).map(Number);
                            if (zdList.length > 0) {
                                viz.screenText('Zero divisors: {' + zdList.join(', ') + '}', 280, 38, viz.colors.red, 12);
                            }

                            var cellSize = Math.min(32, Math.floor((viz.width - 60) / (n + 1)));
                            var tableW = (n + 1) * cellSize;
                            var startX = (viz.width - tableW) / 2;
                            var startY = 55;

                            for (var r = -1; r < n; r++) {
                                for (var c = -1; c < n; c++) {
                                    var px = startX + (c + 1) * cellSize;
                                    var py = startY + (r + 1) * cellSize;

                                    if (r === -1 && c === -1) {
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText('\u00D7', px + cellSize / 2, py + cellSize / 2);
                                    } else if (r === -1) {
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = zd[c] ? viz.colors.red : viz.colors.teal;
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(c.toString(), px + cellSize / 2, py + cellSize / 2);
                                    } else if (c === -1) {
                                        ctx.fillStyle = '#1a1a40';
                                        ctx.fillRect(px, py, cellSize, cellSize);
                                        ctx.fillStyle = zd[r] ? viz.colors.red : viz.colors.teal;
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(r.toString(), px + cellSize / 2, py + cellSize / 2);
                                    } else {
                                        var val = (r * c) % n;
                                        var isZD = (val === 0 && r !== 0 && c !== 0);

                                        if (isZD) {
                                            ctx.fillStyle = '#6b1515';
                                        } else if (r === 0 || c === 0) {
                                            ctx.fillStyle = '#0f0f25';
                                        } else {
                                            var hue = (val * 360 / n) % 360;
                                            var rgb = VizEngine.hslToRgb(hue / 360, 0.5, 0.2);
                                            ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                                        }
                                        ctx.fillRect(px, py, cellSize, cellSize);

                                        ctx.strokeStyle = '#333';
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(px, py, cellSize, cellSize);

                                        ctx.fillStyle = isZD ? viz.colors.red : viz.colors.white;
                                        ctx.font = (isZD ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(val.toString(), px + cellSize / 2, py + cellSize / 2);
                                    }
                                }
                            }

                            // Explanation
                            var legendY = startY + (n + 1) * cellSize + 12;
                            ctx.fillStyle = '#6b1515';
                            ctx.fillRect(130, legendY, 14, 14);
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 1;
                            ctx.strokeRect(130, legendY, 14, 14);
                            viz.screenText('ab \\u2261 0 (mod ' + n + ') with a,b \\u2260 0', 330, legendY + 7, viz.colors.red, 12);

                            viz.screenText(
                                prime ? 'No zero divisors! \\u2124/' + n + '\\u2124 is a field.' :
                                    'Zero divisors exist because ' + n + ' is composite.',
                                280, legendY + 30, prime ? viz.colors.green : viz.colors.orange, 12
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that if \\(p\\) is prime, then \\(ab \\equiv 0 \\pmod{p}\\) implies \\(a \\equiv 0\\) or \\(b \\equiv 0 \\pmod{p}\\).',
                    hint: '\\(ab \\equiv 0 \\pmod{p}\\) means \\(p \\mid ab\\). Since \\(p\\) is prime, use the fact that a prime dividing a product must divide one of the factors.',
                    solution: 'If \\(p \\mid ab\\) and \\(p\\) is prime, then by Euclid\'s lemma, \\(p \\mid a\\) or \\(p \\mid b\\). Therefore \\(a \\equiv 0 \\pmod{p}\\) or \\(b \\equiv 0 \\pmod{p}\\). This is why prime moduli have no zero divisors.'
                },
                {
                    question: 'Find all zero divisors modulo 15.',
                    hint: 'A nonzero element \\(a\\) is a zero divisor mod \\(n\\) if \\(\\gcd(a, n) > 1\\). Which elements in \\(\\{1, 2, \\ldots, 14\\}\\) share a common factor with 15?',
                    solution: '\\(15 = 3 \\times 5\\). The zero divisors are elements sharing a factor with 15: \\(\\{3, 5, 6, 9, 10, 12\\}\\). Check: \\(3 \\times 5 = 15 \\equiv 0\\), \\(6 \\times 5 = 30 \\equiv 0\\), \\(9 \\times 5 = 45 \\equiv 0\\), \\(10 \\times 3 = 30 \\equiv 0\\), \\(12 \\times 5 = 60 \\equiv 0 \\pmod{15}\\).'
                },
                {
                    question: 'Compute \\(7^{1000} \\bmod 13\\) using the fact that \\(7^{12} \\equiv 1 \\pmod{13}\\) (which follows from Fermat\'s Little Theorem, to be proved in Chapter 11).',
                    hint: 'Write \\(1000 = 12q + r\\). Find \\(q\\) and \\(r\\). Then \\(7^{1000} = (7^{12})^q \\cdot 7^r \\equiv 7^r\\).',
                    solution: '\\(1000 = 12 \\times 83 + 4\\). So \\(7^{1000} = (7^{12})^{83} \\cdot 7^4 \\equiv 1^{83} \\cdot 7^4 \\pmod{13}\\). Now \\(7^2 = 49 \\equiv 10 \\pmod{13}\\), \\(7^4 = 10^2 = 100 \\equiv 9 \\pmod{13}\\). Answer: \\(7^{1000} \\equiv 9 \\pmod{13}\\).'
                }
            ]
        }
    ]
});
