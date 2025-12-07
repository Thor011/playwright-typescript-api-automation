# Quick Start Guide

Get up and running with the API Test Automation suite in 5 minutes!

## ⚡ Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd APITestAutomation
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment file
copy .env.example .env

# Edit .env file (optional - has defaults)
notepad .env
```

### Step 3: Run Tests
```bash
npm test
```

That's it! 🎉

## 📊 View Results

After tests complete:
```bash
npm run test:report
```

This opens an interactive HTML report in your browser.

## 🎯 Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Debug mode |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:report` | View HTML report |

## 📁 What's Included

- ✅ 27 automated test cases
- ✅ User CRUD operations tests
- ✅ Authentication flow tests
- ✅ Error handling tests
- ✅ Performance tests
- ✅ Security tests

## 🔧 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install`

### Issue: "TypeScript errors"
**Solution**: Install TypeScript globally
```bash
npm install -g typescript
```

### Issue: Tests timeout
**Solution**: Check API_BASE_URL in `.env` file

## 📖 Next Steps

1. ✅ Run tests successfully
2. 📚 Read [README.md](README.md) for detailed documentation
3. 🐛 Check [BUG_REPORTS.md](BUG_REPORTS.md) for sample bugs
4. 🚀 Review [TEST_EXECUTION_GUIDE.md](TEST_EXECUTION_GUIDE.md) for advanced usage

## 🎓 First Time with Playwright?

No problem! The framework is ready to use. Just:

1. Install dependencies (`npm install`)
2. Run tests (`npm test`)
3. View report (`npm run test:report`)

Check the beautiful interactive report to see:
- ✅ Which tests passed
- ❌ Which tests failed (if any)
- 📊 Execution time
- 🔍 Detailed logs

## 💡 Tips

- Use `--grep` to run specific tests: `npx playwright test --grep "TC-001"`
- Use `--headed` to see browser actions: `npm run test:headed`
- Use `--debug` to step through tests: `npm run test:debug`
- Check `test-results/` folder for detailed logs

---

**Ready to go?** Run `npm test` and watch the magic happen! ✨
