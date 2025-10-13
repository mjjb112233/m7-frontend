// 自动化测试脚本 - 模拟Chrome Server功能
const puppeteer = require('puppeteer');

async function testPages() {
  console.log('🚀 开始自动化测试...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // 测试页面列表
  const testPages = [
    { name: 'CVV检测页面', url: 'http://localhost:3003/cvv-check' },
    { name: '充值页面', url: 'http://localhost:3003/recharge' },
    { name: 'BIN分类页面', url: 'http://localhost:3003/bin-classify' }
  ];
  
  for (const testPage of testPages) {
    console.log(`\n📄 测试 ${testPage.name}...`);
    
    try {
      // 导航到页面
      await page.goto(testPage.url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // 等待页面加载完成
      await page.waitForTimeout(2000);
      
      // 检查页面是否正常加载
      const title = await page.title();
      console.log(`✅ ${testPage.name} 加载成功 - 标题: ${title}`);
      
      // 检查是否有错误
      const errors = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]');
        return errorElements.length;
      });
      
      if (errors > 0) {
        console.log(`⚠️  ${testPage.name} 发现 ${errors} 个错误元素`);
      } else {
        console.log(`✅ ${testPage.name} 无错误元素`);
      }
      
      // 检查页面内容
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.length > 100;
      });
      
      if (hasContent) {
        console.log(`✅ ${testPage.name} 内容正常`);
      } else {
        console.log(`❌ ${testPage.name} 内容异常`);
      }
      
      // 特殊测试：充值页面
      if (testPage.name === '充值页面') {
        console.log('🔍 测试充值页面功能...');
        
        // 检查套餐列表
        const packages = await page.$$('[data-testid="package-card"], .package-card, [class*="package"]');
        console.log(`📦 找到 ${packages.length} 个套餐`);
        
        // 检查自定义充值
        const customInput = await page.$('input[type="number"], input[placeholder*="金额"]');
        if (customInput) {
          console.log('✅ 自定义充值输入框存在');
        }
        
        // 检查充值历史
        const historyTab = await page.$('[data-value="history"], [role="tab"]:nth-child(3)');
        if (historyTab) {
          console.log('✅ 充值历史标签存在');
        }
      }
      
      // 特殊测试：CVV检测页面
      if (testPage.name === 'CVV检测页面') {
        console.log('🔍 测试CVV检测页面功能...');
        
        // 检查步骤指示器
        const steps = await page.$$('[class*="step"], [data-testid*="step"]');
        console.log(`📊 找到 ${steps.length} 个步骤指示器`);
        
        // 检查配置步骤
        const configStep = await page.$('[class*="config"], [data-testid*="config"]');
        if (configStep) {
          console.log('✅ 配置步骤存在');
        }
      }
      
      // 特殊测试：BIN分类页面
      if (testPage.name === 'BIN分类页面') {
        console.log('🔍 测试BIN分类页面功能...');
        
        // 检查卡片输入
        const cardInput = await page.$('textarea, input[placeholder*="卡号"]');
        if (cardInput) {
          console.log('✅ 卡片输入框存在');
        }
        
        // 检查分类按钮
        const classifyBtn = await page.$('button:contains("分类"), button:contains("检测")');
        if (classifyBtn) {
          console.log('✅ 分类按钮存在');
        }
      }
      
    } catch (error) {
      console.log(`❌ ${testPage.name} 测试失败: ${error.message}`);
    }
  }
  
  console.log('\n🎉 测试完成！');
  await browser.close();
}

// 运行测试
testPages().catch(console.error);
