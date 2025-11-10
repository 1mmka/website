// filter auction items by category

const filterButtons = document.querySelectorAll('button[data-category]');
const auctionItems = document.querySelectorAll('.auction-item')

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        auctionItems.forEach(item => {
            if (category == 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none'
            }
        });
    });
});

// take info from auctions.html -> put it in localstorage

document.addEventListener("DOMContentLoaded", () => {
    const auctionItems = document.querySelectorAll(".auction-item");
    const storedAuctions = JSON.parse(localStorage.getItem("auctions")) || {};

    auctionItems.forEach(item => {
        auctionItems.forEach(item => {
            if (storedAuctions[item.dataset.title]) {
                const updatedPrice = storedAuctions[item.dataset.title].price;
                const priceEl = item.querySelector(".card-text");
                priceEl.innerHTML = `Starting bid: $${updatedPrice}<br>Auction ends: ${item.dataset.end}`;
            }
        })

        item.addEventListener("click", () => {
            const itemData = {
                title: item.dataset.title,
                image: item.dataset.image,
                price: item.dataset.price,
                endDate: item.dataset.end,
                description: item.dataset.description
            };

            localStorage.setItem("selectedItem", JSON.stringify(itemData));

            window.location.href = "item.html";
        });
    });
});

// use info from localstorage in item.html

const itemContainer = document.getElementById("item-details");
if (itemContainer) {
    const storedItem = JSON.parse(localStorage.getItem("selectedItem"));
    let currentBid = parseFloat(storedItem.price);

    const renderItem = () => {
        itemContainer.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-6">
                    <img src="${storedItem.image}" alt="${storedItem.title}" class="img-fluid rounded shadow">
                </div>
                <div class="col-md-6">
                    <h2>${storedItem.title}</h2>
                    <p class="text-muted">Current bid: $<span id="currentBid">${currentBid}</span></p>
                    <p>${storedItem.description}</p>
                    <div class="mb-3">
                        <label for="newBid" class="form-label fw-bold">Your Bid ($)</label>
                        <input type="number" id="newBid" class="form-control" min="${currentBid + 1}">
                    </div>
                    <button id="placeBidBtn" class="btn btn-primary">Place Bid</button>
                    <button id="backBtn" class="btn btn-outline-secondary ms-2">Back to Auctions</button>
                    <p id="bidMessage" class="mt-3"></p>
                </div>
            </div>
        `;
    };

    renderItem();


    const currentBidEl = document.getElementById("currentBid");
    const newBidInput = document.getElementById("newBid");
    const bidMessage = document.getElementById("bidMessage");
    const placeBidBtn = document.getElementById("placeBidBtn");

    placeBidBtn.addEventListener("click", () => {
        const newBid = parseFloat(newBidInput.value);
        if (newBid > currentBid) {
            currentBid = newBid;
            currentBidEl.textContent = currentBid;
            bidMessage.textContent = "Bid placed successfully!";
            bidMessage.classList.remove("text-danger");
            bidMessage.classList.add("text-success");

            let allAuctions = localStorage.getItem("auctions");
            if (allAuctions) {
                allAuctions = JSON.parse(allAuctions);
            } else {
                allAuctions = {};
            }
            allAuctions[storedItem.title] = {
                title: storedItem.title,
                image: storedItem.image,
                description: storedItem.description,
                endDate: storedItem.end,
                price: currentBid
            };
            localStorage.setItem("auctions", JSON.stringify(allAuctions));

            let updatedSelectedItem = {
                title: storedItem.title,
                image: storedItem.image,
                description: storedItem.description,
                endDate: storedItem.end,
                price: currentBid
            };
            localStorage.setItem("selectedItem", JSON.stringify(updatedSelectedItem));

            newBidInput.min = currentBid + 1;
            newBidInput.value = "";
        } else {
            bidMessage.textContent = "Your bid must be higher than current bid.";
            bidMessage.classList.remove("text-success");
            bidMessage.classList.add("text-danger");
        }
    });


    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", () => {
        window.location.href = "auctions.html";
    });
}
