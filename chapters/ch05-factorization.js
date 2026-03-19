window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: 'Prime Factorization',
    subtitle: 'Breaking numbers into prime pieces',
    sections: [
        // ================================================================
        // SECTION 1: Why Factor Numbers?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Factor Numbers?',
            content: `
<h2>Why Factor Numbers?</h2>

<div class="env-block intuition">
    <div class="env-title">Numbers Have a Hidden Structure</div>
    <div class="env-body">
        <p>Think of a number like 60. You can break it apart: \\(60 = 2 \\times 30 = 2 \\times 2 \\times 15 = 2 \\times 2 \\times 3 \\times 5\\). Those last pieces, 2, 3, and 5, are all primes. They cannot be broken down any further. Every positive integer greater than 1 can be written as a product of primes, and this decomposition reveals the number's inner anatomy.</p>
    </div>
</div>

<p>In previous chapters, we learned what prime numbers are and how to identify them. Now we turn to a deeper question: given a composite number, how do we <strong>decompose</strong> it into its prime building blocks?</p>

<p>This process, called <em>prime factorization</em>, is one of the most fundamental operations in all of number theory. It tells us everything about a number's divisors, it lets us compute greatest common divisors and least common multiples, and it is the mathematical foundation behind modern cryptography.</p>

<h3>What Factorization Reveals</h3>

<p>Knowing the prime factorization of a number immediately answers questions like:</p>
<ul>
    <li>How many divisors does the number have?</li>
    <li>What are all its divisors?</li>
    <li>Is it a perfect square?</li>
    <li>What is its GCD or LCM with another number?</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: The Number 360</div>
    <div class="env-body">
        <p>Let us factor 360 step by step:</p>
        \\[360 = 2 \\times 180 = 2 \\times 2 \\times 90 = 2 \\times 2 \\times 2 \\times 45 = 2 \\times 2 \\times 2 \\times 3 \\times 15 = 2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 5.\\]
        <p>In compact notation: \\(360 = 2^3 \\times 3^2 \\times 5\\). From this, we can immediately read off that 360 has \\((3+1)(2+1)(1+1) = 24\\) divisors.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The ancient Greeks understood that primes are the building blocks of numbers. Euclid's <em>Elements</em> (circa 300 BCE) contains propositions about factoring numbers into primes, though the first complete proof that every integer has a <em>unique</em> prime factorization was given by Gauss in his <em>Disquisitiones Arithmeticae</em> (1801).</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'List all the prime factors of 84.',
                    hint: 'Start by dividing by the smallest prime, 2, and continue.',
                    solution: '\\(84 = 2 \\times 42 = 2 \\times 2 \\times 21 = 2 \\times 2 \\times 3 \\times 7 = 2^2 \\times 3 \\times 7\\). The prime factors are 2, 3, and 7.'
                },
                {
                    question: 'Is 1 considered a prime factor? Why or why not?',
                    hint: 'Recall the definition of a prime number.',
                    solution: 'No. A prime number must be greater than 1 and have exactly two positive divisors (1 and itself). The number 1 has only one positive divisor. Including 1 as a prime would break the uniqueness of prime factorization, since we could multiply by as many 1s as we like.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Factor Trees
        // ================================================================
        {
            id: 'sec-factor-trees',
            title: 'Factor Trees',
            content: `
<h2>Factor Trees</h2>

<div class="env-block intuition">
    <div class="env-title">Breaking Numbers Apart</div>
    <div class="env-body">
        <p>A <strong>factor tree</strong> is a diagram that shows how a number is split into factors, and those factors are split further, until every leaf is a prime. Think of it as peeling away layers of a number until you reach pieces that cannot be broken down.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Factor Tree)</div>
    <div class="env-body">
        <p>A <strong>factor tree</strong> for a positive integer \\(n > 1\\) is a tree where:</p>
        <ul>
            <li>The <em>root</em> is \\(n\\).</li>
            <li>Each non-leaf node \\(m\\) has two children \\(a\\) and \\(b\\) with \\(m = a \\times b\\) and \\(1 < a, b < m\\).</li>
            <li>Every <em>leaf</em> is a prime number.</li>
        </ul>
        <p>The product of all leaves equals \\(n\\).</p>
    </div>
</div>

<h3>How to Build a Factor Tree</h3>

<p>There is no single "correct" factor tree for a given number. At each step, you can choose <em>any</em> factorization of the current node into two factors greater than 1. The remarkable fact (which we prove in the next section) is that no matter which choices you make, the set of prime leaves at the bottom is always the same.</p>

<div class="env-block example">
    <div class="env-title">Example: Two Factor Trees for 60</div>
    <div class="env-body">
        <p><strong>Tree 1:</strong> Start with \\(60 = 2 \\times 30\\), then \\(30 = 2 \\times 15\\), then \\(15 = 3 \\times 5\\).</p>
        <p>Leaves: 2, 2, 3, 5.</p>
        <p><strong>Tree 2:</strong> Start with \\(60 = 6 \\times 10\\), then \\(6 = 2 \\times 3\\), then \\(10 = 2 \\times 5\\).</p>
        <p>Leaves: 2, 3, 2, 5.</p>
        <p>Both trees give the same collection of primes: \\(\\{2, 2, 3, 5\\}\\). This is the essence of the Fundamental Theorem of Arithmetic.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Strategy</div>
    <div class="env-body">
        <p>While any splitting works, a systematic approach is often fastest: always divide by the smallest prime factor first. This produces a "left-leaning" tree where each left child is a small prime, making it easy to track your work.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-factor-tree"></div>
