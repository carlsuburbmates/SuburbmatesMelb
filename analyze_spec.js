const fs = require('fs');

const spec = JSON.parse(fs.readFileSync('/tmp/openapi.json', 'utf8'));

// 1) CURRENT CANONICAL TABLES
const allTables = Object.keys(spec.definitions || {}).filter(k => 
  !k.endsWith('_response') && !k.endsWith('_request') && !k.endsWith('_patch')
);

// 2) KEY COLUMN CHECK
const checkTables = ['business_profiles', 'products', 'regions', 'categories', 'outbound_clicks', 'featured_slots', 'vendors'];
let colCheck = '';
checkTables.forEach(t => {
  if (spec.definitions[t]) {
    const props = Object.keys(spec.definitions[t].properties || {});
    colCheck += `- ${t}: ${props.join(', ')}\n`;
  }
});

fs.writeFileSync('/tmp/analysis.txt', `CURRENT CANONICAL TABLES
${allTables.map(t => '- ' + t).join('\n')}

KEY COLUMN CHECK
${colCheck}
`);
