import './index.css'

const SingleSelectOptions = props => {
  const {details} = props
  const {id, isCorrect, text} = details

  return <option>{text}</option>
}

export default SingleSelectOptions
