import * as Client from '@web3-storage/w3up-client'

let client: Awaited<ReturnType<typeof Client.create>> | null = null

async function getClient() {
  if (!client) {
    client = await Client.create()
    
    // Check if we're already logged in
    const accounts = client.accounts()
    if (Object.keys(accounts).length === 0) {
      // If not logged in, you'll need to log in once
      await client.login('shihongji21@gmail.com')
    }

    // Use the existing space
    const spaces = await client.spaces()
    const nftMarketplaceSpace = spaces.find(space => space.name === 'nft-marketplace')
    
    if (!nftMarketplaceSpace) {
      throw new Error('nft-marketplace space not found')
    }

    await client.setCurrentSpace(nftMarketplaceSpace.did())
  }
  return client
}

export const uploadToIPFS = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload')
  }

  try {
    console.log('Uploading file to IPFS...')
    const client = await getClient()
    // log Client info here
    console.log(client)
    
    // Create an array with a single file to use uploadDirectory
    
    const cid = await client.uploadFile(file)
    console.log('File uploaded successfully')
    
    // Construct the URL to the file within the directory
    return `https://ipfs.io/ipfs/${cid}`
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    if (error instanceof Error) {
      throw new Error(`IPFS upload failed: ${error.message}`)
    } else {
      throw new Error('IPFS upload failed: Unknown error')
    }
  }
}
