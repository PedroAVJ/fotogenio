# To Do

- See feature flags in vercel and posthog
- See relevant sentry integrations
- See relevant posthog integrations, for example:
  - Sentry
  - Stripe
- Stripe
  - Change colors for stripe embedded checkout
  - Add the correct payment methods
- Register site in Google Search Console
- Use different example photos for men and women in the upload photos section

## Data modeling

- Use supabase branches and add seed data
- Do not use clerk client, instead use the currentUser helper
- Upgrade to Next.js 15
  - Upgrade to eslint 9
  - Use special react linter for react compiler
- Use react query everywhere applicable with sentry error handling
- Use clerk elements instead of custom components
- Use session claims instead of saving data in database
  - Change to syncronous account creation
- Change to syncronous payment method creation
- Change to syncronous prediction creation
- Use cn utility where applicable
- Apply the font globally instead of importing it in each component
- Use variants instead of copying the code everywhere
- Figure out why the setZippedPhotosUrl query state is not being set before redirecting to create account
