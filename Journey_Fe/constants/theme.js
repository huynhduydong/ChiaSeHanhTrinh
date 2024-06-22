import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',  // Màu nền chính xanh
    background: '#f5f5f5',  // Màu nền sáng
    text: '#000000',  // Màu chữ đen
    placeholder: '#a3a3a3',  // Màu placeholder sáng
    surface: '#ffffff',  // Màu bề mặt sáng
    accent: '#007BFF',  // Màu điểm nhấn xanh
    error: '#f13a59',  // Màu lỗi
    disabled: '#e0e0e0',  // Màu khi disable
    onSurface: '#000000',  // Màu chữ trên bề mặt
    notification: '#ff80ab',  // Màu thông báo
    success: '#28a745',  // Màu thành công
    warning: '#ffc107',  // Màu cảnh báo
    info: '#17a2b8',  // Màu thông tin
    dark: '#343a40',  // Màu tối
    light: '#f8f9fa',  // Màu sáng
    muted: '#6c757d',  // Màu muted (xám nhạt)

  },
};

export default theme;
