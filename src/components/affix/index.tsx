import React, { PropsWithChildren } from 'react';
import { Animated, ColorValue, StyleProp, TextProps } from 'react-native';

import styles from './styles';

interface Props {
  numberOfLines: number;
  style?: StyleProp<TextProps>;
  color: ColorValue;
  fontSize: number;
  type: 'prefix' | 'suffix';
  labelAnimation: Animated.Value;
}

const Affix = ({
  labelAnimation,
  style,
  children,
  type,
  fontSize,
  color,
}: PropsWithChildren<Props>) => (
  <Animated.View
    style={[
      styles.container,
      styles[type],
      { opacity: labelAnimation, height: fontSize * 1.5 },
    ]}
  >
    <Animated.Text style={[style, styles.text, { fontSize, color }]}>
      {children}
    </Animated.Text>
  </Animated.View>
);

export default Affix;
