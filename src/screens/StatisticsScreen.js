import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {
  Text,
  Card,
  Button,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ChartView from '../components/ChartView';
import databaseService from '../services/database';
import {getCurrentYearMonth, getMonthName} from '../utils/dateHelper';

const StatisticsScreen = () => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, [currentYear, currentMonth, selectedPeriod]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const stats = await databaseService.getMonthlyStats(currentYear, currentMonth);
      setMonthlyStats(stats);
      
      // 计算总计
      const total = stats.reduce((sum, item) => sum + item.total, 0);
      const count = stats.reduce((sum, item) => sum + item.count, 0);
      setTotalExpense(total);
      setTotalCount(count);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderSummaryCard = () => (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryTitle} variant="titleLarge">
          {currentYear}年{getMonthName(currentMonth)}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Icon name="account-balance-wallet" size={24} color={theme.colors.primary} />
            <Text style={styles.summaryLabel}>总支出</Text>
            <Text style={[styles.summaryValue, {color: theme.colors.expense}]}>
              ¥{totalExpense.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="receipt" size={24} color={theme.colors.primary} />
            <Text style={styles.summaryLabel}>笔数</Text>
            <Text style={styles.summaryValue}>
              {totalCount}笔
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="trending-down" size={24} color={theme.colors.primary} />
            <Text style={styles.summaryLabel}>日均</Text>
            <Text style={styles.summaryValue}>
              ¥{totalCount > 0 ? (totalExpense / new Date(currentYear, currentMonth, 0).getDate()).toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <Button
        mode="outlined"
        onPress={() => navigateMonth('prev')}
        icon="chevron-left"
        style={styles.navButton}>
        上月
      </Button>
      <Button
        mode="outlined"
        onPress={() => {
          const {year, month} = getCurrentYearMonth();
          setCurrentYear(year);
          setCurrentMonth(month);
        }}
        style={styles.navButton}>
        本月
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigateMonth('next')}
        icon="chevron-right"
        contentStyle={{flexDirection: 'row-reverse'}}
        style={styles.navButton}>
        下月
      </Button>
    </View>
  );

  const renderCategoryList = () => (
    <Card style={styles.categoryCard}>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle} variant="titleMedium">
          分类明细
        </Text>
        {monthlyStats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>本月暂无支出记录</Text>
          </View>
        ) : (
          monthlyStats.map((item, index) => {
            const percentage = totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(1) : 0;
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryCount}>{item.count}笔</Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={[styles.categoryAmount, {color: theme.colors.expense}]}>
                    ¥{item.total.toFixed(2)}
                  </Text>
                  <Text style={styles.categoryPercentage}>{percentage}%</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      
      {/* 时间段选择 */}
      <View style={styles.periodContainer}>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            {value: 'week', label: '周'},
            {value: 'month', label: '月'},
            {value: 'year', label: '年'},
          ]}
        />
      </View>

      {/* 导航按钮 */}
      {renderNavigationButtons()}

      {/* 汇总卡片 */}
      {renderSummaryCard()}

      {/* 饼图 */}
      {monthlyStats.length > 0 && (
        <ChartView
          type="pie"
          data={monthlyStats}
          title="支出分类占比"
        />
      )}

      {/* 分类明细 */}
      {renderCategoryList()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  periodContainer: {
    margin: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  summaryContent: {
    padding: 20,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    marginTop: 8,
    marginBottom: 4,
    color: '#666',
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryCard: {
    margin: 16,
    elevation: 4,
  },
  categoryContent: {
    padding: 20,
  },
  categoryTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryLeft: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
});

export default StatisticsScreen;
