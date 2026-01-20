// --- Konfigurasi Bahasa ---
const isUSA = !navigator.language.startsWith('id');
const lang = {
    input: isUSA ? "Original Luau Script:" : "Script Luau Asli:",
    output: isUSA ? "Result (Ready for LuaU):" : "Hasil (Siap pakai di LuaU):",
    button: isUSA ? "GENERATE OBFUSCATED SCRIPT" : "GENERATE OBFUSCATED SCRIPT",
    working: isUSA ? "Processing... Please wait (Anti-Lag)" : "Memproses... Mohon tunggu (Anti-Lag)",
    done: isUSA ? "Done!" : "Selesai!"
};

// Terapkan bahasa ke UI
document.getElementById('ui-label-input').innerText = lang.input;
document.getElementById('ui-label-output').innerText = lang.output;
document.getElementById('btn-gen').innerText = lang.button;

const charToMorse = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/', 
    '.': '.-.-.-', ',': '--..--', '"': '.-..-.', "'": '.----.', ':': '---...', ';': '-.-.-.',
    '(': '-.--.', ')': '-.--.-', '=': '-...-', '+': '.-.-.', '-': '-....-', '/': '-..-.', 
    '_': '..--.-', '\n': '|', '!': '-.-.--'
};

async function generate() {
    const input = document.getElementById('input').value;
    const btn = document.getElementById('btn-gen');
    const status = document.getElementById('status');
    
    if (!input) return;

    btn.disabled = true;
    status.innerText = lang.working;

    let resultWords = [];
    const chars = input.split('');
    const chunkSize = 400; 

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        let isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
        let upperFlag = isUpper ? '^' : ''; 
        let code = charToMorse[char.toUpperCase()] || char;
        resultWords.push(upperFlag + code);

        // Jeda Anti-Lag
        if (i % chunkSize === 0) {
            await new Promise(res => setTimeout(res, 0));
        }
    }

    const morseResult = resultWords.join(' ');

    // Template Loader LuaU
    const finalScript = `-- [[ happyOBF ]]
local happyOBF = "${morseResult}"
local d = {[".-"]="A",["-..."]="B",["-.-."]="C",["-.."]="D",["."]="E",["..-."]="F",["--."]="G",["...."]="H",[".."]="I",[".---"]="J",["-.-"]="K",[".-.."]="L",["--"]="M",["-."]="N",["---"]="O",[".--."]="P",["--.-"]="Q",[".-."]="R",["..."]="S",["-"]="T",["..-"]="U",["...-"]="V",[".--"]="W",["-..-"]="X",["-.--"]="Y",["--.."]="Z",[".----"]="1",["..---"]="2",["...--"]="3",["....-"]="4",["....."]="5",["-...."]="6",["--..."]="7",["---.."]="8",["----."]="9",["-----"]="0",["/"]=" ",[".-.-.-"]=".",["--..--"]=",",[".-..-."]="\\\"",[".----."]="'",["---..."]=":",["-.-.-."]=";",["-.--."]="(",["-.--.-"]=")",["-...-"]="=",[".-.-."]="+",["-....-"]="-",["-..-."]="\\/",["|"]="\\n",["..--.-"]="_",["-.-.--"]="!"}
local res = ""
for word in happyOBF:gmatch("[%^%.-%/|_%!]+") do
    local isUpper = word:sub(1,1) == "^"
    local code = isUpper and word:sub(2) or word
    local char = d[code] or code
    res = res .. (isUpper and char or char:lower())
end
local s, e = loadstring(res)
if s then s() else warn("Error: " .. e) end`;

    document.getElementById('output').value = finalScript;
    status.innerText = lang.done;
    btn.disabled = false;
}
