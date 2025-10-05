import { ethers } from 'ethers'

export async function connectWallet(): Promise<string | null> {
	// Placeholder: integrate with EIP-1193 provider (e.g., MetaMask)
	if ((window as any).ethereum) {
		const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
		return accounts[0] ?? null
	}
	return null
}

export function getProvider(): ethers.BrowserProvider | null {
	return (window as any).ethereum ? new ethers.BrowserProvider((window as any).ethereum) : null
}


