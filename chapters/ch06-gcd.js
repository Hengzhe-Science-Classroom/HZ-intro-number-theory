window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: 'Greatest Common Divisor',
    subtitle: 'The biggest number that divides both',
    sections: [
        // ================================================================
        // SECTION 1: Why GCD?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why GCD?',
            content: `
<h2>Why GCD?</h2>

<div class="env-block intuition">
    <div class="env-title">Sharing Equally</div>
    <div class="env-body">
        <p>You have 18 apples and 24 oranges, and you want to make identical gift bags with no fruit left over. Each bag must have the same number of apples and the same number of oranges. What is the largest number of bags you can make?</p>
        <p>The answer must divide both 18 and 24 evenly. The largest such number is 6: you make 6 bags, each with 3 apples and 4 oranges. This "largest common divisor" appears everywhere in mathematics, and it has a name.</p>
    </div>
</div>

<p>The greatest common divisor, or GCD, is one of the oldest and most fundamental concepts in number theory. It answers a simple question: given two positive integers, what is the <strong>largest</strong> number that divides both of them?</p>

<h3>Where GCD Shows Up</h3>

<p>GCD is not just an abstract curiosity. It appears naturally in several practical contexts:</p>

<ol>
    <li><strong>Simplifying fractions.</strong> To reduce \\(\\frac{12}{18}\\) to lowest terms, divide numerator and denominator by \\(\\gcd(12, 18) = 6\\) to get \\(\\frac{2}{3}\\).</li>
    <li><strong>Sharing and distribution.</strong> Splitting 36 red tiles and 48 blue tiles into identical groups requires \\(\\gcd(36, 48) = 12\\) groups.</li>
    <li><strong>Geometry.</strong> A \\(12 \\times 18\\) rectangle can be tiled perfectly by squares of side length \\(\\gcd(12, 18) = 6\\).</li>
    <li><strong>Music and rhythm.</strong> Two rhythmic patterns of lengths 8 and 12 beats synchronize every \\(\\text{lcm}(8,12) = 24\\) beats, and \\(\\text{lcm}\\) is computed via the GCD.</li>
</ol>

<p>In this chapter, we define the GCD precisely, learn three methods to compute it (listing factors, prime factorization, and the Euclidean algorithm previewed in a later chapter), and explore its applications.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The GCD appears in Euclid's <em>Elements</em> (Book VII, circa 300 BCE), where Euclid describes an efficient algorithm for computing it. This "Euclidean algorithm" is one of the oldest known algorithms still in use today, and we will study it in detail in the next chapter.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-common-factors',
                    title: 'Common Factors: Two Sets Meet',
                    description: 'See all the factors of two numbers displayed as sets. The common factors are highlighted, and the greatest one is the GCD.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 18, b = 24;

                        VizEngine.createSlider(controls, 'a', 2, 60, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 60, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function getFactors(n) {
                            var factors = [];
                            for (var i = 1; i <= n; i++) {
                                if (n % i === 0) factors.push(i);
                            }
                            return factors;
                        }

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            var factorsA = getFactors(a);
                            var factorsB = getFactors(b);
                            var g = gcd(a, b);
                            var common = factorsA.filter(function(f) { return b % f === 0; });

                            // Title
                            viz.screenText('Factors of ' + a + ' and ' + b, viz.width / 2, 22, viz.colors.white, 15);

                            // Layout: two rows of factor "chips"
                            var chipH = 26;
                            var chipPad = 4;

                            // Row for factors of a
                            var rowAY = 70;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Factors of ' + a + ':', 20, rowAY - 15);

                            var chipW = Math.min(42, (viz.width - 60) / factorsA.length - chipPad);
                            var totalWA = factorsA.length * (chipW + chipPad);
                            var startXA = (viz.width - totalWA) / 2;

                            for (var i = 0; i < factorsA.length; i++) {
                                var f = factorsA[i];
                                var isCommon = b % f === 0;
                                var isGCD = f === g;
                                var cx = startXA + i * (chipW + chipPad);

                                ctx.fillStyle = isGCD ? viz.colors.green + 'cc' :
                                                isCommon ? viz.colors.teal + '88' : viz.colors.blue + '44';
                                ctx.beginPath();
                                ctx.roundRect(cx, rowAY, chipW, chipH, 4);
                                ctx.fill();

                                if (isGCD) {
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.roundRect(cx, rowAY, chipW, chipH, 4);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = isCommon ? viz.colors.white : viz.colors.text;
                                ctx.font = (isGCD ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(f, cx + chipW / 2, rowAY + chipH / 2);
                            }

                            // Row for factors of b
                            var rowBY = 130;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Factors of ' + b + ':', 20, rowBY - 15);

                            chipW = Math.min(42, (viz.width - 60) / factorsB.length - chipPad);
                            var totalWB = factorsB.length * (chipW + chipPad);
                            var startXB = (viz.width - totalWB) / 2;

                            for (var j = 0; j < factorsB.length; j++) {
                                var fb = factorsB[j];
                                var isCommonB = a % fb === 0;
                                var isGCDB = fb === g;
                                var cxB = startXB + j * (chipW + chipPad);

                                ctx.fillStyle = isGCDB ? viz.colors.green + 'cc' :
                                                isCommonB ? viz.colors.teal + '88' : viz.colors.orange + '44';
                                ctx.beginPath();
                                ctx.roundRect(cxB, rowBY, chipW, chipH, 4);
                                ctx.fill();

                                if (isGCDB) {
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.roundRect(cxB, rowBY, chipW, chipH, 4);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = isCommonB ? viz.colors.white : viz.colors.text;
                                ctx.font = (isGCDB ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(fb, cxB + chipW / 2, rowBY + chipH / 2);
                            }

                            // Common factors row
                            var rowCY = 200;
                            ctx.fillStyle = viz.colors.teal;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Common factors:', 20, rowCY - 15);

                            chipW = Math.min(42, (viz.width - 60) / Math.max(common.length, 1) - chipPad);
                            var totalWC = common.length * (chipW + chipPad);
                            var startXC = (viz.width - totalWC) / 2;

                            for (var k = 0; k < common.length; k++) {
                                var fc = common[k];
                                var isG = fc === g;
                                var cxC = startXC + k * (chipW + chipPad);

                                ctx.fillStyle = isG ? viz.colors.green + 'cc' : viz.colors.teal + '66';
                                ctx.beginPath();
                                ctx.roundRect(cxC, rowCY, chipW, chipH, 4);
                                ctx.fill();

                                if (isG) {
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 2.5;
                                    ctx.beginPath();
                                    ctx.roundRect(cxC, rowCY, chipW, chipH, 4);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = (isG ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(fc, cxC + chipW / 2, rowCY + chipH / 2);
                            }

                            // Result
                            viz.screenText('gcd(' + a + ', ' + b + ') = ' + g, viz.width / 2, 270, viz.colors.green, 18);

                            // Legend
                            var legY = 310;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            ctx.fillStyle = viz.colors.teal + '88';
                            ctx.fillRect(viz.width / 2 - 140, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Common factor', viz.width / 2 - 124, legY + 10);

                            ctx.fillStyle = viz.colors.green + 'cc';
                            ctx.fillRect(viz.width / 2 + 20, legY, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('GCD (greatest)', viz.width / 2 + 36, legY + 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'You have 36 red marbles and 48 blue marbles. You want to divide them into identical groups with no marbles left over. What is the maximum number of groups you can make, and how many of each color goes into each group?',
                    hint: 'The number of groups must divide both 36 and 48. The maximum such number is their GCD.',
                    solution: '\\(\\gcd(36, 48) = 12\\). You can make 12 groups, each containing \\(36/12 = 3\\) red marbles and \\(48/12 = 4\\) blue marbles.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: What Is GCD?
        // ================================================================
        {
            id: 'sec-definition',
            title: 'What Is GCD?',
            content: `
<h2>What Is GCD?</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Common Divisor)</div>
    <div class="env-body">
        <p>An integer \\(d\\) is a <strong>common divisor</strong> of integers \\(a\\) and \\(b\\) if \\(d \\mid a\\) and \\(d \\mid b\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Greatest Common Divisor)</div>
    <div class="env-body">
        <p>Let \\(a\\) and \\(b\\) be integers, not both zero. The <strong>greatest common divisor</strong> of \\(a\\) and \\(b\\), denoted \\(\\gcd(a, b)\\), is the largest positive integer \\(d\\) such that \\(d \\mid a\\) and \\(d \\mid b\\).</p>
    </div>
