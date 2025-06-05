let intensityData = [];
let linksData = [];
let currentPage = { intensity: 0, links: 0 };
const pageSize = 10;

function fetchData() {
  fetch("as2co2_intensity_may_2025.json")
    .then((res) => res.json())
    .then((data) => {
      intensityData = Object.entries(data)
        .map(([as, val]) => ({ AS: as, CO2: val }))
        .sort((a, b) => a.CO2 - b.CO2);
      renderTable("intensity");
    });

  fetch("as_link_emissions_may_2025.csv")
    .then((res) => res.text())
    .then((text) => {
      const rows = text.trim().split("\n").slice(1);
      linksData = rows
        .map((line) => {
          const [AS1, AS2, , , Total_CO2] = line.split(",");
          return { AS1, AS2, Total_CO2: parseFloat(Total_CO2) };
        })
        .sort((a, b) => a.Total_CO2 - b.Total_CO2);
      renderTable("links");
    });
}

function renderTable(type) {
  const table = document.getElementById(
    type === "intensity" ? "as-intensity-table" : "link-emissions-table"
  );
  table.innerHTML = "";

  const data = type === "intensity" ? intensityData : linksData;
  const page = currentPage[type];
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);

  // Header
  const header = document.createElement("tr");
  if (type === "intensity") {
    header.innerHTML = "<th>AS</th><th>CO₂ Intensity</th>";
  } else {
    header.innerHTML = "<th>AS1</th><th>AS2</th><th>Total CO₂</th>";
  }
  table.appendChild(header);

  // Rows
  pageData.forEach((row) => {
    const tr = document.createElement("tr");
    if (type === "intensity") {
      tr.innerHTML = `<td>${row.AS}</td><td>${row.CO2}</td>`;
    } else {
      tr.innerHTML = 
`<td>${row.AS1}</td><td>${row.AS2}</td><td>${row.Total_CO2}</td>`;
    }
    table.appendChild(tr);
  });
}

function nextPage(type) {
  const data = type === "intensity" ? intensityData : linksData;
  if ((currentPage[type] + 1) * pageSize < data.length) {
    currentPage[type]++;
    renderTable(type);
  }
}

function prevPage(type) {
  if (currentPage[type] > 0) {
    currentPage[type]--;
    renderTable(type);
  }
}

window.onload = fetchData;

