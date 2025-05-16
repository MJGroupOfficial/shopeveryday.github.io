const deals = [
  {
    title: "Walkie Talkies for Kids Boys Toys Ages for 4-6 6-8 Long Range 2 Way Radio Outdoor Games Kid Toys for 3 4 5 6 7 8 9 10 3-12 Year Old Boy Birthday Gift Halloween Christmas Stocking Stuffers 2 Pack",
    price: "$23",
    realprice: "$35",
    image: "https://m.media-amazon.com/images/I/71Jd3VJi9cL._AC_SX679_.jpg",
    link: "https://amzn.to/430nziX"
  },
  {
    title: "Zebronics Mouse & Keyboard Combo",
    price: "₹549",
    realprice: "₹1199",
    image: "https://m.media-amazon.com/images/I/61LtuGzXeaL._SX679_.jpg",
    link: "https://amzn.to/your-affiliate-link2"
  }
];

const container = document.getElementById("deals-container");

deals.forEach(deal => {
  const card = document.createElement("div");
  card.className = "deal-card";
  card.innerHTML = `
    <img src="${deal.image}">
    <h3>${deal.title}</h3>
    <p>${deal.price}<span class="realprice">${deal.realprice}</span></p>
    <a href="${deal.link}" target="_blank">Buy Now</a>
  `;
  container.appendChild(card);
});

fetch("https://hooks.zapier.com/hooks/catch/22959440/27i8phb/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    product: "Walkie Talkies for Kids",
    price: "$23",
    realprice: "$35",
    link: "https://amzn.to/430nziX"
  })
});