</div>

<p>Some immediate observations from the definition:</p>

<ul>
    <li>\\(\\gcd(a, b) \\geq 1\\), since 1 divides every integer.</li>
    <li>\\(\\gcd(a, b) \\leq \\min(|a|, |b|)\\), since no divisor can exceed the number itself (in absolute value).</li>
    <li>\\(\\gcd(a, 0) = |a|\\) for any nonzero \\(a\\), since every integer divides 0.</li>
    <li>\\(\\gcd(a, b) = \\gcd(b, a)\\): the order does not matter.</li>
    <li>\\(\\gcd(a, b) = \\gcd(|a|, |b|)\\): only the absolute values matter.</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>\\(\\gcd(12, 18)\\): The divisors of 12 are \\(\\{1, 2, 3, 4, 6, 12\\}\\). The divisors of 18 are \\(\\{1, 2, 3, 6, 9, 18\\}\\). The common divisors are \\(\\{1, 2, 3, 6\\}\\), so \\(\\gcd(12, 18) = 6\\).</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Coprime / Relatively Prime)</div>
    <div class="env-body">
        <p>Two integers \\(a\\) and \\(b\\) are <strong>coprime</strong> (or <strong>relatively prime</strong>) if \\(\\gcd(a, b) = 1\\). This means they share no common factor other than 1.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>\\(\\gcd(8, 15) = 1\\), so 8 and 15 are coprime. Note that neither 8 nor 15 is prime, yet they share no common factor. Being coprime is about the <em>relationship</em> between two numbers, not about whether either number is prime on its own.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Proposition 6.1</div>
    <div class="env-body">
        <p>For any positive integer \\(n\\), \\(\\gcd(n, n+1) = 1\\). That is, consecutive integers are always coprime.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(d = \\gcd(n, n+1)\\). Then \\(d \\mid n\\) and \\(d \\mid (n+1)\\). By the linearity of divisibility, \\(d \\mid (n+1) - n = 1\\). Since \\(d\\) is a positive integer dividing 1, we must have \\(d = 1\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="viz-placeholder" data-viz="viz-gcd-venn"></div>
`,
            visualizations: [
                {
                    id: 'viz-gcd-venn',
                    title: 'Prime Factorization Venn Diagram',
                    description: 'See the prime factorizations of two numbers as a Venn diagram. Shared prime factors (the intersection) give the GCD; all prime factors together (the union) give the LCM.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 12, b = 18;

                        VizEngine.createSlider(controls, 'a', 2, 60, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 60, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) {
                                    factors[d] = (factors[d] || 0) + 1;
                                    n = n / d;
                                }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n] || 0) + 1;
                            return factors;
                        }

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function factorStr(factors) {
                            var keys = Object.keys(factors).map(Number).sort(function(a, b) { return a - b; });
                            var parts = [];
                            for (var i = 0; i < keys.length; i++) {
                                var p = keys[i];
                                if (factors[p] === 1) parts.push(p.toString());
                                else parts.push(p + '^' + factors[p]);
                            }
                            return parts.join(' * ');
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(a, b);

                            var facA = factorize(a);
                            var facB = factorize(b);
                            var facG = factorize(g);
                            var lcmVal = a * b / g;

                            viz.screenText('Prime Factorization Venn Diagram', viz.width / 2, 22, viz.colors.white, 14);

                            // Draw two overlapping ellipses
                            var cx1 = viz.width / 2 - 80;
                            var cx2 = viz.width / 2 + 80;
                            var cy = 180;
                            var rx = 140, ry = 100;

                            // Left ellipse (a)
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(cx1, cy, rx, ry, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.blue + '11';
                            ctx.fill();

                            // Right ellipse (b)
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(cx2, cy, rx, ry, 0, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.orange + '11';
                            ctx.fill();

                            // Labels
                            viz.screenText(a.toString(), cx1 - 60, cy - ry - 12, viz.colors.blue, 14);
                            viz.screenText(b.toString(), cx2 + 60, cy - ry - 12, viz.colors.orange, 14);

                            // Build prime factor lists for each region
                            var allPrimes = {};
                            var keysA = Object.keys(facA).map(Number);
                            var keysB = Object.keys(facB).map(Number);
                            for (var i = 0; i < keysA.length; i++) allPrimes[keysA[i]] = true;
                            for (var j = 0; j < keysB.length; j++) allPrimes[keysB[j]] = true;
                            var primes = Object.keys(allPrimes).map(Number).sort(function(a, b) { return a - b; });

                            // Left only, shared, right only
                            var leftOnly = [];
                            var shared = [];
                            var rightOnly = [];

                            for (var pi = 0; pi < primes.length; pi++) {
                                var p = primes[pi];
                                var ea = facA[p] || 0;
                                var eb = facB[p] || 0;
                                var eMin = Math.min(ea, eb);

                                // Shared part
                                for (var s = 0; s < eMin; s++) shared.push(p);
                                // Left only
                                for (var la = 0; la < ea - eMin; la++) leftOnly.push(p);
                                // Right only
                                for (var ra = 0; ra < eb - eMin; ra++) rightOnly.push(p);
                            }

                            // Render factor chips
                            function drawChips(arr, centerX, centerY, color) {
                                if (arr.length === 0) return;
                                var chipSize = Math.min(28, 120 / Math.ceil(Math.sqrt(arr.length)));
                                var cols = Math.ceil(Math.sqrt(arr.length));
                                var rows = Math.ceil(arr.length / cols);
                                var totalW = cols * (chipSize + 3);
                                var totalH = rows * (chipSize + 3);
                                var sx = centerX - totalW / 2;
                                var sy = centerY - totalH / 2;

                                for (var ci = 0; ci < arr.length; ci++) {
                                    var col = ci % cols;
                                    var row = Math.floor(ci / cols);
                                    var cx = sx + col * (chipSize + 3);
                                    var cy2 = sy + row * (chipSize + 3);

                                    ctx.fillStyle = color + '66';
                                    ctx.beginPath();
                                    ctx.roundRect(cx, cy2, chipSize, chipSize, 3);
                                    ctx.fill();

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = Math.min(14, chipSize - 6) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(arr[ci], cx + chipSize / 2, cy2 + chipSize / 2);
                                }
                            }

                            drawChips(leftOnly, cx1 - 50, cy, viz.colors.blue);
                            drawChips(shared, viz.width / 2, cy, viz.colors.green);
                            drawChips(rightOnly, cx2 + 50, cy, viz.colors.orange);

                            // Region labels
                            if (leftOnly.length > 0) {
                                viz.screenText('only in ' + a, cx1 - 50, cy + ry - 20, viz.colors.blue, 9);
                            }
                            if (rightOnly.length > 0) {
                                viz.screenText('only in ' + b, cx2 + 50, cy + ry - 20, viz.colors.orange, 9);
                            }
                            if (shared.length > 0) {
                                viz.screenText('shared', viz.width / 2, cy + ry - 20, viz.colors.green, 9);
                            }

                            // Bottom info
                            viz.screenText(a + ' = ' + factorStr(facA), viz.width / 2, cy + ry + 20, viz.colors.blue, 12);
                            viz.screenText(b + ' = ' + factorStr(facB), viz.width / 2, cy + ry + 38, viz.colors.orange, 12);
                            viz.screenText('gcd = ' + g + '  (shared primes)', viz.width / 2 - 80, cy + ry + 60, viz.colors.green, 13);
                            viz.screenText('lcm = ' + lcmVal + '  (all primes)', viz.width / 2 + 80, cy + ry + 60, viz.colors.purple, 13);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(\\gcd(28, 42)\\) by listing all divisors of each number.',
                    hint: 'The divisors of 28 are 1, 2, 4, 7, 14, 28. List the divisors of 42 and find the largest number in both lists.',
                    solution: 'Divisors of 28: \\(\\{1, 2, 4, 7, 14, 28\\}\\). Divisors of 42: \\(\\{1, 2, 3, 6, 7, 14, 21, 42\\}\\). Common divisors: \\(\\{1, 2, 7, 14\\}\\). Therefore \\(\\gcd(28, 42) = 14\\).'
                },
                {
                    question: 'True or false: if \\(a\\) and \\(b\\) are both even, then \\(\\gcd(a, b) \\geq 2\\). Justify your answer.',
                    hint: 'If both are even, what number definitely divides both?',
                    solution: 'True. If \\(a\\) and \\(b\\) are both even, then \\(2 \\mid a\\) and \\(2 \\mid b\\), so 2 is a common divisor. Since \\(\\gcd(a,b)\\) is the greatest common divisor, \\(\\gcd(a,b) \\geq 2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Finding GCD by Listing
        // ================================================================
        {
            id: 'sec-listing',
            title: 'Finding GCD by Listing',
            content: `
<h2>Finding GCD by Listing Factors</h2>

<p>The most straightforward method to find \\(\\gcd(a, b)\\) is brute force: list all positive divisors of \\(a\\), list all positive divisors of \\(b\\), find the common ones, and take the largest.</p>

<div class="env-block example">
    <div class="env-title">Example: \\(\\gcd(30, 45)\\)</div>
    <div class="env-body">
        <p><strong>Step 1.</strong> Divisors of 30: \\(1, 2, 3, 5, 6, 10, 15, 30\\).</p>
        <p><strong>Step 2.</strong> Divisors of 45: \\(1, 3, 5, 9, 15, 45\\).</p>
        <p><strong>Step 3.</strong> Common divisors: \\(1, 3, 5, 15\\).</p>
        <p><strong>Step 4.</strong> Greatest: \\(\\gcd(30, 45) = 15\\).</p>
    </div>
</div>

<p>This method works perfectly for small numbers, but it has a serious limitation: to find all divisors of \\(n\\), you need to check all integers from 1 to \\(n\\) (or at least up to \\(\\sqrt{n}\\)). For numbers with hundreds of digits (as in modern cryptography), this is completely infeasible.</p>

<div class="env-block remark">
    <div class="env-title">Efficiency</div>
    <div class="env-body">
        <p>Listing factors requires \\(O(\\sqrt{n})\\) trial divisions per number. For \\(n\\) with \\(d\\) digits, \\(\\sqrt{n}\\) has about \\(d/2\\) digits, so the work grows exponentially with the number of digits. The Euclidean algorithm (next chapter) runs in \\(O(d^2)\\) digit operations, which is dramatically faster.</p>
    </div>
</div>

<h3>Organizing the Work</h3>

<p>A systematic approach avoids missing factors. For each candidate \\(d\\) from 1 up to \\(\\sqrt{n}\\), if \\(d \\mid n\\) then both \\(d\\) and \\(n/d\\) are factors:</p>

<div class="env-block example">
    <div class="env-title">Example: Factors of 36</div>
    <div class="env-body">
        <p>We check \\(d = 1, 2, 3, 4, 5, 6\\) (since \\(\\sqrt{36} = 6\\)):</p>
        <ul>
            <li>\\(36 / 1 = 36\\) so \\(\\{1, 36\\}\\)</li>
            <li>\\(36 / 2 = 18\\) so \\(\\{2, 18\\}\\)</li>
            <li>\\(36 / 3 = 12\\) so \\(\\{3, 12\\}\\)</li>
            <li>\\(36 / 4 = 9\\) so \\(\\{4, 9\\}\\)</li>
            <li>\\(36 / 5\\) is not an integer, skip</li>
            <li>\\(36 / 6 = 6\\) so \\(\\{6\\}\\) (perfect square, count once)</li>
        </ul>
        <p>All factors: \\(1, 2, 3, 4, 6, 9, 12, 18, 36\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-fraction-simplifier"></div>
`,
            visualizations: [
                {
                    id: 'viz-fraction-simplifier',
                    title: 'Fraction Simplifier',
                    description: 'Watch a fraction get simplified step by step by dividing both numerator and denominator by their GCD.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var num = 24, den = 36;
                        var animating = false;
                        var animStep = 0;
                        var animTimer = null;

                        VizEngine.createSlider(controls, 'Numerator', 1, 120, num, 1, function(v) {
                            num = Math.round(v);
                            animStep = 0;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Denominator', 1, 120, den, 1, function(v) {
                            den = Math.round(v);
                            animStep = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Simplify', function() {
                            if (animating) return;
                            animStep = 0;
                            animating = true;
                            function tick() {
                                animStep++;
                                draw();
                                if (animStep < 3) {
                                    animTimer = setTimeout(tick, 900);
                                } else {
                                    animating = false;
                                }
                            }
                            tick();
                        });

                        function gcd(x, y) {
                            x = Math.abs(x); y = Math.abs(y);
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(num, den);
                            var sNum = num / g;
                            var sDen = den / g;

                            viz.screenText('Simplifying Fractions with GCD', viz.width / 2, 25, viz.colors.white, 15);

                            // Original fraction
                            var fracX = 130;
                            var fracY = 120;

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 40px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(num.toString(), fracX, fracY - 5);
                            ctx.textBaseline = 'top';
                            ctx.fillText(den.toString(), fracX, fracY + 5);
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(fracX - 40, fracY);
                            ctx.lineTo(fracX + 40, fracY);
                            ctx.stroke();

                            if (g === 1) {
                                viz.screenText('Already in lowest terms!', viz.width / 2, 200, viz.colors.green, 16);
                                viz.screenText('gcd(' + num + ', ' + den + ') = 1', viz.width / 2, 230, viz.colors.teal, 13);
                                return;
                            }

                            // Arrow
                            if (animStep >= 1) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(fracX + 55, fracY);
                                ctx.lineTo(fracX + 120, fracY);
                                ctx.stroke();
                                // arrowhead
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(fracX + 120, fracY);
                                ctx.lineTo(fracX + 112, fracY - 6);
                                ctx.lineTo(fracX + 112, fracY + 6);
                                ctx.closePath();
                                ctx.fill();

                                // Division annotation
                                viz.screenText('\u00F7 ' + g, fracX + 88, fracY - 30, viz.colors.teal, 14);
                                viz.screenText('\u00F7 ' + g, fracX + 88, fracY + 30, viz.colors.teal, 14);
                            }

                            // Intermediate
                            if (animStep >= 2) {
                                var midX = fracX + 170;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 40px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(num + ' \u00F7 ' + g, midX + 30, fracY - 5);
                                ctx.textBaseline = 'top';
                                ctx.fillText(den + ' \u00F7 ' + g, midX + 30, fracY + 5);
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 3;
                                var lineW = Math.max(60, (num + ' \u00F7 ' + g).length * 14);
                                ctx.beginPath();
                                ctx.moveTo(midX + 30 - lineW / 2, fracY);
                                ctx.lineTo(midX + 30 + lineW / 2, fracY);
                                ctx.stroke();
                            }

                            // Result
                            if (animStep >= 3) {
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                var arrowStart = fracX + 320;
                                ctx.beginPath();
                                ctx.moveTo(arrowStart, fracY);
                                ctx.lineTo(arrowStart + 50, fracY);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(arrowStart + 50, fracY);
                                ctx.lineTo(arrowStart + 42, fracY - 6);
                                ctx.lineTo(arrowStart + 42, fracY + 6);
                                ctx.closePath();
                                ctx.fill();

                                var resX = arrowStart + 90;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 44px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(sNum.toString(), resX, fracY - 5);
                                ctx.textBaseline = 'top';
                                ctx.fillText(sDen.toString(), resX, fracY + 5);
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(resX - 35, fracY);
                                ctx.lineTo(resX + 35, fracY);
                                ctx.stroke();
                            }

                            // GCD info at bottom
                            viz.screenText('gcd(' + num + ', ' + den + ') = ' + g, viz.width / 2, 230, viz.colors.teal, 14);

                            if (animStep >= 3) {
                                viz.screenText(
                                    num + '/' + den + ' = ' + sNum + '/' + sDen + '  (lowest terms)',
                                    viz.width / 2, 265, viz.colors.green, 14
                                );
                            }

                            // Visual: fraction as shaded bar
                            var barY = 300;
                            var barW = 400;
                            var barH = 30;
                            var barX = (viz.width - barW) / 2;

                            // Original fraction bar
                            ctx.fillStyle = viz.colors.blue + '44';
                            ctx.fillRect(barX, barY, barW, barH);
                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(barX, barY, barW * num / den, barH);
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(barX, barY, barW, barH);

                            viz.screenText(num + '/' + den + (animStep >= 3 ? ' = ' + sNum + '/' + sDen : ''),
                                viz.width / 2, barY + barH + 15, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(\\gcd(54, 72)\\) by listing all factors of each number.',
                    hint: 'To find factors efficiently, check divisors up to \\(\\sqrt{72} \\approx 8.5\\).',
                    solution: 'Factors of 54: \\(\\{1, 2, 3, 6, 9, 18, 27, 54\\}\\). Factors of 72: \\(\\{1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72\\}\\). Common: \\(\\{1, 2, 3, 6, 9, 18\\}\\). Therefore \\(\\gcd(54, 72) = 18\\).'
                },
                {
                    question: 'Reduce \\(\\frac{84}{126}\\) to lowest terms.',
                    hint: 'Find \\(\\gcd(84, 126)\\) and divide both by it.',
                    solution: '\\(\\gcd(84, 126) = 42\\). So \\(\\frac{84}{126} = \\frac{84 \\div 42}{126 \\div 42} = \\frac{2}{3}\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: GCD from Prime Factorization
        // ================================================================
        {
            id: 'sec-prime-method',
            title: 'GCD from Prime Factorization',
            content: `
<h2>GCD from Prime Factorization</h2>

<p>The Fundamental Theorem of Arithmetic guarantees that every integer greater than 1 has a unique prime factorization. This gives us an elegant formula for the GCD.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.2 (GCD via Prime Factorization)</div>
    <div class="env-body">
        <p>Let \\(a = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}\\) and \\(b = p_1^{b_1} p_2^{b_2} \\cdots p_k^{b_k}\\), where the \\(p_i\\) are all the primes appearing in either factorization (with exponent 0 for primes not present). Then:</p>
        \\[\\gcd(a, b) = p_1^{\\min(a_1, b_1)} \\, p_2^{\\min(a_2, b_2)} \\cdots p_k^{\\min(a_k, b_k)}.\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Let \\(d = p_1^{c_1} \\cdots p_k^{c_k}\\). Then \\(d \\mid a\\) if and only if \\(c_i \\leq a_i\\) for all \\(i\\), and \\(d \\mid b\\) if and only if \\(c_i \\leq b_i\\) for all \\(i\\). So \\(d\\) is a common divisor precisely when \\(c_i \\leq \\min(a_i, b_i)\\) for all \\(i\\). The largest such \\(d\\) takes \\(c_i = \\min(a_i, b_i)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(\\gcd(360, 756)\\)</div>
    <div class="env-body">
        <p>\\(360 = 2^3 \\cdot 3^2 \\cdot 5^1\\) and \\(756 = 2^2 \\cdot 3^3 \\cdot 7^1\\).</p>
        <p>Take the minimum exponent for each prime:</p>
        <ul>
            <li>For 2: \\(\\min(3, 2) = 2\\)</li>
            <li>For 3: \\(\\min(2, 3) = 2\\)</li>
            <li>For 5: \\(\\min(1, 0) = 0\\)</li>
            <li>For 7: \\(\\min(0, 1) = 0\\)</li>
        </ul>
        <p>So \\(\\gcd(360, 756) = 2^2 \\cdot 3^2 = 36\\).</p>
    </div>
</div>

<h3>LCM from Prime Factorization</h3>

<p>The same idea gives the least common multiple: take <em>maximum</em> exponents instead of minimum.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.3 (LCM via Prime Factorization)</div>
    <div class="env-body">
        <p>With the same notation as above:</p>
        \\[\\text{lcm}(a, b) = p_1^{\\max(a_1, b_1)} \\, p_2^{\\max(a_2, b_2)} \\cdots p_k^{\\max(a_k, b_k)}.\\]
    </div>
</div>

<div class="env-block corollary">
    <div class="env-title">Corollary (GCD-LCM Product Identity)</div>
    <div class="env-body">
        <p>For any positive integers \\(a\\) and \\(b\\):</p>
        \\[\\gcd(a, b) \\cdot \\text{lcm}(a, b) = a \\cdot b.\\]
        <p>This follows because \\(\\min(x,y) + \\max(x,y) = x + y\\) for all real numbers \\(x, y\\).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-rectangle-cutting"></div>
`,
            visualizations: [
                {
                    id: 'viz-rectangle-cutting',
                    title: 'Rectangle Cutting: GCD as Largest Square',
                    description: 'A rectangle of dimensions a x b can be tiled perfectly by squares of side gcd(a,b). Watch the cutting process reveal the GCD geometrically.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 18, b = 12;

                        VizEngine.createSlider(controls, 'Width', 2, 30, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Height', 2, 30, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        var tileColors = ['#58a6ff44', '#3fb9a044', '#f0883e44', '#bc8cff44', '#3fb95044', '#f7814944'];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(a, b);

                            viz.screenText('Tiling a ' + a + ' \u00D7 ' + b + ' Rectangle with Squares of Side ' + g,
                                viz.width / 2, 22, viz.colors.white, 14);

                            // Scale to fit
                            var maxDrawW = viz.width - 80;
                            var maxDrawH = viz.height - 100;
                            var scale = Math.min(maxDrawW / a, maxDrawH / b);
                            var drawW = a * scale;
                            var drawH = b * scale;
                            var ox = (viz.width - drawW) / 2;
                            var oy = 50;

                            // Draw outer rectangle
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(ox, oy, drawW, drawH);

                            // Draw grid of squares
                            var cols = a / g;
                            var rows = b / g;
                            var sqSize = g * scale;

                            var colorIdx = 0;
                            for (var r = 0; r < rows; r++) {
                                for (var c = 0; c < cols; c++) {
                                    var sx = ox + c * sqSize;
                                    var sy = oy + r * sqSize;

                                    ctx.fillStyle = tileColors[colorIdx % tileColors.length];
                                    ctx.fillRect(sx + 1, sy + 1, sqSize - 2, sqSize - 2);

                                    ctx.strokeStyle = viz.colors.teal;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(sx, sy, sqSize, sqSize);

                                    // Label each square if large enough
                                    if (sqSize > 30) {
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.font = Math.min(12, sqSize / 3) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(g + '\u00D7' + g, sx + sqSize / 2, sy + sqSize / 2);
                                    }

                                    colorIdx++;
                                }
                            }

                            // Dimension labels
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(a.toString(), ox + drawW / 2, oy + drawH + 8);

                            ctx.save();
                            ctx.translate(ox - 12, oy + drawH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(b.toString(), 0, 0);
                            ctx.restore();

                            // Info
                            viz.screenText(
                                cols + ' \u00D7 ' + rows + ' = ' + (cols * rows) + ' squares of side ' + g,
                                viz.width / 2, oy + drawH + 35, viz.colors.teal, 13
                            );
                            viz.screenText(
                                'gcd(' + a + ', ' + b + ') = ' + g,
                                viz.width / 2, oy + drawH + 55, viz.colors.green, 14
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use prime factorization to find \\(\\gcd(180, 252)\\).',
                    hint: 'Factor each: \\(180 = 2^2 \\cdot 3^2 \\cdot 5\\), \\(252 = 2^2 \\cdot 3^2 \\cdot 7\\). Take minimum exponents.',
                    solution: '\\(180 = 2^2 \\cdot 3^2 \\cdot 5\\) and \\(252 = 2^2 \\cdot 3^2 \\cdot 7\\). Taking minimum exponents: \\(2^{\\min(2,2)} \\cdot 3^{\\min(2,2)} \\cdot 5^{\\min(1,0)} \\cdot 7^{\\min(0,1)} = 2^2 \\cdot 3^2 = 36\\).'
                },
                {
                    question: 'Find \\(\\text{lcm}(180, 252)\\) using the GCD-LCM product identity.',
                    hint: 'Use \\(\\text{lcm}(a,b) = \\frac{a \\cdot b}{\\gcd(a,b)}\\) with the GCD from the previous exercise.',
                    solution: '\\(\\text{lcm}(180, 252) = \\frac{180 \\times 252}{\\gcd(180, 252)} = \\frac{45{,}360}{36} = 1{,}260\\). Check: \\(1260 = 2^2 \\cdot 3^2 \\cdot 5 \\cdot 7\\), which has \\(\\max\\) exponents for each prime.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Applications
        // ================================================================
        {
            id: 'sec-applications',
            title: 'Applications',
            content: `
<h2>Applications of GCD</h2>

<h3>Simplifying Fractions</h3>

<p>A fraction \\(\\frac{a}{b}\\) is in <strong>lowest terms</strong> (or <strong>reduced form</strong>) when \\(\\gcd(a, b) = 1\\). To reduce any fraction:</p>

\\[\\frac{a}{b} = \\frac{a / \\gcd(a,b)}{b / \\gcd(a,b)}.\\]

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Reduce \\(\\frac{105}{135}\\). Since \\(\\gcd(105, 135) = 15\\):</p>
        \\[\\frac{105}{135} = \\frac{105 \\div 15}{135 \\div 15} = \\frac{7}{9}.\\]
    </div>
</div>

<h3>Cutting Rectangles into Squares</h3>

<p>A rectangle with integer dimensions \\(a \\times b\\) can be perfectly tiled by identical squares. The largest possible square has side length \\(\\gcd(a, b)\\), and you need \\(\\frac{a}{\\gcd(a,b)} \\times \\frac{b}{\\gcd(a,b)}\\) such squares.</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>A floor is \\(24 \\times 36\\) feet. The largest square tile that fits perfectly has side \\(\\gcd(24, 36) = 12\\) feet, requiring \\(2 \\times 3 = 6\\) tiles.</p>
    </div>
</div>

<h3>The GCD and Linear Combinations</h3>

<p>A deep and surprising fact (which we will prove using the Euclidean algorithm in the next chapter) is that the GCD can always be written as a linear combination of the original numbers.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 6.4 (Bezout's Identity, preview)</div>
    <div class="env-body">
        <p>For any integers \\(a\\) and \\(b\\), not both zero, there exist integers \\(x\\) and \\(y\\) such that</p>
        \\[\\gcd(a, b) = ax + by.\\]
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>\\(\\gcd(12, 8) = 4\\). And indeed \\(4 = 12 \\cdot 1 + 8 \\cdot (-1)\\). Also \\(4 = 12 \\cdot (-1) + 8 \\cdot 2\\). The integers \\(x, y\\) are not unique, but such a pair always exists.</p>
    </div>
</div>

<h3>GCD and Coprimality in Number Theory</h3>

<p>Being coprime has powerful consequences. Here is a taste:</p>

<div class="env-block theorem">
    <div class="env-title">Proposition 6.5 (Euclid's Lemma, preview)</div>
    <div class="env-body">
        <p>If \\(a \\mid bc\\) and \\(\\gcd(a, b) = 1\\), then \\(a \\mid c\\).</p>
    </div>
</div>

<p>In words: if \\(a\\) divides a product \\(bc\\) and shares no factor with \\(b\\), then \\(a\\) must divide \\(c\\). This seemingly simple statement is the key to proving that prime factorization is unique.</p>

<div class="viz-placeholder" data-viz="viz-gcd-explorer"></div>
`,
            visualizations: [
                {
                    id: 'viz-gcd-explorer',
                    title: 'GCD Explorer: Three Methods Side by Side',
                    description: 'Enter two numbers and see the GCD computed by listing common factors, by prime factorization (minimum exponents), and by the Euclidean algorithm.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 48, b = 36;

                        VizEngine.createSlider(controls, 'a', 2, 120, a, 1, function(v) {
                            a = Math.round(v);
                            draw();
                        });
                        VizEngine.createSlider(controls, 'b', 2, 120, b, 1, function(v) {
                            b = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function getFactors(n) {
                            var f = [];
                            for (var i = 1; i <= n; i++) if (n % i === 0) f.push(i);
                            return f;
                        }

                        function factorize(n) {
                            var factors = {};
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { factors[d] = (factors[d] || 0) + 1; n = n / d; }
                                d++;
                            }
                            if (n > 1) factors[n] = (factors[n] || 0) + 1;
                            return factors;
                        }

                        function euclidSteps(x, y) {
                            var steps = [];
                            while (y) {
                                var q = Math.floor(x / y);
                                var r = x % y;
                                steps.push({ a: x, b: y, q: q, r: r });
                                x = y; y = r;
                            }
                            return steps;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var g = gcd(a, b);

                            viz.screenText('gcd(' + a + ', ' + b + ') = ' + g, viz.width / 2, 22, viz.colors.green, 16);

                            // Method 1: Listing
                            var col1X = 30;
                            var headerY = 50;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Method 1: Listing', col1X, headerY);

                            var fA = getFactors(a);
                            var fB = getFactors(b);
                            var common = fA.filter(function(f) { return b % f === 0; });

                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillStyle = viz.colors.text;
                            var y1 = headerY + 18;

                            var fAStr = fA.length <= 12 ? fA.join(', ') : fA.slice(0, 10).join(', ') + '...';
                            var fBStr = fB.length <= 12 ? fB.join(', ') : fB.slice(0, 10).join(', ') + '...';
                            ctx.fillText('F(' + a + '): ' + fAStr, col1X, y1);
                            ctx.fillText('F(' + b + '): ' + fBStr, col1X, y1 + 14);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillText('Common: ' + common.join(', '), col1X, y1 + 28);
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('max = ' + g, col1X, y1 + 42);

                            // Method 2: Prime factorization
                            var col2X = 30;
                            var h2Y = y1 + 70;
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText('Method 2: Prime Factorization', col2X, h2Y);

                            var facA = factorize(a);
                            var facB = factorize(b);
                            var allPrimes = {};
                            Object.keys(facA).forEach(function(p) { allPrimes[p] = true; });
                            Object.keys(facB).forEach(function(p) { allPrimes[p] = true; });
                            var primes = Object.keys(allPrimes).map(Number).sort(function(a, b) { return a - b; });

                            ctx.font = '10px -apple-system,sans-serif';
                            var y2 = h2Y + 18;

                            // Table header
                            var tableX = col2X + 10;
                            var colW = Math.min(45, (viz.width / 2 - 60) / (primes.length + 1));

                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('p', tableX, y2);
                            for (var pi = 0; pi < primes.length; pi++) {
                                ctx.fillText(primes[pi].toString(), tableX + (pi + 1) * colW, y2);
                            }

                            // Row for a
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText(a.toString(), tableX, y2 + 14);
                            for (var pj = 0; pj < primes.length; pj++) {
                                ctx.fillText((facA[primes[pj]] || 0).toString(), tableX + (pj + 1) * colW, y2 + 14);
                            }

                            // Row for b
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText(b.toString(), tableX, y2 + 28);
                            for (var pk = 0; pk < primes.length; pk++) {
                                ctx.fillText((facB[primes[pk]] || 0).toString(), tableX + (pk + 1) * colW, y2 + 28);
                            }

                            // min row
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('min', tableX, y2 + 42);
                            for (var pm = 0; pm < primes.length; pm++) {
                                var minE = Math.min(facA[primes[pm]] || 0, facB[primes[pm]] || 0);
                                ctx.fillText(minE.toString(), tableX + (pm + 1) * colW, y2 + 42);
                            }

                            // Method 3: Euclidean algorithm
                            var col3X = viz.width / 2 + 10;
                            ctx.fillStyle = viz.colors.purple;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText('Method 3: Euclidean Algorithm', col3X, headerY);

                            var steps = euclidSteps(a, b);
                            ctx.font = '10px -apple-system,sans-serif';
                            var y3 = headerY + 18;

                            for (var si = 0; si < Math.min(steps.length, 12); si++) {
                                var s = steps[si];
                                var line = s.a + ' = ' + s.q + ' \u00D7 ' + s.b + ' + ' + s.r;
                                ctx.fillStyle = s.r === 0 ? viz.colors.green : viz.colors.text;
                                ctx.fillText(line, col3X, y3 + si * 14);
                            }

                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText('Last nonzero remainder: ' + g, col3X, y3 + Math.min(steps.length, 12) * 14 + 6);

                            // Bottom bar: verify
                            viz.screenText(
                                'Verify: ' + a + ' / ' + g + ' = ' + (a / g) + ',  ' + b + ' / ' + g + ' = ' + (b / g) +
                                ',  gcd(' + (a / g) + ', ' + (b / g) + ') = 1',
                                viz.width / 2, viz.height - 20, viz.colors.teal, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A rectangular garden is 60 meters long and 45 meters wide. You want to divide it into the largest possible square plots. What is the side length of each square, and how many squares do you need?',
                    hint: 'The side length is \\(\\gcd(60, 45)\\).',
                    solution: '\\(\\gcd(60, 45) = 15\\). Each square plot is \\(15 \\times 15\\) meters. Number of plots: \\(\\frac{60}{15} \\times \\frac{45}{15} = 4 \\times 3 = 12\\).'
                },
                {
                    question: 'Find integers \\(x\\) and \\(y\\) such that \\(12x + 8y = 4\\).',
                    hint: 'Since \\(\\gcd(12, 8) = 4\\), Bezout\'s identity guarantees a solution. Try small values.',
                    solution: 'One solution: \\(x = 1, y = -1\\), since \\(12(1) + 8(-1) = 12 - 8 = 4\\). Another: \\(x = -1, y = 2\\), since \\(12(-1) + 8(2) = -12 + 16 = 4\\).'
                },
                {
                    question: 'Prove that if \\(\\gcd(a, b) = d\\), then \\(\\gcd(a/d, b/d) = 1\\).',
                    hint: 'Let \\(a = da\'\\) and \\(b = db\'\\). If \\(e \\mid a\'\\) and \\(e \\mid b\'\\), then \\(de \\mid a\\) and \\(de \\mid b\\), so \\(de \\leq d\\).',
                    solution: 'Let \\(a\' = a/d\\) and \\(b\' = b/d\\). Suppose \\(e = \\gcd(a\', b\') > 1\\). Then \\(e \\mid a\'\\) and \\(e \\mid b\'\\), so \\(de \\mid a\\) and \\(de \\mid b\\). But \\(de > d = \\gcd(a,b)\\), contradicting the definition of GCD. Therefore \\(\\gcd(a\', b\') = 1\\).'
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
<h2>Looking Ahead: The Euclidean Algorithm</h2>

<p>We now have three ways to compute \\(\\gcd(a, b)\\): listing all factors, using prime factorization, and (previewed in the explorer above) the Euclidean algorithm. But the first two methods both require knowledge of the factors of \\(a\\) and \\(b\\), and factoring is <em>hard</em> for large numbers.</p>

<p>The Euclidean algorithm is fundamentally different. It computes the GCD using only division with remainder, never needing to factor either number. It is based on a beautifully simple observation:</p>

<div class="env-block theorem">
    <div class="env-title">Proposition 6.6 (The Key Identity)</div>
    <div class="env-body">
        <p>For any integers \\(a\\) and \\(b\\) with \\(b > 0\\):</p>
        \\[\\gcd(a, b) = \\gcd(b, a \\bmod b).\\]
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>Write \\(a = qb + r\\) where \\(0 \\leq r < b\\). Any common divisor of \\(a\\) and \\(b\\) also divides \\(r = a - qb\\), and any common divisor of \\(b\\) and \\(r\\) also divides \\(a = qb + r\\). So the set of common divisors of \\((a, b)\\) equals the set of common divisors of \\((b, r)\\). In particular, their greatest elements are equal.</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<p>This identity allows us to repeatedly replace the larger number with the remainder, shrinking the problem at each step until the remainder is zero. The last nonzero remainder is the GCD. We will develop this algorithm in full in the next chapter, along with Bezout's identity and its many consequences.</p>

<div class="env-block remark">
    <div class="env-title">A 2300-Year-Old Algorithm</div>
    <div class="env-body">
        <p>The Euclidean algorithm is one of the oldest algorithms in continuous use. Euclid described it around 300 BCE, but it was likely known earlier. It remains essential in modern computing: from simplifying fractions to securing internet communications via RSA encryption.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-coprime"></div>
`,
            visualizations: [
                {
                    id: 'viz-coprime',
                    title: 'Coprime Pairs on a Grid',
                    description: 'Each cell (a, b) is colored by gcd(a, b). Bright green cells are coprime pairs (gcd = 1). Notice the striking pattern: coprime pairs are surprisingly common.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var maxN = 20;

                        VizEngine.createSlider(controls, 'Grid size', 5, 30, maxN, 1, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function gcd(x, y) {
                            while (y) { var t = y; y = x % y; x = t; }
                            return x;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Coprime Pairs: gcd(a, b) = 1 (green)', viz.width / 2, 18, viz.colors.white, 13);

                            var margin = 45;
                            var cellSize = Math.min(
                                (viz.width - margin - 20) / maxN,
                                (viz.height - margin - 50) / maxN
                            );
                            var gridW = maxN * cellSize;
                            var gridH = maxN * cellSize;
                            var ox = margin;
                            var oy = 38;

                            var coprimeCount = 0;
                            var totalCount = 0;

                            for (var i = 1; i <= maxN; i++) {
                                for (var j = 1; j <= maxN; j++) {
                                    var g = gcd(i, j);
                                    var cx = ox + (i - 1) * cellSize;
                                    var cy = oy + (j - 1) * cellSize;

                                    totalCount++;
                                    if (g === 1) {
                                        ctx.fillStyle = viz.colors.green + 'aa';
                                        coprimeCount++;
                                    } else if (g === 2) {
                                        ctx.fillStyle = viz.colors.blue + '44';
                                    } else if (g === 3) {
                                        ctx.fillStyle = viz.colors.orange + '44';
                                    } else if (g === 4) {
                                        ctx.fillStyle = viz.colors.purple + '44';
                                    } else {
                                        ctx.fillStyle = viz.colors.red + '33';
                                    }

                                    ctx.fillRect(cx + 0.5, cy + 0.5, cellSize - 1, cellSize - 1);

                                    // Show gcd value if cells are big enough
                                    if (cellSize >= 18) {
                                        ctx.fillStyle = g === 1 ? viz.colors.white : viz.colors.text + '88';
                                        ctx.font = Math.min(10, cellSize - 4) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(g.toString(), cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Axis labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var labelStep = maxN <= 15 ? 1 : (maxN <= 25 ? 2 : 5);
                            for (var la = 1; la <= maxN; la += labelStep) {
                                ctx.fillText(la.toString(), ox + (la - 0.5) * cellSize, oy + gridH + 3);
                            }
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            for (var lb = 1; lb <= maxN; lb += labelStep) {
                                ctx.fillText(lb.toString(), ox - 4, oy + (lb - 0.5) * cellSize);
                            }

                            // Axis names
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('a', ox + gridW / 2, oy + gridH + 16);

                            ctx.save();
                            ctx.translate(12, oy + gridH / 2);
                            ctx.rotate(-Math.PI / 2);
                            ctx.fillText('b', 0, 0);
                            ctx.restore();

                            // Stats
                            var pct = (100 * coprimeCount / totalCount).toFixed(1);
                            viz.screenText(
                                coprimeCount + ' / ' + totalCount + ' pairs are coprime (' + pct + '%)',
                                viz.width / 2, viz.height - 20, viz.colors.green, 12
                            );
                            viz.screenText(
                                'As n \u2192 \u221E, this fraction \u2192 6/\u03C0\u00B2 \u2248 60.8%',
                                viz.width / 2, viz.height - 5, viz.colors.teal, 10
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the key identity \\(\\gcd(a, b) = \\gcd(b, a \\bmod b)\\) for \\(a = 91, b = 35\\).',
                    hint: 'Compute \\(91 \\bmod 35\\), then find both GCDs by any method.',
                    solution: '\\(91 = 2 \\times 35 + 21\\), so \\(91 \\bmod 35 = 21\\). \\(\\gcd(91, 35)\\): factors of 91 are \\(\\{1, 7, 13, 91\\}\\), factors of 35 are \\(\\{1, 5, 7, 35\\}\\), so \\(\\gcd = 7\\). \\(\\gcd(35, 21)\\): factors of 35 are \\(\\{1, 5, 7, 35\\}\\), factors of 21 are \\(\\{1, 3, 7, 21\\}\\), so \\(\\gcd = 7\\). Both give 7. \\(\\checkmark\\)'
                },
                {
                    question: 'The probability that two randomly chosen positive integers are coprime is \\(6/\\pi^2\\). Use this to estimate \\(\\pi\\). Pick 100 random pairs of integers between 1 and 1000, count how many are coprime, and compute \\(\\pi \\approx \\sqrt{6/p}\\) where \\(p\\) is the observed proportion.',
                    hint: 'This is a computational exercise. You can do it by hand for a few pairs to see the idea, or write a short program.',
                    solution: 'The exact probability is \\(6/\\pi^2 \\approx 0.6079\\). If you test 100 pairs and find, say, 59 coprime pairs, then \\(p = 0.59\\) and \\(\\pi \\approx \\sqrt{6/0.59} \\approx 3.19\\). With more pairs, the estimate converges to \\(\\pi \\approx 3.14159\\ldots\\). This remarkable connection between coprimality and \\(\\pi\\) was discovered by Euler.'
                }
            ]
        }
    ]
});
