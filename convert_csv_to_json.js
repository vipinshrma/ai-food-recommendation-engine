import fs from 'fs';
import path from 'path';

const csvPath = '/Users/vipan/Downloads/cleaned_ingredients.csv';
const jsonPath = '/Users/vipan/Desktop/development-projects/food-recommendation-engine/food_data.json';

function parseCSVLine(line) {
    const result = [];
    let curValue = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                curValue += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(curValue.trim());
            curValue = '';
        } else {
            curValue += char;
        }
    }
    result.push(curValue.trim());
    return result;
}

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const headers = parseCSVLine(lines[0]);
    
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const entry = {};
        
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });

        if (!entry.Descrip || !entry.NDB_No) continue;
        
        results.push({
            id: entry.NDB_No,
            name: capitalizeWords(entry.Descrip.replace(/^"|"$/g, '').replace(/""/g, '"')),
            description: `${capitalizeWords(entry.Descrip.replace(/^"|"$/g, '').replace(/""/g, '"'))} contains ${entry.Energy_kcal || 0} kcal, ${entry.Protein_g || 0}g protein, and ${entry.Fat_g || 0}g fat per 100g.`,
            ingredients: entry.Descrip.toLowerCase().replace(/^"|"$/g, '').replace(/""/g, '"')
        });
    }
    
    return results;
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

try {
    console.log('Reading CSV with robust parser...');
    const jsonData = parseCSV(csvPath);
    
    console.log(`Parsed ${jsonData.length} items. Writing to ${jsonPath}...`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    
    console.log('Successfully updated food_data.json!');
} catch (error) {
    console.error('Error during conversion:', error.message);
}
