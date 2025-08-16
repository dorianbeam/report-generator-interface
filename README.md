# 📊 Report Generator Interface

A beautiful, modern web interface for creating automated reports from your Airtable transcript analysis data.

![Report Generator Interface](https://img.shields.io/badge/Status-Ready-brightgreen) ![Airtable](https://img.shields.io/badge/Airtable-API-blue) ![N8N](https://img.shields.io/badge/N8N-Integration-orange)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Multi-step Form**: Intuitive 3-step process for report creation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Validation**: Instant feedback on form inputs
- **Progress Indicators**: Visual step tracking with completion states
- **Loading States**: Professional loading overlays and animations

### 🔧 **Advanced Functionality**
- **Multi-Source Reports**: Combine data from both Beam Knowledge and UX Issues
- **Dynamic Category Filtering**: Show/hide categories based on data source selection
- **Smart Date Validation**: Prevents invalid date ranges
- **Multiple Output Formats**: PDF, Excel, JSON, CSV, PowerBI, Email
- **Priority Management**: Set report processing priority
- **Custom Templates**: 6 predefined templates + custom option

### 🤖 **Automation Integration**
- **Airtable API**: Direct integration with your existing base
- **N8N Webhooks**: Trigger automation workflows on report creation
- **Status Tracking**: Real-time report processing status
- **Error Handling**: Comprehensive error messaging and recovery

## 🚀 Quick Start

### 1. **Deploy to Vercel (Recommended)**

**Free, secure, and always-available hosting:**

1. **Fork/Clone this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
3. **Set Environment Variables**:
   - `AIRTABLE_API_KEY`: Your Airtable Personal Access Token
   - `AIRTABLE_BASE_ID`: `appXAzaFQqHfzuJR6`
4. **Deploy**: Your app will be live at `https://your-project.vercel.app`

📖 **Detailed Instructions**: See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)

### 2. **Local Development**

```bash
# Install Vercel CLI
npm install -g vercel

# Run locally
vercel dev
```

### 3. **Environment Setup**

Create `.env.local` for local development:
```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appXAzaFQqHfzuJR6
```

📋 **Details**: See [env-setup.md](env-setup.md)

## 📁 File Structure

```
report-interface/
├── api/
│   └── airtable-proxy.js    # Serverless function for secure API calls
├── lib/
│   └── utils.js             # Utility functions
├── index.html               # Main HTML structure
├── styles.css               # Modern CSS styling
├── script.js                # JavaScript functionality
├── config.js                # Airtable configuration (secure)
├── vercel.json              # Vercel deployment configuration
├── env-setup.md             # Environment variables guide
├── DEPLOYMENT-GUIDE.md      # Step-by-step deployment instructions
└── README.md                # This file
```

## 🔧 Configuration Details

### **Required Airtable Setup**

