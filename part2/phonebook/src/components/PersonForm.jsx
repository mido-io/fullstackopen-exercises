const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, onSubmitHandler }) => {
  return (
    <form onSubmit={onSubmitHandler}>

      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      
      <button type="submit">add</button>

    </form>
  )
}

export default PersonForm
