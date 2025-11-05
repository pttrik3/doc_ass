# Project TODO

## Core Features
- [x] Database schema for storing forms and completions
- [x] Backend API integration with DeepSeek
- [x] Form input interface (paste blank form questions)
- [x] Client information input (free-form text area)
- [x] Form completion endpoint using DeepSeek
- [x] Display completed form with bold answers)
- [x] User authentication and authorization
- [x] API key management for DeepSeek
- [x] Form history/saved completions

## UI Components
- [x] Landing page with feature overview
- [x] Form creation/input page
- [x] Completion results display page
- [x] User dashboard with saved forms
- [x] Settings page for API key configuration

## Testing & Deployment
- [x] Test DeepSeek integration
- [x] Test form completion flow
- [x] Create checkpoint for deployment

## Rebranding & Updates
- [x] Change app name to "Documentation Assistant"
- [x] Remove specific references to DeepSeek/ASAM
- [x] Update UI text to be generic
- [ ] Add support for multiple document templates

## Template Management Feature
- [x] Add database schema for form templates
- [x] Create backend API for template CRUD operations
- [x] Build template management page (admin only)
- [x] Add template selector dropdown to form completion page
- [x] Import BPS form as initial template
- [x] Import Weekly UR template
- [x] Test template selection and usage
- [x] Save checkpoint with template feature complete

## Landing Page Update
- [x] Remove "Why Choose Documentation Assistant" section from Home page
- [x] Remove "How It Works" section from Home page
- [x] Simplify to show Document dropdown (BPS, Weekly UR) and View History button
- [x] Test updated landing page
- [x] Save checkpoint with simplified landing page

## Home Page Redesign
- [x] Show Client Information text box after document selection
- [x] Keep entire workflow on home page (no navigation to /complete)
- [x] Add submit button to process the form
- [x] Test the new workflow
- [x] Improve bold formatting in AI responses
- [x] Save checkpoint

## Home Page Cleanup
- [ ] Remove "Document Title" box from home page
- [ ] Remove "Blank Document Questions" section from home page
- [ ] Save checkpoint

## Match User's Exact Workflow
- [x] Update AI prompt to include "Client reports" instruction
- [x] Update AI prompt to include quotes from client instruction
- [x] Test with user's actual client data
- [x] Save checkpoint

## Tone Adjustment Feature
- [x] Add tone feedback prompt at end of completed document
- [x] Add buttons for tone adjustment (more formal, more casual, more empathetic, etc.)
- [x] Implement regenerate with tone adjustment functionality
- [x] Test tone adjustment feature (UI implemented, waiting for API response)
- [x] Save final checkpoint

## Clinical Summary Feature
- [x] Update AI prompt to generate comprehensive clinical summary at end of document
- [x] Include example clinical summary format in prompt
- [x] Test clinical summary generation
- [x] Save checkpoint

## Layout Adjustments
- [x] Reduce Client Information textarea to 4 visible lines
- [x] Move Completed Document section underneath Client Information
- [x] Change layout from two columns to single column vertical layout
- [x] Save checkpoint

## Tone Adjustment Checkboxes
- [x] Replace tone adjustment buttons with checkboxes
- [x] Update tone options: remove "More Formal", "More Empathetic", "More Professional"
- [x] Add new options: "More Concise", "More Clinical"
- [x] Keep: "More Casual", "More Detailed"
- [x] Allow multiple tone selections to be combined
- [x] Update backend to handle multiple tone adjustments
- [x] Save checkpoint

## Writing Style Example Feature
- [x] Add text input field for "Example of Your Tone and Writing Style"
- [x] Update AI prompt to incorporate user's writing style example
- [x] Test form completion with custom writing style
- [x] Save checkpoint

## Auto-scroll on Tone Adjustment
- [x] Add scroll to top when tone adjustment button is clicked
- [x] Save checkpoint

## Save for Later Feature
- [x] Add "Save for Later" button to save current progress
- [x] Store draft in database (template, client info, writing style, completed document)
- [x] Add draft status to database schema
- [x] Test save workflow
- [x] Save checkpoint

## Bold Questions & Privacy Updates
- [x] Update AI prompt to make all form questions bold in completed documents
- [x] Add privacy notice to login page and dialog
- [x] Verify writing style is saved per user (already implemented in database schema)
- [x] Test bold questions in completed documents
- [x] Save checkpoint

