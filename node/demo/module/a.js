function App () {
  const [text, setText] = useState('')
  return (
    <div>
      { text } 
      <Button text="确认" onClick={() => setText('已确认')}></Button>
    </div>
  )
}

function Button ({ text, onClick }) {
  return (
    <div onClick={onClick}>
      { text }
    </div>
  )
}