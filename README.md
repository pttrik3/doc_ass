# Documentation Assistant

A secure web application that uses DeepSeek AI to automatically complete clinical and therapeutic forms based on client information. This application streamlines the documentation workflow by providing template management, writing style customization, and document history.

## Features

### Core Functionality
- **AI-Powered Form Completion**: Automatically completes forms using DeepSeek AI with your client information
- **Template Management**: Pre-loaded templates (BPS Assessment, Weekly UR, Therapist Soap Note, Treatment Plan) plus custom template upload
- **Writing Style Matching**: Optional field to paste your writing style example for personalized tone
- **Tone Adjustment**: Multi-select checkboxes (More Casual, More Concise, More Clinical, More Detailed) to regenerate documents
- **Clinical Summary**: Auto-generated comprehensive summary at the end of completed documents (except Treatment Plans)
- **Treatment Plan Continuation**: Create multiple Treatment Plans for the same client without re-entering information

### User Features
- **Secure Authentication**: Email/password login with bcrypt hashing
- **Encrypted API Keys**: Your DeepSeek API key is encrypted using AES-256-CBC before storage
- **Document History**: View and manage all completed documents
- **Save for Later**: Draft functionality to save work in progress
- **Custom Templates**: Upload your own templates (.txt, .doc, .docx, .pdf)

### Privacy & Security
- No personal information collected beyond email for login
- API keys encrypted at rest
- All client data stored securely in your private database
- First-person language ("I" instead of "AI") for personal tone

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4
- **Backend**: Node.js + Express 4 + tRPC 11
- **Database**: MySQL/TiDB (via Drizzle ORM)
- **Authentication**: Email/password with bcrypt + JWT sessions
- **AI Integration**: DeepSeek API (deepseek-chat model)
- **File Processing**: Multer for uploads, text extraction for various formats

## Prerequisites

- Node.js 18+ and pnpm
- MySQL or TiDB database
- DeepSeek API key ([Get one here](https://platform.deepseek.com/))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/documentation-assistant.git
cd documentation-assistant
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secure-random-secret-key-change-this

# Application
VITE_APP_TITLE=Documentation Assistant
VITE_APP_LOGO=/logo.svg

# OAuth (if using Manus OAuth, otherwise implement your own auth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name
```

**Important**: 
- Generate a strong `JWT_SECRET` using: `openssl rand -base64 32`
- Never commit `.env` to version control
- Users will provide their own DeepSeek API keys through the application UI

### 4. Initialize Database

```bash
pnpm db:push
```

This will create all necessary tables:
- `users` - User accounts
- `api_keys` - Encrypted DeepSeek API keys
- `templates` - Form templates (system and custom)
- `documents` - Completed documents and drafts

### 5. Seed Initial Templates

The application includes 4 pre-loaded templates. To add them to your database, run:

```bash
node scripts/seed-templates.js
```

Or manually insert them through the Templates page after logging in as an admin.

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### First-Time Setup

1. **Create Account**: Register with email and password
2. **Configure API Key**: Go to Settings and enter your DeepSeek API key (it will be encrypted before storage)
3. **Select Template**: Choose from pre-loaded templates or upload your own
4. **Complete Documents**: Enter client information and optional writing style example, then click "Complete Document"

### Workflow

1. **Select Document**: Choose from dropdown (BPS Assessment, Weekly UR, Therapist Soap Note, Treatment Plan)
2. **Enter Problem** (Treatment Plan only): Specify the problem (e.g., "Alcohol Use Disorder")
3. **Enter Client Information**: Paste all relevant client details in free-form text
4. **Add Writing Style** (Optional): Paste an example of your writing to match your tone
5. **Complete Document**: Click button to generate completed form
6. **Adjust Tone** (Optional): Select checkboxes to regenerate with different tone
7. **Save or Continue**: Save for later or create another Treatment Plan for the same client

### AI Output Format

All completed documents follow this format:
- **Questions are bold** using markdown syntax
- Answers start with "Client reports,"
- Direct quotes from client information included where appropriate
- Clinical Summary auto-generated at end (except Treatment Plans)

### Template Upload

Supported formats: `.txt`, `.doc`, `.docx`, `.pdf`

Upload your own blank form templates through the Templates page. The system will extract text and make them available in the document dropdown.

## Deployment

### Deploy to Your Own Domain

1. **Build the Application**:
   ```bash
   pnpm build
   ```

2. **Set Production Environment Variables**: Configure all `.env` variables on your hosting platform

3. **Deploy**: Upload to your hosting service (Vercel, Railway, Render, etc.)

4. **Database Migration**: Run `pnpm db:push` on production

### Recommended Hosting Platforms

- **Vercel** (Frontend + Serverless Functions)
- **Railway** (Full-stack with database)
- **Render** (Full-stack with database)
- **AWS/GCP/Azure** (Advanced users)

## Security Notes

### Code Protection
- **GitHub**: Keep your repository private
- **Minification**: Production builds are automatically minified and obfuscated
- **Environment Variables**: API keys and secrets are never in code, only in `.env`
- **Database**: Your client data is in your private database, not accessible to others

### API Key Security
- DeepSeek API keys are encrypted using AES-256-CBC before storage
- Encryption key derived from `JWT_SECRET` environment variable
- Keys are decrypted only when needed for API calls
- Each user's API key is isolated and encrypted separately

## Project Structure

```
documentation-assistant/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── pages/          # Page components (Home, Templates, History, Settings)
│   │   ├── components/     # Reusable UI components (shadcn/ui)
│   │   ├── lib/            # tRPC client setup
│   │   └── index.css       # Global styles
│   └── public/             # Static assets
├── server/                  # Backend Express + tRPC
│   ├── routers.ts          # tRPC API routes
│   ├── db.ts               # Database queries
│   ├── deepseek.ts         # DeepSeek API integration
│   └── _core/              # Framework plumbing (auth, context, etc.)
├── drizzle/                 # Database schema and migrations
│   └── schema.ts           # Table definitions
└── shared/                  # Shared constants and types
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in `.env`
- Ensure database server is running
- Check firewall rules allow connection

### DeepSeek API Errors
- Verify API key is valid at [DeepSeek Platform](https://platform.deepseek.com/)
- Check API quota/credits
- Review error messages in browser console

### Template Upload Failures
- Ensure file size is under 16MB
- Verify file format is supported (.txt, .doc, .docx, .pdf)
- Check server logs for text extraction errors

## Contributing

This is a private project. If you have suggestions or find bugs, please contact the repository owner.

## License

Proprietary - All rights reserved

## Support

For questions or issues:
- Check the troubleshooting section above
- Review server logs for error details
- Contact the application administrator

## Changelog

### Version 1.0 (Current)
- Initial release with core features
- 4 pre-loaded templates
- DeepSeek AI integration
- Treatment Plan continuation workflow
- Custom template upload
- Tone adjustment with multi-select
- Clinical Summary auto-generation
- Draft save functionality
- Document history
- Encrypted API key storage
