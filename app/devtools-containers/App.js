import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../devtools-components/Header';
import FormObserveMain from '../devtools-components/FormObserveMain';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import style from './App.css';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state ={
      title: '',
      formData: {},
    }
  }
  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.setState({
        ...this.state,
        title: request.title,
        formData: request.payload
      })
  });
  }

  render() {
    return (
      <div className={style.normal} >
        <Header title={this.state.title} />
        <div style={{height: 'calc(100vh - 40px)',overflow: 'auto'}}>
          <FormObserveMain formData={this.state.formData} />
        </div>
      </div>
    );
  }
}


