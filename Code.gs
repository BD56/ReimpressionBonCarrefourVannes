function doGet() {
  return HtmlService.createHtmlOutputFromFile("index.html")
    .setTitle("Réimpression Bon - Carrefour Vannes")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
