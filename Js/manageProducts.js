// DOM Elements
const productName = document.getElementById("productName");
const title = document.getElementById("title");
const category = document.getElementById("category");
const count = document.getElementById("count");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const totalPrice = document.getElementById("totalPrice");
const addBtn = document.getElementById("add");
const searchInput = document.getElementById("searchInput");
const searchNameBtn = document.getElementById("searchName");
const searchCategoryBtn = document.getElementById("searchCategory");
const tbody = document.getElementById("tbody");
const deleteBtn = document.getElementById("delete");
const doneBtn = document.getElementById("done");
const clearBtn = document.getElementById("clear");
const resetBtn = document.getElementById("reset");
const tbodyTwo = document.getElementById("tbodyTwo");
const invoiceTotalPrice = document.getElementById("invoiceTotalPrice");
const invoiceDiscount = document.getElementById("invoiceDiscount");
const customerName = document.getElementById("customerName");
// Used Variables
let products =
  localStorage.products != null ? JSON.parse(localStorage.products) : [];
let purchaseInvoices =
  localStorage.purchaseInvoices != null
    ? JSON.parse(localStorage.purchaseInvoices)
    : [];
let uniqueId;
let newProducts = [];
let inovoiceTotalPriceShow = 0;
let invoiceTotalDiscount = 0;
let totalPriceBeforDiscount = 0;
// const test = () => {
//   let newTest = products[3];
//   newTest = { ...newTest, id: 4 };
//   products[3] = newTest;
//   localStorage.setItem("products", JSON.stringify(products));
// };
// test();
// =>
const creatUniqueId = () => {
  uniqueId = Date.now() - Math.floor(Math.random() * 1000);
};
const getTotalPrice = () => {
  if (price.value !== "" && taxes.value !== "" && ads.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    totalPrice.innerHTML = result;
  } else {
    totalPrice.innerHTML = 0;
  }
};
const getInvoiceTotalDiscount = () => {
  invoiceTotalDiscount = +invoiceDiscount.value;
  GetInvoiceTotalPrice();
};
const GetInvoiceTotalPrice = () => {
  totalPriceBeforDiscount = newProducts.reduce((a, p) => {
    return a + +p.totalPrice * +p.count;
  }, 0);
  inovoiceTotalPriceShow = +totalPriceBeforDiscount - +invoiceTotalDiscount;
  invoiceTotalPrice.innerHTML = +inovoiceTotalPriceShow;
};
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createDtat(e);
  clearInputsAfterAdd();
  rendernewProducts();
  GetInvoiceTotalPrice();
});
// Craete Product Function
const createDtat = (e) => {
  creatUniqueId();
  if (
    productName.value !== "" &&
    title.value !== "" &&
    category.value !== "" &&
    price.value !== ""
  ) {
    let newProduct = {
      id: uniqueId,
      name: productName.value,
      title: title.value,
      category: category.value,
      // استخدمت + لتحويل القيمة الخاصة بال input لرقم وكمان استعملت Number() علشان بتأدى نفس الوظيفة بس استعملتهم للتذكير ليس الا
      count: +count.value,
      price: +price.value,
      taxes: +taxes.value,
      ads: +ads.value,
      discount: +discount.value,
      totalPrice: +totalPrice.innerHTML,
    };
    newProducts = [...newProducts, newProduct];
  } else {
    e.preventDefault();
  }
};
// ///////////////////////////////////////////////////////////////////////
const rendernewProducts = () => {
  tbodyTwo.innerHTML = newProducts
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
const increaseProduct = (id) => {
  const selectedIndex = newProducts.findIndex((index) => index.id === id);
  if (selectedIndex !== -1) {
    newProducts[selectedIndex] = {
      ...newProducts[selectedIndex],
      count: newProducts[selectedIndex].count + 1,
    };
  }
  rendernewProducts();
  GetInvoiceTotalPrice();
};
const decreaseProduct = (id) => {
  const selectedIndex = newProducts.findIndex((index) => index.id === id);
  if (selectedIndex !== -1) {
    if (newProducts[selectedIndex].count > 1) {
      newProducts[selectedIndex] = {
        ...newProducts[selectedIndex],
        count: newProducts[selectedIndex].count - 1,
      };
    } else {
      newProducts.splice(selectedIndex, 1);
    }
  }
  rendernewProducts();
  GetInvoiceTotalPrice();
};

const findProduct = () => {
  products.filter((item) => {
    if (item.name.toLowerCase() === productName.value.toLowerCase()) {
      productName.value = item.name;
      title.value = item.title;
      category.value = item.category;
      price.value = item.price;
      taxes.value = item.taxes;
      ads.value = item.ads;
      discount.value = item.discount;
      getTotalPrice();
    }
    if (productName.value === "") {
      title.value = "";
      category.value = "";
      count.value = "";
      price.value = "";
      taxes.value = "";
      ads.value = "";
      discount.value = "";
      totalPrice.innerHTML = 0;
    }
  });
};
productName.addEventListener("keyup", findProduct);
const confirmInvoice = () => {
  creatUniqueId();
  if (!customerName.value.trim()) {
    alert("Please enter the customer name.");
    return;
  }
  const currentInvoice = {
    id: uniqueId,
    invoice: newProducts,
    priceBeforDiscout: totalPriceBeforDiscount,
    discount: invoiceTotalDiscount,
    finalInvoicePrice: inovoiceTotalPriceShow,
    date: Date.apply(),
    name: customerName.value,
  };
  newProducts.forEach((produ) => {
    const prodIdex = products.findIndex((pro) => pro.name === produ.name);
    if (prodIdex !== -1) {
      products[prodIdex].count += produ.count;
    } else {
      products.push(produ);
    }
    localStorage.setItem("products", JSON.stringify(products));
  });
  purchaseInvoices.push(currentInvoice);
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("purchaseInvoices", JSON.stringify(purchaseInvoices));
  newProducts = [];
  rendernewProducts();
  GetInvoiceTotalPrice();
  clearInputsAfterAdd();
};
compelete.addEventListener("click", confirmInvoice);

// whene user add the product this function clear all inputs to add a new
const clearInputsAfterAdd = () => {
  productName.value = "";
  title.value = "";
  category.value = "";
  count.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  totalPrice.innerHTML = 0;
  customerName.value = "";
  invoiceDiscount.value = "";
  invoiceTotalPrice.innerHTML = 0;
};
// to render the products to user to see it
const renderData = () =>
  (tbody.innerHTML = products
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
<td><button class="btn" onClick='updateProduct(${item.id})'>Update</button></td>
<td><button class="btn" onClick='deleteProduct(${item.id})'>Delete</button></td>
</tr>`
    )
    .join(""));
renderData();
// this function remove one from the product if it`s count more than 1 but if it less than 1 the function will remove it
const deleteProduct = (id) => {
  const index = products.findIndex((i) => i.id === id);
  let productsAfterDlete = [...products];
  let product = productsAfterDlete.find((item) => item.id === id);
  if (product.count > 1) {
    product = { ...product, count: product.count - 1 };
    productsAfterDlete[index] = product;
  } else {
    productsAfterDlete.splice(index, 1);
  }
  localStorage.setItem("products", JSON.stringify(productsAfterDlete));
  renderData();
};
// function to update product data
const updateProduct = (id) => {
  const index = products.findIndex((i) => i.id === id);
  let productsBeforUpdate = [...products];
  let product = productsBeforUpdate.find((item) => item.id === id);
  productName.value = product.name;
  title.value = product.title;
  category.value = product.category;
  count.value = product.count;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  totalPrice.innerHTML = product.totalPrice;
  addBtn.style.display = "none";
  doneBtn.style.display = "block";
  doneBtn.onclick = function () {
    let updatedProduct = {
      id: id,
      name: productName.value,
      title: title.value,
      category: category.value,
      count: +count.value,
      price: +price.value,
      taxes: +taxes.value,
      ads: +ads.value,
      discount: +discount.value,
      totalPrice: +totalPrice.innerHTML,
    };
    productsBeforUpdate[index] = updatedProduct;
    localStorage.setItem("products", JSON.stringify(productsBeforUpdate));
  };
  renderData();
};

// to remove all data
let removedProducts;
if (localStorage.removedProducts != null) {
  removedProducts = JSON.parse(localStorage.removedProducts);
} else {
  removedProducts = [];
}
if (products.length > 0) {
  clearBtn.style.display = "block";
}
clearBtn.addEventListener("click", () => {
  removedProducts = products;
  localStorage.setItem("removedProducts", JSON.stringify(removedProducts));
  localStorage.setItem("products", JSON.stringify([]));
  products = JSON.parse(localStorage.getItem("products"));
  clearBtn.style.display = " none";
  resetBtn.style.display = "block";
  let tester = 60;
  let testerInner = document.getElementById("tester");
  setInterval(() => {
    tester = tester - 1;
    testerInner.innerHTML = tester;
  }, 1000);
  setInterval(() => {
    resetBtn.style.display = "none";
    window.location.reload();
  }, 60000);
});
resetBtn.addEventListener("click", () => {
  localStorage.setItem("products", JSON.stringify(removedProducts));
  products = JSON.parse(localStorage.getItem("products"));
  clearBtn.style.display = "block";
  resetBtn.style.display = " none";
  window.location.reload();
});
// to reload page whene invoice confirmed
window.addEventListener("storage", (e) => {
  if (e.key === "invoiceUpdated" && e.newValue === "true") {
    window.location.reload();
  }
});
