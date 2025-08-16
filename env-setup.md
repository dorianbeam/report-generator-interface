# Environment Variables Setup for Vercel

## Required Environment Variables

Add these environment variables in your Vercel dashboard (Settings > Environment Variables):

### `AIRTABLE_API_KEY`
- **Description**: Your Airtable Personal Access Token
- **How to get**: 
  1. Go to [Airtable Tokens](https://airtable.com/create/tokens)
  2. Create new token with `data.records:read` and `data.records:write` permissions
  3. Add your base to the token scope
- **Example**: `patzWXDfXDk9Jyqir.65a9234379720a3d66f8479bbb176277e742a749eddc749911247c39f5c9bee7`

### `AIRTABLE_BASE_ID`
- **Description**: Your Airtable Base ID (Interview Transcript Analyzer)
- **Value**: `appXAzaFQqHfzuJR6`

### `N8N_WEBHOOK_URL` (Optional)
- **Description**: N8N webhook URL for automation integration
- **Example**: `https://your-n8n-instance.com/webhook/report-trigger`

## Local Development

For local development with Vercel CLI, create a `.env.local` file in the project root:

```bash
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=appXAzaFQqHfzuJR6
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/report-trigger
```

**⚠️ Important**: Never commit `.env.local` to git - it should only be used for local development.