# How to Add a New Blog Post

The blog system is now automated! When you add a new blog post, it will automatically appear at the top of the homepage blog section.

## Steps to Add a New Blog Post:

### 1. Create Your Blog Post HTML File
Create your new blog post in the `/blog/` directory following the existing format.

### 2. Add Blog Data to `js/blog-data.js`
Open `/js/blog-data.js` and **add your new blog post object to the TOP of the array**.

Example:
```javascript
const blogPosts = [
  // ⬇️ ADD YOUR NEW BLOG POST HERE AT THE TOP ⬇️
  {
    title: "Your New Blog Post Title",
    url: "blog/your-new-blog-post.html",
    date: "2025-11",  // Format: YYYY-MM (for sorting)
    dateDisplay: "November 2025",  // What users see
    excerpt: "Brief description of your blog post that appears in the preview.",
    image: "https://storage.googleapis.com/path-to-your-thumbnail.webp",
    featured: true  // Set to true for the first 3 posts (with images)
  },
  // Existing blog posts below...
  {
    title: "5 Signs Your Pennsylvania Business Needs Emergency Commercial Roof Repair",
    // ... rest of data
  },
  // ... more posts
];
```

### 3. Setting Featured Posts
- The **top 3 posts** with `featured: true` will appear as large cards with images on the homepage
- The next **10 posts** will appear in the compact list below
- Posts are automatically sorted by date (newest first)

### 4. Image Requirements
For featured posts (top 3):
- **Thumbnail size:** 360x239px
- **Format:** WebP (optimized)
- Upload to Google Cloud Storage

### 5. That's It!
The homepage will automatically:
- Display the 3 most recent featured posts with full cards
- Show the next 10 posts in the modern list format
- Sort everything by date (newest to oldest)

## Important Notes:
- **Always add new posts to the TOP of the array** in `blog-data.js`
- The `date` field should be in `YYYY-MM` format for proper sorting
- Set `featured: true` only for posts that have thumbnail images
- After the top 3, set `featured: false` or omit the property
- The system automatically loads posts when the page loads
- No need to edit the homepage HTML manually!

## Example of Full Entry:
```javascript
{
  title: "Winter Roof Prep Guide for Pennsylvania Homeowners",
  url: "blog/winter-roof-preparation-pennsylvania-guide.html",
  date: "2025-01",
  dateDisplay: "January 2025",
  excerpt: "Start winter roof preparation in September to avoid $1,100+ repair costs. Complete DIY guide for PA homeowners: prevent ice dams, snow damage & more.",
  image: "https://storage.googleapis.com/kws-clientele/Valley%20Peak%20Roofing%20Co/d.%20our-blog.html/Winter%20Roof%20Prep%20Guide%20for%20Pennsylvania%20Homeowners/winter-roof-prep-thumbnail.webp",
  featured: true
}
```
