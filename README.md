![alt text](image.png)

- [Description](#description)
- [Key Features:](#key-features)
- [Here's how it works:](#heres-how-it-works)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)


## Description

The ESG Web3 Bazaar is an ESG crowdinvesting platform designed to support small and medium-sized enterprises (SMEs) in their sustainability efforts by leveraging blockchain technology.
Built on the Solana blockchain and integrated with the Solana ecosystem, ESG Web3 Bazaar provides a transparent and efficient way for SMEs to secure funding for their environmental, social, and governance (ESG) initiatives.

Our vision reimagines NFT as programmable social institutions, utilizing Solana as a trusted Web3 IDE to develop and deploy these digital entities. Drawing on theories from scholars like Spencer, Durkheim, Veblen, and North, we aim to create a platform where Solana acts as the social layer for distributing ESG institutions and related assets. This integration fosters engagement among Web3 community and Impact investors within the ESG Web3 Bazaar. Ultimately, it democratizes access to sustainable development, enhancing the social and economic impact of Web3 technologies.

## Key Features:

Impact crowdinvesting: SMEs can create, verify, and mint ESG NFT Vouchers and Certificates, representing both future ESG commitments and fulfilled obligations in their sustainability projects.
Verified ESG data on blockchain: Using ESG Reporter and ESG Data Space Adaptor for ESG reporting, along with ESG data notarization on the Solana blockchain, ensures data authenticity and integrity, promoting trust among investors.
Facilitate public goods creation: Provide tools and resources for industrial SMEs to create public goods, driving social, environmental, and economic benefits.
Ensure traceability and trust: Comply with CSRD (Corporate Sustainability Reporting Directive) and CBAM (Carbon Border Adjustment Mechanism) initiatives to guarantee traceability and trust in ESG data.
Web3 community engagement: ESG NFT Vouchers are listed on the SolSea NFT Marketplace, enabling Impact/ESG investors from the Web3 community to support projects that align with their long-term values.
Impact tracking: The platform provides detailed reporting on the progress and impact of funded ESG projects, ensuring transparency and accountability.

Our solution is demonstrated from the perspective of an ESG manager at AgriFi International. The ESG manager is responsible for implementing the company's ESG strategy and preparing, publishing, and sharing the ESG report, which provides disclosures for investors.

AgriFi International ESG manager uses the option of notarizing the ESG report on the Solana blockchain to achieve transparency, traceability and immutability of the reporting process, which consequently leads to trust between potential investors and companies. This is done by creating an NFT on the Solana blockchain, the metadata of which contains a link to the AgriFi International ESG report submitted in IPFS.


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
