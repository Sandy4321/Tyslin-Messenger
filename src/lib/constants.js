export const EPOCH = Date.UTC(2019, 1, 1, 17, 0, 0, 0)

export const Transactions = {
  SEND: 0,
  SIGNATURE: 1,
  DELEGATE: 2,
  VOTE: 3,
  MULTI: 4,
  DAPP: 5,
  IN_TRANSFER: 6,
  OUT_TRANSFER: 7,
  CHAT_MESSAGE: 8,
  STATE: 9
}

export const Cryptos = {
  TYS: 'TYS',
  ETH: 'ETH',
  BNB: 'BNB',
  DOGE: 'DOGE',
  BZ: 'BZ'
}

export const ERC20 = Object.freeze([
  Cryptos.BNB,
  Cryptos.BZ
])

export const isErc20 = crypto => ERC20.includes(crypto)

/** Number of decimal places for the different crypto amounts */
export const CryptoAmountPrecision = {
  TYS: 2,
  ETH: 6,
  BNB: 6,
  DOGE: 8,
  BZ: 6
}

export const CryptoNaturalUnits = {
  TYS: 8,
  ETH: 18,
  BNB: 18,
  DOGE: 8,
  BZ: 18
}

/** Fees for the misc TYS operations */
export const Fees = {
  /** Storing a value into the KVS */
  KVS: 0.001,
  /** Transfering tokens */
  TYS_TRANSFER: 0.5,
  NOT_TYS_TRANSFER: 0.001
}

/** Regex for detecting of base64 encoded string */
export const base64regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

export const Symbols = {
  CLOCK: String.fromCharCode(0x23f0), // ⏰
  HOURGLASS: String.fromCharCode(0x23f3), // ⏳
  CROSS: String.fromCharCode(0x274c) // ❌
}

export const Delegates = {
  ACTIVE_DELEGATES: 101
}

export const WelcomeMessage = {
  TYSLIN_BOUNTY: 'TYSLIN Bounty',
  TYSLIN_ICO: 'TYSLIN Tokens'
}

/** Gas value for the ETH transfers */
export const ETH_TRANSFER_GAS = 21000

/** Gas value for the ERC-20 transfers */
export const ERC20_TRANSFER_GAS = ETH_TRANSFER_GAS * 10

export default {
  EPOCH,
  Transactions
}

export const UserPasswordArticleLink = 'https://medium.com/@tyslin_blockchain'

export const UserPasswordHashSettings = {
  SALT: 'salt',
  ITERATIONS: 100000,
  KEYLEN: 64,
  DIGEST: 'sha512'
}

export const TransactionStatus = {
  DELIVERED: 'delivered',
  PENDING: 'pending',
  REJECTED: 'rejected',
  INVALID: 'invalid'
}
