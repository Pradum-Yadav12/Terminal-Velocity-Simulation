// Step counter
let ins_step = 1;
let calculate = 0;
const tableData = [];
const ins_step_content = {
    1: "Click on Start Button to begin the experiment.",
    2: "Click the bottle cap to move it forward.",
    3: "Drop water into the beaker by Click on the bottle.",
    4: "Observe the screw gauge and note the readings.",
    5: "Release the small ball and observe its motion.",
    6: "Release the small ball again for the second reading.",
    7: "Release the small ball for the third reading and calculate mean time.",
    8: "Release the medium ball and observe its motion.",
    9: "Release the medium ball again for the second reading.",
    10: "Release the medium ball for the third reading and calculate mean time.",
    11: "Release the large ball and observe its motion.",
    12: "Release the large ball again for the second reading.",
    13: "Release the large ball for the third reading and calculate mean time.",
    14: "Experiment completed. You may review the data table."
}

// Constants for animation timing
const ANIM_DELAY = 4000;
const RESET_DELAY = 7000;
const WATER_ANIM_DELAY = 3000;
const FULL_BEAKER_DELAY = 4000;
const FINAL_ANIM_DELAY = 8000;
const MESSAGE_DELAY = 10000;

const time_img = {
    5: '3.60-removebg-preview.png',
    6: '3.50-removebg-preview.png',
    7: '3.55-removebg-preview.png',
    8: '3.10-removebg-preview.png',
    9: '3.00-removebg-preview.png',
    10: '3.05-removebg-preview.png',
    11: '2.60-removebg-preview.png',
    12: '2.55-removebg-preview.png',
    13: '2.50-removebg-preview.png',
}

// Get DOM elements (safe queries)
const startBtn = document.getElementById("start-btn");
const arrow = document.querySelector(".arrow-pointer");
const stopWatch = document.querySelector(".apparatus-5 .stop-watch");


const instruction_show = () => {
    const instructionText = document.getElementById('instruction-text');
    if (!instructionText) return;

    instructionText.textContent = ins_step_content[ins_step] || "";
}

// Step change on Start button click
startBtn?.addEventListener("click", () => {
    const setup1 = document.getElementById('setup1');
    const setup2 = document.getElementById('setup2');
    if (!setup1 || !setup2) return;
    if (ins_step === 1) {
        setup1.style.display = "none";
        setup2.style.display = "block";
        ins_step++;
        instruction_show();
    }
});

// Move cap forward when step = 2
const setMoveCap_forward = () => {
    if (ins_step === 2) {
        const element = document.getElementById('cap_app_2');
        if (!element) return;
        element.classList.add('apparatus-2-cap-move-forwards');
        ins_step++;
        instruction_show();
    }
};
// NOTE: call setMoveCap_forward() from wherever appropriate (e.g., button or after start)

// Drop water animation sequence
const dropWater = () => {
    if (ins_step !== 3) return;

    const cap = document.getElementById('cap_app_2');
    const bottle = document.getElementById('bottle_app_2');
    const beaker = document.getElementById('Beaker_app_1');
    const waterStrip = document.getElementById('waterstrip');

    if (!cap || !bottle || !beaker || !waterStrip) {
        console.warn("dropWater: required elements missing");
        return;
    }

    bottle.classList.add('apparatus-2-bottle');

    // Show water stream
    setTimeout(() => {
        waterStrip.style.height = '200px';
        waterStrip.style.display = 'block';
        waterStrip.style.visibility = 'visible';
    }, WATER_ANIM_DELAY);

    // Fill the beaker
    setTimeout(() => {
        beaker.src = "./images/fullBeaker.png";
        beaker.style.width = '150px';
        beaker.style.height = '321.39px';
    }, FULL_BEAKER_DELAY);

    // Hide water stream, change bottle image, move bottle back
    setTimeout(() => {
        waterStrip.style.visibility = 'hidden';
        bottle.src = "./images/half_bottle.png";
        bottle.classList.add('apparatus-2-backPositionBeaker');
    }, FULL_BEAKER_DELAY + 200);

    // Replace with bottle + cap image, show new apparatus
    setTimeout(() => {
        bottle.src = "../images/halfwaterwithcap.png";
        cap.style.display = "none";
        const app4 = document.querySelector(".apparatus-4");
        const app5 = document.querySelector(".apparatus-5");
        if (app4) app4.style.display = "block";
        if (app5) app5.style.display = "block";
    }, FINAL_ANIM_DELAY);

    // Show message box
    setTimeout(() => {
        messaga_open("measurement_screw_gauge.png");
    }, MESSAGE_DELAY);

    ins_step++;
    instruction_show();
};

