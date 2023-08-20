"use strict"

function displayStats() {
  //document.getElementById("energy-meter").innerHTML = "ENERGY = " + APERTURA_CHAR.energy;
  displayEnergy();
  document.getElementById("enemy-stats-container").innerHTML = "ENEMY HP = " + SPAWNED_ENEMY.HP;
  document.getElementById("stance-caption").innerHTML = "STANCE";
  document.getElementById("stance-value").innerHTML = APERTURA_CHAR.stance.toUpperCase();
  document.getElementById("combo-caption").innerHTML = "COMBO";
  document.getElementById("damage-caption").innerHTML = "ACTION DAMAGE";
  document.getElementById("turn-caption").innerHTML = "TURN DAMAGE";
  document.getElementById("ultimate-button").innerHTML = ultimateCharge;
  resetCounters();
}

function resetCounters() {
  document.getElementById("combo-value").innerHTML = comboCounter;
  document.getElementById("damage-value").innerHTML = damageCounter;
  document.getElementById("turn-value").innerHTML = turnDamage;
  document.getElementById("block-counter").innerHTML = APERTURA_CHAR.turnBlock;
}

function drawOneCard() {
  const RANDOM_CARD = Math.floor(Math.random() * APERTURA_DECK.length);
    HAND.push({
      ...APERTURA_DECK[RANDOM_CARD],
      indexCardCounter
    });
    APERTURA_DECK.splice(RANDOM_CARD, 1);
    indexCardCounter++;
}

function drawHandSizeCards() {
  for(let i=0; i<handSize; i++) {
    drawOneCard();
  }
}

// let salva = "salva";
// let salvaClown = 5;
// function union (a) {
//   return a + "Clown";
// }
// union(salva);
// ${union(salva)} <br>
// + ${HAND[i].cardName}${Counter}
function displayCards() {
  const CARD_IN_HAND = document.getElementById("hand");
  CARD_IN_HAND.innerHTML = "";
  for(let i=0; i<HAND.length; i++) {
    if(HAND[i].cardType === "attack") {
      CARD_IN_HAND.innerHTML += `
        <div id="card-in-hand-${HAND[i].indexCardCounter}" class="card card-in-hand ${HAND[i].cardType}" data-card-index="${HAND[i].indexCardCounter}" draggable="true" ondragstart="drag(event)">
          <div class="card-energy attack-energy">${HAND[i].energyCost}</div>
          <div class="card-name ${HAND[i].cardType}">${HAND[i].cardName}</div>
          <div class="card-img"></div>
          <div class="card-description ${HAND[i].cardType}">Damage: ${calculateDamage(HAND[i])} <br> ${HAND[i].description}</div>
        </div>
      `;
    } else if (HAND[i].cardType === "block") {
      CARD_IN_HAND.innerHTML += `
        <div id="card-in-hand-${HAND[i].indexCardCounter}" class="card card-in-hand ${HAND[i].cardType}" data-card-index="${HAND[i].indexCardCounter}" draggable="true" ondragstart="drag(event)">
        <div class="card-energy block-energy">${HAND[i].energyCost}</div>
          <div class="card-name ${HAND[i].cardType}">${HAND[i].cardName}</div>
          <div class="card-img"></div>
          <div class="card-description ${HAND[i].cardType}">Block: ${calculateBlock(HAND[i])} <br> ${HAND[i].description}</div>
        </div>
      `;
    }
  }
}

function negativeEnergy() {
  const NEGATIVE_METER = document.getElementById("negative-meter");
  NEGATIVE_METER.innerHTML = "";
  for(let i=0; i<PLAYER_CHARACTERS[0].energy; i++) {
    NEGATIVE_METER.innerHTML += `
      <div class="negative-segment" style="width:calc(100% / ${PLAYER_CHARACTERS[0].energy})"></div>
    `;
  }
}

function displayEnergy() {
  const ENERGY_METER = document.getElementById("energy-meter");
  const ENERGY_VALUE = document.getElementById("excess-energy");
  ENERGY_METER.innerHTML = "";
  ENERGY_VALUE.innerHTML = `${APERTURA_CHAR.energy}`;
  for(let i=0; i<APERTURA_CHAR.energy; i++) {
    ENERGY_METER.innerHTML += `
      <div class="energy-segment" style="width:calc(100% / ${PLAYER_CHARACTERS[0].energy})"></div>
    `;
  }
}

