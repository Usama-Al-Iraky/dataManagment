let productName = document.getElementById("productName");
let title = document.getElementById("title");
let category = document.getElementById("category");
let count = document.getElementById("count");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let totalPrice = document.getElementById("totalPrice");
let addBtn = document.getElementById("add");
let searchInput = document.getElementById("searchInput");
let searchNameBtn = document.getElementById("searchName");
let searchCategoryBtn = document.getElementById("searchCategory");
let tbody = document.getElementById("tbody");
let deleteBtn = document.getElementById("delete");
let doneBtn = document.getElementById("done");
let clearBtn = document.getElementById("clear");
let resetBtn = document.getElementById("reset");
// //////////////////
const gettotalPrice = () => {
  if (price.value !== "" && taxes.value !== "" && ads.value !== "") {
    let result =
      Number(price.value) +
      Number(taxes.value) +
      Number(ads.value) -
      Number(discount.value);
    totalPrice.innerHTML = result;
    totalPrice.innerHTML = result;
  } else {
    totalPrice.innerHTML = 0;
  }
};
// //////////////////////
let products;
if (localStorage.products != null) {
  products = JSON.parse(localStorage.products);
} else {
  products = [];
}
// /////////////
addBtn.addEventListener("click", (e) => {
  createDtat(e);
  clearInputsAfterAdd();
});
// Craete Product Function
const createDtat = (e) => {
  if (
    productName.value !== "" &&
    title.value !== "" &&
    category.value !== "" &&
    price.value !== ""
  ) {
    let date = Date.now();
    let number = Math.floor(Math.random() * 1000);
    let uniqueId = date - number;

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
      totalPrice: Number(totalPrice.innerHTML),
    };
    products = [...products, newProduct];
    localStorage.setItem("products", JSON.stringify(products));
  } else {
    e.preventDefault();
  }
};
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
  window.location.reload();
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
window.addEventListener("storage", (e)=>{
  if (e.key === "invoiceUpdated" && e.newValue === "true") {
    window.location.reload();
  }
});