// Open message box with an image
const messaga_open = (img_name) => { // kept name to match original
    const msgBox = document.querySelector('.message-box');
    const msgImg = document.querySelector('.message-img');

    if (!msgBox || !msgImg) return;

    msgImg.src = `../experiment_img/${img_name}`;
    console.log(msgImg.src);

    msgBox.style.display = 'flex';
};

// Close message and continue animation
const close_message = () => {
    const msgBox = document.querySelector('.message-box');
    if (!msgBox) return;

    // if message closed at step 4, reveal arrow & lines then trigger stopwatch animation
    if (ins_step === 4) {
        const yzLine = document.querySelector('.line-y-z');
        const arrowCont = document.querySelector('.arrow-container');
        const stopwatchEl = document.querySelector('.apparatus-5 .stop-watch');

        msgBox.style.display = 'none';
        if (yzLine) yzLine.style.display = 'flex';
        if (arrowCont) arrowCont.style.display = 'block';

        // trigger stopwatch movement after a short delay
        setTimeout(() => {
            if (stopwatchEl) {
                stopwatchEl.style.animationName = 'move-stop-watch';
            }
        }, 1000);

        ins_step++;
        instruction_show();
        return;
    }

    // If called when ins_step === 5 or other, simply hide
    if (ins_step === 5) {
        msgBox.style.display = 'none';
    }
};

// ---------------- Table handling ----------------

const setExprimentData = (setNo, meanR, times) => {
    // Note: "setExprimentData" kept to match your original name
    let object_data = {
        setNo: setNo,
        meanR: meanR,
        times: times.slice(), // copy array to be safe
        meanT: null,
        v: null,
        correctedV: null
    };
    tableData.push(object_data);
};

// updateExperimentData: setNo MUST match the setNo used in setExprimentData
const updateExprimentData = (setNo, index_, time) => {
    let objIndex = tableData.findIndex((obj => obj.setNo == setNo));
    if (objIndex === -1) {
        console.warn(`updateExprimentData: setNo ${setNo} not found`);
        return;
    }

    // ensure times array exists and index is valid
    if (!Array.isArray(tableData[objIndex].times)) tableData[objIndex].times = [];
    tableData[objIndex].times[index_] = Number(time);
};

// Function to generate table
function renderTable(StartCalculation = 0) {
    let html = `
        <table class="pro-table">
            <tr>
                <th>Set_No</th>
                <th>Ball_No</th>
                <th>Mean r(cm)</th>
                <th>Time(s)</th>
                <th>Mean t(s)</th>
                <th>v' = l/t (cm/s)</th>
                <th>Corrected v (cm/s)</th>
            </tr>
    `;

    tableData.forEach(row => {
        // ensure times is an array with length 3 for display logic
        const times = row.times || [];
        // show exactly 3 rows even if some entries missing
        for (let index = 0; index < 3; index++) {
            const time = times[index];
            html += `
                <tr>
                    ${index === 0 ? `<td rowspan="3">${row.setNo ? row.setNo : '—'}</td>` : ""}
                    <td>${index + 1}</td>
                    ${index === 0 ? `<td rowspan="3">${row.meanR != null ? row.meanR : '—'}</td>` : ""}
                    <td>${typeof time === 'number' ? time.toFixed(2) : (time ? Number(time).toFixed(2) : '—')}</td>
                    ${index === 0 ? `<td rowspan="3">${row.meanT != null ? Number(row.meanT).toFixed(2) : '—'}</td>` : ""}
                    ${index === 0 ? `<td rowspan="3">${row.v != null ? row.v : '—'}</td>` : ""}
                    ${index === 0 ? `<td rowspan="3">${row.correctedV != null ? row.correctedV : '—'}</td>` : ""}
                </tr>
            `;
        }
    });

    html += "</table>";

    if (StartCalculation === 1) {
        document.querySelector('.table-record-close-btn').style.display = "none";
        document.getElementById('table-record-btn-cal').style.display = "block";
    }

    document.querySelector('.table-record').style.display = 'block';
    const container = document.getElementById("table-record-container-id");
    if (container) container.innerHTML = html;
}

function closeTable() {
    if (ins_step === 14) {
        window.location.reload();
        return;
    } else {
        const el = document.querySelector('.table-record');
        if (el) el.style.display = 'none';
    }

}

