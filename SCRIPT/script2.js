function setComponent(step) {
  if (step === 2) {
    document.getElementById("setup1").style.display = "none";
    document.getElementById("setup2").style.display = "block";
  }
}

document.getElementById("start-btn").addEventListener("click", () => {
  setComponent(2);
});

function setMoveCap_forward() {
  const element = document.getElementById('cap_app_2');
  element.classList.add('apparatus-2-cap-move-forwards');
}

function dropWater() {
  const element = document.getElementById('bottle_app_2');
  const beaker = document.getElementById('Beaker_app_1');
  const waterStrip = document.getElementById('waterstrip');

  element.classList.add('apparatus-2-bottle');

  setTimeout(() => {
    waterStrip.style.height = '200px';
    waterStrip.style.display = 'block';
    waterStrip.style.visibility = 'visible';
  }, 3000);

  setTimeout(() => {
    beaker.src = "./images/fullBeaker.png";
    beaker.style.width = '150px';
    beaker.style.height = '321.39px';
  }, 4000);

  setTimeout(() => {
    waterStrip.style.visibility = 'hidden';
    element.src = "./images/half_bottle.png"; // Adjust if needed
    element.classList.add('apparatus-2-backPositionBeaker');
  }, 4000);
}
