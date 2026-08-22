// 测试环境变量加载：在 config 模块被测试文件引入之前生效（setupFiles 先于测试模块执行）
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
