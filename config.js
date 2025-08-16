// ✅ Airtable Configuration - Secure Setup for Vercel
// API key is now handled server-side for security

const AIRTABLE_CONFIG = {
    // API credentials are handled by serverless function
    // No API key needed in client-side code!
    
    // ✅ Base ID (Interview Transcript Analyzer)
    BASE_ID: 'appXAzaFQqHfzuJR6',
    
    // ✅ Table IDs (verified from your base)
    TABLES: {
        REPORTS: 'tblYNrzfMFhoDc7fJ',
        UX_CATEGORIES: 'tblnS0unwj8fOmGjs',
        ACADEMY_CATEGORIES: 'tblDVJIw7wp6fdfkm',
        TRANSCRIPTS: 'tbl4FE9t5TNVvRoms'
    },
    
    // ✅ Field IDs for the Reports table (verified from schema)
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
        MULTI_SOURCE_ENABLED: 'fldbsYHDOwK6FKyn2',
        REPORT_STATUS: 'fldkmjcXbia39uSle',
        CONFIG_VALIDATION: 'fldKFX3DkWkZ5oUZw',
        AUTOMATION_ENABLED: 'fldgE8W0MLwXBwpQR',
        N8N_WORKFLOW_ID: 'fldrAOa5uHMDV8wDo',
        PROCESSING_TIME: 'fld7AJ2VlRQuIitcW'
    },
    
    // API Endpoints - Using Vercel serverless proxy
    API_BASE_URL: '/api/airtable-proxy',
    
    // N8N Configuration (optional)
    N8N: {
        WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/report-trigger',
        ENABLED: false // Set to true when N8N is configured
    }
};

// API Helper Functions - Updated for Vercel Proxy
const AirtableAPI = {
    // Base headers for proxy requests
    getHeaders() {
        return {
            'Content-Type': 'application/json'
        };
    },
    
    // Build proxy API URL for a specific table
    getTableUrl(tableId) {
        return `${AIRTABLE_CONFIG.API_BASE_URL}?table=${encodeURIComponent(tableId)}`;
    },
    
    // Generic GET request
    async get(tableId, params = {}) {
        const url = new URL(this.getTableUrl(tableId), window.location.origin);
        
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => url.searchParams.append(key, v));
            } else {
                url.searchParams.append(key, value);
            }
        });
        
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }
        
        return response.json();
    },
    
    // Generic POST request
    async post(tableId, data) {
        const response = await fetch(this.getTableUrl(tableId), {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
        }
        
        return response.json();
    }
};

// Validation Rules
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