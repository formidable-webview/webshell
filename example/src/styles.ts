import { LayoutAnimation } from 'react-native';

export const BOTTOM_SHEET_CONTENT_HEIGHT = 720;
export const STAT_HEIGHT = 65;
export const TOP_TEXT_HEIGHT = 180;
export const APPBAR_HEIGHT = 45;
export const BOTTOM_SHEET_COLLAPSED_OFFSET = APPBAR_HEIGHT;

export const animateNextFrame = () => {
  LayoutAnimation.configureNext({
    duration: 200,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    }
  });
};
