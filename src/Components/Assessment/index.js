import {Component} from 'react'

import Header from '../Header'
import QuestionArea from '../QuestionArea'

import './index.css'

class Assessment extends Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <QuestionArea />
        </div>
      </div>
    )
  }
}

export default Assessment
