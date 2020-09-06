import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

type ToValue =
  | number
  | Animated.AnimatedValue
  | { x: number; y: number }
  | Animated.AnimatedValueXY;

export const useAnimatedValue = (initialValue: number): Animated.Value => {
  const ref = useRef(new Animated.Value(initialValue));
  return ref.current;
};

type AnimationType = 'spring' | 'timing';

interface BaseAnimationConfig {
  disable?: boolean;
  initialValue?: number;
  type?: AnimationType;
}

export type TimingAnimationConfig = BaseAnimationConfig &
  ({ type: 'timing' } & Animated.TimingAnimationConfig);

export type SpringAnimationConfig = BaseAnimationConfig &
  ({ type: 'spring' } & Animated.SpringAnimationConfig);

export type UseAnimationConfig = TimingAnimationConfig | SpringAnimationConfig;

const getInitialValue = (config: UseAnimationConfig) => {
  if (typeof config.initialValue !== 'undefined') {
    return config.initialValue;
  } else {
    return config.toValue as number;
  }
};

export const useAnimation = (
  config: UseAnimationConfig
): Animated.Value | null => {
  const animatedValue = useAnimatedValue(getInitialValue(config));

  useEffect(
    function animate() {
      if (animatedValue) {
        if (config.type === 'timing') {
          Animated.timing(animatedValue, config).start();
        } else if (config.type === 'spring') {
          Animated.spring(animatedValue, config).start();
        } else {
          throw new Error('unsupported animation type=' + (config as any).type);
        }
      }
    },
    [config, animatedValue]
  );

  return config.disable ? null : animatedValue;
};