function displayUlt(tick) {
  const ULT_METER = document.getElementById("ult-meter");
  const ULT_PROGRESS = document.getElementById("ultimate-button");
  ULT_PROGRESS.innerHTML = `${ultimateCharge}`;
  if(ultimateCharge<ULT_VALUE) {
    if(tick + ultimateCharge > ULT_VALUE) {
      const DIFF = ULT_VALUE - ultimateCharge;
      for(let i=0; i<DIFF; i++) {
        ultimateCharge++;
        ULT_METER.innerHTML += `
          <div class="ult-segment" style="width:calc(100% / ${ULT_VALUE})"></div>
        `;
      }
    } else {
      for(let i=0; i<tick; i++) {
        ultimateCharge++;
        ULT_METER.innerHTML += `
          <div class="ult-segment" style="width:calc(100% / ${ULT_VALUE})"></div>
        `;
      }
    }
  }
}

function ultimateButton() {
  if(ultimateCharge>9) {
    ultimateCharge = 0;
    const ULT_METER = document.getElementById("ult-meter");
    ULT_METER.innerHTML = "";
    document.getElementById("ultimate-button").innerHTML = ultimateCharge;
    ultimate();
  }
}

function ultimate() {
  damageCounter = ultDamage();
  turnDamage += damageCounter;
  SPAWNED_ENEMY.HP -= ultDamage();
  displayStats();
}

function ultDamage() {
  const ULT_DAMAGE = 10 + SPAWNED_ENEMY.HP * 0.1 + APERTURA_CHAR.STR * 2 + APERTURA_CHAR.MAG * 1;
  return ULT_DAMAGE;
}

function discardOneCard(handIndex) {
  DISCARD_PILE.push(HAND[handIndex]);
  HAND.splice(handIndex, 1);
}

function discardCardsInHand() {
  HAND.forEach(item => {
    DISCARD_PILE.push(item);
  });
  HAND.splice(0, HAND.length);
}

function refillDeck() {
  DISCARD_PILE.forEach(item => {
    APERTURA_DECK.push(item);
  });
  DISCARD_PILE.splice(0, DISCARD_PILE.length);
}

function endTurn() {
  discardCardsInHand();
  if (APERTURA_DECK.length < handSize) {
    for(let i=0; i<APERTURA_DECK.length; i++) {
      drawOneCard();
    }
    refillDeck();
    const HAND_DIFFERENCE = handSize - HAND.length;
    for(let i=0; i<HAND_DIFFERENCE; i++) {
      drawOneCard();
    }
    displayCards();
  } else {
    discardCardsInHand();
    drawHandSizeCards();
    displayCards();
  }
  APERTURA_CHAR.turnBlock = 0;
  damageCounter = 0;
  turnDamage = 0;
  comboCounter = 0;
  rightSyncro = false;
  APERTURA_CHAR.energy = PLAYER_CHARACTERS[0].energy;

  resetCounters();  
  displayEnergy();

  console.log("______________________________");
  console.log("DISCARD_PILE: ", DISCARD_PILE);
  console.log("HAND: ", HAND);
  console.log("APERTURA_DECK: ", APERTURA_DECK);
}

/* FUNZIONI DI DRAG AND DROP */
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  // ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.setData("text", ev.target.dataset.cardIndex);
}

function drop(ev) {
  ev.preventDefault();
  //ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("text")));
  const cardIndex = parseInt(ev.dataTransfer.getData("text"));

  const PLAYED_CARD_INDEX = HAND.findIndex(el => el.indexCardCounter === cardIndex);

  if(APERTURA_CHAR.energy >= energyCost(PLAYED_CARD_INDEX)) {
    document.getElementById("card-in-hand-" + cardIndex).style.display ='none';
    
    APERTURA_CHAR.energy -= energyCost(PLAYED_CARD_INDEX);
    playCard(PLAYED_CARD_INDEX);
    discardOneCard(PLAYED_CARD_INDEX);
    
    displayStats();
    displayCards();
  }

  /* CODICE ENERGIA NEGATIVA */
  // const NEGATIVE_METER = document.getElementById("negative-meter");
  // NEGATIVE_METER.innerHTML = "";
  // `${PLAYER_CHARACTERS[0].energy} - ${APERTURA_CHAR.energy}`
  /* FINE */

  console.log("______________________________");
  console.log("DISCARD_PILE: ", DISCARD_PILE);
  console.log("HAND: ", HAND);
  console.log("APERTURA_DECK: ", APERTURA_DECK);
}
/* FINE FUNZIONI DI DRAG AND DROP */

