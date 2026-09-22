const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');

const filePath = path.join(__dirname, '../../apps/business/public/templates/default-rental-contract.docx');
const content = fs.readFileSync(filePath);

try {
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const data = {
    company: { name: "Test" },
    contract: { number: "123" },
    customer: { name: "Cust" },
    vehicles: [{ no: 1 }]
  };

  doc.render(data);
  console.log('Successfully rendered docx!');
} catch (error) {
  console.error('Error rendering:', error);
  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors.map((e) => {
      return e.properties.explanation;
    }).join("\n");
    console.log('errorMessages', errorMessages);
  }
}
