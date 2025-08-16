// Report Generator JavaScript
class ReportGenerator {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 3;
        this.formData = {};
        this.categories = {
            ux: [],
            academy: []
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadCategories();
        this.setDefaultDates();
        this.updateFormVisibility();
        this.loadDashboardData();
        this.setupFilterPresets();
        this.setupAutomationToggle();
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('submitBtn').addEventListener('click', (e) => this.handleSubmit(e));
        
        // Multi-source toggle
        document.getElementById('multiSource').addEventListener('change', (e) => this.handleMultiSourceChange(e));
        
        // Data source selection
        document.querySelectorAll('input[name="dataSource"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleDataSourceChange(e));
        });
        
        // Report template selection
        document.getElementById('reportTemplate').addEventListener('change', (e) => this.handleTemplateChange(e));
        
        // Date validation
        document.getElementById('dateStart').addEventListener('change', () => this.validateDateRange());
        document.getElementById('dateEnd').addEventListener('change', () => this.validateDateRange());
        
        // Form validation
        document.getElementById('reportForm').addEventListener('input', () => this.validateCurrentStep());
    }
    
    setDefaultDates() {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        document.getElementById('dateStart').value = thirtyDaysAgo.toISOString().split('T')[0];
        document.getElementById('dateEnd').value = today.toISOString().split('T')[0];
    }
    
    async loadCategories() {
        try {
            // Load UX Categories
            const uxResponse = await AirtableAPI.get(AIRTABLE_CONFIG.TABLES.UX_CATEGORIES, {
                maxRecords: 100
            });
            
            this.categories.ux = uxResponse.records || [];
            this.populateSelect('uxCategoriesCheckboxes', this.categories.ux);
            
            // Load Academy Categories
            const academyResponse = await AirtableAPI.get(AIRTABLE_CONFIG.TABLES.ACADEMY_CATEGORIES, {
                maxRecords: 100
            });
            
            this.categories.academy = academyResponse.records || [];
            this.populateSelect('academyCategoriesCheckboxes', this.categories.academy);
            
            // Initialize search functionality
            this.initializeSearch();
            
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showMessage('Error loading categories. Some features may not work properly.', 'warning');
        }
    }
    
    populateSelect(containerId, records) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (records.length === 0) {
            container.innerHTML = `
                <div class="category-empty">
                    <i class="fas fa-inbox"></i>
                    No categories found
                </div>
            `;
            return;
        }
        
        records.forEach(record => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.setAttribute('data-category-id', record.id);
            categoryItem.setAttribute('data-search-text', record.fields.Name.toLowerCase());
            
            const description = record.fields['Category Description'] || '';
            categoryItem.setAttribute('data-search-text', 
                (record.fields.Name + ' ' + description).toLowerCase()
            );
            
            categoryItem.innerHTML = `
                <div class="category-checkbox">
                    <input type="checkbox" 
                           id="cat_${record.id}" 
                           value="${record.id}"
                           onchange="updateCategoryCount('${containerId}')">
                    <span class="checkmark"></span>
                </div>
                <div class="category-content">
                    <div class="category-name">${record.fields.Name}</div>
                    ${description ? `<div class="category-description">${description}</div>` : ''}
                </div>
            `;
            
            // Make entire item clickable
            categoryItem.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const checkbox = categoryItem.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    categoryItem.classList.toggle('selected', checkbox.checked);
                    updateCategoryCount(containerId);
                }
            });
            
            container.appendChild(categoryItem);
        });
    }
    
    handleMultiSourceChange(e) {
        const isMultiSource = e.target.checked;
        const singleSourceContainer = document.getElementById('singleSourceContainer');
        const dataSourceRadios = document.querySelectorAll('input[name="dataSource"]');
        
        if (isMultiSource) {
            singleSourceContainer.style.display = 'none';
            dataSourceRadios.forEach(radio => radio.required = false);
            this.showAllCategoryGroups();
        } else {
            singleSourceContainer.style.display = 'block';
            dataSourceRadios.forEach(radio => radio.required = true);
            this.updateCategoryVisibility();
        }
    }
    
    handleDataSourceChange(e) {
        this.updateCategoryVisibility();
    }
    
    updateCategoryVisibility() {
        const selectedSource = document.querySelector('input[name="dataSource"]:checked')?.value;
        const isMultiSource = document.getElementById('multiSource').checked;
        
        const uxGroup = document.getElementById('uxCategoryGroup');
        const academyGroup = document.getElementById('academyCategoryGroup');
        
        if (isMultiSource) {
            this.showAllCategoryGroups();
        } else if (selectedSource === 'UX issues') {
            uxGroup.style.display = 'block';
            academyGroup.style.display = 'none';
        } else if (selectedSource === 'Beam Knowledge') {
            uxGroup.style.display = 'none';
            academyGroup.style.display = 'block';
        } else {
            uxGroup.style.display = 'none';
            academyGroup.style.display = 'none';
        }
    }
    
    showAllCategoryGroups() {
        document.getElementById('uxCategoryGroup').style.display = 'block';
        document.getElementById('academyCategoryGroup').style.display = 'block';
    }
    
    handleTemplateChange(e) {
        const advancedFiltersGroup = document.getElementById('advancedFiltersGroup');
        advancedFiltersGroup.style.display = e.target.value === 'Custom' ? 'block' : 'none';
    }
    
    validateDateRange() {
        const startDate = new Date(document.getElementById('dateStart').value);
        const endDate = new Date(document.getElementById('dateEnd').value);
        
        if (startDate && endDate && startDate >= endDate) {
            this.showMessage('End date must be after start date', 'error');
            return false;
        }
        
        return true;
    }
    
    validateCurrentStep() {
        let isValid = true;
        
        switch (this.currentStep) {
            case 1:
                isValid = this.validateStep1();
                break;
            case 2:
                isValid = this.validateStep2();
                break;
            case 3:
                isValid = this.validateStep3();
                break;
        }
        
        this.updateNavigationButtons(isValid);
        return isValid;
    }
    
    validateStep1() {
        const title = document.getElementById('reportTitle').value.trim();
        const startDate = document.getElementById('dateStart').value;
        const endDate = document.getElementById('dateEnd').value;
        
        return title.length >= 3 && startDate && endDate && this.validateDateRange();
    }
    
    validateStep2() {
        const isMultiSource = document.getElementById('multiSource').checked;
        
        if (isMultiSource) {
            return true; // Multi-source doesn't require specific data source selection
        }
        
        const selectedSource = document.querySelector('input[name="dataSource"]:checked');
        return selectedSource !== null;
    }
    
    validateStep3() {
        const template = document.getElementById('reportTemplate').value;
        const outputFormats = document.querySelectorAll('input[name="outputFormat"]:checked');
        
        return template && outputFormats.length > 0;
    }
    
    updateNavigationButtons(isValid) {
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (this.currentStep < this.maxSteps) {
            nextBtn.disabled = !isValid;
        } else {
            submitBtn.disabled = !isValid;
        }
    }
    
    nextStep() {
        if (this.currentStep < this.maxSteps && this.validateCurrentStep()) {
            this.currentStep++;
            this.updateFormVisibility();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormVisibility();
        }
    }
    
    updateFormVisibility() {
        // Update progress indicator
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            const stepNumber = index + 1;
            content.classList.toggle('active', stepNumber === this.currentStep);
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        
        if (this.currentStep < this.maxSteps) {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        }
        
        this.validateCurrentStep();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            this.showMessage('Please fill in all required fields correctly', 'error');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const formData = this.collectFormData();
            const recordData = this.formatForAirtable(formData);
            
            const response = await AirtableAPI.post(AIRTABLE_CONFIG.TABLES.REPORTS, {
                records: [{ fields: recordData }]
            });
            
            this.showMessage('Report created successfully! Your report is being processed.', 'success');
            
            // Trigger N8N automation if configured
            if (AIRTABLE_CONFIG.N8N.ENABLED && AIRTABLE_CONFIG.N8N.WEBHOOK_URL) {
                await this.triggerAutomation(response.records[0].id, formData);
            }
            
            // Reset form after successful submission
            setTimeout(() => {
                this.resetForm();
            }, 3000);
            
        } catch (error) {
            console.error('Error creating report:', error);
            this.showMessage(`Error creating report: ${error.message}`, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    collectFormData() {
        const formElement = document.getElementById('reportForm');
        const formData = new FormData(formElement);
        const data = {};
        
        // Basic fields
        data.reportTitle = formData.get('reportTitle');
        data.dateStart = formData.get('dateStart');
        data.dateEnd = formData.get('dateEnd');
        data.reportPriority = formData.get('reportPriority');
        data.reportTemplate = formData.get('reportTemplate');
        data.advancedFilters = formData.get('advancedFilters');
        data.reportRecipients = formData.get('reportRecipients');
        
        // Multi-source handling
        data.multiSource = document.getElementById('multiSource').checked;
        
        if (data.multiSource) {
            data.dataSource = 'Multi-Source'; // Custom value for multi-source reports
        } else {
            data.dataSource = formData.get('dataSource');
        }
        
        // Category selections
        data.uxCategories = Array.from(document.querySelectorAll('#uxCategoriesCheckboxes input[type="checkbox"]:checked')).map(cb => cb.value);
        data.academyCategories = Array.from(document.querySelectorAll('#academyCategoriesCheckboxes input[type="checkbox"]:checked')).map(cb => cb.value);
        
        // Output formats
        data.outputFormats = Array.from(document.querySelectorAll('input[name="outputFormat"]:checked')).map(cb => cb.value);
        
        return data;
    }
    
    formatForAirtable(data) {
        const fields = {};
        
        // Map form data to Airtable fields
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.REPORT_TITLE] = data.reportTitle;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.DATE_RANGE_START] = data.dateStart;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.DATE_RANGE_END] = data.dateEnd;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.REPORT_TEMPLATE] = data.reportTemplate;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.REPORT_PRIORITY] = data.reportPriority;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.OUTPUT_FORMAT] = data.outputFormats;
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.REPORT_STATUS] = 'Draft';
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.GENERATED_DATE] = new Date().toISOString().split('T')[0];
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.CONFIG_VALIDATION] = 'Pending';
        fields[AIRTABLE_CONFIG.REPORT_FIELDS.AUTOMATION_ENABLED] = AIRTABLE_CONFIG.N8N.ENABLED;
        
        // Handle data source
        if (data.multiSource) {
            fields[AIRTABLE_CONFIG.REPORT_FIELDS.MULTI_SOURCE_ENABLED] = true;
            // For multi-source, we might want to set both category filters
            if (data.uxCategories.length > 0) {
                fields[AIRTABLE_CONFIG.REPORT_FIELDS.CATEGORY_FILTER] = data.uxCategories;
            }
            if (data.academyCategories.length > 0) {
                fields[AIRTABLE_CONFIG.REPORT_FIELDS.ACADEMY_CATEGORY_FILTER] = data.academyCategories;
            }
        } else {
            fields[AIRTABLE_CONFIG.REPORT_FIELDS.DATA_SOURCE] = data.dataSource;
            fields[AIRTABLE_CONFIG.REPORT_FIELDS.MULTI_SOURCE_ENABLED] = false;
            
            // Set appropriate category filter based on data source
            if (data.dataSource === 'UX issues' && data.uxCategories.length > 0) {
                fields[AIRTABLE_CONFIG.REPORT_FIELDS.CATEGORY_FILTER] = data.uxCategories;
            } else if (data.dataSource === 'Beam Knowledge' && data.academyCategories.length > 0) {
                fields[AIRTABLE_CONFIG.REPORT_FIELDS.ACADEMY_CATEGORY_FILTER] = data.academyCategories;
            }
        }
        
        // Optional fields
        if (data.advancedFilters) {
            fields[AIRTABLE_CONFIG.REPORT_FIELDS.ADVANCED_FILTERS] = data.advancedFilters;
        }
        
        if (data.reportRecipients) {
            fields[AIRTABLE_CONFIG.REPORT_FIELDS.REPORT_RECIPIENTS] = data.reportRecipients;
        }
        
        return fields;
    }
    
    async triggerAutomation(recordId, formData) {
        try {
            const response = await fetch(AIRTABLE_CONFIG.N8N.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recordId: recordId,
                    action: 'generate_report',
                    baseId: AIRTABLE_CONFIG.BASE_ID,
                    tableId: AIRTABLE_CONFIG.TABLES.REPORTS,
                    formData: formData
                })
            });
            
            if (response.ok) {
                console.log('Automation triggered successfully');
            }
        } catch (error) {
            console.error('Error triggering automation:', error);
            // Don't show error to user as the record was created successfully
        }
    }
    
    resetForm() {
        document.getElementById('reportForm').reset();
        this.currentStep = 1;
        this.updateFormVisibility();
        this.setDefaultDates();
        this.clearMessages();
        
        // Reset multi-source toggle
        document.getElementById('multiSource').checked = false;
        this.handleMultiSourceChange({ target: { checked: false } });
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = show ? 'flex' : 'none';
    }
    
    showMessage(message, type = 'info') {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        
        const icon = this.getMessageIcon(type);
        messageDiv.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    getMessageIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    clearMessages() {
        document.getElementById('messageContainer').innerHTML = '';
    }
    
    initializeSearch() {
        // Initialize UX category search
        const uxSearch = document.getElementById('uxCategorySearch');
        if (uxSearch) {
            uxSearch.addEventListener('input', (e) => {
                this.filterCategories('uxCategoriesCheckboxes', e.target.value);
            });
        }
        
        // Initialize Academy category search
        const academySearch = document.getElementById('academyCategorySearch');
        if (academySearch) {
            academySearch.addEventListener('input', (e) => {
                this.filterCategories('academyCategoriesCheckboxes', e.target.value);
            });
        }
    }
    
    filterCategories(containerId, searchTerm) {
        const container = document.getElementById(containerId);
        const items = container.querySelectorAll('.category-item');
        const term = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const searchText = item.getAttribute('data-search-text') || '';
            if (searchText.includes(term)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Load and display dashboard data
    async loadDashboardData() {
        try {
            // Simulate API calls with sample data for now
            // In production, these would be real API calls
            
            // Academy Knowledge metrics
            document.getElementById('knowledgeCount').textContent = '1,247';
            document.getElementById('confidenceValue').textContent = '0.87';
            setTimeout(() => {
                const confidenceFill = document.getElementById('knowledgeConfidence');
                if (confidenceFill) confidenceFill.style.width = '87%';
            }, 500);

            // UX Issues metrics
            document.getElementById('uxIssuesCount').textContent = '89';
            document.getElementById('criticalIssues').textContent = '12';
            document.getElementById('highIssues').textContent = '23';

            // AI Insights metrics
            document.getElementById('insightsCount').textContent = '34';
            const sentimentBadge = document.getElementById('sentimentBadge');
            sentimentBadge.textContent = 'Positive';
            sentimentBadge.className = 'sentiment-badge positive';

            // Knowledge Graph metrics  
            document.getElementById('entitiesCount').textContent = '456';
            document.getElementById('criticalEntities').textContent = '8';
            document.getElementById('highEntities').textContent = '24';

        } catch (error) {
            console.warn('Could not load dashboard data:', error);
        }
    }

    // Setup filter preset buttons
    setupFilterPresets() {
        const presetButtons = document.querySelectorAll('.filter-preset');
        const filterTextarea = document.getElementById('advancedFilters');

        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                presetButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set the filter value
                const filterData = button.getAttribute('data-filter');
                if (filterTextarea) {
                    filterTextarea.value = JSON.stringify(JSON.parse(filterData), null, 2);
                }
            });
        });
    }

    // Setup automation toggle functionality
    setupAutomationToggle() {
        const automationToggle = document.getElementById('automationEnabled');
        const scheduleGroup = document.getElementById('scheduleGroup');

        if (automationToggle && scheduleGroup) {
            automationToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    scheduleGroup.style.display = 'block';
                    scheduleGroup.style.animation = 'fadeInUp 0.4s ease-out';
                } else {
                    scheduleGroup.style.display = 'none';
                }
            });
        }
    }
}

