# 🚀 Quick Start Guide - Report Generator Interface

**Your interface is configured and ready to run! Just follow these 3 simple steps:**

## ⚡ Step 1: Get Your Airtable API Key (2 minutes)

1. **Go to Airtable Tokens**: [https://airtable.com/create/tokens](https://airtable.com/create/tokens)

2. **Create New Token**:
   - **Name**: "Report Generator Interface"
   - **Scopes**: Select `data.records:read` and `data.records:write`

3. **Add Your Base**:
   - Click "Add a base" 
   - Search for **"Interview Transcript Analyzer"**
   - Select your base (ID: `appXAzaFQqHfzuJR6`)

4. **Create & Copy Token**: Copy the generated token (starts with `pat...`)

## 🔧 Step 2: Configure the Interface (30 seconds)

1. **Open**: `report-interface/config.js`

2. **Replace Line 8**:
   ```javascript
   // Change this:
   API_KEY: 'your-airtable-api-key-here',
   
   // To your token:
   API_KEY: 'pat1234567890abcdef...', // Your actual token
   ```

3. **Save** the file

## 🎯 Step 3: Start the Interface (10 seconds)

**Option A** - Python (if installed):
```bash
cd report-interface
python -m http.server 8000
```

**Option B** - Node.js (if installed):
```bash
cd report-interface
npx serve . -p 8000
```

**Option C** - Any web server of your choice

Then open: **[http://localhost:8000](http://localhost:8000)**

---

## ✅ **You're Ready!**

Your interface is now fully configured with:

- ✅ **Base ID**: `appXAzaFQqHfzuJR6` (Interview Transcript Analyzer)
- ✅ **Tables**: Reports, UX Categories, Academy Categories 
- ✅ **All Field IDs**: Mapped to your existing Reports table
- ✅ **Categories**: Will load automatically from your base
- ✅ **Validation**: Smart form validation built-in

## 🎨 **Interface Features You Can Use Now**

### **Multi-Step Form**:
1. **Basic Info**: Title, date range, priority
2. **Data Sources**: Choose UX Issues, Beam Knowledge, or both
3. **Configuration**: Templates, output formats, recipients

### **Smart Features**:
- **Dynamic Categories**: Show/hide based on data source
- **Date Validation**: Prevents invalid date ranges  
- **Multi-Source Reports**: Toggle to combine both data sources
- **6 Output Formats**: PDF, Excel, JSON, CSV, PowerBI, Email
- **Priority Levels**: Low, Normal, High, Urgent

### **What Happens When You Submit**:
1. ✅ Creates record in your Airtable Reports table
2. ✅ Sets status to "Draft" 
3. ✅ Loads categories from your existing data
4. ✅ Validates all inputs
5. ✅ Ready for N8N automation (when configured)

---

## 🔍 **Test Your Setup**

1. **Open Interface**: [http://localhost:8000](http://localhost:8000)
2. **Check Categories Load**: Should see your UX and Academy categories
3. **Fill Sample Report**: Use any test data
4. **Submit**: Should create record in Airtable Reports table
5. **Verify**: Check Airtable - new report should appear

---

## 🛠️ **Troubleshooting**

**Categories Not Loading?**
- Check API key permissions include your base
- Verify base ID is correct in config.js

**Form Won't Submit?**
- Check browser console for error details
- Verify all required fields are filled

**Configuration Issues?**
- All IDs are pre-configured for your base
- Only the API key needs to be added

---

## 🎯 **Next Steps** (Optional)

**N8N Integration**: 
- Set `N8N.ENABLED = true` in config.js
- Add your N8N webhook URL
- Reports will automatically trigger workflows

**Customization**:
- Modify colors in `styles.css`
- Add custom validation rules
- Extend with additional fields

---

**🎉 Your Report Generator Interface is ready to create beautiful reports from your transcript analysis data!**