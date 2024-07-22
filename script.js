// ENUMS
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
const changeEnum = [
  {
    id: "ONE HUNDRED",
    value: 100
  },
  {
    id: "TWENTY",
    value: 20
  },
  {
    id: "TEN",
    value: 10
  },
  {
    id: "FIVE",
    value: 5
  },
  {
    id: "ONE",
    value: 1
  },
  {
    id: "QUARTER",
    value: 0.25
  },
  {
    id: "DIME",
    value: 0.1
  },
  {
    id: "NICKEL",
    value: 0.05
  },
  {
    id: "PENNY",
    value: 0.01
  },
]

// DOM ELS
const purchaseBtn = document.getElementById("purchase-btn")
const cashEl = document.getElementById("cash")
const changeDueEl = document.getElementById("change-due")
const cidEl = document.getElementById("cid")

// GLOBAL VARS
let price = 3.26
let cash = 350
let isReturningChangeOver = false

// TODO: remove, just for exercice.
function reverseCid() {
  cid.reverse()
}
// END: remove above

// FUNCTIONS
function getAvailableChange() {
  const avilableChange = cid.reduce((acc, curr) => +(curr[1] + acc).toFixed(2), 0)

  return avilableChange
}

function getChange(targetChange) {
  let changeRest = targetChange
  const changeDueArr = []

  // TODO: remove, just for exercice.
  // Also reverse cid from ENUMS
  reverseCid()
  // END: remove above
  
  changeEnum.forEach(({id, value}, index) => {
    const currencyDemandedCount = Math.floor(changeRest / value)
    const currencyDemandedAmount = +(currencyDemandedCount * value).toFixed(2)

    if (currencyDemandedCount === 0 ) return
    if (isReturningChangeOver) return
    
    const currencyAvailableAmount = cid[index][1]
    const currencyAvailableCount = Math.floor(currencyAvailableAmount / value)

    if (currencyAvailableAmount === 0) return

    const isDemandedCountAvailable = currencyAvailableCount - currencyDemandedCount >= 0

    let currencySubstractedAmount
    let currencySubstractedCount
    let currencyLeftAmount
    let currencyLeftCount

    if (isDemandedCountAvailable) {
      currencySubstractedAmount = currencyDemandedAmount
      currencyLeftAmount = currencyAvailableAmount - currencyDemandedAmount

      currencySubstractedCount = currencyDemandedCount
      currencyLeftCount = currencyAvailableCount - currencyDemandedCount      
    } else {
      currencySubstractedCount = currencyAvailableCount
      currencyLeftCount = 0

      currencySubstractedAmount = currencyAvailableAmount
      currencyLeftAmount = 0
    }

    changeRest = +(changeRest - currencySubstractedAmount).toFixed(2)
    isReturningChangeOver = changeRest === 0

    const cidIndex = index
    
    changeDueArr.push({id, cidIndex, currencySubstractedAmount, currencyLeftAmount})
  })

  reverseCid()

  return changeDueArr
}

function removeFromCid(changeDueArr) {
  reverseCid()

  changeDueArr.forEach(({cidIndex, currencyLeftAmount}) => {
    cid[cidIndex][1] = +(currencyLeftAmount).toFixed(2)
  })

  reverseCid()
}

function renderDueAndCid(changeDueArr, status) {
  let dueHtml = `<p>Status: ${status}</p>`
  let cidHtml = ""

  changeDueArr.forEach(el => {
    dueHtml += (`
        <p>${el.id}: $${el.currencySubstractedAmount}</p>
      `)
  })

  cid.forEach(el => {
    cidHtml += (`
        <p>${el[0]}: ${el[1]}</p>
      `)
  })

  changeDueEl.innerHTML = dueHtml
  cidEl.innerHTML = cidHtml
}

function resolveChange(changeDueArr) {
  if (!isReturningChangeOver) {
    changeDueEl.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
    return
  }

  removeFromCid(changeDueArr)
  const availableChange = getAvailableChange()
  
  let status
  if (availableChange === 0) {
    status = "CLOSED"
  } else {
    status = "OPEN"
  }
  renderDueAndCid(changeDueArr, status)
}

function purchaseClick() {
  // TODO: verify validation ("e", ".", other not valid elements, ...)
  if (Number(cashEl.value).isNaN || !cashEl.value) {
    alert("Enter a number")
    return
  }
  
  cash = Number(cashEl.value)
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item")
    return
  }

  if (cash === price) {
    changeDueEl.textContent = "No change due - customer paid with exact cash"
    return
  }

  const availableChange = getAvailableChange()
  const targetChange = +(cash - price).toFixed(2)
  if (availableChange < targetChange) {
    changeDueEl.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`
  }
  const changeDueArr = getChange(targetChange)
  resolveChange(changeDueArr)

  isReturningChangeOver = false
}

// EVENT LISTENERS
purchaseBtn.addEventListener("click", purchaseClick)