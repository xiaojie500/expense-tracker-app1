import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import databaseService from '../services/database';
import {formatDate} from './dateHelper';

// 导出CSV格式的支出数据
export const exportExpensesToCSV = async () => {
  try {
    // 获取所有支出记录
    const expenses = await databaseService.getExpenses(1000, 0);
    
    // CSV头部
    const csvHeader = '日期,金额,分类,描述,创建时间\n';
    
    // 转换数据为CSV格式
    const csvData = expenses.map(expense => {
      const date = expense.date || '';
      const amount = expense.amount || 0;
      const category = expense.category || '';
      const description = (expense.description || '').replace(/,/g, '，'); // 替换逗号避免CSV格式问题
      const createdAt = expense.created_at || '';
      
      return `${date},${amount},${category},"${description}",${createdAt}`;
    }).join('\n');
    
    const csvContent = csvHeader + csvData;
    
    // 生成文件名
    const fileName = `支出记录_${formatDate(new Date()).replace(/-/g, '')}.csv`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
    // 写入文件
    await RNFS.writeFile(filePath, csvContent, 'utf8');
    
    return filePath;
  } catch (error) {
    console.error('导出CSV失败:', error);
    throw error;
  }
};

// 分享CSV文件
export const shareCSVFile = async (filePath) => {
  try {
    const shareOptions = {
      title: '分享支出记录',
      message: '我的支出记录数据',
      url: `file://${filePath}`,
      type: 'text/csv',
    };
    
    await Share.open(shareOptions);
  } catch (error) {
    console.error('分享文件失败:', error);
    throw error;
  }
};

// 导出完整的数据备份（JSON格式）
export const exportFullBackup = async () => {
  try {
    // 获取所有数据
    const expenses = await databaseService.getExpenses(10000, 0);
    const categories = await databaseService.getCategories();
    
    // 构建备份数据
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        expenses,
        categories,
      },
    };
    
    const jsonContent = JSON.stringify(backupData, null, 2);
    
    // 生成文件名
    const fileName = `支出记录备份_${formatDate(new Date()).replace(/-/g, '')}.json`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
    // 写入文件
    await RNFS.writeFile(filePath, jsonContent, 'utf8');
    
    return filePath;
  } catch (error) {
    console.error('导出备份失败:', error);
    throw error;
  }
};

// 导入备份数据
export const importBackupData = async (filePath) => {
  try {
    // 读取文件内容
    const fileContent = await RNFS.readFile(filePath, 'utf8');
    const backupData = JSON.parse(fileContent);
    
    // 验证数据格式
    if (!backupData.data || !backupData.data.expenses) {
      throw new Error('备份文件格式不正确');
    }
    
    // 导入支出记录
    const expenses = backupData.data.expenses;
    let importCount = 0;
    
    for (const expense of expenses) {
      try {
        await databaseService.addExpense(
          expense.amount,
          expense.category,
          expense.description,
          expense.date
        );
        importCount++;
      } catch (error) {
        console.log('跳过重复记录:', expense.id);
      }
    }
    
    return {
      success: true,
      importCount,
      totalCount: expenses.length,
    };
  } catch (error) {
    console.error('导入备份失败:', error);
    throw error;
  }
};

// 生成月度报告
export const generateMonthlyReport = async (year, month) => {
  try {
    // 获取月度统计数据
    const monthlyStats = await databaseService.getMonthlyStats(year, month);
    
    // 计算总支出
    const totalExpense = monthlyStats.reduce((sum, item) => sum + item.total, 0);
    
    // 生成报告内容
    let reportContent = `${year}年${month}月支出报告\n`;
    reportContent += `生成时间: ${formatDate(new Date())}\n\n`;
    reportContent += `总支出: ¥${totalExpense.toFixed(2)}\n`;
    reportContent += `支出笔数: ${monthlyStats.reduce((sum, item) => sum + item.count, 0)}\n\n`;
    reportContent += `分类明细:\n`;
    
    monthlyStats.forEach((item, index) => {
      const percentage = ((item.total / totalExpense) * 100).toFixed(1);
      reportContent += `${index + 1}. ${item.category}: ¥${item.total.toFixed(2)} (${percentage}%)\n`;
    });
    
    // 生成文件
    const fileName = `月度报告_${year}年${month}月.txt`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
    await RNFS.writeFile(filePath, reportContent, 'utf8');
    
    return filePath;
  } catch (error) {
    console.error('生成月度报告失败:', error);
    throw error;
  }
};

// 清理临时文件
export const cleanupTempFiles = async () => {
  try {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const tempFiles = files.filter(file => 
      file.name.includes('支出记录') || 
      file.name.includes('月度报告')
    );
    
    for (const file of tempFiles) {
      await RNFS.unlink(file.path);
    }
    
    console.log(`清理了 ${tempFiles.length} 个临时文件`);
  } catch (error) {
    console.error('清理临时文件失败:', error);
  }
};
