// app.js

document.addEventListener('DOMContentLoaded', () => {
  // Parse data from JSON files loaded as JS variables
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Buttons
  const deleteButton = document.querySelector('#deleteUser');
  const saveButton = document.querySelector('#saveUser');

  // Initialize user list
  generateUserList(userData, stocksData);

  /**
   * Generates the user list
   * @param {*} users
   * @param {*} stocks
   */
  function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // clear previous list

    users.map(({ user, id }) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute('id', id);
      userList.appendChild(listItem);
    });

    // Attach click listener for user selection
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }

  /**
   * Handles user list click
   */
  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(u => u.id == userId);
    if (!user) return;

    populateForm(user);
    renderPortfolio(user, stocks);
  }

  /**
   * Populates the user form
   */
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }

  /**
   * Renders user portfolio
   */
  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // clear old content

    portfolio.map(({ symbol, owned }) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('portfolio-item');

      const symbolEl = document.createElement('p');
      symbolEl.textContent = symbol;

      const ownedEl = document.createElement('p');
      ownedEl.textContent = `Shares: ${owned}`;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.setAttribute('id', symbol);

      wrapper.appendChild(symbolEl);
      wrapper.appendChild(ownedEl);
      wrapper.appendChild(viewBtn);

      portfolioDetails.appendChild(wrapper);
    });

    // Handle "View" clicks via delegation
    portfolioDetails.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }

  /**
   * Displays stock information
   */
  function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return;

    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;

    const logo = document.querySelector('#logo');
    if (logo) {
      logo.src = `logos/${symbol}.svg`;
      logo.alt = stock.name;
    }
  }

  /**
   * Deletes selected user
   */
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(u => u.id == userId);
    if (userIndex > -1) {
      userData.splice(userIndex, 1);
      generateUserList(userData, stocksData);

      // clear UI
      document.querySelector('.portfolio-list').innerHTML = '';
      document.querySelector('#userID').value = '';
      document.querySelector('#firstname').value = '';
      document.querySelector('#lastname').value = '';
      document.querySelector('#address').value = '';
      document.querySelector('#city').value = '';
      document.querySelector('#email').value = '';
    }
  });

  /**
   * Saves edited user info
   */
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;
    if (!id) return;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;
        break;
      }
    }

    generateUserList(userData, stocksData);
  });
});