1. **Personal Access Token**:
   - Go to [Airtable Tokens](https://airtable.com/create/tokens)
   - Create new token with `data.records:read` and `data.records:write` permissions
   - Add your base to the token scope

2. **Field IDs**: Already configured in `config.js` for your Reports table

3. **API Access**: Ensure your Airtable base allows API access

### **Optional N8N Integration**

1. **Webhook Setup**: Create N8N workflow with webhook trigger
2. **Update Config**: Set `N8N.ENABLED = true` and add webhook URL
3. **Workflow Design**: Process the report data and update status in Airtable

## 🎯 Usage Guide

### **Step 1: Basic Information**
- **Report Title**: Descriptive name for identification
- **Date Range**: Start and end dates for data collection
- **Priority**: Processing priority (Low/Normal/High/Urgent)

### **Step 2: Data Source Selection**
- **Multi-Source Toggle**: Combine both data sources
- **Single Source**: Choose either Beam Knowledge or UX Issues
- **Category Filtering**: Select specific categories to include

### **Step 3: Report Configuration**
- **Template Selection**: Choose from 6 predefined templates
- **Output Formats**: Multiple format selection
- **Advanced Options**: JSON filters, email recipients

## 🔍 Advanced Features

### **Multi-Source Reports**
Enable the toggle to create reports combining:
- Beam Knowledge (Academy content, features)
- UX Issues (User feedback, problems)

### **Smart Category Filtering**
- Categories shown based on selected data source
- Multi-select support for granular control
- Real-time validation of selections

### **Custom Templates**
When "Custom" template is selected:
- Advanced filters field appears
- JSON configuration for complex queries
- Example: `{"confidenceScore": ">0.8", "featureType": "AI Feature"}`

### **Automation Integration**
- Report created in Airtable with "Draft" status
- N8N webhook triggered with report details
- Status updated throughout processing pipeline
- Email notifications to specified recipients

## 🎨 Customization

### **Styling**
Modify `styles.css` for branding:
```css
:root {
    --primary-color: #your-brand-color;
    --primary-hover: #your-hover-color;
}
```

### **Additional Fields**
Add new fields by:
1. Adding HTML input in `index.html`
2. Adding field ID to `config.js`
3. Handling in `collectFormData()` function

### **Validation Rules**
Extend `VALIDATION_RULES` in `config.js`:
```javascript
customField: {
    required: true,
    minLength: 5,
    pattern: /^[A-Z]/
}
```

## 🔒 Security Features

✅ **Secure by Default**: This Vercel deployment includes production-ready security:

### **API Key Protection**
- ✅ API keys are server-side only (never exposed to browsers)
- ✅ Environment variables managed securely by Vercel
- ✅ Serverless proxy handles all Airtable API calls

### **CORS & Headers**
- ✅ Proper CORS headers configured automatically
- ✅ Security headers (X-Frame-Options, CSP) enabled
- ✅ HTTPS enforced with automatic SSL certificates

### **Best Practices Applied**
- ✅ No sensitive data in client-side JavaScript
- ✅ Input validation and sanitization
- ✅ Error handling without information leakage

## 🐛 Troubleshooting

### **Common Issues**

**API Key Error**
```
Error: 401 Unauthorized
```
- Verify API key is correct
- Check token permissions include your base
- Ensure token hasn't expired

**Category Loading Failed**
```
Error loading categories
```
- Check base ID and table IDs in config
- Verify category tables exist and have 'Name' field
- Check API permissions

**Form Submission Failed**
```
API Error: 422 Unprocessable Entity
```
- Verify all required fields are mapped correctly
- Check field types match Airtable schema
- Validate date formats and select options

### **Debug Mode**
Open browser console to see:
- API requests/responses
- Form validation details
- Category loading status
- Automation trigger results

## 📈 Performance Optimization

### **Loading Speed**
- Categories loaded asynchronously
- Form validation happens client-side
- Minimal external dependencies

### **Mobile Optimization**
- Responsive design breakpoints
- Touch-friendly interactions
- Optimized for mobile keyboards

### **API Efficiency**
- Batch category loading
- Minimal field requests
- Error retry logic

## 🔄 Integration with N8N

### **Webhook Payload**
```json
{
    "recordId": "recXXXXXXXXXXXXXX",
    "action": "generate_report",
    "baseId": "appXAzaFQqHfzuJR6",
    "tableId": "tblYNrzfMFhoDc7fJ",
    "formData": {
        "reportTitle": "Weekly UX Analysis",
        "dataSource": "UX issues",
        "dateStart": "2024-01-01",
        "dateEnd": "2024-01-07"
    }
}
```

### **N8N Workflow Steps**
1. **Webhook Trigger**: Receive report request
2. **Airtable Read**: Get full report configuration
3. **Data Processing**: Query and analyze transcript data
4. **Report Generation**: Create output in requested formats
5. **Status Update**: Update Airtable with completion status
6. **Notification**: Send report to recipients

## 📞 Support

For issues or questions:
1. Check this README for common solutions
2. Review browser console for error details
3. Verify Airtable configuration and permissions
4. Test with minimal data set first

---

**🎉 Ready to generate beautiful reports from your transcript data!**