# More Than Conquerors Faith Church

## Current State
New project. No existing code or assets.

## Requested Changes (Diff)

### Add
- Full website for More Than Conquerors Faith Church, Birmingham AL, led by Apostle Steve Green
- Multi-page single-page app with anchor-based navigation: Home, About, Leadership, Watch Messages, Events, Give, Contact
- Hero section: fullscreen cinematic image, headline, CTA buttons (Watch Live, Plan Your Visit, Give Online)
- Church Legacy section: founding story, mission, vision, Birmingham community impact
- Leadership section: Apostle Steve Green featured prominently with bio and sermon links
- Watch Messages section: featured latest sermon video embed, sermon archive grid, livestream info
- Events section: upcoming event cards (Sunday service, Bible study, conferences, youth, community)
- Community Impact section: outreach programs, youth ministry, family programs, counseling/support
- Plan Your Visit section: service times, location/directions, parking, what to expect, children's ministry, embedded map
- Giving section: digital giving portal with explanation of ministry impact
- Testimonies section: member stories emphasizing faith, healing, restoration, growth
- Prayer Request form: name, email, prayer request textarea, submit
- Footer: address, phone, email, social media links, newsletter signup, service times
- Mobile-first responsive design
- Backend: events management (CRUD), prayer requests (submit/list), sermon entries, newsletter email capture, testimony submissions

### Modify
None (new project)

### Remove
None (new project)

## Implementation Plan
1. Generate hero worship/Birmingham skyline image and Apostle leadership image
2. Select backend components (authorization for admin)
3. Generate Motoko backend with: Event, Sermon, PrayerRequest, Testimony, NewsletterSubscriber data types and CRUD endpoints
4. Build full React frontend:
   - Sticky navigation with mobile hamburger menu
   - Hero section with cinematic image, headline, and 3 CTA buttons
   - Legacy/About section with mission copy
   - Leadership section with Apostle Green photo and bio
   - Watch Messages section with video embed + archive
   - Events section with card grid and registration links
   - Community Impact section with program highlights
   - Plan Your Visit section with service times and map embed
   - Giving section with online giving portal copy
   - Testimonies section with story cards
   - Prayer request form wired to backend
   - Newsletter signup wired to backend
   - Footer with all required info