`,
            visualizations: [
                {
                    id: 'viz-factor-tree',
                    title: 'Interactive Factor Tree Builder',
                    description: 'Enter a number and build its factor tree by clicking on composite nodes to split them. Watch as the primes collect at the leaves.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 60;
                        var tree = null;
                        var nodeId = 0;

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function smallestFactor(n) {
                            if (n % 2 === 0) return 2;
                            for (var i = 3; i * i <= n; i += 2) {
                                if (n % i === 0) return i;
                            }
                            return n;
                        }

                        function makeNode(val) {
                            return { id: nodeId++, val: val, left: null, right: null, x: 0, y: 0, prime: isPrime(val) };
                        }

                        function resetTree() {
                            nodeId = 0;
                            tree = makeNode(targetNum);
                            layoutTree();
                        }

                        function allNodes(node) {
                            if (!node) return [];
                            return [node].concat(allNodes(node.left)).concat(allNodes(node.right));
                        }

                        function getLeaves(node) {
                            if (!node) return [];
                            if (!node.left && !node.right) return [node];
                            return getLeaves(node.left).concat(getLeaves(node.right));
                        }

                        function treeDepth(node) {
                            if (!node || (!node.left && !node.right)) return 0;
                            return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
                        }

                        function leafCount(node) {
                            if (!node) return 0;
                            if (!node.left && !node.right) return 1;
                            return leafCount(node.left) + leafCount(node.right);
                        }

                        function layoutTree() {
                            var depth = treeDepth(tree);
                            var totalLeaves = leafCount(tree) || 1;
                            var usableW = viz.width - 80;
                            var usableH = viz.height - 100;
                            var leafSpacing = usableW / totalLeaves;
                            var leafIdx = { val: 0 };

                            function layout(node, depth_level, maxDepth) {
                                if (!node) return;
                                var rowY = 50 + (depth_level / Math.max(maxDepth, 1)) * usableH;
                                node.y = rowY;
                                if (!node.left && !node.right) {
                                    node.x = 40 + (leafIdx.val + 0.5) * leafSpacing;
                                    leafIdx.val++;
                                } else {
                                    layout(node.left, depth_level + 1, maxDepth);
                                    layout(node.right, depth_level + 1, maxDepth);
                                    node.x = (node.left.x + node.right.x) / 2;
                                }
                            }
                            var d = treeDepth(tree);
                            layout(tree, 0, d);
                        }

                        function splitNode(node) {
                            if (node.prime || node.left) return;
                            var sf = smallestFactor(node.val);
                            if (sf === node.val) { node.prime = true; return; }
                            node.left = makeNode(sf);
                            node.right = makeNode(node.val / sf);
                            layoutTree();
                        }

                        function autoSplit(node) {
                            if (!node || node.prime) return;
                            if (!node.left) splitNode(node);
                            autoSplit(node.left);
                            autoSplit(node.right);
                        }

                        // Input control
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number';
                        inp.min = 2; inp.max = 9999; inp.value = targetNum;
                        inp.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 2 && v <= 9999) { targetNum = v; resetTree(); draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Auto-Split', function() {
                            autoSplit(tree);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            resetTree();
                            draw();
                        });

                        // Click handling
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var nodes = allNodes(tree);
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                if (!nd.prime && !nd.left && Math.abs(mx - nd.x) < 22 && Math.abs(my - nd.y) < 16) {
                                    splitNode(nd);
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Factor Tree for ' + targetNum, viz.width / 2, 20, viz.colors.white, 16);

                            function drawNode(node) {
                                if (!node) return;
                                // Draw edges first
                                if (node.left) {
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(node.x, node.y + 14);
                                    ctx.lineTo(node.left.x, node.left.y - 14);
                                    ctx.stroke();

                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.beginPath();
                                    ctx.moveTo(node.x, node.y + 14);
                                    ctx.lineTo(node.right.x, node.right.y - 14);
                                    ctx.stroke();
                                }

                                // Node circle
                                var r = 18;
                                var col;
                                if (node.prime) {
                                    col = viz.colors.teal;
                                } else if (node.left) {
                                    col = viz.colors.text;
                                } else {
                                    col = viz.colors.orange;
                                }

                                ctx.fillStyle = node.prime ? col + '33' : (node.left ? '#0c0c20' : col + '22');
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = col;
                                ctx.lineWidth = node.prime ? 2.5 : 1.5;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                                ctx.stroke();

                                // Value text
                                ctx.fillStyle = node.prime ? viz.colors.teal : (node.left ? viz.colors.text : viz.colors.orange);
                                var fs = node.val > 999 ? 10 : (node.val > 99 ? 12 : 14);
                                ctx.font = (node.prime ? 'bold ' : '') + fs + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(node.val.toString(), node.x, node.y);

                                // Recurse
                                if (node.left) drawNode(node.left);
                                if (node.right) drawNode(node.right);
                            }
                            drawNode(tree);

                            // Show collected primes
                            var leaves = getLeaves(tree);
                            var primeLeaves = leaves.filter(function(l) { return l.prime; });
                            var compositeLeaves = leaves.filter(function(l) { return !l.prime; });

                            if (primeLeaves.length > 0) {
                                var primeVals = primeLeaves.map(function(l) { return l.val; }).sort(function(a, b) { return a - b; });
                                var factorStr = primeVals.join(' \\u00D7 ');
                                var msg = compositeLeaves.length > 0
                                    ? 'Primes so far: ' + factorStr + '  (click orange nodes to continue)'
                                    : targetNum + ' = ' + factorStr;
                                var msgColor = compositeLeaves.length > 0 ? viz.colors.yellow : viz.colors.teal;
                                viz.screenText(msg, viz.width / 2, viz.height - 16, msgColor, 13);
                            } else {
                                viz.screenText('Click the orange node to begin splitting', viz.width / 2, viz.height - 16, viz.colors.muted, 12);
                            }
                        }

                        resetTree();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw a factor tree for 72 starting with \\(72 = 8 \\times 9\\). What prime leaves do you get?',
                    hint: 'Factor 8 and 9 each further. \\(8 = 2 \\times 4 = 2 \\times 2 \\times 2\\) and \\(9 = 3 \\times 3\\).',
                    solution: '\\(72 = 8 \\times 9\\). Then \\(8 = 2 \\times 4\\), \\(4 = 2 \\times 2\\), \\(9 = 3 \\times 3\\). The prime leaves are \\(\\{2, 2, 2, 3, 3\\}\\), giving \\(72 = 2^3 \\times 3^2\\).'
                },
                {
                    question: 'Draw a different factor tree for 72, this time starting with \\(72 = 2 \\times 36\\). Do you get the same prime leaves?',
                    hint: 'Factor 36 = 2 \\times 18, then 18 = 2 \\times 9, then 9 = 3 \\times 3.',
                    solution: '\\(72 = 2 \\times 36 = 2 \\times 2 \\times 18 = 2 \\times 2 \\times 2 \\times 9 = 2 \\times 2 \\times 2 \\times 3 \\times 3\\). The prime leaves are again \\(\\{2, 2, 2, 3, 3\\}\\). Same result, different path.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: The Fundamental Theorem of Arithmetic
        // ================================================================
        {
            id: 'sec-uniqueness',
            title: 'The Fundamental Theorem',
            content: `
<h2>The Fundamental Theorem of Arithmetic</h2>

<div class="env-block intuition">
    <div class="env-title">Why "Fundamental"?</div>
    <div class="env-body">
        <p>The Fundamental Theorem of Arithmetic says two things. First, every integer greater than 1 <em>can</em> be written as a product of primes (existence). Second, there is essentially only <em>one way</em> to do this (uniqueness, up to the order of the factors). This is not obvious. It fails, for instance, in certain algebraic number systems. The fact that it holds for ordinary integers is what makes the integers so well-behaved.</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.1 (Fundamental Theorem of Arithmetic)</div>
    <div class="env-body">
        <p>Every integer \\(n > 1\\) can be expressed as a product of prime numbers:</p>
        \\[n = p_1 \\cdot p_2 \\cdots p_k\\]
        <p>and this representation is <strong>unique up to the order of the factors</strong>. That is, if \\(n = q_1 \\cdot q_2 \\cdots q_m\\) is another prime factorization, then \\(k = m\\) and the \\(q_j\\)'s are just a rearrangement of the \\(p_i\\)'s.</p>
    </div>
</div>

<h3>Proof Sketch</h3>

<p><strong>Existence</strong> follows by strong induction. If \\(n\\) is prime, we are done. If \\(n\\) is composite, write \\(n = a \\times b\\) with \\(1 < a, b < n\\). By the inductive hypothesis, both \\(a\\) and \\(b\\) have prime factorizations, so \\(n\\) does too.</p>

<p><strong>Uniqueness</strong> is the harder part and relies on a key property of primes:</p>

