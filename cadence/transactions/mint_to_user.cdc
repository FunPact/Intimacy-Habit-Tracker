import ConfidenceToken from 0xCONF_ADDR
import FungibleToken from 0x9a0766d93b6608b7

// This transaction must be signed by the account that holds the ConfidenceToken.Minter resource
// (typically the contract deployer). It will deposit freshly minted tokens into the recipient's vault.

transaction(recipient: Address, amount: UFix64) {
  prepare(signer: AuthAccount) {
    let minter = ConfidenceToken.getMinter()

    let receiverRef = getAccount(recipient)
      .getCapability(ConfidenceToken.TokenReceiverPublicPath)
      .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Recipient does not have a ConfidenceToken receiver set up")

    minter.mintTo(recipient: receiverRef, amount: amount)
  }
}