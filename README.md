# 📱 生活费统计APP

一个简洁实用的Android生活费统计应用，使用React Native开发。

## 🎯 功能特性

- ✅ **快速记账**: 金额输入、分类选择、日期设置
- ✅ **数据统计**: 月度汇总、饼图分析、趋势展示  
- ✅ **分类管理**: 8个预设分类，支持自定义
- ✅ **数据导出**: CSV格式导出，完整备份功能
- ✅ **本地存储**: SQLite数据库，无需网络
- ✅ **Material Design**: 清新蓝绿色主题界面

## 🚀 快速开始

### 📱 获取APK

1. **自动构建**: 推送代码到GitHub后自动构建APK
2. **下载APK**: 在[Releases页面](../../releases)下载最新版本
3. **安装使用**: 在Android设备上安装APK

### 💻 本地开发

```bash
# 安装依赖
npm install

# 运行Android应用
npm run android

# 构建Release APK
cd android
./gradlew assembleRelease
```

## 📊 技术栈

- **框架**: React Native 0.72.6
- **UI库**: React Native Paper
- **导航**: React Navigation 6
- **数据库**: SQLite
- **图表**: React Native Chart Kit

## 📱 系统要求

- **最低版本**: Android 5.0 (API 21)
- **目标版本**: Android 13 (API 33)
- **架构支持**: ARM64, ARM32, x86, x86_64

## 🎉 自动构建

本项目配置了GitHub Actions自动构建，推送代码后会自动：

1. 设置构建环境
2. 安装项目依赖
3. 构建Release APK
4. 创建Release版本
5. 上传APK文件

## 📖 项目结构

```
src/
├── components/          # 可复用组件
├── screens/            # 页面组件
├── services/           # 数据服务
├── utils/              # 工具函数
└── config/             # 配置文件
```

## 🔧 主要功能

### 记账功能
- 支持手动输入金额、选择分类、添加备注
- 日期选择器支持选择任意日期
- 表单验证确保数据完整性

### 统计分析
- 月度支出汇总和分类统计
- 饼图显示分类占比
- 支持月份切换查看历史数据

### 数据管理
- CSV格式导出支出记录
- JSON格式完整数据备份
- 月度报告生成

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。
