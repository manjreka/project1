import {Component} from 'react'
import Cookies from 'js-cookie'

import DefaultOptions from '../DefaultOptions'
import ImageOptions from '../ImageOptions'
import SingleSelectOptions from '../SingleSelectOptions'

import Timer from '../Timer'

import QuestionButton from '../QuestionButton'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'LOADING',
}

class QuestionArea extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    listOfQuestions: [],
    totalNumberOfQuestions: '',
    totalNumberOfQuestionsAnswered: 0,
    activeQuestionNumber: '',
    isActiveOptionId: '',
    list: [],
    score: 0,
  }

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/assess/questions'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const {questions, total} = data

      // console.log(questions)

      const convertedListOfQuestions = questions.map(each => ({
        id: each.id,
        options: each.options,
        optionsType: each.options_type,
        questionText: each.question_text,
        questionNum: questions.indexOf(each),
      }))

      const caseConvertedQuestionList = convertedListOfQuestions.map(each => ({
        id: each.id,
        questionNum: convertedListOfQuestions.indexOf(each),
        options: each.options.map(item => ({
          id: item.id,
          text: item.text,
          isCorrect: item.is_correct,
        })),
        optionsType: each.optionsType,
        questionText: each.questionText,
        optionActive: '',
        numOfClicks: 0,
        numOfClicksForCorrectOption: 0,
      }))

      //    console.log(caseConvertedQuestionList)

      this.setState({
        list: caseConvertedQuestionList,
        listOfQuestions: convertedListOfQuestions,
        apiStatus: apiStatusConstants.success,
        totalNumberOfQuestions: total,
        activeQuestionNumber: 0,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  defaultOptionClick = (id, isCorrect, questionId) => {
    const {list} = this.state
    const filtereditem = list.filter(each => each.id === questionId)
    const finding = filtereditem[0].options.filter(each => each.id === id)[0]
      .isSelected

    const checkSelections = !finding
    const num = filtereditem[0].numOfClicks + 1

    filtereditem[0].numOfClicks = num
    filtereditem[0].options.filter(
      each => each.id === id,
    )[0].isSelected = checkSelections

    if (filtereditem[0].numOfClicks === 1) {
      this.setState({isActiveOptionId: id})
      this.setState(prevState => ({
        totalNumberOfQuestions: prevState.totalNumberOfQuestions - 1,
        totalNumberOfQuestionsAnswered:
          prevState.totalNumberOfQuestionsAnswered + 1,
      }))
    } else {
      this.setState({isActiveOptionId: id})
    }
  }

  imageOptionClick = (id, isCorrect, questionId) => {
    const {list} = this.state

    const filtereditem = list.filter(each => each.id === questionId)

    const num = filtereditem[0].numOfClicks + 1

    filtereditem[0].numOfClicks = num

    if (filtereditem[0].numOfClicks === 1) {
      this.setState({isActiveOptionId: id})
      this.setState(prevState => ({
        totalNumberOfQuestions: prevState.totalNumberOfQuestions - 1,
        totalNumberOfQuestionsAnswered:
          prevState.totalNumberOfQuestionsAnswered + 1,
      }))
    } else {
      this.setState({isActiveOptionId: id})
    }
  }

  retainingSelection = () => {
    const {isActiveOptionId, activeQuestionNumber, list} = this.state
    const newList = list.map(each => {
      if (each.questionNum === activeQuestionNumber) {
        return {...each, optionActive: isActiveOptionId}
      }
      return each
    })

    this.setState({list: newList}, this.successView)
  }

  scoreUpdate = () => {
    const {isActiveOptionId, activeQuestionNumber, list} = this.state

    let correct = ''
    if (isActiveOptionId === '') {
      correct = ''
    } else {
      const q = list.filter(each => each.questionNum === activeQuestionNumber)

      const w = q[0].options.filter(each => each.id === isActiveOptionId)

      const e = w[0]

      const filtereditem = list.filter(
        each => each.questionNum === activeQuestionNumber,
      )

      const a = filtereditem[0]

      correct = e.isCorrect

      const select = !e.isSelected

      e.isSelected = select

      if (correct === 'true') {
        const num = a.numOfClicksForCorrectOption + 1
        const n = a.numOfClicks + 1

        a.numOfClicksForCorrectOption = num
        a.numOfClicks = n

        if (n > 2 && num === 1) {
          this.setState(prevState => ({score: prevState.score + 1}))
        } else if (n === 2) {
          this.setState(prevState => ({score: prevState.score + 1}))
        }
      } else {
        const num = a.numOfClicksForCorrectOption
        const n = a.numOfClicks

        a.numOfClicksForCorrectOption = 0
        a.numOfClicks = n

        if (n > 2 && num === 1) {
          this.setState(prevState => ({score: prevState.score - 1}))
        }
      }
    }
  }

  clickHereClicked = () => {
    this.setState(prevState => ({
      activeQuestionNumber: prevState.activeQuestionNumber + 1,
    }))

    this.retainingSelection()

    this.scoreUpdate()
  }

  defaultView = () => {
    const {list, activeQuestionNumber, isActiveOptionId} = this.state
    const filteredList = list.filter(
      each => each.questionNum === activeQuestionNumber,
    )

    console.log('render called')
    const activeQuestion = filteredList[0]
    console.log(activeQuestion)
    const {id, questionText, optionActive} = activeQuestion

    const convertedList = activeQuestion.options

    const questionNumber =
      list.filter(each => each.id === id)[0].questionNum + 1

    return (
      <div className="assessment_bg_container">
        <div>
          <h1>
            {questionNumber}. {questionText}
          </h1>
          <ul className="question_area_unorderedList">
            {convertedList.map(each => (
              <DefaultOptions
                activityCheck={optionActive === each.id}
                questionId={id}
                details={each}
                defaultOptionClick={this.defaultOptionClick}
                isActive={each.id === isActiveOptionId}
                key={each.id}
              />
            ))}
          </ul>
          <button
            type="button"
            value={convertedList}
            onClick={this.clickHereClicked}
          >
            click here
          </button>
        </div>
      </div>
    )
  }

  imageView = () => {
    const {list, activeQuestionNumber, isActiveOptionId} = this.state
    const filteredList = list.filter(
      each => each.questionNum === activeQuestionNumber,
    )

    console.log('render called')
    const activeQuestion = filteredList[0]
    const {id, questionText, optionActive} = activeQuestion
    console.log(activeQuestion)

    const convertedList = activeQuestion.options

    const questionNumber =
      list.filter(each => each.id === id)[0].questionNum + 1

    return (
      <div className="assessment_bg_container">
        <div>
          <h1>
            {questionNumber}. {questionText}
          </h1>
          <ul className="question_area_unorderedList">
            {convertedList.map(each => (
              <ImageOptions
                activityCheck={optionActive === each.id}
                questionId={id}
                details={each}
                key={each.id}
                isActive={each.id === isActiveOptionId}
                imageOptionClick={this.imageOptionClick}
              />
            ))}
          </ul>
          <button
            type="button"
            value={convertedList}
            onClick={this.clickHereClicked}
          >
            click here
          </button>
        </div>
      </div>
    )
  }

  singleSelectView = () => {
    const {listOfQuestions, activeQuestionNumber} = this.state
    const filteredList = listOfQuestions.filter(
      each => each.questionNum === activeQuestionNumber,
    )

    const activeQuestion = filteredList[0]

    const {id, options, questionText} = activeQuestion

    const num = listOfQuestions.filter(each => each.id === id)

    const questionNumber = num[0].questionNum + 1

    const convertedOptionsList = options.map(each => ({
      id: each.id,
      isCorrect: each.is_correct,
      text: each.text,
      isSelected: false,
    }))

    return (
      <div>
        <h1>
          {questionNumber}. {questionText}
        </h1>
        <select>
          {convertedOptionsList.map(each => (
            <SingleSelectOptions details={each} key={each.id} />
          ))}
        </select>
        <button
          type="button"
          value={convertedOptionsList}
          onClick={this.clickHereClicked}
        >
          click here
        </button>
      </div>
    )
  }

  successView = () => {
    const {listOfQuestions, activeQuestionNumber} = this.state

    console.log('successView called')

    const activeQuestion = listOfQuestions.filter(
      each => each.questionNum === activeQuestionNumber,
    )[0]

    const {optionsType} = activeQuestion
    switch (optionsType) {
      case 'IMAGE':
        return this.imageView()
      case 'SINGLE_SELECT':
        return this.singleSelectView()
      default:
        return this.defaultView()
    }
  }

  numberClicked = num => {
    this.retainingSelection()
    this.scoreUpdate()
    this.setState({activeQuestionNumber: num})
  }

  renderSuccessView = () => {
    const {
      totalNumberOfQuestions,
      list,
      activeQuestionNumber,
      totalNumberOfQuestionsAnswered,
      score,
    } = this.state

    return (
      <div className="assessment_bg_container">
        {this.successView()}
        <div className="assessment_container">
          <Timer />
          <div>
            <div>
              <p>{totalNumberOfQuestionsAnswered}</p>
              <p>Answered Questions</p>
            </div>
            <div>
              <p>{totalNumberOfQuestions}</p>
              <p>Unanswered Questions</p>
            </div>
          </div>
          <p>score:{score}</p>
          <hr />
          <ul>
            {list.map(each => (
              <QuestionButton
                details={each}
                key={each.id}
                numberClicked={this.numberClicked}
                isActiveTrial={each.questionNum === activeQuestionNumber}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => <div>Failure View</div>

  renderLoadingView = () => <div>Loading View</div>

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default QuestionArea
