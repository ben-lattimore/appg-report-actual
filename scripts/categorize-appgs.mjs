import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const THEMES_FILE = path.join(RAW_DIR, 'themes.json');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;

// Helper function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to categorize a single APPG using OpenAI o3
async function categorizeAPPG(appg, themes, retryCount = 0) {
  const prompt = `You are an expert in UK parliamentary affairs and policy categorization. 

Given this All-Party Parliamentary Group (APPG):

Name: ${appg.name}
Title: ${appg.title}
Purpose: ${appg.purpose}

Categorize it into one or more of these predefined themes. Each APPG must have at least one subcategory, but can have multiple if relevant:

${JSON.stringify(themes, null, 2)}

Rules:
1. Every APPG must be assigned to at least one subcategory
2. Multiple categories are allowed and encouraged if the APPG spans multiple areas
3. Be specific - choose the most relevant subcategories
4. Consider the APPG's stated purpose carefully
5. For country/region-specific APPGs, always include the relevant World Affairs subcategory

Return ONLY a valid JSON object with this exact structure:
{
  "categories": [
    {
      "category": "Category Name",
      "subcategories": ["Subcategory1", "Subcategory2"]
    }
  ]
}

Do not include any explanation or additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "o3", 
      messages: [
        {
          role: "system",
          content: "You are a precise categorization assistant. Return only valid JSON responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const content = response.choices[0].message.content.trim();
    
    // Parse and validate the JSON response
    try {
      const categorization = JSON.parse(content);
      
      // Validate the structure
      if (!categorization.categories || !Array.isArray(categorization.categories)) {
        throw new Error('Invalid categorization structure');
      }
      
      // Validate each category
      for (const cat of categorization.categories) {
        if (!cat.category || !cat.subcategories || !Array.isArray(cat.subcategories)) {
          throw new Error('Invalid category structure');
        }
        
        // Verify category exists in themes
        const themeCategory = themes.categories.find(t => t.name === cat.category);
        if (!themeCategory) {
          throw new Error(`Unknown category: ${cat.category}`);
        }
        
        // Verify subcategories exist
        for (const subcat of cat.subcategories) {
          if (!themeCategory.subcategories.includes(subcat)) {
            throw new Error(`Unknown subcategory: ${subcat} in category: ${cat.category}`);
          }
        }
      }
      
      return categorization;
      
    } catch (parseError) {
      console.error(`JSON parsing error for APPG "${appg.name}":`, parseError.message);
      console.error('Raw response:', content);
      throw parseError;
    }
    
  } catch (error) {
    console.error(`Error categorizing APPG "${appg.name}" (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RATE_LIMIT_DELAY * 2}ms...`);
      await delay(RATE_LIMIT_DELAY * 2);
      return categorizeAPPG(appg, themes, retryCount + 1);
    }
    
    // If all retries failed, return a default categorization
    console.error(`Failed to categorize APPG "${appg.name}" after ${MAX_RETRIES} attempts. Using default categorization.`);
    return {
      categories: [
        {
          category: "Parliament and elections",
          subcategories: ["Parliament"]
        }
      ]
    };
  }
}

// Function to categorize all APPGs in a single file
async function categorizeFile(filename, themes) {
  const filePath = path.join(RAW_DIR, filename);
  console.log(`\n📁 Processing ${filename}...`);
  
  try {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    let processedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < data.appg_groups.length; i++) {
      const appg = data.appg_groups[i];
      
      // Skip if already categorized
      if (appg.categorization) {
        skippedCount++;
        continue;
      }
      
      console.log(`  📋 Categorizing ${i + 1}/${data.appg_groups.length}: "${appg.name}"`);
      
      try {
        appg.categorization = await categorizeAPPG(appg, themes);
        processedCount++;
        
        // Log the categorization
        const categories = appg.categorization.categories
          .map(c => `${c.category} > ${c.subcategories.join(', ')}`)
          .join(' | ');
        console.log(`    ✅ ${categories}`);
        
      } catch (error) {
        console.error(`    ❌ Failed to categorize: ${error.message}`);
      }
      
      // Rate limiting delay
      await delay(RATE_LIMIT_DELAY);
    }
    
    // Save the updated file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Completed ${filename}: ${processedCount} categorized, ${skippedCount} skipped`);
    
    return { processed: processedCount, skipped: skippedCount };
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return { processed: 0, skipped: 0 };
  }
}

// Main function to categorize all APPGs
export async function categorizeAllAPPGs() {
  console.log('🚀 Starting APPG categorization process...');
  
  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    console.log('Please set it with: export OPENAI_API_KEY="your-api-key-here"');
    process.exit(1);
  }
  
  try {
    // Load themes
    const themes = JSON.parse(await fs.readFile(THEMES_FILE, 'utf8'));
    console.log(`📚 Loaded ${themes.categories.length} theme categories`);
    
    // Get all APPG data files
    const files = await fs.readdir(RAW_DIR);
    const jsonFiles = files
      .filter(f => f.endsWith('_appg_data.json'))
      .sort();
    
    console.log(`📄 Found ${jsonFiles.length} APPG data files`);
    
    let totalProcessed = 0;
    let totalSkipped = 0;
    
    // Process each file
    for (const file of jsonFiles) {
      const result = await categorizeFile(file, themes);
      totalProcessed += result.processed;
      totalSkipped += result.skipped;
    }
    
    console.log(`\n🎉 Categorization complete!`);
    console.log(`   📊 Total APPGs categorized: ${totalProcessed}`);
    console.log(`   ⏭️  Total APPGs skipped (already categorized): ${totalSkipped}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Run the build script to update aggregated data`);
    console.log(`   2. Create theme-based pages and components`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Function to show categorization statistics
export async function showCategorizationStats() {
  const files = await fs.readdir(RAW_DIR);
  const jsonFiles = files.filter(f => f.endsWith('_appg_data.json'));
  
  const stats = new Map();
  let totalAPPGs = 0;
  let categorizedAPPGs = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(RAW_DIR, file);
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    for (const appg of data.appg_groups) {
      totalAPPGs++;
      
      if (appg.categorization) {
        categorizedAPPGs++;
        
        for (const cat of appg.categorization.categories) {
          for (const subcat of cat.subcategories) {
            const key = `${cat.category} > ${subcat}`;
            stats.set(key, (stats.get(key) || 0) + 1);
          }
        }
      }
    }
  }
  
  console.log(`\n📊 Categorization Statistics`);
  console.log(`   Total APPGs: ${totalAPPGs}`);
  console.log(`   Categorized: ${categorizedAPPGs} (${Math.round(categorizedAPPGs/totalAPPGs*100)}%)`);
  console.log(`   Uncategorized: ${totalAPPGs - categorizedAPPGs}`);
  
  console.log(`\n🏷️  Category Distribution:`);
  const sortedStats = Array.from(stats.entries())
    .sort((a, b) => b[1] - a[1]);
  
  for (const [category, count] of sortedStats) {
    console.log(`   ${category}: ${count} APPGs`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'stats') {
    showCategorizationStats().catch(console.error);
  } else {
    categorizeAllAPPGs().catch(console.error);
  }
}