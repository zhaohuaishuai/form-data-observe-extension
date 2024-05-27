import React, { Component, PropTypes } from 'react';
import { DataFormObserve,ScrollUpdateObserve,DeleteLogObserve } from '../actions/index';

export default class FormObserveMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            codeHtml: '',
            heightStyle: {
                lineHeight: `${30}px`
            },
            line: []
        };
    }
    static propTypes = {
        formData: PropTypes.object.isRequired
    }
    componentDidMount() {
         
        this.init();

        
    }
    init() {
        const dfos = new DataFormObserve({
            container: this.refs.codeRef,
            onUpdate: (item) => {
                console.log("item-->", item)
                this.setState({
                    ...this.state,
                    line: item.nodeStrinSplice
                })
            },
            plugins: [new ScrollUpdateObserve(),new DeleteLogObserve(null,{
                id: 'delLogContainer'
            })],
        })
        console.log("init-->", dfos)
        this.dataFormObserve = dfos
        this.updateData(this.props.formData);
    }
    updateData(data: any) {
        if (this.dataFormObserve) {
            this.dataFormObserve.update(data);
        }
    }
    codeHtml() {

    }
    handleExtend(item) {
        if (this.dataFormObserve) {
            this.dataFormObserve.handleExtendsNode(item);
        }
    }
    componentDidUpdate(prevProps){
        if(JSON.stringify(prevProps.formData) !== JSON.stringify(this.props.formData)){
            this.updateData(this.props.formData);
        }
    }
    render() {
       
        return (
            <div style={{ display: 'flex' }}>
                <div
                    style={{
                        paddingBlock: '1em',
                       
                    }}
                >
                    {
                        this.state.line.map((item, index) => (
                            <div
                                onClick={() => this.handleExtend(item)}
                                style={{
                                    ...this.state.heightStyle,
                                    paddingInline: 10,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    columnGap: '10px',
                                }}
                            >
                                <div
                                    style={{ color: '#666666', width: '20px', textAlign: 'right' }}
                                >
                                    {index + 1}
                                </div>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        lineHeight: item.isExpansion ? '9px' : '12px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        border: item.isNode ? '1px solid #333333' : '',
                                        color:'#fff'
                                    }}
                                >
                                    {item.isNode ? (item.isExpansion ? '-' : '+') : ''}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <pre style={{ marginTop: 0 ,flex:1, position: 'relative' }}>
                    <code
                        ref="codeRef"
                        className="hljs"
                        style={{ ...this.state.heightStyle, overflow: 'auto' }}
                    />
                    <div
                        id="delLogContainer"
                        style={{
                        background: 'rgba(0,0,0,0.5)',
                        padding: '6px 10px',

                        width: '100%',
                        height: '120px',
                        position: 'sticky',
                        bottom: 0,
                        color:'#eee'
                        }}
                    ></div>
                </pre>
            </div>

        );
    }
}
