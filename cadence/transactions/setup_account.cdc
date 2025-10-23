import ConfidenceToken from 0xCONF_ADDR
import FungibleToken from 0x9a0766d93b6608b7

transaction {
  prepare(acct: AuthAccount) {
    if acct.borrow<&ConfidenceToken.Vault>(from: ConfidenceToken.TokenStoragePath) == nil {
      acct.save(<- ConfidenceToken.createEmptyVault(), to: ConfidenceToken.TokenStoragePath)
      acct.link<&ConfidenceToken.Vault{FungibleToken.Receiver}>(
        ConfidenceToken.TokenReceiverPublicPath,
        target: ConfidenceToken.TokenStoragePath
      )
      acct.link<&ConfidenceToken.Vault{FungibleToken.Balance}>(
        ConfidenceToken.TokenBalancePublicPath,
        target: ConfidenceToken.TokenStoragePath
      )
    }
  }
}