## Add Therapist Soap Note Template
- [x] Extract content from BLANKSOAPNote.doc
- [x] Add "Therapist Soap Note" template to database
- [x] Test new template selection
- [x] Save checkpoint

## Add Treatment Plan Template
- [x] Extract content from BLANKTreatmentPlan.doc
- [x] Add "Treatment Plan" template to database
- [x] Add "Problem" input field for Treatment Plan template
- [x] Update UI to show Problem field when Treatment Plan is selected
- [x] Update handleComplete to include Problem in client info
- [x] Test Treatment Plan with Problem input
- [x] Save checkpoint

## Remove Duplicate Template
- [x] Remove duplicate "Therapist Soap Note" template from database
- [x] Verify only one instance remains
- [x] Save checkpoint

## Replace AI with I
- [x] Find all instances of "AI" in UI text
- [x] Replace with "I" for more personal tone
- [x] Save checkpoint

## User Template Upload Feature
- [x] Add isCustom flag to distinguish user templates from system templates
- [x] Push database schema changes
- [x] Create upload template endpoint in backend
- [x] Update delete endpoint to allow users to delete their own custom templates
- [x] Build template upload UI in Templates page
- [x] Add file parsing for text files in frontend
- [x] Fix JSX syntax errors
- [x] Template upload feature ready for testing
- [x] Save checkpoint

## Update Treatment Plan Template
- [x] Extract content from updated BLANKTreatmentPlan.doc
- [x] Replace existing Treatment Plan template in database
- [x] Save checkpoint

## Update Problem Field Label
- [x] Change Problem field label to "What problem do you need the Treatment Plan for?"
- [x] Save checkpoint

## Update Treatment Plan with Examples
- [ ] Extract content from new BLANKTreatmentPlan.doc with format examples
- [ ] Replace existing Treatment Plan template in database
- [ ] Save checkpoint

## GitHub Export
- [ ] Update Treatment Plan template with examples first
- [ ] Create clean export archive for GitHub upload
- [ ] Include all necessary files (.env.example, README, etc.)
- [ ] Save checkpoint

## Treatment Plan Continuation Feature
- [x] Remove Clinical Summary from Treatment Plan prompt
- [x] Add "Is there another problem that needs a Treatment Plan?" prompt after completion
- [x] Allow user to create additional Treatment Plans without re-entering client info
- [x] Test continuous Treatment Plan creation workflow
- [x] Save checkpoint

## Domain Prefix Update
- [ ] Change domain prefix from "deepseekff" to "itsmyrecoveryff"
- [ ] Verify new URL works correctly

## GitHub Upload
- [x] Create comprehensive README.md with setup instructions
- [x] Create deployment guide (DEPLOYMENT.md)
- [x] Create GitHub upload instructions (GITHUB_UPLOAD.md)
- [x] Verify .gitignore is properly configured
- [x] Prepare project files for GitHub

## Treatment Plan Stacking Feature
- [x] Show problem input box immediately when user clicks "Yes, Create Another Treatment Plan"
- [x] Stack all completed Treatment Plans vertically (first, second, third, etc.)
- [x] Keep all previous Treatment Plans visible while adding new ones
- [x] Update UI to show cumulative Treatment Plans
- [x] Test multiple Treatment Plan creation
- [x] Save checkpoint

## Fix Treatment Plan Stacking Behavior
- [x] Remove scroll to top when clicking "Yes, Create Another Treatment Plan"
- [x] Show problem input box directly below completed Treatment Plans (not at top)
- [x] Keep all Treatment Plans visible while entering next problem
- [x] Remove need to re-enter client information
- [x] Test that Treatment Plans stack properly without scrolling
- [x] Save checkpoint

## Group Session DAP Note Feature
- [x] Add "Group Session DAP Note" template to database
- [x] Add to dropdown menu (at bottom of list)
- [x] Add "What Was The Group Topic:" input field
- [x] Add optional modality checkboxes (CBT, DBT, Person Centered, Motivation Enhancement, Mindfulness, ACT, 12 Step Education)
- [x] Update UI to show topic and modality fields for Group Session DAP Note
- [x] Update DeepSeek prompt to generate notes based on topic and modality
- [x] Follow format: Group Description, Positive Clients (Notes 1-5), Engaged Clients (Notes 6-25), Apathetic Clients (Notes 26-30)
- [x] Each note has D: (Data), A: (Assessment), P: (Plan) format
- [x] Test Group Session DAP Note generation
- [x] Save checkpoint

