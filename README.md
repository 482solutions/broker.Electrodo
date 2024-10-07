![alt text](image.png)

- [Description](#description)
- [Problem statement:](#problem-statement)
- [Solution:](#solution)
- [Decentralized funding (DeFu) and investing (DeIn):](#decentralized-funding-defu-and-investing-dein)
- [Key Features:](#key-features)
- [Key benefits of using Solana:](#key-benefits-of-using-solana)
- [Here's how it works:](#heres-how-it-works)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)


## Description

broker.Electrodo is a Web3 impact investing broker designed to empower industrial small and medium-sized enterprises (SMEs) and impact investors in their sustainability efforts.
Our mission is to democratize both funding for SMEs and investing for investors in ESG initiatives, making it easier and more efficient to manage ESG and carbon-related risks, and trade ESG assets.

The platform facilitates the full cycle of ESG investments, from the issuance of ESG NFTs representing future commitments (ESG NFT Vouchers) and verified achievements (ESG NFT Certificates), to the trading of these assets on the Solana NFT marketplace.

By leveraging Solana Web3 infrastructure, broker.Electrodo seeks to commoditize and platformize the emerging market of ESG assets, such as tokenized Green Bonds, ESG Funds (stocks and bonds), and ESG ETFs, among others.

We aim to co-create sustainable value by enhancing the efficiency of sustainable capital allocation.

## Problem statement:

Industrial SMEs often struggle to secure funding for their sustainability initiatives due to the complex and fragmented nature of the ESG investment landscape. Traditional funding mechanisms are not only cumbersome but also lack the transparency and efficiency needed to attract impact investors. Additionally, there is a significant gap in the accessibility and tradability of ESG assets, which hinders the flow of capital towards sustainable projects

## Solution:

broker.Electrodo is a Web3 impact investing broker designed to empower industrial small and medium-sized enterprises (SMEs) and impact investors in their sustainability efforts.
Our mission is to democratize both funding for SMEs and investing for investors in ESG initiatives, making it easier and more efficient to manage ESG and carbon-related risks, and trade ESG assets.
The platform facilitates the full cycle of ESG investments, from the issuance of ESG digital assets representing future commitments (ESG NFT Vouchers) and verified achievements (ESG NFT Certificates), to the trading of these assets on the Solana NFT marketplace.
By leveraging Solana Web3 infrastructure, broker.Electrodo seeks to commoditize and platformize the emerging market of ESG assets, such as tokenized Green Bonds, ESG Funds (stocks and bonds), and ESG ETFs, among others.

## Decentralized funding (DeFu) and investing (DeIn):

* Empowering SMEs: broker.Electrodo enables SMEs to issue ESG NFT Vouchers and Certificates, representing future commitments and verified achievements in sustainability. This allows SMEs to secure funding directly from impact investors who are looking to support ESG initiatives.
* Engaging investors: Impact investors can easily discover and invest in verified ESG projects through the platform. The use of NFTs ensures transparency and trust, as all assets are backed by verifiable ESG data.


## Key Features:

* Impact crowdinvesting: SMEs can create, verify, and mint ESG NFT Vouchers and Certificates, representing both future ESG commitments and fulfilled obligations in their sustainability projects.
* Verified ESG data on blockchain: Using ESG Reporter and ESG Data Space Adaptor for ESG reporting, along with ESG data notarization on the Solana blockchain, ensures data authenticity and integrity, promoting trust among investors.
* Facilitate public goods creation: Provide tools and resources for industrial SMEs to create public goods, driving social, environmental, and economic benefits.
* Ensure traceability and trust: Comply with CSRD (Corporate Sustainability Reporting Directive) and CBAM (Carbon Border Adjustment Mechanism) initiatives to guarantee traceability and trust in ESG data.
* Web3 community engagement: ESG NFT Vouchers are listed on the SolSea NFT Marketplace, enabling Impact/ESG investors from the Web3 community to support projects that align with their long-term values.
* Impact tracking: The platform provides detailed reporting on the progress and impact of funded ESG projects, ensuring transparency and accountability.

Our solution is demonstrated from the perspective of an ESG manager at AgriFi International. The ESG manager is responsible for implementing the company's ESG strategy and preparing, publishing, and sharing the ESG report, which provides disclosures for investors.

AgriFi International ESG manager uses the option of notarizing the ESG report on the Solana blockchain to achieve transparency, traceability and immutability of the reporting process, which consequently leads to trust between potential investors and companies. This is done by creating an NFT on the Solana blockchain, the metadata of which contains a link to the AgriFi International ESG report submitted in IPFS.

## Key benefits of using Solana:

* Blockchain notarization for ESG data management and verification: Use Solana’s blockchain to notarize ESG data, ensuring that ESG reports and data entries for ESG assets (ESG Vouchers and Certificates) are immutable and transparent.
* Solana for ESG asset management transactions: Utilize Solana blockchain to automate the tokenization, issuance, verification, and trading of ESG NFT Vouchers and Certificates.
* Leveraging Solana NFT marketplace: Use Solana’s NFT marketplace to list and trade ESG NFT Vouchers and Certificates. This integration provides a familiar and trusted platform for investors to discover, purchase, and trade ESG assets.



![alt text](image-1.png)

## Here's how it works:
The manager logs into their Dashboard in Electrodo via Keyrock (ESG Data Space building block, which is responsible for user authorization).
Once a manager has access to their dashboard, he or she can fill in the AgriFi International ESG report with relevant data.
After filling out the report, the manager specifies the beneficiary address in the Solana blockchain in a separate field where they would like to  receive the tokenized report.
The manager clicks the "Tokenize report" button and Electrodo backend creates a PDF file of the report, then sends it to Pinata IPFS and receives a link to the uploaded file.
The backend then mints the NFT. The metadata of the NFT contains a link to the report file.

Now, potential investors can verify the date the report was submitted, the author of the report, and be confident that the report has not been changed.

More inspiration and detailed information: [Whitepaper - ESG Web3 Bazaar](https://docs.google.com/document/d/1o3fJifRXiTcxTKRRCByDDnqjWGa6r2McFUmFKX81v-A/edit?usp=sharing).

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
