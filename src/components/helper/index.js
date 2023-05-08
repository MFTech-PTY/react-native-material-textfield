import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';

import styles from './styles';

export default class Helper extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    error: PropTypes.string,

    disabled: PropTypes.bool,

    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),

    baseColor: PropTypes.string,
    errorColor: PropTypes.string,

    focusAnimation: PropTypes.instanceOf(Animated.Value),
  };

  constructor(props) {
    super(props);

    let { error, focusAnimation } = this.props;

    let opacity = focusAnimation.interpolate({
      inputRange: [-1, -0.5, 0],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });

    this.state = {
      errored: !!error,
      opacity,
    };
  }

  componentDidMount() {
    let { focusAnimation } = this.props;

    this.listener = focusAnimation.addListener(this.onAnimation.bind(this));
  }

  componentWillUnmount() {
    let { focusAnimation } = this.props;

    focusAnimation.removeListener(this.listener);
  }

  onAnimation({ value }) {
    if (this.animationValue > -0.5 && value <= -0.5) {
      this.setState({ errored: true });
    }

    if (this.animationValue < -0.5 && value >= -0.5) {
      this.setState({ errored: false });
    }

    this.animationValue = value;

    /**
     * Fix for issue #268
     * https://github.com/n4kz/react-native-material-textfield/issues/268
     */
    if (typeof this.animationValue === 'undefined' && value === -1) {
      this.setState({ errored: true });
    }
  }

  render() {
    let { errored, opacity } = this.state;
    let { style, title, error, disabled, baseColor, errorColor } = this.props;

    let text = errored ? error : title;

    if (text == null) {
      return null;
    }

    let textStyle = {
      opacity,

      color: !disabled && errored ? errorColor : baseColor,
    };

    return (
      <Animated.Text style={[styles.text, style, textStyle]}>
        {text}
      </Animated.Text>
    );
  }
}
