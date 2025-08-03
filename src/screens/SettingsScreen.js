import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Button,
  Dialog,
  Portal,
  TextInput,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import storageService from '../services/storage';
import databaseService from '../services/database';
import {
  exportExpensesToCSV,
  exportFullBackup,
  shareCSVFile,
  generateMonthlyReport,
  cleanupTempFiles,
} from '../utils/exportData';
import {getCurrentYearMonth} from '../utils/dateHelper';

const SettingsScreen = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({});
  const [budgetDialogVisible, setBudgetDialogVisible] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await storageService.getUserSettings();
      setSettings(userSettings);
      setMonthlyBudget(userSettings.monthlyBudget?.toString() || '3000');
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = {...settings, [key]: value};
      await storageService.saveUserSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('更新设置失败:', error);
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const filePath = await exportExpensesToCSV();
      await shareCSVFile(filePath);
      showSnackbar('CSV导出成功！');
    } catch (error) {
      console.error('导出CSV失败:', error);
      Alert.alert('错误', '导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    setLoading(true);
    try {
      const filePath = await exportFullBackup();
      await shareCSVFile(filePath);
      showSnackbar('备份导出成功！');
    } catch (error) {
      console.error('导出备份失败:', error);
      Alert.alert('错误', '导出备份失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const {year, month} = getCurrentYearMonth();
      const filePath = await generateMonthlyReport(year, month);
      await shareCSVFile(filePath);
      showSnackbar('月度报告生成成功！');
    } catch (error) {
      console.error('生成报告失败:', error);
      Alert.alert('错误', '生成报告失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      
      // 这里可以添加导入逻辑
      Alert.alert('提示', '导入功能开发中...');
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('选择文件失败:', error);
      }
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '确认清除',
      '这将删除所有支出记录，此操作不可恢复！',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '确认清除',
          style: 'destructive',
          onPress: async () => {
            try {
              // 这里需要添加清除数据库的方法
              await storageService.clearAllData();
              showSnackbar('数据已清除');
            } catch (error) {
              Alert.alert('错误', '清除数据失败');
            }
          },
        },
      ]
    );
  };

  const handleSaveBudget = async () => {
    try {
      const budget = parseFloat(monthlyBudget);
      if (isNaN(budget) || budget < 0) {
        Alert.alert('错误', '请输入有效的预算金额');
        return;
      }
      
      await updateSetting('monthlyBudget', budget);
      setBudgetDialogVisible(false);
      showSnackbar('预算设置已保存');
    } catch (error) {
      Alert.alert('错误', '保存预算失败');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 基本设置 */}
      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>基本设置</List.Subheader>
          
          <List.Item
            title="月度预算"
            description={`当前预算: ¥${settings.monthlyBudget || 3000}`}
            left={(props) => <List.Icon {...props} icon="wallet" />}
            right={() => <Button onPress={() => setBudgetDialogVisible(true)}>设置</Button>}
          />
          
          <List.Item
            title="通知提醒"
            description="预算超支时提醒"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
              />
            )}
          />
        </List.Section>
      </Card>

      {/* 数据管理 */}
      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>数据管理</List.Subheader>
          
          <List.Item
            title="导出CSV"
            description="导出支出记录为CSV文件"
            left={(props) => <List.Icon {...props} icon="file-export" />}
            onPress={handleExportCSV}
            disabled={loading}
          />
          
          <List.Item
            title="完整备份"
            description="导出所有数据的备份文件"
            left={(props) => <List.Icon {...props} icon="backup-restore" />}
            onPress={handleExportBackup}
            disabled={loading}
          />
          
          <List.Item
            title="月度报告"
            description="生成当月支出分析报告"
            left={(props) => <List.Icon {...props} icon="chart-line" />}
            onPress={handleGenerateReport}
            disabled={loading}
          />
          
          <List.Item
            title="导入数据"
            description="从备份文件恢复数据"
            left={(props) => <List.Icon {...props} icon="file-import" />}
            onPress={handleImportData}
          />
        </List.Section>
      </Card>

      {/* 应用信息 */}
      <Card style={styles.card}>
        <List.Section>
          <List.Subheader>应用信息</List.Subheader>
          
          <List.Item
            title="版本信息"
            description="生活费统计 v1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          
          <List.Item
            title="清理缓存"
            description="清理临时文件"
            left={(props) => <List.Icon {...props} icon="delete-sweep" />}
            onPress={cleanupTempFiles}
          />
          
          <List.Item
            title="清除所有数据"
            description="删除所有支出记录"
            left={(props) => <List.Icon {...props} icon="delete-forever" />}
            titleStyle={{color: theme.colors.error}}
            onPress={handleClearData}
          />
        </List.Section>
      </Card>

      {/* 预算设置对话框 */}
      <Portal>
        <Dialog visible={budgetDialogVisible} onDismiss={() => setBudgetDialogVisible(false)}>
          <Dialog.Title>设置月度预算</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="预算金额 (¥)"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              keyboardType="numeric"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBudgetDialogVisible(false)}>取消</Button>
            <Button onPress={handleSaveBudget}>保存</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 成功提示 */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{backgroundColor: theme.colors.success}}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
});

export default SettingsScreen;
