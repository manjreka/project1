import './index.css'

const DefaultOptions = props => {
  const {
    details,
    activityCheck,
    questionId,
    defaultOptionClick,
    isActive,
  } = props

  const css = activityCheck || isActive ? 'red' : 'green'

  const {id, isCorrect, text} = details

  const onClickingDefaultOption = () => {
    defaultOptionClick(id, isCorrect, questionId)
  }

  return (
    <li>
      <button type="button" className={css} onClick={onClickingDefaultOption}>
        {text}
      </button>
    </li>
  )
}

export default DefaultOptions
