import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import path from 'path';
import mammoth from 'mammoth';

async function main() {
  const filePath = path.join(process.cwd(), '../../apps/business/public/templates/default-rental-contract.docx');
  const content = fs.readFileSync(filePath);

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' }
  });

  const data = {
    "company.name": "TestCompany",
    "company.address": "TestAddress",
    "contract.number": "123",
    "contract.contractDate": "Today",
    "customer.name": "CustName",
    vehicles: [{ no: 1, brand: "Toyota", model: "Innova", plateNumber: "B 123", odometer: "10" }]
  };

  doc.render(data);
  const out = doc.getZip().generate({ type: 'nodebuffer' });
  
  const result = await mammoth.extractRawText({ buffer: out });
  console.log(result.value);
}

main().catch(console.error);
