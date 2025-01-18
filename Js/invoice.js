let nameInput = document.getElementById("name");
let tbody = document.getElementById("tbody");
let tbodyTwo = document.getElementById("tbodyTwo");
let compelete = document.getElementById("compelete");
let products = JSON.parse(localStorage.getItem("products"));

// search in productes with product name
const findProduct = () => {
  let newProducts = [];
  products.find((item) => {
    if (item.name.toLowerCase().startsWith(nameInput.value.toLowerCase())) {
      if (nameInput.value !== "") {
        newProducts = [...newProducts, item];
      } else {
        newProducts = [];
      }
      let filterdeProducts = [...new Set(newProducts)];

      tbody.innerHTML = filterdeProducts
        .map(
          (i, index) => `<tr>
<td>${index + 1}</td>
<td>${i.name}</td>
<td>${i.title}</td>
<td>${i.category}</td>
<td>${i.price}</td>
<td>${i.taxes}</td>
<td>${i.ads}</td>
<td>${i.discount}</td>
<td>${i.totalPrice}</td>
<td>${i.count}</td>
<td><button class="btn" onClick='selectProduct(${i.id})'>Select</button></td>
</tr>`
        )
        .join("");
    }
  });
};
// to select the product and add to the invoice
let selectedProducts = [];
let uniqueSelectedProducts = [];
const selectProduct = (id) => {
  let selectedProduct = products.find((item) => item.id === id);
  let index = selectedProducts.findIndex((i) => i.id === id);

  if (index !== -1) {
    selectedProducts[index].count += 1;
  } else {
    selectedProducts.push({ ...selectedProduct, count: 1 });
  }
  uniqueSelectedProducts = [...new Set(selectedProducts.map((p) => p.id))].map(
    (id) => selectedProducts.find((p) => p.id === id)
  );
  tbodyTwo.innerHTML = uniqueSelectedProducts
    .map(
      (m, index) => `<tr>
        <td>${index + 1}</td>
        <td>${m.name}</td>
        <td>${m.title}</td>
        <td>${m.category}</td>
        <td>${m.price}</td>
        <td>${m.taxes}</td>
        <td>${m.ads}</td>
        <td>${m.discount}</td>
        <td>${m.totalPrice}</td>
        <td>${m.count}</td>
      </tr>`
    )
    .join("");
  GetInvoiceTotalPrice();
};
// ////////////////////////////////

// ////////////////////////////////
let invoice;
if (localStorage.invoices != null) {
  invoice = JSON.parse(localStorage.invoices);
} else {
  invoice = [];
}
// to confirm the invoice
compelete.addEventListener("click", () => {
  uniqueSelectedProducts.map((produ) => {
    let prodIdex = products.findIndex((pro) => pro.id === produ.id);
    if (prodIdex !== -1) {
      products[prodIdex].count -= produ.count;
      if (products[prodIdex].count <= 0) {
        products.splice(prodIdex, 1);
      }
      localStorage.setItem("products", JSON.stringify(products));
    }
    invoice = [...invoice, [[...new Set(selectedProducts)], Date.apply()]];
    localStorage.setItem("invoices", JSON.stringify(invoice));
    window.location.reload();
    // to tell stor page that the invoice confirmed
    localStorage.setItem("invoiceUpdated", "true");
  });
});

// to render total price in the invoice
const GetInvoiceTotalPrice = () => {
  let invoiceTotalPrice = document.getElementById("invoiceTotalPrice");
  let t = selectedProducts.reduce((a, p) => {
    return a + p.totalPrice * p.count;
  }, 0);
  invoiceTotalPrice.innerHTML = +t;
};
