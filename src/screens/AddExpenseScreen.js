import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

import CategoryPicker from '../components/CategoryPicker';
import ExpenseItem from '../components/ExpenseItem';
import databaseService from '../services/database';
import {formatDate, getTodayString} from '../utils/dateHelper';

const AddExpenseScreen = () => {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    initializeDatabase();
    loadRecentExpenses();
  }, []);

  const initializeDatabase = async () => {
    try {
      await databaseService.initDatabase();
    } catch (error) {
      console.error('数据库初始化失败:', error);
      Alert.alert('错误', '数据库初始化失败，请重启应用');
    }
  };

  const loadRecentExpenses = async () => {
    try {
      const expenses = await databaseService.getExpenses(5, 0);
      setRecentExpenses(expenses);
    } catch (error) {
      console.error('加载最近记录失败:', error);
    }
  };

  const handleAddExpense = async () => {
    // 验证输入
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('错误', '请输入有效的金额');
      return;
    }

    if (!category) {
      Alert.alert('错误', '请选择支出分类');
      return;
    }

    setLoading(true);

    try {
      await databaseService.addExpense(
        parseFloat(amount),
        category,
        description.trim(),
        formatDate(date)
      );

      // 清空表单
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date());

      // 刷新最近记录
      await loadRecentExpenses();

      // 显示成功消息
      setSnackbarMessage('记账成功！');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('添加支出失败:', error);
      Alert.alert('错误', '添加支出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await databaseService.deleteExpense(expenseId);
      await loadRecentExpenses();
      setSnackbarMessage('删除成功！');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('删除支出失败:', error);
      Alert.alert('错误', '删除失败，请重试');
    }
  };

  const formatAmountInput = (text) => {
    // 只允许数字和小数点
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // 确保只有一个小数点
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // 限制小数点后两位
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return cleaned;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 记账表单 */}
        <Card style={styles.formCard}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle} variant="titleLarge">
              添加支出
            </Text>

            {/* 金额输入 */}
            <TextInput
              label="金额 (¥)"
              value={amount}
              onChangeText={(text) => setAmount(formatAmountInput(text))}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="currency-cny" />}
              placeholder="0.00"
            />

            {/* 分类选择 */}
            <View style={styles.categorySection}>
              <Text style={styles.inputLabel} variant="bodyLarge">
                选择分类
              </Text>
              <CategoryPicker
                selectedCategory={category}
                onCategorySelect={setCategory}
                style={styles.categoryPicker}
              />
            </View>

            {/* 备注输入 */}
            <TextInput
              label="备注 (可选)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
              left={<TextInput.Icon icon="note-text" />}
              placeholder="添加备注信息..."
            />

            {/* 日期选择 */}
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar">
              {formatDate(date)}
            </Button>

            {/* 添加按钮 */}
            <Button
              mode="contained"
              onPress={handleAddExpense}
              loading={loading}
              disabled={loading}
              style={styles.addButton}
              icon="plus">
              添加支出
            </Button>
          </View>
        </Card>

        {/* 最近记录 */}
        {recentExpenses.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle} variant="titleMedium">
              最近记录
            </Text>
            {recentExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={handleDeleteExpense}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* 日期选择器 */}
      <DatePicker
        modal
        open={showDatePicker}
        date={date}
        mode="date"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          setDate(selectedDate);
        }}
        onCancel={() => setShowDatePicker(false)}
        title="选择日期"
        confirmText="确认"
        cancelText="取消"
      />

      {/* 成功提示 */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{backgroundColor: theme.colors.success}}>
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    margin: 16,
    elevation: 4,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryPicker: {
    marginTop: 8,
  },
  dateButton: {
    marginBottom: 20,
  },
  addButton: {
    paddingVertical: 8,
  },
  recentSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

export default AddExpenseScreen;
