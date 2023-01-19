const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 630,
    y: 160
  },
  imageSrc: './assets/shop.png',
  scale: 2.5,
  framesMax: 6
})

const player = new Fighter({
  position:{
    x:50,
    y:230
  },
  velocity:{
    x: 0,
    y: 0
  },
  color: 'red',
  imageSrc: './assets/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 156
  },
  sprites: {
    idle:{
      imageSrc: './assets/samuraiMack/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './assets/samuraiMack/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/samuraiMack/Attack1.png',
      framesMax: 6,
    }, 
    attack2: {
      imageSrc: './assets/samuraiMack/Attack2.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './assets/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 40
    },
    width: 160,
    height: 50
  }
})


const enemy = new Fighter({
  position:{
    x:900,
    y:230
  },
  velocity:{
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: './assets/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle:{
      imageSrc: './assets/kenji/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './assets/kenji/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/kenji/Attack1.png',
      framesMax: 4,
    }, 
    attack2: {
      imageSrc: './assets/kenji/Attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './assets/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './assets/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -173,
      y: 50
    },
    width: 180,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}


timerId = setInterval(decreaseTime, 1000)
function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, .05)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  //Player movement
  player.velocity.x = 0
  if(keys.a.pressed && player.lastKey === 'a' && player.position.x > 5){
    player.velocity.x = -8
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x < 950){
    player.velocity.x = 8
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping player
  if(player.velocity.y < 0){
    player.switchSprite('jump')
  } else if( player.velocity.y > 0){
    player.switchSprite('fall')
  }

  //Enemy movement
  enemy.velocity.x = 0
  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 5){
    enemy.velocity.x = -8
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x < 950){
    enemy.velocity.x = 8
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // enemy jumping
  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  } else if( enemy.velocity.y > 0){
    enemy.switchSprite('fall')
  }





  // detect colision e enemt gets hit
  if (rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
  })&& player.isAttacking && player.framesCurrent === 4){
    enemy.takeHit()
    player.isAttacking = false
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }

  // if player misses
  if(player.isAttacking && player.framesCurrent === 4){
    player.isAttacking = false
  }

  if (rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  })&& enemy.isAttacking && enemy.framesCurrent === 2){
    player.takeHit()
    enemy.isAttacking = false
    document.querySelector('#playerHealth').style.width = player.health + '%'  
  }
 
  if(enemy.isAttacking && enemy.framesCurrent === 2){
    enemy.isAttacking = false
  }

  // end game based on health
  if(enemy.health <= 0 || player.health <= 0)
    determineWinner({player, enemy})

}

animate()

window.addEventListener('keydown', (event) => {
  if(!player.dead && !enemy.dead){
    switch(event.key){
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case ' ':
        player.attack()
        break

    
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }

    if(enemy.position.y > 320){
      switch(event.key){
        case 'ArrowUp':
        enemy.velocity.y = -20
        break
      }
    }

    if(player.position.y > 320){
      switch(event.key){
        case 'w':
        player.velocity.y = -20
        break
      }
    }

  }
})

window.addEventListener('keyup', (event) => {
  switch(event.key){
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch(event.key){
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})