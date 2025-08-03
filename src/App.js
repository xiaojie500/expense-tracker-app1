import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 导入页面组件
import AddExpenseScreen from './screens/AddExpenseScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';

// 导入主题配置
import {theme} from './config/theme';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'AddExpense') {
                iconName = 'add-circle';
              } else if (route.name === 'Statistics') {
                iconName = 'bar-chart';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}>
          <Tab.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{
              title: '记账',
              tabBarLabel: '记账',
            }}
          />
          <Tab.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{
              title: '统计',
              tabBarLabel: '统计',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: '设置',
              tabBarLabel: '设置',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
