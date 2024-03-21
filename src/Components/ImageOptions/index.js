import './index.css'

const ImageOptions = props => {
  const {details, activityCheck, imageOptionClick, questionId, isActive} = props

  const css = activityCheck || isActive ? 'red' : 'green'

  const {id, isCorrect, text, imageUrl} = details

  const onClickingImageOption = () => {
    imageOptionClick(id, isCorrect, questionId)
  }

  return (
    <li>
      <button type="button" className={css} onClick={onClickingImageOption}>
        <img src={imageUrl} alt={text} className="image_view" />
      </button>
    </li>
  )
}

export default ImageOptions
