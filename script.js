const deals = [
  {
    title: "Boat Earbuds 141",
    price: "₹999 (Was ₹2990)",
    image: "https://m.media-amazon.com/images/I/61Kn6lSahIL._SX679_.jpg",
    link: "https://amzn.to/your-affiliate-link"
  },
  {
    title: "Zebronics Mouse & Keyboard Combo",
    price: "₹549 (Was ₹1199)",
    image: "https://m.media-amazon.com/images/I/61LtuGzXeaL._SX679_.jpg",
    link: "https://amzn.to/your-affiliate-link2"
  }
];

const container = document.getElementById("deals-container");

deals.forEach(deal => {
  const card = document.createElement("div");
  card.className = "deal-card";
  card.innerHTML = `
    <img src="${deal.image}" alt="${deal.title}">
    <h3>${deal.title}</h3>
    <p>${deal.price}</p>
    <a href="${deal.link}" target="_blank">Buy Now</a>
  `;
  container.appendChild(card);
});