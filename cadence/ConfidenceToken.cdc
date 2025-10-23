import FungibleToken from 0x9a0766d93b6608b7

pub contract ConfidenceToken: FungibleToken {

    pub let TokenStoragePath: StoragePath
    pub let TokenReceiverPublicPath: PublicPath
    pub let TokenBalancePublicPath: PublicPath

    pub var totalSupply: UFix64

    // Basic metadata
    pub let name: String
    pub let symbol: String
    pub let decimals: UInt8

    access(account) var minter: &Minter?

    pub event TokensMinted(amount: UFix64, to: Address)
    pub event TokensBurned(amount: UFix64, from: Address)

    pub resource interface Provider {
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault
    }

    pub resource interface Receiver {
        pub fun deposit(from: @FungibleToken.Vault)
    }

    pub resource interface Balance {
        pub fun getBalance(): UFix64
    }

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            pre { amount > 0.0: "Amount must be > 0" }
            self.balance = self.balance - amount
            return <- create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @ConfidenceToken.Vault
            self.balance = self.balance + vault.balance
            destroy vault
        }

        pub fun getBalance(): UFix64 { return self.balance }
    }

    pub resource Minter {
        pub fun mintTo(recipient: &{FungibleToken.Receiver}, amount: UFix64) {
            pre { amount > 0.0: "Amount must be > 0" }
            ConfidenceToken.totalSupply = ConfidenceToken.totalSupply + amount
            recipient.deposit(from: <- create Vault(balance: amount))
        }
    }

    pub fun createEmptyVault(): @Vault {
        return <- create Vault(balance: 0.0)
    }

    pub fun getMinter(): &Minter {
        let m = self.minter
            ?? panic("Minter not set. Deployer must save a minter in account storage.")
        return m
    }

    init() {
        self.TokenStoragePath = /storage/ConfidenceTokenVault
        self.TokenReceiverPublicPath = /public/ConfidenceTokenReceiver
        self.TokenBalancePublicPath = /public/ConfidenceTokenBalance

        self.totalSupply = 0.0
        self.name = "ConfidenceToken"
        self.symbol = "CONF"
        self.decimals = 8

        self.minter = nil

        // Save a minter in account storage owned by the contract account
        self.account.save(<- create Minter(), to: /storage/ConfidenceTokenMinter)
        self.minter = self.account.borrow<&Minter>(from: /storage/ConfidenceTokenMinter)
    }
}
