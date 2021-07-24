const ATTACK_VALUE=10;
const STRONG_ATTACK_VALUE=17;
const MONSTER_ATTACK_VALUE=14;
const HEAL_VALUE=20;

const MODE_ATTACK="ATTACK";
const MODE_STRONG_ATTACK="STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK="PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK="PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK="MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL="PLAYER_HEAK";
const LOG_EVENT_GAME_OVER="GAME_OVER"




let battlelog=[];

function getMaxLifeValue(){
    const enteredValue=prompt('Maximum life of your monster ','100');
    const parsedValue=parseInt(enteredValue);
    
    if( isNaN(parsedValue) || parsedValue<=0){
    throw{message:'Invalid user input,not a number!'};
   
}
    return parsedValue;
}
let choosenMaxLife=getMaxLifeValue();

let currentMonsterHealth=choosenMaxLife;
let currentPlayerHealth=choosenMaxLife;
let hasBonusLife=true;

adjustHealthBars(choosenMaxLife);

function writeToLog(ev,val,monsterHealth,playerHealth){
    let logEntry={
        event:ev,
        value:val,
        finalMonsterHealth:monsterHealth,
        finalPlayerHealth:playerHealth
    };
    switch (ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target="MONSTER";
            break;
        case  LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry={
                event:ev,
                value:val,
                target:"MONSTER",
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
    
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry={
                event:ev,
                value:val,
                target:"PLAYER",
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
            
             }; 
             break;
        case  LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry={
                event:ev,
                value:val,
                target:"MONSTER",
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
    
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry={
                event:ev,
                value:val,
                target:"PLAYER",
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
    
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry={
                event:ev,
                value:val,
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
    
            };
            break;
        default:
            logEntry={};  
        
        
    }


    // if( ev===LOG_EVENT_PLAYER_ATTACK){
    //   logEntry.target="MONSTER";
    // }
    // else if( ev===LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry={
    //         event:ev,
    //         value:val,
    //         target:"MONSTER",
    //         finalMonsterHealth:monsterHealth,
    //         finalPlayerHealth:playerHealth

    //     };
    // }
    // else if( ev===LOG_EVENT_MONSTER_ATTACK){
    //     logEntry={
    //         event:ev,
    //         value:val,
    //         target:"PLAYER",
    //         finalMonsterHealth:monsterHealth,
    //         finalPlayerHealth:playerHealth

    //     };
       
    // }
    // else if( ev===LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry={
    //         event:ev,
    //         value:val,
    //         target:"MONSTER",
    //         finalMonsterHealth:monsterHealth,
    //         finalPlayerHealth:playerHealth

    //     };
    // }
    // else if( ev===LOG_EVENT_PLAYER_HEAL){
    //     logEntry={
    //         event:ev,
    //         value:val,
    //         target:"PLAYER",
    //         finalMonsterHealth:monsterHealth,
    //         finalPlayerHealth:playerHealth

    //     };
    // }
    // else if( ev===LOG_EVENT_GAME_OVER){
    //     logEntry={
    //         event:ev,
    //         value:val,
    //         finalMonsterHealth:monsterHealth,
    //         finalPlayerHealth:playerHealth

    //     };
    // }
    battlelog.push(logEntry);
}


function reset(){
    currentPlayerHealth=choosenMaxLife;
    currentMonsterHealth=choosenMaxLife;
    resetGame(choosenMaxLife);
}
function endRound(){
    let initialPlayerHealth=currentPlayerHealth;
    const playerDamage=dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth-=playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    ); 
    if(currentPlayerHealth<=0 && hasBonusLife){
        hasBonusLife=false;
        removeBonusLife();
        currentPlayerHealth=initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth)
        alert('you dead but bonus life saved you!')
    }
    if(currentMonsterHealth<=0 && currentPlayerHealth >0){
        alert('You Won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        ); 
    }
    else if(currentPlayerHealth <=0 && currentMonsterHealth>0){
        alert('You lost');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        ); 
    }
    else if(currentPlayerHealth<=0 && currentMonsterHealth <=0){
        alert('You Have Draw');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        ); 
    }
    if(currentPlayerHealth<=0 || currentMonsterHealth<=0){
        reset();
    }
}

function attackMonster(mode){
    const maxDamage=mode===MODE_ATTACK?ATTACK_VALUE:STRONG_ATTACK_VALUE;
    const logEvent=mode===MODE_ATTACK?LOG_EVENT_PLAYER_ATTACK:LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode ===MODE_ATTACK){
    //     maxDamage=ATTACK_VALUE;
    //     logEvent=LOG_EVENT_PLAYER_ATTACK;
    // }
    // else if(mode===MODE_STRONG_ATTACK){
    //     maxDamage=STRONG_ATTACK_VALUE;
    //     logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage=dealMonsterDamage(maxDamage);
    currentMonsterHealth-=damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    ); 
    endRound();
   

}
function attackHandler(){
    attackMonster(MODE_ATTACK)
}

function strongAttackHandler(){
   attackMonster(MODE_STRONG_ATTACK)
}
function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth>=choosenMaxLife-HEAL_VALUE){
        alert("you can't heal to more than initial health")
        healValue=choosenMaxLife-currentPlayerHealth;
    }
    else{
        healValue=HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth+=healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );

    endRound();

}
function printLogHandler(){
    for(let i=0;i<battlelog.length;i++){
        console.log('---------');
    }

    for( logEntry of battlelog){
        console.log(logEntry);
    }
    // console.log(battlelog);
}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);