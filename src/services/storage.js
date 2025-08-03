import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // 存储用户设置
  async saveUserSettings(settings) {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('保存用户设置失败:', error);
      throw error;
    }
  }

  // 获取用户设置
  async getUserSettings() {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('获取用户设置失败:', error);
      return this.getDefaultSettings();
    }
  }

  // 默认设置
  getDefaultSettings() {
    return {
      currency: '¥',
      theme: 'light',
      notifications: true,
      monthlyBudget: 3000,
      language: 'zh-CN',
    };
  }

  // 存储预算设置
  async saveBudget(category, amount, month) {
    try {
      const key = `budget_${category}_${month}`;
      await AsyncStorage.setItem(key, amount.toString());
    } catch (error) {
      console.error('保存预算设置失败:', error);
      throw error;
    }
  }

  // 获取预算设置
  async getBudget(category, month) {
    try {
      const key = `budget_${category}_${month}`;
      const budget = await AsyncStorage.getItem(key);
      return budget ? parseFloat(budget) : 0;
    } catch (error) {
      console.error('获取预算设置失败:', error);
      return 0;
    }
  }

  // 存储最近使用的分类
  async saveRecentCategories(categories) {
    try {
      await AsyncStorage.setItem('recentCategories', JSON.stringify(categories));
    } catch (error) {
      console.error('保存最近分类失败:', error);
    }
  }

  // 获取最近使用的分类
  async getRecentCategories() {
    try {
      const categories = await AsyncStorage.getItem('recentCategories');
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('获取最近分类失败:', error);
      return [];
    }
  }

  // 清除所有数据
  async clearAllData() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('清除数据失败:', error);
      throw error;
    }
  }

  // 导出数据
  async exportData() {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      
      const exportData = {};
      allData.forEach(([key, value]) => {
        exportData[key] = value;
      });
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  }

  // 导入数据
  async importData(dataString) {
    try {
      const data = JSON.parse(dataString);
      const pairs = Object.entries(data);
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('导入数据失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const storageService = new StorageService();
export default storageService;