## Logo Background
- [x] Copy logo to public folder
- [x] Add background image to global styles at 20% opacity
- [x] Test logo appears on all pages
- [x] Save checkpoint

## Fix Background Logo
- [x] Investigate why background logo is not showing on all pages
- [x] Fix CSS to ensure logo appears on all pages (z-index: -1, fixed position)
- [x] Test on multiple pages
- [x] Save checkpoint

## Increase Background Logo Size
- [x] Double the logo size (from 35% to 70%)
- [x] Verify logo is visible on home page and all other pages
- [x] Save checkpoint

## Remove Client Information from Group Session DAP Notes
- [x] Hide Client Information field when Group Session DAP Note is selected
- [x] Update validation to not require Client Information for Group Session DAP Notes
- [x] Update DeepSeek prompt to generate notes without client info
- [x] Test Group Session DAP Note generation with only topic and modalities
- [x] Save checkpoint

## Fix Logo Not Showing on Documentation Assistant Page
- [x] Investigate why CSS background is not rendering
- [x] Try alternative approach (use layered background with linear-gradient overlay)
- [x] Verify logo file is accessible
- [x] Test logo visibility on all pages
- [x] Save checkpoint

## Implement Logo as Component Overlay
- [x] Remove CSS background approach (not working)
- [x] Add logo as fixed positioned div with background-image in Home component
- [x] Set proper z-index and opacity (z-0 for logo, z-10 for content)
- [x] Remove gradient background that was hiding logo
- [x] Test logo visibility - logo now visible at 20% opacity, 70% size
- [x] Save checkpoint

## Format Group Session DAP Notes with Line Breaks
- [x] Update DeepSeek prompt to format each note with D:, A:, P: on separate lines
- [x] Test formatting to ensure proper line breaks
- [x] Save checkpoint

## Implement Streaming for Document Completion
- [ ] Update DeepSeek API call to use streaming (stream: true)
- [ ] Update backend to handle Server-Sent Events (SSE) for streaming
- [ ] Update frontend to display streaming content in real-time
- [ ] Show loading indicator while streaming
- [ ] Test streaming with all document types
- [ ] Save checkpoint

## Update Group Session DAP Notes Format to Match Note1.doc
- [x] Update prompt to use exact format from Note1.doc (Note #, then D:, A:, P: as full paragraphs)
- [x] Each section should be 2-4 sentences with detailed clinical content
- [x] Test format matches the example
- [x] Save checkpoint

## Restrict Sidebar to Admin and Add Home Button
- [x] Restrict View History button to only show for pmdcredit@gmail.com
- [x] Add Home button to History page to return to main page
- [x] Test that non-admin users don't see View History button
- [x] Test Home button navigation works
- [x] Save checkpoint

## Add Loading Animation for Document Generation
- [x] Add animated progress bar or spinner while document is being generated
- [x] Show "Generating document..." message with animation
- [x] Display progress indicator in prominent location
- [x] Test loading animation appears during document completion
- [x] Save checkpoint

## Add Common Topics Dropdown for Group Session DAP Notes
- [x] Create dropdown with common topics for each modality (CBT, DBT, Person Centered, etc.)
- [x] Populate topic field when user selects from dropdown
- [x] Allow custom topic input as well
- [x] Test dropdown functionality
- [x] Save checkpoint

## Admin Topic Management Feature
- [x] Create database table for storing common topics by modality
- [x] Create admin page for managing topics
- [x] Add UI to add/edit/delete topics for each modality
- [x] Update Home page to fetch topics from database instead of hardcoded list
- [x] Restrict topic management page to admin only (tRPC procedures)
- [x] Add Manage Topics button to Home page for admin
- [x] Seed initial topics data
- [x] Test topic management functionality
- [x] Save checkpoint

## Show Manage Topics Only for Group Session DAP Notes
- [x] Update Home page to only show Manage Topics button when Group Session DAP Note is selected
- [x] Hide Manage Topics button when no template or other templates are selected
- [x] Test button visibility
- [x] Save checkpoint

## Create Deployment Guide for itsmyrecovery.co
- [x] Create step-by-step guide for GitHub upload
- [x] Create Vercel deployment instructions
- [x] Create Cloudflare DNS configuration guide
- [x] Include environment variables setup
- [x] Include custom domain configuration
- [x] Save deployment guide
