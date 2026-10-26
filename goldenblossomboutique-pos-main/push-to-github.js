const fs = require('fs');
const path = require('path');
const readline = require('readline');

// GitHub Direct Uploader for Golden Blossom Boutique POS
// Pushes all local updates directly to your GitHub repository without needing git CLI!

async function getFileSha(owner, repo, filePath, branch, token) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'GoldenBlossom-POS-Uploader'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
  } catch (err) {}
  return null;
}

async function uploadFile(owner, repo, filePath, localPath, branch, token, commitMsg) {
  const content = fs.readFileSync(localPath);
  const base64 = content.toString('base64');
  const sha = await getFileSha(owner, repo, filePath, branch, token);

  const body = {
    message: commitMsg || `Update ${filePath}`,
    content: base64,
    branch: branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'GoldenBlossom-POS-Uploader'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`${filePath}: ${err.message || res.statusText}`);
  }
  return await res.json();
}

async function promptInput(questionText) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(questionText, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n======================================================');
  console.log(' ✨ Golden Blossom Boutique - GitHub Direct Uploader ✨');
  console.log('======================================================\n');

  let token = process.argv[2] || process.env.GITHUB_TOKEN;
  let repo = process.argv[3] || process.env.GITHUB_REPO;
  let branch = process.argv[4] || process.env.GITHUB_BRANCH || 'main';

  if (!token) {
    console.log('To get a GitHub Token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)", select "repo" scope, and copy the token.\n');
    token = await promptInput('Enter your GitHub Personal Access Token: ');
  }

  if (!repo) {
    repo = await promptInput('Enter your repository (e.g. username/repo-name): ');
  }

  if (!token || !repo) {
    console.error('Error: Token and repository are required.');
    process.exit(1);
  }

  // Strip full URL if user pasted https://github.com/owner/repo
  repo = repo.replace('https://github.com/', '').replace(/\.git$/, '').trim();
  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    console.error('Error: Repository format must be "owner/repository-name".');
    process.exit(1);
  }

  console.log(`\nTarget: https://github.com/${owner}/${repoName} [branch: ${branch}]`);
  console.log('Uploading updated boutique files directly to GitHub...\n');

  const filesToUpload = [
    { file: 'index.html', local: path.join(__dirname, 'index.html'), desc: 'Enlarged QR code, styling & Cloud Sync' },
    { file: 'vercel.json', local: path.join(__dirname, 'vercel.json'), desc: 'Vercel cache-busting & API configuration' },
    { file: 'api/config.js', local: path.join(__dirname, 'api', 'config.js'), desc: 'Vercel Serverless Function' },
    { file: 'data.js', local: path.join(__dirname, 'data.js'), desc: 'Boutique data portable script' },
    { file: 'data.json', local: path.join(__dirname, 'data.json'), desc: 'Boutique inventory & sales data' },
    { file: 'supabase-schema.sql', local: path.join(__dirname, 'supabase-schema.sql'), desc: 'Supabase Realtime schema' },
    { file: 'SUPABASE_SETUP.md', local: path.join(__dirname, 'SUPABASE_SETUP.md'), desc: 'Setup documentation' }
  ];

  for (const item of filesToUpload) {
    if (!fs.existsSync(item.local)) continue;
    try {
      process.stdout.write(`Uploading ${item.file}... `);
      await uploadFile(owner, repoName, item.file, item.local, branch, token, `Update ${item.file} - ${item.desc}`);
      console.log('✅ Done');
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 Upload Complete!');
  console.log('Vercel will automatically re-deploy your site in ~15 seconds.');
  console.log('All devices visiting your Vercel link will now show the new version!');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('\nFatal Error:', err.message);
  process.exit(1);
});
