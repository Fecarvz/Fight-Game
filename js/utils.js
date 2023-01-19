function rectangularCollision({rectangle1, rectangle2}){
  return(
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
  )
}

function determineWinner({player, enemy}){
  document.querySelector('#displayText').style.opacity = '1'
  clearInterval(timerId)
  if(player.health === enemy.health){
    document.querySelector('#displayText').innerHTML = 'Empate'
  }
  else if(player.health > enemy.health){
    document.querySelector('#displayText').innerHTML = 'Jogador 1 Venceu!'
  }
  else if(player.health < enemy.health){
    document.querySelector('#displayText').innerHTML = 'Jogador 2 Venceu!'
  }
}
    
let timer = 100
let timerId
function decreaseTime(){
  if(timer > 0){
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if(timer == 0){

    determineWinner({player, enemy})
  }
}