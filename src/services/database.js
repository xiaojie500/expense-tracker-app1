import SQLite from 'react-native-sqlite-storage';

// 启用调试模式
SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  constructor() {
    this.db = null;
  }

  // 初始化数据库
  async initDatabase() {
    try {
      this.db = await SQLite.openDatabase({
        name: 'ExpenseTracker.db',
        location: 'default',
      });
      
      await this.createTables();
      await this.insertDefaultCategories();
      console.log('数据库初始化成功');
      return this.db;
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  // 创建数据表
  async createTables() {
    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT,
        color TEXT
      );
    `;

    const createBudgetsTable = `
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        month TEXT NOT NULL,
        UNIQUE(category, month)
      );
    `;

    await this.db.executeSql(createExpensesTable);
    await this.db.executeSql(createCategoriesTable);
    await this.db.executeSql(createBudgetsTable);
  }

  // 插入默认分类
  async insertDefaultCategories() {
    const defaultCategories = [
      {name: '餐饮', icon: 'restaurant', color: '#FF5722'},
      {name: '交通', icon: 'directions-car', color: '#2196F3'},
      {name: '购物', icon: 'shopping-cart', color: '#9C27B0'},
      {name: '娱乐', icon: 'movie', color: '#FF9800'},
      {name: '医疗', icon: 'local-hospital', color: '#F44336'},
      {name: '教育', icon: 'school', color: '#4CAF50'},
      {name: '住房', icon: 'home', color: '#795548'},
      {name: '其他', icon: 'more-horiz', color: '#607D8B'},
    ];

    for (const category of defaultCategories) {
      try {
        await this.db.executeSql(
          'INSERT OR IGNORE INTO categories (name, icon, color) VALUES (?, ?, ?)',
          [category.name, category.icon, category.color]
        );
      } catch (error) {
        console.log('分类已存在:', category.name);
      }
    }
  }

  // 添加支出记录
  async addExpense(amount, category, description, date) {
    try {
      const result = await this.db.executeSql(
        'INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)',
        [amount, category, description, date]
      );
      return result[0].insertId;
    } catch (error) {
      console.error('添加支出记录失败:', error);
      throw error;
    }
  }

  // 获取支出记录
  async getExpenses(limit = 50, offset = 0) {
    try {
      const result = await this.db.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      const expenses = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        expenses.push(result[0].rows.item(i));
      }
      return expenses;
    } catch (error) {
      console.error('获取支出记录失败:', error);
      throw error;
    }
  }

  // 获取分类列表
  async getCategories() {
    try {
      const result = await this.db.executeSql('SELECT * FROM categories ORDER BY name');
      
      const categories = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        categories.push(result[0].rows.item(i));
      }
      return categories;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  }

  // 获取月度统计
  async getMonthlyStats(year, month) {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      
      const result = await this.db.executeSql(
        `SELECT category, SUM(amount) as total, COUNT(*) as count 
         FROM expenses 
         WHERE date BETWEEN ? AND ? 
         GROUP BY category 
         ORDER BY total DESC`,
        [startDate, endDate]
      );
      
      const stats = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        stats.push(result[0].rows.item(i));
      }
      return stats;
    } catch (error) {
      console.error('获取月度统计失败:', error);
      throw error;
    }
  }

  // 删除支出记录
  async deleteExpense(id) {
    try {
      await this.db.executeSql('DELETE FROM expenses WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('删除支出记录失败:', error);
      throw error;
    }
  }

  // 关闭数据库
  async closeDatabase() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// 创建单例实例
const databaseService = new DatabaseService();
export default databaseService;