const calculate_ = () => {
    // safety: ensure tableData exists
    if (!Array.isArray(tableData) || tableData.length === 0) {
        console.warn("calculate_: tableData empty or not an array");
        return;
    }

    // Only update entries that exist — use >= so step advances still produce results
    if (ins_step >= 13 && tableData[0]) {
        tableData[2] = {
            ...tableData[2],
            meanT: 2.55,
            v: 15.69,
            correctedV: 18.09
        };
    }

    if (ins_step >= 10 && tableData[1]) {
        tableData[1] = {
            ...tableData[1],
            meanT: 3.05,
            v: 13.11,
            correctedV: 14.78
        };
    }

    if (ins_step >= 7 && tableData[0]) {
        tableData[0] = {
            ...tableData[0],
            meanT: 3.55,
            v: 11.27,
            correctedV: 12.42
        };
    }

    console.log("After calculation, tableData:", tableData);

    // safe DOM updates
    const closeBtn = document.querySelector('.table-record-close-btn');
    const calcBtn = document.getElementById('table-record-btn-cal');
    if (closeBtn) closeBtn.style.display = "block";
    if (calcBtn) calcBtn.style.display = "none";

    // Refresh table. Calling closeTable() then renderTable() causes an unnecessary hide->show flicker,
    // so prefer just re-rendering and ensuring .table-record is visible.
    renderTable();
    const tableRecord = document.querySelector('.table-record');
    if (tableRecord) tableRecord.style.display = 'block';
};


// ---------------- animation helpers ----------------

// Ball animation handler (reusable for all balls)
const animateBall = async (selector, animationName, arrowLeft, hideArrow = false) => {
    const ball = document.querySelector(selector);
    if (!ball) {
        console.warn("animateBall: element not found", selector);
        return;
    }

    ball.style.animationName = animationName;

    // Mid animation: update stopwatch and opacity
    setTimeout(() => {
        ball.style.opacity = '0.7';
        if (stopWatch) stopWatch.src = `../images/${time_img[ins_step]}`;
    }, ANIM_DELAY);

    // Reset animation and UI
    setTimeout(() => {
        ball.style.opacity = '1';
        ball.style.animationName = '';
        if (stopWatch) stopWatch.src = '../images/stopwatch.png';
        if ([7, 10, 13].includes(ins_step) && arrow) arrow.style.left = arrowLeft;
        table_show();
        ins_step++;
        instruction_show();

        if (hideArrow && ins_step === 14) {
            const arrowCont = document.querySelector('.arrow-container');
            if (arrowCont) arrowCont.style.display = 'none';
        }
    }, RESET_DELAY);

    return;
};

// Individual ball triggers
const ball_small = async () => {
    if ([5, 6, 7].includes(ins_step)) {
        await animateBall(".ball-small", "ball-one-move", "45px");
    }
}

const ball_medium = async () => {
    if ([8, 9, 10].includes(ins_step)) {
        await animateBall(".ball-medium", "ball-two-move", "90px");
    }
}

const ball_large = async () => {
    if ([11, 12, 13].includes(ins_step)) {
        await animateBall(".ball-large", "ball-third-move", "90px", true);
    }
}

// ---------------- step-driven table population ----------------
const table_show = () => {
    // NOTE: you must use consistent setNo values when calling setExprimentData / updateExprimentData
    if ([11, 12, 13].includes(ins_step)) {
        if (ins_step === 11) {
            // Set 1
            setExprimentData(3, 0.15, [2.60, null, null]);
            renderTable();
        }
        if (ins_step === 12) {
            // fill 2nd reading for set 1
            updateExprimentData(3, 1, 2.55);
            renderTable();
        }
        if (ins_step === 13) {
            // fill 3rd reading for set 1 -> meanT will be computed
            updateExprimentData(3, 2, 2.50);
            renderTable(1);
        }
    }

    if ([8, 9, 10].includes(ins_step)) {
        if (ins_step === 8) {
            setExprimentData(2, 0.12, [3.10, null, null]); // setNo = 2
            renderTable();
        }
        if (ins_step === 9) {
            updateExprimentData(2, 1, 3.00);
            renderTable();
        }
        if (ins_step === 10) {
            updateExprimentData(2, 2, 3.05);
            renderTable(1);
        }
    }

    if ([5, 6, 7].includes(ins_step)) {
        if (ins_step === 5) {
            setExprimentData(1, 0.10, [3.60, null, null]); // setNo = 3
            renderTable();
        }
        if (ins_step === 6) {
            updateExprimentData(1, 1, 3.50);
            renderTable();
        }
        if (ins_step === 7) {
            updateExprimentData(1, 2, 3.55);
            renderTable(1);
        }
    }
}

