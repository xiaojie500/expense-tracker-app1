import React from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Card, Text, IconButton, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {formatDisplayDate, getRelativeTimeDescription} from '../utils/dateHelper';

const ExpenseItem = ({expense, onDelete, onEdit}) => {
  const theme = useTheme();

  // 获取分类图标
  const getCategoryIcon = (category) => {
    const iconMap = {
      '餐饮': 'restaurant',
      '交通': 'directions-car',
      '购物': 'shopping-cart',
      '娱乐': 'movie',
      '医疗': 'local-hospital',
      '教育': 'school',
      '住房': 'home',
      '其他': 'more-horiz',
    };
    return iconMap[category] || 'more-horiz';
  };

  // 获取分类颜色
  const getCategoryColor = (category) => {
    const colorMap = {
      '餐饮': '#FF5722',
      '交通': '#2196F3',
      '购物': '#9C27B0',
      '娱乐': '#FF9800',
      '医疗': '#F44336',
      '教育': '#4CAF50',
      '住房': '#795548',
      '其他': '#607D8B',
    };
    return colorMap[category] || theme.colors.primary;
  };

  // 确认删除
  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条支出记录吗？',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '删除',
          style: 'destructive',
          onPress: () => onDelete && onDelete(expense.id),
        },
      ]
    );
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onEdit && onEdit(expense)}
        activeOpacity={0.7}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getCategoryColor(expense.category) + '20'},
            ]}>
            <Icon
              name={getCategoryIcon(expense.category)}
              size={24}
              color={getCategoryColor(expense.category)}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.category} variant="titleMedium">
              {expense.category}
            </Text>
            <Text style={styles.description} variant="bodySmall">
              {expense.description || '无备注'}
            </Text>
            <Text style={styles.date} variant="bodySmall">
              {getRelativeTimeDescription(expense.date)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.amount, {color: theme.colors.expense}]} variant="titleLarge">
            -¥{expense.amount.toFixed(2)}
          </Text>
          <IconButton
            icon="delete"
            size={20}
            iconColor={theme.colors.error}
            onPress={handleDelete}
            style={styles.deleteButton}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  category: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  description: {
    color: '#666',
    marginBottom: 2,
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deleteButton: {
    margin: 0,
  },
});

export default ExpenseItem;
