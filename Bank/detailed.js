/*

    User Flow:

    # - Log in/Sign Up (Account Creation)
    # - Account Management(Withdraw, Deposit, Show Info)


*/
//LocalStorage Functions

function saveData(obj) {
  localStorage.setItem("bank-userdata", JSON.stringify(obj));
  return obj;
}
function getData() {
  return JSON.parse(localStorage.getItem("bank-userdata"));
}

function signUp() {
  let createIntent = confirm(
    `You dont have an account in this Bank. Want to create one?`
  );
  if (!createIntent) {
    alert("Thanks for visiting our bank.");
    return false;
  } else {
    let data, userData, actualDate;

    date = new Date();
    userData = {};
    actualDate = [date.getMonth() + 1, date.getDay(), date.getFullYear()];
    dateString = `${actualDate[0]}/${actualDate[1]}/${actualDate[2]}`;

    userData.nickname = prompt(
      "Please give us your nickname for the account:",
      "John Doe"
    );
    userData.date = prompt(`What date did you were born? mm/dd/yy`, dateString);

    //Date verification
    let userDateArr = userData.date.split("/");

    console.log(userDateArr);
    if (userDateArr.length > 3) {
      alert("Invalid Date, follow the given schema mm/dd/yy");
      signUp();
    }

    let isDateCorrect = checkDate(actualDate, userDateArr);
    if (!isDateCorrect) signUp();

    //Password Verification

    userData.password = prompt("Account Password");

    const isPasswordCorrect = checkPassword(userData.password);
    if (!isPasswordCorrect) signUp();

    //Data Storing Proccess
    userData.balance = 500;
    userData.debt = 0;
    saveData(userData);
    return true;
  }
}
function checkDate(actualDateArr, userDateArr) {
  //Checks if the date follows the mm/dd/yy format, and it also verify certain requirements given
  let userAge = actualDateArr[2] - parseInt(userDateArr[2]);
  let requirements = [
    parseInt(userDateArr[0]) <= 12,
    parseInt(userDateArr[1]) < 31,
    userAge >= 18 && userAge < 78,
  ];
  let requirementsNeeded = [];
  console.log(requirements);
  if (requirements.length == 0) return false;
  requirements.forEach((requirement, index) => {
    if (!requirement) {
      switch (index) {
        case 0: {
          requirementsNeeded.push("Invalid Month, there are only 12 months");
          break;
        }
        case 1: {
          requirementsNeeded.push(
            "Invalid Day, there are only 31 days in a Month"
          );
          break;
        }
        case 2: {
          requirementsNeeded.push(
            `You must have to be between 18 and 75 years old.`
          );
          break;
        }
        default:
          break;
      }
    }
  });
  alert(
    requirementsNeeded.length != 0 ? requirementsNeeded : "Date Registered."
  );
  return requirementsNeeded.length == 0;
}
function checkPassword(password) {
  alert(password.length);
  const requirements = [
    password[0] == password[0].toUpperCase(),
    password.length >= 8 && password.length <= 20,
  ];
  let requirementsNeeded = [];
  requirements.forEach((item, index) => {
    if (!item) {
      switch (index) {
        case 0: {
          requirementsNeeded.push("The first letter must be capital.");
          break;
        }
        case 1: {
          requirementsNeeded.push(
            "The password must be 8 to 20 characters of length"
          );
        }
      }
    }
  });

  alert(
    requirementsNeeded.length != 0 ? requirementsNeeded : "Password Registered"
  );
  return requirementsNeeded.length == 0;
}

function Deposit(user) {
  let moneyToDeposit = parseFloat(
    prompt(`Amount of money to deposit(Balance: ${user.balance}): `)
  );
  if (moneyToDeposit > 10 ** 6) {
    alert("We only accept an amount of money on a deposit, below 1.000.000$");
    return false;
  }else{
    user.balance += moneyToDeposit;
    saveData(user);
    return true;
  }
}

function Withdraw(user) {
  let moneyToWithdraw = parseInt(
    prompt(`Amount of money to Withdraw(Balance: ${user.balance}): `)
  );
  if (moneyToWithdraw > user.balance) {
    alert(
      "You cannot withdraw and Amount of money mayor to the money in your balance"
    );
    return false;
  }else{
    user.balance -= moneyToWithdraw;
    saveData(user);
    return true;
  }
}

function Loan(user) {
  let loanMoney = parseFloat(
    prompt("Amount of moeny to be loaned to you: ", 0.0)
  );
  if (
    !confirm(`${loanMoney}$ will be loaned to you, and you will have a debt of ${
      user.debt + loanMoney
    }$ on your account.
    Are you sure that you want to get the loan?`)
  ) {
    return false;
  } else {
    user.debt += loanMoney;

    saveData(user);
    return true;
  }
}
function payDebts(user) {
  if (user.debt === 0) {
    alert("No debts to pay.");
    return true;
  }
  let toPay = parseFloat(
    prompt(
      `Debt in total: (${user.debt})$ || Balance: (${user.balance}). Amount of money to pay: `
    )
  );

  if (user.debt > toPay && toPay > user.balance) {
    alert("Not enough money to pay debts.");
    return false;
  } else {
    user.balance -= toPay;
    user.debt -= toPay;
    saveData(user);
  }
}

function main() {
  //Funcion that executes parts of the program based on the User Flow
  let run = true;
  while (run) {
    if (!localStorage.getItem("bank-userdata")) {
      signUp();
      break;
    }
    let user = getData;
    let decision = parseInt(
      prompt(`Welcome ${user.nickname}.\nActual Balance:${user.balance}$ || Actual Debt: ${user.debt}$\nAccount Actions(Type a number according to the wanted action)
    \n
    1 - Deposit
    2 - Withdraw
    3 - Loan
    4 - Pay Debts
    5 - Exit\n(developer version)`)
    );
    switch (decision) {
      case 1: {
        Deposit(user);
        break;
      }
      case 2: {
        Withdraw(user);
        break;
      }
      case 3: {
        Loan(user);
        break;
      }
      case 4: {
        payDebts(user);
        break;
      }
      case 5: {
        run = false;
        break;
      }
      //dev tricks
      case 101: {
        //To delete all the data
        alert("Delete all data command.");
        localStorage.clear();
        break;
      }
      case 201: {
        //Reset balance and debts to the original values(balance 500$, debt 0$)
        alert("Reseting balances and debts");
        user.balance = 500;
        user.debt = 0;
        saveData(user);
        break;
      }
      case 911: {
        //Reset to the default settings
        alert("Default Settings");
        user.balance = 500;
        user.debt = 0;
        user.nickname = "John Doe";
        saveData(user);
        break;
      }
      case 301: {
        //To change nickname
        alert("Change Account Name");
        user.nickname = prompt("New nickname");
        saveData(user);
        break;
      }
      case 22: {
        window.location.reload()
      }
      default: {
        break;
      }
    }
  }
}

main();
