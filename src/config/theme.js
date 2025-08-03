import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00BCD4', // 青色主题
    accent: '#4CAF50', // 绿色辅助色
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: '#000000',
    notification: '#FF5722',
    // 自定义颜色
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    income: '#4CAF50',
    expense: '#F44336',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};
