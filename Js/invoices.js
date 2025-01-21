const invoices = JSON.parse(localStorage.getItem("invoices"));
const tbody = document.getElementById("tbody");
const tfoot = document.getElementById("tfoot");
const invoicesBody = document.getElementById("invoicesBody");
tbody.innerHTML = invoices
  .map(
    (inv) =>
      `
    <tr>
     <td style='cursor: pointer;' onClick='showInvoice(${inv.id})' >${
        inv.name
      }</td>
     <td>${inv.date.slice(0, 25)}</td>      
    </tr>
    `
  )
  .join("");

const showInvoice = (id) => {
  let invo = invoices.find((inn) => inn.id === id);
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
  console.log(invo);
  tfoot.innerHTML = `<tr>
        <td>${invo.name}</td>
        <td>${invo.date.slice(0, 25)}</td>
        <td>${invo.priceBeforDiscout}</td>
        <td>${invo.discount}</td>
        <td>${invo.finalInvoicePrice}</td>
      </tr>`;
};
console.log(invoices);