<div class="env-block theorem">
    <div class="env-title">Lemma 5.2 (Euclid's Lemma)</div>
    <div class="env-body">
        <p>If a prime \\(p\\) divides a product \\(ab\\), then \\(p \\mid a\\) or \\(p \\mid b\\) (or both).</p>
    </div>
</div>

<p>Using Euclid's Lemma, if \\(p_1 p_2 \\cdots p_k = q_1 q_2 \\cdots q_m\\), then \\(p_1\\) divides the right side, so \\(p_1\\) divides some \\(q_j\\). Since \\(q_j\\) is prime, \\(p_1 = q_j\\). Cancel both, and repeat inductively.</p>

<div class="env-block warning">
    <div class="env-title">Uniqueness Can Fail</div>
    <div class="env-body">
        <p>In the set \\(\\{1, 5, 9, 13, 17, 21, 25, \\ldots\\}\\) (numbers of the form \\(4k + 1\\)), define "prime" as a number in this set with no factorization within the set. Then \\(441 = 9 \\times 49 = 21 \\times 21\\), and both 9, 49, and 21 are "primes" in this restricted set. Unique factorization fails! This shows that the Fundamental Theorem is a genuine theorem, not a tautology.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-uniqueness"></div>
`,
            visualizations: [
                {
                    id: 'viz-uniqueness',
                    title: 'Two Trees, Same Primes',
                    description: 'See the same number factored in two different ways. No matter how you split, the prime leaves are always the same multiset.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 60;

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function smallestFactor(n) {
                            if (n % 2 === 0) return 2;
                            for (var i = 3; i * i <= n; i += 2) { if (n % i === 0) return i; }
                            return n;
                        }

                        function largestFactor(n) {
                            var sf = smallestFactor(n);
                            return n / sf;
                        }

                        // Build a tree by always using smallest factor first
                        function buildTreeSmallest(n) {
                            if (isPrime(n) || n < 2) return { val: n, left: null, right: null, prime: isPrime(n) };
                            var sf = smallestFactor(n);
                            return { val: n, left: buildTreeSmallest(sf), right: buildTreeSmallest(n / sf), prime: false };
                        }

                        // Build a tree by using largest proper factor splits
                        function buildTreeLargest(n) {
                            if (isPrime(n) || n < 2) return { val: n, left: null, right: null, prime: isPrime(n) };
                            // Find a "middle" factorization for visual variety
                            var factors = [];
                            for (var i = 2; i * i <= n; i++) {
                                if (n % i === 0) factors.push(i);
                            }
                            if (factors.length === 0) return { val: n, left: null, right: null, prime: true };
                            // Pick the largest factor pair
                            var f = factors[factors.length - 1];
                            return { val: n, left: buildTreeLargest(f), right: buildTreeLargest(n / f), prime: false };
                        }

                        function getLeaves(node) {
                            if (!node) return [];
                            if (!node.left && !node.right) return [node.val];
                            return getLeaves(node.left).concat(getLeaves(node.right));
                        }

                        function treeDepth(node) {
                            if (!node || (!node.left && !node.right)) return 0;
                            return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
                        }

                        function leafCount(node) {
                            if (!node) return 0;
                            if (!node.left && !node.right) return 1;
                            return leafCount(node.left) + leafCount(node.right);
                        }

                        function layoutHalf(node, cx, w, startY, rowH, maxD) {
                            if (!node) return;
                            var lc = leafCount(node) || 1;
                            if (!node.left && !node.right) {
                                node.x = cx;
                                node.y = startY;
                                return;
                            }
                            node.x = cx;
                            node.y = startY;
                            var leftLeaves = leafCount(node.left) || 1;
                            var rightLeaves = leafCount(node.right) || 1;
                            var total = leftLeaves + rightLeaves;
                            var leftW = w * leftLeaves / total;
                            var rightW = w * rightLeaves / total;
                            layoutHalf(node.left, cx - w / 2 + leftW / 2, leftW, startY + rowH, rowH, maxD);
                            layoutHalf(node.right, cx + w / 2 - rightW / 2, rightW, startY + rowH, rowH, maxD);
                        }

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number'; inp.min = 4; inp.max = 9999; inp.value = targetNum;
                        inp.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 4 && v <= 9999 && !isPrime(v)) { targetNum = v; draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        function drawTree(node, ctx, colors) {
                            if (!node) return;
                            if (node.left) {
                                ctx.strokeStyle = colors.grid;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(node.x, node.y + 12); ctx.lineTo(node.left.x, node.left.y - 12); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(node.x, node.y + 12); ctx.lineTo(node.right.x, node.right.y - 12); ctx.stroke();
                            }
                            var r = 15;
                            var col = node.prime ? colors.teal : colors.text;
                            ctx.fillStyle = node.prime ? col + '33' : '#0c0c20';
                            ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill();
                            ctx.strokeStyle = col; ctx.lineWidth = node.prime ? 2.5 : 1;
                            ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.stroke();
                            var fs = node.val > 999 ? 9 : (node.val > 99 ? 10 : 12);
                            ctx.fillStyle = col;
                            ctx.font = (node.prime ? 'bold ' : '') + fs + 'px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(node.val.toString(), node.x, node.y);
                            drawTree(node.left, ctx, colors);
                            drawTree(node.right, ctx, colors);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var halfW = viz.width / 2 - 20;

                            viz.screenText('Two Factor Trees for ' + targetNum, viz.width / 2, 20, viz.colors.white, 15);

                            // Left tree: smallest factor splits
                            var treeA = buildTreeSmallest(targetNum);
                            var dA = treeDepth(treeA);
                            var rowHA = Math.min(60, (viz.height - 120) / Math.max(dA, 1));
                            layoutHalf(treeA, viz.width / 4, halfW - 20, 60, rowHA, dA);

                            // Right tree: largest factor splits
                            var treeB = buildTreeLargest(targetNum);
                            var dB = treeDepth(treeB);
                            var rowHB = Math.min(60, (viz.height - 120) / Math.max(dB, 1));
                            layoutHalf(treeB, 3 * viz.width / 4, halfW - 20, 60, rowHB, dB);

                            // Divider
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(viz.width / 2, 40); ctx.lineTo(viz.width / 2, viz.height - 50); ctx.stroke();
                            ctx.setLineDash([]);

                            // Labels
                            viz.screenText('Path A', viz.width / 4, 42, viz.colors.blue, 12);
                            viz.screenText('Path B', 3 * viz.width / 4, 42, viz.colors.purple, 12);

                            drawTree(treeA, ctx, viz.colors);
                            drawTree(treeB, ctx, viz.colors);

                            // Show leaves
                            var leavesA = getLeaves(treeA).sort(function(a, b) { return a - b; });
                            var leavesB = getLeaves(treeB).sort(function(a, b) { return a - b; });
                            var strA = leavesA.join(' \\u00D7 ');
                            var strB = leavesB.join(' \\u00D7 ');
                            var match = JSON.stringify(leavesA) === JSON.stringify(leavesB);

                            viz.screenText(strA, viz.width / 4, viz.height - 30, viz.colors.teal, 12);
                            viz.screenText(strB, 3 * viz.width / 4, viz.height - 30, viz.colors.teal, 12);
                            viz.screenText(
                                match ? 'Same prime factors!' : 'Same prime factors!',
                                viz.width / 2, viz.height - 10, viz.colors.green, 13
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain in your own words why Euclid\'s Lemma is necessary for the uniqueness part of the Fundamental Theorem.',
                    hint: 'Without Euclid\'s Lemma, we cannot guarantee that a prime from one factorization appears in the other.',
                    solution: 'If \\(p_1 p_2 \\cdots p_k = q_1 q_2 \\cdots q_m\\), then \\(p_1\\) divides the product \\(q_1 q_2 \\cdots q_m\\). Euclid\'s Lemma guarantees that \\(p_1\\) must divide some \\(q_j\\). Since \\(q_j\\) is prime and \\(p_1 > 1\\), we conclude \\(p_1 = q_j\\). Without this lemma, we could not match up primes between the two factorizations, and uniqueness would not follow.'
                },
                {
                    question: 'Show that \\(6 = 2 \\times 3\\) has a unique factorization in the integers, but in the "Hilbert numbers" \\(\\{1, 5, 9, 13, 17, 21, \\ldots\\}\\), the number \\(693 = 9 \\times 77 = 21 \\times 33\\) has two different "prime" factorizations.',
                    hint: 'Check that 9, 77, 21, and 33 are all "primes" in the Hilbert numbers (none of them factor as a product of two other Hilbert numbers).',
                    solution: 'In the integers, \\(6 = 2 \\times 3\\) and both 2 and 3 are prime, so this is the unique factorization. In Hilbert numbers (\\(4k+1\\)): 9, 21, 33, 77 are all "Hilbert primes" since none factors as a product of two Hilbert numbers greater than 1. But \\(693 = 9 \\times 77 = 21 \\times 33\\) gives two distinct factorizations. Euclid\'s Lemma fails in this system: \\(21 \\mid 693 = 9 \\times 77\\) but \\(21 \\nmid 9\\) and \\(21 \\nmid 77\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Prime Power Form
        // ================================================================
        {
            id: 'sec-exponent-form',
            title: 'Prime Power Form',
            content: `
<h2>Prime Power Form</h2>

<div class="env-block intuition">
    <div class="env-title">Collecting Like Primes</div>
    <div class="env-body">
        <p>When a prime appears multiple times in a factorization, we group them using exponents. Instead of writing \\(360 = 2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 5\\), we write \\(360 = 2^3 \\times 3^2 \\times 5^1\\). This <strong>prime power form</strong> (or <strong>canonical form</strong>) is the standard way to express a factorization.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Prime Power Form)</div>
    <div class="env-body">
        <p>The <strong>prime power form</strong> (or <strong>canonical factorization</strong>) of an integer \\(n > 1\\) is</p>
        \\[n = p_1^{e_1} \\cdot p_2^{e_2} \\cdots p_r^{e_r}\\]
        <p>where \\(p_1 < p_2 < \\cdots < p_r\\) are distinct primes and each exponent \\(e_i \\geq 1\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Examples</div>
    <div class="env-body">
        <table style="width:100%; border-collapse:collapse; margin:8px 0; font-size:0.92em;">
            <tr style="border-bottom:2px solid var(--border-default);">
                <th style="padding:6px; text-align:left;">Number</th>
                <th style="padding:6px; text-align:left;">Expanded</th>
                <th style="padding:6px; text-align:left;">Prime Power Form</th>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">12</td>
                <td style="padding:6px;">\\(2 \\times 2 \\times 3\\)</td>
                <td style="padding:6px;">\\(2^2 \\times 3\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">360</td>
                <td style="padding:6px;">\\(2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 5\\)</td>
                <td style="padding:6px;">\\(2^3 \\times 3^2 \\times 5\\)</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:6px;">1000</td>
                <td style="padding:6px;">\\(2 \\times 2 \\times 2 \\times 5 \\times 5 \\times 5\\)</td>
                <td style="padding:6px;">\\(2^3 \\times 5^3\\)</td>
            </tr>
            <tr>
                <td style="padding:6px;">2310</td>
                <td style="padding:6px;">\\(2 \\times 3 \\times 5 \\times 7 \\times 11\\)</td>
                <td style="padding:6px;">\\(2 \\times 3 \\times 5 \\times 7 \\times 11\\)</td>
            </tr>
        </table>
        <p>Notice that 2310 has five distinct prime factors, each appearing exactly once. A number whose prime factors all have exponent 1 is called <strong>squarefree</strong>.</p>
    </div>
</div>

<h3>Reading the Exponents</h3>

<p>The exponents tell us how "deep" each prime goes into the number:</p>
<ul>
    <li>\\(e_i = 1\\): the prime \\(p_i\\) divides \\(n\\) but \\(p_i^2\\) does not.</li>
    <li>\\(e_i = 2\\): \\(p_i^2 \\mid n\\) but \\(p_i^3 \\nmid n\\). The number contains a "perfect square factor" of \\(p_i\\).</li>
    <li>In general, \\(e_i\\) is the largest power of \\(p_i\\) that divides \\(n\\), sometimes written \\(v_{p_i}(n) = e_i\\) (the \\(p_i\\)-adic valuation).</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Perfect Squares</div>
    <div class="env-body">
        <p>A number is a perfect square if and only if all exponents in its prime power form are even. For example, \\(144 = 2^4 \\times 3^2\\) is a perfect square (\\(12^2\\)), but \\(360 = 2^3 \\times 3^2 \\times 5\\) is not (the exponent of 2 is odd).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-prime-power"></div>
`,
            visualizations: [
                {
                    id: 'viz-prime-power',
                    title: 'Prime Power Decomposition',
                    description: 'Watch a number decompose into its prime powers, animated step by step. Each prime gets its own color and exponent.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 360;
                        var animPhase = 0;
                        var animTimer = null;
                        var primeColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                        function factorize(n) {
                            var factors = [];
                            var d = 2;
                            while (d * d <= n) {
                                var count = 0;
                                while (n % d === 0) { count++; n /= d; }
                                if (count > 0) factors.push({ prime: d, exp: count });
                                d++;
                            }
                            if (n > 1) factors.push({ prime: n, exp: 1 });
                            return factors;
                        }

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number'; inp.min = 2; inp.max = 99999; inp.value = targetNum;
                        inp.style.cssText = 'width:90px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 2 && v <= 99999) { targetNum = v; animPhase = 0; draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Animate', function() {
                            animPhase = 0;
                            if (animTimer) clearInterval(animTimer);
                            var factors = factorize(targetNum);
                            var maxPhase = factors.length;
                            animTimer = setInterval(function() {
                                animPhase++;
                                draw();
                                if (animPhase >= maxPhase) clearInterval(animTimer);
                            }, 600);
                        });

                        VizEngine.createButton(controls, 'Show All', function() {
                            animPhase = 999;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var factors = factorize(targetNum);
                            var shown = Math.min(animPhase, factors.length);

                            viz.screenText('Prime Power Form of ' + targetNum, viz.width / 2, 25, viz.colors.white, 16);

                            // Display the equation being built
                            var eqParts = [];
                            for (var i = 0; i < shown; i++) {
                                var f = factors[i];
                                eqParts.push(f.prime + (f.exp > 1 ? '^' + f.exp : ''));
                            }
                            var remaining = targetNum;
                            for (var j = 0; j < shown; j++) {
                                remaining /= Math.pow(factors[j].prime, factors[j].exp);
                            }
                            var eqStr = targetNum + ' = ';
                            if (eqParts.length > 0) {
                                eqStr += eqParts.join(' \\u00D7 ');
                                if (remaining > 1) eqStr += ' \\u00D7 ' + remaining;
                            } else {
                                eqStr += '...';
                            }
                            viz.screenText(eqStr, viz.width / 2, 60, viz.colors.white, 14);

                            // Visual blocks for each prime factor
                            var blockAreaTop = 100;
                            var blockAreaBot = viz.height - 50;
                            var totalFactors = factors.length;
                            var blockW = Math.min(100, (viz.width - 60) / Math.max(totalFactors, 1));

                            for (var k = 0; k < factors.length; k++) {
                                var fk = factors[k];
                                var cx = (viz.width - totalFactors * blockW) / 2 + (k + 0.5) * blockW;
                                var col = primeColors[k % primeColors.length];
                                var visible = k < shown;

                                if (!visible) {
                                    // Dim placeholder
                                    ctx.fillStyle = viz.colors.grid;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText('?', cx, (blockAreaTop + blockAreaBot) / 2);
                                    continue;
                                }

                                // Draw stacked boxes for the exponent
                                var boxH = Math.min(40, (blockAreaBot - blockAreaTop - 40) / Math.max(fk.exp, 1));
                                var stackTop = (blockAreaTop + blockAreaBot) / 2 - (fk.exp * boxH) / 2;

                                for (var e = 0; e < fk.exp; e++) {
                                    var by = stackTop + e * boxH;
                                    ctx.fillStyle = col + '44';
                                    ctx.fillRect(cx - blockW * 0.35, by, blockW * 0.7, boxH - 4);
                                    ctx.strokeStyle = col;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(cx - blockW * 0.35, by, blockW * 0.7, boxH - 4);

                                    ctx.fillStyle = col;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(fk.prime.toString(), cx, by + (boxH - 4) / 2);
                                }

                                // Label below
                                ctx.fillStyle = col;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                var labelStr = fk.prime + (fk.exp > 1 ? '^' + fk.exp : '');
                                ctx.fillText(labelStr, cx, blockAreaBot - 10);
                            }

                            // Completion message
                            if (shown >= factors.length) {
                                viz.screenText('Complete!  ' + eqParts.join(' \\u00D7 '), viz.width / 2, viz.height - 18, viz.colors.teal, 13);
                            }
                        }
                        animPhase = 999;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write each number in prime power form: (a) 180, (b) 504, (c) 1024.',
                    hint: 'For (c), notice 1024 = 2^{10}.',
                    solution: '(a) \\(180 = 2^2 \\times 3^2 \\times 5\\). (b) \\(504 = 2^3 \\times 3^2 \\times 7\\). (c) \\(1024 = 2^{10}\\).'
                },
                {
                    question: 'Which of the following are perfect squares? (a) \\(2^4 \\times 3^2 \\times 5^2\\), (b) \\(2^3 \\times 7^2\\), (c) \\(2^6 \\times 3^4 \\times 11^2\\).',
                    hint: 'A number is a perfect square if and only if every exponent in its prime power form is even.',
                    solution: '(a) \\(2^4 \\times 3^2 \\times 5^2\\): all exponents (4, 2, 2) are even. Perfect square (\\(= 60^2 = 3600\\)). (b) \\(2^3 \\times 7^2\\): the exponent 3 is odd. Not a perfect square. (c) \\(2^6 \\times 3^4 \\times 11^2\\): all exponents (6, 4, 2) are even. Perfect square (\\(= (2^3 \\times 3^2 \\times 11)^2 = 792^2\\)).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Counting Factors
        // ================================================================
        {
            id: 'sec-counting-factors',
            title: 'Counting Factors',
            content: `
<h2>Counting Factors</h2>

<div class="env-block intuition">
    <div class="env-title">The Key Insight</div>
    <div class="env-body">
        <p>If \\(n = 2^3 \\times 3^2 \\times 5\\), then every divisor of \\(n\\) must look like \\(2^a \\times 3^b \\times 5^c\\) where \\(0 \\leq a \\leq 3\\), \\(0 \\leq b \\leq 2\\), and \\(0 \\leq c \\leq 1\\). Choosing \\(a\\) gives 4 options, choosing \\(b\\) gives 3 options, and choosing \\(c\\) gives 2 options. By the multiplication rule, the total number of divisors is \\(4 \\times 3 \\times 2 = 24\\).</p>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.3 (Divisor Counting Formula)</div>
    <div class="env-body">
        <p>If \\(n = p_1^{e_1} \\cdot p_2^{e_2} \\cdots p_r^{e_r}\\), then the number of positive divisors of \\(n\\) is</p>
        \\[\\tau(n) = (e_1 + 1)(e_2 + 1) \\cdots (e_r + 1).\\]
        <p>Here \\(\\tau\\) (Greek letter tau) is the <strong>divisor function</strong>.</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof</div>
    <div class="env-body">
        <p>A positive divisor \\(d\\) of \\(n\\) must have the form \\(d = p_1^{a_1} p_2^{a_2} \\cdots p_r^{a_r}\\) where \\(0 \\leq a_i \\leq e_i\\) for each \\(i\\). Each \\(a_i\\) can independently take any of the \\(e_i + 1\\) values \\(0, 1, \\ldots, e_i\\). By the multiplication rule, the total number of divisors is \\((e_1 + 1)(e_2 + 1) \\cdots (e_r + 1)\\).</p>
    </div>
    <div class="qed">&marker;</div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Divisors of 360</div>
    <div class="env-body">
        <p>\\(360 = 2^3 \\times 3^2 \\times 5^1\\), so \\(\\tau(360) = (3+1)(2+1)(1+1) = 4 \\times 3 \\times 2 = 24\\).</p>
        <p>The 24 divisors are: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360.</p>
    </div>
</div>

<h3>Sum of Divisors</h3>

<p>A similar argument gives the sum of all positive divisors of \\(n\\):</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 5.4 (Sum of Divisors)</div>
    <div class="env-body">
        <p>If \\(n = p_1^{e_1} p_2^{e_2} \\cdots p_r^{e_r}\\), then</p>
        \\[\\sigma(n) = \\sum_{d \\mid n} d = \\prod_{i=1}^{r} \\frac{p_i^{e_i+1} - 1}{p_i - 1}.\\]
    </div>
</div>

<p>This works because \\(\\sum_{a=0}^{e} p^a = \\frac{p^{e+1} - 1}{p - 1}\\) (geometric series), and the full sum factors as a product over independent choices for each prime.</p>

<div class="viz-placeholder" data-viz="viz-factor-count-formula"></div>
`,
            visualizations: [
                {
                    id: 'viz-factor-count-formula',
                    title: 'Counting Divisors Step by Step',
                    description: 'From the prime factorization, see how each exponent contributes choices. The total number of divisors is the product of all (exponent + 1) values.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 360;
                        var primeColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red];

                        function factorize(n) {
                            var factors = [];
                            var d = 2;
                            while (d * d <= n) {
                                var count = 0;
                                while (n % d === 0) { count++; n /= d; }
                                if (count > 0) factors.push({ prime: d, exp: count });
                                d++;
                            }
                            if (n > 1) factors.push({ prime: n, exp: 1 });
                            return factors;
                        }

                        function getDivisors(n) {
                            var divs = [];
                            for (var i = 1; i * i <= n; i++) {
                                if (n % i === 0) {
                                    divs.push(i);
                                    if (i !== n / i) divs.push(n / i);
                                }
                            }
                            return divs.sort(function(a, b) { return a - b; });
                        }

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number'; inp.min = 2; inp.max = 9999; inp.value = targetNum;
                        inp.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 2 && v <= 9999) { targetNum = v; draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var factors = factorize(targetNum);

                            // Title
                            var factStr = factors.map(function(f) { return f.prime + (f.exp > 1 ? '^' + f.exp : ''); }).join(' \\u00D7 ');
                            viz.screenText(targetNum + ' = ' + factStr, viz.width / 2, 25, viz.colors.white, 15);

                            // Show the formula
                            var formulaParts = factors.map(function(f) { return '(' + f.exp + '+1)'; });
                            var valueParts = factors.map(function(f) { return (f.exp + 1); });
                            var totalDivisors = valueParts.reduce(function(a, b) { return a * b; }, 1);
                            viz.screenText(
                                '\\u03C4(' + targetNum + ') = ' + formulaParts.join(' \\u00D7 ') + ' = ' + valueParts.join(' \\u00D7 ') + ' = ' + totalDivisors,
                                viz.width / 2, 55, viz.colors.teal, 13
                            );

                            // Grid of choices
                            var gridTop = 85;
                            var gridBot = 280;
                            var gridLeft = 60;
                            var gridRight = viz.width - 60;
                            var colW = (gridRight - gridLeft) / Math.max(factors.length, 1);

                            for (var i = 0; i < factors.length; i++) {
                                var f = factors[i];
                                var col = primeColors[i % primeColors.length];
                                var cx = gridLeft + (i + 0.5) * colW;

                                // Column header
                                ctx.fillStyle = col;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('p = ' + f.prime, cx, gridTop);
                                ctx.fillText('exp = ' + f.exp, cx, gridTop + 18);

                                // Show choices: 0, 1, ..., e_i
                                var choiceH = Math.min(28, (gridBot - gridTop - 50) / (f.exp + 1));
                                var choiceTop = gridTop + 44;

                                for (var a = 0; a <= f.exp; a++) {
                                    var cy = choiceTop + a * choiceH;
                                    var pw = Math.pow(f.prime, a);

                                    ctx.fillStyle = col + '22';
                                    ctx.fillRect(cx - colW * 0.4, cy, colW * 0.8, choiceH - 3);
                                    ctx.strokeStyle = col + '66';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx - colW * 0.4, cy, colW * 0.8, choiceH - 3);

                                    ctx.fillStyle = col;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    var choiceLabel = f.prime + '^' + a + ' = ' + pw;
                                    ctx.fillText(choiceLabel, cx, cy + (choiceH - 3) / 2);
                                }

                                // Choices count
                                ctx.fillStyle = col;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText((f.exp + 1) + ' choices', cx, choiceTop + (f.exp + 1) * choiceH + 6);
                            }

                            // Show actual divisors
                            var divs = getDivisors(targetNum);
                            var divAreaTop = gridBot + 30;
                            if (divs.length <= 60) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillText('All ' + divs.length + ' divisors:', 30, divAreaTop);

                                var perRow = Math.min(12, Math.ceil(Math.sqrt(divs.length * 2)));
                                var cellW = Math.min(50, (viz.width - 60) / perRow);
                                for (var d = 0; d < divs.length; d++) {
                                    var row = Math.floor(d / perRow);
                                    var col2 = d % perRow;
                                    var dx = 30 + col2 * cellW;
                                    var dy = divAreaTop + 18 + row * 18;
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                    ctx.fillText(divs[d].toString(), dx, dy);
                                }
                            } else {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText(divs.length + ' divisors (too many to list)', viz.width / 2, divAreaTop);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'How many positive divisors does \\(n = 2^4 \\times 3 \\times 7^2\\) have? List them all.',
                    hint: 'Use the formula \\(\\tau(n) = (e_1+1)(e_2+1)(e_3+1)\\).',
                    solution: '\\(\\tau(n) = (4+1)(1+1)(2+1) = 5 \\times 2 \\times 3 = 30\\) divisors. Each divisor has the form \\(2^a \\times 3^b \\times 7^c\\) with \\(0 \\leq a \\leq 4\\), \\(0 \\leq b \\leq 1\\), \\(0 \\leq c \\leq 2\\).'
                },
                {
                    question: 'Find the smallest positive integer with exactly 12 divisors.',
                    hint: '\\(12 = 12 = 6 \\times 2 = 4 \\times 3 = 3 \\times 2 \\times 2 = 2 \\times 2 \\times 3\\). Try different exponent patterns and see which gives the smallest number.',
                    solution: 'We need \\((e_1+1)(e_2+1)\\cdots = 12\\). Possible exponent lists (sorted descending): \\([11]\\), \\([5,1]\\), \\([3,2]\\), \\([2,1,1]\\). These give: \\(2^{11} = 2048\\), \\(2^5 \\times 3 = 96\\), \\(2^3 \\times 3^2 = 72\\), \\(2^2 \\times 3 \\times 5 = 60\\). The smallest is \\(\\boxed{60}\\).'
                },
                {
                    question: 'Compute \\(\\sigma(12)\\), the sum of divisors of 12.',
                    hint: '\\(12 = 2^2 \\times 3\\). Use the formula \\(\\sigma(n) = \\prod \\frac{p^{e+1}-1}{p-1}\\).',
                    solution: '\\(\\sigma(12) = \\frac{2^3 - 1}{2 - 1} \\times \\frac{3^2 - 1}{3 - 1} = \\frac{7}{1} \\times \\frac{8}{2} = 7 \\times 4 = 28\\). Check: divisors of 12 are 1, 2, 3, 4, 6, 12, and \\(1+2+3+4+6+12 = 28\\). \\(\\checkmark\\)'
                },
                {
                    question: 'If \\(\\tau(n) = 2\\), what can you say about \\(n\\)?',
                    hint: 'When does the product \\((e_1+1)(e_2+1)\\cdots\\) equal 2?',
                    solution: 'If \\(\\tau(n) = 2\\), then \\(n\\) has exactly one prime factor with exponent 1: \\(n = p^1\\) for some prime \\(p\\). In other words, \\(n\\) is prime. This gives another characterization of primes: they are exactly the integers with precisely two positive divisors.'
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
<h2>From Factorization to GCD and LCM</h2>

<div class="env-block intuition">
    <div class="env-title">Putting Factorization to Work</div>
    <div class="env-body">
        <p>Prime factorization is not just an end in itself; it is a tool for solving deeper problems. Two of the most important applications are computing the <strong>greatest common divisor</strong> (GCD) and the <strong>least common multiple</strong> (LCM) of two numbers.</p>
    </div>
</div>

<p>Given two numbers in prime power form, their GCD and LCM are remarkably easy to compute:</p>

<div class="env-block example">
    <div class="env-title">Preview: GCD and LCM from Factorization</div>
    <div class="env-body">
        <p>Let \\(a = 2^3 \\times 3^2 \\times 5 = 360\\) and \\(b = 2^2 \\times 3 \\times 5^2 \\times 7 = 2100\\).</p>
        <ul>
            <li>\\(\\gcd(a, b)\\): for each prime, take the <em>smaller</em> exponent. \\(\\gcd = 2^2 \\times 3^1 \\times 5^1 = 60\\).</li>
            <li>\\(\\text{lcm}(a, b)\\): for each prime, take the <em>larger</em> exponent. \\(\\text{lcm} = 2^3 \\times 3^2 \\times 5^2 \\times 7 = 12{,}600\\).</li>
        </ul>
        <p>Notice that \\(\\gcd(a,b) \\times \\text{lcm}(a,b) = 60 \\times 12{,}600 = 756{,}000 = 360 \\times 2{,}100 = a \\times b\\).</p>
    </div>
</div>

<p>In <strong>Chapter 6</strong>, we study the GCD in depth, developing efficient algorithms (like the Euclidean algorithm) that compute GCDs <em>without</em> needing to factorize first. For very large numbers, factorization is computationally expensive, so the Euclidean algorithm provides a much faster alternative.</p>

<div class="viz-placeholder" data-viz="viz-factor-tree-race"></div>

<h3>The Factorization Challenge</h3>

<p>Finding the prime factorization of small numbers is straightforward. But for very large numbers (hundreds of digits), no efficient algorithm is known. This computational difficulty is the foundation of the RSA cryptosystem, which secures much of the internet's communication. We will explore this connection in <strong>Chapter 16</strong>.</p>

<div class="viz-placeholder" data-viz="viz-largest-prime-factor"></div>

<h3>Summary</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.92em;">
    <tr style="border-bottom:2px solid var(--border-default);">
        <th style="padding:6px; text-align:left;">Concept</th>
        <th style="padding:6px; text-align:left;">Key Idea</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:6px;">Factor Tree</td>
        <td style="padding:6px;">Repeatedly split a number until all leaves are prime</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:6px;">Fundamental Theorem</td>
        <td style="padding:6px;">Every \\(n > 1\\) has a unique prime factorization</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:6px;">Prime Power Form</td>
        <td style="padding:6px;">\\(n = p_1^{e_1} p_2^{e_2} \\cdots p_r^{e_r}\\) with \\(p_1 < p_2 < \\cdots < p_r\\)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:6px;">Divisor Count \\(\\tau(n)\\)</td>
        <td style="padding:6px;">\\((e_1+1)(e_2+1)\\cdots(e_r+1)\\)</td>
    </tr>
    <tr>
        <td style="padding:6px;">Divisor Sum \\(\\sigma(n)\\)</td>
        <td style="padding:6px;">\\(\\prod \\frac{p_i^{e_i+1}-1}{p_i-1}\\)</td>
    </tr>
</table>

<div class="env-block remark">
    <div class="env-title">What Comes Next</div>
    <div class="env-body">
        <p>In <strong>Chapter 6</strong>, we move from factorization to the <strong>greatest common divisor</strong>. We will see how to find GCDs both by comparing prime factorizations and by the much more efficient Euclidean algorithm, one of the oldest algorithms still in use today.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-factor-tree-race',
                    title: 'Factor Tree Race',
                    description: 'Two different factorization paths race to decompose the same number. Both arrive at the same set of prime factors, illustrating the Fundamental Theorem.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 120;
                        var stepA = 0, stepB = 0;
                        var raceTimer = null;

                        function isPrime(n) {
                            if (n < 2) return false;
                            if (n < 4) return true;
                            if (n % 2 === 0 || n % 3 === 0) return false;
                            for (var i = 5; i * i <= n; i += 6) {
                                if (n % i === 0 || n % (i + 2) === 0) return false;
                            }
                            return true;
                        }

                        function smallestFactor(n) {
                            if (n % 2 === 0) return 2;
                            for (var i = 3; i * i <= n; i += 2) { if (n % i === 0) return i; }
                            return n;
                        }

                        // Path A: always smallest factor
                        function stepsSmallest(n) {
                            var steps = [{ val: n, action: 'start' }];
                            while (!isPrime(n) && n > 1) {
                                var sf = smallestFactor(n);
                                steps.push({ val: n, factor: sf, other: n / sf, action: 'split' });
                                n = n / sf;
                            }
                            return steps;
                        }

                        // Path B: largest proper factor pairs
                        function stepsLargest(n) {
                            var steps = [{ val: n, action: 'start' }];
                            var queue = [n];
                            while (queue.length > 0) {
                                var current = queue.shift();
                                if (isPrime(current) || current <= 1) continue;
                                var factors = [];
                                for (var i = 2; i * i <= current; i++) {
                                    if (current % i === 0) factors.push(i);
                                }
                                if (factors.length === 0) continue;
                                var f = factors[factors.length - 1];
                                steps.push({ val: current, factor: f, other: current / f, action: 'split' });
                                queue.push(f);
                                queue.push(current / f);
                            }
                            return steps;
                        }

                        function fullFactorize(n) {
                            var primes = [];
                            var d = 2;
                            while (d * d <= n) {
                                while (n % d === 0) { primes.push(d); n /= d; }
                                d++;
                            }
                            if (n > 1) primes.push(n);
                            return primes.sort(function(a, b) { return a - b; });
                        }

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number'; inp.min = 4; inp.max = 999; inp.value = targetNum;
                        inp.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 4 && v <= 999 && !isPrime(v)) { targetNum = v; stepA = 0; stepB = 0; draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Race!', function() {
                            stepA = 0; stepB = 0;
                            if (raceTimer) clearInterval(raceTimer);
                            var sA = stepsSmallest(targetNum);
                            var sB = stepsLargest(targetNum);
                            var maxSteps = Math.max(sA.length, sB.length);
                            raceTimer = setInterval(function() {
                                stepA = Math.min(stepA + 1, sA.length);
                                stepB = Math.min(stepB + 1, sB.length);
                                draw();
                                if (stepA >= sA.length && stepB >= sB.length) clearInterval(raceTimer);
                            }, 500);
                        });

                        VizEngine.createButton(controls, 'Show Result', function() {
                            stepA = 999; stepB = 999; draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var primes = fullFactorize(targetNum);

                            viz.screenText('Factor Tree Race: ' + targetNum, viz.width / 2, 20, viz.colors.white, 15);

                            var sA = stepsSmallest(targetNum);
                            var sB = stepsLargest(targetNum);
                            var showA = Math.min(stepA, sA.length);
                            var showB = Math.min(stepB, sB.length);

                            // Path A (left)
                            viz.screenText('Path A: Smallest Factor', viz.width / 4, 45, viz.colors.blue, 12);
                            var yA = 70;
                            var primesFoundA = [];
                            for (var i = 0; i < showA; i++) {
                                var s = sA[i];
                                if (s.action === 'start') {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(s.val.toString(), viz.width / 4, yA);
                                } else {
                                    yA += 30;
                                    // Show split
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(s.factor.toString(), viz.width / 4 - 50, yA);
                                    primesFoundA.push(s.factor);

                                    ctx.fillStyle = isPrime(s.other) ? viz.colors.teal : viz.colors.orange;
                                    ctx.fillText(s.other.toString(), viz.width / 4 + 50, yA);

                                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(viz.width / 4, yA - 20);
                                    ctx.lineTo(viz.width / 4 - 50, yA - 8); ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(viz.width / 4, yA - 20);
                                    ctx.lineTo(viz.width / 4 + 50, yA - 8); ctx.stroke();

                                    if (isPrime(s.other)) primesFoundA.push(s.other);
                                }
                            }

                            // Path B (right)
                            viz.screenText('Path B: Largest Factor', 3 * viz.width / 4, 45, viz.colors.purple, 12);
                            var yB = 70;
                            var primesFoundB = [];
                            for (var j = 0; j < showB; j++) {
                                var sb = sB[j];
                                if (sb.action === 'start') {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(sb.val.toString(), 3 * viz.width / 4, yB);
                                } else {
                                    yB += 30;
                                    ctx.fillStyle = isPrime(sb.factor) ? viz.colors.teal : viz.colors.orange;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(sb.factor.toString(), 3 * viz.width / 4 - 50, yB);
                                    if (isPrime(sb.factor)) primesFoundB.push(sb.factor);

                                    ctx.fillStyle = isPrime(sb.other) ? viz.colors.teal : viz.colors.orange;
                                    ctx.fillText(sb.other.toString(), 3 * viz.width / 4 + 50, yB);
                                    if (isPrime(sb.other)) primesFoundB.push(sb.other);

                                    ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(3 * viz.width / 4, yB - 20);
                                    ctx.lineTo(3 * viz.width / 4 - 50, yB - 8); ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(3 * viz.width / 4, yB - 20);
                                    ctx.lineTo(3 * viz.width / 4 + 50, yB - 8); ctx.stroke();
                                }
                            }

                            // Divider
                            ctx.strokeStyle = viz.colors.grid; ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath(); ctx.moveTo(viz.width / 2, 35); ctx.lineTo(viz.width / 2, viz.height - 40); ctx.stroke();
                            ctx.setLineDash([]);

                            // Result
                            if (showA >= sA.length && showB >= sB.length) {
                                var primesStr = primes.join(' \\u00D7 ');
                                viz.screenText('Both paths give: ' + targetNum + ' = ' + primesStr, viz.width / 2, viz.height - 18, viz.colors.green, 13);
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-largest-prime-factor',
                    title: 'Largest Prime Factor Finder',
                    description: 'Watch an animated search for the largest prime factor of N. The algorithm peels off small primes one by one until only the largest remains.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 580, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var targetNum = 2310;
                        var animSteps = [];
                        var animIdx = 0;
                        var animTimer = null;

                        function computeSteps(n) {
                            var steps = [];
                            var remaining = n;
                            var d = 2;
                            steps.push({ type: 'start', remaining: remaining, divisor: null, found: null });
                            while (d * d <= remaining) {
                                if (remaining % d === 0) {
                                    steps.push({ type: 'found', remaining: remaining, divisor: d, quotient: remaining / d });
                                    remaining = remaining / d;
                                    // Don't increment d; try same factor again
                                } else {
                                    steps.push({ type: 'try', remaining: remaining, divisor: d, quotient: null });
                                    d++;
                                }
                            }
                            if (remaining > 1) {
                                steps.push({ type: 'final', remaining: remaining, divisor: null, quotient: null });
                            }
                            return steps;
                        }

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:4px;';
                        var label = document.createElement('span');
                        label.className = 'viz-slider-label';
                        label.textContent = 'Number:';
                        var inp = document.createElement('input');
                        inp.type = 'number'; inp.min = 2; inp.max = 99999; inp.value = targetNum;
                        inp.style.cssText = 'width:90px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inp.addEventListener('change', function() {
                            var v = parseInt(inp.value);
                            if (v >= 2 && v <= 99999) { targetNum = v; animIdx = 0; animSteps = computeSteps(v); draw(); }
                        });
                        inputDiv.appendChild(label);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Animate', function() {
                            animIdx = 0;
                            animSteps = computeSteps(targetNum);
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animIdx++;
                                draw();
                                if (animIdx >= animSteps.length) clearInterval(animTimer);
                            }, 300);
                        });

                        VizEngine.createButton(controls, 'Show Result', function() {
                            animSteps = computeSteps(targetNum);
                            animIdx = animSteps.length;
                            draw();
                        });

                        animSteps = computeSteps(targetNum);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var shown = Math.min(animIdx, animSteps.length);

                            viz.screenText('Finding the Largest Prime Factor of ' + targetNum, viz.width / 2, 22, viz.colors.white, 15);

                            // Show found primes and the current remaining
                            var foundPrimes = [];
                            var currentRemaining = targetNum;

                            for (var i = 0; i < shown; i++) {
                                var s = animSteps[i];
                                if (s.type === 'found') {
                                    foundPrimes.push(s.divisor);
                                    currentRemaining = s.quotient;
                                }
                                if (s.type === 'final') {
                                    currentRemaining = s.remaining;
                                }
                            }

                            // Display the peeling process
                            var peelY = 60;
                            var peelStr = targetNum.toString();
                            var processStr = '';
                            if (foundPrimes.length > 0) {
                                processStr = targetNum + '';
                                var temp = targetNum;
                                for (var j = 0; j < foundPrimes.length; j++) {
                                    temp = temp / foundPrimes[j];
                                }
                                processStr += ' \\u00F7 ' + foundPrimes.join(' \\u00F7 ') + ' = ' + temp;
                            }
                            if (processStr) {
                                viz.screenText(processStr, viz.width / 2, peelY, viz.colors.white, 13);
                            }

                            // Bar display of found primes
                            var barY = 100;
                            var barH = 35;

                            if (foundPrimes.length > 0) {
                                viz.screenText('Small primes peeled off:', 100, barY, viz.colors.muted, 11);
                                for (var k = 0; k < foundPrimes.length; k++) {
                                    var bx = 30 + k * 50;
                                    ctx.fillStyle = viz.colors.blue + '44';
                                    ctx.fillRect(bx, barY + 15, 42, barH);
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(bx, barY + 15, 42, barH);
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(foundPrimes[k].toString(), bx + 21, barY + 15 + barH / 2);
                                }
                            }

                            // Current remaining
                            var remY = 190;
                            ctx.fillStyle = viz.colors.orange + '33';
                            ctx.fillRect(viz.width / 2 - 80, remY, 160, 50);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(viz.width / 2 - 80, remY, 160, 50);
                            viz.screenText('Remaining: ' + currentRemaining, viz.width / 2, remY + 25, viz.colors.orange, 16);

                            // Current divisor being tested
                            if (shown > 0 && shown <= animSteps.length) {
                                var lastStep = animSteps[Math.min(shown - 1, animSteps.length - 1)];
                                if (lastStep.type === 'try') {
                                    viz.screenText('Trying d = ' + lastStep.divisor + '... does not divide ' + lastStep.remaining, viz.width / 2, 270, viz.colors.red, 12);
                                } else if (lastStep.type === 'found') {
                                    viz.screenText('d = ' + lastStep.divisor + ' divides! ' + lastStep.remaining + ' \\u00F7 ' + lastStep.divisor + ' = ' + lastStep.quotient, viz.width / 2, 270, viz.colors.green, 12);
                                } else if (lastStep.type === 'final') {
                                    viz.screenText(lastStep.remaining + ' is prime. Largest prime factor found!', viz.width / 2, 270, viz.colors.teal, 13);
                                }
                            }

                            // Final result
                            if (shown >= animSteps.length && animSteps.length > 0) {
                                var lastS = animSteps[animSteps.length - 1];
                                var largest = lastS.type === 'final' ? lastS.remaining : (foundPrimes.length > 0 ? foundPrimes[foundPrimes.length - 1] : targetNum);
                                viz.screenText(
                                    'Largest prime factor of ' + targetNum + ' is ' + largest,
                                    viz.width / 2, viz.height - 30, viz.colors.teal, 15
                                );
                            }
                        }
                        animIdx = animSteps.length;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the prime factorization of 756 and determine \\(\\gcd(756, 360)\\) by comparing factorizations.',
                    hint: '\\(756 = 2^2 \\times 3^3 \\times 7\\). Compare with \\(360 = 2^3 \\times 3^2 \\times 5\\) and take the minimum exponent for each common prime.',
                    solution: '\\(756 = 2^2 \\times 3^3 \\times 7\\) and \\(360 = 2^3 \\times 3^2 \\times 5\\). For each prime, take \\(\\min\\) of exponents: \\(2^{\\min(2,3)} \\times 3^{\\min(3,2)} = 2^2 \\times 3^2 = 36\\). So \\(\\gcd(756, 360) = 36\\).'
                },
                {
                    question: 'What is the largest prime factor of 1001?',
                    hint: 'Try dividing by small primes: \\(1001 / 7 = 143\\). Then factor 143.',
                    solution: '\\(1001 = 7 \\times 143 = 7 \\times 11 \\times 13\\). The largest prime factor is \\(\\boxed{13}\\).'
                },
                {
                    question: 'Prove that \\(\\gcd(a,b) \\times \\text{lcm}(a,b) = a \\times b\\) using prime factorizations.',
                    hint: 'If \\(a = \\prod p_i^{a_i}\\) and \\(b = \\prod p_i^{b_i}\\), then \\(\\gcd = \\prod p_i^{\\min(a_i,b_i)}\\) and \\(\\text{lcm} = \\prod p_i^{\\max(a_i,b_i)}\\). Show that \\(\\min(a_i,b_i) + \\max(a_i,b_i) = a_i + b_i\\).',
                    solution: 'For each prime \\(p\\), let the exponent in \\(a\\) be \\(\\alpha\\) and in \\(b\\) be \\(\\beta\\). Then the exponent in \\(\\gcd\\) is \\(\\min(\\alpha,\\beta)\\) and in \\(\\text{lcm}\\) is \\(\\max(\\alpha,\\beta)\\). Since \\(\\min(\\alpha,\\beta) + \\max(\\alpha,\\beta) = \\alpha + \\beta\\) for any two real numbers, the exponent in \\(\\gcd \\times \\text{lcm}\\) equals \\(\\alpha + \\beta\\), which is the exponent in \\(a \\times b\\). This holds for every prime, so \\(\\gcd(a,b) \\times \\text{lcm}(a,b) = ab\\).'
                }
            ]
        }
    ]
});
