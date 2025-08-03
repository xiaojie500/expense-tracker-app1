import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Text, useTheme, Chip} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import databaseService from '../services/database';

const CategoryPicker = ({selectedCategory, onCategorySelect, style}) => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await databaseService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类图标
  const getCategoryIcon = (iconName) => {
    return iconName || 'more-horiz';
  };

  // 渲染分类项
  const renderCategoryItem = (category) => {
    const isSelected = selectedCategory === category.name;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryItem,
          {
            backgroundColor: isSelected 
              ? category.color + '20' 
              : theme.colors.surface,
            borderColor: isSelected 
              ? category.color 
              : theme.colors.outline,
          },
        ]}
        onPress={() => onCategorySelect(category.name)}
        activeOpacity={0.7}>
        <Icon
          name={getCategoryIcon(category.icon)}
          size={24}
          color={isSelected ? category.color : theme.colors.onSurface}
        />
        <Text
          style={[
            styles.categoryText,
            {
              color: isSelected ? category.color : theme.colors.onSurface,
              fontWeight: isSelected ? 'bold' : 'normal',
            },
          ]}
          variant="bodyMedium">
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // 渲染快速选择芯片
  const renderQuickChips = () => {
    const quickCategories = categories.slice(0, 4); // 显示前4个常用分类
    
    return (
      <View style={styles.quickChipsContainer}>
        <Text style={styles.sectionTitle} variant="titleSmall">
          快速选择
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScrollView}>
          {quickCategories.map((category) => (
            <Chip
              key={category.id}
              mode={selectedCategory === category.name ? 'flat' : 'outlined'}
              selected={selectedCategory === category.name}
              onPress={() => onCategorySelect(category.name)}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedCategory === category.name 
                    ? category.color + '20' 
                    : 'transparent',
                },
              ]}
              textStyle={{
                color: selectedCategory === category.name 
                  ? category.color 
                  : theme.colors.onSurface,
              }}>
              {category.name}
            </Chip>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <Text>加载分类中...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* 快速选择芯片 */}
      {renderQuickChips()}
      
      {/* 所有分类网格 */}
      <View style={styles.allCategoriesContainer}>
        <Text style={styles.sectionTitle} variant="titleSmall">
          所有分类
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map(renderCategoryItem)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  quickChipsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  chipsScrollView: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
  },
  allCategoriesContainer: {
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    aspectRatio: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  categoryText: {
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default CategoryPicker;
