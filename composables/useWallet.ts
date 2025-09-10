// composables/useWallet.ts
export const useWallet = () => {
    const address = ref('')
    const isConnected = computed(() => !!address.value)

    const connectWallet = async () => {
        // Проверяем есть ли MetaMask
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            try {
                // Запрашиваем подключение аккаунтов
                const accounts = await (window as any).ethereum.request({
                    method: 'eth_requestAccounts'
                })

                if (accounts && accounts.length > 0) {
                    address.value = accounts[0]
                    console.log('Wallet connected:', address.value)
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error)
                // Демо-режим при ошибке
                address.value = '0x742d35Cc6634C893292'
                console.log('Demo mode activated due to error')
            }
        } else {
            // Демо-режим если MetaMask не установлен
            address.value = '0x742d35Cc6634C893292'
            console.log('Demo mode: MetaMask not found, using mock address')
        }
    }

    const disconnectWallet = () => {
        address.value = ''
        console.log('Wallet disconnected')
    }

    // Слушаем изменения аккаунтов в MetaMask
    if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
            address.value = accounts[0] || ''
            console.log('Account changed:', address.value)
        })
    }

    return {
        address,
        isConnected,
        connectWallet,
        disconnectWallet
    }
}