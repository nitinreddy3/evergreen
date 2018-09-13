import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import uniqueId from 'lodash/uniqueId'
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import * as components from 'evergreen-ui'
import Component from '@reactions/component'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

export default class Playground extends React.Component {
  static propTypes = {
    codeText: PropTypes.string.isRequired,
    scope: PropTypes.object,
    isOpenByDefault: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      uniqueId: uniqueId(),
      isCodeCollapsed: !props.isOpenByDefault,
      hasError: false,
      codeText: props.codeText
    }
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true })
  }

  handleToggle = () => {
    this.setState({
      isCodeCollapsed: !this.state.isCodeCollapsed
    })
  }

  renderError = () => {
    return (
      <div className="Playground-error">
        <p>
          Oops, something went wrong in with this live preview.<br /> Please
          reload the page and try again.
        </p>
      </div>
    )
  }

  handleChange = codeText => {
    this.setState({
      codeText
    })
  }

  renderComponentNotice = () => {
    return (
      <div className="Playground-notice">
        The `Component` component is not part of Evergreen. It is only used in
        examples to create state.{' '}
        <a
          href="https://github.com/reactions/component"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>.
      </div>
    )
  }

  render() {
    const { scope } = this.props
    const { codeText, hasError, isCodeCollapsed, uniqueId } = this.state

    if (hasError) return this.renderError()
    return (
      <LiveProvider
        theme="evergreen"
        scope={{ ReactDOM, Component, ...components, ...scope }}
        code={codeText}
        mountStylesheet={false}
      >
        <div className="Playground" data-iscodecollapsed={isCodeCollapsed}>
          <div>
            <LiveError />
            <div
              id={`code-playground-${uniqueId}`}
              className="Playground-preview"
            >
              <LivePreview />
            </div>
            {!isCodeCollapsed && (
              <div>
                {codeText.includes('<Component') &&
                  this.renderComponentNotice()}
                <LiveEditor onChange={this.handleChange} />
              </div>
            )}
          </div>
          <div
            aria-expanded={!isCodeCollapsed}
            role="button"
            aria-controls={`code-playground-${uniqueId}`}
            className="Playground-header"
            onClick={this.handleToggle}
          >
            <components.Icon icon="code" marginRight={8} />{' '}
            {isCodeCollapsed ? 'Show code' : 'Hide code'}
          </div>
        </div>
      </LiveProvider>
    )
  }
}
