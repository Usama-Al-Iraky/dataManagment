const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
const purchaseInvoices =
  JSON.parse(localStorage.getItem("purchaseInvoices")) || [];
const tbody = document.getElementById("tbody");
const tfoot = document.getElementById("tfoot");
const invoicesBody = document.getElementById("invoicesBody");
const invoiceBtn = document.getElementById("invoiceBtn");
const purchaseInvoicesBtn = document.getElementById("purchaseInvoicesBtn");
// const test = () => {
//   let newTest = purchaseInvoices[4];
//   newTest = { ...newTest, id: 20 };
//   purchaseInvoices[4] = newTest;
//   localStorage.setItem("purchaseInvoices", JSON.stringify(purchaseInvoices));
// };
// test();

const renderAllInvoices = (theInvoices) => {
  tbody.innerHTML = theInvoices
    .map(
      (inv) => `
    <tr>
     <td style='cursor: pointer;' onClick='showInvoice(${
       inv.id
     }, ${JSON.stringify(theInvoices)})' >${inv.name}</td>
     <td>${inv.date.slice(0, 25)}</td>      
    </tr>
    `
    )
    .join("");
};
const showInvoice = (id, theInvoices) => {
  let invo = theInvoices.find((inn) => inn.id === id);
  invoicesBody.innerHTML = invo.invoice
    .map(
      (item, index) => `<tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td>${item.price}</td>
        <td>${item.taxes}</td>
        <td>${item.ads}</td>
        <td>${item.discount}</td>
        <td>${item.totalPrice}</td>
        <td>${item.count}</td>
      </tr>`
    )
    .join("");
  tfoot.innerHTML = `<tr>
        <td>${invo.name}</td>
        <td>${invo.date.slice(0, 25)}</td>
        <td>${invo.priceBeforDiscout}</td>
        <td>${invo.discount}</td>
        <td>${invo.finalInvoicePrice}</td>
      </tr>`;
};

purchaseInvoicesBtn.addEventListener("click", () => {
  renderAllInvoices(purchaseInvoices);
  invoicesBody.innerHTML = "";
  tfoot.innerHTML = "";
});
invoiceBtn.addEventListener("click", () => {
  renderAllInvoices(invoices);
  invoicesBody.innerHTML = "";
  tfoot.innerHTML = "";
});
