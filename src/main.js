import "./css/index.css"
import IMask from "imask"

const ccColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C693s47"],
    default: ["black", "gray"],
  }

  ccColor1.setAttribute("fill", colors[type][0])
  ccColor2.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

///////////////////////////

const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
  mask: "000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

const securityDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (append, dynamicMasked) {
    const number = (dynamicMasked.value + append).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

///////////////////////////
const button = document.querySelector("#add-card")
button.addEventListener("click", () => {
  alert("Cartao Adicionado com Sucesso")
})

document.querySelector("form").addEventListener("click", function (event) {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

///////////////////////////
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

///////////////////////////

securityDateMasked.on("accept", () => {
  updateExpirationDate(securityDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExperation = document.querySelector(".cc-extra .value")

  ccExperation.innerText = date.length === 0 ? "02/32" : date
}

///////////////////////////
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number === 0 ? "1234 5678 9012 3456" : number
}
