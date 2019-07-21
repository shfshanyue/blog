window.addEventListener('storage', e => {
  console.log(e)
  document.body.style.background = 'black'
})

localStorage.a = 3
localStorage.setItem('b', 8)

setTimeout(() => {
  localStorage.a = 4
  localStorage.setItem('b', Math.random())
}, 3000)
