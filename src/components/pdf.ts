import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Participant = {
  id: number | string;
  playerName: string;
  club?: string;
  clubName?: string;
  district?: string;
  districtName?: string;
  H1_score?: number | null;
  H2_score?: number | null;
  H3_score?: number | null;
  H4_score?: number | null;
  final_result?: string | null;
};

type ScheduleLike = {
  raceName: string;
  ageGroupName: string;
  skateCategory?: string;
  participants: Participant[];
};

function fmtScore(n: number | null | undefined) {
  return typeof n === "number" && !Number.isNaN(n) ? n.toFixed(2) : "";
}

const getClub = (p: any) => p.player?.clubName ?? p.player?.clubName ?? "";
const getDistrict = (p: any) => p.player?.districtName ?? p.player?.districtName ?? "";

export function generateResultsSheetPDF(
  schedule: ScheduleLike,
  opts: { includeScores?: boolean; landscape?: boolean } = {}
) {
  const includeScores = opts.includeScores ?? false;
  const landscape = opts.landscape ?? true;

  const doc = new jsPDF(landscape ? "landscape" : "portrait", "pt", "a4");

  const marginX = 40;
  let cursorY = 40;

  doc.setFontSize(18);
  doc.text(`Schedule`, marginX, cursorY);
  cursorY += 20;

  doc.setFontSize(12);
  const cat = schedule.skateCategory
    ? schedule.skateCategory.charAt(0).toUpperCase() + schedule.skateCategory.slice(1)
    : "-";
  doc.text(`Race Name: ${schedule.raceName}`, marginX, cursorY);
  doc.text(`Age Group: ${schedule.ageGroupName}`, marginX + 220, cursorY);
  doc.text(`Category: ${cat}`, marginX + 420, cursorY);
  cursorY += 20;

  if (!includeScores) {
    doc.setFontSize(10);
    doc.text(
      "",
      marginX,
      cursorY
    );
    cursorY += 16;
  }

  const rows = schedule.participants.map((p) => [
    p.playerName ?? "",
    getClub(p),
    getDistrict(p),
    includeScores ? fmtScore(p.H1_score) : "",
    includeScores ? fmtScore(p.H2_score) : "",
    includeScores ? fmtScore(p.H3_score) : "",
    includeScores ? fmtScore(p.H4_score) : "",
    includeScores ? (p.final_result ?? "") : "",
  ]);

  autoTable(doc, {
    head: [["Player", "Club Name", "District", "H1", "H2", "H3", "H4", "Result"]],
    body: rows,
    startY: cursorY,
    theme: "grid",
    styles: {
      fontSize: 11,
      halign: "center",
      valign: "middle",
      cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      lineWidth: 0.5,
    },
    bodyStyles: {
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 160 },
      1: { halign: "left", cellWidth: 120 },
      2: { halign: "left", cellWidth: 100 },
      // rest auto
    },
  });

  const safeRace = schedule.raceName.replace(/\s+/g, "-").toLowerCase();
  const filename = includeScores
    ? `results-${safeRace}.pdf`
    : `blank-results-${safeRace}.pdf`;
  doc.save(filename);
}
