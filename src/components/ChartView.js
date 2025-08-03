import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text, Card, useTheme} from 'react-native-paper';
import {PieChart, BarChart, LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ChartView = ({type, data, title, style}) => {
  const theme = useTheme();

  // 图表配置
  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  // 渲染饼图
  const renderPieChart = () => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text>暂无数据</Text>
        </View>
      );
    }

    // 转换数据格式
    const pieData = data.map((item, index) => ({
      name: item.category || item.name,
      population: item.total || item.value,
      color: getCategoryColor(item.category || item.name, index),
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12,
    }));

    return (
      <PieChart
        data={pieData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
    );
  };

  // 渲染柱状图
  const renderBarChart = () => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text>暂无数据</Text>
        </View>
      );
    }

    const barData = {
      labels: data.map(item => item.label || item.category),
      datasets: [
        {
          data: data.map(item => item.value || item.total),
        },
      ],
    };

    return (
      <BarChart
        data={barData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={styles.chart}
      />
    );
  };

  // 渲染折线图
  const renderLineChart = () => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text>暂无数据</Text>
        </View>
      );
    }

    const lineData = {
      labels: data.map(item => item.label || item.date),
      datasets: [
        {
          data: data.map(item => item.value || item.amount),
          color: (opacity = 1) => `rgba(0, 188, 212, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    return (
      <LineChart
        data={lineData}
        width={screenWidth - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  // 获取分类颜色
  const getCategoryColor = (category, index) => {
    const colors = [
      '#FF5722', '#2196F3', '#9C27B0', '#FF9800',
      '#4CAF50', '#795548', '#607D8B', '#E91E63',
      '#3F51B5', '#009688', '#FFC107', '#8BC34A',
    ];
    
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
    
    return colorMap[category] || colors[index % colors.length];
  };

  // 渲染图表
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return renderPieChart();
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      default:
        return renderPieChart();
    }
  };

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.content}>
        {title && (
          <Text style={styles.title} variant="titleMedium">
            {title}
          </Text>
        )}
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartView;
