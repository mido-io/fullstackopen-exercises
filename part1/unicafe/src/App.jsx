import { useState } from 'react'

const Button = ({ text, onClickHandler }) => {
  return (<button onClick={onClickHandler}>{text}</button>)
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all }) => {

  const total = all.length;

  if (total == 0) {
    return <p>No feedback given</p>
  }

  const sum = all.reduce((acc, cur) => acc + cur, 0)

  const average = sum / total

  const positive = (good / total) * 100 + " %"

  return (
    <table>

      <tbody>

        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />

        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />

      </tbody>

    </table>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [all, setAll] = useState([])

  const handelGoodClick = () => {
    console.log("good is clicked")

    setGood(good + 1);
    setAll([...all, 1])
  }
  const handelNeutralClick = () => {
    console.log("neutral is clicked")

    setNeutral(neutral + 1)
    setAll([...all, 0])
  }
  const handelBadClick = () => {
    console.log("bad is clicked")
    
    setBad(bad + 1)
    setAll([...all, -1])
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} onClickHandler={handelGoodClick} />
      <Button text={"neutral"} onClickHandler={handelNeutralClick} />
      <Button text={"bad"} onClickHandler={handelBadClick} />

      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />

    </div>
  )
}

export default App