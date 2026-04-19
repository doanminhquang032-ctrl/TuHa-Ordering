const SHEET_ID = "DÁN_ID_SHEET";

function doGet(e) {
  const type = e.parameter.type;

  if (type === "menu") {
    const s = SpreadsheetApp.openById(SHEET_ID).getSheetByName("menu");
    return ContentService.createTextOutput(JSON.stringify(s.getDataRange().getValues().slice(1)));
  }

  if (type === "orders") {
    const s = SpreadsheetApp.openById(SHEET_ID).getSheetByName("orders");
    return ContentService.createTextOutput(JSON.stringify(s.getDataRange().getValues().slice(1)));
  }
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  const ss = SpreadsheetApp.openById(SHEET_ID);

  // ===== ORDER =====
  if (body.type === "order") {
    const s = ss.getSheetByName("orders");
    s.appendRow([
      Date.now(),
      new Date(),
      JSON.stringify(body.cart),
      body.total,
      "new"
    ]);
  }

  // ===== ADD MENU =====
  if (body.type === "menu_add") {
    const s = ss.getSheetByName("menu");
    s.appendRow([Date.now(), body.name, body.price, body.img]);
  }

  // ===== UPDATE MENU =====
  if (body.type === "menu_update") {
    const s = ss.getSheetByName("menu");
    const data = s.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == body.id) {
        s.getRange(i+1,2).setValue(body.name);
        s.getRange(i+1,3).setValue(body.price);
        s.getRange(i+1,4).setValue(body.img);
      }
    }
  }

  return ContentService.createTextOutput("ok");
}
