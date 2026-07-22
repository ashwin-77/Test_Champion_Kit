import ExcelJS from "exceljs";
import type { Inputs } from "@/lib/model";

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

function inputRow(sheet: ExcelJS.Worksheet, label: string, value: number | string, numFmt?: string) {
  const row = sheet.addRow([label, value]);
  if (numFmt) row.getCell(2).numFmt = numFmt;
  row.getCell(2).font = { bold: true, color: { argb: "FF0000FF" } };
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

  const sheet = wb.addWorksheet("Value Model", { properties: { defaultColWidth: 20 } });
  sheet.columns = [{ width: 48 }, { width: 20 }];

  const title = sheet.addRow(["Theo Ai Value Model"]);
  title.font = { bold: true, size: 14, color: { argb: "FFF4ECE1" } };
  title.eachCell((cell) => (cell.fill = HEADER_FILL));
  sheet.mergeCells(title.number, 1, title.number, 2);

  const company = sheet.addRow([`Prepared for: ${companyName || "[Company name]"}`]);
  company.font = HEADER_FONT;
  company.eachCell((cell) => (cell.fill = HEADER_FILL));
  sheet.mergeCells(company.number, 1, company.number, 2);

  const note = sheet.addRow(["Blue cells are adjustable; all results recalculate automatically."]);
  note.font = { italic: true, color: { argb: "FF6B7280" } };
  sheet.mergeCells(note.number, 1, note.number, 2);
  sheet.addRow([]);

  sectionRow(sheet, "1 · Your litigation portfolio");
  const matters = inputRow(sheet, "Active defense matters / year", inputs.matters);
  const attorneys = inputRow(sheet, "In-house litigation attorneys", inputs.attorneys);
  const settlementsPaid = inputRow(sheet, "Total settlements paid / year", inputs.settlementsPaid, USD);
  sheet.addRow([]);

  sectionRow(sheet, "2 · Benchmark assumptions (adjustable)");
  const costPerMatter = inputRow(sheet, "Avg outside counsel cost / matter", inputs.costPerMatter, USD);
  const loadedCostAttorney = inputRow(sheet, "Fully loaded cost / attorney", inputs.loadedCostAttorney, USD);
  const paralegalCost = inputRow(sheet, "Fully loaded cost / paralegal", inputs.paralegalCost, USD);
  const earlierPct = inputRow(sheet, "Matters resolving one phase earlier", inputs.earlierPct, PCT);
  const costAvoidPct = inputRow(sheet, "Cost avoided when settling earlier", inputs.costAvoidPct, PCT);
  const hoursSaved = inputRow(sheet, "Billed hours replaced / matter / year", inputs.hoursSaved);
  const hourlyRate = inputRow(sheet, "Blended outside counsel rate ($/hr)", inputs.hourlyRate, USD);
  const pctTimeTracking = inputRow(sheet, "Team time on case tracking & assessment", inputs.pctTimeTracking, PCT);
  const pctAbsorbed = inputRow(sheet, "Share of that work Theo Ai absorbs", inputs.pctAbsorbed, PCT);
  const calibrationPct = inputRow(sheet, "Improvement on settlements paid", inputs.calibrationPct, PCT);
  const includeCalibration = inputRow(sheet, "Include settlement calibration in results? (Yes/No)", inputs.includeCalibration ? "Yes" : "No");
  sheet.addRow([]);

  sectionRow(sheet, "3 · Value (live formulas, edit any input above)");
  const R = (row: ExcelJS.Row) => `B${row.number}`;
  const impliedSpend = formulaRow(sheet, "Implied annual outside counsel spend", `${R(matters)}*${R(costPerMatter)}`, USD);
  const fasterSettlement = formulaRow(
    sheet,
    "Faster settlement value",
    `${R(impliedSpend)}*${R(earlierPct)}*${R(costAvoidPct)}`,
    USD
  );
  const mattersExcludingA = formulaRow(sheet, "Matters counted (excludes matters in faster settlement)", `${R(matters)}*(1-${R(earlierPct)})`, "0.0");
  const outsideCounselEfficiency = formulaRow(
    sheet,
    "Outside counsel efficiency value",
    `${R(hoursSaved)}*${R(hourlyRate)}*${R(mattersExcludingA)}`,
    USD
  );
  const inHouseCapacity = formulaRow(
    sheet,
    "In-house capacity value",
    `${R(attorneys)}*${R(loadedCostAttorney)}*${R(pctTimeTracking)}*${R(pctAbsorbed)}`,
    USD
  );
  formulaRow(sheet, "Equivalent paralegal headcount avoided", `IF(${R(paralegalCost)}>0,${R(inHouseCapacity)}/${R(paralegalCost)},0)`, "0.0");
  const calibrationPotential = formulaRow(sheet, "Settlement calibration value (potential)", `${R(settlementsPaid)}*${R(calibrationPct)}`, USD);
  const calibrationCounted = formulaRow(
    sheet,
    "Settlement calibration value (counted)",
    `IF(${R(includeCalibration)}="Yes",${R(calibrationPotential)},0)`,
    USD
  );
  formulaRow(
    sheet,
    "Total annual value unlocked",
    `${R(fasterSettlement)}+${R(outsideCounselEfficiency)}+${R(inHouseCapacity)}+${R(calibrationCounted)}`,
    USD,
    true
  );

  return wb;
}

export async function downloadRoiWorkbook(inputs: Inputs, companyName: string) {
  const wb = await buildRoiWorkbook(inputs, companyName);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `theo-ai-value-model${companyName ? `-${companyName.replace(/[^a-z0-9]+/gi, "-")}` : ""}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
