function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** UTF-8 BOM so Excel opens Hindi/Unicode correctly on Windows. */
export function downloadEnquiriesCsv(rows, filename = "enquiries.csv") {
  if (!rows.length) return false;

  const responseKeys = new Set();
  rows.forEach((row) => {
    if (row.formResponses && typeof row.formResponses === "object") {
      Object.keys(row.formResponses).forEach((k) => responseKeys.add(k));
    }
  });
  const extraCols = [...responseKeys].sort();

  const headers = [
    "id",
    "createdAt",
    "name",
    "phone",
    "message",
    "eventId",
    "eventTitle",
    "serviceId",
    "serviceTitle",
    "jobId",
    "jobTitle",
    "resumeName",
    "formType",
    "sourcePage",
    "sourcePath",
    ...extraCols,
  ];

  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    const line = headers.map((h) => {
      if (extraCols.includes(h)) return csvEscape(row.formResponses?.[h]);
      return csvEscape(row[h]);
    });
    lines.push(line.join(","));
  }

  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

export function filterEnquiries(rows, { eventFilter, periodMode, month, dateFrom, dateTo }) {
  return rows.filter((row) => {
    if (eventFilter === "__events__") {
      if (!row.eventId) return false;
    } else if (eventFilter === "__contact__") {
      if (row.eventId || row.jobId || row.jobTitle) return false;
    } else if (eventFilter === "__jobs__") {
      if (!row.jobId && !row.jobTitle) return false;
    } else if (eventFilter) {
      if (row.eventId !== eventFilter) return false;
    }

    if (!row.createdAt) return true;
    const d = new Date(row.createdAt);
    if (Number.isNaN(d.getTime())) return true;

    if (periodMode === "month" && month) {
      const [y, m] = month.split("-").map(Number);
      if (d.getFullYear() !== y || d.getMonth() + 1 !== m) return false;
    }

    if (periodMode === "range") {
      if (dateFrom) {
        const from = new Date(`${dateFrom}T00:00:00`);
        if (d < from) return false;
      }
      if (dateTo) {
        const to = new Date(`${dateTo}T23:59:59.999`);
        if (d > to) return false;
      }
    }

    return true;
  });
}
