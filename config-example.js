// Example Configuration File
// Copy this to config.js and update with your credentials

const AIRTABLE_CONFIG = {
    // Step 1: Get your Personal Access Token from Airtable
    // Go to: https://airtable.com/create/tokens
    // Create a token with permissions: data.records:read and data.records:write
    // Add your base to the token scope
    API_KEY: 'pat1234567890abcdef1234567890abcdef12345678', // Replace with your token
    
    // Step 2: Your Base ID (already configured for Interview Transcript Analyzer)
    BASE_ID: 'appXAzaFQqHfzuJR6',
    
    // Table IDs (already configured for your base)
    TABLES: {
        REPORTS: 'tblYNrzfMFhoDc7fJ',
        UX_CATEGORIES: 'tblnS0underwj8fOmGjs',  
        ACADEMY_CATEGORIES: 'tblDVJIw7wp6fdfkm',
        TRANSCRIPTS: 'tbl4FE9t5TNVvRoms'
    },
    
    // Field IDs for the Reports table (configured for your schema)
    REPORT_FIELDS: {
        REPORT_TITLE: 'fld737e2XvOVLRKLS',
        DATA_SOURCE: 'fldBEHBHjIcGUVw9j',
        DATE_RANGE_START: 'fldk7gChdeXhFx3Y7',
        DATE_RANGE_END: 'fldfEPU2y1pZn8sSv',
        CATEGORY_FILTER: 'fld4hKKJivu6TDcno',
        ACADEMY_CATEGORY_FILTER: 'fldiZFBanyVMPqwjA',
        REPORT_TEMPLATE: 'fldBKNi2m6OVQkWKo',
        OUTPUT_FORMAT: 'fldwGwwM7p3xxEuDN',
        REPORT_PRIORITY: 'fld8gZfesJiQyNKsO',
        ADVANCED_FILTERS: 'fld0uPedu7uTsNeRf',
        REPORT_RECIPIENTS: 'fldlnKEMFDmmhWtnL',
        MULTI_SOURCE_ENABLED: 'fldXXXXXXXXXXXXXX', // Update with actual field ID
        REPORT_STATUS: 'fldkmjcXbia39uSle',
        CONFIG_VALIDATION: 'fldKFX3DkWkZ5oUZw',
        GENERATED_DATE: 'fldQHlkRgiuVxbzu7',
        AUTOMATION_ENABLED: 'fldgE8W0MLwXBwpQR'
    },
    
    // API Configuration
    API_BASE_URL: 'https://api.airtable.com/v0',
    
    // Step 3: N8N Configuration (optional - configure when ready for automation)
    N8N: {
        // Replace with your N8N webhook URL
        WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/report-trigger',
        
        // Set to true when N8N workflow is ready
        ENABLED: false
    }
};

// API Helper Functions (DO NOT MODIFY)
const AirtableAPI = {
    getHeaders() {
        return {
            'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
            'Content-Type': 'application/json'
        };
    },
    
    getTableUrl(tableId) {
        return `${AIRTABLE_CONFIG.API_BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${tableId}`;
    },
    
    async get(tableId, params = {}) {
        const url = new URL(this.getTableUrl(tableId));
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    },
    
    async post(tableId, data) {
        const response = await fetch(this.getTableUrl(tableId), {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }
        
        return response.json();
    }
};

// Validation Rules (DO NOT MODIFY)
const VALIDATION_RULES = {
    reportTitle: {
        required: true,
        minLength: 3,
        maxLength: 100
    },
    dateStart: {
        required: true,
        type: 'date'
    },
    dateEnd: {
        required: true,
        type: 'date',
        afterField: 'dateStart'
    },
    dataSource: {
        required: true,
        options: ['Beam Knowledge', 'UX issues']
    },
    reportTemplate: {
        required: true,
        options: ['Detailed Analysis', 'Executive Summary', 'Feature Breakdown', 'Issue Priority Matrix', 'Trend Analysis', 'Custom']
    },
    outputFormat: {
        required: true,
        minSelected: 1
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIRTABLE_CONFIG, AirtableAPI, VALIDATION_RULES };
}

/* 
SETUP INSTRUCTIONS:

1. Copy this file to config.js
2. Replace API_KEY with your Airtable Personal Access Token
3. Verify BASE_ID matches your base 
4. Update field IDs if you've added new fields to your Reports table
5. Configure N8N settings when automation is ready
6. Test the interface

GETTING YOUR API KEY:
1. Go to https://airtable.com/create/tokens  
2. Click "Create new token"
3. Name: "Report Generator Interface"
4. Permissions: data.records:read, data.records:write
5. Access: Add your "Interview Transcript Analyzer" base
6. Copy the generated token and paste above

FINDING FIELD IDs:
If you need to find field IDs for new fields:
1. Go to your base API documentation
2. Or use the Airtable MCP tools to inspect your schema
3. Update the REPORT_FIELDS object with correct IDs
*/