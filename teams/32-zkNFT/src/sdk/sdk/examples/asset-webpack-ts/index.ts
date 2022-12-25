// import * as sdk from '../../sdk/sdk';
import * as sdk from 'manta.js';
import sha256, { Hash, HMAC } from "fast-sha256";

const to_private_address = "3UG1BBvv7viqwyg1QKsMVarnSPcdiRQ1aL2vnTgwjWYX";
const amount = "10000000000000000000"; // 10 unit
const half_amount = "5000000000000000000"; // 5 unit
// const ALICE = "dmyjURuBeJwFo4Nvf2GZ8f5E2Asz98JY2d7UcaDykqYm1zpoi";
const ALICE = "5CoMf7zB7mXrC8nbMMWRdrDX2cuhDgikWDXwRNhPjtHVZ7rp";

async function main() {
    // await ft_test("to_private", true);
    // await create_nft_test();
    console.log("END");

    // 7b40a3c7f1f1773c66411be35c557db1142346118c3ded43ded221102b63f73b
    var uint8array = new TextEncoder().encode("89mKUwmNAwXz3QkgnHEdpsmjeCpscBPjvR4dyyhfXqJ1");
    console.log("array:" + uint8array);
    console.log("sha256:" + sha256(uint8array));
    console.log("hex:" + buf2hex(sha256(uint8array)));
}

function buf2hex(buffer: Uint8Array) { // buffer is an ArrayBuffer
    const hexn = Array.from(buffer)
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    return hexn;
  }
  
async function ft_tests() {
    await ft_test("to_private");
    await ft_test("private_transfer");
    await ft_test("to_public");
}

async function ft_tests_only_sign() {
    await ft_test("to_private", true);
    await ft_test("private_transfer", true);
    await ft_test("to_public", true);
}

/// Note: This test requires Manta node with uniques pallet integrated.
const create_nft_test = async () => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net);

    const collectionId = 0;
    const itemId = 0;
    const assetIdNumber = 12;
    const assetId = mantaSdk.numberToAssetIdArray(assetIdNumber);
    const metadata = "https://ipfs.io/";

    //const assetIdResult = await mantaSdk.mintNFTAndSetMetadata(collectionId,itemId,"",metadata);
    //console.log(assetIdResult);

    // const collectionIdRes = await mantaSdk.createCollection();
    // console.log("collection create result:" + JSON.stringify(collectionIdRes));
    // const n = await mantaSdk.assetIdArrayToNumber(collectionIdRes);
    // console.log("nft collection id?:" + n);

    const nft_register = await mantaSdk.mintNFT(collectionId, itemId);
    console.log("mint nft:" + JSON.stringify(nft_register));

    //await mantaSdk.updateNFTMetadata(collectionId,itemId,metadata);

    //const stored_metadata = await mantaSdk.getNFTMetadata(collectionId,itemId);

    //await mantaSdk.publicTransferNFT(assetId,aliceAddress);

    //const all_nfts = await mantaSdk.viewAllNFTsInCollection(collectionId);
    //console.log(all_nfts)
    //const metadata2: any = {
    //    "NonFungible": [collectionId, itemId]
    //}
    //const registeredAssetId = await mantaSdk.api.query.assetManager.registeredAssetId(metadata2);
    //console.log(registeredAssetId.toHuman());
    //const owner_address = await mantaSdk.getNFTOwner(assetId);
    //console.log(owner_address);

}

const ft_test = async (test_type: string, only_sign: boolean = false) => {
    const env = sdk.Environment.Development;
    const net = sdk.Network.Dolphin;
    const mantaSdk = await sdk.init(env,net, ALICE);

    const privateAddress = await mantaSdk.privateAddress();
    console.log("The private address is: ", privateAddress);
    const base58uint8s = new TextEncoder().encode(privateAddress);
    console.log("base58encode address: " + base58uint8s);

    const asset_id_number = 1; // DOL
    const asset_id = mantaSdk.numberToAssetIdArray(asset_id_number);

    await mantaSdk.initalWalletSync();

    const initalPrivateBalance = await mantaSdk.privateBalance(asset_id);
    console.log("The inital private balance is: ", initalPrivateBalance);

    if (test_type === "to_private") {
        if (!only_sign) {
            await mantaSdk.toPrivateSign(asset_id, amount);
        } else {
            const signResult = await mantaSdk.toPrivateSign(asset_id, amount, true);
            console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
            return;
        }
    } else if (test_type === "private_transfer") {
        if (!only_sign) {
            await mantaSdk.privateTransfer(asset_id, half_amount, to_private_address);
        } else {
            const signResult = await mantaSdk.privateTransfer(asset_id, half_amount, to_private_address, true);
            console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
            return;
        }
        
    } else {
        if (!only_sign) {
            await mantaSdk.toPublic(asset_id, half_amount);
        } else {
            const signResult = await mantaSdk.toPublic(asset_id, amount, true);
            console.log("The result of the signing: ", JSON.stringify(signResult.transactions));
            return;
        }
    }

    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        console.log("Syncing with ledger...");
        await mantaSdk.walletSync();
        let newPrivateBalance = await mantaSdk.privateBalance(asset_id);
        console.log("Private Balance after sync: ", newPrivateBalance);

        if (initalPrivateBalance !== newPrivateBalance) {
            console.log("Detected balance change after sync!");
            console.log("Old balance: ", initalPrivateBalance);
            console.log("New balance: ", newPrivateBalance);
            break;
        }
    }
}


main()
