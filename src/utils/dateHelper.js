// 日期处理工具函数

// 格式化日期为 YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// 格式化日期为显示格式 MM月DD日
export const formatDisplayDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  return `${month}月${day}日`;
};

// 格式化日期为完整显示格式 YYYY年MM月DD日
export const formatFullDisplayDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  return `${year}年${month}月${day}日`;
};

// 获取今天的日期字符串
export const getTodayString = () => {
  return formatDate(new Date());
};

// 获取本月第一天
export const getMonthStart = (year, month) => {
  return `${year}-${String(month).padStart(2, '0')}-01`;
};

// 获取本月最后一天
export const getMonthEnd = (year, month) => {
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
};

// 获取当前年月
export const getCurrentYearMonth = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

// 获取月份名称
export const getMonthName = (month) => {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return months[month - 1] || '';
};

// 获取星期名称
export const getWeekdayName = (date) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date(date);
  return weekdays[d.getDay()];
};

// 计算两个日期之间的天数差
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// 判断是否为今天
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// 判断是否为本月
export const isThisMonth = (date) => {
  const today = new Date();
  const d = new Date(date);
  
  return d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// 获取相对时间描述
export const getRelativeTimeDescription = (date) => {
  if (isToday(date)) {
    return '今天';
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (formatDate(date) === formatDate(yesterday)) {
    return '昨天';
  }
  
  const daysDiff = getDaysDifference(date, new Date());
  if (daysDiff <= 7) {
    return `${daysDiff}天前`;
  }
  
  return formatDisplayDate(date);
};
