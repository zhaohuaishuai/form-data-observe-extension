import React, { Component, PropTypes } from 'react';
import hljs from '../actions/hljs';

export default class FormObserveMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            codeHtml: '',
        }
    }
    static propTypes = {
        formData: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.init()
    }
    init() {
        this.updateData(this.props.formData)
    }
    updateData(data: any) {
        const json = JSON.stringify(data, null, 2)
        const hj = hljs.highlight(json, { language: 'javascript' })
        console.log('hj', hj)
        this.setState({
            ...this.state,
            codeHtml: hj.value,
            data: data
        })
    }
    codeHtml() {
        console.log("this.props.formData-->",this.props.formData)
        const json = JSON.stringify(this.props.formData, null, 2)
        const hj = hljs.highlight(json, { language: 'javascript' })
        console.log('hj', hj)
        return hj.value
    }
    render() {
        return (
            <pre style={{ marginTop: 0 }}>
                <code className='hljs' dangerouslySetInnerHTML={{ __html: this.codeHtml.call(this) }}></code>
            </pre>
        )
    }
}