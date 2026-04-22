#!/usr/bin/env node
/**
 * Sync R2 posts metadata to D1 database
 * Run: node scripts/sync-posts-to-d1.js
 */

import https from 'https';

const ACCOUNT_ID = '0565bbd929fb31e068ba04d213d8ff8a';
const DATABASE_ID = '457c8fb0-7e83-4033-ae4d-cdf07a502ed4';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const R2_BUCKET = 'blog';

// Helper function for API requests
function apiRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Get R2 objects list
async function listR2Objects() {
  const result = await apiRequest(
    `/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects`
  );
  return result.result || [];
}

// Get R2 object content
async function getR2Object(key) {
  const result = await apiRequest(
    `/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${key}`
  );
  return result;
}

// Parse MDX frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });
  return frontmatter;
}

// Execute D1 query
async function executeD1Query(sql, params = []) {
  return apiRequest(
    `/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    'POST',
    { sql, params }
  );
}

// Generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Main sync function
async function syncPosts() {
  console.log('📂 Listing R2 objects...');
  const objects = await listR2Objects();
  const posts = objects.filter(obj => obj.key.startsWith('posts/') && obj.key.endsWith('.mdx'));
  
  console.log(`📄 Found ${posts.length} posts in R2`);
  
  for (const post of posts) {
    const slug = post.key.replace('posts/', '').replace('.mdx', '');
    console.log(`\n📝 Processing: ${slug}`);
    
    // Get content
    const content = await getR2Object(post.key);
    const contentStr = typeof content === 'string' ? content : content.result || '';
    
    // Parse frontmatter
    const frontmatter = parseFrontmatter(contentStr);
    console.log('   Frontmatter:', frontmatter);
    
    // Generate excerpt from content
    const contentWithoutFrontmatter = contentStr.replace(/^---[\s\S]*?---\n?/, '');
    const excerpt = contentWithoutFrontmatter
      .replace(/^#+ .*/gm, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 200);
    
    // Prepare post data
    const postData = {
      id: generateId(),
      title: frontmatter.title || slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()),
      slug: slug,
      excerpt: frontmatter.excerpt || excerpt || '',
      content: post.key, // Store R2 key as content reference
      cover_image: frontmatter.cover_image || frontmatter.image || null,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0,
    };
    
    console.log('   Data:', postData);
    
    // Insert or update in D1
    const sql = `
      INSERT OR REPLACE INTO posts (id, title, slug, excerpt, content, cover_image, date, likes, dislikes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    const result = await executeD1Query(sql, [
      postData.id,
      postData.title,
      postData.slug,
      postData.excerpt,
      postData.content,
      postData.cover_image,
      postData.date,
      postData.likes,
      postData.dislikes,
    ]);
    
    if (result.success) {
      console.log('   ✅ Synced successfully');
    } else {
      console.log('   ❌ Sync failed:', result.errors);
    }
  }
  
  console.log('\n🎉 Sync complete!');
  
  // Verify
  const verify = await executeD1Query('SELECT slug, title FROM posts');
  console.log('\n📊 D1 posts:', verify.result?.[0]?.results || []);
}

syncPosts().catch(console.error);
