
var jedis = {}
var siths = {}

function initialize() {
  document.getElementById('generatejedis').addEventListener('click', (event) => {
    generatejedis(document.getElementById('jedisamount').value);
  });
  document.getElementById('generatesiths').addEventListener('click', (event) => {
    generatesiths(document.getElementById('sithsamount').value);
  });
  document.getElementById('fight').addEventListener('click', (event) => {
    figth();
  });
  document.getElementById('store').addEventListener('click', (event) => {
    store();
  });
  document.getElementById('read').addEventListener('click', (event) => {
    read();
  });
  read();
}

async function generatesiths(amount) {
  siths = {};
  const list = document.getElementById('sithscombat');
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  let fighter
  for (let i = 0; i < amount; i++) {
    do {
      fighter = new sith();
    } while (fighter.name in siths);
    siths[fighter.name] = fighter;
    let figtherli = document.createElement('li');
    figtherli.textContent = fighter.name;
    list.append(figtherli)
  }
}

async function generatejedis(amount) {
  jedis = {};
  const list = document.getElementById('jediscombat');
  while (list.firstChild) {
    list.removeChild(list.lastChild);
  }
  let fighter
  for (let i = 0; i < amount; i++) {
    do {
      fighter = new jedi();
    } while (fighter.name in jedis);
    jedis[fighter.name] = fighter;
    let figtherli = document.createElement('li');
    figtherli.textContent = fighter.name;
    list.append(figtherli)
  }
}

function figth() {
  // Cleaning combat
  const combatresult = document.getElementById('combatresult');
  while (combatresult.firstChild) {
    combatresult.removeChild(combatresult.lastChild);
  }
  // Fighting
  while (round());
  // Reporting result
  const jedisresult = document.getElementById('jedisresult');
  while (jedisresult.firstChild) {
    jedisresult.removeChild(jedisresult.lastChild);
  }
  for (let [key, fighter] of Object.entries(jedis)) {
    let fighterli = document.createElement('li');
    fighterli.textContent = fighter.name + ' (' + fighter.status + ')';
    jedisresult.append(fighterli)
  }
  const sithsresult = document.getElementById('sithsresult');
  while (sithsresult.firstChild) {
    sithsresult.removeChild(sithsresult.lastChild);
  }
  for (let [key, fighter] of Object.entries(siths)) {
    let fighterli = document.createElement('li');
    fighterli.textContent = fighter.name + ' (' + fighter.status + ')';
    sithsresult.append(fighterli)
  }
}

function round() {
  // Checking if all dead from one side
  let jedisalive = 0;
  for (let [key, value] of Object.entries(jedis)) {
    if (value.status == 'alive') {
      jedisalive++
    }
  }
  let sithsalive = 0;
  for (let [key, value] of Object.entries(siths)) {
    if (value.status == 'alive') {
      sithsalive++
    }
  }
  if (sithsalive == 0 || jedisalive == 0) {
    if (sithsalive == 0) {
      document.getElementById('winner').textContent = 'Jedis'
    } else {
      document.getElementById('winner').textContent = 'Siths'
    }
    return false
  }
  // Calculating round participants
  let attacker;
  let affected;
  if (Math.random() < 0.5) {
    do {
      attacker = siths[Object.keys(siths)[parseInt(Object.keys(siths).length * Math.random())]]
    } while (attacker.status != 'alive')
    do {
      affected = jedis[Object.keys(jedis)[parseInt(Object.keys(jedis).length * Math.random())]]
    } while (affected.status != 'alive')
  } else {
    do {
      attacker = jedis[Object.keys(jedis)[parseInt(Object.keys(jedis).length * Math.random())]]
    } while (attacker.status != 'alive')
    do {
      affected = siths[Object.keys(siths)[parseInt(Object.keys(siths).length * Math.random())]]
    } while (affected.status != 'alive')
  }
  let attack = attacker.powers[parseInt(Math.random() * 5)]();
  let attackli = document.createElement('li');
  attackli.textContent = attacker.type + ' "' + attacker.name + '" has used ' + attack.message;
  document.getElementById('combatresult').append(attackli)
  affected.hit(attack.power)
  if (affected.status == 'dead') {
    let deadli = document.createElement('li');
    deadli.textContent = affected.type + ' "' + affected.name + '" has falled in combat';
    document.getElementById('combatresult').append(deadli)
  }
  return true;
}

async function store() {
  let temporaljedi = new jedi();
  temporaljedi.connect();
  temporaljedi.clear();
  for (let [key, jedi] of Object.entries(jedis)) {
    jedi.connect();
    await jedi.write();
  }
  for (let [key, sith] of Object.entries(siths)) {
    sith.connect();
    await sith.write();
  }
}

async function read() {
  let temporaljedi = new jedi();
  temporaljedi.connect();
  let storedjedis = await temporaljedi.show();
  document.getElementById('jedisstored').textContent = JSON.stringify(storedjedis, undefined, 2)
  let temporalsith = new sith();
  temporalsith.connect();
  let storedsiths = await temporalsith.show();
  document.getElementById('sithsstored').textContent = JSON.stringify(storedsiths, undefined, 2)
}
