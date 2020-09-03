import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

function getOrientation({
  height,
  width
}: ScaledSize): 'portrait' | 'landscape' {
  if (height >= width) {
    return 'portrait';
  }
  return 'landscape';
}

export function useDeviceOrientation() {
  const [deviceOrientation, setDeviceOrientation] = useState(
    getOrientation(Dimensions.get('window'))
  );
  useEffect(() => {
    function updateState({ window }) {
      setDeviceOrientation(getOrientation(window));
    }
    Dimensions.addEventListener('change', updateState);
    return Dimensions.removeEventListener.bind(
      Dimensions,
      'change',
      updateState
    );
  }, []);
  return deviceOrientation;
}
