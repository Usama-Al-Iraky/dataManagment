let products = JSON.parse(localStorage.getItem("products")) || [];

const nameInput = document.getElementById("name");
const tbody = document.getElementById("tbody");
const tbodyTwo = document.getElementById("tbodyTwo");
const compelete = document.getElementById("compelete");
const invoiceTotalPrice = document.getElementById("invoiceTotalPrice");
const invoiceDiscount = document.getElementById("invoiceDiscount");
const customerName = document.getElementById("customerName");
// search in productes with product name
let filteredProducts = [];
const findProduct = () => {
  let filterProducts = [];
  products.filter((item) => {
    if (item.name.toLowerCase().startsWith(nameInput.value.toLowerCase())) {
      if (nameInput.value === "") {
        filterProducts = [];
      } else {
        filterProducts.push(item);
      }
      filteredProducts = [...new Set(filterProducts)];
    }
  });
  renderProducts();
};
const renderProducts = () => {
  tbody.innerHTML = filteredProducts
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
};
// to select the product and add to the invoice
let selectedProducts = [];
let inovoiceTotalPriceShow = 0;
let totalPriceBeforDiscount = 0;
const selectProduct = (id) => {
  let selectedProduct = products.find((item) => item.id === id);
  let index = selectedProducts.findIndex((i) => i.id === id);

  if (index !== -1) {
    selectedProducts[index].count += 1;
  } else {
    selectedProducts.push({ ...selectedProduct, count: 1 });
  }
  renderSelectedProducts();
  GetInvoiceTotalPrice();
};
const renderSelectedProducts = () => {
  tbodyTwo.innerHTML = selectedProducts
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
        <td>
          <div class="btns" >
            <button class="btn" onClick='decreaseProduct(${m.id})'>-</button>
            <button class="btn" onClick='increaseProduct(${m.id})'>+</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
};
// Manage Selected Product

const increaseProduct = (id) => {
  const selectedIndex = selectedProducts.findIndex((index) => index.id === id);
  if (selectedIndex !== -1) {
    selectedProducts[selectedIndex] = {
      ...selectedProducts[selectedIndex],
      count: selectedProducts[selectedIndex].count + 1,
    };
  }
  renderSelectedProducts();
  GetInvoiceTotalPrice();
};
const decreaseProduct = (id) => {
  const selectedIndex = selectedProducts.findIndex((index) => index.id === id);
  if (selectedIndex !== -1) {
    if (selectedProducts[selectedIndex].count > 1) {
      selectedProducts[selectedIndex] = {
        ...selectedProducts[selectedIndex],
        count: selectedProducts[selectedIndex].count - 1,
      };
    } else {
      selectedProducts.splice(selectedIndex, 1);
    }
  }
  renderSelectedProducts();
  GetInvoiceTotalPrice();
};
// to render total price in the invoice
let invoiceTotalDiscount = 0;
const getInvoiceTotalDiscount = () => {
  invoiceTotalDiscount = +invoiceDiscount.value;
  GetInvoiceTotalPrice();
};
const GetInvoiceTotalPrice = () => {
  totalPriceBeforDiscount = selectedProducts.reduce((a, p) => {
    return a + +p.totalPrice * +p.count;
  }, 0);
  inovoiceTotalPriceShow = +totalPriceBeforDiscount - +invoiceTotalDiscount;
  invoiceTotalPrice.innerHTML = +inovoiceTotalPriceShow;
};
// ////////////////////////////////
let invoice;
if (localStorage.invoices != null) {
  invoice = JSON.parse(localStorage.invoices);
} else {
  invoice = [];
}
// to confirm the invoice
let date = Date.now();
let number = Math.floor(Math.random() * 1000);
let uniqueId = date - number;
const confirmInvoice = () => {
  if (!customerName.value.trim()) {
    alert("Please enter the customer name.");
    return;
  }
  const currentInvoice = {
    id: uniqueId,
    invoice: selectedProducts,
    priceBeforDiscout: totalPriceBeforDiscount,
    discount: invoiceTotalDiscount,
    FinalInvoicePrice: inovoiceTotalPriceShow,
    date: Date.apply(),
    name: customerName.value,
  };
  selectedProducts.forEach((produ) => {
    const prodIdex = products.findIndex((pro) => pro.id === produ.id);
    if (prodIdex !== -1) {
      products[prodIdex].count -= produ.count;
      if (products[prodIdex].count <= 0) {
        products.splice(prodIdex, 1);
      }
    }
  });
  invoice.push(currentInvoice);
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("invoices", JSON.stringify(invoice));
  selectedProducts = [];
  renderSelectedProducts();
  GetInvoiceTotalPrice();
  renderProducts();
  nameInput.value = "";
  customerName.value = "";
  invoiceDiscount.value = "";
  invoiceTotalPrice.innerHTML = 0;
};
compelete.addEventListener("click", confirmInvoice);
