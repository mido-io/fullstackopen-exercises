import { useState, useEffect } from 'react'

import './index.css'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'



const App = () => {

  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("success")

  useEffect(() => {
    personService
      .getAll()
      .then(initPerson => {
        setPersons(initPerson)
      })
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault();

    const personExists = persons.some((person) => person.name === newName)

    if (personExists) {

      const confirmWindowCheck = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one ?`
      )

      if (confirmWindowCheck) {

        const existingPerson = persons.find(p => p.name === newName)
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))

            setMessage(`Updated ${returnedPerson.name}`)
            setMessageType("success")

            setTimeout(() => {
              setMessage(null)
            }, 4000)

            setNewName('')
            setNewNumber('')
          })
          .catch( error => {
            
            setMessage(`Information of ${existingPerson.name} has already been removed from server` )
            setMessageType("error")

            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }

    } else {

      const nameObject = { name: newName, number: newNumber }

      personService
        .create(nameObject)
        .then(person => {
          setPersons(persons.concat(person))


          setMessage(`Added ${person.name}`)
          setMessageType("success")

          setTimeout(() => {
            setMessage(null)
          }, 4000)

          setNewName('')
          setNewNumber('')
        })
    }
  }


  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name} ?`)

    if (confirmDelete) {

      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        onSubmitHandler={handleSubmit}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />

    </div>
  )
}

export default App