// Global functions for category management
window.selectAllCategories = function(type) {
    const containerId = type === 'ux' ? 'uxCategoriesCheckboxes' : 'academyCategoriesCheckboxes';
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:not(.hidden input)');
    
    checkboxes.forEach(checkbox => {
        if (!checkbox.closest('.category-item').classList.contains('hidden')) {
            checkbox.checked = true;
            checkbox.closest('.category-item').classList.add('selected');
        }
    });
    
    updateCategoryCount(containerId);
};

window.selectNoneCategories = function(type) {
    const containerId = type === 'ux' ? 'uxCategoriesCheckboxes' : 'academyCategoriesCheckboxes';
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.category-item').classList.remove('selected');
    });
    
    updateCategoryCount(containerId);
};

window.updateCategoryCount = function(containerId) {
    const container = document.getElementById(containerId);
    const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
    const count = checkedBoxes.length;
    
    // Update the visual selection state
    container.querySelectorAll('.category-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        item.classList.toggle('selected', checkbox.checked);
    });
    
    // Update the count display
    let countElement;
    if (containerId.includes('ux')) {
        countElement = document.getElementById('uxCategoryCount');
    } else {
        countElement = document.getElementById('academyCategoryCount');
    }
    
    if (countElement) {
        countElement.textContent = count === 0 ? '(0 selected)' : 
                                  count === 1 ? '(1 selected)' : 
                                  `(${count} selected)`;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Airtable is configured
    if (AIRTABLE_CONFIG.API_KEY === 'your-airtable-api-key-here') {
        console.warn('⚠️ Airtable API key not configured. Please update config.js with your credentials.');
        document.body.innerHTML = `
            <div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: #f3f4f6; border-radius: 0.5rem; text-align: center;">
                <h2>⚙️ Configuration Required</h2>
                <p>Please update the <code>config.js</code> file with your Airtable API credentials before using this interface.</p>
                <ol style="text-align: left; margin: 1rem 0;">
                    <li>Get your Personal Access Token from <a href="https://airtable.com/create/tokens" target="_blank">Airtable</a></li>
                    <li>Update the <code>API_KEY</code> in <code>config.js</code></li>
                    <li>Verify your <code>BASE_ID</code> and field IDs</li>
                    <li>Refresh this page</li>
                </ol>
            </div>
        `;
        return;
    }
    
    // Initialize the report generator
    new ReportGenerator();
});