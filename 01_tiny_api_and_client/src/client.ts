document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api");
    const json = await res.json();
    document.body.innerHTML = `<h1>${json.message}</h1>`;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.body.innerHTML = `<h1>Error loading data</h1>`;
  }
});
