import React, { Component, PropTypes } from 'react';
export default class Header extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired
    };
    render() {
        return (
            <div style={{ height: '38px', borderBottom: '1px solid rgba(255,255,255,0.4)', lineHeight: '38px', padding: '0 10px',display:'flex',justifyContent:'space-between' }}>
                <div style={{ color: '#bbb' }}>大表单数据观察器</div>
                <div style={{ color: '#bbb' }}>{this.props.title}</div>
            </div>
        )
    }
}