import './index.css'

const QuestionButton = props => {
  const {details, isActiveTrial, numberClicked} = props
  const {questionNum} = details

  const style = isActiveTrial ? 'yellow' : 'blue'

  const onClickNumButton = () => {
    numberClicked(questionNum)
  }

  return (
    <div>
      <button type="button" onClick={onClickNumButton} className={style}>
        {questionNum + 1}
      </button>
    </div>
  )
}

export default QuestionButton
