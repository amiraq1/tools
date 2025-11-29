import { createRepository, getAuthenticatedUser } from '../server/github';
import { execSync } from 'child_process';

async function main() {
  const repoName = 'Tools';
  
  try {
    console.log('Getting GitHub user info...');
    const user = await getAuthenticatedUser();
    console.log(`Authenticated as: ${user.login}`);
    
    console.log(`Creating repository: ${repoName}...`);
    const repo = await createRepository(repoName, 'Tools application', false);
    console.log(`Repository created: ${repo.html_url}`);
    
    console.log('Initializing git and pushing code...');
    
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'inherit' });
    execSync(`git remote add origin ${repo.clone_url}`, { stdio: 'inherit' });
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n✅ Success! Repository created and code pushed.');
    console.log(`Repository URL: ${repo.html_url}`);
    
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
