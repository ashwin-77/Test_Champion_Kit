import ExcelJS from "exceljs";
import { SOURCES, type Inputs } from "@/lib/model";

const USD = '"$"#,##0';
const PCT = "0.0%";
const HEADER_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1614" } };
const HEADER_FONT: Partial<ExcelJS.Font> = { color: { argb: "FFF4ECE1" }, bold: true };
const SECTION_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4ECE1" } };
const HIGHLIGHT_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFCE7DD" } };

function sectionRow(sheet: ExcelJS.Worksheet, title: string) {
  const row = sheet.addRow([title]);
  row.font = { bold: true, color: { argb: "FFF15735" } };
  row.eachCell((cell) => (cell.fill = SECTION_FILL));
  sheet.mergeCells(row.number, 1, row.number, 2);
  return row;
}

function inputRow(sheet: ExcelJS.Worksheet, label: string, value: number, numFmt?: string) {
  const row = sheet.addRow([label, value]);
  if (numFmt) row.getCell(2).numFmt = numFmt;
  row.getCell(2).font = { bold: true };
  return row;
}

function formulaRow(sheet: ExcelJS.Worksheet, label: string, formula: string, numFmt: string, highlight = false) {
  const row = sheet.addRow([label, { formula }]);
  row.getCell(2).numFmt = numFmt;
  row.getCell(2).font = { bold: true, color: highlight ? { argb: "FFF15735" } : undefined };
  if (highlight) row.eachCell((cell) => (cell.fill = HIGHLIGHT_FILL));
  return row;
}

export async function buildRoiWorkbook(inputs: Inputs, companyName: string) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Theo Ai";
  wb.created = new Date();

  const sheet = wb.addWorksheet("ROI Model", { properties: { defaultColWidth: 20 } });
  sheet.columns = [{ width: 48 }, { width: 20 }];

  const title = sheet.addRow(["Theo Ai — ROI Model"]);
  title.font = { bold: true, size: 14, color: { argb: "FFF4ECE1" } };
  title.eachCell((cell) => (cell.fill = HEADER_FILL));
  sheet.mergeCells(title.number, 1, title.number, 2);

  const company = sheet.addRow([`Prepared for: ${companyName || "[Company name]"}`]);
  company.font = HEADER_FONT;
  company.eachCell((cell) => (cell.fill = HEADER_FILL));
  sheet.mergeCells(company.number, 1, company.number, 2);

  sheet.addRow([]);

  sectionRow(sheet, "Your portfolio");
  const matters = inputRow(sheet, "Active defense matters / year", inputs.matters);
  const costPerMatter = inputRow(sheet, "Avg outside counsel cost / matter", inputs.costPerMatter, USD);
  const blendedRate = inputRow(sheet, "Blended outside counsel rate ($/hr)", inputs.blendedRate, USD);
  const attorneys = inputRow(sheet, "In-house litigation attorneys", inputs.attorneys);
  const loadedCost = inputRow(sheet, "Fully loaded cost / attorney", inputs.loadedCost, USD);
  const settlementsPaid = inputRow(sheet, "Total settlements paid / year", inputs.settlementsPaid, USD);
  sheet.addRow([]);

  sectionRow(sheet, "Theo Ai investment");
  const license = inputRow(sheet, "Annual platform license", inputs.license, USD);
  const perCase = inputRow(sheet, "Per-case analysis fee", inputs.perCase, USD);
  sheet.addRow([]);

  sectionRow(sheet, "Value assumptions");
  const earlierPct = inputRow(sheet, "Matters resolving one phase earlier", inputs.earlierPct, PCT);
  const costAvoidPct = inputRow(sheet, "Cost avoided when settling earlier", inputs.costAvoidPct, PCT);
  const hoursSaved = inputRow(sheet, "Billed hours replaced / matter / year", inputs.hoursSaved);
  const capacityGain = inputRow(sheet, "Capacity gain per attorney", inputs.capacityGain, PCT);
  const calibrationPct = inputRow(sheet, "Improvement on settlements paid", inputs.calibrationPct, PCT);
  sheet.addRow([]);

  sectionRow(sheet, "Results (live formulas — edit any input above)");
  const R = (row: ExcelJS.Row) => `B${row.number}`;
  formulaRow(sheet, "Implied annual outside counsel spend", `${R(matters)}*${R(costPerMatter)}`, USD);
  const totalCost = formulaRow(sheet, "Total annual cost", `${R(license)}+(${R(perCase)}*${R(matters)})`, USD);
  const earlierSettlement = formulaRow(
    sheet,
    "Earlier settlement value",
    `${R(matters)}*${R(earlierPct)}*${R(costPerMatter)}*${R(costAvoidPct)}`,
    USD
  );
  const hoursReplaced = formulaRow(sheet, "Hours replaced value", `${R(hoursSaved)}*${R(blendedRate)}*${R(matters)}`, USD);
  const capacityValue = formulaRow(sheet, "Capacity value", `${R(attorneys)}*${R(loadedCost)}*${R(capacityGain)}`, USD);
  const calibration = formulaRow(sheet, "Calibration value", `${R(settlementsPaid)}*${R(calibrationPct)}`, USD);
  const totalValue = formulaRow(
    sheet,
    "Total annual value",
    `${R(earlierSettlement)}+${R(hoursReplaced)}+${R(capacityValue)}+${R(calibration)}`,
    USD
  );
  formulaRow(sheet, "Net annual benefit", `${R(totalValue)}-${R(totalCost)}`, USD, true);
  formulaRow(sheet, "ROI (multiple)", `${R(totalValue)}/${R(totalCost)}`, '0.0"x"', true);
  formulaRow(sheet, "Payback (months)", `(${R(totalCost)}/${R(totalValue)})*12`, '0.0" months"', true);

  const sources = wb.addWorksheet("Benchmark sources");
  sources.columns = [{ width: 55 }, { width: 45 }, { width: 55 }];
  const srcHeader = sources.addRow(["Claim", "Source", "URL"]);
  srcHeader.font = HEADER_FONT;
  srcHeader.eachCell((cell) => (cell.fill = HEADER_FILL));
  SOURCES.forEach((s) => sources.addRow([s.claim, s.source, s.url]));

  return wb;
}

export async function downloadRoiWorkbook(inputs: Inputs, companyName: string) {
  const wb = await buildRoiWorkbook(inputs, companyName);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `theo-ai-roi-model${companyName ? `-${companyName.replace(/[^a-z0-9]+/gi, "-")}` : ""}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
