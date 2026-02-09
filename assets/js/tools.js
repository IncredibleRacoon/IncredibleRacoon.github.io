// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Trace Width Calculator (IPC-2221) ---
    const calcTrace = () => {
        const current = parseFloat(document.getElementById('trace-curr').value);
        const tempRise = parseFloat(document.getElementById('trace-temp').value);
        const thickness = parseFloat(document.getElementById('trace-thick').value); // oz
        const layer = document.getElementById('trace-layer').value;

        const resMils = document.getElementById('res-trace-mils');
        const resMm = document.getElementById('res-trace-mm');

        if (isNaN(current) || isNaN(tempRise) || isNaN(thickness) || current <= 0 || tempRise <= 0 || thickness <= 0) {
            resMils.textContent = '-';
            resMm.textContent = '-';
            return;
        }

        const k = (layer === 'external') ? 0.048 : 0.024;
        const b = 0.44;
        const c = 0.725;
        const areaSqMils = Math.pow((current / (k * Math.pow(tempRise, b))), (1/c));
        const thicknessMils = thickness * 1.378;
        const widthMils = areaSqMils / thicknessMils;
        const widthMm = widthMils * 0.0254;

        resMils.textContent = widthMils.toFixed(2) + ' mils';
        resMm.textContent = widthMm.toFixed(3) + ' mm';
    };

    const traceInputs = document.querySelectorAll('#tool-trace input, #tool-trace select');
    if (traceInputs.length > 0) {
        traceInputs.forEach(el => el.addEventListener('input', calcTrace));
    }


    // --- 2. Voltage Divider ---
    const calcDivider = () => {
        const vin = parseFloat(document.getElementById('div-vin').value);
        const r1 = parseFloat(document.getElementById('div-r1').value);
        const r2 = parseFloat(document.getElementById('div-r2').value);
        const resVout = document.getElementById('res-div-vout');

        if (isNaN(vin) || isNaN(r1) || isNaN(r2)) {
            resVout.textContent = '-';
            return;
        }
        if ((r1 + r2) === 0) {
            resVout.textContent = 'Err';
            return;
        }

        const vout = vin * (r2 / (r1 + r2));
        resVout.textContent = vout.toFixed(3) + ' V';
    };

    const divInputs = document.querySelectorAll('#tool-divider input');
    if (divInputs.length > 0) {
        divInputs.forEach(el => el.addEventListener('input', calcDivider));
    }


    // --- 3. LED Resistor ---
    const calcLed = () => {
        const vs = parseFloat(document.getElementById('led-vs').value);
        const vf = parseFloat(document.getElementById('led-vf').value);
        const ifwd = parseFloat(document.getElementById('led-if').value); // mA

        const resR = document.getElementById('res-led-r');
        const resP = document.getElementById('res-led-p');

        if (isNaN(vs) || isNaN(vf) || isNaN(ifwd) || ifwd <= 0) {
            resR.textContent = '-';
            resP.textContent = '-';
            return;
        }

        const iAmps = ifwd / 1000;
        const r = (vs - vf) / iAmps;
        const p = (vs - vf) * iAmps; 

        if (r < 0) {
            resR.textContent = 'Vs < Vf!';
            resP.textContent = '-';
        } else {
            resR.textContent = r.toFixed(1) + ' Ω';
            resP.textContent = (p * 1000).toFixed(1) + ' mW';
        }
    };

    const ledInputs = document.querySelectorAll('#tool-led input');
    if (ledInputs.length > 0) {
        ledInputs.forEach(el => el.addEventListener('input', calcLed));
    }


    // --- 4. Ohm's Law ---
    const calcOhm = () => {
        const uVal = document.getElementById('ohm-u').value;
        const rVal = document.getElementById('ohm-r').value;
        const iVal = document.getElementById('ohm-i').value;

        const u = parseFloat(uVal);
        const r = parseFloat(rVal);
        const i = parseFloat(iVal);

        let count = 0;
        if (!isNaN(u)) count++;
        if (!isNaN(r)) count++;
        if (!isNaN(i)) count++;

        const resU = document.getElementById('res-ohm-u');
        const resR = document.getElementById('res-ohm-r');
        const resI = document.getElementById('res-ohm-i');
        const resP = document.getElementById('res-ohm-p');

        if (count < 2) {
            resU.textContent = '-';
            resR.textContent = '-';
            resI.textContent = '-';
            resP.textContent = '-';
            return;
        }

        let finalU = u;
        let finalR = r;
        let finalI = i;

        if (isNaN(u)) {
            finalU = r * i;
        } else if (isNaN(r)) {
            if (i !== 0) finalR = u / i; else finalR = Infinity;
        } else if (isNaN(i)) {
            if (r !== 0) finalI = u / r; else finalI = Infinity;
        }

        const p = finalU * finalI;

        resU.textContent = isNaN(finalU) ? '-' : finalU.toFixed(2) + ' V';
        resR.textContent = isNaN(finalR) ? '-' : finalR.toFixed(2) + ' Ω';
        resI.textContent = isNaN(finalI) ? '-' : finalI.toFixed(3) + ' A';
        resP.textContent = isNaN(p) ? '-' : p.toFixed(3) + ' W';
    };

    const ohmInputs = document.querySelectorAll('#tool-ohm input');
    if (ohmInputs.length > 0) {
        ohmInputs.forEach(el => el.addEventListener('input', calcOhm));
    }


    // --- 5. Unit Converter (Mil <-> mm) ---
    const milInput = document.getElementById('conv-mil');
    const mmInput = document.getElementById('conv-mm');

    if (milInput && mmInput) {
        milInput.addEventListener('input', () => {
            const val = parseFloat(milInput.value);
            if (!isNaN(val)) {
                mmInput.value = (val * 0.0254).toFixed(4);
            } else {
                mmInput.value = '';
            }
        });

        mmInput.addEventListener('input', () => {
            const val = parseFloat(mmInput.value);
            if (!isNaN(val)) {
                milInput.value = (val / 0.0254).toFixed(2);
            } else {
                milInput.value = '';
            }
        });
    }


    // --- 7. Reactance (XC / XL) ---
    const calcReactance = () => {
        const f = parseFloat(document.getElementById('react-f').value);
        const c = parseFloat(document.getElementById('react-c').value);
        const l = parseFloat(document.getElementById('react-l').value);

        const resXc = document.getElementById('res-react-xc');
        const resXl = document.getElementById('res-react-xl');

        if (!isNaN(f) && !isNaN(c) && f > 0 && c > 0) {
            const freq = f * 1e3;
            const cap = c * 1e-9;
            const xc = 1 / (2 * Math.PI * freq * cap);
            resXc.textContent = xc.toFixed(2) + ' Ω';
        } else {
            resXc.textContent = '-';
        }

        if (!isNaN(f) && !isNaN(l) && f > 0 && l > 0) {
            const freq = f * 1e3;
            const ind = l * 1e-6;
            const xl = 2 * Math.PI * freq * ind;
            resXl.textContent = xl.toFixed(2) + ' Ω';
        } else {
            resXl.textContent = '-';
        }
    };

    const reactInputs = document.querySelectorAll('#tool-react input');
    if (reactInputs.length > 0) {
        reactInputs.forEach(el => el.addEventListener('input', calcReactance));
    }
    
    // --- 8. Battery Life Calculator ---
    const calcBattery = () => {
        const capacity = parseFloat(document.getElementById('bat-cap').value); // mAh
        const current = parseFloat(document.getElementById('bat-curr').value); // mA
        const derating = parseFloat(document.getElementById('bat-derate').value) || 0.85; // Default 0.85

        const resHours = document.getElementById('res-bat-hours');
        const resDays = document.getElementById('res-bat-days');

        if (isNaN(capacity) || isNaN(current) || capacity <= 0 || current <= 0) {
            resHours.textContent = '-';
            resDays.textContent = '-';
            return;
        }

        // Formula: (Capacity * Derating) / Current
        const hours = (capacity * derating) / current;
        const days = hours / 24;

        resHours.textContent = hours.toFixed(1) + ' h';
        resDays.textContent = days.toFixed(2) + ' d';
    };

    const batInputs = document.querySelectorAll('#tool-battery input');
    if (batInputs.length > 0) {
        batInputs.forEach(el => el.addEventListener('input', calcBattery));
    }

    // --- 9. Impedance Calculator (Microstrip) ---
    const calcImpedance = () => {
        const w = parseFloat(document.getElementById('imp-w').value);
        const h = parseFloat(document.getElementById('imp-h').value);
        const t = parseFloat(document.getElementById('imp-t').value);
        const er = parseFloat(document.getElementById('imp-er').value);

        const resZ0 = document.getElementById('res-imp-z0');

        if (isNaN(w) || isNaN(h) || isNaN(t) || isNaN(er) || w <= 0 || h <= 0 || t <= 0 || er <= 0) {
            resZ0.textContent = '-';
            return;
        }

        // IPC-2141 Formula for Surface Microstrip
        // Z0 = (87 / sqrt(Er + 1.41)) * ln( (5.98 * H) / (0.8 * W + T) )
        // Validity: 0.1 < W/H < 3.0 and 1 < Er < 15
        
        const term1 = 87 / Math.sqrt(er + 1.41);
        const term2 = Math.log((5.98 * h) / (0.8 * w + t));
        const z0 = term1 * term2;

        resZ0.textContent = z0.toFixed(2) + ' Ω';
    };

    const impInputs = document.querySelectorAll('#tool-impedance input');
    if (impInputs.length > 0) {
        impInputs.forEach(el => el.addEventListener('input', calcImpedance));
    }

});
