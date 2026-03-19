window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: 'Secret Codes & Ciphers',
    subtitle: 'Number theory meets secret messages',
    sections: [
        // ================================================================
        // SECTION 1: Why Secret Codes?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Secret Codes?',
            content: `
<h2>Why Secret Codes?</h2>

<div class="env-block intuition">
    <div class="env-title">A Question to Start</div>
    <div class="env-body">
        <p>Suppose you want to send a secret message to your friend across the room, but everyone else can see the note as it passes from hand to hand. How can you write the message so that only your friend can read it?</p>
        <p>This is the fundamental problem of <strong>cryptography</strong>, the science of secret writing. And it turns out that number theory, the mathematics of whole numbers, provides the most powerful tools for solving it.</p>
    </div>
</div>

<p>People have been sending secret messages for thousands of years. Ancient generals needed to communicate battle plans without the enemy understanding intercepted messages. Diplomats, spies, and even lovers have all relied on codes and ciphers.</p>

<h3>Codes vs. Ciphers</h3>

<p>Although people often use "code" and "cipher" interchangeably, they mean different things:</p>

<ul>
    <li>A <strong>code</strong> replaces entire words or phrases with other words, numbers, or symbols. For example, "The eagle has landed" might mean "The package was delivered."</li>
    <li>A <strong>cipher</strong> transforms individual letters or groups of letters according to a mathematical rule. For example, replacing every A with D, every B with E, and so on.</li>
</ul>

<p>In this chapter, we study <strong>ciphers</strong>, because they are built on mathematics, specifically modular arithmetic.</p>

<h3>The Key Ingredients</h3>

<p>Every cipher system has three parts:</p>

<ol>
    <li><strong>Plaintext</strong>: the original message you want to protect.</li>
    <li><strong>Ciphertext</strong>: the scrambled version that looks like nonsense.</li>
    <li><strong>Key</strong>: the secret information needed to encrypt (scramble) and decrypt (unscramble) the message.</li>
</ol>

<p>The security of a good cipher should depend entirely on keeping the <strong>key</strong> secret, not on keeping the method secret. This principle, known as <strong>Kerckhoffs' principle</strong> (1883), is still the foundation of modern cryptography.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The word "cryptography" comes from the Greek <em>kryptos</em> (hidden) and <em>graphein</em> (to write). The oldest known cipher is the Atbash cipher used by Hebrew scholars around 600 BC, which reversed the alphabet (A becomes Z, B becomes Y, etc.).</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-secret-message"></div>
`,
            visualizations: [
                {
                    id: 'viz-secret-message',
                    title: 'Send a Secret Message',
                    description: 'Type a message and a shift key, then see it encoded. Share the ciphertext and key with a friend so they can decode it!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var message = 'HELLO WORLD';
                        var shift = 3;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        var msgInput = document.createElement('input');
                        msgInput.type = 'text';
                        msgInput.value = message;
                        msgInput.maxLength = 30;
                        msgInput.placeholder = 'Your message';
                        msgInput.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;width:200px;font-family:monospace;';
                        inputDiv.appendChild(msgInput);
                        controls.appendChild(inputDiv);

                        VizEngine.createSlider(controls, 'Shift (k)', 0, 25, shift, 1, function(v) {
                            shift = Math.round(v);
                            draw();
                        });

                        msgInput.addEventListener('input', function() {
                            message = msgInput.value.toUpperCase();
                            draw();
                        });

                        function caesarChar(ch, k) {
                            var code = ch.charCodeAt(0);
                            if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + k) % 26 + 26) % 26 + 65);
                            return ch;
                        }
                        function caesarEncrypt(text, k) {
                            return text.split('').map(function(c) { return caesarChar(c, k); }).join('');
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var plain = message.toUpperCase().replace(/[^A-Z ]/g, '');
                            var cipher = caesarEncrypt(plain, shift);

                            viz.screenText('Your Secret Message Encoder', viz.width / 2, 25, viz.colors.white, 16);

                            // Plaintext
                            viz.screenText('Plaintext:', 60, 70, viz.colors.text, 13, 'left');
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 18px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText(plain, 60, 100);

                            // Arrow
                            viz.screenText('shift +' + shift + ' (mod 26)', viz.width / 2, 135, viz.colors.orange, 13);
                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2, 145);
                            ctx.lineTo(viz.width / 2, 165);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(viz.width / 2 - 6, 159);
                            ctx.lineTo(viz.width / 2, 165);
                            ctx.lineTo(viz.width / 2 + 6, 159);
                            ctx.stroke();

                            // Ciphertext
                            viz.screenText('Ciphertext:', 60, 190, viz.colors.text, 13, 'left');
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 18px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText(cipher, 60, 220);

                            // Decryption hint
                            viz.screenText('To decrypt: shift -' + shift + ' (mod 26)', viz.width / 2, 265, viz.colors.teal, 12);

                            // Key info box
                            ctx.strokeStyle = viz.colors.purple + '66';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(60, 285, viz.width - 120, 40);
                            viz.screenText('Key: k = ' + shift + '   |   Share the key secretly, send the ciphertext openly!', viz.width / 2, 305, viz.colors.purple, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why is it important that the security of a cipher depends on the key, not on keeping the method secret? What would go wrong if security depended on the method being secret?',
                    hint: 'Think about what happens if many people use the same cipher system. Can a method really stay secret if thousands of people know it?',
                    solution: 'If security depends on keeping the method secret, then once anyone figures out the method (by analysis, espionage, or reverse engineering), every message ever sent with that method becomes readable. With a key-based system, even if everyone knows the method, each message is protected by its own key. Compromising one key does not compromise other messages.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: Caesar Cipher
        // ================================================================
        {
            id: 'sec-caesar',
            title: 'Caesar Cipher',
            content: `
<h2>The Caesar Cipher</h2>

<div class="env-block intuition">
    <div class="env-title">Shift Every Letter</div>
    <div class="env-body">
        <p>The simplest cipher is named after Julius Caesar, who used it in his military correspondence. The idea: replace each letter with the letter a fixed number of positions later in the alphabet, wrapping around from Z back to A.</p>
    </div>
</div>

<h3>The Mathematics</h3>

<p>Number the letters A = 0, B = 1, C = 2, ..., Z = 25. Choose a <strong>shift</strong> \\(k\\) (the key). To encrypt a letter with number \\(x\\):</p>

\\[
E(x) = (x + k) \\mod 26
\\]

<p>To decrypt a ciphertext letter with number \\(y\\):</p>

\\[
D(y) = (y - k) \\mod 26
\\]

<p>This works because modular arithmetic wraps around: after Z (25), we go back to A (0). The shift \\(k = 3\\) was Caesar's own choice.</p>

<div class="env-block example">
    <div class="env-title">Example: Caesar's Shift of 3</div>
    <div class="env-body">
        <p>Encrypt "MATH" with \\(k = 3\\):</p>
        <ul>
            <li>M = 12, so \\(E(12) = (12+3) \\mod 26 = 15\\) = P</li>
            <li>A = 0, so \\(E(0) = (0+3) \\mod 26 = 3\\) = D</li>
            <li>T = 19, so \\(E(19) = (19+3) \\mod 26 = 22\\) = W</li>
            <li>H = 7, so \\(E(7) = (7+3) \\mod 26 = 10\\) = K</li>
        </ul>
        <p>So "MATH" becomes "PDWK". To decrypt "PDWK", shift each letter back by 3.</p>
    </div>
</div>

<div class="env-block definition">
    <div class="env-title">Definition (Caesar Cipher)</div>
    <div class="env-body">
        <p>The <strong>Caesar cipher</strong> with key \\(k \\in \\{0, 1, 2, \\ldots, 25\\}\\) is the function \\(E_k : \\mathbb{Z}_{26} \\to \\mathbb{Z}_{26}\\) defined by \\(E_k(x) = (x+k) \\bmod 26\\). Its inverse (decryption) is \\(D_k(y) = (y-k) \\bmod 26\\).</p>
    </div>
</div>

<p>Notice that the Caesar cipher is just modular addition. The letter wheel visualization below makes this tangible: rotating the inner wheel by \\(k\\) positions aligns each plaintext letter with its ciphertext counterpart.</p>

<div class="viz-placeholder" data-viz="viz-caesar-encoder"></div>
`,
            visualizations: [
                {
                    id: 'viz-caesar-encoder',
                    title: 'Caesar Cipher Encoder/Decoder',
                    description: 'Type a message and set the shift. Watch the animated letter wheel show how each letter transforms. Toggle between Encrypt and Decrypt modes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var message = 'NUMBER THEORY';
                        var shift = 3;
                        var encrypting = true;
                        var animAngle = 0;
                        var targetAngle = shift * (2 * Math.PI / 26);

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        var msgInput = document.createElement('input');
                        msgInput.type = 'text';
                        msgInput.value = message;
                        msgInput.maxLength = 20;
                        msgInput.placeholder = 'Message';
                        msgInput.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;width:160px;font-family:monospace;';
                        inputDiv.appendChild(msgInput);
                        controls.appendChild(inputDiv);

                        VizEngine.createSlider(controls, 'Shift k', 0, 25, shift, 1, function(v) {
                            shift = Math.round(v);
                            targetAngle = shift * (2 * Math.PI / 26);
                        });

                        var modeBtn = VizEngine.createButton(controls, 'Mode: Encrypt', function() {
                            encrypting = !encrypting;
                            modeBtn.textContent = encrypting ? 'Mode: Encrypt' : 'Mode: Decrypt';
                        });

                        msgInput.addEventListener('input', function() {
                            message = msgInput.value.toUpperCase();
                        });

                        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                        function caesarChar(ch, k) {
                            var i = ALPHA.indexOf(ch);
                            if (i < 0) return ch;
                            return ALPHA[((i + k) % 26 + 26) % 26];
                        }

                        viz.animate(function() {
                            // Smooth rotation
                            var diff = targetAngle - animAngle;
                            animAngle += diff * 0.12;

                            viz.clear();
                            var ctx = viz.ctx;
                            var cx = 160, cy = 200, outerR = 120, innerR = 88;

                            // Outer ring (fixed, plaintext)
                            for (var i = 0; i < 26; i++) {
                                var angle = -Math.PI / 2 + i * (2 * Math.PI / 26);
                                var lx = cx + outerR * Math.cos(angle);
                                var ly = cy + outerR * Math.sin(angle);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 13px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(ALPHA[i], lx, ly);
                            }

                            // Inner ring (rotated, ciphertext)
                            for (var j = 0; j < 26; j++) {
                                var angle2 = -Math.PI / 2 + j * (2 * Math.PI / 26) + animAngle;
                                var lx2 = cx + innerR * Math.cos(angle2);
                                var ly2 = cy + innerR * Math.sin(angle2);
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(ALPHA[j], lx2, ly2);
                            }

                            // Center label
                            viz.screenText('k = ' + shift, cx, cy, viz.colors.orange, 16);

                            // Outer/inner circles
                            ctx.strokeStyle = viz.colors.blue + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.arc(cx, cy, outerR + 12, 0, Math.PI * 2); ctx.stroke();
                            ctx.strokeStyle = viz.colors.green + '44';
                            ctx.beginPath(); ctx.arc(cx, cy, innerR - 10, 0, Math.PI * 2); ctx.stroke();

                            // Right side: message encoding
                            var plain = message.toUpperCase().replace(/[^A-Z ]/g, '');
                            var k = encrypting ? shift : -shift;
                            var result = plain.split('').map(function(c) { return caesarChar(c, k); }).join('');

                            var rightX = 350;
                            viz.screenText(encrypting ? 'ENCRYPT' : 'DECRYPT', rightX + 80, 40, viz.colors.orange, 14);

                            viz.screenText(encrypting ? 'Plaintext:' : 'Ciphertext:', rightX, 75, viz.colors.text, 12, 'left');
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 14px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText(plain, rightX, 100);

                            viz.screenText(encrypting ? 'Ciphertext:' : 'Plaintext:', rightX, 140, viz.colors.text, 12, 'left');
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 14px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText(result, rightX, 165);

                            // Show letter-by-letter mapping
                            var showChars = Math.min(plain.replace(/ /g, '').length, 8);
                            var plainNoSpace = plain.replace(/ /g, '');
                            var yStart = 210;
                            for (var m = 0; m < showChars; m++) {
                                var pc = plainNoSpace[m];
                                var rc = caesarChar(pc, k);
                                var pi = ALPHA.indexOf(pc);
                                var ri = ALPHA.indexOf(rc);
                                if (pi < 0) continue;
                                var rowY = yStart + m * 22;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'left';
                                ctx.fillText(pc + ' (' + pi + ')', rightX, rowY);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText(encrypting ? ' +' + shift : ' -' + shift, rightX + 55, rowY);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(' mod 26 = ' + ri, rightX + 90, rowY);
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px monospace';
                                ctx.fillText(' = ' + rc, rightX + 170, rowY);
                            }

                            // Labels
                            viz.screenText('Outer: plaintext', cx, cy + outerR + 30, viz.colors.blue, 10);
                            viz.screenText('Inner: ciphertext (rotated)', cx, cy + outerR + 45, viz.colors.green, 10);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Encrypt the message "PRIME" using a Caesar cipher with shift \\(k = 7\\).',
                    hint: 'Convert each letter to its number (P=15, R=17, I=8, M=12, E=4), add 7, then take mod 26.',
                    solution: 'P(15) + 7 = 22 = W, R(17) + 7 = 24 = Y, I(8) + 7 = 15 = P, M(12) + 7 = 19 = T, E(4) + 7 = 11 = L. The ciphertext is "WYPTL".'
                },
                {
                    question: 'Decrypt "WKLV LV D WHVW" using a Caesar cipher with shift \\(k = 3\\).',
                    hint: 'To decrypt, subtract the shift: \\(D(y) = (y - 3) \\bmod 26\\).',
                    solution: 'W(22) - 3 = 19 = T, K(10) - 3 = 7 = H, L(11) - 3 = 8 = I, V(21) - 3 = 18 = S, and so on. The plaintext is "THIS IS A TEST".'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Breaking Caesar
        // ================================================================
        {
            id: 'sec-breaking',
            title: 'Breaking Caesar',
            content: `
<h2>Breaking the Caesar Cipher</h2>

<div class="env-block intuition">
    <div class="env-title">Why Caesar Is Weak</div>
    <div class="env-body">
        <p>The Caesar cipher has a fatal flaw: there are only 26 possible keys (shifts 0 through 25). An attacker can simply try all 26 and see which one produces readable text. This is called a <strong>brute-force attack</strong>.</p>
    </div>
</div>

<h3>Brute Force</h3>

<p>With only 26 keys, even trying them by hand takes just a few minutes. A computer can try all 26 in microseconds. This makes the Caesar cipher essentially useless for real security.</p>

<h3>Frequency Analysis</h3>

<p>But there is an even cleverer method that does not require trying all keys. In English text, letters appear with very different frequencies:</p>

<ul>
    <li><strong>E</strong> is the most common letter (about 12.7% of all letters).</li>
    <li><strong>T, A, O, I, N, S, H, R</strong> are also very common.</li>
    <li><strong>Z, Q, X, J</strong> are rare.</li>
</ul>

<p>A Caesar cipher shifts all letters by the same amount, so the frequency pattern is preserved, just shifted. If the most common letter in the ciphertext is H, and the most common letter in English is E, then the shift is probably \\(H - E = 7 - 4 = 3\\).</p>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.1 (Caesar Cipher Vulnerability)</div>
    <div class="env-body">
        <p>The Caesar cipher preserves the frequency distribution of letters. For sufficiently long ciphertext, the shift \\(k\\) can be recovered by comparing the ciphertext letter frequencies with known English letter frequencies.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Breaking a Cipher</div>
    <div class="env-body">
        <p>Suppose you intercept the ciphertext "WKLV LV D VHFUHW PHVVDJH". Count the letters: V appears 4 times, H appears 3 times, W appears 2 times. The most frequent letter is V. In English, the most frequent letter is E. Since V = 21 and E = 4, the likely shift is \\(21 - 4 = 17\\). Decrypting with shift 17: "THIS IS A SECRET MESSAGE". Success!</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-caesar-breaker"></div>

<div class="viz-placeholder" data-viz="viz-letter-frequency"></div>
`,
            visualizations: [
                {
                    id: 'viz-caesar-breaker',
                    title: 'Caesar Cipher Breaker',
                    description: 'Paste or type a ciphertext below. The tool tries all 26 shifts so you can find the one that produces readable English.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var ciphertext = 'WKLV LV D VHFUHW PHVVDJH';
                        var viewOffset = 0;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        var ctInput = document.createElement('input');
                        ctInput.type = 'text';
                        ctInput.value = ciphertext;
                        ctInput.maxLength = 40;
                        ctInput.placeholder = 'Ciphertext';
                        ctInput.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;width:280px;font-family:monospace;';
                        inputDiv.appendChild(ctInput);
                        controls.appendChild(inputDiv);

                        VizEngine.createSlider(controls, 'Scroll shifts', 0, 13, 0, 1, function(v) {
                            viewOffset = Math.round(v);
                            draw();
                        });

                        ctInput.addEventListener('input', function() {
                            ciphertext = ctInput.value.toUpperCase();
                            draw();
                        });

                        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        function caesarDecrypt(text, k) {
                            return text.split('').map(function(c) {
                                var idx = ALPHA.indexOf(c);
                                if (idx < 0) return c;
                                return ALPHA[((idx - k) % 26 + 26) % 26];
                            }).join('');
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Try All 26 Shifts', viz.width / 2, 20, viz.colors.white, 15);

                            var ct = ciphertext.toUpperCase().replace(/[^A-Z ]/g, '');
                            var rowH = 28;
                            var startY = 50;
                            var shown = Math.min(13, 26 - viewOffset);

                            for (var k = 0; k < shown; k++) {
                                var shiftVal = viewOffset + k;
                                var decrypted = caesarDecrypt(ct, shiftVal);
                                var rowY = startY + k * rowH;

                                // Shift label
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 11px monospace';
                                ctx.textAlign = 'right';
                                ctx.fillText('k=' + (shiftVal < 10 ? ' ' : '') + shiftVal, 45, rowY + 4);

                                // Decrypted text
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = '12px monospace';
                                ctx.textAlign = 'left';
                                var displayText = decrypted.length > 35 ? decrypted.substring(0, 35) + '...' : decrypted;
                                ctx.fillText(displayText, 55, rowY + 4);

                                // Highlight line on hover area
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(55, rowY + 14);
                                ctx.lineTo(viz.width - 20, rowY + 14);
                                ctx.stroke();
                            }

                            viz.screenText('Look for the shift that produces readable English!', viz.width / 2, viz.height - 20, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-letter-frequency',
                    title: 'English Letter Frequencies vs. Ciphertext',
                    description: 'Compare the frequency of letters in English with the frequency in a ciphertext. The shift between the two distributions reveals the key.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        var engFreq = [8.2,1.5,2.8,4.3,12.7,2.2,2.0,6.1,7.0,0.15,0.77,4.0,2.4,
                                       6.7,7.5,1.9,0.095,6.0,6.3,9.1,2.8,0.98,2.4,0.15,2.0,0.074];

                        var sampleText = 'WKLV LV D VHFUHW PHVVDJH WKDW ZH ZDQW WR NHHS VDIH';

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        var ctInput = document.createElement('input');
                        ctInput.type = 'text';
                        ctInput.value = sampleText;
                        ctInput.maxLength = 60;
                        ctInput.placeholder = 'Ciphertext to analyze';
                        ctInput.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;width:340px;font-family:monospace;';
                        inputDiv.appendChild(ctInput);
                        controls.appendChild(inputDiv);

                        ctInput.addEventListener('input', function() {
                            sampleText = ctInput.value.toUpperCase();
                            draw();
                        });

                        function countFreq(text) {
                            var counts = new Array(26).fill(0);
                            var total = 0;
                            for (var i = 0; i < text.length; i++) {
                                var idx = ALPHA.indexOf(text[i]);
                                if (idx >= 0) { counts[idx]++; total++; }
                            }
                            if (total === 0) return counts;
                            return counts.map(function(c) { return c / total * 100; });
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var cipherFreq = countFreq(sampleText.toUpperCase());

                            viz.screenText('Letter Frequency Comparison', viz.width / 2, 18, viz.colors.white, 14);

                            var barW = 8;
                            var gap = 2;
                            var totalW = 26 * (barW * 2 + gap * 2 + 2);
                            var startX = (viz.width - totalW) / 2;
                            var chartBottom = 300;
                            var chartH = 220;
                            var maxFreq = 14;

                            // Y axis
                            for (var p = 0; p <= maxFreq; p += 2) {
                                var yy = chartBottom - (p / maxFreq) * chartH;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(p + '%', startX - 6, yy + 3);
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.3;
                                ctx.beginPath(); ctx.moveTo(startX, yy); ctx.lineTo(startX + totalW, yy); ctx.stroke();
                            }

                            for (var i = 0; i < 26; i++) {
                                var x = startX + i * (barW * 2 + gap * 2 + 2);

                                // English frequency bar
                                var h1 = (engFreq[i] / maxFreq) * chartH;
                                ctx.fillStyle = viz.colors.blue + '88';
                                ctx.fillRect(x, chartBottom - h1, barW, h1);

                                // Ciphertext frequency bar
                                var h2 = (cipherFreq[i] / maxFreq) * chartH;
                                ctx.fillStyle = viz.colors.green + '88';
                                ctx.fillRect(x + barW + gap, chartBottom - h2, barW, h2);

                                // Letter label
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(ALPHA[i], x + barW, chartBottom + 12);
                            }

                            // Legend
                            var legY = chartBottom + 30;
                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(viz.width / 2 - 120, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('English', viz.width / 2 - 105, legY + 9);

                            ctx.fillStyle = viz.colors.green + '88';
                            ctx.fillRect(viz.width / 2 + 20, legY, 10, 10);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Ciphertext', viz.width / 2 + 35, legY + 9);

                            // Find most common cipher letter
                            var maxIdx = 0;
                            for (var j = 1; j < 26; j++) {
                                if (cipherFreq[j] > cipherFreq[maxIdx]) maxIdx = j;
                            }
                            var likelyShift = ((maxIdx - 4) % 26 + 26) % 26;
                            viz.screenText(
                                'Most common ciphertext letter: ' + ALPHA[maxIdx] +
                                '  (E is most common in English)  =>  likely shift k = ' + likelyShift,
                                viz.width / 2, legY + 30, viz.colors.orange, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The ciphertext "YMJWJ FWJ RNSY UWNRJX" was encrypted with a Caesar cipher. Use frequency analysis or brute force to find the plaintext.',
                    hint: 'Try shifting back by different amounts. The letter J appears frequently in the ciphertext. In English, E is the most common letter. What shift turns J into E?',
                    solution: 'J = 9 and E = 4, so the likely shift is \\(9 - 4 = 5\\). Decrypting with \\(k = 5\\): Y(24)-5=19=T, M(12)-5=7=H, J(9)-5=4=E, W(22)-5=17=R, J(9)-5=4=E. The plaintext is "THERE ARE MINT PRIMES". (Actually "MANY PRIMES" for the full decode, verifying shift 5.)'
                },
                {
                    question: 'Why does frequency analysis work on the Caesar cipher but would not work on a cipher that maps each letter to a random, unrelated letter?',
                    hint: 'Think about what structure the Caesar cipher preserves. Does a random mapping preserve the same structure?',
                    solution: 'The Caesar cipher applies the same shift to every letter, so the frequency distribution is simply shifted but not rearranged. The most common plaintext letter maps to the most common ciphertext letter. A random substitution (where A might map to Q, B to M, C to Z, etc.) scrambles the frequency distribution, though even then, frequency analysis can work since E will still map to whichever letter appears most often. The difference is that Caesar has only 26 possible keys while a general substitution has \\(26! \\approx 4 \\times 10^{26}\\) keys, making brute force impossible.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Affine Cipher
        // ================================================================
        {
            id: 'sec-affine',
            title: 'Affine Cipher',
            content: `
<h2>The Affine Cipher</h2>

<div class="env-block intuition">
    <div class="env-title">Multiply, Then Add</div>
    <div class="env-body">
        <p>The Caesar cipher only shifts letters. What if we also <strong>multiply</strong>? The affine cipher encrypts by computing \\(E(x) = (ax + b) \\bmod 26\\), where \\(a\\) and \\(b\\) are the key. This gives a much larger key space, but there is a catch: not every value of \\(a\\) works.</p>
    </div>
</div>

<h3>Encryption and Decryption</h3>

<p>The affine cipher uses two numbers as the key: \\(a\\) (the multiplicative key) and \\(b\\) (the additive key, like a Caesar shift).</p>

\\[
E(x) = (ax + b) \\bmod 26
\\]

<p>To decrypt, we need to solve for \\(x\\):</p>

\\[
y = ax + b \\pmod{26} \\implies x = a^{-1}(y - b) \\bmod 26
\\]

<p>where \\(a^{-1}\\) is the <strong>modular inverse</strong> of \\(a\\) modulo 26.</p>

<h3>The GCD Requirement</h3>

<div class="env-block theorem">
    <div class="env-title">Theorem 16.2 (Affine Cipher Invertibility)</div>
    <div class="env-body">
        <p>The affine cipher \\(E(x) = (ax + b) \\bmod 26\\) can be decrypted if and only if \\(\\gcd(a, 26) = 1\\). When this holds, \\(a\\) has a modular inverse modulo 26, and decryption is \\(D(y) = a^{-1}(y - b) \\bmod 26\\).</p>
    </div>
</div>

<p>Why must \\(\\gcd(a, 26) = 1\\)? If \\(a\\) shares a factor with 26, then different plaintext letters can map to the same ciphertext letter, making decryption impossible.</p>

<div class="env-block example">
    <div class="env-title">Example: Why \\(a = 2\\) Fails</div>
    <div class="env-body">
        <p>With \\(a = 2, b = 0\\): A(0) maps to 0, B(1) maps to 2, ..., N(13) maps to 0 again! Both A and N encrypt to the same letter. We lose information, so decryption is impossible.</p>
        <p>Since \\(\\gcd(2, 26) = 2 \\neq 1\\), the function \\(x \\mapsto 2x \\bmod 26\\) is not one-to-one.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: \\(a = 5, b = 8\\)</div>
    <div class="env-body">
        <p>Since \\(\\gcd(5, 26) = 1\\), this works. The inverse of 5 mod 26 is 21 (because \\(5 \\times 21 = 105 = 4 \\times 26 + 1 \\equiv 1 \\pmod{26}\\)).</p>
        <p>Encrypt M (12): \\(E(12) = (5 \\cdot 12 + 8) \\bmod 26 = 68 \\bmod 26 = 16\\) = Q.</p>
        <p>Decrypt Q (16): \\(D(16) = 21 \\cdot (16 - 8) \\bmod 26 = 21 \\cdot 8 \\bmod 26 = 168 \\bmod 26 = 12\\) = M. &#10003;</p>
    </div>
</div>

<p>The valid values of \\(a\\) are those coprime to 26: \\(a \\in \\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\\}\\). That gives 12 choices for \\(a\\) and 26 for \\(b\\), yielding \\(12 \\times 26 = 312\\) possible keys (compared to only 26 for Caesar).</p>

<div class="viz-placeholder" data-viz="viz-affine-encoder"></div>

<div class="viz-placeholder" data-viz="viz-modular-inverse-needed"></div>
`,
            visualizations: [
                {
                    id: 'viz-affine-encoder',
                    title: 'Affine Cipher Encoder/Decoder',
                    description: 'Set the multiplicative key \\(a\\) and additive key \\(b\\). Type a message and see it encoded. Invalid values of \\(a\\) (where \\(\\gcd(a,26) \\neq 1\\)) are flagged.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var message = 'AFFINE';
                        var a = 5, b = 8;
                        var encrypting = true;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
                        var msgInput = document.createElement('input');
                        msgInput.type = 'text';
                        msgInput.value = message;
                        msgInput.maxLength = 20;
                        msgInput.placeholder = 'Message';
                        msgInput.style.cssText = 'padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;width:140px;font-family:monospace;';
                        inputDiv.appendChild(msgInput);
                        controls.appendChild(inputDiv);

                        VizEngine.createSlider(controls, 'a (multiply)', 1, 25, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b (shift)', 0, 25, b, 1, function(v) { b = Math.round(v); draw(); });

                        var modeBtn = VizEngine.createButton(controls, 'Mode: Encrypt', function() {
                            encrypting = !encrypting;
                            modeBtn.textContent = encrypting ? 'Mode: Encrypt' : 'Mode: Decrypt';
                            draw();
                        });

                        msgInput.addEventListener('input', function() {
                            message = msgInput.value.toUpperCase();
                            draw();
                        });

                        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function modInverse(val, mod) {
                            for (var i = 1; i < mod; i++) {
                                if ((val * i) % mod === 1) return i;
                            }
                            return -1;
                        }

                        function affineEncrypt(ch, aa, bb) {
                            var idx = ALPHA.indexOf(ch);
                            if (idx < 0) return ch;
                            return ALPHA[((aa * idx + bb) % 26 + 26) % 26];
                        }

                        function affineDecrypt(ch, aa, bb) {
                            var idx = ALPHA.indexOf(ch);
                            if (idx < 0) return ch;
                            var inv = modInverse(aa, 26);
                            if (inv < 0) return '?';
                            return ALPHA[((inv * (idx - bb)) % 26 + 26) % 26];
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var valid = gcd(a, 26) === 1;
                            var plain = message.toUpperCase().replace(/[^A-Z ]/g, '');

                            viz.screenText('Affine Cipher: E(x) = (' + a + 'x + ' + b + ') mod 26', viz.width / 2, 25, viz.colors.white, 15);

                            // GCD check
                            var gcdVal = gcd(a, 26);
                            if (valid) {
                                viz.screenText('gcd(' + a + ', 26) = 1  =>  Valid key', viz.width / 2, 55, viz.colors.green, 12);
                                var inv = modInverse(a, 26);
                                viz.screenText('a\u207B\u00B9 = ' + inv + ' (mod 26)    [since ' + a + ' x ' + inv + ' = ' + (a * inv) + ' = ' + ((a * inv) % 26) + ' mod 26]', viz.width / 2, 75, viz.colors.teal, 11);
                            } else {
                                viz.screenText('gcd(' + a + ', 26) = ' + gcdVal + ' \u2260 1  =>  INVALID (not invertible!)', viz.width / 2, 55, viz.colors.red, 12);
                                viz.screenText('Different letters will map to the same ciphertext letter!', viz.width / 2, 75, viz.colors.red, 11);
                            }

                            // Full mapping table
                            var startY = 105;
                            var cellW = Math.floor((viz.width - 40) / 26);
                            var tableX = (viz.width - cellW * 26) / 2;

                            // Plain row
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var i = 0; i < 26; i++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(ALPHA[i], tableX + i * cellW + cellW / 2, startY);
                            }

                            // Arrow indicators
                            viz.screenText('\u2193', tableX - 10, startY + 12, viz.colors.orange, 10);

                            // Cipher row
                            for (var j = 0; j < 26; j++) {
                                var enc = affineEncrypt(ALPHA[j], a, b);
                                ctx.fillStyle = valid ? viz.colors.green : viz.colors.red;
                                ctx.font = '9px monospace';
                                ctx.fillText(enc, tableX + j * cellW + cellW / 2, startY + 22);
                            }

                            // Check for collisions if invalid
                            if (!valid) {
                                var seen = {};
                                var collisions = [];
                                for (var c = 0; c < 26; c++) {
                                    var mapped = ((a * c + b) % 26 + 26) % 26;
                                    if (seen[mapped] !== undefined) {
                                        collisions.push(ALPHA[seen[mapped]] + ' and ' + ALPHA[c] + ' both map to ' + ALPHA[mapped]);
                                    }
                                    seen[mapped] = c;
                                }
                                if (collisions.length > 0) {
                                    viz.screenText('Collisions: ' + collisions.slice(0, 3).join('; ') + (collisions.length > 3 ? '...' : ''), viz.width / 2, startY + 45, viz.colors.red, 10);
                                }
                            }

                            // Encode/decode the message
                            var resultY = startY + 75;
                            var operation = encrypting ? 'Encrypt' : 'Decrypt';
                            viz.screenText(operation + ':', 60, resultY, viz.colors.text, 13, 'left');

                            if (valid) {
                                var transform = encrypting ? affineEncrypt : affineDecrypt;
                                var result = plain.split('').map(function(c) { return transform(c, a, b); }).join('');

                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 15px monospace';
                                ctx.textAlign = 'left';
                                ctx.fillText(plain, 60, resultY + 28);

                                viz.screenText('\u2193  E(x) = (' + a + 'x + ' + b + ') mod 26', 60, resultY + 50, viz.colors.orange, 11, 'left');

                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 15px monospace';
                                ctx.textAlign = 'left';
                                ctx.fillText(result, 60, resultY + 72);

                                // Step-by-step for first few letters
                                var plainNoSpace = plain.replace(/ /g, '');
                                var stepY = resultY + 100;
                                var showN = Math.min(plainNoSpace.length, 6);
                                for (var s = 0; s < showN; s++) {
                                    var pc = plainNoSpace[s];
                                    var pi = ALPHA.indexOf(pc);
                                    if (pi < 0) continue;
                                    var ri;
                                    if (encrypting) {
                                        ri = ((a * pi + b) % 26 + 26) % 26;
                                    } else {
                                        var inv2 = modInverse(a, 26);
                                        ri = ((inv2 * (pi - b)) % 26 + 26) % 26;
                                    }
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px monospace';
                                    ctx.textAlign = 'left';
                                    if (encrypting) {
                                        ctx.fillText(pc + '(' + pi + ') => (' + a + '\u00B7' + pi + '+' + b + ') mod 26 = ' + ((a * pi + b)) + ' mod 26 = ' + ri + ' = ' + ALPHA[ri], 60, stepY + s * 18);
                                    } else {
                                        var inv3 = modInverse(a, 26);
                                        ctx.fillText(pc + '(' + pi + ') => ' + inv3 + '\u00B7(' + pi + '-' + b + ') mod 26 = ' + ri + ' = ' + ALPHA[ri], 60, stepY + s * 18);
                                    }
                                }
                            } else {
                                viz.screenText('Cannot encode: a = ' + a + ' is not coprime to 26', 60, resultY + 28, viz.colors.red, 13, 'left');
                            }
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-modular-inverse-needed',
                    title: 'Why gcd(a, 26) = 1 Is Needed',
                    description: 'See what happens when the multiplicative key \\(a\\) shares a factor with 26. Letters collide, making decryption impossible.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 0, originY: 0, scale: 1
                        });

                        var a = 2;
                        VizEngine.createSlider(controls, 'a', 1, 25, a, 1, function(v) { a = Math.round(v); draw(); });

                        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                        function gcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var valid = gcd(a, 26) === 1;
                            var g = gcd(a, 26);

                            viz.screenText('Mapping x \u2192 ' + a + 'x mod 26', viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText(
                                'gcd(' + a + ', 26) = ' + g + (valid ? '  => ONE-TO-ONE (invertible)' : '  => NOT one-to-one (collisions!)'),
                                viz.width / 2, 45,
                                valid ? viz.colors.green : viz.colors.red, 13
                            );

                            // Draw mapping: left column = input, right column = output
                            var leftX = 100, rightX = 420;
                            var topY = 70, spacing = 10.5;

                            // Count how many inputs map to each output
                            var outputMap = {};
                            for (var i = 0; i < 26; i++) {
                                var out = (a * i) % 26;
                                if (!outputMap[out]) outputMap[out] = [];
                                outputMap[out].push(i);
                            }

                            // Assign colors for collision groups
                            var collisionColors = [viz.colors.red, viz.colors.orange, viz.colors.yellow, viz.colors.pink,
                                                   viz.colors.purple, viz.colors.teal, viz.colors.blue];

                            for (var j = 0; j < 26; j++) {
                                var outVal = (a * j) % 26;
                                var isCollision = outputMap[outVal].length > 1;
                                var y = topY + j * spacing;

                                // Input letter
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '10px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(ALPHA[j] + '(' + (j < 10 ? ' ' : '') + j + ')', leftX, y);

                                // Arrow
                                var lineColor = isCollision ? viz.colors.red + '66' : viz.colors.green + '44';
                                ctx.strokeStyle = lineColor;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(leftX + 30, y - 3);
                                ctx.lineTo(rightX - 30, topY + outVal * spacing - 3);
                                ctx.stroke();

                                // Output letter
                                ctx.fillStyle = isCollision ? viz.colors.red : viz.colors.green;
                                ctx.font = '10px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(ALPHA[outVal] + '(' + (outVal < 10 ? ' ' : '') + outVal + ')', rightX, topY + outVal * spacing);
                            }

                            // Labels
                            viz.screenText('Input (plaintext)', leftX, topY - 15, viz.colors.blue, 11);
                            viz.screenText('Output (ciphertext)', rightX, topY - 15, valid ? viz.colors.green : viz.colors.red, 11);

                            var distinctOutputs = Object.keys(outputMap).length;
                            viz.screenText(
                                distinctOutputs + ' distinct outputs out of 26' + (valid ? '' : ' (information lost!)'),
                                viz.width / 2, viz.height - 15,
                                valid ? viz.colors.green : viz.colors.red, 11
                            );
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'List all values of \\(a\\) between 1 and 25 for which the affine cipher \\(E(x) = (ax + b) \\bmod 26\\) is valid. How many are there?',
                    hint: 'You need \\(\\gcd(a, 26) = 1\\). Since \\(26 = 2 \\times 13\\), you need \\(a\\) to be odd and not a multiple of 13.',
                    solution: 'The valid values are \\(a \\in \\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\\}\\). There are 12 such values. This equals \\(\\varphi(26) = \\varphi(2) \\cdot \\varphi(13) = 1 \\times 12 = 12\\), where \\(\\varphi\\) is Euler\'s totient function.'
                },
                {
                    question: 'Find the modular inverse of 7 modulo 26. Then decrypt the letter "T" (= 19) using the affine cipher with \\(a = 7, b = 3\\).',
                    hint: 'Try values \\(i = 1, 2, 3, \\ldots\\) until \\(7i \\equiv 1 \\pmod{26}\\). Then compute \\(D(19) = 7^{-1}(19 - 3) \\bmod 26\\).',
                    solution: '\\(7 \\times 15 = 105 = 4 \\times 26 + 1\\), so \\(7^{-1} \\equiv 15 \\pmod{26}\\). Decryption: \\(D(19) = 15 \\times (19 - 3) \\bmod 26 = 15 \\times 16 \\bmod 26 = 240 \\bmod 26 = 6\\). The plaintext letter is G.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Public Key Idea
        // ================================================================
        {
            id: 'sec-public-key',
            title: 'Public Key Idea',
            content: `
<h2>The Public Key Idea</h2>

<div class="env-block intuition">
    <div class="env-title">The Lock and Key Analogy</div>
    <div class="env-body">
        <p>All the ciphers we have seen so far require the sender and receiver to share a secret key. But how do they agree on the key without someone eavesdropping?</p>
        <p>Imagine a lock that anyone can close but only you can open (because only you have the key). You send open locks to everyone. They put their messages in a box, snap your lock shut, and send it back. Only you can open it. This is the idea behind <strong>public key cryptography</strong>.</p>
    </div>
</div>

<h3>Trapdoor Functions</h3>

<p>Public key cryptography relies on <strong>trapdoor functions</strong>: mathematical operations that are easy to do in one direction but extremely hard to reverse without special information.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Trapdoor Function)</div>
    <div class="env-body">
        <p>A <strong>trapdoor function</strong> is a function \\(f\\) such that:</p>
        <ul>
            <li>Computing \\(f(x)\\) from \\(x\\) is <strong>easy</strong> (fast, even for large inputs).</li>
            <li>Computing \\(x\\) from \\(f(x)\\) is <strong>hard</strong> (practically impossible for large inputs) without special "trapdoor" information.</li>
        </ul>
    </div>
</div>

<h3>Multiplication vs. Factoring</h3>

<p>The most famous trapdoor in number theory is multiplication versus factoring:</p>

<ul>
    <li><strong>Easy direction</strong>: given two prime numbers \\(p\\) and \\(q\\), multiply them to get \\(n = p \\times q\\). Even for 100-digit primes, a computer does this instantly.</li>
    <li><strong>Hard direction</strong>: given \\(n\\), find \\(p\\) and \\(q\\). For 100-digit primes, this could take millions of years with current computers.</li>
</ul>

<div class="env-block example">
    <div class="env-title">Example: Easy vs. Hard</div>
    <div class="env-body">
        <p><strong>Easy</strong>: \\(61 \\times 53 = 3{,}233\\). Done in one step.</p>
        <p><strong>Hard</strong>: Factor 3233. You would need to try dividing by 2, 3, 5, 7, 11, ..., up to \\(\\sqrt{3233} \\approx 56.9\\). Eventually you find \\(3233 = 53 \\times 61\\). For small numbers this is doable, but the difficulty grows exponentially with the size of \\(n\\).</p>
    </div>
</div>

<h3>Preview of RSA</h3>

<p>The RSA cryptosystem (Rivest, Shamir, Adleman, 1977) uses this trapdoor:</p>

<ol>
    <li>Choose two large primes \\(p\\) and \\(q\\). Compute \\(n = pq\\).</li>
    <li>The <strong>public key</strong> (available to everyone) includes \\(n\\). Anyone can encrypt using \\(n\\).</li>
    <li>The <strong>private key</strong> (kept secret) requires knowing \\(p\\) and \\(q\\). Only the holder can decrypt.</li>
</ol>

<p>Because factoring \\(n\\) back into \\(p\\) and \\(q\\) is practically impossible for large primes, the encrypted message is safe even though the encryption method and public key are known to everyone.</p>

<div class="env-block remark">
    <div class="env-title">How Large Is Large?</div>
    <div class="env-body">
        <p>Modern RSA uses primes with about 300 digits each, making \\(n\\) about 600 digits long. The largest number factored by a general-purpose algorithm (as of 2020) had 250 digits and took years of computation on many computers. So 600-digit numbers are safe for now.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-trapdoor-function"></div>
`,
            visualizations: [
                {
                    id: 'viz-trapdoor-function',
                    title: 'Trapdoor Function: Multiply vs. Factor',
                    description: 'Experience the asymmetry yourself. Multiplying two primes is instant. Factoring their product takes work. Try the timed challenge!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 420,
                            originX: 0, originY: 0, scale: 1
                        });

                        var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
                        var p = 0, q = 0, product = 0;
                        var factorGuessP = '';
                        var factorGuessQ = '';
                        var multiplyTime = 0;
                        var showProduct = false;
                        var challengeActive = false;
                        var challengeN = 0;
                        var challengeP = 0;
                        var challengeQ = 0;
                        var challengeStart = 0;
                        var challengeSolved = false;
                        var challengeTime = 0;

                        function randomPrime() {
                            return primes[Math.floor(Math.random() * primes.length)];
                        }

                        var genBtn = VizEngine.createButton(controls, 'Generate Two Primes', function() {
                            p = randomPrime();
                            q = randomPrime();
                            while (q === p) q = randomPrime();
                            showProduct = false;
                            challengeActive = false;
                            challengeSolved = false;
                            draw();
                        });

                        var mulBtn = VizEngine.createButton(controls, 'Multiply! (Easy)', function() {
                            if (p === 0 || q === 0) return;
                            var start = performance.now();
                            product = p * q;
                            multiplyTime = (performance.now() - start).toFixed(3);
                            showProduct = true;
                            draw();
                        });

                        var chalBtn = VizEngine.createButton(controls, 'Factor Challenge!', function() {
                            challengeP = primes[5 + Math.floor(Math.random() * (primes.length - 5))];
                            challengeQ = primes[5 + Math.floor(Math.random() * (primes.length - 5))];
                            while (challengeQ === challengeP) challengeQ = primes[5 + Math.floor(Math.random() * (primes.length - 5))];
                            challengeN = challengeP * challengeQ;
                            challengeActive = true;
                            challengeSolved = false;
                            challengeStart = Date.now();
                            factorGuessP = '';
                            factorGuessQ = '';
                            draw();
                        });

                        // Factor input
                        var factorDiv = document.createElement('div');
                        factorDiv.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:4px;';
                        var label = document.createElement('span');
                        label.textContent = 'Your factors: ';
                        label.style.cssText = 'color:#8b949e;font-size:0.8rem;';
                        factorDiv.appendChild(label);
                        var pInput = document.createElement('input');
                        pInput.type = 'number';
                        pInput.placeholder = 'p';
                        pInput.style.cssText = 'padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.8rem;width:60px;';
                        factorDiv.appendChild(pInput);
                        var timesLabel = document.createElement('span');
                        timesLabel.textContent = ' x ';
                        timesLabel.style.cssText = 'color:#8b949e;font-size:0.8rem;';
                        factorDiv.appendChild(timesLabel);
                        var qInput = document.createElement('input');
                        qInput.type = 'number';
                        qInput.placeholder = 'q';
                        qInput.style.cssText = 'padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.8rem;width:60px;';
                        factorDiv.appendChild(qInput);
                        var checkBtn = VizEngine.createButton(factorDiv, 'Check', function() {
                            if (!challengeActive || challengeSolved) return;
                            var gp = parseInt(pInput.value);
                            var gq = parseInt(qInput.value);
                            if ((gp === challengeP && gq === challengeQ) || (gp === challengeQ && gq === challengeP)) {
                                challengeSolved = true;
                                challengeTime = ((Date.now() - challengeStart) / 1000).toFixed(1);
                            }
                            draw();
                        });
                        controls.appendChild(factorDiv);

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Trapdoor Function: Multiply vs. Factor', viz.width / 2, 22, viz.colors.white, 15);

                            // Left: Easy direction
                            ctx.strokeStyle = viz.colors.green + '44';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(20, 50, 250, 150);
                            viz.screenText('EASY: Multiply', 145, 70, viz.colors.green, 14);

                            if (p > 0 && q > 0) {
                                viz.screenText('p = ' + p, 90, 110, viz.colors.blue, 18);
                                viz.screenText('q = ' + q, 200, 110, viz.colors.blue, 18);
                                if (showProduct) {
                                    viz.screenText(p + ' x ' + q + ' = ' + product, 145, 150, viz.colors.green, 16);
                                    viz.screenText('Time: ' + multiplyTime + ' ms', 145, 175, viz.colors.teal, 11);
                                } else {
                                    viz.screenText('Click "Multiply!" to compute', 145, 155, viz.colors.text, 11);
                                }
                            } else {
                                viz.screenText('Click "Generate Two Primes"', 145, 130, viz.colors.text, 12);
                            }

                            // Right: Hard direction
                            ctx.strokeStyle = viz.colors.red + '44';
                            ctx.strokeRect(290, 50, 250, 150);
                            viz.screenText('HARD: Factor', 415, 70, viz.colors.red, 14);

                            if (challengeActive) {
                                viz.screenText('n = ' + challengeN, 415, 110, viz.colors.orange, 20);
                                viz.screenText('Find p and q such that p x q = ' + challengeN, 415, 140, viz.colors.text, 11);

                                if (challengeSolved) {
                                    viz.screenText('Solved in ' + challengeTime + ' seconds!', 415, 170, viz.colors.green, 13);
                                    viz.screenText(challengeP + ' x ' + challengeQ + ' = ' + challengeN, 415, 190, viz.colors.green, 12);
                                } else {
                                    var elapsed = ((Date.now() - challengeStart) / 1000).toFixed(1);
                                    viz.screenText('Time: ' + elapsed + 's ...', 415, 175, viz.colors.yellow, 11);
                                }
                            } else {
                                viz.screenText('Click "Factor Challenge!"', 415, 130, viz.colors.text, 12);
                            }

                            // Comparison
                            viz.screenText('The Asymmetry of Number Theory', viz.width / 2, 230, viz.colors.white, 14);
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(40, 245); ctx.lineTo(viz.width - 40, 245); ctx.stroke();

                            var infoY = 268;
                            viz.screenText('Multiplying two primes:', 165, infoY, viz.colors.green, 12, 'center');
                            viz.screenText('O(n) digit operations', 165, infoY + 20, viz.colors.green, 11, 'center');
                            viz.screenText('Factoring their product:', 415, infoY, viz.colors.red, 12, 'center');
                            viz.screenText('No known fast algorithm!', 415, infoY + 20, viz.colors.red, 11, 'center');

                            // Size comparison
                            var barY = infoY + 55;
                            viz.screenText('Difficulty for n-digit numbers:', viz.width / 2, barY, viz.colors.text, 11);
                            // Multiply bar (short)
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillRect(60, barY + 18, 80, 14);
                            viz.screenText('Multiply', 60, barY + 40, viz.colors.green, 10, 'left');
                            // Factor bar (long)
                            ctx.fillStyle = viz.colors.red;
                            ctx.fillRect(60, barY + 50, 440, 14);
                            viz.screenText('Factor', 60, barY + 72, viz.colors.red, 10, 'left');

                            viz.screenText('This asymmetry is the foundation of RSA and modern internet security.', viz.width / 2, viz.height - 15, viz.colors.purple, 11);
                        }
                        draw();

                        // Update timer while challenge is active
                        viz.animate(function() {
                            if (challengeActive && !challengeSolved) {
                                draw();
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Factor the number 5141 into two primes. How many divisions did you need to try?',
                    hint: 'Try dividing by primes up to \\(\\sqrt{5141} \\approx 71.7\\). You need to test 2, 3, 5, 7, 11, 13, ..., up to 71.',
                    solution: '5141 is odd (not divisible by 2), not divisible by 3 (digit sum = 11), not by 5, not by 7 (5141/7 = 734.4...), not by 11 (5141/11 = 467.4...), not by 13, not by 17, not by 19, not by 23, not by 29, not by 31, not by 37, not by 41, not by 43, not by 47, not by 53 (5141/53 = 97.0). So \\(5141 = 53 \\times 97\\). We needed about 15 trial divisions. For larger numbers, this becomes impractical.'
                },
                {
                    question: 'Explain in your own words why public key cryptography solves the "key exchange problem" that the Caesar and affine ciphers have.',
                    hint: 'With Caesar/affine ciphers, both sender and receiver must know the same key. How do they share it without an eavesdropper learning it?',
                    solution: 'With symmetric ciphers (Caesar, affine), both parties need the same key. To share this key, they need a secure channel, but if they had a secure channel, they wouldn\'t need encryption in the first place! Public key cryptography breaks this circle: the receiver publishes a public key that anyone can use to encrypt, but only the receiver (who holds the private key) can decrypt. No secret key ever needs to be transmitted.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to Further Study
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Looking Forward',
            content: `
<h2>Looking Forward</h2>

<p>In this chapter, we have seen how the number theory concepts from earlier chapters, modular arithmetic, GCD, primes, and factoring, come together in a beautiful and practical application: cryptography.</p>

<h3>What We Built On</h3>

<table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr style="border-bottom:1px solid #30363d;">
        <th style="text-align:left;padding:8px;color:#58a6ff;">Number Theory Concept</th>
        <th style="text-align:left;padding:8px;color:#58a6ff;">Cryptographic Application</th>
    </tr>
    <tr style="border-bottom:1px solid #1a1a40;">
        <td style="padding:8px;">Modular arithmetic (Ch 9-11)</td>
        <td style="padding:8px;">Caesar cipher: \\(E(x) = (x+k) \\bmod 26\\)</td>
    </tr>
    <tr style="border-bottom:1px solid #1a1a40;">
        <td style="padding:8px;">GCD and coprimality (Ch 6-7)</td>
        <td style="padding:8px;">Affine cipher: \\(\\gcd(a, 26) = 1\\) needed for decryption</td>
    </tr>
    <tr style="border-bottom:1px solid #1a1a40;">
        <td style="padding:8px;">Modular inverses (Ch 10)</td>
        <td style="padding:8px;">Affine decryption: \\(D(y) = a^{-1}(y-b) \\bmod 26\\)</td>
    </tr>
    <tr style="border-bottom:1px solid #1a1a40;">
        <td style="padding:8px;">Prime numbers (Ch 3-5)</td>
        <td style="padding:8px;">RSA: security based on difficulty of factoring \\(n = pq\\)</td>
    </tr>
    <tr>
        <td style="padding:8px;">Euler's totient function</td>
        <td style="padding:8px;">RSA key generation uses \\(\\varphi(n) = (p-1)(q-1)\\)</td>
    </tr>
</table>

<h3>Beyond This Chapter</h3>

<p>The ciphers in this chapter are historically important but not secure by modern standards. Real-world cryptography goes much further:</p>

<ul>
    <li><strong>RSA</strong> uses modular exponentiation with enormous primes (300+ digits each).</li>
    <li><strong>Elliptic curve cryptography</strong> uses the geometry of special curves over finite fields.</li>
    <li><strong>AES</strong> (Advanced Encryption Standard) uses matrix operations over \\(\\text{GF}(2^8)\\).</li>
    <li><strong>Quantum-resistant cryptography</strong> uses lattice problems and other structures believed to be hard even for quantum computers.</li>
</ul>

<p>All of these advanced methods are built on the same foundation: number theory. The simple ideas of divisibility, primes, and modular arithmetic that we have studied throughout this book are the building blocks of the security that protects every internet transaction, every encrypted message, and every digital signature in the modern world.</p>

<div class="env-block remark">
    <div class="env-title">A Final Thought</div>
    <div class="env-body">
        <p>When Euclid proved that there are infinitely many primes around 300 BC, he could not have imagined that this fact would one day protect billions of online transactions every day. Number theory was called "the queen of mathematics" by Gauss, and for centuries it was considered the purest, most abstract branch of math, with no practical applications. Cryptography proved everyone wrong: the most abstract mathematics turned out to be the most useful.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The RSA public key includes \\(n = pq\\) and an exponent \\(e\\). The private key includes \\(d\\) such that \\(ed \\equiv 1 \\pmod{\\varphi(n)}\\). If \\(p = 5\\) and \\(q = 11\\), compute \\(n\\) and \\(\\varphi(n)\\). Then find \\(d\\) if \\(e = 3\\).',
                    hint: '\\(n = 5 \\times 11 = 55\\). Euler\'s totient: \\(\\varphi(55) = (5-1)(11-1) = 40\\). You need \\(3d \\equiv 1 \\pmod{40}\\).',
                    solution: '\\(n = 55\\), \\(\\varphi(55) = 4 \\times 10 = 40\\). We need \\(3d \\equiv 1 \\pmod{40}\\). Try \\(d = 27\\): \\(3 \\times 27 = 81 = 2 \\times 40 + 1\\), so \\(81 \\equiv 1 \\pmod{40}\\). The private key exponent is \\(d = 27\\).'
                }
            ]
        }
    ]
});
